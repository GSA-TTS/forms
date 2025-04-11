import { describe, expect, it } from 'vitest';

import { createTestFormServiceContext } from '../testing.js';
import { submitForm } from './submit-form.js';
import {
  createTestFormWithPDF,
  getMockFormData,
} from '../documents/__tests__/test-documents.js';
import { createFormSession } from '../session.js';
import { createForm } from '../blueprint.js';
import { type PageSetPattern } from '../patterns/page-set/config.js';
import { type PagePattern } from '../patterns/page/config.js';
import { type InputPattern } from '../patterns/input/config.js';
import { type Blueprint } from '../types.js';

describe('submitForm', () => {
  it('fails with missing action string', async () => {
    const { ctx, form, id } = await setupTestForm();
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {});
    expect(result).toEqual({
      success: false,
      error: 'Invalid action: undefined',
    });
  });

  // TODO: remove skip once the repeater is fully implemented
  it.skip('succeeds with empty form', async () => {
    const { ctx, id, form } = await setupTestForm();
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }

    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      action: 'action/page-set/root',
    });
    expect(result).toEqual({
      success: true,
      data: {
        session: session,
        sessionId: formSessionResult.data.id,
      },
    });
  });

  it('fails with invalid form ID', async () => {
    const { ctx, form, id } = await setupTestForm();
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      'invalid-id',
      {}
    );
    expect(result).toEqual({
      success: false,
      error: 'Form not found',
    });
  });

  it('succeeds with incomplete session', async () => {
    const { ctx, form, id } = await setupTestForm(createOnePatternTestForm());
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      action: 'action/page-set/root',
    });
    expect(result).toEqual({
      data: {
        sessionId: formSessionResult.data.id,
        session: {
          ...session,
          data: {
            errors: {
              'element-1': {
                message: 'Invalid input',
                type: 'custom',
              },
              'element-2': {
                message: 'Invalid input',
                type: 'custom',
              },
            },
            values: {
              'element-1': undefined,
              'element-2': undefined,
            },
          },
          route: undefined,
        },
      },
      success: true,
    });
  });

  it('succeeds with complete session', async () => {
    const { ctx, form, id } = await setupTestForm(createOnePatternTestForm());
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      action: 'action/page-set/root',
      'element-1': 'test',
    });
    expect(result).toEqual({
      success: true,
      data: {
        session: expect.any(Object),
        sessionId: formSessionResult.data.id,
      },
    });
  });

  it.fails('returns a pdf with completed form', async () => {
    const { ctx, form, id } = await setupTestForm(
      await createTestFormWithPDF()
    );
    const formData = getMockFormData(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: createFormSession(form),
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      action: 'action/page-set/root',
      ...formData,
    });
    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        data: {
          session: expect.any(Object),
          sessionId: formSessionResult.data.id,
          documents: [
            {
              fileName: 'test.pdf',
              data: expect.any(Uint8Array),
            },
          ],
        },
      })
    );
  });
});

describe('multi-page form', () => {
  const setupMultiPageForm = async () => {
    const form = createForm(
      {
        title: 'Test form',
        description: 'Test description',
      },
      {
        root: 'root',
        patterns: [
          {
            type: 'page-set',
            id: 'root',
            data: {
              pages: ['page-1', 'page-2'],
            },
          } satisfies PageSetPattern,
          {
            type: 'page',
            id: 'page-1',
            data: {
              title: 'Page 1',
              patterns: ['element-1'],
            },
          } satisfies PagePattern,
          {
            type: 'input',
            id: 'element-1',
            data: {
              label: 'Pattern 1',
              initial: '',
              required: true,
              hint: '',
            },
          } satisfies InputPattern,
          {
            type: 'page',
            id: 'page-2',
            data: {
              title: 'Page 2',
              patterns: ['element-2'],
            },
          } satisfies PagePattern,
          {
            type: 'input',
            id: 'element-2',
            data: {
              label: 'Pattern 2',
              initial: '',
              required: true,
              hint: '',
            },
          } satisfies InputPattern,
        ],
      }
    );
    const { ctx, id } = await setupTestForm(form);
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    return { ctx, id, formSessionResult, session };
  };

  it('handles page one of a multi-page form with valid data', async () => {
    const { ctx, id, formSessionResult, session } = await setupMultiPageForm();
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      id,
      {
        action: 'action/page-set/root',
        'element-1': 'test',
      },
      { url: '#', params: { page: '0' } }
    );
    expect(result).toEqual({
      success: true,
      data: {
        sessionId: formSessionResult.data.id,
        session: {
          ...session,
          data: {
            errors: {},
            values: {
              'element-1': 'test',
            },
          },
          route: {
            params: {
              page: '1',
            },
            url: '#',
          },
        },
      },
    });
  });

  it('handles page one of a multi-page form with invalid data', async () => {
    const { ctx, id, formSessionResult, session } = await setupMultiPageForm();
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      id,
      {
        action: 'action/page-set/root',
      },
      { url: '#', params: { page: '0' } }
    );
    expect(result).toEqual({
      success: true,
      data: {
        sessionId: formSessionResult.data.id,
        session: {
          ...session,
          data: {
            errors: {
              'element-1': {
                message: 'Invalid input',
                type: 'custom',
              },
            },
            values: {
              'element-1': undefined,
            },
          },
          route: {
            params: {
              page: '0',
            },
            url: '#',
          },
        },
      },
    });
  });

  it('handles page two of a multi-page form', async () => {
    const { ctx, id, formSessionResult, session } = await setupMultiPageForm();

    // First, submit page one
    const pageOneResult = await submitForm(ctx, formSessionResult.data.id, id, {
      action: 'action/page-set/root',
      'element-1': 'test',
    });
    if (!pageOneResult.success) {
      expect.fail('submitForm failed');
    }

    // Then, submit page two
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      id,
      {
        action: 'action/page-set/root',
        'element-2': 'test2',
      },
      { url: '#', params: { page: '1' } }
    );

    expect(result).toEqual({
      success: true,
      data: {
        sessionId: formSessionResult.data.id,
        session: {
          ...session,
          data: {
            errors: {},
            values: {
              'element-1': 'test',
              'element-2': 'test2',
            },
          },
          route: {
            params: {
              page: '1',
            },
            url: '#',
          },
        },
      },
    });
  });

  // You can add more tests here using the setupMultiPageForm function
});

const setupTestForm = async (form?: Blueprint) => {
  form =
    form ||
    createForm(
      { title: 'test', description: 'description' },
      {
        root: 'root',
        patterns: [
          {
            id: 'root',
            type: 'page-set',
            data: {
              pages: ['page-1'],
            },
          } satisfies PageSetPattern,
          {
            id: 'page-1',
            type: 'page',
            data: {
              title: 'Page 1',
              patterns: [],
            },
          } satisfies PagePattern,
        ],
      }
    );
  const ctx = await createTestFormServiceContext({
    isUserLoggedIn: () => false,
  });
  const addFormResult = await ctx.repository.addForm(form);
  if (addFormResult.success === false) {
    expect.fail('addForm failed');
  }
  return { ctx, id: addFormResult.data.id, form };
};

const createOnePatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            hint: '',
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: '',
            required: true,
            hint: '',
          },
        } satisfies InputPattern,
      ],
    }
  );
};
