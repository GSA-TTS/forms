import React from 'react';
import { type Decorator, type Meta } from '@storybook/react';

import { type Blueprint, type Pattern } from '@gsa-tts/forms-core';

import {
  createSimpleTestBlueprint,
  createTestFormManagerContext,
  createTestSession,
} from '../../../../test-form.js';

import FormEdit from '../../../FormEdit/index.js';
import { FormManagerProvider } from '../../../store.js';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

type PatternEditStoryMetaOptions = {
  pattern?: Pattern;
  blueprint?: Blueprint;
  decorators?: Decorator[];
};

export const createPatternEditStoryMeta = ({
  pattern,
  blueprint,
  decorators,
}: PatternEditStoryMetaOptions): Meta<typeof FormEdit> => {
  const form = blueprint ?? createSimpleTestBlueprint(pattern as Pattern);
  return {
    title: 'Untitled pattern edit story',
    component: FormEdit,
    decorators: [
      (Story, args) => (
        <MemoryRouter initialEntries={['/']}>
          <FormManagerProvider
            context={createTestFormManagerContext()}
            session={createTestSession({
              form,
            })}
          >
            <Story {...args} />
          </FormManagerProvider>
        </MemoryRouter>
      ),
      ...(decorators ?? []),
    ],
    args: {},
    tags: ['autodocs'],
  };
};

export const testUpdateFormFieldOnSubmit = async (
  canvasElement: HTMLElement,
  displayName: string,
  fieldLabel: string,
  updatedLabel: string,
  hintLabel?: string,
  updatedHintValue?: string
): Promise<void> => {
  const canvas = within(canvasElement);
  return testUpdateFormFieldOnSubmitByElement(
    canvasElement,
    await canvas.findByLabelText(displayName),
    fieldLabel,
    updatedLabel,
    hintLabel,
    updatedHintValue
  );
};

export const testUpdateFormFieldOnSubmitByElement = async (
  canvasElement: HTMLElement,
  element: HTMLElement,
  fieldLabel: string,
  updatedValue: string,
  hintLabel?: string,
  updatedHintValue?: string
): Promise<void> => {
  userEvent.setup();
  const canvas = within(canvasElement);

  await userEvent.click(element);
  const input = await canvas.findByLabelText(fieldLabel);

  // Enter new text for the field
  await userEvent.clear(input);
  await userEvent.type(input, updatedValue);

  // Enter new text for the Hint
  if (hintLabel && updatedHintValue) {
    const hint = await canvas.findByLabelText(hintLabel);
    await userEvent.clear(hint);
    await userEvent.type(hint, updatedHintValue);
  }

  const form = input?.closest('form');
  /**
   * The <enter> key behavior outside of Storybook submits the form, which commits the pending edit.
   * Here, we want to simulate the <enter> keypress in the story since Storybook manipulates
   * the default behavior and does not register the enter key if it's in the `userEvent.type` function arg.
   */
  form?.requestSubmit();

  const updatedElement = await canvas.findAllByText(updatedValue);
  await expect(updatedElement.length).toBeGreaterThan(0);
};

export const testEmptyFormLabelError = async (
  canvasElement: HTMLElement,
  displayName: string,
  fieldLabel: string,
  errorText: string
): Promise<void> => {
  const canvas = within(canvasElement);

  const element = await canvas.findByLabelText(displayName);
  return await testEmptyFormLabelErrorByElement(
    canvasElement,
    element,
    fieldLabel,
    errorText
  );
};

export const testEmptyFormLabelErrorByElement = async (
  canvasElement: HTMLElement,
  element: HTMLElement,
  fieldLabel: string,
  errorText: string
): Promise<void> => {
  userEvent.setup();

  const canvas = within(canvasElement);

  await userEvent.click(element);
  const input = await canvas.findByLabelText(fieldLabel);

  // Clear input, remove focus, and wait for error
  await userEvent.clear(input);
  input.blur();

  await expect(await canvas.findByText(errorText)).toBeInTheDocument();
};
