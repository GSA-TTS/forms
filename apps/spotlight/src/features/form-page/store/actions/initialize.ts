import { type FormRoute } from '@atj/forms';
import { type FormPageContext } from './index.js';
import { getFormSession } from './get-form-session.js';

export type Initialize = (
  ctx: FormPageContext,
  opts: { formId: string; route: FormRoute }
) => void;

export const initialize: Initialize = (ctx, opts) => {
  // Get the session ID from local storage so we can use it on page reload.
  const sessionId = window.localStorage.getItem('form_session_id') || undefined;
  getFormSession(ctx, {
    formId: opts.formId,
    route: opts.route,
    sessionId,
  });
};
