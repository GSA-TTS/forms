import { defineMiddleware } from 'astro/middleware';

import { processSessionCookie } from '@gsa-tts/forms-auth';

import { getServerContext } from './config/astro.js';

export const onRequest = defineMiddleware(async (context, next) => {
  const { auth } = await getServerContext(context);
  const result = await processSessionCookie(auth, context.request);
  if (!result.success) {
    return new Response(null, { status: result.error.status });
  }
  return next();
});
