import { type Result, failure, success } from '@atj/common';

import { type FormServiceContext } from '../context/index.js';

export type FormListItem = {
  id: string;
  title: string;
  description: string;
};
type FormListError = {
  status: number;
  message: string;
};

export type GetFormList = (
  ctx: FormServiceContext
) => Promise<Result<FormListItem[], FormListError>>;

export const getFormList: GetFormList = async ctx => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to delete a form',
    });
  }
  const forms = await ctx.repository.getFormList();
  if (forms === null) {
    return failure({
      status: 500,
      message: 'error getting form list',
    });
  }
  return success(forms);
};
