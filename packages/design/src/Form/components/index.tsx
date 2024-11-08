import { PatternComponent, type ComponentForPattern } from '../index.js';

import Address from './Address/index.js';
import Checkbox from './Checkbox/index.js';
import DateOfBirth from './DateOfBirth/index.js';
import EmailInput from './EmailInput/index.js';
import Fieldset from './Fieldset/index.js';
import FormSummary from './FormSummary/index.js';
import PackageDownload from './PackageDownload/index.js';
import Page from './Page/index.js';
import PageSet from './PageSet/index.js';
import Paragraph from './Paragraph/index.js';
import RadioGroup from './RadioGroup/index.js';
import RichText from './RichText/index.js';
import Sequence from './Sequence/index.js';
import SelectDropdown from './SelectDropdown/index.js';
import SubmissionConfirmation from './SubmissionConfirmation/index.js';
import TextInput from './TextInput/index.js';

export const defaultPatternComponents: ComponentForPattern = {
  address: Address as PatternComponent,
  checkbox: Checkbox as PatternComponent,
  'date-of-birth': DateOfBirth as PatternComponent,
  'email-input': EmailInput as PatternComponent,
  fieldset: Fieldset as PatternComponent,
  'form-summary': FormSummary as PatternComponent,
  input: TextInput as PatternComponent,
  'package-download': PackageDownload as PatternComponent,
  page: Page as PatternComponent,
  'page-set': PageSet as PatternComponent,
  paragraph: Paragraph as PatternComponent,
  'radio-group': RadioGroup as PatternComponent,
  'rich-text': RichText as PatternComponent,
  'select-dropdown': SelectDropdown as PatternComponent,
  sequence: Sequence as PatternComponent,
  'submission-confirmation': SubmissionConfirmation as PatternComponent,
};
