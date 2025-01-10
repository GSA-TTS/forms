import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { type Database as SqliteDatabase } from 'better-sqlite3';
import knex, { type Knex } from 'knex';
import { type Kysely } from 'kysely';

import { type Database } from '../clients/kysely/types.js';
import { createSqliteDatabase } from '../clients/kysely/sqlite3.js';
import { migrateDatabase } from '../management/migrate-database.js';

import { type DatabaseContext } from './types.js';

const migrationsDirectory = path.resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../migrations'
);

/**
 * Provides a context for accessing and managing a SQLite database stored on the filesystem.
 */
export class FilesystemDatabaseContext implements DatabaseContext {
  public readonly engine = 'sqlite';
  knex?: Knex;
  kysely?: Kysely<Database>;
  sqlite3?: SqliteDatabase;

  constructor(private path: string) {}

  async getKnex() {
    if (!this.knex) {
      this.knex = knex({
        client: 'better-sqlite3',
        connection: {
          filename: this.path,
        },
        pool: {
          min: 1,
          max: 20,
        },
        useNullAsDefault: true,
        migrations: {
          directory: migrationsDirectory,
          loadExtensions: ['.mjs'],
        },
      });
    }
    return this.knex;
  }

  async getSqlite3(): Promise<SqliteDatabase> {
    const knex = await this.getKnex();
    if (!this.sqlite3) {
      this.sqlite3 = (await knex.client.acquireConnection()) as SqliteDatabase;
    }
    return this.sqlite3;
  }

  async getKysely() {
    if (!this.kysely) {
      const sqlite3 = await this.getSqlite3();
      this.kysely = createSqliteDatabase(sqlite3);
    }
    return this.kysely;
  }

  async destroy() {
    if (this.kysely) {
      await this.kysely.destroy();
    }
    if (this.knex) {
      await this.knex.destroy();
    }
  }
}

export const createFilesystemDatabaseContext = async (path: string) => {
  const ctx = new FilesystemDatabaseContext(path);
  await migrateDatabase(ctx);
  return ctx;
};
