import { randomUUID } from 'crypto';
import { BaseAuthContext } from '../context/base.js';
import { UserId } from 'lucia';

export async function createTestDbSession(
  userId: UserId,
  authContext: BaseAuthContext
) {
  if (userId) {
    const lucia = await authContext.getLucia();
    const session = await lucia.createSession(userId, {
      session_token: randomUUID(),
    });

    return session;
  }
}
