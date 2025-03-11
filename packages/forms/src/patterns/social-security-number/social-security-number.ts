import * as z from 'zod';
import { type SocialSecurityNumberProps } from '../../components.js';
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

export type SocialSecurityNumberPattern = Pattern<z.infer<typeof configSchema>>;

export type SocialSecurityNumberPatternOutput = z.infer<
  ReturnType<typeof createSSNSchema>
>;

export const createSSNSchema = (data: SocialSecurityNumberPattern['data']) => {
  const baseSchema = z
    .string()
    .transform(value => value.replace(/[^0-9]/g, ''))
    .superRefine((value, ctx) => {
      if (!data.required && value === '') {
        return;
      }

      const isValidSSN =
        value.length === 9 &&
        !value.startsWith('9') &&
        !value.startsWith('666') &&
        !value.startsWith('000') &&
        value.slice(3, 5) !== '00' &&
        value.slice(5) !== '0000';

      if (!isValidSSN) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid Social Security number',
        });
      }
    });

  if (data.required) {
    return z.string().superRefine((value, ctx) => {
      const result = baseSchema.safeParse(value.trim());
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid Social Security number',
        });
      }
    });
  } else {
    return baseSchema.optional();
  }
};

export const socialSecurityNumberConfig: PatternConfig<
  SocialSecurityNumberPattern,
  SocialSecurityNumberPatternOutput
> = {
  displayName: 'Social Security number',
  iconPath: 'ssn-icon.svg',
  initial: {
    label: 'Social Security number',
    required: false,
    hint: 'For example, 555-11-0000',
  },

  parseUserInput: (pattern, inputValue) => {
    const result = safeZodParseToFormError(
      createSSNSchema(pattern.data),
      inputValue
    );
    return result;
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
        type: 'social-security-number',
        label: pattern.data.label,
        ssnId: pattern.id,
        required: pattern.data.required,
        hint: pattern.data.hint,
        value: sessionValue,
        error,
        ...extraAttributes,
      } as SocialSecurityNumberProps,
      children: [],
    };
  },
};
