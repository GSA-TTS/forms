import { type FormConfig } from '../pattern.js';

import { addressConfig } from './address/index.js';
import { checkboxConfig } from './checkbox.js';
import { fieldsetConfig } from './fieldset/index.js';
import { repeaterConfig } from './repeater/index.js';
import { formSummaryConfig } from './form-summary.js';
import { inputConfig } from './input/index.js';
import { pageConfig } from './page/index.js';
import { pageSetConfig } from './page-set/index.js';
import { paragraphConfig } from './paragraph.js';
import { radioGroupConfig } from './radio-group.js';
import { richTextConfig } from './rich-text.js';
import { sequenceConfig } from './sequence.js';

// This configuration reflects what a user of this library would provide for
// their usage scenarios. For now, keep here in the form service until we
// understand the usage scenarios better.
export const defaultFormConfig: FormConfig = {
  patterns: {
    'form-summary': formSummaryConfig,
    address: addressConfig,
    checkbox: checkboxConfig,
    fieldset: fieldsetConfig,
    input: inputConfig,
    page: pageConfig,
    'page-set': pageSetConfig,
    paragraph: paragraphConfig,
    repeater: repeaterConfig,
    'rich-text': richTextConfig,
    'radio-group': radioGroupConfig,
    sequence: sequenceConfig,
  },
} as const;

export * from './address/index.js';
export * from './fieldset/index.js';
export * from './input/index.js';
export * from './page/index.js';
export { type PagePattern } from './page/config.js';
export * from './page-set/index.js';
export { type PageSetPattern } from './page-set/config.js';
export * from './checkbox.js';
export * from './form-summary.js';
export * from './paragraph.js';
export * from './radio-group.js';
export * from './repeater/index.js';
export * from './sequence.js';
