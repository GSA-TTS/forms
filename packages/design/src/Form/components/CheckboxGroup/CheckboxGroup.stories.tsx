import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import CheckboxGroupPattern from './CheckboxGroup.js';

const meta: Meta<typeof CheckboxGroupPattern> = {
  title: 'patterns/CheckboxGroupPattern',
  component: CheckboxGroupPattern,
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

export const Default = {
  args: {
    _patternId: '',
    type: 'checkbox-group',
    groupId: 'checkbox-group-1',
    label: 'Select your favorite fruits',
    hint: 'You can select multiple options.',
    required: true,
    options: [
      {
        id: 'option-1',
        name: 'fruits',
        label: 'Apple',
        defaultChecked: false,
      },
      {
        id: 'option-2',
        name: 'fruits',
        label: 'Banana',
        defaultChecked: true,
      },
      {
        id: 'option-3',
        name: 'fruits',
        label: 'Cherry',
        defaultChecked: false,
      },
      {
        id: 'option-4',
        name: 'fruits',
        label: 'Date',
        defaultChecked: false,
        disabled: true,
      },
    ],
    error: undefined,
  },
} satisfies StoryObj<typeof CheckboxGroupPattern>;

export const WithError = {
  args: {
    _patternId: '',
    type: 'checkbox-group',
    groupId: 'checkbox-group-2',
    label: 'Select your favorite vegetables',
    hint: 'You can select multiple options.',
    required: true,
    options: [
      {
        id: 'option-1',
        name: 'vegetables',
        label: 'Carrot',
        defaultChecked: false,
      },
      {
        id: 'option-2',
        name: 'vegetables',
        label: 'Broccoli',
        defaultChecked: false,
      },
      {
        id: 'option-3',
        name: 'vegetables',
        label: 'Spinach',
        defaultChecked: false,
      },
    ],
    error: { type: 'custom', message: 'Please select at least one option.' },
  },
} satisfies StoryObj<typeof CheckboxGroupPattern>;
