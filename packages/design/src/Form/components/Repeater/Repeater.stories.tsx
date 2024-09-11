import type { Meta, StoryObj } from '@storybook/react';

import Repeater from './index.js';

export default {
  title: 'patterns/Repeater',
  component: Repeater,
  tags: ['autodocs'],
} satisfies Meta<typeof Repeater>;

export const RepeaterSection = {
  args: {
    legend: 'Default Heading',
    type: 'repeater',
    _patternId: 'test-id',
  },
} satisfies StoryObj<typeof Repeater>;
