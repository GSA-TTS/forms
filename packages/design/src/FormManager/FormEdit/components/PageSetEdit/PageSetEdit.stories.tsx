import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@testing-library/react';

import {
  createPatternEditStoryMeta,
  testUpdateFormFieldOnSubmitByElement,
} from '../common/story-helper.js';
import PageSetEdit from './index.js';
import { createPatternTestForm } from '../../../../test-form.js';

const blueprint = createPatternTestForm({
  pageCount: 2,
  pageTitles: ['First page', 'Second page'],
  patternDistribution: {
    0: ['element-1', 'element-2'],
  },
  useSequence: false,
});

const storyConfig: Meta<typeof PageSetEdit> = {
  title: 'Edit components/PageSetEdit',
  ...createPatternEditStoryMeta({
    blueprint,
  }),
};
export default storyConfig;

export const Basic: StoryObj<typeof PageSetEdit> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pagesetHeaderElement = await canvas.findByText(/Page 1/);
    await testUpdateFormFieldOnSubmitByElement(
      canvasElement,
      pagesetHeaderElement,
      'Page title',
      'Page 1 updated'
    );
  },
};
