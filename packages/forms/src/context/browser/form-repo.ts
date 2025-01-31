import {
  type Result,
  type VoidResult,
  failure,
  success,
} from '@gsa-tts/forms-common';

import {
  FormSession,
  FormSessionId,
  type Blueprint,
  type DocumentFieldMap,
} from '../../index.js';
import { FormRepository } from '../../repository/index.js';
import type { ParsedPdf } from '../../documents/pdf/parsing-api.js';

const documentKey = (id: string) => `documents/${id}`;
const formKey = (formId: string) => `forms/${formId}`;
const isFormKey = (key: string) => key.startsWith('forms/');
const getFormIdFromKey = (key: string) => {
  const match = key.match(/^forms\/(.+)$/);
  if (!match) {
    throw new Error(`invalid key: "${key}"`);
  }
  return match[1];
};
const formSessionKey = (sessionId: string) => `formSessions/${sessionId}`;
//const isFormSessionKey = (key: string) => key.startsWith('formSessions/');

/**
 * Repository for managing forms, form sessions, and associated documents in the browser storage.
 * Provides functionality for CRUD operations on forms, form sessions, and documents.
 */
export class BrowserFormRepository implements FormRepository {
  constructor(private storage: Storage) {}

  getFormSession(
    id: string
  ): Promise<Result<{ id: FormSessionId; formId: string; data: FormSession }>> {
    const formSession = this.storage.getItem(formSessionKey(id));
    if (!formSession) {
      return Promise.resolve(failure(`not found: ${id}`));
    }
    return Promise.resolve({
      success: true,
      data: JSON.parse(formSession),
    });
  }

  upsertFormSession(opts: {
    id?: string;
    formId: string;
    data: FormSession;
  }): Promise<Result<{ timestamp: Date; id: string }>> {
    const id = opts.id || crypto.randomUUID();
    this.storage.setItem(
      formSessionKey(id),
      JSON.stringify({
        id,
        formId: opts.formId,
        data: opts.data,
      })
    );
    return Promise.resolve({
      success: true,
      data: {
        timestamp: new Date(),
        id,
      },
    });
  }

  async addForm(
    form: Blueprint
  ): Promise<Result<{ timestamp: string; id: string }>> {
    const uuid = crypto.randomUUID();

    const result = await this.saveForm(uuid, form);
    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        id: uuid,
      },
    };
  }

  async deleteForm(
    formId: string
  ): Promise<VoidResult<{ message: string; code: 'not-found' | 'unknown' }>> {
    this.storage.removeItem(formKey(formId));
    return { success: true };
  }

  async getForm(id?: string): Promise<Result<Blueprint | null>> {
    if (!this.storage || !id) {
      return success(null);
    }
    const formString = this.storage.getItem(`forms/${id}`);
    if (!formString) {
      return success(null);
    }
    return Promise.resolve(success(JSON.parse(formString)));
  }

  async getFormList(): Promise<
    { id: string; title: string; description: string }[] | null
  > {
    const forms = await getFormList(this.storage);
    if (forms === null) {
      return null;
    }
    return Promise.all(
      forms.map(async key => {
        const formResult = await this.getForm(key);
        if (!formResult.success) {
          throw new Error('Error getting form');
        }
        if (formResult.data === null) {
          throw new Error('key mismatch');
        }
        return {
          id: key,
          title: formResult.data.summary.title,
          description: formResult.data.summary.description,
        };
      })
    );
  }

  async saveForm(formId: string, form: Blueprint): Promise<VoidResult> {
    try {
      this.storage.setItem(formKey(formId), JSON.stringify(form));
    } catch {
      return failure(`error saving '${formId}' to storage`);
    }
    return { success: true };
  }

  addDocument(document: {
    fileName: string;
    data: Uint8Array;
    extract: { parsedPdf: ParsedPdf; fields: DocumentFieldMap };
  }) {
    const documentId = crypto.randomUUID();
    const data = uint8ArrayToBase64(document.data);
    this.storage.setItem(
      documentKey(documentId),
      JSON.stringify({
        id: documentId,
        type: 'pdf',
        file_name: document.fileName,
        data,
        extract: JSON.stringify(document.extract),
      })
    );
    return Promise.resolve(
      success({
        id: documentId,
      })
    );
  }

  getDocument(id: string): Promise<
    Result<{
      id: string;
      data: Uint8Array;
      path: string;
      fields: DocumentFieldMap;
    }>
  > {
    const value = this.storage.getItem(documentKey(id));
    if (value === null) {
      return Promise.resolve(failure(`Document with id ${id} not found`));
    }
    const json = JSON.parse(value);
    return Promise.resolve({
      ...json,
      data: base64ToUint8Array(json.data),
    });
  }
}

/**
 * Retrieves a list of form IDs stored in the provided storage object.
 *
 * @param {Storage} storage - The storage object to retrieve form keys from.
 */
export const getFormList = (storage: Storage) => {
  const keys = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key === null) {
      return null;
    }
    if (!isFormKey(key)) {
      continue;
    }
    keys.push(getFormIdFromKey(key));
  }
  return keys;
};

/**
 * Saves a form object to a provided storage mechanism with a specified form ID as the key.
 *
 * This function serializes the provided form object into JSON and stores it
 * in the given storage using the form ID transformed by `formKey` as the key.
 *
 * @param {Storage} storage - The storage mechanism where the form data will be saved.
 * @param {string} formId - The unique identifier for the form, used as the key in storage.
 * @param {Blueprint} form - The form object to be saved in storage.
 */
export const saveForm = (storage: Storage, formId: string, form: Blueprint) => {
  try {
    storage.setItem(formKey(formId), JSON.stringify(form));
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

const parseStringForm = (formString: string): Blueprint => {
  const form = JSON.parse(formString) as Blueprint;
  return {
    ...form,
    outputs: form.outputs.map(output => ({
      ...output,
      data: base64ToUint8Array((output as any).data),
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

const fixBase64 = (base64: string): string => {
  const padding = base64.length % 4;
  if (padding === 2) return base64 + '==';
  if (padding === 3) return base64 + '=';
  return base64;
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const fixedBase64 = fixBase64(base64);
  const binary = atob(fixedBase64);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
};
