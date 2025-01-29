import { getByRole } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { experimental_AstroContainer } from 'astro/container';
import { type DOMWindow, JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import {
  type FormService,
  type FormSession,
  type InputPattern,
  type PagePattern,
  type PageSetPattern,
  createForm,
} from '@atj/forms';

import {
  type ServerOptions,
  createTestServerOptions,
} from '../../config/options.js';
import { createServerFormService } from '../../config/services.js';
import { createAstroContainer } from '../../config/testing.js';

import PageComponent from './[id].astro';

type TestContext = {
  serverOptions: ServerOptions;
  container: experimental_AstroContainer;
  formService: FormService;
  formId?: string;
};

describe('Form page', () => {
  test('Returns 404 with invalid form ID', async () => {
    const ctx = await createTestContext();
    await expect(FormPage.getForm(ctx, 'does-not-exist')).rejects.toThrow(
      'Failed to load page: Received status 404'
    );
  });

  test('Renders HTML form and generates correct form data when inputs are filled', async () => {
    const ctx = await createTestContext();
    const formId = await insertTestForm(ctx);
    const pom = await FormPage.getForm(ctx, formId);

    await pom.fillInput('Pattern 1', 'pattern one value');
    await pom.fillInput('Pattern 2', 'pattern two value');

    const formData = pom.getFormData();
    const values = Object.fromEntries(formData.entries());
    expect(values).toEqual({
      action: 'action/page-set/root',
      'element-1': 'pattern one value',
      'element-2': 'pattern two value',
    });
  });

  test('Submits form and displays stored data correctly', async () => {
    const ctx = await createTestContext();
    const formId = await insertTestForm(ctx);

    // Fill out form and get formData for submission
    const pom = await FormPage.getForm(ctx, formId);
    await pom.fillInput('Pattern 1', 'pattern one value');
    await pom.fillInput('Pattern 2', 'pattern two value');

    // Submit form and confirm redirect response
    // NOTE: this response does not include the `form_session_id` cookie due to
    // a limitation of the Astro experimental container renderer. Revisit this
    // in the future, when it hopefully is more feature-complete.
    const response = await submitForm(ctx, formId, pom.getFormData());
    expect(response.status).toEqual(302);
    expect(response.headers.get('Location')).toEqual(`/forms/${formId}?page=0`);

    // Confirm that new session is stored with correct values
    // TODO: Due to the limitation mentioned above, we need to query the
    // database for the form session. Revisit this in the future.
    const db = await ctx.serverOptions.db.getKysely();
    const sessionResult = await db
      .selectFrom('form_sessions')
      .where('form_id', '=', formId)
      .select(['id', 'form_id', 'data'])
      .executeTakeFirstOrThrow()
      .then(result => {
        return {
          id: result.id,
          formId: result.form_id,
          data: JSON.parse(result.data) as FormSession,
        };
      });
    expect(sessionResult.data.data).toEqual({
      errors: {},
      values: {
        'element-1': 'pattern one value',
        'element-2': 'pattern two value',
      },
    });
  });
});

const createTestContext = async (): Promise<TestContext> => {
  const serverOptions = await createTestServerOptions();
  const container = await createAstroContainer();
  const formService = createServerFormService(serverOptions, {
    isUserLoggedIn: () => true,
  });
  return {
    serverOptions,
    container,
    formService,
  };
};

const insertTestForm = async (context: TestContext) => {
  const testForm = createTestBlueprint();
  const result = await context.formService.addForm(testForm);
  if (!result.success) {
    expect.fail('Failed to add test form');
  }
  return result.data.id;
};

class FormPage {
  private constructor(private window: DOMWindow) {}

  static async getForm(
    context: TestContext,
    formId: string
  ): Promise<FormPage> {
    const response = await context.container.renderToResponse(PageComponent, {
      locals: {
        serverOptions: context.serverOptions,
        session: null,
        user: null,
      },
      params: { id: formId },
      request: new Request(`http://localhost/forms/${formId}`, {
        method: 'GET',
      }),
    });

    if (!response.ok) {
      return expect.fail(
        `Failed to load page: Received status ${response.status}`
      );
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('text/html')) {
      return expect.fail('Failed to load page: Expected HTML content');
    }

    const text = await response.text();
    const dom = new JSDOM(text);
    return new FormPage(dom.window);
  }

  async fillInput(label: string, value: string): Promise<void> {
    const input = getByRole(this.window.document.body, 'textbox', {
      name: label,
    });
    await userEvent.type(input, value);
  }

  getFormData(): FormData {
    const form = getByRole<HTMLFormElement>(this.window.document.body, 'form', {
      name: 'Test form',
    });
    const submitButton = getByRole(this.window.document.body, 'button', {
      name: 'Submit',
    });
    return new this.window.FormData(form, submitButton);
  }
}

export const createTestBlueprint = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
            rules: [],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
        {
          type: 'input',
          id: 'element-2',
          data: {
            label: 'Pattern 2',
            initial: 'test',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

const submitForm = async (
  context: TestContext,
  formId: string,
  formData: FormData,
  sessionId?: string
): Promise<Response> => {
  const response = await context.container.renderToResponse(PageComponent, {
    locals: {
      serverOptions: context.serverOptions,
      session: null,
      user: null,
    },
    params: { id: formId },
    request: new Request(`http://localhost/forms/${formId}`, {
      method: 'POST',
      body: formData,
      headers: sessionId ? { Cookie: `form_session_id=${sessionId}` } : {},
    }),
  });

  return response;
};
