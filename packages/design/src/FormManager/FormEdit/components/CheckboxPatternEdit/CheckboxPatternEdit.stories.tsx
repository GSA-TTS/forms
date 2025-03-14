import type { Meta, StoryObj } from '@storybook/react';

import { type CheckboxPattern } from '@gsa-tts/forms-core';

import CheckboxPatternEdit from './index.js';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

const pattern: CheckboxPattern = {
  id: 'checkbox-1',
  type: 'checkbox',
  data: {
    label: message.patterns.checkbox.displayName,
    hint: '',
    required: false,
    options: [
      { label: 'Option 1', id: 'option-1' },
      { label: 'Option 2', id: 'option-2' },
      { label: 'Option 3', id: 'option-3' },
    ],
  },
};

const storyConfig: Meta = {
  title: 'Edit components/CheckboxPatternEdit',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Checkbox update';

    await userEvent.click(
      canvas.getByText(message.patterns.checkbox.displayName)
    );
    const input = canvas.getByLabelText(message.patterns.checkbox.fieldLabel);
    const optionLabel = canvas.getByLabelText('Option 1 label');

    // Enter new text for the field
    await userEvent.clear(input);
    await userEvent.type(input, updatedLabel);
    await userEvent.clear(optionLabel);
    await userEvent.type(optionLabel, 'Yes');

    const form = input?.closest('form');
    /**
     * The <enter> key behavior outside of Storybook submits the form, which commits the pending edit.
     * Here, we want to simulate the <enter> keypress in the story since Storybook manipulates
     * the default behavior and does not register the enter key if it's in the `userEvent.type` function arg.
     */
    form?.requestSubmit();

    await expect(
      await canvas.findByDisplayValue(updatedLabel)
    ).toBeInTheDocument();

    await expect(await canvas.findByDisplayValue('Yes')).toBeVisible();
  },
};

export const AddField: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.checkbox.displayName)
    );

    await userEvent.click(
      canvas.getByRole('button', {
        name: /add option/i,
      })
    );

    await expect(
      await canvas.findByLabelText('Option 2 label')
    ).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof CheckboxPatternEdit> = {
  play: async ({ canvasElement }) => {
    userEvent.setup();

    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.checkbox.displayName)
    );

    const input = canvas.getByLabelText(message.patterns.checkbox.fieldLabel);

    // Clear input, remove focus, and wait for error
    await userEvent.clear(input);
    input.blur();

    await expect(
      await canvas.findByText(
        message.patterns.checkbox.errorTextMustContainChar
      )
    ).toBeInTheDocument();

    /*
      Repopulate the input value since the error text is indistinguishable from
      the error text from the option label below
    */
    await userEvent.type(input, message.patterns.checkbox.fieldLabel);
    await userEvent.clear(input);
    input.blur();
  },
};
