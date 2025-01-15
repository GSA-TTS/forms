import {
  PDFDocument,
  PDFName,
  createPDFAcroFields,
  type PDFForm,
} from 'pdf-lib';

import { Result } from '@atj/common';
import { type FormOutput } from '../../index.js';
import { type PDFFieldType } from './index.js';

export const createFormOutputFieldData = (
  output: FormOutput,
  formData: Record<string, string>
): Record<string, { value: any; type: PDFFieldType }> => {
  const results = {} as Record<string, { value: any; type: PDFFieldType }>;
  Object.entries(output.fields).forEach(([patternId, docField]) => {
    if (docField.type === 'not-supported') {
      console.error(`unsupported field: ${patternId}: ${docField}`);
      return;
    }
    const outputFieldId = output.formFields[patternId];
    if (outputFieldId === '') {
      console.error(`empty outputFieldId for field: ${patternId}: ${docField}`);
      return;
    }
    results[outputFieldId] = {
      type: docField.type,
      value: formData[patternId],
    };
  });
  return results;
};

export const fillPDF = async (
  pdfBytes: Uint8Array,
  fieldData: Record<string, { value: any; type: PDFFieldType }>
): Promise<Result<Uint8Array>> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  try {
    Object.entries(fieldData).forEach(([name, value]) => {
      setFormFieldData(form, value.type, name, value.value);
    });
  } catch (error: any) {
    const fieldDataNames = Object.keys(fieldData); // names we got from API
    const fields = form.getFields();
    const fieldNames = fields.map(field => field.getName()); // fieldnames we ripped from the PDF

    // Combine the two arrays with an indication of their source
    const combinedNames = [
      ...fieldDataNames.map(name => ({ name, source: 'API' })),
      ...fieldNames.map(name => ({ name, source: 'pdf-lib' })),
    ];

    // Use a Map to keep track of unique names and their sources
    const uniqueNamesMap = new Map();

    combinedNames.forEach(({ name, source }) => {
      if (!uniqueNamesMap.has(name)) {
        uniqueNamesMap.set(name, []);
      }
      uniqueNamesMap.get(name).push(source);
    });

    // Convert the Map to an array of objects and sort it alphabetically by name
    const uniqueNamesArray = Array.from(uniqueNamesMap.entries())
      .map(([name, sources]) => ({ name, sources }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (error?.message) {
      return {
        success: false,
        error: error?.message || 'error setting PDF field',
      };
    }

    return {
      success: false,
      error: error?.message || 'error setting PDF field',
    };
  }
  return {
    success: true,
    data: await pdfDoc.save(),
  };
};

const setFormFieldData = (
  form: PDFForm,
  fieldType: PDFFieldType,
  fieldName: string,
  fieldValue: any
) => {
  if (fieldType === 'TextField') {
    const field = form.getTextField(fieldName);
    field.setText(fieldValue);
  } else if (fieldType === 'CheckBox') {
    const field = form.getCheckBox(fieldName);
    if (fieldValue) {
      field.check();
    } else {
      field.uncheck();
    }
  } else if (fieldType === 'Attachment') {
    const field = form.getDropdown(fieldName);
    field.select(fieldValue);
  } else if (fieldType === 'Dropdown') {
    const field = form.getDropdown(fieldName);
    field.select(fieldValue);
  } else if (fieldType === 'OptionList') {
    const field = form.getDropdown(fieldName);
    field.select(fieldValue);
  } else if (fieldType === 'RadioGroup') {
    // TODO: harmonize the option ids between pdf-lib and the API at ingestion time
    try {
      const field = form.getRadioGroup(fieldName);
      field.select(fieldValue);
    } catch (error: any) {
      // This logic should work even if pdf-lib misidentifies the field type
      // TODO: radioParent should contain the name, not the id
      const [radioParent, radioChild] = fieldValue.split('.');
      if (radioChild) {
        // TODO: resolve import failure when spaces are present in name, id
        const radioChildWithSpace = radioChild.replace('_', ' ');
        const field = form.getField(fieldName);
        const acroField = field.acroField;
        acroField.dict.set(PDFName.of('V'), PDFName.of(radioChildWithSpace));
        const kids = createPDFAcroFields(acroField.Kids()).map(_ => _[0]);
        kids.forEach(kid => {
          kid.dict.set(PDFName.of('AS'), PDFName.of(radioChildWithSpace));
        });
      }
    }
  } else if (fieldType === 'Paragraph' || fieldType === 'RichText') {
    // do nothing
  } else {
    const exhaustiveCheck: never = fieldType;
  }
};
