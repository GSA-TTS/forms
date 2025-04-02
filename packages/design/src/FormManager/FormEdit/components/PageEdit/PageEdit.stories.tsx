import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@testing-library/react';

import { createThreePageFormWithPageRules } from '../../../../test-form.js';
import { createPatternEditStoryMeta } from '../common/story-helper.js';
import { PageEdit } from './index.js';

const blueprint = createThreePageFormWithPageRules();

const storyConfig: Meta<typeof PageEdit> = {
  title: 'Edit components/PageEdit',
  ...createPatternEditStoryMeta({
    blueprint,
  }),
};
export default storyConfig;

export const CreateCustomRule: StoryObj<typeof PageEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    //const pagesetHeaderElement = await canvas.findByText(/Page 1/);
    canvas.getByRole('button', { name: /Create custom rule/ });
    //await userEvent.click(button);
  },
};
