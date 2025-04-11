import { z } from 'zod';

import { ParseUserInput } from '../../pattern.js';
import { safeZodParseToFormError } from '../../util/zod.js';

import { type InputPattern } from './config.js';

const createSchema = (data: InputPattern['data']) => {
  const stringSchema = z.string();

  const baseSchema = data.required
    ? stringSchema.min(1, { message: 'This field is required' })
    : stringSchema;

  // Using z.union to handle both single string and object with `repeater` array of strings
  return z.union([
    baseSchema,
    z.object({
      repeater: z.array(baseSchema),
    }),
  ]);
};

export type InputPatternOutput = z.infer<ReturnType<typeof createSchema>>;

export const parseUserInput: ParseUserInput<
  InputPattern,
  InputPatternOutput
> = (pattern, obj) => {
  return safeZodParseToFormError(createSchema(pattern['data']), obj);
};
