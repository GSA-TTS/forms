import { type User, type Session } from 'lucia';

export { BaseAuthContext } from './context/base.js';
import { type LoginGovOptions, LoginGov } from './provider.js';
export { type LoginGovOptions, LoginGov };
export {
  type AuthRepository,
  createAuthRepository,
} from './repository/index.js';
export { getProviderRedirect } from './services/get-provider-redirect.js';
export { logOut } from './services/logout.js';
export { processProviderCallback } from './services/process-provider-callback.js';
export { processSessionCookie } from './services/process-session-cookie.js';
export { createTestDbSession } from './services/create-test-db-session.js';
export { User, Session };
export { type AuthServiceContext } from './services/index.js';

export type UserSession = {
  user: User | null;
  session: Session | null;
};
