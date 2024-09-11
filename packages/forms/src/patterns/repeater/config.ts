import { z } from 'zod';

import { safeZodParseFormErrors } from '../../util/zod.js';
import { ParsePatternConfigData } from '../../pattern.js';

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
export type RepeaterConfigSchema = z.infer<typeof configSchema>;

export const parseConfigData: ParsePatternConfigData<
  RepeaterConfigSchema
> = obj => {
  return safeZodParseFormErrors(configSchema, obj);
};
