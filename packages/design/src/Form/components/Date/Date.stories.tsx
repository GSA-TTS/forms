import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import DatePattern from './Date.js';

const meta: Meta<typeof DatePattern> = {
  title: 'patterns/DateOfBirthPattern',
  component: DatePattern,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm({
          defaultValues: {
            'date-of-birth-1.day': '',
            'date-of-birth-1.month': '',
            'date-of-birth-1.year': '',
          },
        });
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

export const Default: StoryObj<typeof DatePattern> = {
  args: {
    _patternId: '',
    type: 'date-of-birth',
    monthId: 'date-of-birth-1.month',
    dayId: 'date-of-birth-1.day',
    yearId: 'date-of-birth-1.year',
    label: 'Select a date of birth',
    hint: 'For example: January 19, 2000',
    required: false,
  },
};

export const WithoutHint: StoryObj<typeof DatePattern> = {
  args: {
    _patternId: '',
    type: 'date-of-birth',
    monthId: 'date-of-birth-1.month',
    dayId: 'date-of-birth-1.day',
    yearId: 'date-of-birth-1.year',
    label: 'Select a date of birth',
    hint: undefined,
    required: false,
  },
};

export const WithError: StoryObj<typeof DatePattern> = {
  args: {
    _patternId: '',
    type: 'date-of-birth',
    monthId: 'date-of-birth-1.month',
    dayId: 'date-of-birth-1.day',
    yearId: 'date-of-birth-1.year',
    label: 'Select a date of birth with error',
    hint: 'For example: January 19, 2000',
    required: false,
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
  },
};

export const Required: StoryObj<typeof DatePattern> = {
  args: {
    _patternId: '',
    type: 'date-of-birth',
    monthId: 'date-of-birth-1.month',
    dayId: 'date-of-birth-1.day',
    yearId: 'date-of-birth-1.year',
    label: 'Select a required date of birth',
    hint: 'For example: January 19, 2000',
    required: true,
  },
};
