import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

execFileSync('node', ['scripts/build.mjs'], { stdio: 'ignore' });
const css = readFileSync('dist/ui.css', 'utf8');

test('ui.css carries the design system tokens for all three modes', () => {
  assert.match(css, /\[data-mode="pencil"\]\{/);
  assert.match(css, /\[data-mode="blueprint"\]\{/);
  assert.match(css, /--paper-1:#F6F4EE/);
  assert.match(css, /:root,\[data-mode="ink"\]\{/);
});

test('every font and texture the css points at ships next to it', () => {
  const urls = [...css.matchAll(/url\('\.\/((?:fonts|textures)\/[^']+)'\)/g)].map(m => m[1]);
  assert.ok(urls.length > 10);
  for (const u of urls) assert.ok(existsSync('dist/' + u), u);
  assert.ok(!css.includes('../assets/'));
});

test('the build ships the font licenses', () => {
  for (const f of ['geist-sans', 'geist-mono', 'instrument-serif', 'architects-daughter']) assert.ok(existsSync(`dist/fonts/LICENSE-${f}.txt`), f);
});

test('the library css is scoped to .m-root, not the host page', () => {
  assert.ok(!/(^|\n)body\{/.test(css));
  assert.ok(!/(^|\n)\*,\*::before/.test(css));
});
