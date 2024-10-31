export { getDocumentFieldData } from './extract.js';
export * from './generate.js';
export { generateDummyPDF } from './generate-dummy.js';

export type PDFDocument = {
  type: 'pdf';
  fields: PDFField[];
};
export type PDFField = {
  id: string;
  type: PDFFieldType;
  label: string;
  default?: any;
};
export type PDFFieldType =
  | 'TextField'
  | 'CheckBox'
  | 'Dropdown'
  | 'OptionList'
  | 'RadioGroup'
  | 'Paragraph'
  | 'Repeater'
  | 'RichText';
