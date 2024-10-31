import { PatternComponent, type ComponentForPattern } from '../index.js';

import Address from './Address/index.js';
import Checkbox from './Checkbox/index.js';
import Fieldset from './Fieldset/index.js';
import FormSummary from './FormSummary/index.js';
import Page from './Page/index.js';
import PageSet from './PageSet/index.js';
import Paragraph from './Paragraph/index.js';
import RadioGroup from './RadioGroup/index.js';
import Repeater from './Repeater/index.js';
import RichText from './RichText/index.js';
import Sequence from './Sequence/index.js';
import SubmissionConfirmation from './SubmissionConfirmation/index.js';
import TextInput from './TextInput/index.js';

export const defaultPatternComponents: ComponentForPattern = {
  address: Address as PatternComponent,
  checkbox: Checkbox as PatternComponent,
  fieldset: Fieldset as PatternComponent,
  'form-summary': FormSummary as PatternComponent,
  input: TextInput as PatternComponent,
  page: Page as PatternComponent,
  'page-set': PageSet as PatternComponent,
  paragraph: Paragraph as PatternComponent,
  'radio-group': RadioGroup as PatternComponent,
  repeater: Repeater as PatternComponent,
  'rich-text': RichText as PatternComponent,
  sequence: Sequence as PatternComponent,
  'submission-confirmation': SubmissionConfirmation as PatternComponent,
};
