import { type VoidResult, failure } from '@atj/common';

import { type DatabaseContext } from '@atj/database';

export type DeleteForm = (
  ctx: DatabaseContext,
  formId: string
) => Promise<VoidResult>;

export const deleteForm: DeleteForm = async (ctx, formId) => {
  const db = await ctx.getKysely();

  const deleteResult = await db
    .deleteFrom('forms')
    .where('id', '=', formId)
    .execute();

  if (!deleteResult[0].numDeletedRows) {
    return failure('form not found');
  }

  return { success: true };
};
