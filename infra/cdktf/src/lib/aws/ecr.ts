import { Construct } from 'constructs';
import type { AwsProvider } from '../../../.gen/providers/aws/provider';
import { EcrRepository } from '../../../.gen/providers/aws/ecr-repository';

export class AppEcrImageRepository extends EcrRepository {
  constructor(scope: Construct, id: string, provider: AwsProvider) {
    super(scope, id, {
      name: id,
      imageTagMutability: 'MUTABLE',
      imageScanningConfiguration: {
        scanOnPush: true,
      },
      provider,
    });
  }
}
