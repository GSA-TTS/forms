import type { SecretKey, SecretsVault } from '../lib/types.js';

/**
 * Deletes a secret from the provided secrets vault.
 */
export const deleteSecret = async (vault: SecretsVault, key: SecretKey) => {
  return await vault.deleteSecret(key);
};
