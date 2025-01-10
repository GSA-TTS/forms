import { type DatabaseContext, dateValue } from '@atj/database';

type Session = {
  id: string;
  expiresAt: Date;
  sessionToken: string;
  userId: string;
};

/**
 * Asynchronously creates a new session in the database.
 *
 * @param {DatabaseContext} ctx - The database context used to manage the connection and provide access to the database engine.
 * @param {Session} session - The session data to be inserted, containing properties such as id, expiration time, session token, and user id.
 */
export const createSession = async (ctx: DatabaseContext, session: Session) => {
  const db = await ctx.getKysely();
  const result = await db.transaction().execute(async trx => {
    return await trx
      .insertInto('sessions')
      .values({
        id: session.id,
        expires_at: dateValue(ctx.engine, session.expiresAt),
        session_token: session.sessionToken,
        user_id: session.userId,
      })
      .execute();
  });
  if (result.length === 0) {
    return null;
  }
  return session.id;
};
