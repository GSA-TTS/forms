export type DeployEnv = 'dev' | 'staging';

const getPathPrefix = (env: DeployEnv) => `/tts-10x-atj-${env}`;

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
