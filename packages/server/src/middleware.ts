import { defineMiddleware } from 'astro/middleware';

import { getAstroAppContext } from './context';
import { processSessionCookie } from '@atj/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { auth } = await getAstroAppContext(context);
  const result = await processSessionCookie(auth, context.request);
  if (!result.success) {
    return new Response(null, { status: result.error.status });
  }
  return next();
});
