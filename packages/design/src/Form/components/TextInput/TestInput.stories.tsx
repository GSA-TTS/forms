import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import TextInput from './index.js';

const meta: Meta<typeof TextInput> = {
  title: 'patterns/TextInput',
  component: TextInput,
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
export const Required = {
  args: {
    _patternId: '',
    type: 'input',
    inputId: 'test-prompt',
    value: '',
    label: 'Please enter your first name.',
    required: true,
  },
} satisfies StoryObj<typeof TextInput>;

export const NotRequired = {
  args: {
    _patternId: '',
    type: 'input',
    inputId: 'test-prompt',
    value: '',
    label: 'Please enter your first name.',
    required: false,
  },
} satisfies StoryObj<typeof TextInput>;

export const WithError = {
  args: {
    _patternId: '',
    type: 'input',
    inputId: 'test-prompt',
    value: '',
    label: 'First name',
    required: true,
    error: {
      type: 'custom',
      message: 'First name is required',
    },
  },
} satisfies StoryObj<typeof TextInput>;
