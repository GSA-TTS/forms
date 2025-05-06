import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { type LoginGovOptions } from '@gsa-tts/forms-auth';
import { DatabaseContext } from '@gsa-tts/forms-database';

export type ServerOptions = {
  agencyBranding: boolean;
  title: string;
  db: DatabaseContext;
  loginGovOptions: LoginGovOptions;
  isUserAuthorized: (email: string) => Promise<boolean>;
};

export const createDevServerOptions = async (): Promise<ServerOptions> => {
  const { createFilesystemDatabaseContext } = await import(
    '@gsa-tts/forms-database/context'
  );
  const db = await createFilesystemDatabaseContext(
    join(dirname(fileURLToPath(import.meta.url)), '../main.db')
  );
  return {
    agencyBranding: false,
    title: 'Form Service',
    db,
    loginGovOptions: {
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: import.meta.env.SECRET_LOGIN_GOV_PRIVATE_KEY,
      redirectURI: 'http://localhost:4322/signin/callback',
    },
    isUserAuthorized: async (_email: string) => {
      return true;
    },
  };
};

export const createTestServerOptions = async (): Promise<ServerOptions> => {
  const { createInMemoryDatabaseContext } = await import(
    '@gsa-tts/forms-database/context'
  );
  const db = await createInMemoryDatabaseContext();
  return {
    agencyBranding: false,
    title: 'Form Service - Test suite',
    db,
    loginGovOptions: {
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: import.meta.env.SECRET_LOGIN_GOV_PRIVATE_KEY,
      redirectURI: 'http://localhost:4322/signin/callback',
    },
    isUserAuthorized: async (_email: string) => {
      return true;
    },
  };
};
