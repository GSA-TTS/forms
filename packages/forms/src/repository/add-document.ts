import { type Result, failure, success } from '@atj/common';
import { type DatabaseContext } from '@atj/database';

import type { ParsedPdf } from '../documents/pdf/parsing-api';
import type { DocumentFieldMap } from '../documents/types';

export type AddDocument = (
  ctx: DatabaseContext,
  document: {
    fileName: string;
    data: Uint8Array;
    extract: {
      parsedPdf: ParsedPdf;
      fields: DocumentFieldMap;
    };
  }
) => Promise<Result<{ id: string }>>;

export const addDocument: AddDocument = async (ctx, document) => {
  const uuid = crypto.randomUUID();
  const db = await ctx.getKysely();

  return await db
    .insertInto('form_documents')
    .values({
      id: uuid,
      type: 'pdf',
      file_name: document.fileName,
      data: Buffer.from(document.data),
      extract: JSON.stringify(document.extract),
    })
    .execute()
    .then(() =>
      success({
        id: uuid,
      })
    )
    .catch(err => failure(err.message));
};