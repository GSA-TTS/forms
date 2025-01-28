import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import TextArea from './index.js';

const meta: Meta<typeof TextArea> = {
  title: 'patterns/TextArea',
  component: TextArea,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm();
        return (
          <div style={{ padding: '10px' }}>
            <FormProvider {...formMethods}>
              <Story {...args} />
            </FormProvider>
          </div>
        );
      };
      return <FormDecorator />;
    },
  ],
  tags: ['autodocs'],
};

export default meta;

export const Required: StoryObj<typeof TextArea> = {
  args: {
    _patternId: '',
    type: 'text-area',
    inputId: 'test-textarea',
    value: '',
    label: 'Please enter your comments',
    required: true,
    maxLength: 500,
  },
};

export const NotRequired: StoryObj<typeof TextArea> = {
  args: {
    _patternId: '',
    type: 'text-area',
    inputId: 'test-textarea',
    value: '',
    label: 'Please enter your comments',
    required: false,
    maxLength: 500,
  },
};

export const ErrorState: StoryObj<typeof TextArea> = {
  args: {
    _patternId: '',
    type: 'text-area',
    inputId: 'test-textarea',
    value: '',
    label: 'Please enter your comments',
    required: true,
    maxLength: 500,
    error: {
      type: 'required',
      message: 'This field is required',
    },
  },
};

export const WithHint: StoryObj<typeof TextArea> = {
  args: {
    _patternId: '',
    type: 'text-area',
    inputId: 'test-textarea',
    value: '',
    label: 'Please enter your comments',
    required: false,
    maxLength: 500,
    hint: 'This is a hint that provides additional context to the user.',
  },
};
