import { type FormSessionResponse } from './actions/get-form-session.js';

export type FormPageState = {
  formId: string;
  formSessionResponse: FormSessionResponse;
};

export const getInitialState = (): FormPageState => ({
  formId: '',
  formSessionResponse: { status: 'loading' },
});
