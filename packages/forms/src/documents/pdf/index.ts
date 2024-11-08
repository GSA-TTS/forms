import { getDocumentFieldData } from './extract.js';
import {
  type ParsedPdf,
  fetchPdfApiResponse,
  processApiResponse,
} from './parsing-api.js';
import type { DocumentFieldMap } from '../types.js';

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
  | 'RichText';

export type ParsePdf = (
  pdf: Uint8Array
) => Promise<{ parsedPdf: ParsedPdf; fields: DocumentFieldMap }>;

export const parsePdf: ParsePdf = async (pdfBytes: Uint8Array) => {
  const fields = await getDocumentFieldData(pdfBytes);
  const apiResponse = await fetchPdfApiResponse(pdfBytes);
  const parsedPdf = await processApiResponse(apiResponse);
  return { parsedPdf, fields };
};
