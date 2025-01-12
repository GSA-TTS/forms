import { failure, success, type Result } from '@atj/common';
import { parseFormString } from '../builder/parse-form.js';
import { type Blueprint } from '../index.js';
import type { FormRepositoryContext } from './index.js';

export type GetForm = (
  ctx: FormRepositoryContext,
  formId: string
) => Promise<Result<Blueprint | null>>;

/**
 * Retrieves and parses a form from the database using the provided form ID.
 */
export const getForm: GetForm = async (ctx, formId) => {
  const db = await ctx.db.getKysely();
  const selectResult = await db
    .selectFrom('forms')
    .select(['data'])
    .where('id', '=', formId)
    .executeTakeFirst();

  if (selectResult === undefined) {
    return success(null);
  }

  const parseResult = parseFormString(ctx.formConfig, selectResult.data);
  if (!parseResult.success) {
    return failure(`Failed to parse form: ${parseResult.error}`);
  }

  return success(parseResult.data);
};
