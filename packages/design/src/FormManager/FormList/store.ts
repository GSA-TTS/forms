import { type StateCreator } from 'zustand';

import { BlueprintBuilder, uint8ArrayToBase64 } from '@gsa-tts/forms-core';
import { type FormManagerContext } from '../types.js';
import { type Result, failure } from '@gsa-tts/forms-common';

type StoreContext = {
  context: FormManagerContext;
};

export type FormListSlice = {
  context: FormManagerContext;
  createNewFormByPDFUrl: (url: string) => Promise<Result<string>>;
  createNewFormByPDFUpload: (fileDetails: {
    name: string;
    data: Uint8Array;
  }) => Promise<Result<string>>;
};

type FormListSliceCreator = StateCreator<FormListSlice, [], [], FormListSlice>;
export const createFormListSlice =
  ({ context }: StoreContext): FormListSliceCreator =>
  () => ({
    context,
    createNewFormByPDFUrl: async url => {
      const data = await fetchAsBase64(`${context.baseUrl}${url}`);
      const result = await context.formService.initializeForm({
        summary: {
          title: url,
          description: '',
        },
        document: {
          fileName: url,
          data,
        },
      });
      if (result.success) {
        return {
          success: true,
          data: result.data.id,
        };
      } else {
        return failure(result.error.message);
      }
    },
    createNewFormByPDFUpload: async fileDetails => {
      const builder = new BlueprintBuilder(context.config);
      builder.setFormSummary({
        title: fileDetails.name,
        description: '',
      });
      const result = await context.formService.initializeForm({
        summary: {
          title: fileDetails.name,
          description: '',
        },
        document: {
          fileName: fileDetails.name,
          data: await uint8ArrayToBase64(fileDetails.data),
        },
      });
      if (result.success) {
        return {
          success: true,
          data: result.data.id,
        };
      } else {
        return failure(result.error.message);
      }
    },
  });

const fetchAsBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const data = new Uint8Array(await blob.arrayBuffer());
  return uint8ArrayToBase64(data);
};
