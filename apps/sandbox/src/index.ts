import { createPostgresDatabaseContext } from '@gsa-tts/forms-database/context';
import { getAWSSecretsManagerVault } from '@gsa-tts/forms-infra-core';

import { createCustomServer } from './server.js';

const port = process.env.PORT || 4321;

const getCloudGovServerSecrets = () => {
  if (process.env.VCAP_SERVICES === undefined) {
    return;
  }
  const services = JSON.parse(process.env.VCAP_SERVICES || '{}');
  return {
    //loginGovClientSecret: services['user-provided']?.credentials?.SECRET_LOGIN_GOV_PRIVATE_KEY,
    dbUri: services['aws-rds'][0].credentials.uri as string,
  };
};

const getAppRunnerSecrets = async () => {
  const secrets = {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbSecretArn: process.env.DB_SECRET_ARN,
  }
  if (secrets.dbHost === undefined || secrets.dbPort === undefined || secrets.dbName === undefined || secrets.dbSecretArn === undefined) {
    return;
  }

  const vault = getAWSSecretsManagerVault();
  const dbSecret = await vault.getSecret(secrets.dbSecretArn);
  if (dbSecret === undefined) {
    console.error('Error getting secret:', secrets.dbSecretArn);
    return;
  }
  const secret = JSON.parse(dbSecret);
  return {
    dbUri: `postgresql://${secret.username}:${secret.password}@${secret.dbHost}:${secret.dbPort}/${secret.dbName}`
  };
};

const secrets = getCloudGovServerSecrets() || (await getAppRunnerSecrets());
if (secrets === undefined) {
  console.error('Error getting secrets');
  process.exit(1);
}

const db = await createPostgresDatabaseContext(secrets.dbUri, true);
const server = await createCustomServer(db);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
