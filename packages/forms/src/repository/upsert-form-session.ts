import { type Result, failure, success } from '@atj/common';
import { type DatabaseContext } from '@atj/database';
import { type FormSession } from '../session';

export type UpsertFormSession = (
  ctx: DatabaseContext,
  opts: {
    id?: string;
    formId: string;
    data: FormSession;
  }
) => Promise<Result<{ timestamp: Date; id: string }>>;

export const upsertFormSession: UpsertFormSession = async (ctx, opts) => {
  const db = await ctx.getKysely();
  const strData = JSON.stringify(opts.data);
  const id = opts.id || crypto.randomUUID();
  return await db
    .insertInto('form_sessions')
    .values({
      id,
      form_id: opts.formId,
      data: strData,
    })
    .onConflict(oc =>
      oc.columns(['id', 'form_id']).doUpdateSet({
        data: strData,
      })
    )
    .executeTakeFirstOrThrow()
    .then(() => {
      return success({
        timestamp: new Date(),
        id,
      });
    })
    .catch(err => {
      return failure(err.message);
    });
};
