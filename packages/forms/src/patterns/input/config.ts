import { z } from 'zod';

import { enLocale as message } from '@gsa-tts/forms-common';

import { type ParsePatternConfigData, type Pattern } from '../../pattern.js';
import { safeZodParseFormErrors } from '../../util/zod.js';

export type InputPattern = Pattern<InputConfigSchema>;

const configSchema = z.object({
  label: z.string().min(1, message.patterns.input.fieldLabelRequired),
  initial: z.string().optional(),
  required: z.boolean(),
  maxLength: z.coerce.number(),
});
export type InputConfigSchema = z.infer<typeof configSchema>;

export const parseConfigData: ParsePatternConfigData<
  InputConfigSchema
> = obj => {
  return safeZodParseFormErrors(configSchema, obj);
};
