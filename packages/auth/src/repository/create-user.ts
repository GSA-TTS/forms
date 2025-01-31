import { randomUUID } from 'crypto';

import { type DatabaseContext } from '@gsa-tts/forms-database';

/**
 * Asynchronously creates a new user record in the database.
 *
 * @param {DatabaseContext} ctx - The database context used to interact with the database.
 * @param {string} email - The email address of the user to be created.
 */
export const createUser = async (ctx: DatabaseContext, email: string) => {
  const id = randomUUID();

  const db = await ctx.getKysely();
  const result = await db
    .insertInto('users')
    .values({
      id,
      email,
    })
    .onConflict(oc => oc.doNothing())
    .executeTakeFirst();

  if (!result.numInsertedOrUpdatedRows) {
    return null;
  }

  return {
    id,
    email,
  };
};
