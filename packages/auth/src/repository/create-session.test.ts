import { expect, it } from 'vitest';

import {
  type DbTestContext,
  describeDatabase,
} from '@gsa-tts/forms-database/testing';
import { createUser } from './create-user.js';
import { createSession } from './create-session.js';

describeDatabase('create session', () => {
  it<DbTestContext>('fails with unknown userId', async ({ db }) => {
    await expect(() =>
      createSession(db.ctx, {
        id: '31b72aca-116e-412d-b9b8-467300a53748',
        expiresAt: new Date(),
        sessionToken: 'token',
        userId: 'user-id',
      })
    ).rejects.toThrow();
  });

  it<DbTestContext>('works with existing user', async ({ db }) => {
    const user = await createUser(db.ctx, 'user@test.gov');
    if (user === null) {
      expect.fail('User was not created');
    }
    const sessionId = await createSession(db.ctx, {
      id: '31b72aca-116e-412d-b9b8-467300a53748',
      expiresAt: new Date(),
      sessionToken: 'token',
      userId: user.id,
    });
    if (sessionId === null) {
      expect.fail('Session was not created');
    }

    const kysely = await db.ctx.getKysely();
    const insertedSession = await kysely
      .selectFrom('sessions')
      .select(['id'])
      .where('id', '=', sessionId)
      .executeTakeFirst();
    expect(insertedSession?.id).toEqual(sessionId);
  });
});
