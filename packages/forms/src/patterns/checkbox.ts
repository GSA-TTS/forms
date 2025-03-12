import * as z from 'zod';

import { Result } from '@gsa-tts/forms-common';

import {
  type Pattern,
  type PatternConfig,
  validatePattern,
} from '../pattern.js';
import { type CheckboxProps } from '../components.js';
import { type FormError } from '../error.js';

import { getFormSessionValue } from '../session.js';
import {
  safeZodParseFormErrors,
  safeZodParseToFormError,
} from '../util/zod.js';

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
export type CheckboxPattern = Pattern<z.infer<typeof configSchema>>;

export const checkbox = () =>
  z.union([
    z.literal('on').transform(() => true),
    z.literal('off').transform(() => false),
    z.literal(undefined).transform(() => false),
    z.boolean(),
  ]);

const PatternOutput = z.string();
type PatternOutput = z.infer<typeof PatternOutput>;

export const checkboxConfig: PatternConfig<CheckboxPattern, PatternOutput> = {
  displayName: 'Checkbox',
  iconPath: 'checkbox-icon.svg',
  initial: {
    label: 'Checkbox label',
    hint: '',
    options: [{ id: 'option-1', label: 'Option 1' }],
    required: false,
  },
  parseUserInput: (_, obj) => {
    return safeZodParseToFormError(PatternOutput, obj);
  },
  parseConfigData: obj => {
    return safeZodParseFormErrors(configSchema, obj);
  },
  getChildren() {
    return [];
  },
  createPrompt(_, session, pattern, options) {
    const extraAttributes: Record<string, any> = {};
    const sessionValue = getFormSessionValue(session, pattern.id);
    if (options.validate) {
      const isValidResult = validatePattern(
        checkboxConfig,
        pattern,
        sessionValue
      );
      if (!isValidResult.success) {
        extraAttributes['error'] = isValidResult.error;
      }
    }

    return {
      props: {
        _patternId: pattern.id,
        type: 'checkbox',
        id: pattern.id,
        name: pattern.id,
        label: pattern.data.label,
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
        required: pattern.data.required,
        ...extraAttributes,
      } as CheckboxProps,
      children: [],
    };
  },
};

const createId = (groupId: string, optionId: string) =>
  `${groupId}.${optionId}`;

const getSelectedOption = (pattern: CheckboxPattern, input: unknown) => {
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
