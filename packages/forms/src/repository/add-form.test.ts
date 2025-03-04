import { beforeAll, expect, it, vi } from 'vitest';

import {
  type DbTestContext,
  describeDatabase,
} from '@gsa-tts/forms-database/testing';
import { addForm } from './add-form.js';
import { defaultFormConfig } from '../patterns/index.js';

describeDatabase('add form', () => {
  const today = new Date(2000, 1, 1);

  beforeAll(async () => {
    vi.setSystemTime(today);
  });

  it<DbTestContext>('works', async ({ db }) => {
    const result = await addForm(
      { db: db.ctx, formConfig: defaultFormConfig },
      testForm
    );
    if (result.success === false) {
      expect.fail('addForm failed');
    }
    expect(result.data.timestamp).toEqual(today.toISOString());

    const kysely = await db.ctx.getKysely();
    const insertedForm = await kysely
      .selectFrom('forms')
      .select(['data', 'id'])
      .where('id', '=', result.data.id)
      .executeTakeFirst();
    if (insertedForm === undefined) {
      expect.fail('getting inserted form failed');
    }
    expect(insertedForm).toEqual({
      id: result.data.id,
      data: '{"summary":{"title":"Test form","description":"Test description"},"root":"root","patterns":{"root":{"type":"sequence","id":"root","data":{"patterns":[]}}},"outputs":[]}',
    });
  });
});

const testForm = {
  summary: { title: 'Test form', description: 'Test description' },
  root: 'root',
  patterns: { root: { type: 'sequence', id: 'root', data: { patterns: [] } } },
  outputs: [],
};
