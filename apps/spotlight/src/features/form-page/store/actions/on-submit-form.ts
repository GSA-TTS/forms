import { type FormPageContext } from './index.js';

export type OnSubmitForm = (
  ctx: FormPageContext,
  opts: {
    formId: string;
    sessionId?: string;
    data: Record<string, string>;
  }
) => void;

export const onSubmitForm: OnSubmitForm = async (ctx, opts) => {
  const state = ctx.getState();
  if (state.formSessionResponse.status !== 'loaded') {
    console.error("Can't submit data. Form session not loaded");
    return;
  }
  /*const newSession = applyPromptResponse(
                    config,
                    session,
                    response
                  );*/
  const submission = await ctx.config.formService.submitForm(
    opts.sessionId,
    opts.formId,
    opts.data,
    state.formSessionResponse.formSession.route
  );
  if (submission.success) {
    for (const document of submission.data.documents || []) {
      downloadPdfDocument(document.fileName, document.data);
    }
    ctx.setState({
      formSessionResponse: {
        status: 'loaded',
        formSession: submission.data.session,
        sessionId: submission.data.sessionId,
      },
    });
    window.localStorage.setItem('form_session_id', submission.data.sessionId);
  } else {
    console.error(submission.error);
  }
};

export const downloadPdfDocument = (fileName: string, pdfData: Uint8Array) => {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
