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

import { type FormUIContext } from './Form/index.js';
import { defaultPatternComponents } from './Form/components/index.js';
import { defaultPatternEditComponents } from './FormManager/FormEdit/components/index.js';
import { type FormManagerContext } from './FormManager/index.js';
import { FormRoute } from '../../forms/dist/types/route-data.js';

export const createOnePageTwoPatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: 'test',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

export const createTwoPageTwoPatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1', 'page-2'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'First page',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
        {
          type: 'page',
          id: 'page-2',
          data: {
            title: 'Second page',
            patterns: [],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: 'test',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

export const createTwoPatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'sequence',
          id: 'root',
          data: {
            patterns: ['element-1', 'element-2'],
          },
        } satisfies SequencePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: 'test',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

export const createSimpleTestBlueprint = (pattern: Pattern) => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'sequence',
          id: 'root',
          data: {
            patterns: [pattern.id],
          },
        } satisfies SequencePattern,
        pattern,
      ],
    }
  );
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
    options?.form || createTwoPatternTestForm(),
    options?.route
  );
};
