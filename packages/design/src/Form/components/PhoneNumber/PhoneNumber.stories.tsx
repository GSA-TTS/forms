import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import { PhoneNumberPattern } from './PhoneNumber.js';

const meta: Meta<typeof PhoneNumberPattern> = {
  title: 'patterns/PhoneNumberPattern',
  component: PhoneNumberPattern,
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

export const Default: StoryObj<typeof PhoneNumberPattern> = {
  args: {
    phoneId: 'phone',
    label: 'Phone number',
    required: false,
  },
};

export const WithRequired: StoryObj<typeof PhoneNumberPattern> = {
  args: {
    phoneId: 'phone',
    label: 'Phone number',
    required: true,
  },
};

export const WithError: StoryObj<typeof PhoneNumberPattern> = {
  args: {
    phoneId: 'phone',
    label: 'Phone number with error',
    required: true,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const WithHint: StoryObj<typeof PhoneNumberPattern> = {
  args: {
    phoneId: 'phone',
    label: 'Phone number',
    hint: '10-digit, U.S. only, for example 999-999-9999',
    required: true,
  },
};

export const WithHintAndError: StoryObj<typeof PhoneNumberPattern> = {
  args: {
    phoneId: 'phone',
    label: 'Phone number',
    hint: '10-digit, U.S. only, for example 999-999-9999',
    required: true,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};
