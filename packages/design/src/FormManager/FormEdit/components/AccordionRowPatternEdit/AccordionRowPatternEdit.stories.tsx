import type { Meta, StoryObj } from '@storybook/react';

import { type AccordionRowPattern } from '@gsa-tts/forms-core';

import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

const pattern: AccordionRowPattern = {
  id: 'accordion-row-pattern-1',
  type: 'accordion-row',
  data: {
    title: 'Information box title',
    text: 'Helper text that adds supplementary information or instructions for the question',
    isOpen: false,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/AccordionRowPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLabel = 'Accordion Row update';
    const updatedText = 'Helper text update';

    await userEvent.click(
      canvas.getByText(message.patterns.accordionRow.fieldLabel)
    );

    const titleInput = canvas.getByLabelText(
      message.patterns.accordionRow.fieldLabel
    );
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, updatedLabel);

    const helperText = canvas.getByLabelText(
      message.patterns.accordionRow.textLabel
    );
    await userEvent.clear(helperText);
    await userEvent.type(helperText, updatedText);

    const form = titleInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLabel)).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.accordionRow.fieldLabel)
    );

    const titleInput = canvas.getByLabelText(
      message.patterns.accordionRow.fieldLabel
    );
    await userEvent.clear(titleInput);

    const textInput = canvas.getByLabelText(
      message.patterns.accordionRow.textLabel
    );
    await userEvent.clear(textInput);

    const form = textInput?.closest('form');
    form?.requestSubmit();

    await expect(
      await canvas.findByText('Text is required')
    ).toBeInTheDocument();
  },
};
