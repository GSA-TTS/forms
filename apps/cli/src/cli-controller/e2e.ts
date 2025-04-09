import { promises as fs } from 'fs';
import { Command } from 'commander';

import { type Context } from './types.js';
import { createTestDbSession, createE2eAuthContext } from '@gsa-tts/forms-auth';

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
      const dbPath = options.path;
      const outputFile = options.output;

      try {
        console.log('Preparing database at:', dbPath);
        const ctx = await createE2eAuthContext(dbPath);
        const session = await createTestDbSession(ctx, 'test@example.com');

        if(session && session.id) {
          const envContent = `AUTH_SESSION=${session.id}\nE2E_ENDPOINT=http://localhost:4321\n`;
          await fs.writeFile(outputFile, envContent, 'utf8');
          console.log(`.env file written to: ${outputFile}`);
        }
        console.log('Auth Context & Database Prepared Successfully!');
      } catch (error) {
        console.error('Error preparing the database:', (error as Error).message);
      } finally {
        process.exit();
      }
    });
};