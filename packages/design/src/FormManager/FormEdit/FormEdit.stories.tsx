import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { FormManagerProvider } from '../store.js';

import FormEdit from './index.js';
import {
  createTestSession,
  createPatternTestForm,
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
            form: createPatternTestForm({
              patternCount: 3,
              requiredInputs: false,
              useSequence: false,
            }),
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

export const FormEditUpdateSummary: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    await editFormSummary(
      canvasElement,
      'New Form Title',
      'Updated Form Title',
      'This is an updated form description'
    );
  },
};


export const FormEditAddPattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the initial count of inputs
    const initialCount = (await canvas.findAllByRole('textbox')).length;

    const addElementMenuButton = canvas.getByRole('button', {
      name: /Add element/,
    });
    await userEvent.click(addElementMenuButton);

    // Add a new pattern
    const shortAnswer = canvas.getByRole('button', { name: /Short answer/ });
    await userEvent.click(shortAnswer);

    const saveButton = canvas.getByRole('button', { name: /Save/ });
    await userEvent.click(saveButton);

    const finalCount = (await canvas.findAllByRole('textbox')).length;
    await expect(finalCount).toBeGreaterThan(initialCount);
  },
};

const editFieldLabel = async (
  element: HTMLElement,
  currentLabel: string,
  updatedLabel: string,
  options? : {
    inputLabelText?: string;
    description?: string;
    descriptionLabelText?: string;
  }
) => {
  const canvas = within(element);
  const inputLabelText = options?.inputLabelText || 'Question text';

  if (options?.description && options?.descriptionLabelText) {
    await userEvent.click(await canvas.findByText(currentLabel));

    const input = canvas.getByLabelText(inputLabelText);
    await userEvent.clear(input);
    await userEvent.type(input, updatedLabel);

    const descriptionInput = canvas.getByLabelText(options.descriptionLabelText);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, options.description);
  } else {
    // Give focus to the field matching `currentLabel`
    await userEvent.click(await canvas.findByLabelText(currentLabel));

    const input = canvas.getByLabelText(inputLabelText);
    await userEvent.clear(input);
    await userEvent.type(input, updatedLabel);
  }

  await userEvent.click(canvas.getByText(/save and close/i));

  // Wait for the updated label to appear
  await waitFor(() => {
    const newLabel = options?.description ? canvas.getByText(updatedLabel) : canvas.getByLabelText(updatedLabel);
    expect(newLabel).toBeInTheDocument();
  });
};

const editFormSummary = (
  element: HTMLElement,
  currentTitle: string,
  updatedTitle: string,
  updatedDescription: string
) => {
  return editFieldLabel(element, currentTitle, updatedTitle, {
    inputLabelText: 'Title',
    description: updatedDescription,
    descriptionLabelText: 'Description'
  })
}

export const FormEditReorderPattern: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the buttons to appear
    const handle = await waitFor(async () => {
      const buttons = await canvas.findAllByRole('button', {
        name: 'Move this item',
      });
      expect(buttons).not.toHaveLength(0);
      return buttons;
    });

    const grabber = handle[2];

    // Enter reordering mode with the spacebar
    await userEvent.type(grabber, ' ');

    // Press the arrow down to move the first pattern to the second position
    await userEvent.type(grabber, '[ArrowDown]');

    // Press the spacebar to exit reordering mode
    await userEvent.type(grabber, ' ');

    // Wait for the DOM to update and verify the new order
    await waitFor(() => {
      const pattern1 = canvas.getByText('Pattern 1');
      const pattern2 = canvas.getByText('New Form Title');
      expect(pattern2.compareDocumentPosition(pattern1)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
  },
};
