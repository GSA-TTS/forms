import { type VoidResult, failure, success } from '@gsa-tts/forms-common';

import { type Blueprint } from '../index.js';
import type { FormRepositoryContext } from './index.js';

export type SaveForm = (
  ctx: FormRepositoryContext,
  formId: string,
  form: Blueprint
) => Promise<VoidResult>;

/**
 * Asynchronously saves a form blueprint by updating the corresponding entry in the database.
 */
export const saveForm: SaveForm = async (
  ctx: FormRepositoryContext,
  id: string,
  blueprint: Blueprint
) => {
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
