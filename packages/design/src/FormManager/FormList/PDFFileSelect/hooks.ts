import { useNavigate } from 'react-router-dom';

import { type Result } from '@atj/common';
import { addDocument } from '@atj/documents';
import { FormElement, createForm } from '@atj/forms';
import { type FormService } from '@atj/form-service';
import { FormSummary } from '@atj/forms/src/config/elements/form-summary';

export const useDocumentImporter = (
  formService: FormService,
  baseUrl: string
) => {
  const navigate = useNavigate();

  return {
    actions: {
      stepOneSelectPdfByUrl: async (url: string) => {
        const result = await stepOneSelectPdfByUrl(
          { formService, baseUrl },
          url
        );
        if (result.success) {
          navigate(`/${result.data}/edit`);
        }
      },
      stepOneSelectPdfByUpload: async (fileDetails: {
        name: string;
        data: Uint8Array;
      }) => {
        const result = await stepOneSelectPdfByUpload(
          { formService },
          fileDetails
        );
        if (result.success) {
          navigate(`/${result.data}/edit`);
        }
      },
    },
  };
};

export const stepOneSelectPdfByUrl = async (
  ctx: { formService: FormService; baseUrl: string },
  url: string
): Promise<Result<string>> => {
  const completeUrl = `${ctx.baseUrl}${url}`;
  const response = await fetch(completeUrl);
  const blob = await response.blob();
  const data = new Uint8Array(await blob.arrayBuffer());

  const emptyForm = createForm({
    title: url,
    description: '',
  });
  const { updatedForm } = await addDocument(emptyForm, {
    name: url,
    data,
  });
  return ctx.formService.addForm(updatedForm);
};

export const stepOneSelectPdfByUpload = async (
  ctx: { formService: FormService },
  fileDetails: {
    name: string;
    data: Uint8Array;
  }
): Promise<Result<string>> => {
  const emptyForm = createForm(
    {
      title: fileDetails.name,
      description: '',
    },
    {
      root: 'root',
      elements: [
        {
          type: 'form-summary',
          id: 'form-summary',
          data: {
            title: fileDetails.name,
            description: '',
          },
        } as FormElement<FormSummary>,
      ],
    }
  );
  const { updatedForm } = await addDocument(emptyForm, fileDetails);
  return ctx.formService.addForm(updatedForm);
};
