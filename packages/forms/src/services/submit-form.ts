import { failure, success, type Result } from '@gsa-tts/forms-common';

import { type FormServiceContext } from '../context/index.js';
import { submitPage } from '../patterns/page-set/submit';
import { downloadPackageHandler } from '../patterns/package-download/submit';
import {
  repeaterAddRowHandler,
  repeaterDeleteRowHandler,
} from '../patterns/repeater/submit';
import { type FormRoute } from '../route-data.js';
import { SubmissionRegistry } from '../submission';
import {
  createFormSession,
  type FormSession,
  type FormSessionId,
} from '../session.js';
import { defaultFormConfig } from '../patterns/index.js';
import type { Blueprint } from '../types.js';

export type SubmitForm = (
  ctx: FormServiceContext,
  sessionId: FormSessionId | undefined,
  formId: string,
  formData: Record<string, string>,
  route?: FormRoute
) => Promise<
  Result<{
    sessionId: FormSessionId;
    session: FormSession;
    attachments?: {
      fileName: string;
      data: Uint8Array;
    }[];
  }>
>;

// Temportary location for the SubmissionRegistry.
const registry = new SubmissionRegistry(defaultFormConfig);
registry.registerHandler({
  handlerId: 'page-set',
  handler: submitPage,
});
registry.registerHandler({
  handlerId: 'package-download',
  handler: downloadPackageHandler,
});
registry.registerHandler({
  handlerId: 'repeater-add-row',
  handler: repeaterAddRowHandler,
});
registry.registerHandler({
  handlerId: 'repeater-delete-row',
  handler: repeaterDeleteRowHandler,
});

/**
 * Asynchronously submits a form by processing the provided data, managing session information, and
 * invoking the appropriate handler based on the action.
 */
export const submitForm: SubmitForm = async (
  ctx,
  sessionId,
  formId,
  formData,
  route
) => {
  const formResult = await ctx.repository.getForm(formId);
  if (!formResult.success) {
    return failure(formResult.error);
  }

  if (formResult.data === null) {
    return failure('Form not found');
  }

  const sessionResult = await getFormSessionOrCreate(
    ctx,
    formResult.data,
    route,
    sessionId
  );
  if (!sessionResult.success) {
    return sessionResult;
  }

  const session: FormSession = route
    ? {
        ...sessionResult.data,
        route,
      }
    : sessionResult.data;

  const actionString = formData['action'];
  if (typeof actionString !== 'string') {
    return failure(`Invalid action: ${actionString}`);
  }

  const submitHandlerResult = registry.getHandlerForAction(
    formResult.data,
    actionString
  );
  if (!submitHandlerResult.success) {
    return failure(submitHandlerResult.error);
  }

  const { handler, pattern } = submitHandlerResult.data;
  const newSessionResult = await handler(
    {
      config: ctx.config,
      getDocument: id => {
        return ctx.repository.getDocument(id);
      },
    },
    {
      pattern,
      session,
      data: formData,
    }
  );

  if (!newSessionResult.success) {
    return failure(newSessionResult.error);
  }

  const saveFormSessionResult = await ctx.repository.upsertFormSession({
    id: sessionId,
    formId,
    data: newSessionResult.data.session,
  });
  if (!saveFormSessionResult.success) {
    return failure(saveFormSessionResult.error);
  }

  /*
  if (sessionIsComplete(ctx.config, newSessionResult.data)) {
    const documentsResult = await generateDocumentPackage(
      form,
      newSessionResult.data.data.values
    );
    if (!documentsResult.success) {
      return failure(documentsResult.error);
    }

    return success({
      sessionId: saveFormSessionResult.data.id,
      session: newSessionResult.data,
      documents: documentsResult.data,
    });
  }
  */

  return success({
    sessionId: saveFormSessionResult.data.id,
    session: newSessionResult.data.session,
    attachments: newSessionResult.data.attachments,
  });
};

/**
 * Retrieves an existing form session by its id or creates a new form session.
 */
const getFormSessionOrCreate = async (
  ctx: FormServiceContext,
  form: Blueprint,
  route?: FormRoute,
  sessionId?: FormSessionId
) => {
  if (sessionId === undefined) {
    return success(createFormSession(form, route));
  }
  const sessionResult = await ctx.repository.getFormSession(sessionId);
  if (!sessionResult.success) {
    return failure('Session not found');
  }
  return success(sessionResult.data.data);
};
