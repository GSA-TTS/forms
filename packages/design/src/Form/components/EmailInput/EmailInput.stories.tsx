import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import { EmailInputPattern } from './EmailInput.js';

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

export const Default: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    required: true,
  },
};

export const WithoutRequired: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address',
    required: false,
  },
};

export const WithError: StoryObj<typeof EmailInputPattern> = {
  args: {
    emailId: 'email',
    label: 'Email address with error',
    required: true,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};
