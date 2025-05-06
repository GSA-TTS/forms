import type { Meta, StoryObj } from '@storybook/react';

import FormSummary from './FormSummary.js';

export default {
  title: 'patterns/FormSummary',
  component: FormSummary,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSummary>;

export const FormSummaryWithLongDescription = {
  args: {
    _patternId: 'test-id',
    type: 'form-summary',
    title: 'Form title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
} satisfies StoryObj<typeof FormSummary>;

export const FormSummaryWithShortDescription = {
  args: {
    _patternId: 'test-id',
    type: 'form-summary',
    title: 'Title 2',
    description: 'Short description',
  },
} satisfies StoryObj<typeof FormSummary>;
