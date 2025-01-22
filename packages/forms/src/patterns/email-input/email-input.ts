import * as z from 'zod';

import { type EmailInputProps } from '../../components.js';
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
});

export type EmailInputPattern = Pattern<z.infer<typeof configSchema>>;

export type EmailInputPatternOutput = z.infer<
  ReturnType<typeof createEmailSchema>
>;

export const createEmailSchema = (data: EmailInputPattern['data']) => {
  const emailSchema = z
    .string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email format'
    )
    .optional();

  if (!data.required) {
    return z.object({
      email: z
        .string()
        .or(z.literal(''))
        .transform(value => (value === '' ? undefined : value))
        .refine(
          value => value === undefined || emailSchema.safeParse(value).success,
          'Invalid email format'
        ),
    });
  }

  return z.object({
    email: emailSchema,
  });
};

export const emailInputConfig: PatternConfig<
  EmailInputPattern,
  EmailInputPatternOutput
> = {
  displayName: 'Email Input',
  iconPath: 'email-icon.svg',
  initial: {
    label: 'Email Input',
    required: false,
  },

  parseUserInput: (pattern, inputValue) => {
    return safeZodParseToFormError(createEmailSchema(pattern.data), inputValue);
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
        type: 'email-input',
        label: pattern.data.label,
        emailId: `${pattern.id}.email`,
        required: pattern.data.required,
        error,
        value: sessionValue,
        ...extraAttributes,
      } as EmailInputProps,
      children: [],
    };
  },
};
