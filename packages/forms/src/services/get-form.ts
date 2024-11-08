import { type Result, failure, success } from '@atj/common';

import { type Blueprint } from '../index.js';
import { type FormServiceContext } from '../context/index.js';

type GetFormError = {
  status: number;
  message: string;
};

export type GetForm = (
  ctx: FormServiceContext,
  formId: string
) => Promise<Result<Blueprint, GetFormError>>;

export const getForm: GetForm = async (ctx, formId) => {
  const result = await ctx.repository.getForm(formId);
  if (result === null) {
    return failure({
      status: 404,
      message: 'Form not found',
    });
  }
  return success(result);
};
