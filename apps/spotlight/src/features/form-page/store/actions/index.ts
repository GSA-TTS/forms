import { type ServiceMethod, createService } from '@gsa-tts/forms-common';

import { type AppContext, getAppContext } from '../../../../context.js';
import { type GetFormSession, getFormSession } from './get-form-session.js';
import { type Initialize, initialize } from './initialize.js';
import { type OnSubmitForm, onSubmitForm } from './on-submit-form.js';
import { type FormPageState } from '../state.js';

export type FormPageContext = {
  config: AppContext;
  getState: () => FormPageState;
  setState: (state: Partial<FormPageState>) => void;
};

export interface FormPageActions {
  getFormSession: ServiceMethod<GetFormSession>;
  initialize: ServiceMethod<Initialize>;
  onSubmitForm: ServiceMethod<OnSubmitForm>;
}

export const createFormPageActions = (
  getState: () => FormPageState,
  setState: (state: Partial<FormPageState>) => void
): FormPageActions => {
  const ctx: FormPageContext = {
    getState,
    setState,
    config: getAppContext(),
  };
  return createService(ctx, {
    getFormSession,
    initialize,
    onSubmitForm,
  });
};
