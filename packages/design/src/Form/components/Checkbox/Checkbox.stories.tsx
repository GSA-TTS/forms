import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import CheckboxPattern from './Checkbox.js';
import { CheckboxProps } from '@gsa-tts/forms-core';

const meta: Meta<typeof CheckboxPattern> = {
  title: 'patterns/CheckboxPattern',
  component: CheckboxPattern,
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
    type: 'checkbox',
    id: 'checkbox-1',
    label: 'Checkbox 1',
    defaultChecked: true,
  } satisfies CheckboxProps,
} satisfies StoryObj<typeof CheckboxPattern>;
