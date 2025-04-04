import { Preview } from '@storybook/react';

import '../static/uswds/styles/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    testTimeout: 60000, // Set global timeout for Storybook tests (60 seconds)
    },
};

export default preview;
