import {
  DeleteParameterCommand,
  DescribeParametersCommand,
  DescribeParametersCommandOutput,
  GetParameterCommand,
  GetParametersCommand,
  ParameterNotFound,
  PutParameterCommand,
  SSMClient,
} from '@aws-sdk/client-ssm';

import type {
  SecretKey,
  SecretMap,
  SecretValue,
  SecretsVault,
} from '../types.js';

/**
 * Provides an implementation of the SecretsVault interface leveraging
 * AWS Systems Manager Parameter Store to manage secrets securely.
 */
export class AWSParameterStoreSecretsVault implements SecretsVault {
  client: SSMClient;

  constructor() {
    this.client = new SSMClient();
  }

  async deleteSecret(key: SecretKey) {
    try {
      await this.client.send(
        new DeleteParameterCommand({
          Name: key,
        })
      );
      console.log(`Secret "${key}" deleted successfully.`);
    } catch (error) {
      console.warn('Skipped deleting parameter due to error:', error);
    }
  }

  async getSecret(key: SecretKey) {
    try {
      const response = await this.client.send(
        new GetParameterCommand({
          Name: key,
          WithDecryption: true,
        })
      );
      return response.Parameter?.Value || '';
    } catch (error) {
      if (error instanceof ParameterNotFound) {
        return undefined;
      }
      console.error('Error getting parameter:', error);
      throw error;
    }
  }

  async getSecrets(keys: SecretKey[]) {
    try {
      const response = await this.client.send(
        new GetParametersCommand({
          Names: keys,
          WithDecryption: true,
        })
      );
      const values: { [key: SecretKey]: SecretValue } = {};
      if (response.Parameters) {
        for (const parameter of response.Parameters) {
          if (parameter.Name && parameter.Value) {
            values[parameter.Name] = parameter.Value;
          }
        }
      }
      return values;
    } catch (error) {
      console.error('Error getting parameters:', error);
      throw error;
    }
  }

  async setSecret(key: SecretKey, value: SecretValue) {
    try {
      await this.client.send(
        new PutParameterCommand({
          Name: key,
          Value: value,
          Type: 'SecureString',
          Overwrite: true,
        })
      );
      console.log(`Secret "${key}" set successfully.`);
    } catch (error) {
      console.error('Error setting parameter:', error);
      throw error;
    }
  }

  async setSecrets(secrets: SecretMap) {
    const promises = Object.entries(secrets).map(([key, value]) =>
      this.setSecret(key, value)
    );
    await Promise.all(promises);
  }

  async getSecretKeys() {
    let keys: string[] = [];
    let nextToken: string | undefined;
    do {
      try {
        const response: DescribeParametersCommandOutput =
          await this.client.send(
            new DescribeParametersCommand({
              NextToken: nextToken,
              MaxResults: 50,
            })
          );
        if (response.Parameters) {
          keys.push(...response.Parameters.map(param => param.Name!));
        }
        nextToken = response.NextToken;
      } catch (error) {
        console.error('Error describing parameters:', error);
        throw error;
      }
    } while (nextToken);

    return keys;
  }
}
