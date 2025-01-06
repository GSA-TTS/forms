import { beforeAll, expect, it, vi } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';
import { addDocument } from './add-document';
import type { DocumentFieldMap } from '../documents/types';
import type { ParsedPdf } from '../documents/pdf/parsing-api';
import { defaultFormConfig } from '../patterns';
import { getDocument } from './get-document';

describeDatabase('get document', () => {
  const today = new Date(2000, 1, 1);

  beforeAll(async () => {
    vi.setSystemTime(today);
  });

  it<DbTestContext>('works', async ({ db }) => {
    const context = { db: db.ctx, formConfig: defaultFormConfig };
    // add test document
    const testDocument = {
      fileName: 'file.pdf',
      data: new Uint8Array([1, 2, 3]),
      extract: {
        parsedPdf: {} as ParsedPdf,
        fields: {} as DocumentFieldMap,
      },
    };
    const result = await addDocument(context, testDocument);
    if (!result.success) {
      expect.fail(`addDocument failed: ${result.error}`);
    }

    // get the document
    const docResult = await getDocument(context, result.data.id);
    expect(docResult).toEqual({
      success: true,
      data: {
        id: result.data.id,
        path: testDocument.fileName,
        data: new Buffer(testDocument.data),
        fields: {},
      },
    });
  });
});
