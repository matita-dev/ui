import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

/* ui.css = the Drafting Grid Design System tokens in the design system's own order, then the few rules the library adds
   (src/extra.css). Fonts and textures sit next to it. */
const CSS = ['fonts', 'colors', 'typography', 'spacing', 'effects', 'pencil', 'blueprint', 'base'].map(n => `src/tokens/${n}.css`).concat('src/extra.css');
const css = CSS.map(f => readFileSync(f, 'utf8')).join('\n');

function assets(dir) {
  mkdirSync(`${dir}/fonts`, { recursive: true }); mkdirSync(`${dir}/textures`, { recursive: true });
  for (const f of readdirSync('src/fonts')) copyFileSync(`src/fonts/${f}`, `${dir}/fonts/${f}`);
  for (const f of readdirSync('src/textures')) copyFileSync(`src/textures/${f}`, `${dir}/textures/${f}`);
  writeFileSync(`${dir}/ui.css`, css);
}

mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/index.js'], outfile: 'dist/index.js', bundle: true, format: 'esm', jsx: 'automatic',
  loader: { '.js': 'jsx' }, external: ['react', 'react/jsx-runtime', '@matita/icons/engine'],
});
assets('dist');
copyFileSync('src/index.d.ts', 'dist/index.d.ts');

if (process.argv.includes('--demo')) {
  await build({
    entryPoints: { bundle: 'demo/main.jsx', usage: 'demo/usage.jsx' }, outdir: 'demo', bundle: true, format: 'iife', jsx: 'automatic',
    alias: { '@matita/ui': './src/index.js' },
  });
  assets('demo');
}
console.log('built');
