import type { FormRepositoryContext } from '.';

export type GetFormList = (ctx: FormRepositoryContext) => Promise<
  | {
      id: string;
      title: string;
      description: string;
    }[]
  | null
>;

export const getFormList: GetFormList = async ctx => {
  const db = await ctx.db.getKysely();
  const rows = await db.selectFrom('forms').select(['id', 'data']).execute();

  return rows.map(row => {
    const form = JSON.parse(row.data);
    return {
      id: row.id,
      title: form.summary.title,
      description: form.summary.description,
    };
  });
};
