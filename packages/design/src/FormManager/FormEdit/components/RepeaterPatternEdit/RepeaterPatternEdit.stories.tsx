import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { enLocale as message } from '@gsa-tts/forms-common';
import { type RepeaterPattern } from '@gsa-tts/forms-core';

import {
  createPatternEditStoryMeta,
  testEmptyFormLabelErrorByElement,
  testUpdateFormFieldOnSubmitByElement,
} from '../common/story-helper.js';
import FormEdit from '../../index.js';

const pattern: RepeaterPattern = {
  id: '1',
  type: 'repeater',
  data: {
    legend: 'Repeater question set pattern description',
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
      await canvas.findByText('Repeater question set pattern description'),
      'Question set label',
      'Updated repeater pattern'
    );
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testEmptyFormLabelErrorByElement(
      canvasElement,
      await canvas.findByText('Repeater question set pattern description'),
      'Question set label',
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
    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Repeater short question');

    const addQuestionToRepeaterButton = canvas.getByRole('button', {
      name: /Add question to set/,
    });
    await userEvent.click(addQuestionToRepeaterButton);

    const dateOfBirthButton = canvas.getByRole('button', {
      name: /Date of birth/,
    });
    await userEvent.click(dateOfBirthButton);

    const form = input?.closest('form');
    form?.requestSubmit();

    const dateOfBirthLegend = await canvas.findByText('Date of birth', {
      selector: 'label',
    });
    await expect(dateOfBirthLegend).toBeInTheDocument();
  },
};

export const RemovePattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Confirm that the expected repeater legend exists
    expect(
      canvas.queryAllByRole('group', {
        name: /Repeater question set pattern description/i,
      })
    ).toHaveLength(1);

    // Add a "short answer" question
    const removeSectionButton = canvas.getByRole('button', {
      name: /Remove section/,
    });
    await userEvent.click(removeSectionButton);

    // Confirm that the repeater was removed
    const test = await canvas.queryAllByRole('group', {
      name: /Repeater question set pattern description/i,
    });
    expect(test).toHaveLength(0);
  },
};
