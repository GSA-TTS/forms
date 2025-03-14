import * as path from 'path';
import { Construct } from 'constructs';
import { CloudformationStack } from '../../../.gen/providers/aws/cloudformation-stack';
import { AwsProvider } from '../../../.gen/providers/aws/provider';

const relativePath =
  '../../../../aws-cdk/dist/FormsPlatformStack.template.json';

interface FormsCloudformationStackProps {
  dockerImageTag: string;
  ecrRepositoryUrl: string;
  environment: string;
  provider: AwsProvider;
}

export class FormsCloudformationStack extends Construct {
  constructor(
    scope: Construct,
    id: string,
    options: FormsCloudformationStackProps
  ) {
    super(scope, id);
    const { dockerImageTag, ecrRepositoryUrl, environment, provider } = options;

    const absPath = path.resolve(__dirname, relativePath);
    new CloudformationStack(this, id, {
      name: id,
      templateBody: `$\{file("${absPath}")}`,
      provider: provider,
      parameters: {
        environment,
        imageUri: `${ecrRepositoryUrl}:${dockerImageTag}`,
        //imageUri: `ghcr.io/gsa-tts/forms/server-doj:${dockerImageTag}`,
      },
      capabilities: ['CAPABILITY_IAM'],
      timeouts: {
        create: '60m',
        update: '30m',
        delete: '30m',
      },
    });
  }
}
