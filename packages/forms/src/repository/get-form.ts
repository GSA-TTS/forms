import { type DatabaseContext } from '@atj/database';

import { type Blueprint } from '../index.js';

export type GetForm = (
  ctx: DatabaseContext,
  formId: string
) => Promise<Blueprint | null>;

export const getForm: GetForm = async (ctx, formId) => {
  const db = await ctx.getKysely();
  const selectResult = await db
    .selectFrom('forms')
    .select(['data'])
    .where('id', '=', formId)
    .executeTakeFirst();

  if (selectResult === undefined) {
    return null;
  }

  return JSON.parse(selectResult.data);
};
