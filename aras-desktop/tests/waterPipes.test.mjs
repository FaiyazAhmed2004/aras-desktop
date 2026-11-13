import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createAzollaBeds } from '../src/three/azollaBeds.ts';
import { createFilters } from '../src/three/filters.ts';
import { createWaterPipes } from '../src/three/waterPipes.ts';

test('water animation survives a negative first-frame timestamp and subsequent frames', () => {
  const tank = new THREE.Group();
  tank.position.set(-3.7, 0, -0.7);
  const { rack, beds } = createAzollaBeds();
  rack.rotation.y = Math.PI / 2;
  rack.position.set(1.5, 0, -0.7);
  const { array, housings } = createFilters();
  array.rotation.y = Math.PI / 2;
  array.position.set(4.4, 0, -0.7);
  const pipes = createWaterPipes(tank, rack, beds, array, housings);
  const times = [-0.016, -0.001, -Number.EPSILON, 0, 0.001];
  for (let frame = 1; frame <= 600; frame++) times.push(frame / 60);
  for (const time of times) {
    assert.doesNotThrow(() => pipes.update(time), `animation time ${time}`);
    pipes.group.traverse(object => {
      assert.ok(object.position.toArray().every(Number.isFinite), `${object.name}: position`);
      assert.ok(object.quaternion.toArray().every(Number.isFinite), `${object.name}: rotation`);
    });
  }
});
