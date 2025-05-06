import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import EmailInputPattern from './EmailInput.js';

const meta: Meta<typeof EmailInputPattern> = {
  title: 'patterns/EmailInputPattern',
  component: EmailInputPattern,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm({
          defaultValues: {
            email: '',
          },
        });
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

export const Default: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    required: false,
  },
};

export const WithRequired: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    required: true,
  },
};

export const WithError: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address with error',
    required: true,
    error: {
      type: 'custom',
      message: 'Invalid email format ',
    },
  },
};

export const WithHint: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    hint: 'Enter an email address without spaces using this format: email@domain.com',
    required: false,
  },
};

export const WithHintAndError: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    hint: 'Enter an email address without spaces using this format: email@domain.com',
    required: false,
    error: {
      type: 'custom',
      message: 'Invalid email format',
    },
  },
};
