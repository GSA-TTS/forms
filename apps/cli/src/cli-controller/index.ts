import { Command } from 'commander';

import type { Context } from './types.js';
import { addSecretCommands } from './secrets.js';
import { addE2eCommands } from './e2e.js';

export const CliController = (ctx: Context) => {
  const cli = new Command().description(
    'CLI to interact with the Forms workspace'
  );

  cli
    .command('hello')
    .description('say hello')
    .action(() => {
      ctx.console.log('Hello!');
    });

  addSecretCommands(ctx, cli);
  addE2eCommands(ctx, cli);

  return cli;
};
