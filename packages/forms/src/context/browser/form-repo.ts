import { type Result, type VoidResult, failure } from '@atj/common';

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

  async deleteForm(formId: string): Promise<VoidResult> {
    this.storage.removeItem(formKey(formId));
    return { success: true };
  }

  async getForm(id?: string): Promise<Blueprint | null> {
    if (!this.storage || !id) {
      return null;
    }
    const formString = this.storage.getItem(`forms/${id}`);
    if (!formString) {
      return null;
    }
    return parseStringForm(formString);
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
        const form = await this.getForm(key);
        if (form === null) {
          throw new Error('key mismatch');
        }
        return {
          id: key,
          title: form.summary.title,
          description: form.summary.description,
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
    this.storage.setItem(
      documentKey(documentId),
      JSON.stringify({
        id: documentId,
        type: 'pdf',
        file_name: document.fileName,
        data: Buffer.from(document.data),
        extract: JSON.stringify(document.extract),
      })
    );
    return {} as Promise<Result<{ id: string }>>;
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
    return Promise.resolve(JSON.parse(value));
  }
}

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

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
