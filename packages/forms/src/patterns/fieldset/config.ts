import { z } from 'zod';

import { safeZodParseFormErrors } from '../../util/zod.js';
import {
  type ParsePatternConfigData,
  type Pattern,
  type PatternId,
} from '../../pattern.js';

export type FieldsetPattern = Pattern<{
  legend?: string;
  patterns: PatternId[];
}>;

const configSchema = z.object({
  legend: z.string().min(1),
  patterns: z.union([
    // Support either an array of strings...
    z.array(z.string()),
    // ...or a comma-separated string.
    // REVISIT: This is messy, and exists only so we can store the data easily
    // as a hidden input in the form. We should probably just store it as JSON.
    z
      .string()
      .transform(value =>
        value
          .split(',')
          .map(String)
          .filter(value => value)
      )
      .pipe(z.string().array()),
  ]),
});
export type FieldsetConfigSchema = z.infer<typeof configSchema>;

export const parseConfigData: ParsePatternConfigData<
  FieldsetConfigSchema
> = obj => {
  return safeZodParseFormErrors(configSchema, obj);
};
