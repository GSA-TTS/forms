import esbuild from 'esbuild';

esbuild
  .build({
    bundle: true,
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    minify: true,
    outdir: './dist',
    platform: 'node',
    sourcemap: true,
    target: 'esnext',
  })
  .catch(() => process.exit(1));
