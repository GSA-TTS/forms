import { Construct } from 'constructs';
import { DataAwsSsmParameter } from '../../.gen/providers/aws/data-aws-ssm-parameter';

/**
 * Retrieves the value of an AWS SSM Parameter Store secret.
 */
export const getSecret = (scope: Construct, name: string) => {
  const parameter = new DataAwsSsmParameter(scope, name, {
    name,
  });
  return parameter.value;
};
