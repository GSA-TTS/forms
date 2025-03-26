import { type RepeaterPattern } from './index.js';
import {
  type CreatePrompt,
  type RepeaterProps,
  createPromptForPattern,
  getPattern,
} from '../../index.js';
import { getFormSessionError } from '../../session.js';
export const createPrompt: CreatePrompt<RepeaterPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const isSubmitAction =
    session.data.lastAction?.startsWith('action/repeater-');
  const isFormBuilder = !!session.data.isFormBuilder;

  const currentValues = session.data.values[pattern.id];
  const sessionValues = Array.isArray(currentValues)
    ? currentValues
    : Array.isArray(currentValues?.[pattern.id])
      ? currentValues[pattern.id]
      : [];

  const sessionError = getFormSessionError(session, pattern.id);
  let children;

  if (isFormBuilder) {
    children = pattern.data.patterns.map((patternId: string) => {
      const childPattern = getPattern(session.form, patternId);
      return createPromptForPattern(config, session, childPattern, options);
    });
  } else {
    children = sessionValues.flatMap((value: any, index: number) => {
      return pattern.data.patterns.map((patternId: string) => {
        let childPattern = getPattern(session.form, patternId);
        childPattern = {
          ...childPattern,
          id: `${pattern.id}.${index}.${childPattern.id}`,
        };
        return createPromptForPattern(config, session, childPattern, options);
      });
    });

    if (sessionValues.length === 0 && !isSubmitAction) {
      const initialChildren = pattern.data.patterns.map((patternId: string) => {
        let childPattern = getPattern(session.form, patternId);
        childPattern = {
          ...childPattern,
          id: `${pattern.id}.0.${childPattern.id}`,
        };
        return createPromptForPattern(config, session, childPattern, options);
      });
      children.push(...initialChildren);
    }
  }

  return {
    props: {
      _patternId: pattern.id,
      type: 'repeater',
      legend: pattern.data.legend,
      hint: pattern.data.hint,
      value: sessionValues,
      error: sessionError,
      addButtonLabel: pattern.data.addButtonLabel,
    } satisfies RepeaterProps,
    children,
  };
};
