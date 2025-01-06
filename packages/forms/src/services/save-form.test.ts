import { describe, expect, it } from 'vitest';

import { createForm } from '../index.js';
import { createTestFormServiceContext } from '../testing.js';

import { saveForm } from './save-form.js';
import { success } from '@atj/common';

const TEST_FORM = createForm({ title: 'Form Title', description: '' });
const TEST_FORM_2 = {
  ...TEST_FORM,
  summary: {
    ...TEST_FORM.summary,
    title: 'New Title',
  },
};

describe('saveForm', () => {
  it('returns access denied (401) if user is not logged in', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const result = await saveForm(ctx, 'any-id', TEST_FORM);
    expect(result).toEqual({
      success: false,
      error: {
        status: 401,
        message: 'You must be logged in to save a form',
      },
    });
  });

  it('saves form successfully when user is logged in', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => true,
    });
    const addResult = await ctx.repository.addForm(TEST_FORM);
    if (!addResult.success) {
      expect.fail('Failed to add form:', addResult.error);
    }

    const result = await saveForm(ctx, addResult.data.id, TEST_FORM_2);
    if (!result.success) {
      expect.fail('Failed to add form:', result.error);
    }
    expect(result.data).toEqual(
      expect.objectContaining({ timestamp: expect.any(Date) })
    );

    const savedForm = await ctx.repository.getForm(addResult.data.id);
    expect(savedForm).toEqual(success(TEST_FORM_2));
  });
});
