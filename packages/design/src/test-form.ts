import {
  createForm,
  createFormSession,
  defaultFormConfig,
  type Blueprint,
  type Pattern,
} from '@gsa-tts/forms-core';
import { createTestBrowserFormService } from '@gsa-tts/forms-core/context';
import { type InputPattern } from '@gsa-tts/forms-core';
import { type PagePattern } from '@gsa-tts/forms-core';
import { type PageSetPattern } from '@gsa-tts/forms-core';
import { type SequencePattern } from '@gsa-tts/forms-core';

import { type FormSummaryPattern } from '@gsa-tts/forms-core';
import { type FormUIContext } from './Form/types.js';
import { defaultPatternComponents } from './Form/components/index.js';
import { defaultPatternEditComponents } from './FormManager/FormEdit/components/index.js';
import { type FormManagerContext } from './FormManager/types.js';
import { FormRoute } from '../../forms/dist/types/route-data.js';

export interface TestFormConfig {
  pageCount?: number;
  pageTitles?: string[];
  patternCount?: number;
  requiredInputs?: boolean;
  useSequence?: boolean;
  formTitle?: string;
  formDescription?: string;
  formSummaryTitle?: string;
  formSummaryDescription?: string;
  initialValues?: string[];
  patternLabels?: string[];
  patternDistribution?: Record<number, string[]>;
  singlePattern?: Pattern;
}

export const createPatternTestForm = (config: TestFormConfig = {}) => {
  const {
    pageCount = 1,
    pageTitles = Array(Math.max(1, pageCount))
      .fill(0)
      .map((_, i) => `Page ${i + 1}`),
    patternCount = 2,
    requiredInputs = true,
    useSequence = true,
    formTitle = 'Test form',
    formDescription = 'Test description',
    formSummaryTitle = 'New Form Title',
    formSummaryDescription = 'New form description',
    initialValues = [
      '',
      'test',
      ...Array(Math.max(0, patternCount - 2)).fill(''),
    ],
    patternLabels = Array(Math.max(1, patternCount))
      .fill(0)
      .map((_, i) => `Pattern ${i + 1}`),
    singlePattern = null,
  } = config;

  const formMeta = {
    title: formTitle,
    description: formDescription,
  };

  const pageIds = Array(pageCount)
    .fill(0)
    .map((_, i) => `page-${i + 1}`);
  const inputIds = Array(patternCount)
    .fill(0)
    .map((_, i) => `element-${i + 1}`);
  const formSummaryId = 'form-summary-1';
  const patterns: Pattern[] = [];

  if (singlePattern) {
    return createForm(formMeta, {
      root: 'root',
      patterns: [
        {
          type: 'sequence',
          id: 'root',
          data: {
            patterns: [singlePattern.id],
          },
        } as SequencePattern,
        singlePattern,
      ],
    });
  }

  if (useSequence) {
    patterns.push({
      type: 'sequence',
      id: 'root',
      data: {
        patterns: [formSummaryId, ...inputIds],
      },
    } as SequencePattern);
  } else {
    patterns.push({
      type: 'page-set',
      id: 'root',
      data: {
        pages: pageIds,
      },
    } as PageSetPattern);

    pageIds.forEach((pageId, index) => {
      let pagePatterns: string[] = [];

      if (index === 0) {
        pagePatterns.push(formSummaryId);
      }

      if (config.patternDistribution && config.patternDistribution[index]) {
        pagePatterns = [...pagePatterns, ...config.patternDistribution[index]];
      } else if (index === 0) {
        pagePatterns = [...pagePatterns, ...inputIds];
      }

      patterns.push({
        type: 'page',
        id: pageId,
        data: {
          title: pageTitles[index] || `Page ${index + 1}`,
          patterns: pagePatterns,
        },
      } as PagePattern);
    });
  }

  inputIds.forEach((id, index) => {
    patterns.push({
      type: 'input',
      id,
      data: {
        label: patternLabels[index] || `Pattern ${index + 1}`,
        initial: initialValues[index] || '',
        required: requiredInputs,
      },
    } as InputPattern);
  });

  patterns.push({
    type: 'form-summary',
    id: formSummaryId,
    data: {
      title: formSummaryTitle,
      description: formSummaryDescription,
    },
  } as FormSummaryPattern);

  return createForm(formMeta, {
    root: 'root',
    patterns,
  });
};

export const createTestFormConfig = () => {
  return defaultFormConfig;
};

export const createTestPatternComponentMap = () => {
  return defaultPatternComponents;
};

export const createTestFormContext = (): FormUIContext => {
  return {
    config: defaultFormConfig,
    components: defaultPatternComponents,
    uswdsRoot: '/uswds/',
  };
};

export const createTestFormManagerContext = (): FormManagerContext => {
  const mockGetUrl = (id: string) => id;

  return {
    baseUrl: '/',
    components: defaultPatternComponents,
    config: defaultFormConfig,
    editComponents: defaultPatternEditComponents,
    formService: createTestBrowserFormService(),
    uswdsRoot: `/static/uswds/`,
    urlForForm: mockGetUrl,
    urlForFormManager: mockGetUrl,
  };
};

export const createTestSession = (options?: {
  form?: Blueprint;
  route?: FormRoute;
}) => {
  return createFormSession(
    options?.form || createPatternTestForm(),
    options?.route
  );
};
