import { Cookie, Lucia } from 'lucia';
import { vi } from 'vitest';

import { createInMemoryDatabaseContext } from '@gsa-tts/forms-database/context';

import { AuthServiceContext, UserSession } from '../index.js';
import { createSqliteLuciaAdapter } from '../lucia.js';
import { LoginGov } from '../provider.js';
import {
  createAuthRepository,
  type AuthRepository,
} from '../repository/index.js';

type Options = {
  getCookie: (name: string) => string | undefined;
  setCookie: (cookie: Cookie) => void;
  setUserSession: (userSession: UserSession) => void;
  isUserAuthorized: (email: string) => Promise<boolean>;
};

export const createTestAuthContext = async (opts?: Partial<Options>) => {
  const options: Options = {
    getCookie: opts?.getCookie || vi.fn(),
    setCookie: opts?.setCookie || vi.fn(),
    setUserSession: opts?.setUserSession || vi.fn(),
    isUserAuthorized: opts?.isUserAuthorized || vi.fn(async () => true),
  };
  const dbContext = await createInMemoryDatabaseContext();
  const authRepo = createAuthRepository(dbContext);
  return new TestAuthContext(
    authRepo,
    new LoginGov({
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: 'super-secret',
      redirectURI: 'http://www.10x.gov/a2j/signin/callback',
    }),
    options.getCookie,
    options.setCookie,
    options.setUserSession,
    options.isUserAuthorized
  );
};

export class TestAuthContext implements AuthServiceContext {
  private lucia?: Lucia;

  constructor(
    public db: AuthRepository,
    public provider: LoginGov,
    public getCookie: (name: string) => string | undefined,
    public setCookie: (cookie: Cookie) => void,
    public setUserSession: (userSession: UserSession) => void,
    public isUserAuthorized: (email: string) => Promise<boolean>
  ) {}

  async getLucia() {
    const sqlite3 = await (this.db.getContext() as any).getSqlite3();
    const sqlite3Adapter = createSqliteLuciaAdapter(sqlite3);
    if (!this.lucia) {
      this.lucia = new Lucia(sqlite3Adapter, {
        sessionCookie: {
          attributes: {
            secure: false,
          },
        },
        getUserAttributes: attributes => {
          return {
            email: attributes.email,
          };
        },
      });
    }
    return this.lucia;
  }
}
