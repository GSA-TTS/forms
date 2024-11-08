/**
 * @vitest-environment jsdom
 */
import { describeStories } from '../../../test-helper.js';
import meta, * as stories from './EmailInput.stories.js';

describeStories(meta, stories);
