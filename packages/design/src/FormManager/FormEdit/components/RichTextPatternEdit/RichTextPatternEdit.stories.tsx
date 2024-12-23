import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { type RichTextPattern } from '@atj/forms';
import { en as message } from '@atj/common/src/locales/en/app.js';

import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';

const editorText = 'Rich text...';

const pattern: RichTextPattern = {
  id: '1',
  type: 'rich-text',
  data: {
    text: `<p>${editorText}</p>`,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/RichTextPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;
export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {};

export const Formatting: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    userEvent.setup();

    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.richText.displayName)
    );

    const headingMap: Record<string, string> = {
      Heading: 'h2',
      Subheading: 'h3',
    };

    const listMap: Record<string, string> = {
      'Bullet list': 'listitem',
      'Ordered list': 'listitem',
    };

    const editor = within(canvas.getByRole('textbox'));

    async function clickButtonAndCheck(
      buttonName: string,
      selector: string,
      matcherFn: (selector: string) => HTMLElement
    ) {
      const button = canvas.getByRole('button', { name: buttonName });

      await userEvent.click(button);
      const element = matcherFn(selector);
      await expect(element).toBeInTheDocument();

      await userEvent.click(button);
      await expect(element).not.toBeInTheDocument();
    }

    for (const [buttonName, selector] of Object.entries(headingMap)) {
      await clickButtonAndCheck(buttonName, selector, selector =>
        editor.getByText(editorText, { selector })
      );
    }

    for (const [buttonName, selector] of Object.entries(listMap)) {
      await clickButtonAndCheck(buttonName, selector, selector =>
        editor.getByRole(selector)
      );
    }
  },
};
