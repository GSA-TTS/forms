import { beforeAll, expect, it, vi } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';
import { addDocument } from './add-document.js';
import type { ParsedPdf } from '../documents/pdf/parsing-api.js';
import type { DocumentFieldMap } from '../documents/types.js';
import { defaultFormConfig } from '../patterns/index.js';

describeDatabase('add document', () => {
  const today = new Date(2000, 1, 1);

  beforeAll(async () => {
    vi.setSystemTime(today);
  });

  it<DbTestContext>('works', async ({ db }) => {
    const result = await addDocument(
      { db: db.ctx, formConfig: defaultFormConfig },
      {
        fileName: 'file.pdf',
        data: new Uint8Array([1, 2, 3]),
        extract: {
          parsedPdf: {} as ParsedPdf,
          fields: {} as DocumentFieldMap,
        },
      }
    );
    if (result.success === false) {
      expect.fail(`addDocument failed: ${result.error}`);
    }
    expect(result.data.id).toBeTypeOf('string');
  });
});
