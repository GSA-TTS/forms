import { describe, expect, it } from 'vitest';

import { setSecrets } from './set-secrets.js';
import { createInMemorySecretsVault } from '../lib/index.js';

const getTestVault = (vaultData: any) => {
  const result = createInMemorySecretsVault(JSON.stringify(vaultData));
  if (result.success) {
    return result.data;
  } else {
    throw new Error('Error creating in-memory test vault');
  }
};

describe('set-secret command', () => {
  it('sets secret values', async () => {
    const vault = getTestVault({
      'secret-key-1': 'value-1',
    });
    await setSecrets(vault, {
      'secret-key-1': 'secret-value1-updated',
      'secret-key-2': 'secret-value2-updated',
    });
    expect(await vault.getSecrets(await vault.getSecretKeys())).toEqual({
      'secret-key-1': 'secret-value1-updated',
      'secret-key-2': 'secret-value2-updated',
    });
  });
});
