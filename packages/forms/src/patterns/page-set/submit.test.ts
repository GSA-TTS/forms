import { describe, expect, it } from 'vitest';

import { type Blueprint, defaultFormConfig } from '../..';
import { Input } from '../input/builder';
import { Page } from '../page/builder';
import { createFormSession } from '../../session';

import { PageSet } from './builder';
import { submitPage } from './submit';
import { success } from '@gsa-tts/forms-common';

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
              page: '1',
            },
          },
          form: session.form,
        },
      },
      success: true,
    });
  });
});

const createTestSession = () => {
  const input1 = new Input(
    { label: 'label', required: true, maxLength: 10 },
    'input-1'
  );
  const input2 = new Input(
    { label: 'label', required: true, maxLength: 10 },
    'input-2'
  );
  const page1 = new Page({ title: 'Page 1', patterns: [input1.id] }, 'page-1');
  const page2 = new Page({ title: 'Page 2', patterns: [input2.id] }, 'page-2');
  const pageSet = new PageSet({ pages: [page1.id, page2.id] }, 'page-set-1');
  const testForm: Blueprint = {
    summary: {
      description: 'A test form',
      title: 'Test form',
    },
    root: pageSet.id,
    patterns: {
      [page1.id]: page1.toPattern(),
      [page2.id]: page2.toPattern(),
      [pageSet.id]: pageSet.toPattern(),
      [input1.id]: input1.toPattern(),
      [input2.id]: input2.toPattern(),
    },
    outputs: [],
  };
  return createFormSession(testForm, { url: '#', params: { page: '0' } });
};
