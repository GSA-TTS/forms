const defaults = {
  defaultFieldValue: 'Default field value',
  fieldLabel: 'Field label',
  fieldLabelRequired: 'A field label is required',
  fieldRequired: 'This field is required',
};

export const en = {
  patterns: {
    checkbox: {
      ...defaults,
      displayName: 'Checkbox',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    fieldset: {
      ...defaults,
      displayName: 'Fieldset',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    input: {
      ...defaults,
      displayName: 'Short answer',
      maxLength: 'Maximum length',
    },
    page: {
      fieldLabel: 'Page title',
    },
    paragraph: {
      fieldLabel: 'Paragraph Text',
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
      displayName: 'Radio group label',
      fieldLabel: 'Radio group label',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
    repeater: {
      ...defaults,
      displayName: 'Repeatable Group',
      errorTextMustContainChar: 'String must contain at least 1 character(s)',
    },
  },
};
