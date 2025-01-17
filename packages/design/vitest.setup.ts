import '@testing-library/jest-dom/vitest';

import { setProjectAnnotations } from '@storybook/react';

import { beforeAll } from 'vitest';
import * as projectAnnotations from './.storybook/preview.js';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations]);
beforeAll(project.beforeAll);
