import * as z from 'zod';

import { type NameProps } from '../../components.js';
import { type Pattern, type PatternConfig } from '../../pattern.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';
import {
  safeZodParseFormErrors,
  safeZodParseToFormError,
  convertZodErrorToFormErrors,
} from '../../util/zod.js';

const configSchema = z.object({
  label: z.string().min(1),
  required: z.boolean(),
  givenNameHint: z.string().optional(),
  familyNameHint: z.string().optional(),
});

export type NamePattern = Pattern<z.infer<typeof configSchema>>;

export type NamePatternOutput = z.infer<ReturnType<typeof createNameSchema>>;

export const createNameSchema = (data: NamePattern['data']) => {
  const givenNameSchema = data.required
    ? z.string().min(1, 'Given name is required')
    : z.string().optional();
  const middleNameSchema = z.string().optional();
  const familyNameSchema = data.required
    ? z.string().min(1, 'Family name is required')
    : z.string().optional();

  const schema = z.object({
    givenName: givenNameSchema,
    middleName: middleNameSchema,
    familyName: familyNameSchema,
  });

  return schema.superRefine((fields, ctx) => {
    const { givenName, familyName } = fields;

    if (data.required && (!givenName || !familyName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Given and family names must be filled',
        path: ['nameInput'],
      });
    }
  });
};

export const nameConfig: PatternConfig<NamePattern, NamePatternOutput> = {
  displayName: 'Name',
  iconPath: 'name-icon.svg',
  initial: {
    label: 'Name',
    required: false,
    givenNameHint: 'For example, Jose, Darren, or Mai',
    familyNameHint: 'For example, Martinez Gonzalez, Gu, or Smith',
  },

  // @ts-ignore
  parseUserInput: (
    pattern,
    inputValue: z.infer<ReturnType<typeof createNameSchema>>
  ) => {
    const result = createNameSchema(pattern.data).safeParse(inputValue);
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const fieldErrors = convertZodErrorToFormErrors(result.error);

      const validData = Object.keys(inputValue).reduce(
        (acc, key) => {
          const typedKey = key as keyof z.infer<
            ReturnType<typeof createNameSchema>
          >;
          if (!fieldErrors[typedKey]) {
            acc[typedKey] = inputValue[typedKey];
          }
          return acc;
        },
        {} as Partial<z.infer<ReturnType<typeof createNameSchema>>>
      );

      return {
        success: false,
        error: {
          type: 'custom',
          fields: fieldErrors,
        },
        data: validData,
      };
    }
  },

  parseConfigData: obj => {
    return safeZodParseFormErrors(configSchema, obj);
  },
  getChildren() {
    return [];
  },

  createPrompt(_, session, pattern, options) {
    const sessionValues = getFormSessionValue(session, pattern.id);
    const sessionError = getFormSessionError(session, pattern.id);

    return {
      props: {
        _patternId: pattern.id,
        type: 'name-input',
        givenNameId: `${pattern.id}.givenName`,
        middleNameId: `${pattern.id}.middleName`,
        familyNameId: `${pattern.id}.familyName`,
        label: pattern.data.label,
        givenNameHint: pattern.data.givenNameHint,
        familyNameHint: pattern.data.familyNameHint,
        required: pattern.data.required,
        values: sessionValues,
        errors: sessionError?.fields,
      } as NameProps,
      children: [],
    };
  },
};
