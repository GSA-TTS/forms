import * as z from 'zod';

import { Result } from '@gsa-tts/forms-common';

import { type RadioGroupProps } from '../components.js';
import { type FormError } from '../error.js';
import { type Pattern, type PatternConfig } from '../pattern.js';
import { getFormSessionError, getFormSessionValue } from '../session.js';
import { safeZodParseFormErrors } from '../util/zod.js';

const configSchema = z.object({
  label: z.string().min(1),
  hint: z.string().optional(),
  required: z.boolean(),
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
    displayName: 'Multiple choice',
    iconPath: 'radio-options-icon.svg',
    initial: {
      label: 'Multiple choice question label',
      hint: '',
      options: [
        { id: 'option-1', label: 'Option 1' },
        { id: 'option-2', label: 'Option 2' },
      ],
      required: false,
    },
    parseUserInput: (pattern, input: unknown) => {
      if (typeof input === 'string') {
        return {
          success: true,
          data: input,
        };
      }

      if (pattern.data.required) {
        return {
          success: false,
          error: {
            type: 'custom',
            message: 'No option selected for radio group',
          },
        };
      }

      return {
        success: true,
        data: '',
      };
    },
    parseConfigData: obj => {
      const result = safeZodParseFormErrors(configSchema, obj);
      return result;
    },
    getChildren() {
      return [];
    },
    createPrompt(_, session, pattern, options) {
      const sessionValue = getFormSessionValue(session, pattern.id);
      const sessionError = getFormSessionError(session, pattern.id);

      return {
        props: {
          _patternId: pattern.id,
          type: 'radio-group',
          groupId: pattern.id,
          legend: pattern.data.label,
          hint: pattern.data.hint,
          options: pattern.data.options.map(option => {
            const optionId = createId(pattern.id, option.id);
            return {
              id: optionId,
              name: pattern.id,
              label: option.label,
              defaultChecked: sessionValue === optionId,
            };
          }),
          error: sessionError,
          required: pattern.data.required,
        } as RadioGroupProps,
        children: [],
      };
    },
  };

const createId = (groupId: string, optionId: string) =>
  `${groupId}.${optionId}`;

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
