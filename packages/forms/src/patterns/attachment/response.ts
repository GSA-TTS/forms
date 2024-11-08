import { z } from 'zod';
import { ParseUserInput } from '../../pattern.js';
import { safeZodParseToFormError } from '../../util/zod.js';
import { type AttachmentPattern } from './config.js';

const createSchema = (data: AttachmentPattern['data']) => {
  // Define the maximum file size in bytes
  const maxFileSizeBytes = data.maxFileSizeMB * 1024 * 1024;

  // Define the schema for a single file in the FileList
  const fileSchema = z
    .instanceof(File)
    .refine((file: File) => data.allowedFileTypes.includes(file.type), {
      message: `Invalid file type`,
    })
    .refine((file: File) => file.size <= maxFileSizeBytes, {
      message: `Each file must be smaller than ${data.maxFileSizeMB} MB`,
    });

  // Define the schema for the FileList as a whole
  return z
    .custom<FileList>(
      (fileList: FileList) => {
        if (!(fileList instanceof FileList)) {
          return false;
        } else if (data.required && fileList.length === 0) {
          return false;
        } else if (fileList.length > data.maxAttachments) {
          return false;
        }
        return true;
      },
      {
        message:
          data.maxAttachments === 1
            ? `You must provide 1 file`
            : `You must provide between 1 and ${data.maxAttachments} file(s).`,
      }
    )
    .superRefine((fileList: FileList, ctx: z.RefinementCtx) => {
      Array.from(fileList).forEach(file => {
        const result = fileSchema.safeParse(file);
        if (!result.success) {
          result.error.errors.forEach((err: z.ZodIssue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: err.message,
            });
          });
        }
      });
    });
};

export type AttachmentPatternOutput = z.infer<ReturnType<typeof createSchema>>;

export const parseUserInput: ParseUserInput<
  AttachmentPattern,
  AttachmentPatternOutput
> = (pattern, obj) => {
  return safeZodParseToFormError(createSchema(pattern['data']), obj);
};
