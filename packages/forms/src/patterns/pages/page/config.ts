import { z } from 'zod';

import { type Pattern, type ParsePatternConfigData } from '../../../pattern.js';
import { safeZodParseFormErrors } from '../../../util/zod.js';

const ruleSchema = z.object({
  patternId: z.string(),
  condition: z.object({
    operator: z.literal('='),
    value: z.string(),
  }),
  next: z.string(),
  alertMessage: z.string().optional(),
});
export type PageRule = z.infer<typeof ruleSchema>;

const configSchema = z.object({
  title: z.string(),
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
  rules: z.array(ruleSchema).default([]),
});

type PageConfigSchema = z.infer<typeof configSchema>;
export type PagePattern = Pattern<PageConfigSchema>;

export const parseConfigData: ParsePatternConfigData<
  PageConfigSchema
> = obj => {
  return safeZodParseFormErrors(configSchema, obj);
};
