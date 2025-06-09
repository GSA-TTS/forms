import {
  PDFDocument,
  PDFName,
  PDFDict,
  PDFTextField,
  PDFField,
  PDFCheckBox,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
} from 'pdf-lib';

import { stringToBase64 } from '../../util/base64.js';
import type { DocumentFieldValue, DocumentFieldMap } from '../types.js';

// TODO: copied from pdf-lib acrofield internals, check if it's already exposed outside of acroform somewhere
export const getWidgets = async (pdfDoc: PDFDocument): Promise<PDFDict[]> => {
  return pdfDoc.context
    .enumerateIndirectObjects()
    .map(([, obj]) => obj)
    .filter(
      obj =>
        obj instanceof PDFDict &&
        obj.get(PDFName.of('Type')) === PDFName.of('Annot') &&
        obj.get(PDFName.of('Subtype')) === PDFName.of('Widget')
    )
    .map(obj => obj as PDFDict);
};

export const getDocumentFieldData = async (
  pdfBytes: Uint8Array
): Promise<DocumentFieldMap> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const widgets = (await getWidgets(pdfDoc)).filter(widget => {
    const ft = widget.get(PDFName.of('FT'));
    return ft instanceof PDFName;
  });

  pdfDoc.catalog.set(
    PDFName.of('AcroForm'),
    pdfDoc.context.obj({
      Fields: widgets.map(widget => pdfDoc.context.getObjectRef(widget)), // array of widget refs
    })
  );

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  return Object.fromEntries(
    fields.map(field => {
      return [stringToBase64(field.getName()), getFieldValue(field)];
    })
  );
};

const getFieldValue = (field: PDFField): DocumentFieldValue => {
  if (field instanceof PDFTextField) {
    return {
      type: 'TextField',
      name: field.getName(),
      label: field.getName(),
      value: field.getText() || '',
      maxLength: field.getMaxLength(),
      required: field.isRequired(),
    };
  } else if (field instanceof PDFCheckBox) {
    return {
      type: 'CheckBox',
      name: field.getName(),
      label: field.getName(),
      value: field.isChecked(),
      required: field.isRequired(),
    };
  } else if (field instanceof PDFDropdown) {
    return {
      type: 'Dropdown',
      name: field.getName(),
      label: field.getName(),
      value: field.getSelected(),
      required: field.isRequired(),
    };
  } else if (field instanceof PDFOptionList) {
    return {
      type: 'OptionList',
      name: field.getName(),
      label: field.getName(),
      value: field.getSelected(),
      required: field.isRequired(),
    };
  } else if (field instanceof PDFRadioGroup) {
    return {
      type: 'RadioGroup',
      name: field.getName(),
      options: field.getOptions(),
      label: field.getName(),
      value: field.getSelected() || '', // pdfLib allows this to be undefined
      required: field.isRequired(),
    };
  } else {
    return {
      type: 'not-supported',
      name: field.getName(),
      error: `unsupported type: ${field.constructor.name}`,
    };
  }
};
