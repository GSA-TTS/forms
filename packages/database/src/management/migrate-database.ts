import { type DatabaseContext } from '../context/types.js';

/**
 * Handles database migration operations.
 *
 * Executes the latest database migrations for the given context and
 * returns a function to roll back these migrations if needed.
 *
 * @param {DatabaseContext} ctx - The database context providing access to
 *                                the database instance and migration utilities.
 *
 * @returns {Function} A function to roll back the last applied migrations.
 */
export const migrateDatabase = async (ctx: DatabaseContext) => {
  const db = await ctx.getKnex();
  await db.migrate.latest();
  return () => db.migrate.rollback();
};
