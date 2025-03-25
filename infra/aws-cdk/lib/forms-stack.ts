import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as changeCase from 'change-case';
import { Duration } from 'aws-cdk-lib';

import { getDatabaseSecretKey } from '@gsa-tts/forms-infra-core';

export class FormsPlatformStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cloudformation configuration parameters
    const environment = new cdk.CfnParameter(this, 'environment', {
      type: 'String',
      description: 'The environment for the stack (e.g., dev, prod)',
      allowedPattern: '.+',
    });
    const repositoryArn = new cdk.CfnParameter(this, 'repositoryArn', {
      type: 'String',
      description: 'The ARN for the ECR repository',
      allowedPattern: '.+',
    });
    const repositoryName = new cdk.CfnParameter(this, 'repositoryName', {
      type: 'String',
      description: 'The ECR repository name for the deploy image',
      allowedPattern: '.+',
    });
    const tagOrDigest = new cdk.CfnParameter(this, 'tagOrDigest', {
      type: 'String',
      description: 'The ECR image tag or digest to deploy',
      allowedPattern: '.+',
    });

    // Networking configuration
    const vpc = new ec2.Vpc(this, `${id}-vpc`, {
      maxAzs: 2,
    });

    // Get the default security group
    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'DefaultSecurityGroup',
      vpc.vpcDefaultSecurityGroup
    );

    // Security group for RDS
    const rdsSecurityGroup = new ec2.SecurityGroup(this, `${id}-rds-sg`, {
      vpc,
      description: 'Allow postgres access',
      allowAllOutbound: true,
    });

    // Security group for App Runner
    const appRunnerSecurityGroup = new ec2.SecurityGroup(
      this,
      `${id}-apprunner-sg`,
      {
        vpc,
        description: 'Security group for App Runner service',
        allowAllOutbound: true,
      }
    );

    new ec2.InterfaceVpcEndpoint(this, 'SecretsManagerVPCEndpoint', {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroups: [appRunnerSecurityGroup],
    });

    // Allow App Runner security group to access RDS security group
    /*
    rdsSecurityGroup.addIngressRule(
      appRunnerSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow postgres access from App Runner'
    );
    */
    new ec2.CfnSecurityGroupIngress(this, `${id}-apprunner-rds-ingress`, {
      groupId: rdsSecurityGroup.securityGroupId,
      sourceSecurityGroupId: appRunnerSecurityGroup.securityGroupId,
      ipProtocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      description: 'Allow postgres access from App Runner',
    });

    const dbSecret = new secretsmanager.Secret(this, `${id}-rds-secret`, {
      secretName: getDatabaseSecretKey(environment.valueAsString),
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludeCharacters: '/@" ',
      },
    });

    // RDS database configuration
    const databaseName = `${changeCase.snakeCase(environment.valueAsString)}_database`;
    const rdsInstance = new rds.DatabaseInstance(this, `${id}-db`, {
      allocatedStorage: 20,
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      maxAllocatedStorage: 100,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      securityGroups: [rdsSecurityGroup],
      vpc,
    });

    const appRunnerRole = new iam.Role(this, `${id}-iam-role-app-runner`, {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    });
    dbSecret.grantRead(appRunnerRole);

    const appRunnerService = new apprunner.Service(this, `${id}-app-runner`, {
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 4321,
          environmentVariables: {
            DB_HOST: rdsInstance.dbInstanceEndpointAddress,
            DB_PORT: rdsInstance.dbInstanceEndpointPort,
            DB_NAME: 'postgres',
          },
          environmentSecrets: {
            DB_SECRET_ARN: apprunner.Secret.fromSecretsManager(dbSecret),
          },
        },
        repository: ecr.Repository.fromRepositoryAttributes(
          this,
          `${id}-repo`,
          {
            repositoryName: repositoryName.valueAsString,
            repositoryArn: repositoryArn.valueAsString,
          }
        ),
        tagOrDigest: tagOrDigest.valueAsString,
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: Duration.seconds(10),
        path: '/',
        timeout: Duration.seconds(10),
        unhealthyThreshold: 10,
      }),
      instanceRole: appRunnerRole,
      observabilityConfiguration: new apprunner.ObservabilityConfiguration(
        this,
        `${id}-observability-configuration`,
        {
          observabilityConfigurationName: `${id}-obs-conf`,
          traceConfigurationVendor: apprunner.TraceConfigurationVendor.AWSXRAY,
        }
      ),
      serviceName: `${environment.valueAsString}-app-runner-service`,
      vpcConnector: new apprunner.VpcConnector(this, `${id}-vpc-connector`, {
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
        securityGroups: [appRunnerSecurityGroup],
        vpcConnectorName: `${id}-vpc-connector`,
      }),
    });

    // Create an ECR repository for the App Runner service's images.
    /*
    const ecrRepository = new ecr.Repository(this, `${id}-ecr-repository`, {
      repositoryName: `forms-platform-${environment.valueAsString}`,
    });
    ecrRepository.grantPull(appRunnerService);
    */

    // Export a publicly-accessible URL for the App Runner service≥
    /*
    new cdk.CfnOutput(this, 'FormsPlatformUrl', {
      value: appRunnerService.serviceUrl,
      description: 'URL for the Forms Platform',
    });
    */

    // Export a publicly-accessible URL for the App Runner service≥
    /*
    new cdk.CfnOutput(this, 'FormsPlatformEcrUrl', {
      value: ecrRepository.repositoryUri,
      description: 'ECR repository URI for the Forms Platform',
    });
    */
  }
}
