import { type SecretsVault } from '../lib/types.js';

/**
 * Retrieves a secret value from the provided secrets vault.
 */
export const getSecret = async (vault: SecretsVault, key: string) => {
  return await vault.getSecret(key);
};
