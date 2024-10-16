import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Repeater from './index.js';
import { expect, userEvent } from '@storybook/test';

export default {
  title: 'patterns/Repeater',
  component: Repeater,
  tags: ['autodocs'],
} satisfies Meta<typeof Repeater>;

const defaultArgs = {
  legend: 'Default Heading',
  _patternId: 'test-id',
};

export const Default = {
  args: {
    ...defaultArgs,
    type: 'repeater',
  },
} satisfies StoryObj<typeof Repeater>;

export const WithContents = {
  play: async ({ mount, args }) => {
    const canvas = await mount(<Repeater {...args} />);

    const addButton = canvas.getByRole('button', { name: /Add new item/ });
    const deleteButton = canvas.getByRole('button', { name: /Delete item/ });
    await userEvent.click(addButton);

    let inputs = await canvas.findAllByRole('textbox');
    await expect(inputs.length).toEqual(2);

    await userEvent.click(deleteButton);
    inputs = await canvas.findAllByRole('textbox');
    await expect(inputs.length).toEqual(1);
  },
  args: {
    ...defaultArgs,
    type: 'repeater',
    children: [
      // eslint-disable-next-line
      <div className="usa-form-group-wrapper">
        <label className="usa-label" htmlFor="input">
          Input
        </label>
        <input className="usa-input" type="text" id="input" name="input" />
      </div>,
    ],
  },
} satisfies StoryObj<typeof Repeater>;
