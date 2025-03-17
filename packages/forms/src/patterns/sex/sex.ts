import * as z from 'zod';

import { type SexProps } from '../../components.js';
import { type Pattern, type PatternConfig } from '../../pattern.js';
import { getFormSessionValue, getFormSessionError } from '../../session.js';
import {
  safeZodParseFormErrors,
  safeZodParseToFormError,
} from '../../util/zod.js';

const configSchema = z.object({
  label: z.string().min(1),
  helperText: z.string().min(1),
  required: z.boolean(),
});

export type SexPattern = Pattern<z.infer<typeof configSchema>>;

export type SexPatternOutput = z.infer<ReturnType<typeof createSexSchema>>;

export const createSexSchema = (data: SexPattern['data']) => {
  const sexSchema = z.enum(['male', 'female']);

  const schema = z.object({
    sex: data.required
      ? sexSchema.refine(value => value !== undefined, {
          message: 'Sex is required',
        })
      : sexSchema.optional(),
  });

  return schema;
};

export const sexConfig: PatternConfig<SexPattern, SexPatternOutput> = {
  displayName: 'Sex',
  iconPath: 'sex-icon.svg',
  initial: {
    label: 'Sex',
    required: false,
    helperText:
      'Helper text that explains why you are asking for this data and who it will be shared with',
  },

  // @ts-ignore
  parseUserInput: (
    pattern,
    inputValue: z.infer<ReturnType<typeof createSexSchema>>
  ) => {
    const result = safeZodParseToFormError(
      createSexSchema(pattern['data']),
      inputValue
    );

    if (!result.success) {
      return pattern['data'].required
        ? {
            ...result,
            error: { ...result.error, message: 'Sex is required' },
          }
        : {
            ...result,
            error: undefined,
          };
    }

    return result;
  },

  parseConfigData: obj => {
    return safeZodParseFormErrors(configSchema, obj);
  },
  getChildren() {
    return [];
  },

  createPrompt(_, session, pattern, options) {
    const sessionValues = getFormSessionValue(session, pattern.id);
    const sessionErrors = getFormSessionError(session, pattern.id);

    return {
      props: {
        _patternId: pattern.id,
        type: 'sex-input',
        sexId: `${pattern.id}.sex`,
        label: pattern.data.label,
        helperText: pattern.data.helperText,
        required: pattern.data.required,
        value: sessionValues?.sex,
        error: sessionErrors,
      } as SexProps,
      children: [],
    };
  },
};
