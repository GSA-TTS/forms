import { describe, expect, it } from 'vitest';

import { loadSamplePDF } from './sample-data.js';
import { getDocumentFieldData } from '../pdf/extract.js';

describe('PDF form field extraction', () => {
  it('extracts data from California UD-105 form', async () => {
    const pdfBytes = await loadSamplePDF('ca-unlawful-detainer/ud105.pdf');
    const fields = await getDocumentFieldData(pdfBytes);
    expect(fields).toBeDefined();
  });
});
