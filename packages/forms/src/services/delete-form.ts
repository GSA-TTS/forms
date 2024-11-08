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

export const deleteForm: DeleteForm = async (ctx, formId) => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to delete a form',
    });
  }
  const form = await ctx.repository.getForm(formId);
  if (form === null) {
    return failure({
      status: 404,
      message: `form '${formId} does not exist`,
    });
  }
  await ctx.repository.deleteForm(formId);
  return { success: true };
};
