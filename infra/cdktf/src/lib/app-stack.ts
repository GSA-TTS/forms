import { App, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

import { AwsProvider } from '../../.gen/providers/aws/provider';
import { CloudfoundryProvider } from '../../.gen/providers/cloudfoundry/provider';

import { withBackend } from './backend';
import { CloudGovSpace } from './cloud.gov/space';
import { DataAwsSsmParameter } from '../../.gen/providers/aws/data-aws-ssm-parameter';

/**
 * Register an application stack and translates the IaC to a template format via the `synth` function.
 */
export const registerAppStack = (
  stackPrefix: string,
  gitCommitHash: string
) => {
  const app = new App();
  const stack = new AppStack(app, stackPrefix, gitCommitHash);
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
  constructor(scope: Construct, id: string, gitCommitHash: string) {
    super(scope, id);

    new AwsProvider(this, 'AWS', {
      region: 'us-east-2',
    });

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

    new CloudfoundryProvider(this, 'cloud-gov', {
      apiUrl: 'https://api.fr.cloud.gov',
      appLogsMax: 30,
      user: cfUsername.value,
      password: cfPassword.value,
    });

    new CloudGovSpace(this, id, gitCommitHash);

    //new Docassemble(this, `${id}-docassemble`);
    //new FormService(this, `${id}-rest-api`);
  }
}
