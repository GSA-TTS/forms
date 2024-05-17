import type { Meta, StoryObj } from '@storybook/react';

import { type ParagraphPattern } from '@atj/forms/src/patterns/paragraph';
import { en as message } from '@atj/common/src/locales/en/app';

import { createPatternEditStoryMeta } from './common/story-helper';
import FormEdit from '..';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

const pattern: ParagraphPattern = {
  id: '1',
  type: 'paragraph',
  data: {
    text: 'Lorem ipsum...',
  },
};

export default {
  title: 'Edit components/ParagraphPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export const Basic: StoryObj<typeof FormEdit> = {};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    userEvent.setup();

    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.paragraph.displayName)
    );

    const input = canvas.getByLabelText(message.patterns.paragraph.fieldLabel);

    // Clear input, remove focus, and wait for error
    await userEvent.clear(input);
    input.blur();

    await expect(
      await canvas.findByText(
        message.patterns.paragraph.errorTextMustContainChar
      )
    ).toBeInTheDocument();
  },
};
