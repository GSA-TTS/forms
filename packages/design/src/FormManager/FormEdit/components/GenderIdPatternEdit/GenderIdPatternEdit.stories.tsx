import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect } from '@storybook/test';
import { within } from '@testing-library/react';

import { type GenderIdPattern } from '@gsa-tts/forms-core';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';

const pattern: GenderIdPattern = {
  id: 'gender-identity-1',
  type: 'gender-id',
  data: {
    label: message.patterns.genderId.displayName,
    required: true,
    hint: undefined,
    preferNotToAnswerText: message.patterns.genderId.preferNotToAnswerTextLabel,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/GenderIdPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Gender identity update';
    const updatedHint = 'Updated hint for Gender identity';
    const updatedPreferNotToAnswerText =
      'Updated prefer not to share my gender identity text';

    await userEvent.click(
      canvas.getByText(message.patterns.genderId.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.genderId.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const hintInput = canvas.getByLabelText(
      message.patterns.genderId.hintLabel
    );
    await userEvent.clear(hintInput);
    await userEvent.type(hintInput, updatedHint);

    const preferNotToAnswerInput = canvas.getByLabelText(
      message.patterns.genderId.preferNotToAnswerTextLabel
    );
    await userEvent.clear(preferNotToAnswerInput);
    await userEvent.type(preferNotToAnswerInput, updatedPreferNotToAnswerText);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(await canvas.findByText(updatedHint)).toBeInTheDocument();
    await expect(
      await canvas.findByText(updatedPreferNotToAnswerText)
    ).toBeInTheDocument();
  },
};

export const WithoutHint: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Gender identity update';
    const updatedPreferNotToAnswerText =
      'Prefer not to update my gender identity';

    await userEvent.click(
      canvas.getByText(message.patterns.genderId.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.genderId.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const preferNotToAnswerInput = canvas.getByLabelText(
      message.patterns.genderId.preferNotToAnswerTextLabel
    );
    await userEvent.clear(preferNotToAnswerInput);
    await userEvent.type(preferNotToAnswerInput, updatedPreferNotToAnswerText);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(
      await canvas.findByText(updatedPreferNotToAnswerText)
    ).toBeInTheDocument();
    await expect(
      await canvas.queryByLabelText(message.patterns.genderId.hintLabel)
    ).toBeNull();
  },
};

export const WithoutCheckbox: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Gender identity update';
    const updatedHint = 'Updated hint for Gender identity';

    await userEvent.click(
      canvas.getByText(message.patterns.genderId.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.genderId.fieldLabel
    );
    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const hintInput = canvas.getByLabelText(
      message.patterns.genderId.hintLabel
    );
    await userEvent.clear(hintInput);
    await userEvent.type(hintInput, updatedHint);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
    await expect(
      await canvas.queryByLabelText(message.patterns.genderId.hintLabel)
    ).toBeNull();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.genderId.displayName)
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.genderId.fieldLabel
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
