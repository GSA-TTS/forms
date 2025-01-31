import React from 'react';
import { within, userEvent } from '@storybook/test';
import { expect } from '@storybook/test';
import { attachmentFileTypeMimes } from '@gsa-tts/forms-core';
import { type AttachmentProps } from '@gsa-tts/forms-core';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import Attachment from './index.js';

const defaultArgs = {
  _patternId: '',
  type: 'attachment',
  inputId: 'test-prompt',
  value: '',
  label: 'File upload',
  allowedFileTypes: attachmentFileTypeMimes,
  maxAttachments: 1,
  maxFileSizeMB: 10,
  required: true,
} satisfies AttachmentProps;

const meta: Meta<typeof Attachment> = {
  title: 'patterns/Attachment',
  component: Attachment,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm();
        return (
          <FormProvider {...formMethods}>
            <Story {...args} />
          </FormProvider>
        );
      };
      return <FormDecorator />;
    },
  ],
  tags: ['autodocs'],
};
export default meta;

export const SingleEmpty = {
  args: {
    ...defaultArgs,
  },
} satisfies StoryObj<typeof Attachment>;

export const MultipleEmpty = {
  args: {
    ...defaultArgs,
    maxAttachments: 2,
  },
} satisfies StoryObj<typeof Attachment>;

export const SingleWithValidFile = {
  args: {
    ...defaultArgs,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText(
      'Attach a JPG, PDF, or PNG file'
    ) as HTMLInputElement;

    // Create a file to upload
    const file = new File(['sample content'], 'sample.png', {
      type: 'image/png',
    });

    // Simulate attaching the file
    await userEvent.upload(fileInput, file);

    await expect(fileInput.files).not.toBeNull();

    if (fileInput.files) {
      await expect(fileInput.files[0]).toEqual(file);
      await expect(fileInput.files).toHaveLength(1);
    }
  },
} satisfies StoryObj<typeof Attachment>;

export const MultipleWithValidFiles = {
  args: {
    ...defaultArgs,
    allowedFileTypes: ['application/pdf'],
    maxAttachments: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText(
      'Attach PDF files'
    ) as HTMLInputElement;

    const files = [
      new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['content2'], 'file2.pdf', { type: 'application/pdf' }),
      new File(['content3'], 'file3.pdf', { type: 'application/pdf' }),
    ];

    await userEvent.upload(fileInput, files);

    await expect(fileInput.files).not.toBeNull();

    if (fileInput.files) {
      await expect(fileInput.files).toHaveLength(3);
      await expect(Array.from(fileInput.files)).toEqual(files);
    }
  },
} satisfies StoryObj<typeof Attachment>;

export const ErrorTooManyFiles = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText('Attach PDF files');

    // Create multiple files to upload
    const files = [
      new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['content2'], 'file2.pdf', { type: 'application/pdf' }),
      new File(['content3'], 'file3.pdf', { type: 'application/pdf' }),
    ];

    await userEvent.upload(fileInput, files);
    expect(
      canvas.getByText(/There is a maximum of 2 files./i)
    ).toBeInTheDocument();
  },
  args: {
    ...defaultArgs,
    allowedFileTypes: ['application/pdf'],
    maxAttachments: 2,
  },
} satisfies StoryObj<typeof Attachment>;

export const ErrorInvalidFileType = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText('Attach a JPG, PDF, or PNG file');

    const file = new File(['sample content'], 'sample.txt', {
      type: 'text/plain',
    });

    await userEvent.upload(fileInput, file);
    expect(
      canvas.getByText(/Sorry. Only JPG, PDF, or PNG files are accepted./i)
    ).toBeInTheDocument();
  },
  args: {
    ...defaultArgs,
  },
} satisfies StoryObj<typeof Attachment>;

export const ErrorTooBig = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText('Attach a JPG, PDF, or PNG file');

    const file = new File(['sample content'], 'sample.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);
    expect(
      canvas.getByText(/The maximum allowable size per file is 0 MB./i)
    ).toBeInTheDocument();
  },
  args: {
    ...defaultArgs,
    maxFileSizeMB: 0,
  },
} satisfies StoryObj<typeof Attachment>;
