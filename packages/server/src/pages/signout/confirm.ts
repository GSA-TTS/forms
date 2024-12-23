import type { APIContext } from 'astro';

import { logOut } from '@atj/auth';
import { getServerContext } from '../../config/astro.js';
import * as routes from '../../routes.js';

export async function POST(context: APIContext): Promise<Response> {
  const { auth, baseUrl } = await getServerContext(context);
  if (!context.locals.session) {
    return new Response('no active session', {
      status: 401,
    });
  }

  const sessionCookie = await logOut(auth, context.locals.session);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return context.redirect(routes.getHomeUrl(baseUrl));
}
