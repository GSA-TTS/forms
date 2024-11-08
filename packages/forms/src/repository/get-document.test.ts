import { beforeAll, expect, it, vi } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';
import { deleteForm } from './delete-form.js';

describeDatabase('get document', () => {
  const today = new Date(2000, 1, 1);

  beforeAll(async () => {
    vi.setSystemTime(today);
  });

  it<DbTestContext>('works', async ({ db }) => {
    expect(true).toBe(true);
  });
});
