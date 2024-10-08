import {
  type Pattern,
  type PatternConfig,
  type PatternId,
} from '../../pattern.js';
import { parseConfigData } from './config.js';
import { createPrompt } from './prompt.js';

export type RepeaterPattern = Pattern<{
  legend?: string;
  showControls?: boolean;
  patterns: PatternId[];
}>;

export const repeaterConfig: PatternConfig<RepeaterPattern> = {
  displayName: 'Repeater',
  iconPath: 'block-icon.svg',
  initial: {
    legend: 'Default Heading',
    patterns: [],
  },
  parseConfigData,
  parseUserInput: (pattern, input: unknown) => {
    console.group('parseUserInput');
    console.log(pattern);
    console.log(input);
    console.groupEnd();

    // FIXME: Not sure why we're sometimes getting a string here, and sometimes
    // the expected object. Workaround, by accepting both.
    if (typeof input === 'string') {
      return {
        success: true,
        data: input,
      };
    }
    // const optionId = getSelectedOption(pattern, input);
    return {
      success: true,
      data: '',
    };
    /*
    if (optionId) {
      return {
        success: true,
        data: optionId,
      };
    }
    return {
      success: false,
      error: {
        type: 'custom',
        message: `No option selected for radio group: ${pattern.id}. Input: ${input}`,
      },
    };
    */
  },
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
  createPrompt,
};
