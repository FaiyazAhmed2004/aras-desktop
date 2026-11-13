<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createFish, createTank } from '../three/tank';
import { createAzollaBeds } from '../three/azollaBeds';
import { createFilters } from '../three/filters';
import { createWaterPipes } from '../three/waterPipes';
import { createAirSystem } from '../three/airSystem';

const host = ref<HTMLDivElement>();
const gridVisible = ref(true);
const swimming = ref(true);
const error = ref('');
let dispose = () => {};
let reset = () => {};
let toggleGrid = () => {};
let focusBeds = () => {};
let focusFilters = () => {};

onMounted(() => {
  if (!host.value) return;
  const container = host.value;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    error.value = 'The 3D view could not start. Please check that hardware acceleration is available and reopen the app.';
    return;
  }
  let stage = 'initializing the renderer';
  const reportError = (cause: unknown) => {
    console.error(`ARAS scene failed while ${stage}`, cause);
    error.value = `The 3D scene stopped while ${stage}: ${cause instanceof Error ? cause.message : String(cause)}. Reload the view after correcting the error.`;
  };
  try {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D fish tank, stacked Azolla beds and four filter housings');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 32;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  reset = () => {
    // Bottom blue reference: tank left/front, beds receding diagonally,
    // filter row parallel to the beds on their far side.
    camera.position.set(-11, 13, 25);
    controls.target.set(0.2, 3.8, -0.5);
    controls.update();
  };
  focusBeds = () => {
    camera.position.set(-4.5, 10, 13);
    controls.target.set(1.5, 4, -0.7);
    controls.update();
  };
  focusFilters = () => {
    camera.position.set(10, 7, 9);
    controls.target.set(4.4, 1.9, -0.7);
    controls.update();
  };
  reset();
  scene.add(new THREE.HemisphereLight('#e7f7ff', '#778b65', 2.6));
  const sun = new THREE.DirectionalLight('#fff0d5', 3.2);
  sun.position.set(-4, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 });
  sun.shadow.bias = -0.001;
  scene.add(sun);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1, 96), new THREE.MeshStandardMaterial({ color: '#d5dfbc', roughness: 1 }));
  floor.scale.set(11, 8, 1);
  floor.position.z = 0;
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const { tank, grid } = createTank();
  const tankAssembly = new THREE.Group();
  tankAssembly.name = 'Fish tank assembly';
  tankAssembly.position.set(-3.7, 0, -0.7);
  tankAssembly.add(tank);
  scene.add(tankAssembly);
  const { rack, beds } = createAzollaBeds();
  // Keep the short ends forward and the long axis running into the scene.
  rack.rotation.y = Math.PI / 2;
  rack.position.set(1.5, 0, -0.7);
  scene.add(rack);
  const { array: filters, housings } = createFilters();
  filters.rotation.y = Math.PI / 2;
  filters.position.set(4.4, 0, -0.7);
  scene.add(filters);
  stage = 'building the water pipes';
  const waterPipes = createWaterPipes(tankAssembly, rack, beds, filters, housings);
  scene.add(waterPipes.group);
  stage = 'building the air supply';
  const airSystem = createAirSystem(tankAssembly, rack, beds);
  scene.add(airSystem.group);
  toggleGrid = () => { gridVisible.value = !gridVisible.value; grid.visible = gridVisible.value; };
  const fishes = ['#f48472', '#ed786c', '#ff9b83'].map((color, i) => {
    const model = createFish(color);
    model.fish.scale.setScalar(0.95 + i * 0.12);
    tankAssembly.add(model.fish);
    return model;
  });
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    // Keep the complete tank visible in narrow windows as well.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(19)) / Math.min(1, camera.aspect)));
    camera.updateProjectionMatrix();
  });
  resize.observe(container);
  let frame = 0;
  let last = performance.now();
  let elapsed = 0;
  function animate(now: number) {
    try {
    stage = 'animating the water flow';
    // The first RAF timestamp can precede performance.now() at registration.
    // Never rewind simulation time on startup or after a visibility change.
    const delta = THREE.MathUtils.clamp((now - last) / 1000, 0, 0.05);
    last = now;
    if (swimming.value) elapsed += delta;
    waterPipes.update(elapsed);
    airSystem.update(elapsed);
    fishes.forEach(({ fish, tail }, i) => {
      const angle = elapsed * (0.19 + i * 0.025) + i * Math.PI * 2 / 3;
      const radius = 1.65 - i * 0.2;
      fish.position.set(Math.cos(angle) * radius, 1.15 + i * 0.5 + Math.sin(elapsed * 0.7 + i) * 0.12, Math.sin(angle) * radius);
      fish.rotation.y = -angle - Math.PI / 2;
      tail.rotation.y = Math.sin(elapsed * 6 + i) * 0.35;
    });
    controls.update();
    stage = 'rendering the scene';
    renderer.render(scene, camera);
    frame = requestAnimationFrame(animate);
    } catch (cause) {
      reportError(cause);
    }
  }
  function visibility() {
    cancelAnimationFrame(frame);
    if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(animate); }
  }
  document.addEventListener('visibilitychange', visibility);
  frame = requestAnimationFrame(animate);
  dispose = () => {
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', visibility);
    resize.disconnect();
    controls.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m));
      }
    });
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
  } catch (cause) {
    reportError(cause);
    renderer.dispose();
    renderer.domElement.remove();
  }
});
onUnmounted(() => dispose());
</script>

<template>
  <section class="tank-view" aria-label="Aquaponics model preview">
    <div ref="host" class="viewport" />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <div v-else class="toolbar">
      <div class="caption"><strong>ARAS system</strong><span>Drag to orbit · Scroll to zoom</span></div>
      <div class="actions">
        <button @click="focusBeds()">View beds</button>
        <button @click="focusFilters()">View filters</button>
        <button :aria-pressed="gridVisible" @click="toggleGrid()">{{ gridVisible ? 'Hide grid' : 'Show grid' }}</button>
        <button :aria-pressed="!swimming" @click="swimming = !swimming">{{ swimming ? 'Pause' : 'Resume' }}</button>
        <button @click="reset()">Reset view</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tank-view { width: 100%; height: 100%; position: relative; background: radial-gradient(ellipse at 50% 42%, #f3faf4, #dcecf0 60%, #c3dee8); }
.viewport { width: 100%; height: 100%; touch-action: none; }
.viewport :deep(canvas) { display: block; }
.toolbar { position: absolute; bottom: 24px; left: 28px; right: 28px; display: flex; align-items: end; justify-content: space-between; gap: 16px; pointer-events: none; }
.caption { display: grid; gap: 4px; color: #294b50; }
.caption strong { font-size: 1.2rem; }
.caption span { font-size: 0.8rem; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; pointer-events: auto; }
button { border: 1px solid #97b5bb; background: #f5fbf2e8; border-radius: 10px; padding: 9px 14px; color: #294b50; cursor: pointer; }
button:hover { background: white; }
button:focus-visible { outline: 3px solid #267e95; outline-offset: 3px; }
.error { position: absolute; inset: 30%; color: #6e3434; }
@media (max-width: 600px) { .toolbar { left: 16px; right: 16px; bottom: 16px; flex-direction: column; align-items: start; } button { padding: 8px 12px; } }
</style>
