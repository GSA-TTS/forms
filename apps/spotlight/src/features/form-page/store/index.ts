import { create } from 'zustand';

import {
  type FormPageActions,
  createFormPageActions,
} from './actions/index.js';
import { type FormPageState, getInitialState } from './state.js';

type Store = FormPageState & {
  actions: FormPageActions;
};

export const useFormPageStore = create<Store>((set, get) => {
  return {
    ...getInitialState(),
    actions: createFormPageActions(get, set),
  };
});
