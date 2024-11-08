import { afterEach, beforeEach, describe, inject, SuiteFactory } from 'vitest';

import { type Engine } from './clients/kysely/types.js';
import {
  type ConnectionDetails,
  createTestDatabase,
  deleteTestDatabase,
} from './clients/test-containers.js';
import { InMemoryDatabaseContext } from './context/in-memory.js';
import { PostgresDatabaseContext } from './context/postgres.js';
import { type DatabaseContext } from './context/types.js';
import { migrateDatabase } from './management/migrate-database.js';

export type DbTestContext = {
  db: {
    engine: Engine;
    ctx: DatabaseContext;
  };
};

type PostgresDbTestContext = DbTestContext & {
  db: DbTestContext['db'] & {
    connectionDetails: ConnectionDetails;
    databaseName: string;
  };
};

export const describeDatabase = (
  name: string,
  fn: (...args: Parameters<SuiteFactory>) => ReturnType<SuiteFactory>,
  runMigrations: boolean = true
) => {
  describe(`PostgreSQL - ${name}`, { timeout: 60000 }, test => {
    beforeEach<PostgresDbTestContext>(async context => {
      const connectionDetails = inject('postgresConnectionDetails');
      if (!connectionDetails) {
        throw new Error('Connection details not found');
      }
      const { connectionUri, databaseName } =
        await createTestDatabase(connectionDetails);
      const ctx = new PostgresDatabaseContext(connectionUri);
      if (runMigrations) {
        await migrateDatabase(ctx);
      }
      context.db = {
        engine: 'postgres',
        connectionDetails,
        ctx,
        databaseName,
      };
    });

    afterEach<PostgresDbTestContext>(async ({ db }) => {
      await db.ctx.destroy();
      const { connectionDetails, databaseName } = db;

      deleteTestDatabase(connectionDetails, databaseName);
    });

    fn(test);
  });

  describe(`SQLite - ${name}`, test => {
    beforeEach<DbTestContext>(async context => {
      const ctx = new InMemoryDatabaseContext();
      if (runMigrations) {
        await migrateDatabase(ctx);
      }
      context.db = {
        engine: 'sqlite',
        ctx,
      };
    });

    afterEach<DbTestContext>(async ({ db }) => {
      db.ctx.destroy();
    });

    fn(test);
  });
};
