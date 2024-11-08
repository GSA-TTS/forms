import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import reactRenderer from '@astrojs/react/server.js';

export const createAstroContainer = async () => {
  const container = await AstroContainer.create();
  container.addServerRenderer({
    name: '@astrojs/react',
    renderer: reactRenderer,
  });
  container.addClientRenderer({
    name: '@astrojs/react',
    entrypoint: '@astrojs/react/client.js',
  });
  return container;
};
