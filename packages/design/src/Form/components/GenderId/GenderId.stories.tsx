import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';
import GenderIdPattern from './index.js';

const meta: Meta<typeof GenderIdPattern> = {
  title: 'patterns/GenderIdPattern',
  component: GenderIdPattern,
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

const defaultArgs = {
  genderId: 'gender-identity',
  label: 'Gender identity',
  hint: 'For example, man, woman, non-binary',
  required: true,
  preferNotToAnswerText: 'Prefer not to share my gender identity',
};

export const Default: StoryObj<typeof GenderIdPattern> = {
  args: { ...defaultArgs },
};

export const Optional: StoryObj<typeof GenderIdPattern> = {
  args: { ...defaultArgs, required: false },
};

export const WithError: StoryObj<typeof GenderIdPattern> = {
  args: {
    ...defaultArgs,
    label: 'Gender identity with error',
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const WithHint: StoryObj<typeof GenderIdPattern> = {
  args: { ...defaultArgs },
};

export const WithCheckboxChecked: StoryObj<typeof GenderIdPattern> = {
  args: { ...defaultArgs, preferNotToAnswerChecked: true },
};

export const WithoutCheckbox: StoryObj<typeof GenderIdPattern> = {
  args: { ...defaultArgs, preferNotToAnswerText: undefined },
};
