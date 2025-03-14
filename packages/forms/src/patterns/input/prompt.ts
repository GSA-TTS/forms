import { type CreatePrompt, type TextInputProps } from '../../components.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';

import { type InputPattern } from './config.js';

export const createPrompt: CreatePrompt<InputPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const sessionValue = getFormSessionValue(session, pattern.id);
  const sessionError = getFormSessionError(session, pattern.id);

  return {
    props: {
      _patternId: pattern.id,
      type: 'input',
      inputId: pattern.id,
      value: sessionValue,
      error: sessionError,
      label: pattern.data.label,
      required: pattern.data.required,
    } as TextInputProps,
    children: [],
  };
};
