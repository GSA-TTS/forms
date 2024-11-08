import { expect, it } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';

import { type Blueprint } from '../index.js';
import { getForm } from './get-form.js';

describeDatabase('getForm', () => {
  it<DbTestContext>('retrieves form successfully', async ({ db }) => {
    const kysely = await db.ctx.getKysely();
    await kysely
      .insertInto('forms')
      .values({
        id: '45c66187-64e2-4d75-a45a-e80f1d035bc5',
        data: '{"summary":{"title":"Title","description":"Description"},"root":"root","patterns":{"root":{"type":"sequence","id":"root","data":{"patterns":[]}}},"outputs":[{"data":"AQID","path":"test.pdf","fields":{},"formFields":{}}]}',
      })
      .execute();

    const result = await getForm(
      db.ctx,
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    console.log(result);
    expect(result).toEqual(TEST_FORM);
  });

  it<DbTestContext>('return null with non-existent form', async ({ db }) => {
    const result = await getForm(
      db.ctx,
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    expect(result).toBeNull();
  });
});

const TEST_FORM: Blueprint = {
  summary: { title: 'Title', description: 'Description' },
  root: 'root',
  patterns: { root: { type: 'sequence', id: 'root', data: { patterns: [] } } },
  outputs: [
    {
      data: new Uint8Array([1, 2, 3]),
      path: 'test.pdf',
      fields: {},
      formFields: {},
    },
  ],
};
