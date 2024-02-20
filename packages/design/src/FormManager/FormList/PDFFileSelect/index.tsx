import React from 'react';

import { FormService } from '@atj/form-service';

import { onFileInputChangeGetFile } from './file-input';
import { useDocumentImporter } from './hooks';

export default function PDFFileSelect({
  formService,
  baseUrl,
}: {
  formService: FormService;
  baseUrl: string;
}) {
  const { actions } = useDocumentImporter(formService, baseUrl);
  return (
    <div className="usa-form-group">
      <label className="usa-label" id="file-input-specific-hint" htmlFor="file-input-specific">
        Select a single PDF file
      </label>
      <div className="usa-file-input">
        <div className="usa-sr-only" aria-live="polite">No files selected.</div>
        <div className="usa-file-input__target">
          <div className="usa-file-input__box"></div>
          <div className="usa-file-input__instructions" aria-hidden="true">
            Drag file here or{' '}
            <span className="usa-file-input__choose">choose from folder</span>
          </div>
          
          <input
            className="usa-file-input__input"
            id="file-input-specific"
            aria-describedby="file-input-specific-hint"
            type="file"
            accept=".pdf"
            onChange={onFileInputChangeGetFile(async fileDetails => {
              actions.stepOneSelectPdfByUpload(fileDetails);
            })}
          />
        </div>
      </div>
      <label className="usa-label">
        Or use an example file, selected for testing purposes:
        <button
          className="usa-button--unstyled"
          onClick={async () => {
            actions.stepOneSelectPdfByUrl(
              'sample-documents/ca-unlawful-detainer/ud105.pdf'
            );
          }}
        >
          sample-documents/ca-unlawful-detainer/ud105.pdf
        </button>
        <button
          className="usa-button--unstyled"
          onClick={async () => {
            actions.stepOneSelectPdfByUrl(
              'sample-documents/alabama-name-change/ps-12.pdf'
            );
          }}
        >
          sample-documents/alabama-name-change/ps-12.pdf
        </button>
      </label>
    </div>
  );
}
