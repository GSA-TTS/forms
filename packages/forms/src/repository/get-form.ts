import { type DatabaseContext } from '@atj/database';

import { type Blueprint } from '../index.js';

export type GetForm = (
  ctx: DatabaseContext,
  formId: string
) => Promise<Blueprint | null>;

export const getForm: GetForm = async (ctx, formId) => {
  const db = await ctx.getKysely();
  const selectResult = await db
    .selectFrom('forms')
    .select(['data'])
    .where('id', '=', formId)
    .executeTakeFirst();

  if (selectResult === undefined) {
    return null;
  }

  return parseStringForm(selectResult.data);
};

const parseStringForm = (formString: string): Blueprint => {
  const form = JSON.parse(formString) as Blueprint;
  return {
    ...form,
    outputs: form.outputs.map((output: any) => ({
      ...output,
      data: base64ToUint8Array((output as any).data),
    })),
  };
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
