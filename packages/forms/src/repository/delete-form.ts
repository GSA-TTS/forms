import { type VoidResult, failure, voidSuccess } from '@atj/common';

import type { FormOutput } from '../types';
import type { FormRepositoryContext } from '.';

export type DeleteForm = (
  ctx: FormRepositoryContext,
  formId: string
) => Promise<VoidResult<{ message: string; code: 'not-found' | 'unknown' }>>;

export const deleteForm: DeleteForm = async (ctx, formId) => {
  const db = await ctx.db.getKysely();

  const result = await db.transaction().execute(async trx => {
    const deleteResult = await trx
      .deleteFrom('forms')
      .where('id', '=', formId)
      .returning('data')
      .executeTakeFirst();

    if (!deleteResult) {
      return failure({ message: 'form not found', code: 'not-found' as const });
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
        return failure({ message: error.message, code: 'unknown' as const });
      });
  });

  return result;
};
