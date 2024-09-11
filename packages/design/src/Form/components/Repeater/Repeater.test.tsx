/**
 * @vitest-environment jsdom
 */
import { describeStories } from '../../../test-helper.js';
import meta, * as stories from './Repeater.stories.js';

describeStories(meta, stories);
