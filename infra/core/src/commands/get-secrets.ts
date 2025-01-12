import { type SecretsVault } from '../lib/types.js';

/**
 * Retrieves all secrets from the provided secrets vault.
 */
export const getSecrets = async (vault: SecretsVault) => {
  const allKeys = await vault.getSecretKeys();
  return await vault.getSecrets(allKeys);
};
