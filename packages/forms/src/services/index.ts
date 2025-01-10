import { type ServiceMethod, createService } from '@atj/common';

import { type FormServiceContext } from '../context/index.js';

import { type AddForm, addForm } from './add-form.js';
import { type DeleteForm, deleteForm } from './delete-form.js';
import { type GetForm, getForm } from './get-form.js';
import { type GetFormList, getFormList } from './get-form-list.js';
import { type GetFormSession, getFormSession } from './get-form-session.js';
import { type InitializeForm, initializeForm } from './initialize-form.js';
import { type SaveForm, saveForm } from './save-form.js';
import { type SubmitForm, submitForm } from './submit-form.js';

/**
 * Factory function to create a form management service.
 *
 * @param {FormServiceContext} ctx - The context required to initialize the form service.
 */
export const createFormService = (ctx: FormServiceContext) =>
  createService(ctx, {
    addForm,
    deleteForm,
    getForm,
    getFormList,
    getFormSession,
    initializeForm,
    saveForm,
    submitForm,
  });

export type FormService = {
  addForm: ServiceMethod<AddForm>;
  deleteForm: ServiceMethod<DeleteForm>;
  getForm: ServiceMethod<GetForm>;
  getFormList: ServiceMethod<GetFormList>;
  getFormSession: ServiceMethod<GetFormSession>;
  initializeForm: ServiceMethod<InitializeForm>;
  saveForm: ServiceMethod<SaveForm>;
  submitForm: ServiceMethod<SubmitForm>;
};
