import { z } from 'zod';
import { ParseUserInput } from '../../pattern.js';
import { safeZodParseToFormError } from '../../util/zod.js';
import { type AttachmentPattern } from './config.js';

const convertMBtoBytes = (sizeInMB: number) => {
  return sizeInMB * 1024 * 1024;
};

export type AttachmentPatternOutput = z.infer<ReturnType<typeof createSchema>>;

const normalizeFiles = (items: File | File[] | FileList): File[] => {
  if (items instanceof File) {
    // Empty input fields with a type of file will have a size of 0
    // and MIME type of application/octet-stream on both the client's `FormData`
    // and on the server.
    if (!items.size && items.type === 'application/octet-stream') {
      return [];
    }
    return [items];
  }
  if (typeof FileList !== 'undefined' && items instanceof FileList) {
    return Array.from(items);
  }
  return items as File[];
};

const createSchema = (data: AttachmentPattern['data']) => {
  const maxFileSizeBytes = convertMBtoBytes(data.maxFileSizeMB);

  return z
    .any()
    .transform(normalizeFiles)
    .refine(
      (items: File[]) => {
        return !(data.required && items.length === 0);
      },
      {
        message: 'This field is required',
      }
    )
    .refine(
      (items: File[]) => {
        return items.every(item => data.allowedFileTypes.includes(item.type));
      },
      {
        message: `Invalid file type`,
      }
    )
    .refine(
      (items: File[]) => {
        return items.length <= data.maxAttachments;
      },
      {
        message: `The maximum number of attachments is ${data.maxAttachments}`,
      }
    )
    .refine(
      (items: File[]) => {
        return items.every(item => item.size <= maxFileSizeBytes);
      },
      {
        message: `The maximum allowable size per file is ${data.maxFileSizeMB}MB`,
      }
    )
    .transform((items: File[]) => {
      /**
       * TODO: during the form filler epic, we'll want to switch this and other validation
       * methods to be async for consistency and talk about how we're returning the object on the session.
       * The tentative plan is to write the file to storage and return the ID on the session here.
       */
      return items.map(item => {
        return {
          name: item.name,
          data: 'YWJj', // Just some dummy base64 encoded data => "abc"
        };
      });
    });
};

export const parseUserInput: ParseUserInput<
  AttachmentPattern,
  AttachmentPatternOutput
> = (pattern, obj) => {
  return safeZodParseToFormError(createSchema(pattern['data']), obj);
};
