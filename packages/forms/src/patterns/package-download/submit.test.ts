import { describe, expect, it } from 'vitest';

import { failure, success } from '@gsa-tts/forms-common';

import { type Blueprint, type FormSession, defaultFormConfig } from '../..';

import { downloadPackageHandler } from './submit';
import { PackageDownload } from './builder';
import { PageSet } from '../page-set/builder';
import { Page } from '../page/builder';
import { Input } from '../input/builder';
import { loadSamplePDF } from '../../documents/__tests__/sample-data';

describe('downloadPackageHandler', async () => {
  it('returns failure when form is not complete', async () => {
    const session: FormSession = {
      form: await createTestForm(),
      data: { errors: {}, values: {} },
      route: { url: '#', params: {} },
    };
    const result = await downloadPackageHandler(
      {
        config: defaultFormConfig,
        getDocument: () => Promise.resolve(failure('Document not found')),
      },
      {
        pattern: new PackageDownload({ text: 'Download now!' }).toPattern(),
        session,
        data: {},
      }
    );

    expect(result).toEqual(failure('Form is not complete'));
  });

  it('returns attachments on complete form', async () => {
    const session: FormSession = {
      form: await createTestForm(),
      data: {
        errors: {},
        values: {
          'input-1': '53555',
        },
      },
      route: { url: '#', params: {} },
    };
    const result = await downloadPackageHandler(
      {
        config: defaultFormConfig,
        getDocument: async () =>
          success({
            id: 'id',
            data: await loadSamplePDF(
              'doj-pardon-marijuana/demo-application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
            ),
            path: 'test.pdf',
            fields: {},
          }),
      },
      {
        pattern: new PackageDownload({ text: 'Download now!' }).toPattern(),
        session,
        data: {},
      }
    );
    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        data: {
          session,
          attachments: [
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

const createTestForm = async (): Promise<Blueprint> => {
  const pdfBytes = await loadSamplePDF(
    'doj-pardon-marijuana/demo-application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
  );
  const input1 = new Input(
    { label: 'Input 1', required: true, maxLength: 10 },
    'input-1'
  );
  const page1 = new Page({ title: 'Page 1', patterns: [input1.id] }, 'page-1');
  const pageSet = new PageSet({ pages: [page1.id] }, 'page-set');
  return {
    summary: {
      title: 'Test Form',
      description: 'A test form',
    },
    root: 'page-set',
    patterns: {
      'page-set': pageSet.toPattern(),
      'page-1': page1.toPattern(),
      'input-1': input1.toPattern(),
    },
    outputs: [
      {
        id: 'test-id',
        path: 'test.pdf',
        fields: {
          [input1.id]: {
            type: 'TextField',
            name: 'Zip Code',
            label: 'Zip Code',
            maxLength: 32,
            value: 'zipCode',
            required: true,
          },
        },
        formFields: {
          [input1.id]: 'Zip Code',
        },
      },
    ],
  };
};
