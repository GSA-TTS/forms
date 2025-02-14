import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { within } from '@testing-library/react';

import { type AddressPattern } from '@atj/forms';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import FormEdit from '../../index.js';
import { enLocale as message } from '@atj/common';

const pattern: AddressPattern = {
  id: 'address-1',
  type: 'address',
  data: {
    legend: message.patterns.address.displayName,
    required: false,
    addMailingAddress: false,
  },
};

const storyConfig: Meta = {
  title: 'Edit components/AddressPattern',
  ...createPatternEditStoryMeta({
    pattern,
  }),
} as Meta<typeof FormEdit>;

export default storyConfig;

export const Basic: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const updatedLegend = 'Address Legend Update';

    await userEvent.click(
      canvas.getByText(message.patterns.address.displayName)
    );

    const legendInput = canvas.getByLabelText(
      message.patterns.address.fieldLabel
    );
    await userEvent.clear(legendInput);
    await userEvent.type(legendInput, updatedLegend);

    const form = legendInput?.closest('form');
    form?.requestSubmit();

    await expect(await canvas.findByText(updatedLegend)).toBeInTheDocument();
  },
};

export const Error: StoryObj<typeof FormEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByText(message.patterns.address.displayName)
    );

    const legendInput = canvas.getByLabelText(
      message.patterns.address.fieldLabel
    );
    await userEvent.clear(legendInput);
    legendInput.blur();

    await expect(
      await canvas.findByText(message.patterns.address.errorTextMustContainChar)
    ).toBeInTheDocument();
  },
};
