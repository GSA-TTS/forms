import { BaseAuthContext } from './base.js';
import { createAuthRepository } from '../repository/index.js';

export const createE2eAuthContext = async (dbPath: string) => {
  // The login flow is to create fs db context -> feed into base auth context constructor -> feed it into the auth service
  const { createFilesystemDatabaseContext } = await import(
    '@gsa-tts/forms-database/context'
  );
  const dbContext = await createFilesystemDatabaseContext(dbPath);
  const authRepository = createAuthRepository(dbContext);
  const stubLoginProvider = {};
  const stubGetCookie = () => {};
  const stubSetCookie = () => {};
  const stubSetUserSession = () => {};
  const stubIsUserAuthorized = () => Promise.resolve(true);
  return new BaseAuthContext(
    authRepository,
    // Stub a login provider for testing (can be plugged in as needed)
    // @ts-expect-error - Object literal may only specify known properties, but this is a stub.
    stubLoginProvider,
    stubGetCookie,
    stubSetCookie,
    stubSetUserSession,
    stubIsUserAuthorized
  );
};
