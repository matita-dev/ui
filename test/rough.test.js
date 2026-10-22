import test from 'node:test';
import assert from 'node:assert/strict';
import { frameSource, lineSource, vlineSource, marksSource, drawLines, quantize, drawFrame } from '../src/rough.js';

const box = { w: 120, h: 40, key: 'a' };

test('frameSource: radius 0 is one rect primitive', () => {
  assert.equal(frameSource(120, 40, 0), 'R 0 0 120 40');
});

test('frameSource: radius is clamped to half the shortest side', () => {
  assert.equal(frameSource(120, 40, 999), frameSource(120, 40, 20));
  assert.equal(frameSource(120, 40, 20).split(';').length, 8);
});

test('lineSource: a ruled line across the width', () => {
  assert.equal(lineSource(80), 'L 0 0 80 0');
});

test('quantize: snaps to the step and never goes below it', () => {
  assert.equal(quantize(122), 120);
  assert.equal(quantize(125), 128);
  assert.equal(quantize(1), 8);
  assert.equal(quantize(21, 4), 20);
});

test('drawFrame: same key and seed draw the same, a new seed redraws', () => {
  assert.deepEqual(drawFrame({ ...box, seed: 0 }), drawFrame({ ...box, seed: 0 }));
  assert.notDeepEqual(drawFrame({ ...box, seed: 0 }), drawFrame({ ...box, seed: 1 }));
  assert.notDeepEqual(drawFrame({ ...box, key: 'b' }), drawFrame(box));
});

test('drawFrame: rough 0 is the exact shape, seed independent', () => {
  const a = drawFrame({ ...box, rough: 0, seed: 0 }), b = drawFrame({ ...box, rough: 0, seed: 5 });
  assert.deepEqual(a, b);
  assert.equal(a[0].d, 'M0 0L120 0L120 40L0 40Z');
});

test('drawFrame: shapes give strokes', () => {
  assert.equal(drawFrame({ ...box, shape: 'rect' }).length, 1);
  assert.equal(drawFrame({ ...box, shape: 'pill' }).length, 8);
  assert.equal(drawFrame({ ...box, shape: 'pill', rough: 0 }).length, 1);
  assert.equal(drawFrame({ ...box, shape: 'line' }).length, 1);
  assert.equal(drawFrame({ ...box, shape: 'ellipse' }).length, 1);
  assert.equal(drawFrame({ ...box, shape: 'ellipse', rough: 0 })[0].d, 'M0 20A60 20 0 1 0 120 20A60 20 0 1 0 0 20Z');
});

test('vlineSource and the vline shape: a single vertical ruled line', () => {
  assert.equal(vlineSource(80), 'L 0 0 0 80');
  assert.equal(drawFrame({ ...box, shape: 'vline', rough: 0 })[0].d, 'M0 0L0 40');
  assert.equal(drawFrame({ ...box, shape: 'vline' }).length, 1);
});

test('drawLines: exact mode keeps L and P primitives as true geometry', () => {
  const exact = drawLines('L 0 10 20 10; P 0 0 7 3.5 0 7', 'k', 0, 0);
  assert.deepEqual(exact.map(s => s.d), ['M0 10L20 10', 'M0 0L7 3.5L0 7']);
  assert.deepEqual(drawLines('L 0 10 20 10', 'k', 0, 0), drawLines('L 0 10 20 10', 'k', 9, 0));
});

test('drawLines: the hand is deterministic per key and seed and differs from the ruler', () => {
  const src = 'L 0 10 20 10; L 10 0 10 20';
  assert.deepEqual(drawLines(src, 'k', 1), drawLines(src, 'k', 1));
  assert.notDeepEqual(drawLines(src, 'k', 1), drawLines(src, 'k', 2));
  assert.equal(drawLines(src, 'k', 1).length, 2);
});

test('marks: exactly four lines, each running past both corners', () => {
  assert.equal(marksSource(100, 40, 8), 'L -8 0 108 0; L -8 40 108 40; L 0 -8 0 48; L 100 -8 100 48');
  assert.equal(drawFrame({ ...box, shape: 'marks' }).length, 4);
  assert.deepEqual(drawFrame({ ...box, shape: 'marks', rough: 0, reach: 6 }).map(s => s.d),
    ['M-6 0L126 0', 'M-6 40L126 40', 'M0 -6L0 46', 'M120 -6L120 46']);
});
