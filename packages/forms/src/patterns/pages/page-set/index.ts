import { type PatternConfig, type PatternId } from '../../../pattern.js';

import { type PageSetPattern, parseConfigData } from './config.js';
import { createPrompt } from './prompt.js';

export const createPageSet = (
  id: PatternId,
  pages?: PatternId[]
): PageSetPattern => {
  return {
    id,
    type: 'page-set',
    data: {
      pages: pages || [],
    },
  };
};

export const pageSetConfig: PatternConfig<PageSetPattern> = {
  displayName: 'Page set',
  iconPath: 'block-icon.svg',
  initial: {
    pages: [],
  },
  createPrompt,
  parseConfigData,
  getChildren(pattern, patterns) {
    return pattern.data.pages.map((patternId: string) => patterns[patternId]);
  },
  removeChildPattern(pattern, patternId) {
    const newPatterns = pattern.data.pages.filter(
      (id: string) => patternId !== id
    );
    if (newPatterns.length === pattern.data.pages.length) {
      return pattern;
    }
    return {
      ...pattern,
      data: {
        ...pattern.data,
        pages: newPatterns,
      },
    };
  },
  getInitialFormRoute(pattern) {
    if (pattern.data.pages.length === 0) {
      throw new Error('No route for empty page-set.');
    }
    return {
      url: '#',
      params: { page: '0' },
    };
  },
};
