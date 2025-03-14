import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';
import NamePattern from './index.js';

const meta: Meta<typeof NamePattern> = {
  title: 'patterns/NamePattern',
  component: NamePattern,
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

const defaultArgs = {
  givenNameId: 'name-given',
  middleNameId: 'name-middle',
  familyNameId: 'name-family',
  label: 'Name',
  givenNameHint: 'Enter your first name',
  familyNameHint: 'Enter your last name',
  required: true,
};

export const Default: StoryObj<typeof NamePattern> = {
  args: { ...defaultArgs },
};

export const Optional: StoryObj<typeof NamePattern> = {
  args: { ...defaultArgs, required: false },
};

export const WithError: StoryObj<typeof NamePattern> = {
  args: {
    ...defaultArgs,
    label: 'Name with error',
    error: {
      type: 'custom',
      message: 'Given and family names must be filled',
      fields: {
        givenName: {
          type: 'custom',
          message: 'Given name is required',
        },
        familyName: {
          type: 'custom',
          message: 'Family name is required',
        },
      },
    },
  },
};

export const WithHints: StoryObj<typeof NamePattern> = {
  args: { ...defaultArgs },
};

export const WithoutHints: StoryObj<typeof NamePattern> = {
  args: { ...defaultArgs, givenNameHint: undefined, familyNameHint: undefined },
};
