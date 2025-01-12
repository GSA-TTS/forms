import { type Result, failure, success } from '@atj/common';

import type { ParsedPdf } from '../documents/pdf/parsing-api';
import type { DocumentFieldMap } from '../documents/types';
import type { FormRepositoryContext } from '.';

export type AddDocument = (
  ctx: FormRepositoryContext,
  document: {
    fileName: string;
    data: Uint8Array;
    extract: {
      parsedPdf: ParsedPdf;
      fields: DocumentFieldMap;
    };
  }
) => Promise<Result<{ id: string }>>;

/**
 * Asynchronously adds a document entry to the database.
 */
export const addDocument: AddDocument = async (ctx, document) => {
  const uuid = crypto.randomUUID();
  const db = await ctx.db.getKysely();

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
