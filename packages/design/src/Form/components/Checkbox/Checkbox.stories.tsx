import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import { CheckboxPattern } from './Checkbox.js';
import { CheckboxProps } from '@gsa-tts/forms-core';

const meta: Meta<typeof CheckboxPattern> = {
  title: 'patterns/CheckboxPattern',
  component: CheckboxPattern,
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

export const Default = {
  args: {
    _patternId: '',
    type: 'checkbox',
    id: 'checkbox-1',
    label: 'Checkbox 1',
    hint: '',
    required: false,
    options: [
      {
        id: 'option-1',
        name: 'option-1',
        label: 'Option 1',
        defaultChecked: true,
      },
      {
        id: 'option-2',
        name: 'option-2',
        label: 'Option 2',
        defaultChecked: false,
      },
    ],
  } satisfies CheckboxProps,
} satisfies StoryObj<typeof CheckboxPattern>;
