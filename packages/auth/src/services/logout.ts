import { type Session } from 'lucia';
import { type AuthServiceContext } from './index.js';

/**
 * Logs out a user by invalidating their existing session and creating a blank session cookie.
 *
 * @param {AuthServiceContext} ctx - The authentication service context.
 * @param {Session} session - The session object to be invalidated.
 */
export const logOut = async (ctx: AuthServiceContext, session: Session) => {
  const lucia = await ctx.getLucia();
  await lucia.invalidateSession(session.id);
  return lucia.createBlankSessionCookie();
};
