import { type VoidResult, failure, voidSuccess } from '@atj/common';
import { type DatabaseContext } from '@atj/database';

import type { FormOutput } from '../types';

export type DeleteForm = (
  ctx: DatabaseContext,
  formId: string
) => Promise<VoidResult>;

export const deleteForm: DeleteForm = async (ctx, formId) => {
  const db = await ctx.getKysely();

  const result = await db.transaction().execute(async trx => {
    const deleteResult = await trx
      .deleteFrom('forms')
      .where('id', '=', formId)
      .returning('data')
      .executeTakeFirst();

    if (!deleteResult) {
      return failure('form not found');
    }

    const form = JSON.parse(deleteResult.data);
    const documentIds: string[] = form.outputs.map(
      (output: FormOutput) => output.id
    );

    if (documentIds.length === 0) {
      return voidSuccess;
    }

    return await trx
      .deleteFrom('form_documents')
      .where('id', 'in', documentIds)
      .execute()
      .then(_ => voidSuccess)
      .catch((error: Error) => {
        return failure(error.message);
      });
  });

  return result;
};
