import { type Blueprint } from '..';

export const stringifyForm = (form: Blueprint) => {
  return JSON.stringify({
    ...form,
    outputs: form.outputs.map((output: any) => ({
      ...output,
      // TODO: we probably want to do this somewhere in the documents module
      data: uint8ArrayToBase64(output.data),
    })),
  });
};

const uint8ArrayToBase64 = (buffer: Uint8Array): string => {
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
};
