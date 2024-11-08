import { type Result, failure, success } from '@atj/common';
import { type DatabaseContext } from '@atj/database';

import { type Blueprint } from '../index.js';

export type AddForm = (
  ctx: DatabaseContext,
  form: Blueprint
) => Promise<Result<{ timestamp: string; id: string }>>;

export const addForm: AddForm = async (ctx, form) => {
  const uuid = crypto.randomUUID();
  const db = await ctx.getKysely();
  return db
    .insertInto('forms')
    .values({
      id: uuid,
      data: JSON.stringify(form),
    })
    .execute()
    .then(() =>
      success({
        timestamp: new Date().toISOString(),
        id: uuid,
      })
    )
    .catch(err => failure(err.message));
};
