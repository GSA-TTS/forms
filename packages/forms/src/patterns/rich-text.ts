import * as z from 'zod';

import { type Pattern, type PatternConfig } from '../pattern.js';
import { type RichTextProps } from '../components.js';
import { safeZodParseFormErrors } from '../util/zod.js';

const configSchema = z.object({
  text: z.string().min(1),
});
export type RichTextPattern = Pattern<z.infer<typeof configSchema>>;

export const richTextConfig: PatternConfig<RichTextPattern> = {
  displayName: 'Page Text',
  iconPath: 'richtext-icon.svg',
  initial: {
    text: '',
  },
  parseConfigData: obj => safeZodParseFormErrors(configSchema, obj),
  getChildren() {
    return [];
  },
  createPrompt(_, session, pattern, options) {
    return {
      props: {
        _patternId: pattern.id,
        type: 'rich-text' as const,
        text: pattern.data.text,
      } as RichTextProps,
      children: [],
    };
  },
};
