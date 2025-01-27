import { describe, expect, it } from 'vitest';

import { getPattern } from '../../index.js';
import { BlueprintBuilder } from '../../builder/index.js';
import { defaultFormConfig } from '../../patterns/index.js';
import { type PageSetPattern } from '../../patterns/page-set/config.js';
import { type PagePattern } from '../../patterns/page/config.js';

import { addDocument } from '../document.js';
import { loadSamplePDF } from './sample-data.js';

describe('addDocument document processing', () => {
  it('creates expected blueprint', async () => {
    const builder = new BlueprintBuilder(defaultFormConfig);
    const pdfBytes = await loadSamplePDF(
      'doj-pardon-marijuana/demo-application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
    );
    const { updatedForm, errors } = await addDocument(
      builder.form,
      {
        name: 'test.pdf',
        data: new Uint8Array(pdfBytes),
      },
      {
        fetchPdfApiResponse: async () => {
          const { mockResponse } = await import('../pdf/mock-response.js');
          return mockResponse;
        },
      }
    );
    const rootPattern = getPattern<PageSetPattern>(
      updatedForm,
      updatedForm.root
    );

    console.error(JSON.stringify(errors, null, 2)); // Fix these
    expect(rootPattern).toEqual(expect.objectContaining({ type: 'page-set' }));
    expect(rootPattern.data.pages.length).toEqual(4);
    for (let page = 0; page < rootPattern.data.pages.length; page++) {
      const pagePattern = getPattern<PagePattern>(
        updatedForm,
        rootPattern.data.pages[page]
      );
      // As a sanity check, just confirm that there is content on the first page.
      expect(pagePattern.data.patterns.length).toBeGreaterThanOrEqual(1);
    }
  });
});
