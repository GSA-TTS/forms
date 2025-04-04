import * as z from 'zod';

import { type AccordionRowProps } from '../../components.js';
import { type Pattern, type PatternConfig } from '../../pattern.js';
import { safeZodParseFormErrors } from '../../util/zod.js';

const configSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  text: z.string().min(1, { message: 'Text is required' }),
  isOpen: z.boolean().optional(),
});

export type AccordionRowPattern = Pattern<z.infer<typeof configSchema>>;

export const accordionRowConfig: PatternConfig<AccordionRowPattern, void> = {
  displayName: 'Accordion Row',
  initial: {
    title: 'Information box title',
    text: 'Helper text that adds supplementary information or instructions for the question',
    isOpen: false,
  },

  parseConfigData: obj => {
    return safeZodParseFormErrors(configSchema, obj);
  },

  getChildren() {
    return [];
  },

  createPrompt(_, session, pattern, options) {
    return {
      props: {
        _patternId: pattern.id,
        inputId: `${pattern.id}.row`,
        type: 'accordion-row',
        title: pattern.data.title,
        text: pattern.data.text,
        isOpen: pattern.data.isOpen || false,
      } as AccordionRowProps,
      children: [],
    };
  },
};
