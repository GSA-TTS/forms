import type { SecretMap, SecretsVault } from '../types.js';

/**
 * Provides an in-memory implementation of the SecretsVault interface
 */
export class InMemorySecretsVault implements SecretsVault {
  constructor(private secretMap: SecretMap) {}

  async deleteSecret(key: string) {
    delete this.secretMap[key];
  }

  async getSecret(key: string) {
    return this.secretMap[key];
  }

  async getSecrets(keys: string[]) {
    const entries = keys.map(key => [key, this.secretMap[key]]);
    return Object.fromEntries(entries);
  }

  async setSecret(key: string, value: string) {
    this.secretMap[key] = value;
  }

  async setSecrets(secretMap: SecretMap) {
    this.secretMap = secretMap;
  }

  async getSecretKeys() {
    return Object.keys(this.secretMap);
  }
}
