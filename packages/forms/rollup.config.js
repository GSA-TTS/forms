import { watch } from 'rollup';
import { builtinModules } from 'module';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

import packageJson from './package.json' assert { type: 'json' };
import workspacePackageJson from '../../package.json' assert { type: 'json' };

export default {
  //input: ['src/index.ts', 'src/context/index.ts', 'src/testing.ts'],
  input: {
    index: 'src/index.ts',
    context: 'src/context/index.ts',
  },
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
  ],
  external: (() => {
    // Externalize all the things
    return [
      ...new Set([
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
        ...Object.keys(workspacePackageJson.dependencies || {}),
        ...Object.keys(workspacePackageJson.devDependencies || {}),
        ...builtinModules,
      ]),
    ];
  })(),
  watch: {
    include: 'src/**/*.ts',
    clearScreen: false,
  },
};
