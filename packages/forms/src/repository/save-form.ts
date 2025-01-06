import { type VoidResult, failure, success } from '@atj/common';

import { type Blueprint } from '../index.js';
import type { FormRepositoryContext } from './index.js';

export type SaveForm = (
  ctx: FormRepositoryContext,
  formId: string,
  form: Blueprint
) => Promise<VoidResult>;

export const saveForm: SaveForm = async (ctx, id, blueprint) => {
  const db = await ctx.db.getKysely();

  return await db
    .updateTable('forms')
    .set({
      data: JSON.stringify(blueprint),
    })
    .where('id', '=', id)
    .execute()
    .then(() =>
      success({
        timestamp: new Date(),
        id,
      })
    )
    .catch(err => failure(err.message));
};
