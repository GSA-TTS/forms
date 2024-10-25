import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import { SelectPattern } from './Select.js';

const meta: Meta<typeof SelectPattern> = {
  title: 'patterns/SelectPattern',
  component: SelectPattern,
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
    type: 'radio-group',
    groupId: 'radio-group-1',
    legend: 'This is a radio group',
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
  },
} satisfies StoryObj<typeof SelectPattern>;
