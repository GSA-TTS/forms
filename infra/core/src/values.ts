export type DeployEnv = 'dev' | 'demo';

const getPathPrefix = (env: DeployEnv) => `/tts-10x-forms-${env}`;

/**
 * Generates an object containing the paths for private/public keys pairs
 * associated with login.gov for an application in the specified
 * deployment environment.
 */
export const getAppLoginGovKeys = (env: DeployEnv, appKey: string) => {
  const prefix = getPathPrefix(env);
  return {
    privateKey: `${prefix}/${appKey}/login.gov/private-key`,
    publicKey: `${prefix}/${appKey}/login.gov/public-key`,
  };
};
