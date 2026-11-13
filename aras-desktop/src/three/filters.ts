import * as THREE from 'three';

/** Exterior-only placeholders. Filter media and internal flow are intentionally omitted. */
export function createFilters() {
  const array = new THREE.Group();
  array.name = 'Four-stage filter array';
  const shell = new THREE.MeshStandardMaterial({ color: '#566574', roughness: 0.55 });
  const trim = new THREE.MeshStandardMaterial({ color: '#8798a6', roughness: 0.4 });
  const baseMaterial = new THREE.MeshStandardMaterial({ color: '#b2bec3', roughness: 0.8 });
  function add(parent: THREE.Object3D, name: string, geometry: THREE.BufferGeometry,
    material: THREE.Material, position: [number, number, number]) {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.set(...position);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  }
  add(array, 'Filter platform', new THREE.BoxGeometry(5.7, 0.2, 1.7), baseMaterial, [0, 0.35, 0]);
  for (const x of [-2.35, 2.35]) {
    add(array, 'Platform foot', new THREE.BoxGeometry(0.25, 0.3, 1.4), baseMaterial, [x, 0.15, 0]);
  }
  const housings = Array.from({ length: 4 }, (_, index) => {
    const housing = new THREE.Group();
    housing.name = `Filter housing ${index + 1}`;
    housing.position.x = (index - 1.5) * 1.36;
    array.add(housing);
    add(housing, 'Opaque cylindrical shell', new THREE.CylinderGeometry(0.57, 0.54, 2.8, 40), shell, [0, 1.86, 0]);
    for (const y of [0.55, 3.16]) {
      add(housing, 'Reinforcing collar', new THREE.CylinderGeometry(0.6, 0.6, 0.12, 40), trim, [0, y, 0]);
    }
    add(housing, 'Closed lid', new THREE.CylinderGeometry(0.59, 0.59, 0.13, 40), shell, [0, 3.3, 0]);
    add(housing, 'Lid grip', new THREE.BoxGeometry(0.36, 0.1, 0.13), trim, [0, 3.41, 0]);
    // Connection points are reserved for the later piping pass, not connected yet.
    for (const [name, x] of [['Water inlet', -0.59], ['Water outlet', 0.59]] as const) {
      const port = new THREE.Object3D();
      port.name = name;
      port.position.set(x, 2.7, 0);
      housing.add(port);
    }
    return housing;
  });
  return { array, housings };
}
