import { createPostgresDatabaseContext } from '@gsa-tts/forms-database/context';
import { createCustomServer } from './server.js';

const port = process.env.PORT || 4321;

const getCloudGovServerSecrets = () => {
  if (process.env.VCAP_SERVICES === undefined) {
    throw new Error('VCAP_SERVICES not found');
  }
  const services = JSON.parse(process.env.VCAP_SERVICES || '{}');
  return {
    //loginGovClientSecret: services['user-provided']?.credentials?.SECRET_LOGIN_GOV_PRIVATE_KEY,
    dbUri: services['aws-rds'][0].credentials.uri as string,
  };
};

const secrets = getCloudGovServerSecrets();
const db = await createPostgresDatabaseContext(secrets.dbUri, true);
const server = await createCustomServer(db);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
