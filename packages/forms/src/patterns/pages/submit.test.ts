import { describe, expect, it } from 'vitest';

import { success } from '@gsa-tts/forms-common';

import { createTestBrowserFormService } from '../../context';
import { createFormSession } from '../../session';
import type { Blueprint } from '../../types';

import { Input } from '../input/builder';

import { PageSet } from './page-set/builder';
import { submitPage } from './submit';
import { defaultFormConfig } from '..';
import { Page } from './page/builder';
import { FormClient } from './form-client';

describe('Page-set submission', () => {
  it('stores session data for valid page data', async () => {
    const session = createTestSession();
    const result = await submitPage(
      {
        config: defaultFormConfig,
        getDocument: () =>
          Promise.resolve(
            success({ id: 'id', data: new Uint8Array(), path: '', fields: {} })
          ),
      },
      {
        pattern: session.form.patterns['page-set-1'],
        session,
        data: {
          'input-1': 'test',
        },
      }
    );
    expect(result).toEqual({
      data: {
        session: {
          ...session,
          data: {
            errors: {},
            values: {
              'input-1': 'test',
            },
          },
          route: {
            url: '#',
            params: {
              page: '1',
            },
          },
          form: session.form,
        },
      },
      success: true,
    });
  });

  it('stores session data for invalid page data', async () => {
    const session = createTestSession();
    const result = await submitPage(
      {
        config: defaultFormConfig,
        getDocument: () =>
          Promise.resolve(
            success({ id: 'id', data: new Uint8Array(), path: '', fields: {} })
          ),
      },
      {
        pattern: session.form.patterns['page-set-1'],
        session,
        data: {
          'input-1': '',
        },
      }
    );
    expect(result).toEqual({
      data: {
        session: {
          ...session,
          data: {
            errors: {
              'input-1': {
                type: 'custom',
                message: 'This field is required',
              },
            },
            values: {
              'input-1': '',
            },
          },
          route: {
            url: '#',
            params: {
              page: '0',
            },
          },
          form: session.form,
        },
      },
      success: true,
    });
  });

  it('terminates on the last page', async () => {
    const session = createTestSession();
    const result = await submitPage(
      {
        config: defaultFormConfig,
        getDocument: () =>
          Promise.resolve(
            success({ id: 'id', data: new Uint8Array(), path: '', fields: {} })
          ),
      },
      {
        pattern: session.form.patterns['page-set-1'],
        session: {
          ...session,
          route: {
            url: '#',
            params: {
              page: '1',
            },
          },
        },
        data: {
          'input-2': 'test',
        },
      }
    );
    expect(result).toEqual({
      data: {
        session: {
          ...session,
          data: {
            errors: {},
            values: {
              'input-2': 'test',
            },
          },
          route: {
            url: '#',
            params: {
              page: '2',
            },
          },
          form: session.form,
        },
      },
      success: true,
    });
  });

  it('honors first matching page rule', async () => {
    const { id, form, formService } = await createTestFormContext();
    const client = new FormClient(
      {
        config: defaultFormConfig,
        formService,
      },
      id,
      form
    );
    await client.submitPage({
      'input-1': 'rule-2',
    });
    const state = await client.getState();
    expect(state).toEqual(
      expect.objectContaining({
        attachments: undefined,
        sessionId: expect.any(String),
        session: {
          data: {
            errors: {},
            values: {
              'input-1': 'rule-2',
            },
          },
          route: {
            url: '#',
            params: {
              page: '2',
            },
          },
          form,
        },
      })
    );
  });
});

const createTestSession = () => {
  const testForm = createTestForm();
  return createFormSession(testForm, { url: '#', params: { page: '0' } });
};

const createTestForm = () => {
  const input1 = new Input({ label: 'label', required: true }, 'input-1');
  const input2 = new Input({ label: 'label', required: true }, 'input-2');
  const page1 = new Page(
    {
      title: 'Page 1',
      patterns: [input1.id],
      rules: [
        {
          patternId: input1.id,
          condition: { value: 'rule-1', operator: '=' },
          next: 'page-2',
        },
        {
          patternId: input1.id,
          condition: { value: 'rule-2', operator: '=' },
          next: 'page-3',
        },
      ],
    },
    'page-1'
  );
  const page2 = new Page(
    { title: 'Page 2', patterns: [input2.id], rules: [] },
    'page-2'
  );
  const page3 = new Page(
    { title: 'Page 3', patterns: [], rules: [] },
    'page-3'
  );
  const pageSet = new PageSet(
    { pages: [page1.id, page2.id, page3.id] },
    'page-set-1'
  );
  const testForm: Blueprint = {
    summary: {
      description: 'A test form',
      title: 'Test form',
    },
    root: pageSet.id,
    patterns: {
      [page1.id]: page1.toPattern(),
      [page2.id]: page2.toPattern(),
      [page3.id]: page3.toPattern(),
      [pageSet.id]: pageSet.toPattern(),
      [input1.id]: input1.toPattern(),
      [input2.id]: input2.toPattern(),
    },
    outputs: [],
  };
  return testForm;
};

const createTestFormContext = async () => {
  const form = createTestForm();
  const formService = createTestBrowserFormService();
  const addFormResult = await formService.addForm(form);
  if (!addFormResult.success) {
    expect.fail('Error adding test form');
  }
  return {
    id: addFormResult.data.id,
    form,
    formService,
  };
};
