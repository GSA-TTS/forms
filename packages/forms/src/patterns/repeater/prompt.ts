import { type RepeaterPattern } from './index.js';
import {
  type CreatePrompt,
  type RepeaterProps,
  createPromptForPattern,
  getPattern,
} from '../../index.js';

export const createPrompt: CreatePrompt<RepeaterPattern> = (
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
      type: 'repeater',
      legend: pattern.data.legend,
    } satisfies RepeaterProps,
    children,
  };
};
