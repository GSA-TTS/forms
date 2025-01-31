import { type Result, failure } from '@gsa-tts/forms-common';
import { Blueprint } from '../index.js';

import { type FormServiceContext } from '../context/index.js';

type AddFormError = {
  status: number;
  message: string;
};
type AddFormResult = {
  timestamp: string;
  id: string;
};

export type AddForm = (
  ctx: FormServiceContext,
  form: Blueprint
) => Promise<Result<AddFormResult, AddFormError>>;

/**
 * This is meant to sit in front of the form repository and manage the HTTP status codes
 * and message returned in the response when forms are added to the repository.
 */
export const addForm: AddForm = async (ctx, form) => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to add a form',
    });
  }
  const result = await ctx.repository.addForm(form);
  if (!result.success) {
    console.error('Failed to add form:', result.error);
    return failure({
      status: 500,
      message: result.error,
    });
  }
  return result;
};
