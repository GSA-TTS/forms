import { expect, it } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';
import { getForm } from './get-form.js';
import { getFormList } from './get-form-list.js';
import { defaultFormConfig } from '../patterns/index.js';

describeDatabase('getFormList', () => {
  it<DbTestContext>('retrieves form list successfully', async ({ db }) => {
    const context = { db: db.ctx, formConfig: defaultFormConfig };
    const kysely = await db.ctx.getKysely();
    await kysely
      .insertInto('forms')
      .values([
        {
          id: '45c66187-64e2-4d75-a45a-e80f1d035bc5',
          data: '{"summary":{"title":"Test form","description":"Test description"},"root":"root","patterns":{"root":{"type":"sequence","id":"root","data":{"patterns":[]}}},"outputs":[]}',
        },
        {
          id: '85c66187-64e2-4d75-a45a-e80f1d035bc5',
          data: '{"summary":{"title":"Test form 2","description":"Test description 2"},"root":"root","patterns":{"root":{"type":"sequence","id":"root","data":{"patterns":[]}}},"outputs":[]}',
        },
      ])
      .execute();

    const result = await getFormList(context);
    expect(result).toEqual([
      {
        id: '45c66187-64e2-4d75-a45a-e80f1d035bc5',
        title: 'Test form',
        description: 'Test description',
      },
      {
        id: '85c66187-64e2-4d75-a45a-e80f1d035bc5',
        title: 'Test form 2',
        description: 'Test description 2',
      },
    ]);
  });

  it<DbTestContext>('return null with non-existent form', async ({ db }) => {
    const context = { db: db.ctx, formConfig: defaultFormConfig };
    const result = await getForm(
      context,
      '45c66187-64e2-4d75-a45a-e80f1d035bc5'
    );
    expect(result).toEqual({ success: true, data: null });
  });
});
