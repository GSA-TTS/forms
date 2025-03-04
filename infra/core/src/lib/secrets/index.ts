export const getSecretKeys = (env: string) => [
  `/tts-10x-forms-${env}/cloudfoundry/password`,
  `/tts-10x-forms-${env}/cloudfoundry/username`,
  `/tts-10x-forms-${env}/server-doj/leidos-intranet-quorum/password`,
  `/tts-10x-forms-${env}/server-doj/leidos-intranet-quorum/username`,
  `/tts-10x-forms-${env}/server-doj/login.gov/private-key`,
  `/tts-10x-forms-${env}/server-doj/login.gov/public-key`,
  `/tts-10x-forms-${env}/server-kansas/login.gov/private-key`,
  `/tts-10x-forms-${env}/server-kansas/login.gov/public-key`,
];

const secretPrefix = (env: string) => `/tts-10x-forms-${env}`;

export const getDatabaseSecretKey = (env: string) =>
  `/${secretPrefix(env)}/database`;
