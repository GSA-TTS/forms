import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = new cdk.CfnParameter(this, 'Environment', {
      type: 'String',
      description: 'The environment for the stack (e.g., dev, prod)',
    });

    const dockerImageTag = new cdk.CfnParameter(this, 'DockerImageTag', {
      type: 'String',
      description: 'The Docker image tag for the App Runner service',
    });

    // Create a VPC for the RDS instance
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    // Create a security group for the RDS instance
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow postgres access',
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      'Allow postgres access from anywhere'
    );

    // Create the RDS instance
    const rdsInstance = new rds.DatabaseInstance(this, 'RdsInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13_3,
      }),
      vpc,
      securityGroups: [securityGroup],
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      databaseName: `${environment.valueAsString}_database`,
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create an IAM role for the App Runner service
    const appRunnerRole = new iam.Role(this, 'AppRunnerRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppRunnerServicePolicyForECRAccess'
        ),
      ],
    });

    // Create the App Runner service
    const appRunnerService = new apprunner.CfnService(
      this,
      'AppRunnerService',
      {
        sourceConfiguration: {
          imageRepository: {
            imageIdentifier: `ghcr.io/gsa-tts/forms:${dockerImageTag.valueAsString}`,
            imageRepositoryType: 'ECR_PUBLIC',
          },
          authenticationConfiguration: {
            accessRoleArn: appRunnerRole.roleArn,
          },
        },
        serviceName: `${environment.valueAsString}-app-runner-service`,
      }
    );

    // Export a publicly-accessible URL for the App Runner service
    new cdk.CfnOutput(this, 'AppRunnerServiceUrl', {
      value: appRunnerService.attrServiceUrl,
      description: 'The URL for the App Runner service',
    });
  }
}
