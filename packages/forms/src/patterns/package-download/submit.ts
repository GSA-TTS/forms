import { failure, success, type Result } from '@atj/common';

import { type Blueprint, type FormOutput } from '../..';
import { createFormOutputFieldData, fillPDF } from '../../documents';
import { sessionIsComplete } from '../../session';
import { type SubmitHandler } from '../../submission';

import { type PackageDownloadPattern } from './index';

export const downloadPackageHandler: SubmitHandler<
  PackageDownloadPattern
> = async (context, opts) => {
  if (!sessionIsComplete(context.config, opts.session)) {
    return failure('Form is not complete');
  }

  const outputsResult: Result<(FormOutput & { data: Uint8Array })[]> =
    await Promise.all(
      opts.session.form.outputs.map(async output => {
        const doc = await context.getDocument(output.id);
        if (!doc.success) {
          throw new Error(doc.error);
        }
        return {
          id: output.id,
          path: doc.data.path,
          fields: output.fields,
          formFields: output.formFields,
          data: doc.data.data,
        };
      })
    )
      .then(values => success(values))
      .catch(error => failure(error));
  if (!outputsResult.success) {
    return failure(outputsResult.error);
  }

  const documentsResult = await generateDocumentPackage(
    outputsResult.data,
    opts.session.data.values
  );
  if (!documentsResult.success) {
    return failure(documentsResult.error);
  }

  return success({
    attachments: documentsResult.data,
    session: opts.session,
  });
};

const generateDocumentPackage = async (
  outputs: (FormOutput & { data: Uint8Array })[],
  formData: Record<string, string>
) => {
  const errors = new Array<string>();
  const documents = new Array<{ fileName: string; data: Uint8Array }>();
  for (const document of outputs) {
    const docFieldData = createFormOutputFieldData(document, formData);
    const pdfDocument = await fillPDF(document.data, docFieldData);
    if (!pdfDocument.success) {
      errors.push(pdfDocument.error);
    } else {
      documents.push({
        fileName: document.path,
        data: pdfDocument.data,
      });
    }
  }
  if (errors.length > 0) {
    return {
      success: false as const,
      error: errors.join('\n'),
    };
  }
  return {
    success: true as const,
    data: documents,
  };
};
