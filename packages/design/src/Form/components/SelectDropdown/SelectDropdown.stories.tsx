import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import { SelectDropdownPattern } from './SelectDropdown.js';

const meta: Meta<typeof SelectDropdownPattern> = {
  title: 'patterns/SelectPattern',
  component: SelectDropdownPattern,
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
export const Default: StoryObj<typeof SelectDropdownPattern> = {
  args: {
    _patternId: '',
    type: 'select-dropdown',
    selectId: 'select-1',
    label: 'Select an option',
    required: false,
    options: [
      { value: 'value1', label: 'Option-1' },
      { value: 'value2', label: 'Option-2' },
      { value: 'value3', label: 'Option-3' },
    ],
  },
};

export const WithError: StoryObj<typeof SelectDropdownPattern> = {
  args: {
    _patternId: '',
    type: 'select-dropdown',
    selectId: 'select-with-error',
    label: 'Select an option with error',
    required: false,
    options: [
      { value: 'value1', label: 'Option-1' },
      { value: 'value2', label: 'Option-2' },
      { value: 'value3', label: 'Option-3' },
    ],
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const Required: StoryObj<typeof SelectDropdownPattern> = {
  args: {
    _patternId: '',
    type: 'select-dropdown',
    selectId: 'select-required',
    label: 'Select a required option',
    required: true,
    options: [
      { value: 'value1', label: 'Option-1' },
      { value: 'value2', label: 'Option-2' },
      { value: 'value3', label: 'Option-3' },
    ],
  },
};
