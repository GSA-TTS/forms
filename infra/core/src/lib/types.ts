import * as z from 'zod';
import { type Result } from '@gsa-tts/forms-common';

export type SecretKey = string;
export type SecretValue = string | undefined;
export type SecretMap = Record<SecretKey, SecretValue>;

const secretMap = z.record(z.string());

export const getSecretMapFromJsonString = (
  jsonString?: string
): Result<SecretMap> => {
  const inputObject = jsonString ? JSON.parse(jsonString) : null;
  const result = secretMap.safeParse(inputObject);
  if (result.success) {
    return {
      success: true,
      data: result.data as SecretMap,
    };
  } else {
    return {
      success: false,
      error: result.error.message,
    };
  }
};

export interface SecretsVault {
  deleteSecret(key: SecretKey): Promise<void>;
  getSecret(key: SecretKey): Promise<SecretValue>;
  getSecrets(keys: SecretKey[]): Promise<SecretMap>;
  setSecret(key: SecretKey, value: SecretValue): Promise<void>;
  setSecrets(secrets: SecretMap): Promise<void>;
  getSecretKeys(): Promise<SecretKey[]>;
}
