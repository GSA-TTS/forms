import * as z from 'zod';

import { type PhoneNumberProps } from '../../components.js';
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

export type PhoneNumberPattern = Pattern<z.infer<typeof configSchema>>;

export type PhoneNumberPatternOutput = z.infer<
  ReturnType<typeof createPhoneSchema>
>;

export const createPhoneSchema = (data: PhoneNumberPattern['data']) => {
  let phoneSchema = z
    .string()
    .regex(
      /^[\d+(). -]{1,}$/,
      'Phone number may only contain digits, spaces, parentheses, hyphens, and periods.'
    )
    .refine(value => {
      const stripped = value.replace(/[^\d]/g, '');
      return stripped.length >= 10;
    }, 'Phone number must contain at least 10 digits');

  if (!data.required) {
    // Allow empty strings for optional fields
    return phoneSchema.or(z.literal('').optional()).optional();
  }

  return phoneSchema;
};

export const phoneNumberConfig: PatternConfig<
  PhoneNumberPattern,
  PhoneNumberPatternOutput
> = {
  displayName: 'Phone Number',
  iconPath: 'phone-icon.svg',
  initial: {
    label: 'Phone Number',
    required: true,
    hint: '10-digit, U.S. only, for example 999-999-9999',
  },

  parseUserInput: (pattern, inputValue) => {
    const result = safeZodParseToFormError(
      createPhoneSchema(pattern.data),
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

    /*
    if (options.validate) {
      const isValidResult = validatePattern(
        phoneNumberConfig,
        pattern,
        sessionValue
      );
      if (!isValidResult.success) {
        extraAttributes['error'] = isValidResult.error;
      }
    }
    */

    return {
      props: {
        _patternId: pattern.id,
        type: 'phone-number',
        label: pattern.data.label,
        phoneId: pattern.id,
        required: pattern.data.required,
        hint: pattern.data.hint,
        value: sessionValue,
        error,
        ...extraAttributes,
      } as PhoneNumberProps,
      children: [],
    };
  },
};
