import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';

import { type SecretsVault } from '../lib/types.js';
import { type DeployEnv, getAppLoginGovKeys } from '../values.js';

const execPromise = promisify(exec);

type GenerateLoginGovKey = (
  privateKeyPath: string,
  publicKeyPath: string
) => Promise<{
  publicKey: string;
  privateKey: string;
}>;

type Context = {
  vault: SecretsVault;
  secretsDir: string;
  generateLoginGovKey?: GenerateLoginGovKey;
};

/**
 * Sets or retrieves Login.gov secrets for the given application key. It retrieves and returns the
 * existing key pair or generates, stores, and returns new key pair if one didn't exist previously.
 */
export const setLoginGovSecrets = async (
  ctx: Context,
  env: DeployEnv,
  appKey: string
) => {
  const loginKeys = getAppLoginGovKeys(env, appKey);

  // If the keypair is already set, do nothing and return it.
  const existingPublicKey = await ctx.vault.getSecret(loginKeys.publicKey);
  const existingPrivateKey = await ctx.vault.getSecret(loginKeys.privateKey);
  if (existingPublicKey && existingPrivateKey) {
    return {
      preexisting: true,
      publicKey: existingPublicKey,
      privateKey: existingPrivateKey,
    };
  }

  // Generate a new keypair and return it.
  const myGenerateKey = ctx.generateLoginGovKey || generateLoginGovKey;
  const { publicKey, privateKey } = await myGenerateKey(
    loginGovPrivateKeyPath(ctx.secretsDir, appKey),
    loginGovPublicKeyPath(ctx.secretsDir, appKey)
  );
  await ctx.vault.setSecret(loginKeys.privateKey, privateKey);
  await ctx.vault.setSecret(loginKeys.publicKey, publicKey);
  return {
    preexisting: false,
    publicKey,
    privateKey,
  };
};

/**
 * Gets the file path for the Login.gov public key (`.pem`) file.
 */
const loginGovPublicKeyPath = (secretsDir: string, appKey: string) =>
  `${secretsDir}/login-gov-${appKey}-key.pem`;

/**
 * Gets the file path for the Login.gov private key certificate (`.pem`) file.
 */
const loginGovPrivateKeyPath = (secretsDir: string, appKey: string) =>
  `${secretsDir}/login-gov-${appKey}-cert.pem`;

/**
 * Generates a public-private key pair for Login.gov using OpenSSL.
 */
const generateLoginGovKey: GenerateLoginGovKey = async (
  privateKeyPath: string,
  publicKeyPath: string
) => {
  const shellCommand = `openssl req \
    -nodes \
    -x509 \
    -days 365 \
    -newkey rsa:2048 \
    -new \
    -subj "/C=US/O=General Services Administration/OU=TTS/CN=gsa.gov" \
    -keyout ${privateKeyPath} \
    -out ${publicKeyPath}`;
  await execPromise(shellCommand);
  return {
    publicKey: (await fs.readFile(publicKeyPath)).toString(),
    privateKey: (await fs.readFile(privateKeyPath)).toString(),
  };
};
