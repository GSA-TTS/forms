import { randomUUID } from 'crypto';
import { BaseAuthContext } from '../context/base.js';

/**
 * Creates a test database session for the specified user.
 * @param authContext - The authentication context to use for session creation
 * @param userId - The ID of the user for whom to create the session
 * @returns A Promise that resolves to the created session or undefined if creation fails
 */
export async function createTestDbSession(ctx: BaseAuthContext, email: string) {
  const user = ctx.db.createUser(email);
  if (!user) {
    console.log(`Test user created with id: ${email}`);
  }
  const userId = await ctx.db.getUserId(email);

  if (userId) {
    const lucia = await ctx.getLucia();
    const session = await lucia.createSession(userId, {
      session_token: randomUUID(),
    });

    return session;
  }
}
