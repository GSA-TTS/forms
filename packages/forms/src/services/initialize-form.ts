import * as z from 'zod';

import { type Result, failure, success } from '@atj/common';

import { BlueprintBuilder } from '../builder/index.js';
import { type FormServiceContext } from '../context/index.js';
import type { FormSummary } from '../types.js';
import { base64ToUint8Array } from '../util/base64.js';

type InitializeFormError = {
  status: number;
  message: string;
};
type InitializeFormResult = {
  timestamp: string;
  id: string;
};

export type InitializeForm = (
  ctx: FormServiceContext,
  opts:
    | unknown
    | {
        summary?: FormSummary;
        document?: { fileName: string; data: Uint8Array };
      }
) => Promise<Result<InitializeFormResult, InitializeFormError>>;

const base64 =
  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

const optionSchema = z.object({
  summary: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  document: z
    .object({
      fileName: z.string(),
      data: z
        .string()
        .refine(value => base64.test(value), {
          message: 'Invalid base64 string',
        })
        .transform(value => base64ToUint8Array(value)),
    })
    .optional(),
});

export const initializeForm: InitializeForm = async (ctx, opts) => {
  if (!ctx.isUserLoggedIn()) {
    return failure({
      status: 401,
      message: 'You must be logged in to initialize a new form',
    });
  }

  const parseResult = optionSchema.safeParse(opts);
  if (!parseResult.success) {
    return failure({
      status: 400,
      message: 'Invalid options',
    });
  }
  const { document, summary } = parseResult.data;

  const builder = new BlueprintBuilder(ctx.config);
  if (document !== undefined) {
    const parsePdfResult = await ctx
      .parsePdf(document.data)
      .then(result => success(result))
      .catch(err =>
        failure({
          status: 400,
          message: `Failed to parse PDF: ${err.message}`,
        })
      );
    if (!parsePdfResult.success) {
      return parsePdfResult;
    }
    const { parsedPdf } = parsePdfResult.data;

    builder.setFormSummary({
      title: parsedPdf.title || document.fileName,
      description: parsedPdf.description,
    });

    const fileName = document.fileName.split('/').pop() || 'my-form.pdf';
    const addDocumentResult = await ctx.repository.addDocument({
      fileName,
      data: document.data,
      extract: parsePdfResult.data,
    });
    if (!addDocumentResult.success) {
      return failure({
        status: 500,
        message: `Failed to add document: ${addDocumentResult.error}`,
      });
    }
    await builder.addDocumentRef({
      id: addDocumentResult.data.id,
      extract: parsedPdf,
    });
  }

  if (summary) {
    builder.setFormSummary(summary);
  }

  const result = await ctx.repository.addForm(builder.form);
  if (!result.success) {
    console.error('Failed to add form:', result.error);
    return failure({
      status: 500,
      message: result.error,
    });
  }
  return result;
};
