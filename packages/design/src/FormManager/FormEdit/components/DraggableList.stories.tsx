import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import { FormManagerProvider, useFormManagerStore } from '../../store.js';
import {
  createTestFormManagerContext,
  createTestSession,
  createPatternTestForm,
} from '../../../test-form.js';

import {
  DraggableList,
  DraggableListProps,
  DraggableListPresentation,
} from './PreviewSequencePattern/DraggableList.js';
import { getPattern } from '@gsa-tts/forms-core';

const meta: Meta<typeof DraggableList> = {
  title: 'patterns/DraggableList',
  component: DraggableList,
  decorators: [
    (Story, args) => {
      return (
        <MemoryRouter initialEntries={['/']}>
          <FormManagerProvider
            context={createTestFormManagerContext()}
            session={createTestSession({ form: createPatternTestForm() })}
          >
            <Story {...args} />
          </FormManagerProvider>
        </MemoryRouter>
      );
    },
  ],
  render: (args: DraggableListProps) => {
    const store = useFormManagerStore();
    const form = store.session.form;
    const { updatePattern } = store;
    const pattern = getPattern(form, 'root');

    return (
      <DraggableList
        order={pattern.data.patterns}
        presentation={args.presentation || 'default'}
        updateOrder={order => {
          updatePattern({
            ...pattern,
            data: {
              patterns: order,
            },
          });
        }}
      >
        {pattern.data.patterns.map((item: string, index: number) => {
          return (
            <div key={index} className="padding-x-2 padding-y-1">
              {item}
            </div>
          );
        })}
      </DraggableList>
    );
  },
  tags: ['autodocs'],
};
export default meta;

export const Compact: StoryObj<typeof DraggableList> & {
  args: { presentation: DraggableListPresentation };
} = {
  args: {
    presentation: 'compact',
  },
};

export const Default: StoryObj<typeof DraggableList> & {
  args: { presentation: DraggableListPresentation };
} = {
  args: {
    presentation: 'default',
  },
};
