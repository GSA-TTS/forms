import { expect, it } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';

import { defaultFormConfig, type Blueprint } from '../index.js';
import { getForm } from './get-form.js';

describeDatabase('getForm', () => {
  it<DbTestContext>('retrieves form successfully', async ({ db }) => {
    const kysely = await db.ctx.getKysely();
    await kysely
      .insertInto('forms')
      .values({
        id: '45c66187-64e2-4d75-a45a-e80f1d035bc5',
        data: '{"summary":{"title":"Title","description":"Description"},"root":"root","patterns":{"root":{"type":"page-set","id":"root","data":{"pages":[]}}},"outputs":[{"id":"test-id","path":"test.pdf","fields":{},"formFields":{}}]}',
      })
      .execute();

    const result = await getForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    expect(result).toEqual({ success: true, data: TEST_FORM });
  });

  it<DbTestContext>('return null with non-existent form', async ({ db }) => {
    const result = await getForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    expect(result).toEqual({ success: true, data: null });
  });
});

const TEST_FORM: Blueprint = {
  summary: { title: 'Title', description: 'Description' },
  root: 'root',
  patterns: { root: { type: 'page-set', id: 'root', data: { pages: [] } } },
  outputs: [
    {
      id: 'test-id',
      path: 'test.pdf',
      fields: {},
      formFields: {},
    },
  ],
};
