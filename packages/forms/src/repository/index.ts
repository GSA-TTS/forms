import { type ServiceMethod, createService } from '@atj/common';
import { type DatabaseContext } from '@atj/database';

import { type AddForm, addForm } from './add-form.js';
import { type DeleteForm, deleteForm } from './delete-form.js';
import { type GetForm, getForm } from './get-form.js';
import { type GetFormList, getFormList } from './get-form-list.js';
import { type GetFormSession, getFormSession } from './get-form-session.js';
import { type SaveForm, saveForm } from './save-form.js';
import {
  type UpsertFormSession,
  upsertFormSession,
} from './upsert-form-session.js';

export interface FormRepository {
  addForm: ServiceMethod<AddForm>;
  deleteForm: ServiceMethod<DeleteForm>;
  getForm: ServiceMethod<GetForm>;
  getFormSession: ServiceMethod<GetFormSession>;
  getFormList: ServiceMethod<GetFormList>;
  saveForm: ServiceMethod<SaveForm>;
  upsertFormSession: ServiceMethod<UpsertFormSession>;
}

export const createFormsRepository = (ctx: DatabaseContext): FormRepository =>
  createService(ctx, {
    addForm,
    deleteForm,
    getFormList,
    getFormSession,
    getForm,
    saveForm,
    upsertFormSession,
  });
