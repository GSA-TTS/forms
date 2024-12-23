import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { type PageSetProps } from '@atj/forms';

import { FormManagerProvider } from '../../../FormManager/store.js';
import {
  createTestFormManagerContext,
  createTestSession,
  createTwoPatternTestForm,
} from '../../../test-form.js';

import PageSet from './PageSet.js';

const meta: Meta<typeof PageSet> = {
  title: 'patterns/PageSet',
  component: PageSet,
  decorators: [
    (Story, args) => (
      <MemoryRouter initialEntries={['/']}>
        <FormManagerProvider
          context={createTestFormManagerContext()}
          session={createTestSession({ form: createTwoPatternTestForm() })}
        >
          <Story {...args} />
        </FormManagerProvider>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

export const Basic = {
  args: {
    _patternId: 'test-id',
    type: 'page-set',
    pages: [
      {
        title: 'First page',
        selected: false,
        url: '#/?page=0',
      },
      {
        title: 'Second page',
        selected: true,
        url: '#/?page=0',
      },
    ],
    actions: [],
  } satisfies PageSetProps,
} satisfies StoryObj<typeof PageSet>;
