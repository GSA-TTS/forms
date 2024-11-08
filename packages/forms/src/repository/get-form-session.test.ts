import { expect, it } from 'vitest';

import { type DbTestContext, describeDatabase } from '@atj/database/testing';

import { createTestBlueprint } from '../builder/builder.test';
import { addForm } from './add-form';
import { getFormSession } from './get-form-session';

describeDatabase('getFormSession', () => {
  it<DbTestContext>('returns a preexisting form session', async ctx => {
    const db = await ctx.db.ctx.getKysely();
    const form = await addForm(ctx.db.ctx, createTestBlueprint());
    if (!form.success) {
      expect.fail(form.error);
    }
    const formSessionId = '7128b29f-e03d-48c8-8a82-2af8759fc146';
    await db
      .insertInto('form_sessions')
      .values({
        id: formSessionId,
        form_id: form.data.id,
        data: '{}',
      })
      .executeTakeFirstOrThrow();

    const formSessionResult = await getFormSession(ctx.db.ctx, formSessionId);
    if (!formSessionResult.success) {
      expect.fail(formSessionResult.error);
    }

    expect(formSessionResult.data).toEqual({
      id: formSessionId,
      formId: form.data.id,
      data: {},
    });
  });

  it<DbTestContext>('returns an error if the form session does not exist', async ctx => {
    const formSessionResult = await getFormSession(
      ctx.db.ctx,
      '7128b29f-e03d-48c8-8a82-2af8759fc146'
    );
    expect(formSessionResult).toEqual({
      error: 'no result',
      success: false,
    });
  });
});
