import { z } from 'zod';
import { enLocale as message } from '@gsa-tts/forms-common';
import { ParsePatternConfigData, type Pattern } from '../../pattern.js';
import { safeZodParseFormErrors } from '../../util/zod.js';
import { attachmentFileTypeMimes } from './file-type-options';

export type AttachmentPattern = Pattern<AttachmentConfigSchema>;

export const configSchema = z.object({
  label: z.string().min(1, message.patterns.attachment.fieldLabelRequired),
  required: z.boolean(),
  maxAttachments: z.coerce.number().int().gt(0),
  maxFileSizeMB: z.coerce.number().int().gt(1).lte(10),
  allowedFileTypes: z.union([
    z
      .array(
        z.enum(
          attachmentFileTypeMimes as [(typeof attachmentFileTypeMimes)[number]]
        )
      )
      .nonempty(message.patterns.attachment.errorUnsupportedFileType),
    z.enum(
      attachmentFileTypeMimes as [(typeof attachmentFileTypeMimes)[number]]
    ),
  ]),
});

export type AttachmentConfigSchema = z.infer<typeof configSchema>;

export const parseConfigData: ParsePatternConfigData<
  AttachmentConfigSchema
> = obj => {
  let newObj = {
    ...(obj as AttachmentConfigSchema),
    maxFileSizeMB: (obj as AttachmentConfigSchema).maxFileSizeMB ?? 10,
  };

  return safeZodParseFormErrors(configSchema, newObj);
};
