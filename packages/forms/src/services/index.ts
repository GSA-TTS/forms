import { createService, ServiceMethod } from '@atj/common';

import { type FormServiceContext } from '../context/index.js';

import { type AddForm, addForm } from './add-form.js';
import { type DeleteForm, deleteForm } from './delete-form.js';
import { type GetForm, getForm } from './get-form.js';
import { type GetFormList, getFormList } from './get-form-list.js';
import { type GetFormSession, getFormSession } from './get-form-session.js';
import { type SaveForm, saveForm } from './save-form.js';
import { type SubmitForm, submitForm } from './submit-form.js';

export const createFormService = (ctx: FormServiceContext) =>
  createService(ctx, {
    addForm,
    deleteForm,
    getForm,
    getFormList,
    getFormSession,
    saveForm,
    submitForm,
  });

export type FormService = {
  addForm: ServiceMethod<AddForm>;
  deleteForm: ServiceMethod<DeleteForm>;
  getForm: ServiceMethod<GetForm>;
  getFormList: ServiceMethod<GetFormList>;
  getFormSession: ServiceMethod<GetFormSession>;
  saveForm: ServiceMethod<SaveForm>;
  submitForm: ServiceMethod<SubmitForm>;
};
