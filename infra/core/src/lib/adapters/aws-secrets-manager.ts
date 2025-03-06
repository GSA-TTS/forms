import {
  CreateSecretCommand,
  DeleteSecretCommand,
  GetSecretValueCommand,
  ListSecretsCommand,
  ResourceExistsException,
  ResourceNotFoundException,
  SecretsManagerClient,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';

import type {
  SecretKey,
  SecretMap,
  SecretValue,
  SecretsVault,
} from '../types.js';

/**
 * Provides an implementation of the SecretsVault interface leveraging
 * AWS Secrets Manager to manage secrets securely.
 */
export class AWSSecretsManagerSecretsVault implements SecretsVault {
  client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient();
  }

  async deleteSecret(key: SecretKey) {
    try {
      await this.client.send(
        new DeleteSecretCommand({
          SecretId: key,
          ForceDeleteWithoutRecovery: true,
        })
      );
      console.log(`Secret "${key}" deleted successfully.`);
    } catch (error) {
      console.warn('Skipped deleting secret due to error:', error);
    }
  }

  async getSecret(key: SecretKey) {
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: key,
        })
      );
      return response.SecretString || '';
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return undefined;
      }
      console.error('Error getting secret:', error);
      throw error;
    }
  }

  async getSecrets(keys: SecretKey[]) {
    const values: { [key: SecretKey]: SecretValue } = {};

    for (const key of keys) {
      try {
        const value = await this.getSecret(key);
        if (value !== undefined) {
          values[key] = value;
        }
      } catch (error) {
        console.error('Error getting secret:', error);
        throw error;
      }
    }

    return values;
  }

  async setSecret(key: SecretKey, value: SecretValue) {
    try {
      await this.client.send(
        new CreateSecretCommand({
          Name: key,
          SecretString: value,
        })
      );
      console.log(`Secret "${key}" created successfully.`);
    } catch (error) {
      if (error instanceof ResourceExistsException) {
        await this.client.send(
          new UpdateSecretCommand({
            SecretId: key,
            SecretString: value,
          })
        );
        console.log(`Secret "${key}" updated successfully.`);
      } else {
        console.error('Error setting secret:', error);
        throw error;
      }
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
        const response = await this.client.send(
          new ListSecretsCommand({
            NextToken: nextToken,
            MaxResults: 50,
          })
        );
        if (response.SecretList) {
          keys.push(...response.SecretList.map(secret => secret.Name!));
        }
        nextToken = response.NextToken;
      } catch (error) {
        console.error('Error listing secrets:', error);
        throw error;
      }
    } while (nextToken);

    return keys;
  }
}
