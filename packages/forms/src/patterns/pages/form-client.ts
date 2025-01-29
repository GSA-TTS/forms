import { Form } from '../../builder';
import type { FormConfig } from '../../pattern';
import type { FormService } from '../../services';
import { type FormSession, type FormSessionId } from '../../session';
import { getActionString } from '../../submission';
import type { Blueprint } from '../../types';

type FormClientContext = {
  config: FormConfig;
  formService: FormService;
};

type FormClientState = {
  sessionId?: FormSessionId;
  session: FormSession;
  attachments?: {
    fileName: string;
    data: Uint8Array;
  }[];
};

export class FormClient {
  private form: Form;
  private _state?: FormClientState;

  constructor(
    private ctx: FormClientContext,
    private formId: string,
    blueprint: Blueprint
  ) {
    this.form = new Form(ctx.config, blueprint);
  }

  async getState(): Promise<FormClientState> {
    if (!this._state) {
      const result = await this.ctx.formService.getFormSession({
        formId: this.formId,
        formRoute: this.form.getInitialFormRoute(),
      });
      if (!result.success) {
        throw new Error('Error getting form session');
      }
      this._state = {
        sessionId: result.data.id,
        session: result.data.data,
      };
    }
    return this._state;
  }

  setState(state: FormClientState) {
    this._state = state;
  }

  async submitPage(formData: Record<string, string>): Promise<void> {
    const state = await this.getState();

    const result = await this.ctx.formService.submitForm(
      state.sessionId,
      this.formId,
      {
        ...formData,
        action: getActionString({
          handlerId: 'page-set',
          patternId: state.session.form.root,
        }),
      },
      state.session.route
    );
    if (!result.success) {
      throw new Error(`Error submitting form: ${result.error}`);
    }

    this.setState({
      sessionId: result.data.sessionId,
      session: result.data.session,
      attachments: result.data.attachments,
    });
  }
}
