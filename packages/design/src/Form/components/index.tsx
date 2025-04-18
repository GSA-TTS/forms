import { PatternComponent, type ComponentForPattern } from '../index.js';

import AccordionRow from './AccordionRow/index.js';
import Attachment from './Attachment/index.js';
import Address from './Address/index.js';
import Checkbox from './Checkbox/index.js';
import CheckboxGroup from './CheckboxGroup/index.js';
import Date from './Date/index.js';
import EmailInput from './EmailInput/index.js';
import Fieldset from './Fieldset/index.js';
import FormSummary from './FormSummary/index.js';
import GenderId from './GenderId/index.js';
import PackageDownload from './PackageDownload/index.js';
import Page from './Page/index.js';
import PageSet from './PageSet/index.js';
import Paragraph from './Paragraph/index.js';
import PhoneNumber from './PhoneNumber/index.js';
import RadioGroup from './RadioGroup/index.js';
import Repeater from './Repeater/index.js';
import RichText from './RichText/index.js';
import Sequence from './Sequence/index.js';
import SelectDropdown from './SelectDropdown/index.js';
import Sex from './Sex/index.js';
import SocialSecurityNumber from './SocialSecurityNumber/index.js';
import SubmissionConfirmation from './SubmissionConfirmation/index.js';
import TextInput from './TextInput/index.js';
import TextArea from './TextArea/index.js';
import Name from './Name/index.js';

export const defaultPatternComponents: ComponentForPattern = {
  'accordion-row': AccordionRow as PatternComponent,
  attachment: Attachment as PatternComponent,
  address: Address as PatternComponent,
  checkbox: Checkbox as PatternComponent,
  'checkbox-group': CheckboxGroup as PatternComponent,
  'date-of-birth': Date as PatternComponent,
  'date-picker': Date as PatternComponent,
  'email-input': EmailInput as PatternComponent,
  fieldset: Fieldset as PatternComponent,
  'form-summary': FormSummary as PatternComponent,
  'gender-id': GenderId as PatternComponent,
  input: TextInput as PatternComponent,
  'package-download': PackageDownload as PatternComponent,
  page: Page as PatternComponent,
  'page-set': PageSet as PatternComponent,
  paragraph: Paragraph as PatternComponent,
  'phone-number': PhoneNumber as PatternComponent,
  'radio-group': RadioGroup as PatternComponent,
  repeater: Repeater as PatternComponent,
  'rich-text': RichText as PatternComponent,
  'select-dropdown': SelectDropdown as PatternComponent,
  sequence: Sequence as PatternComponent,
  'sex-input': Sex as PatternComponent,
  'social-security-number': SocialSecurityNumber as PatternComponent,
  'submission-confirmation': SubmissionConfirmation as PatternComponent,
  'text-area': TextArea as PatternComponent,
  'name-input': Name as PatternComponent,
};
