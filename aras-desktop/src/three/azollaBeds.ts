import * as THREE from 'three';

/** Three independently addressable shallow beds; dimensions are visual proportions,
 * not surveyed hardware measurements. The space below the rack is for the air pump. */
export function createAzollaBeds() {
  const rack = new THREE.Group();
  rack.name = 'Azolla growing rack';
  const steel = new THREE.MeshStandardMaterial({ color: '#405560', roughness: 0.55 });
  const trayMaterial = new THREE.MeshStandardMaterial({ color: '#bacbd0', roughness: 0.4 });
  const waterMaterial = new THREE.MeshStandardMaterial({ color: '#479eaa', roughness: 0.25 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 });
  const leafGeometry = new THREE.SphereGeometry(1, 8, 6);
  const width = 4.2;
  const depth = 2.25;
  function box(parent: THREE.Object3D, name: string, size: [number, number, number],
    position: [number, number, number], material: THREE.Material) {
    const object = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    object.name = name;
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  for (const x of [-2.22, 2.22]) {
    for (const z of [-1.24, 1.24]) {
      box(rack, 'Rack upright', [0.13, 7.35, 0.13], [x, 3.725, z], steel);
      box(rack, 'Foot plate', [0.35, 0.1, 0.35], [x, 0.05, z], steel);
    }
  }
  const beds = [3.8, 5.3, 6.8].map((height, index) => {
    const bed = new THREE.Group();
    bed.name = `Azolla bed ${index + 1} (bottom to top)`;
    bed.position.y = height;
    rack.add(bed);
    box(bed, 'Tray floor', [width, 0.09, depth], [0, 0, 0], trayMaterial);
    for (const z of [-depth / 2, depth / 2]) {
      box(bed, 'Long tray wall', [width + 0.12, 0.32, 0.08], [0, 0.16, z], trayMaterial);
      box(bed, 'Rolled rim', [width + 0.18, 0.055, 0.13], [0, 0.34, z], trayMaterial);
      box(bed, 'Shelf rail', [4.55, 0.14, 0.12], [0, -0.12, z], steel);
    }
    for (const x of [-width / 2, width / 2]) {
      box(bed, 'Short tray wall', [0.08, 0.32, depth], [x, 0.16, 0], trayMaterial);
      box(bed, 'Rolled end rim', [0.13, 0.055, depth + 0.18], [x, 0.34, 0], trayMaterial);
      box(bed, 'Shelf support', [0.12, 0.14, 2.55], [x, -0.12, 0], steel);
    }
    const water = box(bed, 'Shallow water', [width - 0.1, 0.015, depth - 0.1], [0, 0.22, 0], waterMaterial);
    water.castShadow = false;
    // Instanced rosettes keep a dense floating plant mat inexpensive to render.
    const plants = new THREE.InstancedMesh(leafGeometry, leafMaterial, 12 * 6 * 5);
    plants.name = 'Floating Azolla mat';
    plants.castShadow = true;
    plants.receiveShadow = true;
    const dummy = new THREE.Object3D();
    const colors = ['#68a82f', '#8ac441', '#4e942f', '#a1ca46'];
    let instance = 0;
    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 12; column++) {
        const seed = column * 17 + row * 31 + index * 13;
        const x = -1.83 + column * 0.33 + Math.sin(seed) * 0.045;
        const z = -0.86 + row * 0.34 + Math.cos(seed) * 0.04;
        for (let leaf = 0; leaf < 5; leaf++) {
          const angle = leaf * Math.PI * 2 / 5 + seed;
          dummy.position.set(x + Math.cos(angle) * 0.075, 0.265 + (leaf % 2) * 0.012, z + Math.sin(angle) * 0.075);
          dummy.rotation.set(0, -angle, 0);
          dummy.scale.set(0.13, 0.035, 0.075);
          dummy.updateMatrix();
          plants.setMatrixAt(instance, dummy.matrix);
          plants.setColorAt(instance++, new THREE.Color(colors[(seed + leaf) % colors.length]));
        }
      }
    }
    bed.add(plants);
    // Named attachment points only; water pipes and separate air hoses come later.
    const ports = new THREE.Group();
    ports.name = 'Future connections';
    bed.add(ports);
    for (const [name, x, z] of [
      ['Water inlet', width / 2, -0.65],
      ['Water outlet', -width / 2, 0.65],
      ['Air supply', 0, -depth / 2],
    ] as const) {
      const port = new THREE.Object3D();
      port.name = name;
      port.position.set(x, 0.2, z);
      ports.add(port);
    }
    return { bed, plants, water, ports };
  });
  return { rack, beds };
}
