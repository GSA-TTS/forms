import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import DocumentImporter from './index.js';
import { createTwoPatternTestForm } from '../../../test-form.js';

const meta: Meta<typeof DocumentImporter> = {
  title: 'FormManager/DocumentImporter',
  component: DocumentImporter,
  decorators: [
    (Story, args) => (
      <MemoryRouter initialEntries={['/']}>
        <Story {...args} />
      </MemoryRouter>
    ),
  ],
  parameters: {
    formId: 'test-id',
    form: createTwoPatternTestForm(),
  },
  tags: ['autodocs'],
};

export default meta;
export const TestForm = {} satisfies StoryObj<typeof DocumentImporter>;
