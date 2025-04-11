import { App, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

import { CloudfoundryProvider } from '../../.gen/providers/cloudfoundry/provider';

import { withBackend } from './backend';
import { CloudGovSpace } from './cloud.gov/space';
import { DataAwsSsmParameter } from '../../.gen/providers/aws/data-aws-ssm-parameter';
import { AwsProvider } from '../../.gen/providers/aws/provider';

/**
 * Register an application stack and translates the IaC to a template format via the `synth` function.
 */
export const registerAppStack = (stackPrefix: string, gitRef: string) => {
  const app = new App();
  const stack = new AppStack(app, stackPrefix, gitRef);
  withBackend(stack, stackPrefix);
  app.synth();
};

/**
 * Represents a Terraform stack designed to deploy and manage resources for the application using AWS and Cloud Foundry providers.
 * This sets up necessary providers and resources specific to the application's deployment needs and handles configuration for the following:
 *
 * - AWS as a provider with a specific region.
 * - Retrieves Cloud Foundry credentials from AWS SSM Parameter Store.
 * - Sets up the Cloud Foundry provider for integration with the Cloud.gov environment.
 * - Instantiates a CloudGovSpace resource with the provided git commit hash identifier.
 */
class AppStack extends TerraformStack {
  constructor(scope: Construct, id: string, gitRef: string) {
    super(scope, id);

    const cfUsername = new DataAwsSsmParameter(
      this,
      `${id}-cloudfoundry-username`,
      {
        name: `/${id}/cloudfoundry/username`,
      }
    );
    const cfPassword = new DataAwsSsmParameter(
      this,
      `${id}-cloudfoundry-password`,
      {
        name: `/${id}/cloudfoundry/password`,
      }
    );

    // Ensure the AWS provider is configured
    new AwsProvider(this, 'AWS', {
      region: 'us-east-2',
    });

    new CloudfoundryProvider(this, 'cloud-gov', {
      apiUrl: 'https://api.fr.cloud.gov',
      appLogsMax: 30,
      user: cfUsername.value,
      password: cfPassword.value,
    });

    new CloudGovSpace(this, id, gitRef);

    /*

    // Create an ECR repository so we can deploy to App Runner via Cloudformation.
    // For now, we'll use the server-doj app image for testing, and rely on it
    // being built and pushed to the ECR repository by the CI/CD pipeline.
    const repo = new AppEcrImageRepository(
      this,
      `${id}-image-server-doj`,
      awsProvider
    );

    // Pass the provider to the FormsCloudformationStack
    new FormsCloudformationStack(this, `${id}-cloudformation-stack`, {
      environment: id,
      ecrRepositoryUrl: repo.repositoryUrl,
      dockerImageTag: gitRef,
      provider: awsProvider,
    });
    */

    //new Docassemble(this, `${id}-docassemble`);
  }
}
