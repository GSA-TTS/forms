import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import purgecss from 'astro-purgecss';


import { getGithubRepository } from './src/lib/github';

const githubRepository = await getGithubRepository(process.env);

// https://astro.build/config
export default defineConfig({
  base: addTrailingSlash(process.env.BASEURL || ''),
  integrations: [
    react({
      include: ['src/components/react/**'],
    }),
    purgecss({
      fontFace: true,
      keyframes: true,
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          /abbr/,
          "kbd",
          "samp",
          "sub",
          "optgroup",
          "fieldset",
          "summary",
          "cite",
          "dfn",
          "pre",
        ],
        deep: [
          /usa-in-page.+/
        ]
      },
      dynamicAttributes: [
        'contentEditable',
        'aria-label',
        'title',
        'type'
      ],
      content: [
        process.cwd() + '/src/**/*.{astro,tsx,ts}' // Watching astro and vue sources (read SSR docs below)
      ],
      extractors: [
        {
          extractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          extensions: ['astro', 'html']
        }
      ]
    })
  ],
  security: {
    checkOrigin: true,
  },
  trailingSlash: 'always',
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
