import { Form, FormSummary, createForm } from '@atj/forms';

export const getFormFromStorage = (
  storage: Storage,
  id?: string
): Form | null => {
  if (!storage || !id) {
    return null;
  }
  const formString = storage.getItem(id);
  if (!formString) {
    return null;
  }
  return parseStringForm(formString);
};

export const getFormListFromStorage = (storage: Storage): string[] | null => {
  const keys = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key === null) {
      return null;
    }
    keys.push(key);
  }
  return keys;
};

export const addFormToStorage = (
  storage: Storage,
  form: Form
): Result<string> => {
  const uuid = crypto.randomUUID();

  const result = saveFormToStorage(storage, uuid, form);
  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: uuid,
  };
};

export const saveFormToStorage = (
  storage: Storage,
  formId: string,
  form: Form
) => {
  try {
    storage.setItem(formId, stringifyForm(form));
  } catch {
    return {
      success: false as const,
      error: `error saving '${formId}' to storage`,
    };
  }
  return {
    success: true as const,
  };
};

export const deleteFormFromStorage = (storage: Storage, formId: string) => {
  storage.removeItem(formId);
};

const stringifyForm = (form: Form) => {
  return JSON.stringify({
    ...form,
    documents: form.documents.map(document => ({
      ...document,
      // TODO: we probably want to do this somewhere in the documents module
      data: uint8ArrayToBase64(document.data),
    })),
  });
};

const parseStringForm = (formString: string): Form => {
  const form = JSON.parse(formString) as Form;
  return {
    ...form,
    documents: form.documents.map(document => ({
      ...document,
      data: base64ToUint8Array((document as any).data),
    })),
  };
};

const uint8ArrayToBase64 = (buffer: Uint8Array): string => {
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
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
