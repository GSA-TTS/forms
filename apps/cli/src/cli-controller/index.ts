import { Command } from 'commander';

import type { Context } from './types.js';
import { addSecretCommands } from './secrets.js';

export const CliController = (ctx: Context) => {
  const cli = new Command().description(
    'CLI to interact with the ATJ workspace'
  );

  cli
    .command('hello')
    .description('say hello')
    .action(() => {
      ctx.console.log('Hello!');
    });

  addSecretCommands(ctx, cli);

  return cli;
};
