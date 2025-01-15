import { z } from 'zod';
import { type Result } from '@atj/common';
import { type FormError } from '../../error.js';
import {
  type FormConfig,
  ParseUserInput,
  type Pattern,
  type PatternConfig,
  type PatternId,
  getPatternConfig,
} from '../../pattern.js';
import { safeZodParseFormErrors } from '../../util/zod.js';
import { createPrompt } from './prompt.js';

export type RepeaterPattern = Pattern<{
  legend?: string;
  showControls?: boolean;
  patterns: PatternId[];
}>;

const PromptActionSchema = z.object({
  type: z.literal('submit'),
  submitAction: z.union([
    z.literal('submit'),
    z.literal('next'),
    z.string().regex(/^action\/[^/]+\/[^/]+$/),
  ]),
  text: z.string(),
});

const configSchema = z.object({
  legend: z.string().min(1),
  showControls: z.boolean().optional(),
  patterns: z.union([
    z.array(z.string()),
    z
      .string()
      .transform(value =>
        value
          .split(',')
          .map(String)
          .filter(value => value)
      )
      .pipe(z.string().array()),
  ]),
  actions: z.array(PromptActionSchema).default([
    {
      type: 'submit',
      submitAction: 'submit',
      text: 'Submit',
    },
  ]),
});

export const parseConfigData = (obj: unknown) => {
  return safeZodParseFormErrors(configSchema, obj);
};

interface RepeaterSuccess {
  success: true;
  data: {
    [key: string]: Record<string, any>[];
  };
}

interface RepeaterFailure {
  success: false;
  error: FormError;
  data?: {
    [key: string]: Record<string, any>[];
  };
}

type RepeaterResult = RepeaterSuccess | RepeaterFailure;

export const repeaterConfig: PatternConfig<RepeaterPattern> = {
  displayName: 'Repeater',
  iconPath: 'block-icon.svg',
  initial: {
    legend: 'Default Heading',
    patterns: [],
    showControls: true,
  },
  // @ts-ignore
  parseUserInput: ((
    pattern: RepeaterPattern,
    input: unknown,
    config?: FormConfig<Pattern<any>, unknown>,
    form?: any
  ): RepeaterResult => {
    if (!config) {
      return {
        success: false,
        error: {
          type: 'custom',
          message: 'Form configuration is required',
        },
        data: {
          [pattern.id]: [],
        },
      };
    }

    const values = input as Array<Record<string, any>>;
    if (!Array.isArray(values)) {
      return {
        success: false,
        error: {
          type: 'custom',
          message: 'Invalid repeater input format',
        },
        data: {
          [pattern.id]: [],
        },
      };
    }

    const errors: Record<string, FormError> = {};
    const parsedValues: Array<Record<string, any>> = [];

    // Get child patterns
    const patternConfig = getPatternConfig(config, pattern.type);
    const childPatterns = patternConfig.getChildren(pattern, form?.patterns);

    values.forEach((repeaterItem, index) => {
      const itemValues: Record<string, any> = {};

      childPatterns.forEach((childPattern: Pattern<any>) => {
        const childConfig = getPatternConfig(config, childPattern.type);
        if (childConfig?.parseUserInput) {
          const rawValue = repeaterItem[childPattern.id];

          let childValue = rawValue;

          if (typeof rawValue === 'string') {
            const initialValue = childConfig.initial;

            if (initialValue && typeof initialValue === 'object') {
              const keys = Object.keys(initialValue);
              // If initial value has a single key structure, use it as template
              if (keys.length === 1) {
                childValue = { [keys[0]]: rawValue };
              }
            }
          } else if (rawValue && typeof rawValue === 'object') {
            // Keep existing object structure
            childValue = rawValue;
          }

          const parseResult = childConfig.parseUserInput(
            childPattern,
            childValue,
            config,
            form
          );

          // Store the value in its original format
          itemValues[childPattern.id] = parseResult.success
            ? parseResult.data
            : childValue;

          if (!parseResult.success) {
            errors[`${pattern.id}.${index}.${childPattern.id}`] =
              parseResult.error;
          }
        }
      });

      parsedValues.push(itemValues);
    });

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      return {
        success: false,
        error: {
          type: 'custom',
          message: 'Please ensure all fields are properly filled out.',
          fields: errors,
        },
        data: {
          [pattern.id]: parsedValues,
        },
      };
    }

    return {
      success: true,
      data: {
        [pattern.id]: parsedValues,
      },
    };
  }) as unknown as ParseUserInput<RepeaterPattern, unknown>,
  parseConfigData,
  getChildren: (pattern, patterns) => {
    return pattern.data.patterns
      .map((patternId: string) => patterns[patternId])
      .filter(Boolean);
  },
  removeChildPattern(pattern, patternId) {
    const newPatterns = pattern.data.patterns.filter(
      (id: string) => patternId !== id
    );
    if (newPatterns.length === pattern.data.patterns.length) {
      return pattern;
    }
    return {
      ...pattern,
      data: {
        ...pattern.data,
        patterns: newPatterns,
      },
    };
  },
  createPrompt,
};
