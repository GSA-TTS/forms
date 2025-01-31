import { enLocale as message } from '@gsa-tts/forms-common';

import { type PatternConfig } from '../../pattern.js';

import { parseConfigData, type AttachmentPattern } from './config.js';
import { createPrompt } from './prompt.js';
import { type AttachmentPatternOutput, parseUserInput } from './response.js';
import { attachmentFileTypeMimes } from './file-type-options';

export const attachmentConfig: PatternConfig<
  AttachmentPattern,
  AttachmentPatternOutput
> = {
  displayName: message.patterns.attachment.displayName,
  iconPath: 'shortanswer-icon.svg',
  initial: {
    label: 'File upload',
    required: true,
    maxAttachments: 1,
    allowedFileTypes: attachmentFileTypeMimes as [string, ...string[]],
    maxFileSizeMB: 10,
  },
  parseUserInput,
  parseConfigData,
  getChildren() {
    return [];
  },
  createPrompt,
};
