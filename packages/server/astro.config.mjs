import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

import { getGithubRepository } from './src/lib/github';

const githubRepository = await getGithubRepository(import.meta.env);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  trailingSlash: 'never',
  base: addTrailingSlash(import.meta.env.BASEURL || ''),
  adapter: node({
    mode: 'middleware',
  }),
  integrations: [
    react({
      include: ['src/components/react/**'],
    }),
  ],
  security: {
    checkOrigin: true,
  },
  server: {
    port: 4321,
  },
  vite: {
    define: {
      'import.meta.env.GITHUB': JSON.stringify(githubRepository),
    },
  },
});

function addTrailingSlash(path) {
  var lastChar = path.substr(-1);
  if (lastChar === '/') {
    return path;
  }
  return path + '/';
}
