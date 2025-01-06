import { describe, expect, test } from 'vitest';

import { Success } from '@atj/common';

import { type DocumentFieldMap } from '../index.js';
import { fillPDF } from '../pdf/index.js';
import { getDocumentFieldData } from '../pdf/extract.js';

import { loadSamplePDF } from './sample-data.js';

describe('DOJ Pardon Attorney Office - Marijuana pardon application form', () => {
  /*
  test('works end-to-end', async () => {
    const formService = createTestBrowserFormService();
    const builder = new BlueprintBuilder(
      defaultFormConfig,
      createForm({
        title:
          'Application for Certificate of Pardon for Simple Possession, Attempted Possession, and Use of Marijuana',
        description: '',
      })
    );
    await builder.addDocument({
      name: '',
      data: await loadSamplePDF(
        'doj-pardon-marijuana/application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
      ),
    });

    const addResult = await formService.addForm(builder.bp);
    expect(addResult.success).toEqual(true);
    const formId = addResult.success ? addResult.data.id : '';
    const submitResult = await formService.submitForm(
      createFormSession(builder.bp),
      formId,
      {}
    );
    const documents: {
      fileName: string;
      data: Uint8Array;
    }[] = submitResult.success ? submitResult.data : [];
    expect(documents.length).toEqual(1);

    documents.map(document => {
      console.log('got document', document);
    });
  });
  */
  test('produces valid PDF from imported PDF', async () => {
    const pdfBytes = await loadSamplePDF(
      'doj-pardon-marijuana/application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
    );
    const result = (await fillPDF(pdfBytes, {
      Gender: {
        value: 'female',
        type: 'TextField',
      },
      'Docket No': {
        value: '12345',
        type: 'TextField',
      },
    })) as Success<Uint8Array>;
    expect(result.success).toEqual(true);
    const fields = await getDocumentFieldData(result.data);
    expect(getFieldByName(fields, 'Gender')).toEqual({
      label: 'Gender',
      name: 'Gender',
      maxLength: undefined,
      required: false,
      type: 'TextField',
      value: 'female',
    });
    expect(getFieldByName(fields, 'Docket No')).toEqual({
      label: 'Docket No',
      name: 'Docket No',
      maxLength: undefined,
      required: false,
      type: 'TextField',
      value: '12345',
    });
  });
});

const getFieldByName = (fields: DocumentFieldMap, name: string) => {
  for (const field of Object.values(fields)) {
    if (field.name === name) {
      return field;
    }
  }
  throw new Error(`field with name ${name} not found`);
};
