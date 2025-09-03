import {
  type PatternEditComponent,
  type EditComponentForPattern,
} from '../types.js';

import AccordionRowPatternEdit from './AccordionRowPatternEdit/AccordionRowPatternEdit.js';
import AddressPatternEdit from './AddressPatternEdit/AddressPatternEdit.js';
import AttachmentPatternEdit from './AttachmentPatternEdit/AttachmentPatternEdit.js';
import CheckboxPatternEdit from './CheckboxPatternEdit/CheckboxPatternEdit.js';
import CheckboxGroupPatternEdit from './CheckboxGroupPatternEdit/CheckboxGroupPatternEdit.js';
import DatePatternEdit from './DatePatternEdit/DatePatternEdit.js';
import EmailInputPatternEdit from './EmailInputPatternEdit/EmailInputPatternEdit.js';
import FieldsetEdit from './FieldsetEdit/FieldsetEdit.js';
import FormSummaryEdit from './FormSummaryEdit.js';
import InputPatternEdit from './InputPatternEdit/InputPatternEdit.js';
import GenderIdPatternEdit from './GenderIdPatternEdit/GenderIdPatternEdit.js';
import NamePatternEdit from './NamePatternEdit/NamePatternEdit.js';
import PackageDownloadPatternEdit from './PackageDownloadPatternEdit.js';
import PageSetEdit from './PageSetEdit/PageSetEdit.js';
import { PageEdit } from './PageEdit.js';
import ParagraphPatternEdit from './ParagraphPatternEdit/ParagraphPatternEdit.js';
import { PatternPreviewSequence } from './PreviewSequencePattern/PreviewSequencePattern.js';
import PhoneNumberPatternEdit from './PhoneNumberPatternEdit/PhoneNumberPatternEdit.js';
import RadioGroupPatternEdit from './RadioGroupPatternEdit/RadioGroupPatternEdit.js';
import RepeaterPatternEdit from './RepeaterPatternEdit/RepeaterPatternEdit.js';
import RichTextPatternEdit from './RichTextPatternEdit/RichTextPatternEdit.js';
import SelectDropdownPatternEdit from './SelectDropdownPatternEdit/SelectDropdownPatternEdit.js';
import SocialSecurityNumberPatternEdit from './SocialSecurityNumberPatternEdit/SocialSecurityNumberPatternEdit.js';
import SubmissionConfirmationEdit from './SubmissionConfirmationEdit.js';
import TextAreaPatternEdit from './TextAreaPatternEdit/SocialSecurityNumberPatternEdit.js';
import SexPatternEdit from './SexPatternEdit/SexPatternEdit.js';

export const defaultPatternEditComponents: EditComponentForPattern = {
  'accordion-row': AccordionRowPatternEdit as PatternEditComponent,
  address: AddressPatternEdit as PatternEditComponent,
  attachment: AttachmentPatternEdit as PatternEditComponent,
  checkbox: CheckboxPatternEdit as PatternEditComponent,
  'checkbox-group': CheckboxGroupPatternEdit as PatternEditComponent,
  'date-of-birth': DatePatternEdit as PatternEditComponent,
  'date-picker': DatePatternEdit as PatternEditComponent,
  'email-input': EmailInputPatternEdit as PatternEditComponent,
  fieldset: FieldsetEdit as PatternEditComponent,
  'form-summary': FormSummaryEdit as PatternEditComponent,
  'gender-id': GenderIdPatternEdit as PatternEditComponent,
  input: InputPatternEdit as PatternEditComponent,
  'name-input': NamePatternEdit as PatternEditComponent,
  'package-download': PackageDownloadPatternEdit as PatternEditComponent,
  page: PageEdit as PatternEditComponent,
  'page-set': PageSetEdit as PatternEditComponent,
  paragraph: ParagraphPatternEdit as PatternEditComponent,
  'phone-number': PhoneNumberPatternEdit as PatternEditComponent,
  'radio-group': RadioGroupPatternEdit as PatternEditComponent,
  repeater: RepeaterPatternEdit as PatternEditComponent,
  'rich-text': RichTextPatternEdit as PatternEditComponent,
  'select-dropdown': SelectDropdownPatternEdit as PatternEditComponent,
  sequence: PatternPreviewSequence as PatternEditComponent,
  'social-security-number':
    SocialSecurityNumberPatternEdit as PatternEditComponent,
  'submission-confirmation': SubmissionConfirmationEdit as PatternEditComponent,
  'text-area': TextAreaPatternEdit as PatternEditComponent,
  'sex-input': SexPatternEdit as PatternEditComponent,
};
