import { type Result, failure, success } from '@atj/common';
import { Blueprint } from '../index.js';

import { type FormServiceContext } from '../context/index.js';

type SaveFormError = {
  status: number;
  message: string;
};

export type SaveForm = (
  ctx: FormServiceContext,
  formId: string,
  form: Blueprint
) => Promise<Result<{ timestamp: Date }, SaveFormError>>;

export const saveForm: SaveForm = async (ctx, formId, form) => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to save a form',
    });
  }
  const result = await ctx.repository.saveForm(formId, form);
  if (result.success === false) {
    return failure({
      status: 500,
      message: 'error saving form',
    });
  }
  return success({
    timestamp: new Date(),
  });
};
