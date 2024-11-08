import * as z from 'zod';

import { type SelectDropdownProps } from '../../components.js';
import {
  type Pattern,
  type PatternConfig,
  validatePattern,
} from '../../pattern.js';
import { getFormSessionValue } from '../../session.js';
import {
  safeZodParseFormErrors,
  safeZodParseToFormError,
} from '../../util/zod.js';

const configSchema = z.object({
  label: z.string().min(1),
  required: z.boolean(),
  options: z
    .object({
      value: z
        .string()
        .regex(/^[A-Za-z][A-Za-z0-9\-_:.]*$/, 'Invalid Option Value'),
      label: z.string().min(1),
    })
    .array(),
});

export type SelectDropdownPattern = Pattern<z.infer<typeof configSchema>>;

type SelectDropdownPatternOutput = string;
export type InputPatternOutput = z.infer<ReturnType<typeof createSchema>>;

export const createSchema = (data: SelectDropdownPattern['data']) => {
  const values = data.options.map(option => option.value);

  if (values.length === 0) {
    throw new Error('Options must have at least one value');
  }

  const schema = z.enum([values[0], ...values.slice(1)]);

  if (!data.required) {
    return z.union([schema, z.literal('')]).transform(val => val || undefined);
  }

  return schema;
};

export const selectDropdownConfig: PatternConfig<
  SelectDropdownPattern,
  SelectDropdownPatternOutput
> = {
  displayName: 'Select Dropdown',
  iconPath: 'dropdown-icon.svg',
  initial: {
    label: 'Select-dropdown-label',
    required: true,
    options: [
      { value: 'value1', label: 'Option-1' },
      { value: 'value2', label: 'Option-2' },
      { value: 'value3', label: 'Option-3' },
    ],
  },

  parseUserInput: (pattern, inputValue) => {
    return safeZodParseToFormError(createSchema(pattern['data']), inputValue);
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
        selectDropdownConfig,
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
        type: 'select-dropdown',
        label: pattern.data.label,
        selectId: pattern.id,
        options: pattern.data.options.map(option => {
          return {
            value: option.value,
            label: option.label,
          };
        }),
        required: pattern.data.required,
        ...extraAttributes,
      } as SelectDropdownProps,
      children: [],
    };
  },
};
