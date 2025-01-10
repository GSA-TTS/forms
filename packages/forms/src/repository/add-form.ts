import { type Result, failure, success } from '@atj/common';

import { type Blueprint } from '../index.js';
import type { FormRepositoryContext } from './index.js';

export type AddForm = (
  ctx: FormRepositoryContext,
  form: Blueprint
) => Promise<Result<{ timestamp: string; id: string }>>;

/**
 * Adds a new form entry to the database.
 */
export const addForm: AddForm = async (ctx, form) => {
  const uuid = crypto.randomUUID();
  const db = await ctx.db.getKysely();
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
