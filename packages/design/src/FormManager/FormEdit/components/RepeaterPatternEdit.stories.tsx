import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { enLocale as message } from '@atj/common';
import { type RepeaterPattern } from '@atj/forms';

import {
  createPatternEditStoryMeta,
  testEmptyFormLabelErrorByElement,
  testUpdateFormFieldOnSubmitByElement,
} from './common/story-helper.js';
import FormEdit from '../index.js';

const pattern: RepeaterPattern = {
  id: '1',
  type: 'repeater',
  data: {
    legend: 'Repeater pattern description',
    patterns: [],
  },
};

const storyConfig: Meta = {
  title: 'Edit components/RepeaterPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testUpdateFormFieldOnSubmitByElement(
      canvasElement,
      await canvas.findByText('Repeater pattern description'),
      'Legend Text Element',
      'Updated repeater pattern'
    );
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testEmptyFormLabelErrorByElement(
      canvasElement,
      await canvas.findByText('Repeater pattern description'),
      'Legend Text Element',
      message.patterns.repeater.errorTextMustContainChar
    );
  },
};

export const AddPattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add a "short answer" question
    const addQuestionButton = canvas.getByRole('button', {
      name: /Add question/,
    });
    await userEvent.click(addQuestionButton);
    const shortAnswerButton = canvas.getByRole('button', {
      name: /Short answer/,
    });
    await userEvent.click(shortAnswerButton);

    // Submit new field's edit form
    const input = await canvas.findByLabelText('Field label');
    await userEvent.clear(input);
    await userEvent.type(input, 'Repeater short question');
    const form = input?.closest('form');
    form?.requestSubmit();

    // Confirm that the "short answer" field exists
    const updatedElement = await canvas.findAllByText(
      'Repeater short question'
    );
    await expect(updatedElement.length).toBeGreaterThan(0);
  },
};

export const RemovePattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Confirm that the expected repeater legend exists
    expect(
      canvas.queryAllByRole('group', {
        name: /Repeater pattern description/i,
      })
    ).toHaveLength(1);

    // Add a "short answer" question
    const removeSectionButton = canvas.getByRole('button', {
      name: /Remove section/,
    });
    await userEvent.click(removeSectionButton);

    // Confirm that the repeater was removed
    const test = await canvas.queryAllByRole('group', {
      name: /Repeater pattern description/i,
    });
    expect(test).toHaveLength(0);
  },
};
