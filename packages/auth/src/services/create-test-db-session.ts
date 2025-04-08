import { randomUUID } from 'crypto';
import { BaseAuthContext } from '../context/base.js';
import { UserId } from 'lucia';

/**
 * Creates a test database session for the specified user.
 * @param userId - The ID of the user for whom to create the session
 * @param authContext - The authentication context to use for session creation
 * @returns A Promise that resolves to the created session or undefined if creation fails
 */
export async function createTestDbSession(
  authContext: BaseAuthContext,
  userId: UserId
) {
  if (userId) {
    const lucia = await authContext.getLucia();
    const session = await lucia.createSession(userId, {
      session_token: randomUUID(),
    });

    return session;
  }
}
