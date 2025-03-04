import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Repeater from './index.js';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultPatternComponents } from '../index.js';
import type {
  DateOfBirthProps,
  EmailInputProps,
  RepeaterProps,
} from '@gsa-tts/forms-core';
import { expect, within } from '@storybook/test';

const defaultArgs = {
  legend: 'Default Heading',
  _patternId: 'test-id',
  type: 'repeater',
} satisfies RepeaterProps;

const mockChildComponents = (index: number, withError = false) => [
  {
    props: {
      _patternId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.a6c217f0-fe84-44ef-b606-69142ecb3365`,
      type: 'date-of-birth',
      label: 'Date of birth',
      hint: 'For example: January 19 2000',
      dayId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.a6c217f0-fe84-44ef-b606-69142ecb3365.day`,
      monthId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.a6c217f0-fe84-44ef-b606-69142ecb3365.month`,
      yearId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.a6c217f0-fe84-44ef-b606-69142ecb3365.year`,
      required: false,
      error: withError
        ? {
            type: 'custom',
            message: 'Invalid date of birth',
          }
        : undefined,
    } as DateOfBirthProps,
    children: [],
  },
  {
    props: {
      _patternId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.7d5df1c1-ca92-488c-81ca-8bb180f952b6`,
      type: 'email-input',
      label: 'Email',
      emailId: `3fdb2cb6-5d65-4de1-b773-3fb8636f5d09.${index}.7d5df1c1-ca92-488c-81ca-8bb180f952b6.email`,
      required: false,
      error: withError
        ? {
            type: 'custom',
            message: 'Invalid email address',
          }
        : undefined,
    } as EmailInputProps,
    children: [],
  },
];

export default {
  title: 'patterns/Repeater',
  component: Repeater,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm();
        return (
          <FormProvider {...formMethods}>
            <div className="usa-form margin-bottom-3 maxw-full">
              <Story {...args} />
            </div>
          </FormProvider>
        );
      };
      return <FormDecorator />;
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Repeater>;

export const Default = {
  args: {
    ...defaultArgs,
  },
} satisfies StoryObj<typeof Repeater>;

export const WithContents = {
  args: {
    ...defaultArgs,
    childComponents: mockChildComponents(0),
    context: {
      components: {
        'date-of-birth': defaultPatternComponents['date-of-birth'],
        'email-input': defaultPatternComponents['email-input'],
      },
      config: {
        patterns: {},
      },
      uswdsRoot: '/uswds/',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const legend = await canvas.findByText('Default Heading');
    expect(legend).toBeInTheDocument();

    const listItems = canvas.getAllByRole('list');
    expect(listItems.length).toBe(1);

    const dobLabel = await canvas.findByText('Date of birth');
    expect(dobLabel).toBeInTheDocument();

    const emailLabel = await canvas.findByText('Email');
    expect(emailLabel).toBeInTheDocument();
  },
} satisfies StoryObj<typeof Repeater>;

export const ErrorState = {
  args: {
    ...defaultArgs,
    childComponents: mockChildComponents(0, true),
    error: {
      type: 'custom',
      message: 'This field has an error',
    },
    context: {
      components: {
        'date-of-birth': defaultPatternComponents['date-of-birth'],
        'email-input': defaultPatternComponents['email-input'],
      },
      config: {
        patterns: {},
      },
      uswdsRoot: '/uswds/',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const legend = await canvas.findByText('Default Heading');
    expect(legend).toBeInTheDocument();

    const listItems = canvas.getAllByRole('list');
    expect(listItems.length).toBe(1);

    const dobError = await canvas.findByText('Invalid date of birth');
    expect(dobError).toBeInTheDocument();

    const emailError = await canvas.findByText('Invalid email address');
    expect(emailError).toBeInTheDocument();
  },
} satisfies StoryObj<typeof Repeater>;
