import { attachmentConfig } from './index.js';
import { type AttachmentPattern } from './config.js';
import {
  type CreatePrompt,
  type AttachmentProps,
  getFormSessionValue,
  validatePattern,
} from '../../index.js';

export const createPrompt: CreatePrompt<AttachmentPattern> = (
  _,
  session,
  pattern,
  options
) => {
  const extraAttributes: Record<string, any> = {};
  const sessionValue = getFormSessionValue(session, pattern.id);
  if (options.validate) {
    const isValidResult = validatePattern(
      attachmentConfig,
      pattern,
      sessionValue
    );
    if (!isValidResult.success) {
      extraAttributes['error'] = isValidResult.error;
    }
  }
  return {
    props: {
      _patternId: pattern.id,
      type: 'attachment',
      inputId: pattern.id,
      value: sessionValue,
      label: pattern.data.label,
      required: pattern.data.required,
      maxAttachments: pattern.data.maxAttachments,
      maxFileSizeMB: 10,
      allowedFileTypes: pattern.data.allowedFileTypes,
      ...extraAttributes,
    } as AttachmentProps,
    children: [],
  };
};
