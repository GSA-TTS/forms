// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import FormManager from './FormManager.js';
import { createTestFormManagerContext } from '../test-form.js';

export default {
  title: 'form/FormManager',
  component: FormManager,
  args: {
    context: createTestFormManagerContext(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormManager>;

export const TestForm: StoryObj = {};
