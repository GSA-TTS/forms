import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import SexPattern from './Sex.js';

const meta: Meta<typeof SexPattern> = {
  title: 'patterns/SexPattern',
  component: SexPattern,
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

export const Default: StoryObj<typeof SexPattern> = {
  args: {
    _patternId: '',
    type: 'sex-input',
    sexId: 'testId',
    label: 'Sex',
    required: false,
    value: '',
  },
};

export const WithError: StoryObj<typeof SexPattern> = {
  args: {
    _patternId: '',
    type: 'sex-input',
    sexId: 'testId',
    label: 'Sex',
    required: false,
    value: '',
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const Required: StoryObj<typeof SexPattern> = {
  args: {
    _patternId: '',
    type: 'sex-input',
    sexId: 'testId',
    label: 'Sex',
    required: true,
    value: '',
  },
};

export const WithHelperText: StoryObj<typeof SexPattern> = {
  args: {
    _patternId: '',
    type: 'sex-input',
    sexId: 'testId',
    label: 'Sex Input (with modal helper text)',
    required: false,
    value: '',
    helperText:
      'This is a helper text that explains why you are asking for this data and who it will be shared with',
  },
};
