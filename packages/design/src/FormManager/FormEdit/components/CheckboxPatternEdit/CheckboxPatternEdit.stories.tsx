import type { Meta, StoryObj } from '@storybook/react';

import { type CheckboxPattern } from '@gsa-tts/forms-core';

import CheckboxPatternEdit from './index.js';
import {
  createPatternEditStoryMeta,
  testEmptyFormLabelError,
  testUpdateFormFieldOnSubmit,
} from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import { expect } from '@storybook/test';
import { within } from '@testing-library/react';

const pattern: CheckboxPattern = {
  id: '1',
  type: 'checkbox',
  data: {
    label: message.patterns.checkbox.displayName,
    defaultChecked: false,
  },
};

const storyConfig: Meta<typeof FormEdit> = {
  title: 'Edit components/CheckboxPatternEdit',
  ...createPatternEditStoryMeta({
    pattern,
  }),
};
export default storyConfig;

export const Basic: StoryObj<typeof CheckboxPatternEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Updated checkbox pattern';

    await testUpdateFormFieldOnSubmit(
      canvasElement,
      message.patterns.checkbox.displayName,
      message.patterns.checkbox.fieldLabel,
      updatedLabel
    );

    await expect(
      await canvas.findByLabelText(updatedLabel)
    ).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof CheckboxPatternEdit> = {
  play: async ({ canvasElement }) => {
    await testEmptyFormLabelError(
      canvasElement,
      message.patterns.checkbox.displayName,
      message.patterns.checkbox.fieldLabel,
      message.patterns.checkbox.errorTextMustContainChar
    );
  },
};
