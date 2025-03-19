import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { type PageSetProps } from '@gsa-tts/forms-core';

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

const pages = [
  {
    title: 'First page',
    selected: false,
    url: '#/?page=0',
    active: false,
  },
  {
    title: 'Second page',
    selected: true,
    url: '#/?page=0',
    active: true,
  },
];

export const Basic = {
  args: {
    _patternId: 'test-id',
    type: 'page-set',
    links: {pages, pageWindow: pages},
    actions: [],
  } satisfies PageSetProps,
} satisfies StoryObj<typeof PageSet>;
