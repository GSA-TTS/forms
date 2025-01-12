import { type DatabaseContext } from '@atj/database';

/**
 * Retrieves the unique identifier (ID) of a user based on their email address.
 *
 * @param {DatabaseContext} ctx - The database context used to establish a connection and perform the query.
 * @param {string} email - The email address of the user whose ID is to be retrieved.
 */
export const getUserId = async (ctx: DatabaseContext, email: string) => {
  const db = await ctx.getKysely();
  const user = await db.transaction().execute(trx => {
    return trx
      .selectFrom('users')
      .select('id')
      .where('email', '=', email)
      .executeTakeFirst();
  });

  if (!user) {
    return null;
  }

  return user.id;
};
