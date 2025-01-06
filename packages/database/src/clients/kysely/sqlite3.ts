import { Kysely, SqliteDialect } from 'kysely';
import {
  type Database as SqliteDatabase,
} from 'better-sqlite3';

import { type Database } from './types.js';

/**
 * Creates a query builder instance configured to use SQLite as the database dialect.
 *
 * @param {SqliteDatabase} database - The SQLite database connection or configuration object.
 */
export const createSqliteDatabase = (database: SqliteDatabase) => {
  return new Kysely<Database>({
    dialect: new SqliteDialect({
      database,
    }),
  });
};
