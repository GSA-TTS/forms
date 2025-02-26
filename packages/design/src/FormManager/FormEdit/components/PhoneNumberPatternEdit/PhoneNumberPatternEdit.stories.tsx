import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { type PhoneNumberPattern } from '@gsa-tts/forms-core';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';

const pattern: PhoneNumberPattern = {
  id: 'phone-number-1',
  type: 'phone-number',
  data: {
    label: message.patterns.phoneNumber.displayName,
    required: false,
    hint: undefined,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/PhoneNumberPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Phone number update';
    const updatedHint = 'Updated hint for phone number';

    await userEvent.click(
      canvas.getByText(message.patterns.phoneNumber.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.phoneNumber.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const hintInput = canvas.getByLabelText(
      message.patterns.phoneNumber.hintLabel
    );
    await userEvent.clear(hintInput);
    await userEvent.type(hintInput, updatedHint);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(await canvas.findByText(updatedHint)).toBeInTheDocument();
  },
};

export const WithoutHint: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Phone number update';

    await userEvent.click(
      canvas.getByText(message.patterns.phoneNumber.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.phoneNumber.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(
      await canvas.queryByLabelText(message.patterns.phoneNumber.hintLabel)
    ).toBeNull();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.phoneNumber.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.phoneNumber.fieldLabel
    );
    await userEvent.clear(labelInput);
    labelInput.blur();

    await expect(
      await canvas.findByText(
        message.patterns.phoneNumber.errorTextMustContainChar
      )
    ).toBeInTheDocument();
  },
};
