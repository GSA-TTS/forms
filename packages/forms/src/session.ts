import { type FormError } from './error.js';
import { type SequencePattern } from './patterns/sequence.js';
import {
  type FormConfig,
  type Pattern,
  type PatternId,
  type PatternValue,
  type PatternValueMap,
  getPatternConfig,
  validatePattern,
} from './pattern.js';
import { type FormRoute, type RouteData } from './route-data.js';
import { type Blueprint } from './types.js';

export type FormErrorMap = Record<PatternId, FormError>;

export type FormSessionId = string;
export type FormSession = {
  data: {
    errors: FormErrorMap;
    values: PatternValueMap;
  };
  form: Blueprint;
  route?: {
    params: RouteData;
    url: string;
  };
};

export const nullSession: FormSession = {
  data: {
    errors: {},
    values: {
      root: [],
    },
  },
  form: {
    patterns: {
      root: {
        id: 'root',
        type: 'sequence',
        data: {
          patterns: [],
        },
      } satisfies SequencePattern,
    },
    root: 'root',
    summary: {
      title: '',
      description: '',
    },
    outputs: [],
  },
};

export const createFormSession = (
  form: Blueprint,
  route?: FormRoute
): FormSession => {
  return {
    data: {
      errors: {},
      values: {},
      /*
      values: Object.fromEntries(
        Object.values(form.patterns).map(pattern => {
          //return [pattern.id, config.patterns[pattern.id].initial];
          return [pattern.id, form.patterns[pattern.id].data.initial];
        })
      ),
      */
    },
    form,
    route: route,
  };
};

export const getFormSessionValue = (
  session: FormSession,
  patternId: PatternId
) => {
  return session.data.values[patternId];
};

export const getFormSessionError = (
  session: FormSession,
  patternId: PatternId
) => {
  return session.data.errors[patternId];
};

export const updateSessionValue = (
  session: FormSession,
  id: PatternId,
  value: PatternValue
): FormSession => {
  if (!(id in session.form.patterns)) {
    console.error(`Pattern "${id}" does not exist on form.`);
    return session;
  }
  const nextSession = addValue(session, id, value);
  const pattern = session.form.patterns[id];
  if (pattern.type === 'input') {
    if (pattern && !value) {
      return addError(nextSession, id, {
        type: 'required',
        message: 'Required value not provided.',
      });
    }
  }
  return nextSession;
};

export const updateSession = (
  session: FormSession,
  values: PatternValueMap,
  errors: FormErrorMap
): FormSession => {
  const keysValid =
    Object.keys(values).every(
      patternId => patternId in session.form.patterns
    ) &&
    Object.keys(errors).every(patternId => patternId in session.form.patterns);
  if (!keysValid) {
    throw new Error('invalid pattern reference updating session');
  }
  return {
    ...session,
    data: {
      errors: {
        ...session.data.errors,
        ...errors,
      },
      values: {
        ...session.data.values,
        ...values,
      },
    },
  };
};

export const sessionIsComplete = (config: FormConfig, session: FormSession) => {
  return Object.values(session.form.patterns).every(pattern => {
    const patternConfig = getPatternConfig(config, pattern.type);
    const value = getFormSessionValue(session, pattern.id);
    const isValidResult = validatePattern(patternConfig, pattern, value);
    if (!isValidResult.success) {
      console.error({
        pattern,
        error: isValidResult.error,
      });
    }
    return isValidResult.success;
  });
};

const addValue = <T extends Pattern = Pattern>(
  form: FormSession,
  id: PatternId,
  value: PatternValue<T>
): FormSession => ({
  ...form,
  data: {
    ...form.data,
    values: {
      ...form.data.values,
      [id]: value,
    },
  },
});

const addError = (
  session: FormSession,
  id: PatternId,
  error: FormError
): FormSession => ({
  ...session,
  data: {
    ...session.data,
    errors: {
      ...session.data.errors,
      [id]: error,
    },
  },
});

export const mergeSession = (
  oldSession: FormSession,
  newSession: Partial<FormSession>
): FormSession => ({
  ...oldSession,
  ...newSession,
});

export const getPageCount = (bp: Blueprint) => {
  const rootPattern = bp.patterns[bp.root];
  if (rootPattern.type !== 'page-set') {
    console.error('Root pattern is not a page set.');
    return 0;
  }
  return rootPattern.data.pages.length;
};

export const getSessionPage = (session: FormSession) => {
  const currentPageIndex = parseInt(session.route?.params.page as string) || 0;
  const lastPageIndex = getPageCount(session.form) - 1;
  if (currentPageIndex <= lastPageIndex) {
    return currentPageIndex;
  }
  return Math.max(0, lastPageIndex - 1);
};
