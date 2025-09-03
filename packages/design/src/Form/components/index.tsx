import { PatternComponent, type ComponentForPattern } from '../types.js';

import AccordionRow from './AccordionRow/AccordionRow.js';
import Attachment from './Attachment/Attachment.js';
import Address from './Address/Address.js';
import Checkbox from './Checkbox/Checkbox.js';
import CheckboxGroup from './CheckboxGroup/CheckboxGroup.js';
import Date from './Date/Date.js';
import EmailInput from './EmailInput/EmailInput.js';
import Fieldset from './Fieldset/Fieldset.js';
import FormSummary from './FormSummary/FormSummary.js';
import GenderId from './GenderId/GenderId.js';
import PackageDownload from './PackageDownload/PackageDownload.js';
import Page from './Page/Page.js';
import PageSet from './PageSet/PageSet.js';
import Paragraph from './Paragraph/Paragraph.js';
import PhoneNumber from './PhoneNumber/PhoneNumber.js';
import RadioGroup from './RadioGroup/RadioGroup.js';
import Repeater from './Repeater/Repeater.js';
import RichText from './RichText/RichText.js';
import Sequence from './Sequence/Sequence.js';
import SelectDropdown from './SelectDropdown/SelectDropdown.js';
import Sex from './Sex/Sex.js';
import SocialSecurityNumber from './SocialSecurityNumber/SocialSecurityNumber.js';
import SubmissionConfirmation from './SubmissionConfirmation/SubmissionConfirmation.js';
import TextInput from './TextInput/TextInput.js';
import TextArea from './TextArea/TextArea.js';
import Name from './Name/Name.js';

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
