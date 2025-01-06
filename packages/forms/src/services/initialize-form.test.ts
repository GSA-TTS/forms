import { describe, expect, it } from 'vitest';

import { createTestFormServiceContext } from '../testing.js';

import { initializeForm } from './initialize-form.js';

const summary = { title: 'Form Title', description: '' };

describe('initializeForm', () => {
  it('returns access denied (401) if user is not logged in', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => false,
    });
    const result = await initializeForm(ctx, { summary });
    expect(result).toEqual({
      success: false,
      error: {
        status: 401,
        message: 'You must be logged in to initialize a new form',
      },
    });
  });

  it('initializes with summary when user is logged in', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => true,
    });
    const result = await initializeForm(ctx, { summary });
    expect(result).toEqual({
      success: true,
      data: {
        timestamp: expect.any(String),
        id: expect.any(String),
      },
    });
  });

  it('initializes successfully with document when user is logged in', async () => {
    const ctx = await createTestFormServiceContext({
      isUserLoggedIn: () => true,
      parsedPdf: async () => ({
        parsedPdf: {
          text: 'test',
          title: '',
          root: 'root',
          description: '',
          patterns: {},
          errors: [],
          outputs: {},
        },
        fields: {},
      }),
    });
    const result = await initializeForm(ctx, {
      summary,
      document: { fileName: 'test.pdf', data: 'VGhpcyBpcyBub3QgYSBQREYu' },
    });
    expect(result).toEqual({
      success: true,
      data: {
        timestamp: expect.any(String),
        id: expect.any(String),
      },
    });
  });
});
