import * as z from 'zod';

import { Result } from '@gsa-tts/forms-common';

import { type RadioGroupProps } from '../components.js';
import { type FormError } from '../error.js';
import {
  type Pattern,
  type PatternConfig,
  validatePattern,
} from '../pattern.js';
import { getFormSessionValue } from '../session.js';
import { safeZodParseFormErrors } from '../util/zod.js';

const configSchema = z.object({
  label: z.string().min(1),
  options: z
    .object({
      id: z.string().regex(/^[A-Za-z][A-Za-z0-9\-_:.]*$/, 'Invalid Option ID'),
      label: z.string().min(1),
    })
    .array(),
});
export type RadioGroupPattern = Pattern<z.infer<typeof configSchema>>;

const PatternOutput = z.string();
type PatternOutput = z.infer<typeof PatternOutput>;

export const radioGroupConfig: PatternConfig<RadioGroupPattern, PatternOutput> =
  {
    displayName: 'Radio Buttons',
    iconPath: 'singleselect-icon.svg',
    initial: {
      label: 'Radio group label',
      options: [
        { id: 'option-1', label: 'Option 1' },
        { id: 'option-2', label: 'Option 2' },
      ],
    },
    parseUserInput: (pattern, input: unknown) => {
      // FIXME: Not sure why we're sometimes getting a string here, and sometimes
      // the expected object. Workaround, by accepting both.
      if (typeof input === 'string') {
        return {
          success: true,
          data: input,
        };
      }
      const optionId = getSelectedOption(pattern, input);
      return {
        success: true,
        data: optionId || '',
      };
      /*
      if (optionId) {
        return {
          success: true,
          data: optionId,
        };
      }
      return {
        success: false,
        error: {
          type: 'custom',
          message: `No option selected for radio group: ${pattern.id}. Input: ${input}`,
        },
      };
      */
    },
    parseConfigData: obj => {
      const result = safeZodParseFormErrors(configSchema, obj);
      return result;
    },
    getChildren() {
      return [];
    },
    createPrompt(_, session, pattern, options) {
      const extraAttributes: Record<string, any> = {};
      const sessionValue = getFormSessionValue(session, pattern.id);
      if (options.validate) {
        const isValidResult = validatePattern(
          radioGroupConfig,
          pattern,
          sessionValue
        );
        if (!isValidResult.success) {
          extraAttributes['error'] = isValidResult.error;
        }
      }
      console.group('radio/createPrompt');
      console.log(pattern);
      console.groupEnd();

      return {
        props: {
          _patternId: pattern.id,
          type: 'radio-group',
          groupId: pattern.id,
          legend: pattern.data.label,
          options: pattern.data.options.map(option => {
            const optionId = createId(pattern.id, option.id);
            return {
              id: optionId,
              name: pattern.id,
              label: option.label,
              defaultChecked: sessionValue === optionId,
            };
          }),
          ...extraAttributes,
        } as RadioGroupProps,
        children: [],
      };
    },
  };

const createId = (groupId: string, optionId: string) =>
  `${groupId}.${optionId}`;

const getSelectedOption = (pattern: RadioGroupPattern, input: unknown) => {
  if (!input) {
    return;
  }
  const inputMap = input as Record<string, 'on' | null>;
  const optionIds = pattern.data.options
    .filter(option => inputMap[option.id] === 'on')
    .map(option => option.id);
  if (optionIds.length === 1) {
    return optionIds[0];
  }
};

export const extractOptionId = (
  groupId: string,
  inputId: unknown
): Result<string, FormError> => {
  if (typeof inputId !== 'string') {
    return {
      success: false,
      error: {
        type: 'custom',
        message: `inputId is not a string: ${inputId}`,
      },
    };
  }
  if (!inputId.startsWith(groupId)) {
    return {
      success: false,
      error: {
        type: 'custom',
        message: `invalid id: ${inputId}`,
      },
    };
  }
  return {
    success: true,
    data: inputId.slice(groupId.length + 1),
  };
};
