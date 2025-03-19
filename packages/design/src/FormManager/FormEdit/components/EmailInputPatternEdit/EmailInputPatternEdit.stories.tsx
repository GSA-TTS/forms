import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { type EmailInputPattern } from '@gsa-tts/forms-core';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';

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
    const updatedLabel = 'Updated Email address label';
    const updatedHint = 'Updated hint for Email address';

    await userEvent.click(
      canvas.getByText(message.patterns.emailInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.emailInput.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const hintInput = canvas.getByLabelText(
      message.patterns.emailInput.hintLabel
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
    const updatedLabel = 'Updated Email address label';

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
    await expect(
      await canvas.queryByLabelText(message.patterns.emailInput.hintLabel)
    ).toBeNull();
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
