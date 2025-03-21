import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class FormsEcrRepository extends Construct {
  public readonly repository: ecr.IRepository;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const repositoryName = 'forms-platform';
    try {
      // Try to import an existing repository
      this.repository = ecr.Repository.fromRepositoryName(
        this,
        'FormsPlatformEcrRepository',
        repositoryName
      );
      console.log(`Using existing ECR repository: ${repositoryName}`);
    } catch (error) {
      this.repository = new ecr.Repository(this, 'FormsPlatformEcrRepository', {
        repositoryName,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      });
      console.log(`Created new ECR repository: ${repositoryName}`);
    }

    // Grant AppRunner read access to the ECR repository
    console.log('Granting AppRunner read access to the ECR repository');
    this.repository.grantPull(new iam.ServicePrincipal('build.apprunner.amazonaws.com'));
  }
}
