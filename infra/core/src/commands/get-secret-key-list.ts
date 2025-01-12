import { type SecretsVault } from '../lib/types.js';

/**
 * Retrieves a list of secret keys from the provided secrets vault.
 */
export const getSecretKeyList = async (vault: SecretsVault) => {
  return await vault.getSecretKeys();
};
