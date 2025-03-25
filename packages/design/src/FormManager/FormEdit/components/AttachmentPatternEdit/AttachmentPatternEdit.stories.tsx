import type { Meta, StoryObj } from '@storybook/react';
import { enLocale as message } from '@gsa-tts/forms-common';
import { type AttachmentPattern } from '@gsa-tts/forms-core';

import {
  createPatternEditStoryMeta,
  testEmptyFormLabelError,
} from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { userEvent, expect } from '@storybook/test';
import { within } from '@testing-library/react';

const label = 'Attach a PDF file';

const pattern: AttachmentPattern = {
  id: '1',
  type: 'attachment',
  data: {
    label: 'File upload',
    required: true,
    maxAttachments: 1,
    maxFileSizeMB: 10,
    allowedFileTypes: ['application/pdf'],
  },
};

const storyConfig: Meta = {
  title: 'Edit components/AttachmentPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Updated attachment pattern';

    await userEvent.click(
      canvas.getByText('File upload')
    );

    const labelInput = canvas.getByLabelText(
      message.patterns.address.fieldLabel
    );

    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, updatedLabel);

    const form = labelInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.getByDisplayValue(updatedLabel)).toBeInTheDocument();

  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    await testEmptyFormLabelError(
      canvasElement,
      label,
      message.patterns.attachment.fieldLabel,
      message.patterns.attachment.fieldLabelRequired
    );

    const canvas = within(canvasElement);

    const invalidError = canvas.getByText('A field label is required', {
      selector: '.usa-error-message',
    });
    expect(invalidError).toBeInTheDocument();
  },
};
