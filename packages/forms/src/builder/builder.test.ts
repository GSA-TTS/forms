import { describe, expect, it } from 'vitest';

import { BlueprintBuilder } from '.';
import { createForm } from '..';
import { defaultFormConfig } from '../patterns';
import { type InputPattern } from '../patterns/input';
import { type SequencePattern } from '../patterns/sequence';

describe('form builder', () => {
  it('addPattern adds initial pattern of given type', () => {
    const builder = new BlueprintBuilder();
    expect(Object.keys(builder.form.patterns).length).toEqual(1);
    builder.addPattern(defaultFormConfig, 'input');
    expect(Object.keys(builder.form.patterns).length).toEqual(2);
  });

  it('addPattern preserves existing structure', () => {
    const initial = createTestBlueprint();
    const newBuilder = new BlueprintBuilder(initial);
    const newPattern = newBuilder.addPattern(defaultFormConfig, 'input');
    expect(newBuilder.form.patterns[newPattern.id]).toEqual(newPattern);
    expect(
      newBuilder.form.patterns[newBuilder.form.root].data.patterns
    ).toEqual([...initial.patterns[initial.root].data.patterns, newPattern.id]);
  });

  it('removePattern removes pattern and sequence reference', () => {
    const initial = createTestBlueprint();
    const builder = new BlueprintBuilder(initial);
    builder.removePattern(defaultFormConfig, 'element-2');
    expect(builder.form.patterns).toEqual({
      root: {
        type: 'sequence',
        id: 'root',
        data: {
          patterns: ['element-1'],
        },
      } satisfies SequencePattern,
      'element-1': {
        type: 'input',
        id: 'element-1',
        data: {
          label: 'Pattern 1',
          initial: '',
          required: true,
          maxLength: 128,
        },
      } satisfies InputPattern,
    });
  });
});

export const createTestBlueprint = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'sequence',
          id: 'root',
          data: {
            patterns: ['element-1', 'element-2'],
          },
        } satisfies SequencePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: 'test',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};
