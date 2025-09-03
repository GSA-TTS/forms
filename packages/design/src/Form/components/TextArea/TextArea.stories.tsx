import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import TextArea from './TextArea.js';

const meta: Meta<typeof TextArea> = {
  title: 'patterns/TextArea',
  component: TextArea,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm();
        return (
          <div className="padding-left-2">
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
    hint: 'This is a hint that provides additional context to the user.',
  },
};
