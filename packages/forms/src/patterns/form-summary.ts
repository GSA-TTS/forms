import * as z from 'zod';

import { type Pattern, type PatternConfig } from '../pattern.js';
import { type FormSummaryProps } from '../components.js';
import { safeZodParseFormErrors } from '../util/zod.js';

const configSchema = z.object({
  title: z.string().max(128).min(1, 'Title is required'),
  description: z.string().max(2024),
});
export type FormSummaryPattern = Pattern<z.infer<typeof configSchema>>;

export const formSummaryConfig: PatternConfig<FormSummaryPattern> = {
  displayName: 'Title',
  iconPath: 'block-icon.svg',
  initial: {
    title: 'Form title',
    description: 'Form extended description',
  },
  parseConfigData: obj => safeZodParseFormErrors(configSchema, obj),
  getChildren() {
    return [];
  },
  createPrompt(_, session, pattern, options) {
    return {
      props: {
        _patternId: pattern.id,
        type: 'form-summary',
        title: pattern.data.title,
        description: pattern.data.description,
      } as FormSummaryProps,
      children: [],
    };
  },
};
