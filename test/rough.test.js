import test from 'node:test';
import assert from 'node:assert/strict';
import { frameSource, lineSource, quantize, drawFrame } from '../src/rough.js';

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
