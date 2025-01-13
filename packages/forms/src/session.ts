import { type FormError } from './error.js';
import { type SequencePattern } from './patterns/sequence.js';
import {
  type FormConfig,
  type Pattern,
  type PatternId,
  type PatternValue,
  type PatternValueMap,
  aggregatePatternSessionValues,
  aggregateValuesByPrefix,
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
    lastAction?: string;
    isFormBuilder?: boolean;
  };
  form: Blueprint;
  route?: {
    params: RouteData;
    url: string;
  };
};

/**
 * Representation of an initial or empty form session.
 */
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

/**
 * Creates a form session object using the provided form blueprint and optional route.
 */
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
      isFormBuilder: route?.options?.isFormBuilder ? true : false,
    },
    form,
    route: route,
  };
};

/**
 * Retrieves a specific value from the form session data based on the provided pattern ID.
 */
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

/**
 * Updates a form session with new values and errors, ensuring the
 * validity of the pattern references provided.
 */
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

/**
 * Checks if a form session is complete and valid by validating all patterns
 * against their corresponding configurations.
 */
export const sessionIsComplete = (config: FormConfig, session: FormSession) => {
  /*
   * TODO: check to see if the pattern is owned by a repeater field. If so, validate
   *  each field of the repeater based on the validation rules for the individual field type.
   */

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

/**
 * Updates the specified form session by adding or updating the value of a specific pattern.
 */
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

/**
 * Calculates the total number of pages in the page set of the provided blueprint's root pattern.
 */
export const getPageCount = (bp: Blueprint) => {
  const rootPattern = bp.patterns[bp.root];
  if (rootPattern.type !== 'page-set') {
    console.error('Root pattern is not a page set.');
    return 0;
  }
  return rootPattern.data.pages.length;
};

/**
 * Determines the current session page index based on the session's route parameters and form data.
 */
export const getSessionPage = (session: FormSession) => {
  const currentPageIndex = parseInt(session.route?.params.page as string) || 0;
  const lastPageIndex = getPageCount(session.form) - 1;
  if (currentPageIndex <= lastPageIndex) {
    return currentPageIndex;
  }
  return Math.max(0, lastPageIndex - 1);
};
