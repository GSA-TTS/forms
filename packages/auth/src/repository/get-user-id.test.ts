import { randomUUID } from 'crypto';
import { expect, it } from 'vitest';

import {
  type DbTestContext,
  describeDatabase,
} from '@gsa-tts/forms-database/testing';

import { getUserId } from './get-user-id.js';

describeDatabase('get user id', () => {
  it<DbTestContext>('returns null for non-existent user', async ({ db }) => {
    const userId = await getUserId(db.ctx, 'new-user@email.com');
    expect(userId).to.be.null;
  });

  it<DbTestContext>('returns null for non-existent user', async ({ db }) => {
    const id = randomUUID();

    const kysely = await db.ctx.getKysely();
    await kysely
      .insertInto('users')
      .values({
        id,
        email: 'user@agency.gov',
      })
      .executeTakeFirst();

    const userId = await getUserId(db.ctx, 'user@agency.gov');
    expect(userId).not.to.be.null;
    expect(userId).to.be.equal(id);
  });
});
