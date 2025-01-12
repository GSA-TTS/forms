import * as z from 'zod';

import { type DateOfBirthProps } from '../../components.js';
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
  hint: z.string().optional(),
});

export type DateOfBirthPattern = Pattern<z.infer<typeof configSchema>>;

export type DateOfBirthPatternOutput = z.infer<
  ReturnType<typeof createDOBSchema>
>;

export const createDOBSchema = (data: DateOfBirthPattern['data']) => {
  const daySchema = z
    .string()
    .regex(/^\d{1,2}$/, 'Invalid day format')
    .optional();
  const monthSchema = z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month format')
    .optional();
  const yearSchema = z
    .string()
    .regex(/^\d{4}$/, 'Invalid year format')
    .optional();

  if (!data.required) {
    return z
      .object({
        day: daySchema,
        month: monthSchema,
        year: yearSchema,
      })
      .optional();
  }

  return z.object({
    day: daySchema,
    month: monthSchema,
    year: yearSchema,
  });
};

export const dateOfBirthConfig: PatternConfig<
  DateOfBirthPattern,
  DateOfBirthPatternOutput
> = {
  displayName: 'Date of Birth',
  iconPath: 'date-icon.svg',
  initial: {
    label: 'Date of Birth',
    required: true,
    hint: 'For example: January 19 2000',
  },

  parseUserInput: (pattern, inputValue) => {
    return safeZodParseToFormError(createDOBSchema(pattern.data), inputValue);
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
        dateOfBirthConfig,
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
        type: 'date-of-birth',
        label: pattern.data.label,
        hint: pattern.data.hint,
        dayId: `${pattern.id}.day`,
        monthId: `${pattern.id}.month`,
        yearId: `${pattern.id}.year`,
        required: pattern.data.required,
        ...extraAttributes,
      } as DateOfBirthProps,
      children: [],
    };
  },
};
