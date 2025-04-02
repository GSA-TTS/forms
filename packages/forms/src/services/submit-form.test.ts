import { describe, expect, it } from 'vitest';

import { createTestFormServiceContext } from '../testing.js';
import { submitForm } from './submit-form.js';
import {
  createTestFormWithPDF,
  getMockFormData,
} from '../documents/__tests__/test-documents.js';
import { createFormSession } from '../session.js';
import { createForm } from '../blueprint.js';
import { type PageSetPattern } from '../patterns/pages/page-set/config.js';
import { type PagePattern } from '../patterns/pages/page/config.js';
import { type InputPattern } from '../patterns/input/config.js';
import { type Blueprint } from '../types.js';
import { Checkbox } from '../patterns/checkbox.js';
import { FieldSet } from '../patterns/fieldset/builder.js';
import { Page } from '../patterns/pages/page/builder.js';
import { PageSet } from '../patterns/pages/page-set/builder.js';
import { Form } from '../builder/index.js';
import { defaultFormConfig } from '../patterns/index.js';

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
              rules: [],
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
              rules: [],
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
});

describe('multi-page form with skip logic', () => {
  const setupMultiPageFormWithSkipLogic = async () => {
    const form = createMultiPageFormWithSkipLogic();
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

  it('falls back to next page when rule does not match', async () => {
    const { ctx, id, formSessionResult, session } =
      await setupMultiPageFormWithSkipLogic();
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
        attachments: undefined,
        session: {
          data: {
            errors: {},
            values: {
              checkbox1: false,
              checkbox2: false,
            },
          },
          form: session.form,
          route: {
            params: {
              page: '1',
            },
            url: '#',
          },
        },
        sessionId: formSessionResult.data.id,
      },
    });
  });
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
              rules: [],
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
            rules: [],
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

const createMultiPageFormWithSkipLogic = () => {
  const checkbox1 = new Checkbox(
    { label: 'Checkbox1', defaultChecked: false },
    'checkbox1'
  );
  const checkbox2 = new Checkbox(
    { label: 'Checkbox2', defaultChecked: false },
    'checkbox2'
  );
  const fieldset = new FieldSet({
    legend: 'Constraints',
    patterns: [checkbox1.id, checkbox2.id],
  });
  const page1 = new Page({
    title: 'Page 1',
    patterns: [fieldset.id],
    rules: [
      {
        patternId: 'rule1',
        condition: { operator: '=', value: '' },
        next: 'Eligible',
      },
    ],
  });
  const checkbox3 = new Checkbox({ label: 'Checkbox3', defaultChecked: false });
  const checkbox4 = new Checkbox({ label: 'Checkbox4', defaultChecked: false });
  const fieldset2 = new FieldSet({
    legend: 'Constraints',
    patterns: [checkbox3.id, checkbox4.id],
  });
  const page2 = new Page({
    title: 'Page 2',
    patterns: [fieldset2.id],
    rules: [],
  });
  const page3 = new Page({
    title: 'Page 3',
    patterns: [],
    rules: [],
  });
  const pageSet = new PageSet(
    {
      pages: [page1.id, page2.id, page3.id],
    },
    'root'
  );
  const form = new Form(defaultFormConfig, {
    summary: {
      title: 'Test form',
      description: 'Test description',
    },
    root: pageSet.id,
    patterns: {
      [pageSet.id]: pageSet.toPattern(),
      [page1.id]: page1.toPattern(),
      [page2.id]: page2.toPattern(),
      [page3.id]: page3.toPattern(),
      [fieldset.id]: fieldset.toPattern(),
      [checkbox1.id]: checkbox1.toPattern(),
      [checkbox2.id]: checkbox2.toPattern(),
    },
    outputs: [],
  });
  return form.bp;
};
