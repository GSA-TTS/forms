import { describe, expect, it } from 'vitest';

import { type Blueprint, createForm, createFormSession } from '../index.js';
import { type FormServiceContext } from '../context/index.js';
import { createTestFormServiceContext } from '../testing.js';
import { getFormSession } from './get-form-session.js';

describe('getFormSession', () => {
  it('Returns empty, non-persisted session if sessionId is not provided', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const form = createForm({ title: 'Test form', description: '' });
    const formResult = await ctx.repository.addForm(form);
    if (!formResult.success) {
      expect.fail('Failed to add test form:', formResult.error);
    }

    const sessionResult = await getFormSession(ctx, {
      formId: formResult.data.id,
      formRoute: { url: `/ignored`, params: {} },
    });
    if (!sessionResult.success) {
      expect.fail('Failed to get form session', sessionResult.error);
    }
    expect(sessionResult.data).toEqual({
      id: sessionResult.data.id,
      formId: formResult.data.id,
      data: {
        form: form,
        route: { url: `/ignored`, params: {} },
        data: { errors: {}, values: {} },
      },
    });
  });

  it('Returns existing session', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const testData = await createTestFormSession(ctx);

    const sessionResult = await getFormSession(ctx, {
      formId: testData.formId,
      formRoute: { url: `/ignored`, params: {} },
      sessionId: testData.sessionId,
    });
    if (!sessionResult.success) {
      expect.fail(
        `Failed to get inserted form session: ${sessionResult.error}`
      );
    }

    expect(sessionResult.data).toEqual({
      id: testData.sessionId,
      formId: testData.formId,
      data: {
        data: { errors: {}, values: {} },
        form: testData.form,
        route: { url: `/ignored`, params: {} },
      },
    });
  });

  it('Returns new, unsaved session if existing session is not found', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const testData = await createTestFormSession(ctx);

    const sessionResult = await getFormSession(ctx, {
      formId: testData.formId,
      formRoute: { url: `/ignored`, params: {} },
      sessionId: 'non-existent-session-id',
    });
    if (!sessionResult.success) {
      expect.fail(
        `Failed to get inserted form session: ${sessionResult.error}`
      );
    }

    expect(sessionResult.data).toEqual({
      id: sessionResult.data.id,
      formId: testData.formId,
      data: {
        data: { errors: {}, values: {} },
        form: testData.form,
        route: { url: `/ignored`, params: {} },
      },
    });
  });
});

const createTestFormSession = async (ctx: FormServiceContext) => {
  const form = createForm({ title: 'Test form', description: '' });
  const formAddResult = await ctx.repository.addForm(form);
  if (!formAddResult.success) {
    expect.fail(`Failed to add test form: ${formAddResult.error}`);
  }
  return {
    form,
    formId: formAddResult.data.id,
    sessionId: await insertFormSession(ctx, formAddResult.data.id, form),
  };
};

const insertFormSession = async (
  ctx: FormServiceContext,
  formId: string,
  form: Blueprint
) => {
  const formSession = createFormSession(form, {
    url: `/ignored`,
    params: {},
  });
  const sessionInsertResult = await ctx.repository.upsertFormSession({
    formId: formId,
    data: formSession,
  });
  if (!sessionInsertResult.success) {
    expect.fail(`Failed to insert form session: ${sessionInsertResult.error}`);
  }
  return sessionInsertResult.data.id;
};
