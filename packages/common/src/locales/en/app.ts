const defaults = {
  defaultFieldValue: 'Default field value',
  fieldLabel: 'Field label',
  fieldLabelRequired: 'A field label is required',
  fieldRequired: 'This field is required',
};

export const en = {
  patterns: {
    address: {
      ...defaults,
      displayName: 'Address',
      fieldLabel: 'Address label',
      legend: 'Physical address',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    attachment: {
      ...defaults,
      displayName: 'Attachment',
      maxAttachmentsLabel: 'Max attachments',
      allowedFileTypesLabel: 'Allowable file types',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
      errorUnsupportedFileType: 'Invalid file type found.',
    },
    checkbox: {
      ...defaults,
      displayName: 'Checkbox',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    fieldset: {
      ...defaults,
      displayName: 'Question set',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    input: {
      ...defaults,
      displayName: 'Short answer',
      maxLength: 'Maximum length',
    },
    textarea: {
      ...defaults,
      displayName: 'Long answer',
      maxLength: 'Maximum length',
      hintLabel: 'Hint Text (optional)',
      hint: 'The more specific you can be, the better. Use the space below and/or attach additional pages.',
    },
    packageDownload: {
      ...defaults,
      displayName: 'Package download',
      fieldLabel: 'Package download label',
    },
    page: {
      fieldLabel: 'Page title',
    },
    paragraph: {
      fieldLabel: 'Paragraph text',
      displayName: 'Paragraph',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    richText: {
      fieldLabel: 'Rich text',
      displayName: 'Rich text',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    radioGroup: {
      ...defaults,
      displayName: 'Multiple choice question label',
      fieldLabel: 'Multiple choice question label',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    selectDropdown: {
      ...defaults,
      displayName: 'Dropdown label',
      fieldLabel: 'Dropdown label',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    dateOfBirth: {
      ...defaults,
      displayName: 'Date of birth label',
      fieldLabel: 'Date of birth label',
      hintLabel: 'Date of birth Hint label',
      hint: 'For example: January 19 2000',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    emailInput: {
      ...defaults,
      displayName: 'Email label',
      fieldLabel: 'Email label',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    nameInput: {
      ...defaults,
      displayName: 'Name label',
      fieldLabel: 'Name field label',
      givenNameHint: 'First or given name hint',
      familyNameHint: 'Last or family name hint',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    phoneNumber: {
      ...defaults,
      displayName: 'Phone number label',
      fieldLabel: 'Phone number label',
      hintLabel: 'Phone number hint label',
      hint: '10-digit, U.S. only, for example 999-999-9999',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    ssn: {
      ...defaults,
      displayName: 'Social Security number label',
      fieldLabel: 'Social Security number label',
      hintLabel: 'Social Security number hint label',
      hint: 'For example, 555-11-0000',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    genderId: {
      ...defaults,
      displayName: 'Gender identity label',
      fieldLabel: 'Gender identity label',
      hintLabel: 'Gender identity hint label',
      hint: 'For example, man, woman, non-binary',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
      preferNotToAnswerTextLabel:
        'Prefer not to share my gender identity checkbox label',
    },
    sex: {
      ...defaults,
      displayName: 'Sex Input label',
      fieldLabel: 'Sex Input label',
      helperTextLabel: 'Helper text',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    repeater: {
      ...defaults,
      displayName: 'Repeatable Group',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
  },
};
