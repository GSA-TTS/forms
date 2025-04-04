import {
  addFormOutput,
  addPatternMap,
  addPatterns,
  updateFormSummary,
} from '../blueprint.js';
import { type Pattern } from '../pattern.js';
import { type InputPattern } from '../patterns/input/config.js';
import { type SequencePattern } from '../patterns/sequence.js';
import { type Blueprint } from '../types.js';
import { getDocumentFieldData } from './pdf/extract.js';

import { type PDFDocument } from './pdf/index.js';
import {
  type FetchPdfApiResponse,
  type ParsedPdf,
  fetchPdfApiResponse,
  processApiResponse,
} from './pdf/parsing-api.js';

import { type DocumentFieldMap } from './types.js';

export type DocumentTemplate = PDFDocument;

export const addParsedPdfToForm = async (
  form: Blueprint,
  document: {
    id: string;
    label: string;
    extract: ParsedPdf;
  }
) => {
  form = addPatternMap(form, document.extract.patterns, document.extract.root);
  const updatedForm = addFormOutput(form, {
    id: document.id,
    path: document.label,
    fields: document.extract.outputs,
    formFields: Object.fromEntries(
      Object.keys(document.extract.outputs).map(output => {
        return [output, document.extract.outputs[output].name];
      })
    ),
  });
  return {
    newFields: document.extract.outputs,
    updatedForm,
    errors: document.extract.errors,
  };
};

export const addDocument = async (
  form: Blueprint,
  fileDetails: {
    name: string;
    data: Uint8Array;
  },
  context: {
    fetchPdfApiResponse: FetchPdfApiResponse;
  } = { fetchPdfApiResponse }
) => {
  const fields = await getDocumentFieldData(fileDetails.data);
  const json = await context.fetchPdfApiResponse(fileDetails.data);
  const parsedPdf = await processApiResponse(json);

  if (parsedPdf) {
    form = updateFormSummary(form, {
      title: parsedPdf.title || fileDetails.name,
      description: parsedPdf.description,
    });
    form = addPatternMap(form, parsedPdf.patterns, parsedPdf.root);
    const updatedForm = addFormOutput(form, {
      id: 'document-1', // TODO: generate a unique ID
      path: fileDetails.name,
      fields: parsedPdf.outputs,
      formFields: Object.fromEntries(
        Object.keys(parsedPdf.outputs).map(output => {
          return [output, parsedPdf.outputs[output].name];
        })
      ),
    });
    return {
      newFields: fields,
      updatedForm,
      errors: parsedPdf.errors,
    };
  } else {
    const formWithFields = addDocumentFieldsToForm(form, fields);
    const updatedForm = addFormOutput(formWithFields, {
      id: 'document-1', // TODO: generate a unique ID
      path: fileDetails.name,
      fields,
      // TODO: for now, reuse the field IDs from the PDF. we need to generate
      // unique ones, instead.
      formFields: Object.fromEntries(
        Object.keys(fields).map(field => {
          return [field, fields[field].name];
        })
      ),
    });
    return {
      newFields: fields,
      updatedForm,
    };
  }
};

export const addDocumentFieldsToForm = (
  form: Blueprint,
  fields: DocumentFieldMap
) => {
  const patterns: Pattern[] = [];
  Object.entries(fields).map(([patternId, field]) => {
    if (field.type === 'CheckBox') {
      patterns.push({
        type: 'input',
        id: patternId,
        data: {
          label: field.label,
          initial: '',
          required: false,
        },
      } satisfies InputPattern);
    } else if (field.type === 'OptionList') {
      patterns.push({
        type: 'input',
        id: patternId,
        data: {
          label: field.label,
          initial: '',
          required: false,
        },
      } satisfies InputPattern);
    } else if (field.type === 'Dropdown') {
      patterns.push({
        type: 'input',
        id: patternId,
        data: {
          label: field.label,
          initial: '',
          required: false,
        },
      } satisfies InputPattern);
    } else if (field.type === 'TextField') {
      patterns.push({
        type: 'input',
        id: patternId,
        data: {
          label: field.label,
          initial: '',
          required: false,
        },
      } satisfies InputPattern);
    } else if (field.type === 'RadioGroup') {
      patterns.push({
        type: 'input',
        id: patternId,
        data: {
          label: field.label,
          initial: '',
          required: false,
        },
      } satisfies InputPattern);
    } else if (field.type === 'Paragraph' || field.type === 'RichText') {
      // skip purely presentational fields
    } else if (field.type === 'not-supported') {
      console.error(`Skipping field: ${field.error}`);
    } else {
      const _exhaustiveCheck: never = field;
    }
  });
  patterns.push({
    id: 'root',
    type: 'sequence',
    data: {
      patterns: patterns.map(pattern => pattern.id),
    },
  } satisfies SequencePattern);
  return addPatterns(form, patterns, 'root');
};
