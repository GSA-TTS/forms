/**
 * This is the entrypoint for the server. It provides a `createServer` factory
 * that returns an Express handler, which in turn wraps the Astro web server.
 * This en
 */
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';

import { type ServerOptions } from './src/config/options.js';

export const createServer = async (
  serverOptions: ServerOptions
): Promise<express.Express> => {
  const app = express();
  const handler = await getHandler();
  app.use((req, res, next) => {
    // Pass ServerOptions as request locals.
    handler(req, res, next, {
      ctx: null,
      serverOptions,
      session: null,
      user: null,
    });
  });
  app.use(express.static(path.join(getDirname(), './client')));

  return app;
};

const getDirname = () => {
  const filePath = fileURLToPath(import.meta.url);
  return dirname(filePath);
};

const getHandler = async () => {
  // @ts-ignore
  const { handler } = await import('./server/entry.mjs');
  return handler;
};
