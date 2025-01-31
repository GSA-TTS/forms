import type { APIContext } from 'astro';

import { processProviderCallback } from '@gsa-tts/forms-auth';
import { getServerContext } from '../../config/astro.js';
import * as routes from '../../routes.js';

export async function GET(context: APIContext): Promise<Response> {
  const ctx = await getServerContext(context);
  const result = await processProviderCallback(
    ctx.auth,
    {
      code: context.url.searchParams.get('code'),
      state: context.url.searchParams.get('state'),
    },
    {
      state: context.cookies.get('oauth_state')?.value || null,
      code: context.cookies.get('code_verifier')?.value || null,
      nonce: context.cookies.get('nonce_code')?.value || null,
    }
  );
  if (!result.success) {
    return new Response(result.error.message, {
      status: result.error.status,
    });
  }
  context.cookies.set(
    result.data.sessionCookie.name,
    result.data.sessionCookie.value,
    result.data.sessionCookie.attributes
  );
  console.log('user logged in:', result.data.email);
  return context.redirect(routes.getHomeUrl(ctx.baseUrl));
}
