import { S3Backend, TerraformStack } from 'cdktf';

/**
 * Configures an S3 backend for a given Terraform stack to store the Terraform
 * state in an S3 bucket with a specific key and region.
 */
export const withBackend = (stack: TerraformStack, stackPrefix: string) =>
  new S3Backend(stack, {
    bucket: '10x-atj-tfstate',
    key: `${stackPrefix}.tfstate`,
    region: 'us-east-2',
  });
