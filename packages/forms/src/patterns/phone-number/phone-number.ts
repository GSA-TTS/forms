import * as z from 'zod';
import { type PhoneNumberProps } from '../../components.js';
import { type Pattern, type PatternConfig } from '../../pattern.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';
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
  const phoneSchema = z
    .string()
    .regex(/^(\d{3}-\d{3}-\d{4}|\d{10})$/, 'Invalid phone number format')
    .transform(value => {
      const digits = value.replace(/[^\d]/g, '');
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    })
    .refine(value => {
      const digits = value.replace(/[^\d]/g, '');
      return digits.length === 10;
    }, 'Phone number must contain exactly 10 digits');

  if (!data.required) {
    return z.union([z.literal(''), phoneSchema]);
  }

  return phoneSchema;
};

export const phoneNumberConfig: PatternConfig<
  PhoneNumberPattern,
  PhoneNumberPatternOutput
> = {
  displayName: 'Phone number',
  iconPath: 'phone-icon.svg',
  initial: {
    label: 'Phone number',
    required: false,
    hint: 'Enter a 10-digit U.S. phone number, e.g., 999-999-9999',
  },

  parseUserInput: (pattern, inputValue) => {
    return safeZodParseToFormError(createPhoneSchema(pattern.data), inputValue);
  },

  parseConfigData: obj => {
    return safeZodParseFormErrors(configSchema, obj);
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
        type: 'phone-number',
        label: pattern.data.label,
        phoneId: pattern.id,
        required: pattern.data.required,
        hint: pattern.data.hint,
        value: sessionValue,
        error: sessionError,
      } as PhoneNumberProps,
      children: [],
    };
  },
};
