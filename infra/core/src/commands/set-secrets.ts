import { type SecretsVault } from '../lib/types.js';

/**
 * Sets a secret in a specified secrets vault.
 */
export const setSecrets = async (
  vault: SecretsVault,
  secrets: Record<string, string>
) => {
  for (const key in secrets) {
    await vault.setSecret(key, secrets[key]);
  }
};
