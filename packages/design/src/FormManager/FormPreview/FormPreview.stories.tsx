import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { FormPreview } from './index.js';
import {
  createPatternTestForm,
  createTestFormContext,
  createTestSession,
  createTestFormManagerContext,
} from '../../test-form.js';
import { FormManagerProvider } from '../store.js';

const meta: Meta<typeof FormPreview> = {
  title: 'FormManager/FormPreview',
  component: FormPreview,
  decorators: [
    (Story, args) => (
      <MemoryRouter initialEntries={['/']}>
        <FormManagerProvider
          context={createTestFormManagerContext()}
          session={createTestSession({ form: createPatternTestForm() })}
        >
          <Story {...args} />
        </FormManagerProvider>
      </MemoryRouter>
    ),
  ],
  args: {
    context: createTestFormContext(),
    form: createPatternTestForm(),
  },
  tags: ['autodocs'],
};

export default meta;

export const FormViewTest = {} satisfies StoryObj<typeof FormPreview>;
