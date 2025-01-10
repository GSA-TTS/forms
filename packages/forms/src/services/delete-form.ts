import { type VoidResult, failure } from '@atj/common';

import { type FormServiceContext } from '../context/index.js';

type DeleteFormError = {
  status: number;
  message: string;
};

export type DeleteForm = (
  ctx: FormServiceContext,
  formId: string
) => Promise<VoidResult<DeleteFormError>>;

/**
 * This is meant to sit in front of the form repository and manage the HTTP status codes
 * and message returned in the response when forms are deleted from the repository.
 */
export const deleteForm: DeleteForm = async (ctx, formId) => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to delete a form',
    });
  }
  const formResult = await ctx.repository.getForm(formId);
  if (!formResult.success) {
    return failure({
      status: 500,
      message: formResult.error,
    });
  }
  if (formResult.data === null) {
    return failure({
      status: 404,
      message: `form '${formId} does not exist`,
    });
  }
  await ctx.repository.deleteForm(formId);
  return { success: true };
};
