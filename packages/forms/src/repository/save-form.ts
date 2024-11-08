import { type VoidResult, failure, success } from '@atj/common';
import { type DatabaseContext } from '@atj/database';

import { type Blueprint } from '../index.js';
import { stringifyForm } from './serialize.js';

export type SaveForm = (
  ctx: DatabaseContext,
  formId: string,
  form: Blueprint
) => Promise<VoidResult>;

export const saveForm: SaveForm = async (ctx, id, blueprint) => {
  const db = await ctx.getKysely();

  return await db
    .updateTable('forms')
    .set({
      data: stringifyForm(blueprint),
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
