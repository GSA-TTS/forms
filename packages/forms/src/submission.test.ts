import { describe, expect, it, vi } from 'vitest';

import { defaultFormConfig } from './patterns';
import { type SubmitHandler, SubmissionRegistry } from './submission';
import { type Blueprint } from '.';

const testForm: Blueprint = {
  summary: {
    title: 'Test form',
    description: 'A test form',
  },
  root: 'pat-id-1',
  patterns: {
    'pat-id-1': {
      type: 'page',
      id: 'pat-id-1',
      data: {},
    },
    'pat-id-2': {
      type: 'page',
      id: 'pat-id-2',
      data: {},
    },
  },
  outputs: [],
};

describe('SubmissionRegistry', () => {
  it('should register a submit handler once', () => {
    const registry = new SubmissionRegistry(defaultFormConfig);
    const handler1 = (() => {}) as unknown as SubmitHandler;
    const handler2 = (() => {}) as unknown as SubmitHandler;

    registry.registerHandler({
      handlerId: 'handler1',
      handler: handler1,
    });
    registry.registerHandler({
      handlerId: 'handler2',
      handler: handler2,
    });

    expect(() =>
      registry.registerHandler({ handlerId: 'handler1', handler: handler1 })
    ).toThrow('Submission handler with id handler1 already exists');
    const result1 = registry.getHandlerForAction(
      testForm,
      'action/handler1/pat-id-1'
    );
    expect(result1).toEqual({
      success: true,
      data: { handler: handler1, pattern: testForm.patterns['pat-id-1'] },
    });
    const result2 = registry.getHandlerForAction(
      testForm,
      'action/handler2/pat-id-2'
    );
    expect(result2).toEqual({
      success: true,
      data: { handler: handler2, pattern: testForm.patterns['pat-id-2'] },
    });
    const result3 = registry.getHandlerForAction(
      testForm,
      'action/handler3/pat-id-3'
    );
    expect(result3).toEqual({
      success: false,
      error: 'Submission handler with id handler3 does not exist',
    });
  });
});
