import { StateCreator } from 'zustand';

import {
  type FormSession,
  type Pattern,
  type PatternId,
  type PatternMap,
  BlueprintBuilder,
  getPattern,
  getSessionPage,
  mergeSession,
} from '@gsa-tts/forms-core';
import { type FormManagerContext } from '../index.js';
import { type PatternFocus } from './types.js';
import {
  type NotificationSlice,
  createNotificationsSlice,
} from '../Notifications/index.js';
import { getRouteDataFromQueryString } from '@gsa-tts/forms-core';

export type FormEditSlice = {
  context: FormManagerContext;
  focus?: PatternFocus;
  session: FormSession;

  addPage: () => void;
  addPattern: (patternType: string) => void;
  addPatternToCompoundField: (
    patternType: string,
    targetPattern: PatternId
  ) => void;
  clearFocus: () => void;
  copyPattern: (parentPatternId: PatternId, patternId: PatternId) => void;
  deletePattern: (id: PatternId) => void;
  deleteSelectedPattern: () => void;
  movePattern: (
    sourcePage: PatternId,
    targetPage: PatternId,
    patternId: PatternId,
    position: string
  ) => void;
  setFocus: (patternId: PatternId) => boolean;
  setRouteParams: (routeParams: string) => void;
  updatePattern: (data: Pattern) => void;
  updateActivePattern: (formData: PatternMap) => boolean;
} & NotificationSlice;

type FormEditStoreContext = {
  context: FormManagerContext;
  session: FormSession;
};

type FormEditStoreCreator = StateCreator<FormEditSlice, [], [], FormEditSlice>;

export const createFormEditSlice =
  ({ context, session }: FormEditStoreContext): FormEditStoreCreator =>
  (set, get, store) => ({
    ...createNotificationsSlice()(set, get, store),
    context,
    session,
    addPage: () => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      const newPage = builder.addPage();
      set({
        session: mergeSession(state.session, { form: builder.form }),
        focus: { pattern: newPage },
      });
      state.addNotification('success', 'New page added successfully.');
    },
    addPattern: patternType => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      const page = getSessionPage(state.session);
      const newPattern = builder.addPatternToPage(patternType, page);

      set({
        session: mergeSession(state.session, { form: builder.form }),
        focus: { pattern: newPattern },
      });
      state.addNotification('success', 'Element added successfully.');
    },
    movePattern: (sourcePage, targetPage, patternId, position) => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );

      const movePatternBetweenPages = builder.movePatternBetweenPages(
        sourcePage,
        targetPage,
        patternId,
        position
      );

      set({
        session: mergeSession(state.session, { form: builder.form }),
        focus: { pattern: movePatternBetweenPages },
      });
      state.addNotification('success', 'Element moved successfully.');
    },

    copyPattern: (parentPatternId, patternId) => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );

      const copyPattern = builder.copyPattern(parentPatternId, patternId);
      set({
        session: mergeSession(state.session, { form: builder.form }),
        focus: { pattern: copyPattern },
      });
      state.addNotification('success', 'Element copied successfully.');
    },
    addPatternToCompoundField: (patternType, targetPattern) => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      const targetPatternType = builder.getPatternTypeById(targetPattern);
      if (['fieldset', 'repeater'].includes(targetPatternType)) {
        let newPattern: Pattern;
        if (targetPatternType === 'fieldset') {
          newPattern = builder.addPatternToFieldset(patternType, targetPattern);
        } else {
          newPattern = builder.addPatternToRepeater(patternType, targetPattern);
        }

        set({
          session: mergeSession(state.session, { form: builder.form }),
          focus: { pattern: newPattern },
        });
        state.addNotification(
          'success',
          `Element added to ${targetPatternType} successfully.`
        );
      }
    },
    clearFocus: () => {
      set({ focus: undefined });
    },
    deleteSelectedPattern: () => {
      const state = get();
      if (state.focus === undefined) {
        return;
      }
      state.deletePattern(state.focus.pattern.id);
    },
    deletePattern: (id: PatternId) => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      builder.removePattern(id);
      set({
        focus: undefined,
        session: mergeSession(state.session, {
          form: builder.form,
          route: state.session.route
            ? {
                url: state.session.route.url,
                params: {
                  ...state.session.route.params,
                  page: getSessionPage(state.session).toString(),
                },
              }
            : undefined,
          /*
          routeParams: {
            page: getSessionPage(state.session).toString(),
          },
          */
        }),
      });
      state.addNotification('success', 'Element removed successfully.');
    },
    setFocus: function (patternId) {
      const state = get();
      if (state.focus?.pattern.id === patternId) {
        return true;
      }
      if (state.focus?.errors) {
        return false;
      }
      const elementToSet = getPattern(state.session.form, patternId);
      if (elementToSet === undefined) {
        console.warn('Cannot focus on missing pattern.', patternId);
        return false;
      }
      if (elementToSet.type === 'page-set') {
        console.warn('Cannot focus on page-set.');
        return false;
      }
      if (elementToSet) {
        set({ focus: { errors: undefined, pattern: elementToSet } });
      } else {
        set({ focus: undefined });
      }
      return true;
    },
    setRouteParams: routeParams => {
      const state = get();
      set({
        session: mergeSession(state.session, {
          //routeParams: getRouteDataFromQueryString(routeParams),
          route: state.session.route
            ? {
                url: state.session.route.url,
                params: getRouteDataFromQueryString(routeParams),
              }
            : undefined,
        }),
      });
    },
    updatePattern: pattern => {
      const state = get();
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      const success = builder.updatePattern(
        state.session.form.patterns[pattern.id],
        {
          [pattern.id]: pattern.data,
        }
      );
      if (!success) {
        console.error('Failed to update pattern.', pattern);
      }
      if (success) {
        set({
          session: mergeSession(state.session, { form: builder.form }),
          focus: undefined,
        });
      }
    },
    updateActivePattern: formData => {
      const state = get();
      if (state.focus === undefined) {
        return false;
      }
      const builder = new BlueprintBuilder(
        state.context.config,
        state.session.form
      );
      const result = builder.updatePatternById(
        state.focus.pattern.id,
        formData
      );
      if (result.success) {
        set({
          session: mergeSession(state.session, { form: builder.form }),
          focus: {
            pattern: state.focus.pattern,
            errors: undefined,
          },
        });
        return true;
      } else {
        set({
          focus: {
            pattern: state.focus.pattern,
            errors: result.error,
          },
        });
        return false;
      }
    },
  });
