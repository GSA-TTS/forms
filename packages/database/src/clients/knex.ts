import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { Database as SqliteDatabase } from 'better-sqlite3';
import knex, { type Knex } from 'knex';

const migrationsDirectory = path.resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../migrations'
);

/**
 * Creates and configures a query builder instance configured for a PostgreSQL database.
 *
 * @param {string} connectionString - The connection string for the PostgreSQL database.
 * @param {boolean} [ssl=false] - Indicates whether SSL should be enabled for the connection.
 * If enabled, `rejectUnauthorized` will be set to `false` to allow self-signed certificates.
 */
export const getPostgresKnex = (
  connectionString: string,
  ssl: boolean = false
): Knex => {
  return knex({
    client: 'pg',
    connection: {
      connectionString,
      ssl: ssl ? { rejectUnauthorized: false } : false,
    },
    useNullAsDefault: true,
    migrations: {
      directory: migrationsDirectory,
      loadExtensions: ['.mjs'],
    },
  });
};

export const getInMemoryKnex = (): Knex => {
  return getSqlite3Knex(':memory:');
};

/**
 * Creates and configures a query builder instance configured for a SQLite database.
 *
 * @param {string} filename - The path to the SQLite database file.
 */
const getSqlite3Knex = (filename: string): Knex => {
  return knex({
    client: 'better-sqlite3',
    connection: {
      filename,
    },
    migrations: {
      directory: migrationsDirectory,
      loadExtensions: ['.mjs'],
    },
    pool: {
      afterCreate: (
        conn: SqliteDatabase,
        done: (err: Error | null, connection?: SqliteDatabase) => void
      ) => {
        try {
          conn.pragma('foreign_keys = ON');
          done(null, conn);
        } catch (err) {
          done(err as Error);
        }
      },
    },
    useNullAsDefault: true,
  });
};
