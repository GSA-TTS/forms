import { type Result, failure, success } from '@atj/common';
import { type FormSession, type FormSessionId } from '../session';
import type { FormRepositoryContext } from '.';

export type GetFormSession = (
  ctx: FormRepositoryContext,
  id: string
) => Promise<
  Result<{
    id: FormSessionId;
    formId: string;
    data: FormSession;
  }>
>;

/**
 * Asynchronously retrieves a form session by its unique identifier from the database.
 */
export const getFormSession: GetFormSession = async (
  ctx: FormRepositoryContext,
  id: FormSessionId
) => {
  const db = await ctx.db.getKysely();
  return await db
    .selectFrom('form_sessions')
    .where('id', '=', id)
    .select(['id', 'form_id', 'data'])
    .executeTakeFirstOrThrow()
    .then(result => {
      return success({
        id: result.id,
        formId: result.form_id,
        data: JSON.parse(result.data),
      });
    })
    .catch(err => {
      return failure(err.message);
    });
};
