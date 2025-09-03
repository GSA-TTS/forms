import { type DatabaseContext } from '@gsa-tts/forms-database';
import { createServer } from '@gsa-tts/forms-server';

export const createCustomServer = async (db: DatabaseContext): Promise<any> => {
  return createServer({
    agencyBranding: false,
    title: 'Form Service Sandbox',
    db,
    loginGovOptions: {
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: '', // secrets.loginGovClientSecret,
    },
    isUserAuthorized: async (email: string) => {
      return email.endsWith('.gov');
    },
  });
};
