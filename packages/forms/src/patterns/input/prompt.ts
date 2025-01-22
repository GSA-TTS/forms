import { type CreatePrompt, type TextInputProps } from '../../components.js';
import { getPatternConfig, validatePattern } from '../../pattern.js';
import { getFormSessionValue } from '../../session.js';

import { type InputPattern } from './config.js';

export const createPrompt: CreatePrompt<InputPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const extraAttributes: Record<string, any> = {};
  const sessionValue = getFormSessionValue(session, pattern.id);
  if (options.validate) {
    const inputConfig = getPatternConfig(config, pattern.type);
    const isValidResult = validatePattern(inputConfig, pattern, sessionValue);
    if (!isValidResult.success) {
      extraAttributes['error'] = isValidResult.error;
    }
  }

  return {
    props: {
      _patternId: pattern.id,
      type: 'input',
      inputId: pattern.id,
      value: sessionValue,
      label: pattern.data.label,
      required: pattern.data.required,
      ...extraAttributes,
    } as TextInputProps,
    children: [],
  };
};
