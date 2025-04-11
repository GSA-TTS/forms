import { enLocale as message } from '@gsa-tts/forms-common';

import { type PatternConfig } from '../../pattern.js';

import { type InputPattern, parseConfigData } from './config.js';
import { createPrompt } from './prompt.js';
import { type InputPatternOutput, parseUserInput } from './response.js';

export const inputConfig: PatternConfig<InputPattern, InputPatternOutput> = {
  displayName: message.patterns.input.displayName,
  iconPath: 'short-answer-icon.svg',
  initial: {
    label: 'Question text',
    hint: '',
    initial: '',
    required: false,
  },
  parseUserInput,
  parseConfigData,
  getChildren() {
    return [];
  },
  createPrompt,
};
