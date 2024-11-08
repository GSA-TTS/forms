import { type Result } from '@atj/common';
import {
  type FormRoute,
  type FormSession,
  type FormSessionId,
  type Blueprint,
  type FormService,
  type FormSummary,
} from '@atj/forms';
import { type FormServiceContext } from '@atj/forms/context';

type FormServiceClientContext = {
  baseUrl: string;
};

export class FormServiceClient implements FormService {
  constructor(private ctx: FormServiceClientContext) {}

  async addForm(form: Blueprint) {
    console.log('add form');
    const response = await fetch(`${this.ctx.baseUrl}api/forms`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  }

  async initializeForm(
    opts:
      | unknown
      | {
          summary?: FormSummary;
          document?: { fileName: string; data: string };
        }
  ): Promise<
    Result<
      { timestamp: string; id: string },
      { status: number; message: string }
    >
  > {
    const options = opts as {
      summary?: FormSummary;
      document?: { fileName: string; data: string };
    };
    const body = JSON.stringify({
      summary: options.summary ? options.summary : undefined,
      document: options.document
        ? {
            fileName: options.document.fileName,
            data: options.document.data,
          }
        : undefined,
    });
    const response = await fetch(`${this.ctx.baseUrl}api/forms`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  }

  async deleteForm(formId: string) {
    const response = await fetch(`${this.ctx.baseUrl}api/forms/${formId}`, {
      method: 'DELETE',
    });
    return await response.json();
  }

  async getForm(formId: string) {
    const response = await fetch(`${this.ctx.baseUrl}api/forms/${formId}`);
    return await response.json();
  }

  async getFormList() {
    const response = await fetch(`${this.ctx.baseUrl}api/forms`);
    return await response.json();
  }

  async saveForm(formId: string, form: Blueprint) {
    const response = await fetch(`${this.ctx.baseUrl}api/forms/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  async submitForm(
    sessionId: FormSessionId | undefined,
    formId: string,
    formData: Record<string, string>,
    route?: FormRoute
  ): Promise<
    Result<{
      sessionId: string;
      session: FormSession;
      documents: {
        fileName: string;
        data: Uint8Array;
      }[];
    }>
  > {
    const payload: any = { formId, formData };
    if (sessionId !== undefined) {
      payload['sessionId'] = sessionId;
    }
    if (route !== undefined) {
      payload['route'] = route;
    }

    const response = await fetch(`${this.ctx.baseUrl}forms/${formId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  async getFormSession(_opts: {
    formId: string;
    formRoute: FormRoute;
    sessionId?: string;
  }): Promise<
    Result<{ id?: string | undefined; formId: string; data: FormSession }>
  > {
    throw new Error('Not implemented');
  }

  getContext() {
    return {} as unknown as FormServiceContext;
  }
}
