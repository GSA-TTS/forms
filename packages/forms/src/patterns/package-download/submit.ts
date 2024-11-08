import { failure, success } from '@atj/common';

import { type Blueprint } from '../..';
import { createFormOutputFieldData, fillPDF } from '../../documents';
import { sessionIsComplete } from '../../session';
import { type SubmitHandler } from '../../submission';

import { type PackageDownloadPattern } from './index';

export const downloadPackageHandler: SubmitHandler<
  PackageDownloadPattern
> = async (config, opts) => {
  if (!sessionIsComplete(config, opts.session)) {
    return failure('Form is not complete');
  }

  const documentsResult = await generateDocumentPackage(
    opts.session.form,
    opts.session.data.values
  );
  if (!documentsResult.success) {
    console.log('values', opts.session.data.values);
    return failure(documentsResult.error);
  }

  return success({
    attachments: documentsResult.data,
    session: opts.session,
  });
};

const generateDocumentPackage = async (
  form: Blueprint,
  formData: Record<string, string>
) => {
  const errors = new Array<string>();
  const documents = new Array<{ fileName: string; data: Uint8Array }>();
  for (const document of form.outputs) {
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
