import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/index.js'], outfile: 'dist/index.js', bundle: true, format: 'esm', jsx: 'automatic',
  loader: { '.js': 'jsx' }, external: ['react', 'react/jsx-runtime', '@matita/icons/engine'],
});
copyFileSync('src/ui.css', 'dist/ui.css');
mkdirSync('dist/fonts', { recursive: true });
mkdirSync('dist/textures', { recursive: true });
for (const f of readdirSync('src/fonts')) copyFileSync(`src/fonts/${f}`, `dist/fonts/${f}`);
for (const f of readdirSync('src/textures')) copyFileSync(`src/textures/${f}`, `dist/textures/${f}`);

if (process.argv.includes('--demo')) {
  await build({
    entryPoints: ['demo/main.jsx'], outfile: 'demo/bundle.js', bundle: true, format: 'iife', jsx: 'automatic',
    alias: { '@matita/ui': './src/index.js' },
  });
  copyFileSync('src/ui.css', 'demo/ui.css');
  mkdirSync('demo/fonts', { recursive: true });
  mkdirSync('demo/textures', { recursive: true });
  for (const f of readdirSync('src/fonts')) copyFileSync(`src/fonts/${f}`, `demo/fonts/${f}`);
  for (const f of readdirSync('src/textures')) copyFileSync(`src/textures/${f}`, `demo/textures/${f}`);
}
console.log('built');
