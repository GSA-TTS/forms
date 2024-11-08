import { describe, expect, it } from 'vitest';

import { createForm } from '../index.js';
import { createTestFormServiceContext } from '../testing.js';

import { getForm } from './get-form.js';

const TEST_FORM = createForm({ title: 'Form Title', description: '' });

describe('getForm', () => {
  it('non-existent form returns 404', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const result = await getForm(ctx, 'any-id');
    expect(result).toEqual({
      success: false,
      error: {
        status: 404,
        message: 'Form not found',
      },
    });
  });

  it('gets form successfully', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const addResult = await ctx.repository.addForm(TEST_FORM);
    if (!addResult.success) {
      expect.fail('Failed to add form:', addResult.error);
    }

    const result = await getForm(ctx, addResult.data.id);
    if (!result.success) {
      expect.fail(`Failed to get form: ${JSON.stringify(result.error)}`);
    }
    expect(result.data).toEqual(TEST_FORM);
  });
});
