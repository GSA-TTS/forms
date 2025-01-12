import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import pg from 'pg';

export type ConnectionDetails = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

declare global {
  var postgresTestContainer: Promise<StartedPostgreSqlContainer>;
}

/**
 * Setup PostgreSQL test container. Intended to be exported from a Vitest
 * globalSetup module.
 * @param param0.provide Vitest provide function
 * @returns cleanup function
 */
export const setupPostgresContainer = async ({
  provide,
}: {
  provide: (name: string, value: any) => void;
}) => {
  // Guard against running multiple PostgreSQL containers using a node.js global
  if (global.postgresTestContainer === undefined) {
    process.stdout.write('Starting PostgreSQL test container...');
    global.postgresTestContainer = new PostgreSqlContainer().start();
    const container = await global.postgresTestContainer;
  } else {
    process.stdout.write(
      'Using already initialized PostgreSQL test container...'
    );
  }

  const container = await global.postgresTestContainer;
  process.stdout.write('... Done!\n');

  const connectionDetails: ConnectionDetails = {
    host: container.getHost(),
    port: container.getMappedPort(5432),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  };

  provide('postgresConnectionDetails', connectionDetails);

  return async () => {
    process.stdout.write('Stopping PostgreSQL test container...');
    await container.stop();
    process.stdout.write('... Done!\n');
  };
};

export const getConnectionString = (connectionDetails: ConnectionDetails) => {
  return `postgresql://${connectionDetails.username}:${connectionDetails.password}@${connectionDetails.host}:${connectionDetails.port}/${connectionDetails.database}`;
};

export const createTestDatabase = async (
  connectionDetails: ConnectionDetails
) => {
  const databaseName = `testdb_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const connectionString = getConnectionString(connectionDetails);

  const client = new pg.Client({
    connectionString,
  });
  await client.connect();
  await client.query(`CREATE DATABASE ${databaseName};`);
  await client.end();

  return {
    connectionUri: getConnectionString({
      ...connectionDetails,
      database: databaseName,
    }),
    databaseName,
  };
};

export const deleteTestDatabase = async (
  connectionDetails: ConnectionDetails,
  databaseName: string
) => {
  const client = new pg.Client({
    connectionString: getConnectionString(connectionDetails),
  });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${databaseName};`);
  await client.end();
};
