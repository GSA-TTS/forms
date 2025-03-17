import { describe, expect, it } from 'vitest';

import { type Pattern, createForm, getPattern } from '../index.js';
import { defaultFormConfig } from '../patterns/index.js';
import { type FieldsetPattern } from '../patterns/fieldset/config.js';
import { type FormSummaryPattern } from '../patterns/form-summary.js';
import { type InputPattern } from '../patterns/input/config.js';
import { type PagePattern } from '../patterns/page/config.js';
import { type PageSetPattern } from '../patterns/page-set/config.js';
import { type RadioGroupPattern } from '../patterns/radio-group.js';

import { BlueprintBuilder } from './index.js';

describe('form builder', () => {
  it('addPattern adds initial pattern of given type', () => {
    const builder = new BlueprintBuilder(defaultFormConfig);
    expect(Object.keys(builder.form.patterns).length).toEqual(2);
    builder.addPatternToPage('input');
    expect(Object.keys(builder.form.patterns).length).toEqual(3);
  });

  it('addPattern preserves existing structure', () => {
    const initial = createTestBlueprint();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const newPattern = builder.addPatternToPage('input');
    expect(builder.form.patterns[newPattern.id]).toEqual(newPattern);
    const oldPage = getPattern<PagePattern>(initial, 'page-1');
    const newPage = getPattern<PagePattern>(builder.form, 'page-1');

    expect(newPage.data).toEqual({
      ...oldPage.data,
      patterns: [...oldPage.data.patterns, newPattern.id],
    });
  });

  it('movePattern on the currentpage', () => {
    const initial = createTwoPageThreePatternTestForm();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const pattern = getPattern<Pattern>(builder.form, 'element-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const oldPage = getPattern<PagePattern>(initial, 'page-1');
    const newPage = getPattern<PagePattern>(builder.form, 'page-1');
    builder.movePatternBetweenPages(
      oldPage.id,
      newPage.id,
      pattern.id,
      'bottom'
    );

    expect(builder.form.patterns).toEqual({
      root: {
        type: 'page-set',
        id: 'root',
        data: {
          pages: ['page-1', 'page-2'],
        },
      } satisfies PageSetPattern,
      'page-1': {
        type: 'page',
        id: 'page-1',
        data: {
          title: 'Page 1',
          patterns: ['element-2', 'element-1'],
        },
      } satisfies PagePattern,
      'page-2': {
        type: 'page',
        id: 'page-2',
        data: {
          title: 'Page 2',
          patterns: ['element-3'],
        },
      } satisfies PagePattern,
      'element-1': {
        type: 'input',
        id: 'element-1',
        data: {
          label: 'Pattern 1',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-2': {
        type: 'input',
        id: 'element-2',
        data: {
          label: 'Pattern 2',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-3': {
        type: 'input',
        id: 'element-3',
        data: {
          label: 'Pattern 3',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
    });
  });

  it('movePattern to top of a different page', () => {
    const initial = createTwoPageThreePatternTestForm();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const pattern = getPattern<Pattern>(builder.form, 'element-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const oldPage = getPattern<PagePattern>(initial, 'page-1');
    const newPage = getPattern<PagePattern>(builder.form, 'page-2');
    builder.movePatternBetweenPages(oldPage.id, newPage.id, pattern.id, 'top');
    expect(builder.form.patterns).toEqual({
      root: {
        type: 'page-set',
        id: 'root',
        data: {
          pages: ['page-1', 'page-2'],
        },
      } satisfies PageSetPattern,
      'page-1': {
        type: 'page',
        id: 'page-1',
        data: {
          title: 'Page 1',
          patterns: ['element-2'],
        },
      } satisfies PagePattern,
      'page-2': {
        type: 'page',
        id: 'page-2',
        data: {
          title: 'Page 2',
          patterns: ['element-1', 'element-3'],
        },
      } satisfies PagePattern,
      'element-1': {
        type: 'input',
        id: 'element-1',
        data: {
          label: 'Pattern 1',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-2': {
        type: 'input',
        id: 'element-2',
        data: {
          label: 'Pattern 2',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-3': {
        type: 'input',
        id: 'element-3',
        data: {
          label: 'Pattern 3',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
    });
  });

  it('movePattern to bottom of a different page', () => {
    const initial = createTwoPageThreePatternTestForm();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const pattern = getPattern<Pattern>(builder.form, 'element-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const oldPage = getPattern<PagePattern>(initial, 'page-1');
    const newPage = getPattern<PagePattern>(builder.form, 'page-2');
    builder.movePatternBetweenPages(
      oldPage.id,
      newPage.id,
      pattern.id,
      'bottom'
    );
    expect(builder.form.patterns).toEqual({
      root: {
        type: 'page-set',
        id: 'root',
        data: {
          pages: ['page-1', 'page-2'],
        },
      } satisfies PageSetPattern,
      'page-1': {
        type: 'page',
        id: 'page-1',
        data: {
          title: 'Page 1',
          patterns: ['element-2'],
        },
      } satisfies PagePattern,
      'page-2': {
        type: 'page',
        id: 'page-2',
        data: {
          title: 'Page 2',
          patterns: ['element-3', 'element-1'],
        },
      } satisfies PagePattern,
      'element-1': {
        type: 'input',
        id: 'element-1',
        data: {
          label: 'Pattern 1',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-2': {
        type: 'input',
        id: 'element-2',
        data: {
          label: 'Pattern 2',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
      'element-3': {
        type: 'input',
        id: 'element-3',
        data: {
          label: 'Pattern 3',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
    });
  });

  it('copy input pattern', () => {
    const initial = createTestBlueprintMultipleFieldsets();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const parentPattern = getPattern<PagePattern>(initial, 'page-1');
    const updatedParentPattern = getPattern<PagePattern>(
      builder.form,
      'page-1'
    );
    const pattern = getPattern<Pattern>(builder.form, 'element-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const newPattern = builder.copyPattern(parentPattern.id, pattern.id);

    expect(builder.form).toEqual({
      summary: { title: 'Test form', description: 'Test description' },
      root: 'root',
      patterns: {
        root: { type: 'page-set', id: 'root', data: { pages: ['page-1'] } },
        'page-1': {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: [
              'element-1',
              newPattern.id,
              'form-summary-1',
              'fieldset-1',
              'radio-group-1',
            ],
          },
        },
        'element-1': {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Input Pattern',
            initial: '',
            required: true,
            maxLength: 128,
          },
        },
        'form-summary-1': {
          type: 'form-summary',
          id: 'form-summary-1',
          data: {
            description: 'Form extended description',
            title: 'Form title',
          },
        },
        'fieldset-1': {
          type: 'fieldset',
          id: 'fieldset-1',
          data: {
            legend: 'Question set pattern description',
            patterns: ['element-2'],
          },
        },
        'radio-group-1': {
          type: 'radio-group',
          id: 'radio-group-1',
          data: {
            label: 'Multiple choice question label',
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        },
        [newPattern.id]: {
          type: 'input',
          id: newPattern.id,
          data: {
            label: expect.stringMatching(
              /^\(\s*Copy\s+\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+[AP]M\)\s*Input Pattern/
            ),
            initial: '',
            required: true,
            maxLength: 128,
          },
        },
      },
      outputs: [],
    });
  });

  it('copy form summary pattern', () => {
    const initial = createTestBlueprintMultipleFieldsets();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const parentPattern = getPattern<PagePattern>(initial, 'page-1');
    const pattern = getPattern<Pattern>(builder.form, 'form-summary-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const newPattern = builder.copyPattern(parentPattern.id, pattern.id);

    expect(builder.form).toEqual({
      summary: { title: 'Test form', description: 'Test description' },
      root: 'root',
      patterns: {
        root: { type: 'page-set', id: 'root', data: { pages: ['page-1'] } },
        'page-1': {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: [
              'element-1',
              'form-summary-1',
              newPattern.id,
              'fieldset-1',
              'radio-group-1',
            ],
          },
        },
        'element-1': {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Input Pattern',
            initial: '',
            required: true,
            maxLength: 128,
          },
        },
        'form-summary-1': {
          type: 'form-summary',
          id: 'form-summary-1',
          data: {
            description: 'Form extended description',
            title: 'Form title',
          },
        },
        'fieldset-1': {
          type: 'fieldset',
          id: 'fieldset-1',
          data: {
            legend: 'Question set pattern description',
            patterns: ['element-2'],
          },
        },
        'radio-group-1': {
          type: 'radio-group',
          id: 'radio-group-1',
          data: {
            label: 'Multiple choice question label',
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        },
        [newPattern.id]: {
          type: 'form-summary',
          id: newPattern.id,
          data: {
            description: 'Form extended description',
            title: expect.stringMatching(
              /^\(\s*Copy\s+\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+[AP]M\)\s*Form title/
            ),
          },
        },
      },
      outputs: [],
    });
  });

  it('copy fieldset pattern', () => {
    const initial = createTestBlueprintMultipleFieldsets();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const parentPattern = getPattern<PagePattern>(initial, 'page-1');
    const updatedParentPattern = getPattern<PagePattern>(
      builder.form,
      'page-1'
    );
    const pattern = getPattern<Pattern>(builder.form, 'fieldset-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const newPattern = builder.copyPattern(parentPattern.id, pattern.id);

    expect(builder.form).toEqual({
      summary: { title: 'Test form', description: 'Test description' },
      root: 'root',
      patterns: {
        root: { type: 'page-set', id: 'root', data: { pages: ['page-1'] } },
        'page-1': {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: [
              'element-1',
              'form-summary-1',
              'fieldset-1',
              newPattern.id,
              'radio-group-1',
            ],
          },
        },
        'element-1': {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Input Pattern',
            initial: '',
            required: true,
            maxLength: 128,
          },
        },
        'form-summary-1': {
          type: 'form-summary',
          id: 'form-summary-1',
          data: {
            description: 'Form extended description',
            title: 'Form title',
          },
        },
        'fieldset-1': {
          type: 'fieldset',
          id: 'fieldset-1',
          data: {
            legend: 'Question set pattern description',
            patterns: ['element-2'],
          },
        },
        'radio-group-1': {
          type: 'radio-group',
          id: 'radio-group-1',
          data: {
            label: 'Multiple choice question label',
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        },
        [newPattern.id]: {
          type: 'fieldset',
          id: newPattern.id,
          data: {
            legend: expect.stringMatching(
              /^\(\s*Copy\s+\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+[AP]M\)\s*Question set pattern description/
            ),
            patterns: ['element-2'],
          },
        },
      },
      outputs: [],
    });
  });

  it('copy multiple choice pattern', () => {
    const initial = createTestBlueprintMultipleFieldsets();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    const parentPattern = getPattern<PagePattern>(initial, 'page-1');
    const pattern = getPattern<Pattern>(builder.form, 'radio-group-1');
    expect(builder.form.patterns[pattern.id]).toEqual(pattern);
    const newPattern = builder.copyPattern(parentPattern.id, pattern.id);

    expect(builder.form).toEqual({
      summary: { title: 'Test form', description: 'Test description' },
      root: 'root',
      patterns: {
        root: { type: 'page-set', id: 'root', data: { pages: ['page-1'] } },
        'page-1': {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: [
              'element-1',
              'form-summary-1',
              'fieldset-1',
              'radio-group-1',
              newPattern.id,
            ],
          },
        },
        'element-1': {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Input Pattern',
            initial: '',
            required: true,
            maxLength: 128,
          },
        },
        'form-summary-1': {
          type: 'form-summary',
          id: 'form-summary-1',
          data: {
            description: 'Form extended description',
            title: 'Form title',
          },
        },
        'fieldset-1': {
          type: 'fieldset',
          id: 'fieldset-1',
          data: {
            legend: 'Question set pattern description',
            patterns: ['element-2'],
          },
        },
        'radio-group-1': {
          type: 'radio-group',
          id: 'radio-group-1',
          data: {
            label: 'Multiple choice question label',
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        },
        [newPattern.id]: {
          type: 'radio-group',
          id: newPattern.id,
          data: {
            label: expect.stringMatching(
              /^\(\s*Copy\s+\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+[AP]M\)\s*Multiple choice question label/
            ),
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        },
      },
      outputs: [],
    });
  });

  it('removePattern removes pattern and sequence reference', () => {
    const initial = createTestBlueprint();
    const builder = new BlueprintBuilder(defaultFormConfig, initial);
    builder.removePattern('element-2');
    expect(builder.form.patterns).toEqual({
      root: {
        type: 'page-set',
        id: 'root',
        data: { pages: ['page-1'] },
      } satisfies PageSetPattern,
      'page-1': {
        type: 'page',
        id: 'page-1',
        data: {
          title: 'Page 1',
          patterns: ['element-1'],
        },
      } satisfies PagePattern,
      'element-1': {
        type: 'input',
        id: 'element-1',
        data: {
          label: 'Pattern 1',
          initial: '',
          required: true,
          maxLength: 128,
        },
      },
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
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
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

export const createTwoPageThreePatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1', 'page-2'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
        {
          type: 'page',
          id: 'page-2',
          data: {
            title: 'Page 2',
            patterns: ['element-3'],
          },
        } satisfies PagePattern,
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
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-3',
          data: {
            label: 'Pattern 3',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

export const createTestBlueprintMultipleFieldsets = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: [
              'element-1',
              'form-summary-1',
              'fieldset-1',
              'radio-group-1',
            ],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Input Pattern',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'form-summary',
          id: 'form-summary-1',
          data: {
            description: 'Form extended description',
            title: 'Form title',
          },
        } satisfies FormSummaryPattern,
        {
          type: 'fieldset',
          id: 'fieldset-1',
          data: {
            legend: 'Question set pattern description',
            patterns: ['element-2'],
          },
        } satisfies FieldsetPattern,
        {
          type: 'radio-group',
          id: 'radio-group-1',
          data: {
            label: 'Multiple choice question label',
            hint: '',
            options: [
              { id: 'option-1', label: 'Option 1' },
              { id: 'option-2', label: 'Option 2' },
            ],
            required: false,
          },
        } satisfies RadioGroupPattern,
      ],
    }
  );
};
