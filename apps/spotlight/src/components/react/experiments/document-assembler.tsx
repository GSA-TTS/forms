import React, { useState } from 'react';
import { generateDummyPDF } from '@atj/documents';

export const downloadPdfBytes = (bytes: Uint8Array) => {
  const base64 = btoa(String.fromCharCode(...bytes));
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:application/pdf;base64,' + encodeURIComponent(base64)
  );
  element.setAttribute('download', 'sample-document.pdf');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const generatePDF = async () => {
  const timestamp = new Date().toISOString();
  const pdfBytes = await generateDummyPDF({ timestamp });
  downloadPdfBytes(pdfBytes);
};

const previewPDF = async setPreviewPdfUrl => {
  const timestamp = new Date().toISOString();
  const pdfBytes = await generateDummyPDF({ timestamp });
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  setPreviewPdfUrl(URL.createObjectURL(pdfBlob));
};

export const DocumentAssembler = () => {
  const [previewPdfUrl, setPreviewPdfUrl] = useState<URL>();
  return (
    <div>
      <button className="usa-button" onClick={generatePDF}>
        Generate PDF
      </button>
      <button
        className="usa-button"
        onClick={() => previewPDF(setPreviewPdfUrl)}
      >
        Preview PDF
      </button>
      <div>
        {previewPdfUrl ? (
          <embed src={previewPdfUrl.toString()} width={500} height={600} />
        ) : null}
      </div>
    </div>
  );
};
