import { type PatternConfig } from '../../../pattern.js';

import { type PagePattern, parseConfigData } from './config.js';
import { createPrompt } from './prompt.js';

export const pageConfig: PatternConfig<PagePattern> = {
  displayName: 'Page',
  iconPath: 'block-icon.svg',
  initial: {
    title: 'Untitled Page',
    patterns: [],
    rules: [],
  },
  createPrompt,
  parseConfigData,
  getChildren(pattern, patterns) {
    return pattern.data.patterns.map(
      (patternId: string) => patterns[patternId]
    );
  },
  removeChildPattern(pattern, patternId) {
    const newPatterns = pattern.data.patterns.filter(
      (id: string) => patternId !== id
    );
    if (newPatterns.length === pattern.data.patterns.length) {
      return pattern;
    }
    return {
      ...pattern,
      data: {
        ...pattern.data,
        patterns: newPatterns,
      },
    };
  },
};
