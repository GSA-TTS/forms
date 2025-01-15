import { randomUUID } from 'crypto';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { createInMemorySecretsVault } from '../lib/index.js';
import { setLoginGovSecrets } from './set-login-gov-secrets.js';

const getTestVault = (vaultData: any) => {
  const result = createInMemorySecretsVault(JSON.stringify(vaultData));
  if (result.success) {
    return result.data;
  } else {
    throw new Error('Error creating in-memory test vault');
  }
};

describe('set-login-gov-secrets command', () => {
  it('sets app secrets when uninitialized', async () => {
    const context = {
      vault: getTestVault({}),
      secretsDir: path.resolve(__dirname, '../../../../infra/secrets'),
      generateLoginGovKey: async () => ({
        publicKey: 'mock public key',
        privateKey: 'mock private key',
      }),
    };
    const appKey = randomUUID();
    const result = await setLoginGovSecrets(context, 'dev', appKey);
    expect(result.preexisting).toEqual(false);
    expect(
      await context.vault.getSecrets(await context.vault.getSecretKeys())
    ).toEqual({
      [`/tts-10x-forms-dev/${appKey}/login.gov/public-key`]: 'mock public key',
      [`/tts-10x-forms-dev/${appKey}/login.gov/private-key`]: 'mock private key',
    });
  });

  it('leaves initialized secrets as-is', async () => {
    const context = {
      vault: getTestVault({}),
      secretsDir: path.resolve(__dirname, '../../../../infra/secrets'),
    };
    const appKey = randomUUID();

    await setLoginGovSecrets(
      {
        ...context,
        generateLoginGovKey: async () => ({
          publicKey: 'mock public key - 1',
          privateKey: 'mock private key - 1',
        }),
      },
      'dev',
      appKey
    );
    const secondResult = await setLoginGovSecrets(
      {
        ...context,
        generateLoginGovKey: async () => ({
          publicKey: 'mock public key - 2',
          privateKey: 'mock private key - 2',
        }),
      },
      'dev',
      appKey
    );

    expect(secondResult.preexisting).toEqual(true);
    expect(
      await context.vault.getSecrets(await context.vault.getSecretKeys())
    ).toEqual({
      [`/tts-10x-forms-dev/${appKey}/login.gov/public-key`]:
        'mock public key - 1',
      [`/tts-10x-forms-dev/${appKey}/login.gov/private-key`]:
        'mock private key - 1',
    });
  });
});
