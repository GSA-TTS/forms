import {
  type CreatePrompt,
  type FieldsetProps,
  createPromptForPattern,
} from '../../components.js';
import { getPattern } from '../../pattern.js';

import { type FieldsetPattern } from './config.js';

export const createPrompt: CreatePrompt<FieldsetPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const children = pattern.data.patterns.map((patternId: string) => {
    const childPattern = getPattern(session.form, patternId);
    return createPromptForPattern(config, session, childPattern, options);
  });
  return {
    props: {
      _patternId: pattern.id,
      type: 'fieldset',
      legend: pattern.data.legend,
      hint: pattern.data.hint,
    } satisfies FieldsetProps,
    children,
  };
};
