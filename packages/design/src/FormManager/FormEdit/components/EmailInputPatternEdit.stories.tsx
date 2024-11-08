import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { type EmailInputPattern } from '@atj/forms';
import { createPatternEditStoryMeta } from './common/story-helper.js';
import FormEdit from '../index.js';
import { enLocale as message } from '@atj/common';

const pattern: EmailInputPattern = {
  id: 'email-input-1',
  type: 'email-input',
  data: {
    label: message.patterns.emailInput.displayName,
    required: false,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/EmailInputPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Test Email Update Label';

    await userEvent.click(
      canvas.getByText(message.patterns.emailInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.emailInput.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.emailInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.emailInput.fieldLabel
    );
    await userEvent.clear(labelInput);
    labelInput.blur();

    await expect(
      await canvas.findByText(
        message.patterns.emailInput.errorTextMustContainChar
      )
    ).toBeInTheDocument();
  },
};
