import { createService } from '@gsa-tts/forms-common';
import { type DatabaseContext } from '@gsa-tts/forms-database';

import { createSession } from './create-session.js';
import { createUser } from './create-user.js';
import { getUserId } from './get-user-id.js';

/**
 * Factory function to create an authentication repository.
 *
 * @param {DatabaseContext} ctx - The database context used for initializing the repository.
 * @returns Returns an authentication service object with methods to handle user authentication and management.
 *
 * The returned service object provides the following methods:
 * - `createSession`
 * - `createUser`
 * - `getUserId`
 */
export const createAuthRepository = (ctx: DatabaseContext) =>
  createService(ctx, {
    createSession,
    createUser,
    getUserId,
  });

export type AuthRepository = ReturnType<typeof createAuthRepository>;
