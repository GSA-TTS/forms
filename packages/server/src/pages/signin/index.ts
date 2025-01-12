import type { APIContext } from 'astro';
import { getProviderRedirect } from '@atj/auth';

import { getServerContext } from '../../config/astro.js';

export async function GET(context: APIContext): Promise<Response> {
  const { auth } = await getServerContext(context);

  const redirect = await getProviderRedirect(auth);
  redirect.cookies.forEach(cookie => {
    context.cookies.set(cookie.name, cookie.value, {
      path: '/',
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: cookie.sameSite,
    });
  });

  return context.redirect(redirect.url.href);
}
