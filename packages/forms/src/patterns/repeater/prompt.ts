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
  console.group('repeater/createPrompt');
  console.log(session);
  console.log(pattern);
  console.groupEnd();

  const children = pattern.data.patterns.map((patternId: string) => {
    let childPattern = getPattern(session.form, patternId);
    childPattern = {
      ...childPattern,
      id: `${pattern.id}.%%INDEX%%.${childPattern.id}`
    }
    // {
    //   "id": "8c8a358d-e977-4d9b-9671-43bf6e847f5d",
    //   "type": "input",
    //   "data": {
    //   "label": "Field label",
    //     "initial": "",
    //     "required": true,
    //     "maxLength": 128
    // }
    // }
    console.group('repeater/createPrompt/children');
    console.log(childPattern);
    console.log(options);
    console.groupEnd();
    return createPromptForPattern(config, session, childPattern, options);
  });


  return {
    props: {
      _patternId: pattern.id,
      type: 'repeater',
      legend: pattern.data.legend,
      showControls: true,
    } satisfies RepeaterProps,
    children,
  };
};
