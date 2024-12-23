import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { Database as SqliteDatabase } from 'better-sqlite3';
import knex, { type Knex } from 'knex';

const migrationsDirectory = path.resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../migrations'
);

export const createKnex = (config: Knex.Config): Knex => knex(config);

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

export const getFileSystemKnex = (path: string): Knex => {
  return getSqlite3Knex(path);
};

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
