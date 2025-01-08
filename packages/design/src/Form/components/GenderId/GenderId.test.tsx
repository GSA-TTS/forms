/**
 * @vitest-environment jsdom
 */
import { describeStories } from '../../../test-helper.js';
import meta, * as stories from './GenderId.stories.js';

describeStories(meta, stories);
