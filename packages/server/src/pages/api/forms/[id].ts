import type { APIRoute } from 'astro';
import { getServerContext } from '../../../config/astro.js';

export const GET: APIRoute = async context => {
  const ctx = await getServerContext(context);
  const formId = context.params.id;
  if (formId === undefined) {
    return new Response('Form ID is required', {
      status: 400,
    });
  }

  const result = await ctx.formService.getForm(formId);
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: result.success ? 200 : result.error.status,
  });
};

export const DELETE: APIRoute = async context => {
  const ctx = await getServerContext(context);
  const formId = context.params.id;
  if (formId === undefined) {
    return new Response('Form ID is required', {
      status: 400,
    });
  }

  const result = await ctx.formService.deleteForm(formId);
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: result.success ? 200 : result.error.status,
  });
};

export const PUT: APIRoute = async context => {
  const ctx = await getServerContext(context);

  const formId = context.params.id;
  if (formId === undefined) {
    return new Response('Form ID is required', {
      status: 400,
    });
  }

  const form = await context.request.json();
  const result = await ctx.formService.saveForm(formId, form);
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: result.success ? 200 : result.error.status,
  });
};
