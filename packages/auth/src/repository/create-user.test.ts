import { expect, it } from 'vitest';

import {
  type DbTestContext,
  describeDatabase,
} from '@gsa-tts/forms-database/testing';

import { createUser } from './create-user.js';

describeDatabase('create user', () => {
  it<DbTestContext>('works with unknown email address', async ({ db }) => {
    const resultUser = await createUser(db.ctx, 'new-user@email.com');
    if (resultUser === null) {
      expect.fail('User was not created');
    }

    const kysely = await db.ctx.getKysely();
    const insertedUser = await kysely
      .selectFrom('users')
      .select(['email', 'id'])
      .where('id', '=', resultUser.id)
      .executeTakeFirst();

    expect(resultUser.id).not.to.be.null;
    expect(insertedUser?.id).toEqual(resultUser.id);
  });

  it<DbTestContext>('fails with known email address', async ({ db }) => {
    const existingUserResult = await createUser(db.ctx, 'new-user@email.com');
    if (existingUserResult === null) {
      expect.fail('User was not created');
    }
    const resultUser = await createUser(db.ctx, 'new-user@email.com');
    expect(resultUser).toBeNull();

    // Check that there is only one row in the users table
    const kysely = await db.ctx.getKysely();
    const insertedUser = await kysely
      .selectFrom('users')
      .select(kysely.fn.count('id').as('count'))
      .executeTakeFirst();
    expect(Number(insertedUser?.count)).toEqual(1);
  });
});
