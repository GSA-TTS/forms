import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import SocialSecurityNumberPattern from './SocialSecurityNumber.js';

const meta: Meta<typeof SocialSecurityNumberPattern> = {
  title: 'patterns/SocialSecurityNumberPattern',
  component: SocialSecurityNumberPattern,
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

export const Default: StoryObj<typeof SocialSecurityNumberPattern> = {
  args: {
    ssnId: 'ssn',
    label: 'Social Security number',
    required: false,
  },
};

export const WithRequired: StoryObj<typeof SocialSecurityNumberPattern> = {
  args: {
    ssnId: 'ssn',
    label: 'Social Security number',
    required: true,
  },
};

export const WithError: StoryObj<typeof SocialSecurityNumberPattern> = {
  args: {
    ssnId: 'ssn',
    label: 'Social Security number with error',
    required: true,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const WithHint: StoryObj<typeof SocialSecurityNumberPattern> = {
  args: {
    ssnId: 'ssn',
    label: 'Social Security number',
    hint: 'For example, 555-11-0000',
    required: true,
  },
};

export const WithHintAndError: StoryObj<typeof SocialSecurityNumberPattern> = {
  args: {
    ssnId: 'ssn',
    label: 'Social Security number',
    hint: 'For example, 555-11-0000',
    required: true,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};
