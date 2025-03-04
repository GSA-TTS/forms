import { type Result, failure, success } from '@gsa-tts/forms-common';

import { parseForm } from '../builder/parse-form.js';
import { type FormServiceContext } from '../context/index.js';
import { type Blueprint } from '../types.js';

type GetFormError = {
  status: number;
  message: string;
};

export type GetForm = (
  ctx: FormServiceContext,
  formId: string
) => Promise<Result<Blueprint, GetFormError>>;

/**
 * This is meant to sit in front of the form repository and manage the HTTP status codes
 * and message returned in the response when forms are fetched from the repository.
 */
export const getForm: GetForm = async (ctx, formId) => {
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
      message: 'Form not found',
    });
  }

  return success(formResult.data);
};
