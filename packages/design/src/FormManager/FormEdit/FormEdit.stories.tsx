import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { FormManagerProvider } from '../store.js';

import FormEdit from './index.js';
import {
  createTestSession,
  createOnePageTwoPatternTestForm,
  createTestFormManagerContext,
} from '../../test-form.js';

const meta: Meta<typeof FormEdit> = {
  title: 'FormManager/FormEdit',
  component: FormEdit,
  decorators: [
    (Story, args) => (
      <MemoryRouter initialEntries={['/']}>
        <FormManagerProvider
          context={createTestFormManagerContext()}
          session={createTestSession({
            form: createOnePageTwoPatternTestForm(),
            route: {
              params: {
                page: '0',
              },
              url: '#',
            },
          })}
        >
          <Story {...args} />
        </FormManagerProvider>
      </MemoryRouter>
    ),
  ],
  args: {
    queryString: 'page=0',
  },
  tags: ['autodocs'],
};

export default meta;
export const FormEditTest: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    await editFieldLabel(canvasElement, 'Pattern 1', 'Pattern 1 (updated)');
    await editFieldLabel(canvasElement, 'Pattern 2', 'Pattern 2 (updated)');
  },
};

export const FormEditAddPattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the initial count of inputs
    const initialCount = (await canvas.findAllByRole('textbox')).length;

    const select = canvas.getAllByText('Add Element');
    await userEvent.click(canvas.getByText('Pattern 1'));
    //await userEvent.selectOptions(select, 'Text input');

    await Promise.all(
      select.map(async element => {
        return await userEvent.click(element);
      })
    );

    const finalCount = (await canvas.findAllByRole('textbox')).length;
    await expect(finalCount).toBeGreaterThan(initialCount);
  },
};

const editFieldLabel = async (
  element: HTMLElement,
  currentLabel: string,
  updatedLabel: string
) => {
  const canvas = within(element);

  // Give focus to the field matching `currentLabel`
  await userEvent.click(await canvas.findByLabelText(currentLabel));

  // Enter new text for first field
  const input = canvas.getByLabelText('Field label');
  const select = canvas.getAllByText('Add Element');

  await userEvent.clear(input);
  await userEvent.type(input, updatedLabel);
  //await userEvent.click(canvas.getByText('Add Element'));

  await Promise.all(
    select.map(async element => {
      return await userEvent.click(element);
    })
  );

  await userEvent.click(canvas.getByText(/save and close/i));

  waitFor(
    async () => {
      const newLabel = await canvas.getByLabelText(updatedLabel);
      await expect(newLabel).toBeInTheDocument();
    },
    { interval: 5 }
  );
};

export const FormEditReorderPattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const grabber = canvas.getAllByRole('button')[3];
    await grabber.focus();

    // Enter reordering mode with the spacebar
    await userEvent.type(grabber, ' ');
    await new Promise(r => setTimeout(r, 1000));

    // Press the arrow down, to move the first pattern to the second position
    await userEvent.type(grabber, '[ArrowDown]');
    await new Promise(r => setTimeout(r, 1000));

    // Press the spacebar to exit reordering mode
    await userEvent.type(grabber, ' ');
    await new Promise(r => setTimeout(r, 1000));

    // Pattern 1 should be after pattern 2 in the document
    const pattern1 = canvas.getByText('Pattern 1');
    const pattern2 = canvas.getByText('Pattern 2');
    expect(pattern2.compareDocumentPosition(pattern1)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  },
};
