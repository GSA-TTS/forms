import { type Result, failure, success } from '@atj/common';

import type { ParsedPdf } from '../documents/pdf/parsing-api';
import type { DocumentFieldMap } from '../documents/types';
import type { FormRepositoryContext } from '.';

export type GetDocument = (
  ctx: FormRepositoryContext,
  id: string
) => Promise<
  Result<{
    id: string;
    data: Uint8Array;
    path: string;
    fields: DocumentFieldMap;
    //formFields: Record<string, string>;
  }>
>;

export const getDocument: GetDocument = async (ctx, id) => {
  const db = await ctx.db.getKysely();

  return await db
    .selectFrom('form_documents')
    .select(['id', 'type', 'file_name', 'data', 'extract'])
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
    .then(data => {
      const extract: { parsedPdf: ParsedPdf; fields: DocumentFieldMap } =
        JSON.parse(data.extract);
      return success({
        id: data.id,
        data: data.data,
        path: data.file_name,
        fields: extract.fields,
      });
    })
    .catch(err => failure(err.message));
};
