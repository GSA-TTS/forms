import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect } from '@storybook/test';
import { within } from '@testing-library/react';

import { type NamePattern } from '@gsa-tts/forms-core';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';

const pattern: NamePattern = {
  id: 'name-1',
  type: 'name-input',
  data: {
    label: message.patterns.nameInput.displayName,
    required: true,
    givenNameHint: 'Enter your first name',
    familyNameHint: 'Enter your last name',
  },
};

const storyConfig: Meta = {
  title: 'Edit components/NamePattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Name update';
    const updatedGivenNameHint = 'Updated hint for given name';
    const updatedFamilyNameHint = 'Updated hint for family name';

    await userEvent.click(
      canvas.getByText(message.patterns.nameInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.nameInput.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const givenNameHintInput = canvas.getByLabelText(
      message.patterns.nameInput.givenNameHint
    );
    await userEvent.clear(givenNameHintInput);
    await userEvent.type(givenNameHintInput, updatedGivenNameHint);

    const familyNameHintInput = canvas.getByLabelText(
      message.patterns.nameInput.familyNameHint
    );
    await userEvent.clear(familyNameHintInput);
    await userEvent.type(familyNameHintInput, updatedFamilyNameHint);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(
      await canvas.findByText(updatedGivenNameHint)
    ).toBeInTheDocument();
    await expect(
      await canvas.findByText(updatedFamilyNameHint)
    ).toBeInTheDocument();
  },
};

export const WithoutHints: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Name update';

    await userEvent.click(
      canvas.getByText(message.patterns.nameInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.nameInput.fieldLabel
    );
    const givenNameHintInput = canvas.getByLabelText(
      message.patterns.nameInput.givenNameHint
    );
    const familyNameHintInput = canvas.getByLabelText(
      message.patterns.nameInput.familyNameHint
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);
    await userEvent.clear(givenNameHintInput);
    await userEvent.clear(familyNameHintInput);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(
      await canvas.queryByLabelText(message.patterns.nameInput.givenNameHint)
    ).toBeNull();
    await expect(
      await canvas.queryByLabelText(message.patterns.nameInput.familyNameHint)
    ).toBeNull();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.nameInput.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.nameInput.fieldLabel
    );
    await userEvent.clear(labelInput);
    labelInput.blur();

    await expect(
      await canvas.findByText(
        message.patterns.selectDropdown.errorTextMustContainChar
      )
    ).toBeInTheDocument();
  },
};
