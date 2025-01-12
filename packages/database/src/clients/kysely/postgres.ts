import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import { type Database } from './types.js';

/**
 * Creates a new Postgres database connection.
 *
 * @param {string} connectionString - The connection string to connect to the Postgres database.
 * @param {boolean} ssl - A boolean indicating whether SSL should be used for the connection.
 *                         If true, SSL is enabled with the option to not reject unauthorized certificates.
 */
export const createPostgresDatabase = (
  connectionString: string,
  ssl: boolean
) => {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString,
        ssl: ssl ? { rejectUnauthorized: false } : false,
      }),
    }),
  });
};
