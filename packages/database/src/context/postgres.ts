import { type Knex } from 'knex';
import { type Kysely } from 'kysely';

import { getPostgresKnex } from '../clients/knex.js';
import { type Database } from '../clients/kysely/types.js';
import { createPostgresDatabase } from '../clients/kysely/postgres.js';
import { migrateDatabase } from '../management/migrate-database.js';

import { type DatabaseContext } from './types.js';
import { Pool } from 'pg';

/**
 * Provides a context for accessing and managing a PostgreSQL database.
 */
export class PostgresDatabaseContext implements DatabaseContext {
  public readonly engine = 'postgres';
  knex?: Knex;
  kysely?: Kysely<Database>;
  pool?: Pool;

  constructor(
    public readonly connectionUri: string,
    private ssl: boolean = false
  ) {}

  async getKnex() {
    if (!this.knex) {
      this.knex = getPostgresKnex(this.connectionUri, this.ssl);
    }
    return this.knex;
  }

  async getPostgresPool(): Promise<Pool> {
    const knex = await this.getKnex();
    if (!this.pool) {
      this.pool = (await knex.client.acquireConnection()) as Pool;
    }
    return this.pool;
  }

  async getKysely(): Promise<Kysely<Database>> {
    if (!this.kysely) {
      this.kysely = createPostgresDatabase(this.connectionUri, this.ssl);
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

export const createPostgresDatabaseContext = async (
  connectionUri: string,
  ssl: boolean
) => {
  const ctx = new PostgresDatabaseContext(connectionUri, ssl);
  await migrateDatabase(ctx);
  return ctx;
};
