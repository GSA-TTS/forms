import React, { useEffect } from 'react';
import {
  type StoreApi,
  type StateCreator,
  create,
  UseBoundStore,
} from 'zustand';
import { createContext } from 'zustand-utils';

import { Result } from '@atj/common';
import { BlueprintBuilder, FormSession, type Blueprint } from '@atj/forms';

import { type FormEditSlice, createFormEditSlice } from './FormEdit/store';
import { type FormListSlice, createFormListSlice } from './FormList/store';
import { type FormManagerContext } from '.';
import { useSearchParams } from 'react-router-dom';

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
      const builder = new BlueprintBuilder(context.config);
      builder.setFormSummary({
        title: `My form - ${new Date().toISOString()}`,
        description: '',
      });
      const result = await context.formService.addForm(builder.form);
      if (!result.success) {
        return result;
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
        saveStatus: { inProgress: true, lastSaved: saveStatus.lastSaved },
      });
      if (formId === undefined) {
        const result = await context.formService.addForm(blueprint);
        if (result.success) {
          set({
            formId: result.data.id,
            saveStatus: { inProgress: false, lastSaved: result.data.timestamp },
          });
        }
      } else {
        const result = await context.formService.saveForm(formId, blueprint);
        if (result.success) {
          set({
            saveStatus: { inProgress: false, lastSaved: result.data.timestamp },
          });
        }
      }
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
