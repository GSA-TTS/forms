import type { Meta, StoryObj } from '@storybook/react';
import { enLocale as message } from '@atj/common';
import { type AttachmentPattern } from '@atj/forms';

import {
  createPatternEditStoryMeta,
  testEmptyFormLabelError,
  testUpdateFormFieldOnSubmit,
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
    await testUpdateFormFieldOnSubmit(
      canvasElement,
      label,
      message.patterns.attachment.fieldLabel,
      'Updated attachment pattern'
    );
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
    const fileTypes = await canvas.findByDisplayValue('application/pdf');
    await userEvent.click(fileTypes);
    fileTypes.blur();

    const maxAttachments = await canvas.findByLabelText('Max attachments');
    await userEvent.clear(maxAttachments);
    maxAttachments.blur();

    const invalidError = canvas.getByText('Invalid file type found.', {
      selector: '.usa-error-message',
    });
    expect(invalidError).toBeInTheDocument();
  },
};
