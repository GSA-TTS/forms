import { beforeAll, expect, it, vi } from 'vitest';

import type { Result } from '@gsa-tts/forms-common';
import {
  type DbTestContext,
  describeDatabase,
} from '@gsa-tts/forms-database/testing';

import { createTestBlueprint } from '../builder/builder.test.js';
import type { Blueprint } from '../types.js';

import { addDocument } from './add-document.js';
import { addForm } from './add-form.js';
import { deleteForm } from './delete-form.js';
import { defaultFormConfig } from '../patterns/index.js';

describeDatabase('delete form', () => {
  const today = new Date(2000, 1, 1);

  beforeAll(async () => {
    vi.setSystemTime(today);
  });

  it<DbTestContext>('works with valid form ID', async ({ db }) => {
    const kysely = await db.ctx.getKysely();
    await kysely
      .insertInto('forms')
      .values({
        id: '45c66187-64e2-4d75-a45a-e80f1d035bc5',
        data: '{"summary":{"title":"Test form","description":"Test description"},"root":"root","patterns":{"root":{"type":"sequence","id":"root","data":{"patterns":[]}}},"outputs":[]}',
      })
      .execute();

    const result = await deleteForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    if (result.success === false) {
      expect.fail(`addForm failed: ${result.error}`);
    }

    const selectResult = await kysely
      .selectFrom('forms')
      .select(kysely.fn.count('id').as('count'))
      .executeTakeFirst();
    if (selectResult === undefined) {
      expect.fail('getting forms count failed');
    }
    expect(Number(selectResult?.count)).toEqual(0);
  });

  it<DbTestContext>('fails with invalid form ID', async ({ db }) => {
    const result = await deleteForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    expect(result.success).toBe(false);
  });

  it<DbTestContext>('removes associated documents', async ({ db }) => {
    // Setup
    const { id: id1 } = await ensure(
      await addDocument(
        { db: db.ctx, formConfig: defaultFormConfig },
        {
          fileName: 'test1.pdf',
          data: new Uint8Array(),
          extract: {
            parsedPdf: {
              patterns: {},
              errors: [],
              outputs: {},
              root: 'root',
              title: 'Test form',
              description: 'Test description',
            },
            fields: {},
          },
        }
      ),
      'Failed to add test document'
    );
    const { id: id2 } = await ensure(
      await addDocument(
        { db: db.ctx, formConfig: defaultFormConfig },
        {
          fileName: 'test2.pdf',
          data: new Uint8Array(),
          extract: {
            parsedPdf: {
              patterns: {},
              errors: [],
              outputs: {},
              root: 'root',
              title: 'Test form',
              description: 'Test description',
            },
            fields: {},
          },
        }
      ),
      'Failed to add test document'
    );
    const form = createTestBlueprint();
    const { id: formId } = await ensure(
      await addForm(
        { db: db.ctx, formConfig: defaultFormConfig },
        {
          ...form,
          outputs: [
            { id: id1, path: 'test1.pdf', fields: {}, formFields: {} },
            { id: id2, path: 'test2.pdf', fields: {}, formFields: {} },
          ],
        }
      ),
      'Failed to add test form'
    );

    // Test
    const result = await deleteForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      formId
    );

    // Assert
    expect(result).toEqual({ success: true });
    // Select the count of rows in the form_documents table:
    const kysely = await db.ctx.getKysely();
    const selectResult = await kysely
      .selectFrom('form_documents')
      .select(kysely.fn.count('id').as('count'))
      .executeTakeFirst();
    expect(Number(selectResult?.count)).toEqual(0);
  });
});

const ensure = <T>(result: Result<T>, message: string = 'Ensure failure') => {
  if (result.success === false) {
    expect.fail(`${message}: ${result.error}`);
  }
  return result.data;
};

const TEST_FORM: Blueprint = {
  summary: {
    title: 'Test form',
    description: 'Test description',
  },
  root: 'root',
  patterns: {
    root: {
      type: 'sequence',
      id: 'root',
      data: {
        patterns: [],
      },
    },
  },
  outputs: [
    {
      id: '1',
      path: 'test1.pdf',
      fields: {},
      formFields: {},
    },
    {
      id: '2',
      path: 'test2.pdf',
      fields: {},
      formFields: {},
    },
  ],
};
