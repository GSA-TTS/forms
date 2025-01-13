import { type SecretsVault } from '../lib/types.js';

/**
 * Sets a secret in a specified secrets vault.
 */
export const setSecret = async (
  vault: SecretsVault,
  key: string,
  value: string
) => {
  await vault.setSecret(key, value);
};
