import type { Meta, StoryObj } from '@storybook/react';

import SubmissionConfirmation from './SubmissionConfirmation.js';

export default {
  title: 'patterns/SubmissionConfirmation',
  component: SubmissionConfirmation,
  tags: ['autodocs'],
} satisfies Meta<typeof SubmissionConfirmation>;

export const SubmissionConfirmationExample = {
  args: {
    type: 'submission-confirmation',
    table: [
      { label: 'Field 1', value: 'Value 1' },
      { label: 'Field 2', value: 'Value 2' },
      { label: 'Field 3', value: 'Value 3' },
      { label: 'Field 4', value: 'Value 4' },
    ],
  },
} satisfies StoryObj<typeof SubmissionConfirmation>;
