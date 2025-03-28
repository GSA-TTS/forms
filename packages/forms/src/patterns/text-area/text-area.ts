import { z } from 'zod';
import { enLocale as message } from '@gsa-tts/forms-common';
import {
  PatternBuilder,
  type Pattern,
  type PatternConfig,
  type ParsePatternConfigData,
  type ParseUserInput,
} from '../../pattern.js';
import {
  safeZodParseFormErrors,
  safeZodParseToFormError,
} from '../../util/zod.js';
import type { CreatePrompt, TextAreaProps } from '../../components.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';

const textAreaConfigSchema = z.object({
  label: z.string().min(1, message.patterns.textarea.fieldLabelRequired),
  hint: z.string().optional(),
  initial: z.string().optional(),
  required: z.boolean(),
});

export type TextAreaPattern = Pattern<z.infer<typeof textAreaConfigSchema>>;
export type TextAreaPatternOutput = z.infer<
  ReturnType<typeof createTextAreaSchema>
>;

export const createTextAreaSchema = (data: TextAreaPattern['data']) => {
  const stringSchema = z.string();

  const baseSchema = data.required
    ? stringSchema.min(1, { message: 'This field is required' })
    : stringSchema;

  return z.union([
    baseSchema,
    z.object({
      repeater: z.array(baseSchema),
    }),
  ]);
};

export const textAreaConfig: PatternConfig<
  TextAreaPattern,
  TextAreaPatternOutput
> = {
  displayName: message.patterns.textarea.displayName,
  iconPath: 'long-answer-icon.svg',
  initial: {
    label: '',
    hint: '',
    initial: '',
    required: false,
  },

  parseUserInput: (pattern, inputValue) => {
    return safeZodParseToFormError(
      createTextAreaSchema(pattern['data']),
      inputValue
    );
  },

  parseConfigData: obj => {
    return safeZodParseFormErrors(textAreaConfigSchema, obj);
  },

  getChildren() {
    return [];
  },

  createPrompt(config, session, pattern, options) {
    const sessionValue = getFormSessionValue(session, pattern.id);
    const sessionError = getFormSessionError(session, pattern.id);

    return {
      props: {
        _patternId: pattern.id,
        type: 'text-area',
        inputId: pattern.id,
        value: sessionValue,
        error: sessionError,
        label: pattern.data.label,
        hint: pattern.data.hint,
        required: pattern.data.required,
      } as TextAreaProps,
      children: [],
    };
  },
};
