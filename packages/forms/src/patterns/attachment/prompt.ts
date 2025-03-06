import type { AttachmentProps, CreatePrompt } from '../../components.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';
import { type AttachmentPattern } from './config.js';

export const createPrompt: CreatePrompt<AttachmentPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const sessionValue = getFormSessionValue(session, pattern.id);
  const sessionError = getFormSessionError(session, pattern.id);

  return {
    props: {
      _patternId: pattern.id,
      type: 'attachment',
      inputId: pattern.id,
      value: sessionValue,
      error: sessionError,
      label: pattern.data.label,
      required: pattern.data.required,
      maxAttachments: pattern.data.maxAttachments,
      maxFileSizeMB: 10,
      allowedFileTypes: pattern.data.allowedFileTypes,
    } as AttachmentProps,
    children: [],
  };
};
