import { type Result, failure, success } from '@atj/common';

import { type FormServiceContext } from '../context/index.js';
import { type FormRoute } from '../route-data.js';
import {
  type FormSession,
  type FormSessionId,
  createFormSession,
} from '../session.js';

export type GetFormSession = (
  ctx: FormServiceContext,
  opts: {
    formId: string;
    formRoute: FormRoute;
    sessionId?: string;
  }
) => Promise<
  Result<{
    id?: FormSessionId;
    formId: string;
    data: FormSession;
  }>
>;

export const getFormSession: GetFormSession = async (ctx, opts) => {
  const form = await ctx.repository.getForm(opts.formId);
  if (form === null) {
    return failure(`form '${opts.formId} does not exist`);
  }

  // If this request corresponds to an non-existent session, return a new
  // session that is not yet persisted.
  if (opts.sessionId === undefined) {
    const formSession = await createFormSession(form, opts.formRoute);
    return success({
      formId: opts.formId,
      data: formSession,
    });
  }

  const formSession = await ctx.repository.getFormSession(opts.sessionId);
  if (!formSession.success) {
    console.error(
      `Error retrieving form session: ${formSession.error}. Returning new session.`
    );
    const newSession = await createFormSession(form, opts.formRoute);
    return success({
      formId: opts.formId,
      data: newSession,
    });
  }

  return success({
    ...formSession.data,
    data: {
      ...formSession.data.data,
      route: opts.formRoute,
    },
  });
};
