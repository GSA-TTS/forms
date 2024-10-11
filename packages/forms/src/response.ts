import { type Result } from '@atj/common';

import { type PromptAction } from './components.js';
import {
  type FormErrorMap,
  type FormSession,
  updateSession,
} from './session.js';
import {
  type FormConfig,
  getPattern,
  getPatternConfig,
  validatePattern,
} from './pattern.js';

export type PromptResponse = {
  action: PromptAction['type'];
  data: Record<string, string>;
};

export const applyPromptResponse = (
  config: FormConfig,
  session: FormSession,
  response: PromptResponse
): Result<FormSession> => {
  const { errors, values } = parsePromptResponse(session, config, response);
  const newSession = updateSession(session, values, errors);
  return {
    success: true,
    data: newSession,
  };
};

const parsePromptResponse = (
  session: FormSession,
  config: FormConfig,
  response: PromptResponse
) => {
  const values: Record<string, any> = {};
  const errors: FormErrorMap = {};
  for (const [patternId, promptValue] of Object.entries(response.data)) {
    const pattern = getPattern(session.form, patternId);
    const patternConfig = getPatternConfig(config, pattern.type);
    const isValidResult = validatePattern(patternConfig, pattern, promptValue);
    if (isValidResult.success) {
      values[patternId] = isValidResult.data;
    } else {
      errors[patternId] = isValidResult.error;
    }
  }
  return { errors, values };
};
