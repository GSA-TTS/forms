import { afterEach, describe, expect, test, vi } from 'vitest';

import { createPatternTestForm, createTestSession } from '../test-form.js';
import { initializePeriodicSave } from './store.js';

describe('FormManager store', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('does not save while a pattern is focused', async () => {
    vi.useFakeTimers();
    const form = createPatternTestForm({ patternCount: 1, useSequence: false });
    const saveForm = vi.fn().mockResolvedValue(undefined);
    const state = {
      focus: {
        pattern: {},
      },
      session: createTestSession({ form }),
      saveForm,
    };

    const timer = initializePeriodicSave({
      getState: () => state,
    } as unknown as Parameters<typeof initializePeriodicSave>[0]);

    await vi.advanceTimersByTimeAsync(5000);

    expect(saveForm).not.toHaveBeenCalled();
    clearInterval(timer);
  });

  test('saves once per form snapshot when no pattern is focused', async () => {
    vi.useFakeTimers();
    const form = createPatternTestForm({ patternCount: 1, useSequence: false });
    const saveForm = vi.fn().mockResolvedValue(undefined);
    const state = {
      focus: undefined,
      session: createTestSession({ form }),
      saveForm,
    };

    const timer = initializePeriodicSave({
      getState: () => state,
    } as unknown as Parameters<typeof initializePeriodicSave>[0]);

    await vi.advanceTimersByTimeAsync(5000);
    await vi.advanceTimersByTimeAsync(5000);

    expect(saveForm).toHaveBeenCalledTimes(1);
    expect(saveForm).toHaveBeenCalledWith(form);
    clearInterval(timer);
  });
});
