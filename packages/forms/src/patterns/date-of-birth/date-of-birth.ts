import * as z from 'zod';

import { type DateOfBirthProps } from '../../components.js';
import { type Pattern, type PatternConfig } from '../../pattern.js';
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
    .or(z.literal(''))
    .optional();
  const monthSchema = z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month format')
    .or(z.literal(''))
    .optional();
  const yearSchema = z
    .string()
    .regex(/^\d{4}$/, 'Invalid year format')
    .or(z.literal(''))
    .optional();

  const schema = z.object({
    day: daySchema,
    month: monthSchema,
    year: yearSchema,
  });

  return schema.superRefine((fields, ctx) => {
    const { day, month, year } = fields;

    const allEmpty = !day && !month && !year;
    const allFilled = day && month && year;

    if (data.required && !allFilled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All date fields must be filled',
        path: [],
      });
    }

    if (!data.required && !allEmpty && !allFilled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All date fields must be filled or none at all',
        path: [],
      });
    }
  });
};

export const dateOfBirthConfig: PatternConfig<
  DateOfBirthPattern,
  DateOfBirthPatternOutput
> = {
  displayName: 'Date of birth',
  iconPath: 'date-icon.svg',
  initial: {
    label: 'Date of birth',
    required: false,
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
    const error = session.data.errors[pattern.id];

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
        value: sessionValue,
        error,
      } as DateOfBirthProps,
      children: [],
    };
  },
};
