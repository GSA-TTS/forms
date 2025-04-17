import { type DatabaseContext } from '@gsa-tts/forms-database';
import { createServer } from '@gsa-tts/forms-server';

export const createCustomServer = async (db: DatabaseContext): Promise<any> => {
  return createServer({
    title: 'DOJ Form Service',
    db,
    loginGovOptions: {
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: '', // secrets.loginGovClientSecret,
    },
    isUserAuthorized: async (email: string) => {
      return [
        // 10x team members
        'daniel.naab@gsa.gov',
        'jim.moffet@gsa.gov',
        'ethan.gardner@gsa.gov',
        'khayal.alasgarov@gsa.gov',
        'marco.pineda@gsa.gov',
        'jona.decker@gsa.gov',
        'beatrice.mercier@gsa.gov',
        'samantha.noor@gsa.gov',
        'emily.herrick@gsa.gov',
        'nichole.aquino@gsa.gov',
        'senai.mesfin@gsa.gov',
        // DOJ test users
        'deserene.h.worsley@usdoj.gov',
        'jordan.pendergrass@usdoj.gov',
        'kira.gillespie@usdoj.gov',
        'kameron.c.thomas@usdoj.gov',
        'abiel.m.ogbe@usdoj.gov',
        'kelley.c.huber@usdoj.gov',
      ].includes(email.toLowerCase());
    },
  });
};
