import type { Meta, StoryObj } from '@storybook/react';

import { enLocale as message } from '@gsa-tts/forms-common';
import { type TextAreaPattern } from '@gsa-tts/forms-core';

import {
  createPatternEditStoryMeta,
  testEmptyFormLabelError,
  testUpdateFormFieldOnSubmit,
} from '../common/story-helper.js';
import FormEdit from '../../index.js';

const pattern: TextAreaPattern = {
  id: '1',
  type: 'text-area',
  data: {
    label: message.patterns.textarea.displayName,
    required: false,
    maxLength: 256,
    initial: 'Initial text',
  },
};

const storyConfig: Meta = {
  title: 'Edit components/TextAreaPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    await testUpdateFormFieldOnSubmit(
      canvasElement,
      message.patterns.textarea.displayName,
      message.patterns.textarea.fieldLabel,
      'Updated textarea pattern'
    );
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    await testEmptyFormLabelError(
      canvasElement,
      message.patterns.textarea.displayName,
      message.patterns.textarea.fieldLabel,
      message.patterns.textarea.fieldLabelRequired
    );
  },
};
