import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/index.js'], outfile: 'dist/index.js', bundle: true, format: 'esm', jsx: 'automatic',
  loader: { '.js': 'jsx' }, external: ['react', 'react/jsx-runtime', '@matita/icons/engine'],
});
copyFileSync('src/ui.css', 'dist/ui.css');

if (process.argv.includes('--demo')) {
  await build({
    entryPoints: ['demo/main.jsx'], outfile: 'demo/bundle.js', bundle: true, format: 'iife', jsx: 'automatic',
    alias: { '@matita/ui': './src/index.js' },
  });
  copyFileSync('src/ui.css', 'demo/ui.css');
}
console.log('built');
