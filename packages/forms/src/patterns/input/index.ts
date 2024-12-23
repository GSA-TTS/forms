import { enLocale as message } from '@atj/common';

import { type PatternConfig } from '../../pattern.js';

import { type InputPattern, parseConfigData } from './config.js';
import { createPrompt } from './prompt.js';
import { type InputPatternOutput, parseUserInput } from './response.js';

export const inputConfig: PatternConfig<InputPattern, InputPatternOutput> = {
  displayName: message.patterns.input.displayName,
  iconPath: 'shortanswer-icon.svg',
  initial: {
    label: message.patterns.input.fieldLabel,
    initial: '',
    required: true,
    maxLength: 128,
  },
  parseUserInput,
  parseConfigData,
  getChildren() {
    return [];
  },
  createPrompt,
};
