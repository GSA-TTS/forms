# @gsa-tts/forms-database

This package maintains the supporting infrastructure for the Forms Platform
database.

PostgreSQL is the supported production database. Sqlite3 is also supported,
to facilitate fast in-memory integration testing.

## Database migrations

To create a new database migration in [./migrations](./migrations):

```bash
pnpm knex migrate:make migration-name
```

Application of database migrations are orchestrated by the application via
[./src/management/migrate-database.ts](./src/management/migrate-database.ts).

## Testing

Packages that leverage `@gsa-tts/forms-database` may use provided helpers for testing
purposes.

### Testing database gateway routines

`describeDatabase` is a Vitest suite factory that will run a test spec against
a clean database on both Sqlite3 and PostgreSQL:

```typescript
import { expect, it } from 'vitest';

import { type DbTestContext, describeDatabase } from '@gsa-tts/forms-database/testing';

describeDatabase('database connection', () => {
  it<DbTestContext>('selects all via kysely', async ({ db }) => {
    const kysely2 = await db.ctx.getKysely();
    const users2 = await kysely2.selectFrom('users').selectAll().execute();
    expect(users2).toBeDefined();
  });
  it<DbTestContext>('selects all via knex', async ({ db }) => {
    const knex = await db.ctx.getKnex();
    const users = await knex.select().from('users');
    expect(users).toBeDefined();
  });
```

### Integration testing

For business logic tests that integrate with a clean database, you may leverage
the `createInMemoryDatabaseContext` factory. This will provide an ephemeral
in-memory Sqlite3 database.

```typescript
import { createInMemoryDatabaseContext } from '@gsa-tts/forms-database/context';

describe('business logic tested with in-memory database', () => {
  it('context helper has a connection to a sqlite database', async () => {
    const db = await createInMemoryDatabaseContext();
    expect(db.engine).toEqual('sqlite');
  });
});
```
