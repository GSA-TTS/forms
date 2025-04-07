import { promises as fs } from 'fs';
import { Command } from 'commander';

import { type Context } from './types.js';
import { createAuthRepository, BaseAuthContext, createTestDbSession } from '@gsa-tts/forms-auth';

export const addE2eCommands = (ctx: Context, cli: Command) => {
  const cmd = cli
    .command('e2e')
    .description('End to end testing commands');

  cmd
    .command('create-test-session')
    .description('Prepare the database and auth context for testing')
    .requiredOption(
      '-p, --path <string>',
      'Path to the SQLite database file to prepare',
    )
    .requiredOption(
      '-o, --output <string>',
      'Path to output the .env file used for testing',
    )
    .action(async (options) => {
      const { createFilesystemDatabaseContext } = await import(
        '@gsa-tts/forms-database/context'
        );
      const dbPath = options.path;
      const outputFile = options.output;

      try {
        console.log('Preparing database at:', dbPath);
        const stubLoginProvider = {};
        const stubGetCookie = () => {};
        const stubSetCookie = () => {};
        const stubSetUserSession = () => {};
        const stubIsUserAuthorized = () => {
          return Promise.resolve(true);
        }

        // The login flow is to create fs db context -> feed into base auth context constructor -> feed it into the auth service
        const dbContext = await createFilesystemDatabaseContext(dbPath);
        const authRepository = createAuthRepository(dbContext);
        const authContext = new BaseAuthContext(
          authRepository,
          // Stub a login provider for testing (can be plugged in as needed)
          // @ts-expect-error - Object literal may only specify known properties, but this is a stub.
          stubLoginProvider,
          stubGetCookie,
          stubSetCookie,
          stubSetUserSession,
          stubIsUserAuthorized,
        );

        const testEmail = 'test@example.com';

        const user = await authRepository.createUser(testEmail);
        if (!user) {
          console.log(`Test user created with id: ${testEmail}`);
        }
        const userId = await authRepository.getUserId(testEmail);

        if (userId) {
          const session = await createTestDbSession(userId, authContext);

          if(session && session.id) {
            const envContent = `AUTH_SESSION=${session.id}\nE2E_ENDPOINT=http://localhost:4321\n`;
            await fs.writeFile(outputFile, envContent, 'utf8');
            console.log(`.env file written to: ${outputFile}`);
          }
        }
        console.log('Auth Context & Database Prepared Successfully!');
      } catch (error) {
        console.error('Error preparing the database:', (error as Error).message);
      } finally {
        process.exit();
      }
    });
};