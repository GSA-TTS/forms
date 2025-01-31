import { promises as fs } from 'fs';

import * as r from '@gsa-tts/forms-common';

import { AWSParameterStoreSecretsVault } from './aws-param-store.js';
import { getSecretMapFromJsonString, type SecretsVault } from '../types.js';
import { InMemorySecretsVault } from './in-memory.js';

/**
 * Returns either a production vault or an in-memory vault initialized with the
 * contents of a JSON file.
 * @param jsonFilePath Optional path to a local JSON file that will stand-in
 * for a secrets vault.
 * @returns In-memory or production vault.
 */
export const getSecretsVault = async (jsonFilePath?: string) => {
  if (jsonFilePath) {
    const maybeJsonString = (await fs.readFile(jsonFilePath)).toString();
    const result = createInMemorySecretsVault(maybeJsonString);
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } else {
    return getAWSSecretsVault();
  }
};

export const getAWSSecretsVault = (): SecretsVault => {
  return new AWSParameterStoreSecretsVault();
};

export const createInMemorySecretsVault = (
  jsonString?: any
): r.Result<SecretsVault> => {
  const result = getSecretMapFromJsonString(jsonString);
  if (result.success) {
    return r.success(new InMemorySecretsVault(result.data));
  } else {
    return r.failure(result.error);
  }
};
