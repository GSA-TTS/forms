// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/react';

import { createForm } from '@atj/forms';
import { createTestFormService } from '@atj/form-service';

import { FormSection } from '.';

export default {
  title: 'form/FormSection',
  component: FormSection,
  args: {
    formService: createTestFormService({
      'test-form': createForm(
        {
          title: 'Test form',
          description: 'Test description',
        },
        [
          {
            id: 'question-1',
            text: 'Question 1',
            initial: '',
            required: true,
          },
          {
            id: 'question-2',
            text: 'Question 2',
            initial: 'initial value',
            required: false,
          },
        ]
      ),
    }),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormSection>;

export const TestForm = {};
