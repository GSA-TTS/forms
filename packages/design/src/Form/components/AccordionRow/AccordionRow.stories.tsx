import React from 'react';
import { type Meta, type StoryObj } from '@storybook/react';

import AccordionRow from './index.js';

const meta: Meta<typeof AccordionRow> = {
  title: 'patterns/AccordionRow',
  component: AccordionRow,
  decorators: [
    Story => {
      return (
        <div className="padding-left-2">
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AccordionRow> = {
  args: {
    inputId: 'accordion-1',
    title: 'Accordion Row 1 (Closed)',
    text: 'This is the content of the first accordion row.',
    isOpen: false,
  },
};

export const Open: StoryObj<typeof AccordionRow> = {
  args: {
    inputId: 'accordion-2',
    title: 'Accordion Row 2 (Open)',
    text: 'This is the content of the second accordion row, and it is open by default.',
    isOpen: true,
  },
};

export const WithLongContent: StoryObj<typeof AccordionRow> = {
  args: {
    inputId: 'accordion-3',
    title: 'Accordion Row with Long Content',
    text: 'This is a longer content for the accordion row. It demonstrates how the component handles larger amounts of text. The content can span multiple lines and should still be displayed correctly within the accordion.',
    isOpen: true, // Starts open
  },
};
