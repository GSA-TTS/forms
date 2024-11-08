import React from 'react';
import {
  type StoreApi,
  type StateCreator,
  type UseBoundStore,
  create,
} from 'zustand';
import { createContext } from 'zustand-utils';

import { type Result, failure } from '@atj/common';
import { type FormSession, type Blueprint } from '@atj/forms';

import { type FormListSlice, createFormListSlice } from './FormList/store.js';
import { type FormEditSlice, createFormEditSlice } from './FormEdit/store.js';
import { type FormManagerContext } from './index.js';

type StoreContext = {
  context: FormManagerContext;
  formId?: string;
  session: FormSession;
  savePeriodically?: boolean;
};

type FormManagerStore = FormEditSlice & FormListSlice & FormManagerSlice;
const { Provider, useStore } = createContext<StoreApi<FormManagerStore>>();
export const useFormManagerStore = useStore;

const createStore = ({
  context,
  formId,
  session,
  savePeriodically,
}: StoreContext) => {
  const store = create<FormManagerStore>((...args) => ({
    ...createFormEditSlice({ context, session })(...args),
    ...createFormListSlice({ context })(...args),
    ...createFormManagerSlice({ context, formId, session })(...args),
  }));
  if (savePeriodically) {
    initializePeriodicSave(store);
  }
  return store;
};

export const FormManagerProvider = (
  props: React.PropsWithChildren<StoreContext>
) => {
  return (
    <Provider createStore={() => createStore(props)}>{props.children}</Provider>
  );
};

type FormManagerSlice = {
  context: FormManagerContext;
  session: FormSession;
  formId?: string;
  saveStatus: {
    inProgress: boolean;
    lastSaved?: Date;
  };
  createNewForm: () => Promise<Result<string>>;
  saveForm: (blueprint: Blueprint) => void;
  setSession: (session: FormSession) => void;
};

type FormManagerSliceCreator = StateCreator<
  FormManagerSlice,
  [],
  [],
  FormManagerSlice
>;
const createFormManagerSlice =
  ({ context, formId, session }: StoreContext): FormManagerSliceCreator =>
  (set, get) => ({
    context,
    formId,
    session,
    saveStatus: {
      inProgress: false,
    },
    createNewForm: async function () {
      const result = await context.formService.initializeForm({
        summary: {
          title: `My form - ${new Date().toISOString()}`,
          description: '',
        },
      });
      if (!result.success) {
        return failure(result.error.message);
      }
      return {
        success: true,
        data: result.data.id,
      };
    },
    saveForm: async blueprint => {
      const { context, formId, saveStatus } = get();
      if (saveStatus.inProgress) {
        return;
      }
      set({
        saveStatus: {
          inProgress: true,
          lastSaved: saveStatus.lastSaved,
        },
      });
      if (formId === undefined) {
        const result = await context.formService.addForm(blueprint);
        if (result.success) {
          set({
            formId: result.data.id,
            saveStatus: {
              inProgress: false,
              lastSaved: new Date(result.data.timestamp),
            },
          });
        }
      } else {
        const result = await context.formService.saveForm(formId, blueprint);
        if (result.success) {
          set({
            saveStatus: {
              inProgress: false,
              lastSaved: new Date(result.data.timestamp),
            },
          });
        }
      }
    },
    setSession: session => {
      set({ session });
    },
  });

const initializePeriodicSave = (
  store: UseBoundStore<StoreApi<FormManagerStore>>
) => {
  let lastForm: Blueprint;
  setInterval(async () => {
    const { session, saveForm } = store.getState();
    if (session.form && session.form !== lastForm) {
      await saveForm(session.form);
      lastForm = session.form;
    }
  }, 5000);
};
