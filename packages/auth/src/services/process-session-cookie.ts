import { verifyRequestOrigin } from 'lucia';

import { type VoidResult } from '@gsa-tts/forms-common';

import { type AuthServiceContext } from './index.js';

/**
 * Processes the session cookie in the context of an authentication request.
 * This function validates the session cookie from the incoming request and
 * sets the appropriate user session in the given context. It checks the
 * request's origin for security and handles session expiration or invalidation
 * by creating blank session cookies when necessary.
 *
 * @param {AuthServiceContext} ctx - The authentication service context used to manage sessions and cookies.
 * @param {Request} request - The incoming HTTP request object containing session and origin information.
 */
export const processSessionCookie = async (
  ctx: AuthServiceContext,
  request: Request
): Promise<VoidResult<{ status: number }>> => {
  if (request.method !== 'GET') {
    const originHeader = request.headers.get('Origin');
    const hostHeader = request.headers.get('Host');
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return {
        success: false,
        error: {
          status: 403,
        },
      };
    }
  }
  const lucia = await ctx.getLucia();

  const sessionId = ctx.getCookie(lucia.sessionCookieName);
  if (!sessionId) {
    ctx.setUserSession({ user: null, session: null });
    return {
      success: true,
    };
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    ctx.setCookie(sessionCookie);
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    ctx.setCookie(sessionCookie);
  }
  ctx.setUserSession({ user, session });
  return {
    success: true,
  };
};
