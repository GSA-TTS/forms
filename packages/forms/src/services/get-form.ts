import { type Result, failure, success } from '@atj/common';

import { parseForm } from '../builder/index.js';
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

export const getForm: GetForm = async (ctx, formId) => {
  const result = await ctx.repository.getForm(formId);
  if (result === null) {
    return failure({
      status: 404,
      message: 'Form not found',
    });
  }

  const parseResult = parseForm(ctx.config, result);
  if (!parseResult.success) {
    return failure({
      status: 500,
      message: parseResult.error,
    });
  }

  return success(parseResult.data);
};
