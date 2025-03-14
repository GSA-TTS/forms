import type { Meta, StoryObj } from '@storybook/react';

import { type SexPattern } from '@gsa-tts/forms-core';

import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

const pattern: SexPattern = {
  id: 'sex-pattern-1',
  type: 'sex-input',
  data: {
    label: message.patterns.sex.displayName,
    required: false,
    helperText: '',
  },
};

const storyConfig: Meta = {
  title: 'Edit components/SexPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Sex update';
    const updatedHelperText = 'Helper text update';

    await userEvent.click(canvas.getByText(message.patterns.sex.displayName));
    const input = canvas.getByLabelText(message.patterns.sex.fieldLabel);

    // Enter new text for the field
    await userEvent.clear(input);
    await userEvent.type(input, updatedLabel);

    const helperText = canvas.getByText(message.patterns.sex.helperTextLabel);
    await userEvent.type(helperText, updatedHelperText);

    const form = input?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    userEvent.setup();

    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText(message.patterns.sex.displayName));

    const inputLabel = canvas.getByLabelText(message.patterns.sex.fieldLabel);

    // Clear input, remove focus, and wait for error
    await userEvent.clear(inputLabel);
    inputLabel.blur();

    await expect(
      await canvas.findAllByText(message.patterns.sex.errorTextMustContainChar)
    ).toHaveLength(2);
  },
};
