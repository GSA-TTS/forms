import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { createTestBrowserFormService } from '@gsa-tts/forms-core/context';

import { createPatternTestForm } from '../../test-form.js';
import FormDelete from './FormDelete.js';

const meta: Meta<typeof FormDelete> = {
  title: 'FormManager/FormDelete',
  component: FormDelete,
  decorators: [
    (Story, args) => (
      <MemoryRouter initialEntries={['/']}>
        <Story {...args} />
      </MemoryRouter>
    ),
  ],
  args: {
    formId: 'test-form',
    formService: createTestBrowserFormService({
      'test-form': createPatternTestForm(),
    }),
  },
  tags: ['autodocs'],
};

export default meta;
export const FormDeleteTest = {} satisfies StoryObj<typeof FormDelete>;
