import { type Database as SqliteDatabase } from 'better-sqlite3';
import { type Knex } from 'knex';
import { type Kysely } from 'kysely';

import { getInMemoryKnex } from '../clients/knex.js';
import { createSqliteDatabase } from '../clients/kysely/sqlite3.js';
import { type Database } from '../clients/kysely/types.js';
import { migrateDatabase } from '../management/migrate-database.js';

import { type DatabaseContext } from './types.js';

/**
 * Provides a context for accessing and managing a SQLite database stored in memory.
 *
 * This context is implemented for testing or temporary use cases where persistence is not required.
 */
export class InMemoryDatabaseContext implements DatabaseContext {
  public readonly engine = 'sqlite';
  knex?: Knex;
  kysely?: Kysely<Database>;
  sqlite3?: SqliteDatabase;

  constructor() {}

  async getKnex() {
    if (!this.knex) {
      this.knex = getInMemoryKnex();
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
    if (this.knex && this.sqlite3) {
      this.knex.client.releaseConnection(this.sqlite3);
    }
    if (this.knex) {
      await this.knex.destroy();
    }
    if (this.kysely) {
      await this.kysely.destroy();
    }
  }
}

export const createInMemoryDatabaseContext = async () => {
  const ctx = new InMemoryDatabaseContext();
  await migrateDatabase(ctx);
  return ctx;
};
