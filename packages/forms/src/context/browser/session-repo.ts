import { type Result, type VoidResult } from '@atj/common';
import { type FormSession } from '../../index.js';

/**
 * Adds a form session to the specified storage and returns a unique identifier for the session.
 */
export const addFormToStorage = (
  storage: Storage,
  session: FormSession
): Result<string> => {
  const uuid = crypto.randomUUID();

  const result = saveSessionToStorage(storage, uuid, session);
  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: uuid,
  };
};

const saveSessionToStorage = (
  storage: Storage,
  sessionId: string,
  session: FormSession
): VoidResult => {
  try {
    storage.setItem(sessionId, stringifySession(session));
  } catch {
    return {
      success: false,
      error: `error saving '${sessionId}' to storage`,
    };
  }
  return {
    success: true,
  };
};

const stringifySession = (session: FormSession) => {
  return JSON.stringify(session);
};
