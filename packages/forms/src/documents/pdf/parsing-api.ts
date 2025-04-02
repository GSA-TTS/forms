import * as z from 'zod';

import { type FieldsetPattern } from '../../patterns/fieldset/config.js';
import { type InputPattern } from '../../patterns/input/config.js';
import { PagePattern } from '../../patterns/pages/page/config.js';
import { PageSetPattern } from '../../patterns/pages/page-set/config.js';
import { type ParagraphPattern } from '../../patterns/paragraph.js';
import { type CheckboxPattern } from '../../patterns/checkbox.js';
import { type RadioGroupPattern } from '../../patterns/radio-group.js';
import { RichTextPattern } from '../../patterns/rich-text.js';

import { uint8ArrayToBase64 } from '../../util/base64.js';
import { type DocumentFieldMap } from '../types.js';
import {
  createPattern,
  FormConfig,
  Pattern,
  PatternId,
  PatternMap,
} from '../../pattern.js';
import { FormErrors } from '../../error.js';
import { defaultFormConfig } from '../../patterns/index.js';

const FormSummary = z.object({
  component_type: z.literal('form_summary'),
  title: z.string(),
  description: z.string(),
});

const TxInput = z.object({
  component_type: z.literal('text_input'),
  id: z.string(),
  label: z.string(),
  default_value: z.string(),
  required: z.boolean(),
  page: z.union([z.number(), z.string()]),
});

const Checkbox = z.object({
  component_type: z.literal('checkbox'),
  id: z.string(),
  label: z.string(),
  default_checked: z.boolean(),
  page: z.union([z.number(), z.string()]),
});

const RadioGroupOption = z.object({
  id: z.string(),
  label: z.string(),
  name: z.string(),
  default_checked: z.boolean(),
  page: z.union([z.number(), z.string()]),
});

const RadioGroup = z.object({
  id: z.string(),
  component_type: z.literal('radio_group'),
  legend: z.string(),
  options: RadioGroupOption.array(),
  page: z.union([z.number(), z.string()]),
});

const Paragraph = z.object({
  component_type: z.literal('paragraph'),
  text: z.string(),
  page: z.union([z.number(), z.string()]),
});

const RichText = z.object({
  component_type: z.literal('rich_text'),
  text: z.string(),
  page: z.union([z.number(), z.string()]),
});

const Fieldset = z.object({
  component_type: z.literal('fieldset'),
  legend: z.string(),
  fields: z.union([TxInput, Checkbox]).array(),
  page: z.union([z.number(), z.string()]),
});

const ExtractedObject = z.object({
  raw_text: z.string(),
  form_summary: FormSummary,
  elements: z
    .union([TxInput, Checkbox, RadioGroup, Paragraph, Fieldset, RichText])
    .array(),
});

type ExtractedObject = z.infer<typeof ExtractedObject>;

export type ParsedPdf = {
  patterns: PatternMap;
  errors: {
    type: Pattern['type'];
    data: Pattern['data'];
    errors: FormErrors;
  }[];
  outputs: DocumentFieldMap; // to populate FormOutput
  root: PatternId;
  title: string;
  description: string;
};

export type FetchPdfApiResponse = (
  rawData: Uint8Array,
  url?: string
) => Promise<any>;

export const fetchPdfApiResponse: FetchPdfApiResponse = async (
  rawData: Uint8Array,
  url: string = 'https://10x-atj-doc-automation-staging.app.cloud.gov/api/v2/parse' // 'http://localhost:5000/api/v2/parse'
) => {
  const base64 = await uint8ArrayToBase64(rawData);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pdf: base64,
    }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const processApiResponse = async (json: any): Promise<ParsedPdf> => {
  const extracted: ExtractedObject = ExtractedObject.parse(json.parsed_pdf);
  const rootSequence: PatternId[] = [];
  const pagePatterns: Record<PatternId, PatternId[]> = {};
  const parsedPdf: ParsedPdf = {
    patterns: {},
    errors: [],
    outputs: {},
    root: 'root',
    title: extracted.form_summary.title || 'Default Form Title',
    description:
      extracted.form_summary.description || 'Default Form Description',
  };

  const summary = processPatternData(
    defaultFormConfig,
    parsedPdf,
    'form-summary',
    {
      title: extracted.form_summary.title || 'Default Form Title',
      description:
        extracted.form_summary.description || 'Default Form Description',
    }
  );
  if (summary) {
    rootSequence.push(summary.id);
  }

  for (const element of extracted.elements) {
    const fieldsetPatterns: PatternId[] = [];
    // Add paragraph elements
    if (element.component_type === 'paragraph') {
      const paragraph = processPatternData<ParagraphPattern>(
        defaultFormConfig,
        parsedPdf,
        'paragraph',
        {
          text: element.text,
        }
      );
      if (paragraph) {
        pagePatterns[element.page] = (pagePatterns[element.page] || []).concat(
          paragraph.id
        );
      }
      continue;
    }

    if (element.component_type === 'rich_text') {
      const richText = processPatternData<RichTextPattern>(
        defaultFormConfig,
        parsedPdf,
        'rich-text',
        {
          text: element.text,
        }
      );
      if (richText) {
        pagePatterns[element.page] = (pagePatterns[element.page] || []).concat(
          richText.id
        );
      }
      continue;
    }

    if (element.component_type === 'checkbox') {
      const checkboxPattern = processPatternData<CheckboxPattern>(
        defaultFormConfig,
        parsedPdf,
        'checkbox',
        {
          label: element.label,
          defaultChecked: element.default_checked,
        }
      );
      if (checkboxPattern) {
        pagePatterns[element.page] = (pagePatterns[element.page] || []).concat(
          checkboxPattern.id
        );
        parsedPdf.outputs[checkboxPattern.id] = {
          type: 'CheckBox',
          name: element.id,
          label: element.label,
          value: false,
          required: true,
        };
      }
      continue;
    }

    if (element.component_type === 'radio_group') {
      const radioGroupPattern = processPatternData<RadioGroupPattern>(
        defaultFormConfig,
        parsedPdf,
        'radio-group',
        {
          label: element.legend,
          hint: '',
          options: element.options.map(option => ({
            id: option.id,
            label: option.label,
            name: option.name,
            defaultChecked: option.default_checked,
          })),
          required: false,
        }
      );
      if (radioGroupPattern) {
        pagePatterns[element.page] = (pagePatterns[element.page] || []).concat(
          radioGroupPattern.id
        );
        parsedPdf.outputs[radioGroupPattern.id] = {
          type: 'RadioGroup',
          name: element.id,
          label: element.legend,
          options: element.options.map(option => ({
            id: option.id,
            label: option.label,
            name: option.name,
            defaultChecked: option.default_checked,
          })),
          value: '',
          required: true,
        };
      }
      continue;
    }

    if (element.component_type === 'fieldset') {
      for (const input of element.fields) {
        if (input.component_type === 'text_input') {
          const inputPattern = processPatternData<InputPattern>(
            defaultFormConfig,
            parsedPdf,
            'input',
            {
              label: input.label,
              required: false,
              initial: '',
            }
          );
          if (inputPattern) {
            fieldsetPatterns.push(inputPattern.id);
            parsedPdf.outputs[inputPattern.id] = {
              type: 'TextField',
              name: input.id,
              label: input.label,
              value: '',
              maxLength: 1024,
              required: input.required,
            };
          }
        }
        if (input.component_type === 'checkbox') {
          const checkboxPattern = processPatternData<CheckboxPattern>(
            defaultFormConfig,
            parsedPdf,
            'checkbox',
            {
              label: input.label,
              defaultChecked: false,
            }
          );
          if (checkboxPattern) {
            fieldsetPatterns.push(checkboxPattern.id);
            parsedPdf.outputs[checkboxPattern.id] = {
              type: 'CheckBox',
              name: input.id,
              label: input.label,
              value: false,
              required: true,
            };
          }
        }
      }
    }

    // Add fieldset to parsedPdf.patterns and rootSequence
    if (element.component_type === 'fieldset' && fieldsetPatterns.length > 0) {
      const fieldset = processPatternData<FieldsetPattern>(
        defaultFormConfig,
        parsedPdf,
        'fieldset',
        {
          legend: element.legend,
          patterns: fieldsetPatterns,
        }
      );
      if (fieldset) {
        pagePatterns[element.page] = (pagePatterns[element.page] || []).concat(
          fieldset.id
        );
      }
    }
  }

  // Create a pattern for the single, first page.
  const pages: PatternId[] = Object.entries(pagePatterns)
    .map(([page, patterns], idx) => {
      const pagePattern = processPatternData<PagePattern>(
        defaultFormConfig,
        parsedPdf,
        'page',
        {
          title: `${page}`,
          patterns,
          rules: [],
        },
        undefined,
        idx
      );
      return pagePattern?.id;
    })
    .filter(page => page !== undefined) as PatternId[];

  // Assign the page to the root page set.
  const rootPattern = processPatternData<PageSetPattern>(
    defaultFormConfig,
    parsedPdf,
    'page-set',
    {
      pages,
    },
    'root'
  );
  if (rootPattern) {
    parsedPdf.patterns['root'] = rootPattern;
  }
  return parsedPdf;
};

const processPatternData = <T extends Pattern>(
  config: FormConfig,
  parsedPdf: ParsedPdf,
  patternType: T['type'],
  patternData: T['data'],
  patternId?: PatternId,
  page?: number
) => {
  const result = createPattern<T>(config, patternType, patternData, patternId);
  if (!result.success) {
    parsedPdf.errors.push({
      type: patternType,
      data: patternData,
      errors: result.error,
    });
    return;
  }
  parsedPdf.patterns[result.data.id] = result.data;
  return result.data;
};
