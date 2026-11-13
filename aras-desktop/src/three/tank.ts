import * as THREE from 'three';

const material = (color: string, roughness = 0.6) => new THREE.MeshStandardMaterial({ color, roughness });

function mesh(geometry: THREE.BufferGeometry, surface: THREE.Material, parent: THREE.Object3D,
  position: [number, number, number] = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, surface);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

export function createTank() {
  const tank = new THREE.Group();
  tank.name = 'Circular fish tank';
  const metal = material('#afc5cc', 0.35);
  const dark = material('#365663');
  const sand = material('#c8bc8c');
  const radius = 3;
  mesh(new THREE.CylinderGeometry(radius, radius, 0.18, 96), dark, tank, [0, 0.12, 0]);
  mesh(new THREE.CylinderGeometry(2.89, 2.89, 0.12, 96), sand, tank, [0, 0.26, 0]);
  for (const height of [0.3, 3.4]) {
    const rim = mesh(new THREE.TorusGeometry(radius, 0.105, 12, 96), metal, tank, [0, height, 0]);
    rim.rotation.x = Math.PI / 2;
  }
  const glass = mesh(new THREE.CylinderGeometry(radius, radius, 3.05, 96, 1, true),
    new THREE.MeshPhysicalMaterial({ color: '#a5e8ee', transparent: true, opacity: 0.12,
      roughness: 0.12, metalness: 0.05, side: THREE.DoubleSide, depthWrite: false }), tank, [0, 1.85, 0]);
  glass.name = 'Transparent tank wall';
  glass.castShadow = false;
  glass.renderOrder = 4;
  const water = new THREE.Group();
  water.name = 'Water';
  tank.add(water);
  const waterSide = mesh(new THREE.CylinderGeometry(2.96, 2.96, 2.65, 96, 1, true),
    new THREE.MeshBasicMaterial({ color: '#24b8d5', transparent: true, opacity: 0.09,
      side: THREE.DoubleSide, depthWrite: false }), water, [0, 1.67, 0]);
  waterSide.renderOrder = 2;
  const surface = mesh(new THREE.CircleGeometry(2.96, 96),
    new THREE.MeshStandardMaterial({ color: '#5bd7e6', transparent: true, opacity: 0.2,
      roughness: 0.2, side: THREE.DoubleSide, depthWrite: false }), water, [0, 3, 0]);
  surface.rotation.x = -Math.PI / 2;
  surface.castShadow = false;
  surface.renderOrder = 3;

  const grid = new THREE.Group();
  grid.name = 'Removable protective grid';
  tank.add(grid);
  for (let offset = -2.5; offset <= 2.5; offset += 0.5) {
    const length = 2 * Math.sqrt(radius * radius - offset * offset);
    mesh(new THREE.CylinderGeometry(0.022, 0.022, length, 6), dark, grid, [offset, 3.42, 0]).rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(0.022, 0.022, length, 6), dark, grid, [0, 3.43, offset]).rotation.z = Math.PI / 2;
  }
  const stone = material('#889c8a');
  for (let i = 0; i < 12; i++) {
    const angle = i * 2.399;
    const rock = mesh(new THREE.IcosahedronGeometry(0.2 + (i % 3) * 0.06, 1), stone, tank,
      [Math.cos(angle) * 2.35, 0.4, Math.sin(angle) * 2.35]);
    rock.scale.set(1.2, 0.6, 0.9);
  }
  const leaves = material('#488d65');
  for (let i = 0; i < 7; i++) {
    const angle = i * 0.7;
    for (let j = 0; j < 3; j++) {
      const leaf = mesh(new THREE.SphereGeometry(1, 10, 8), leaves, tank,
        [Math.cos(angle) * 2.5, 0.65 + j * 0.08, Math.sin(angle) * 2.5]);
      leaf.scale.set(0.09, 0.4 + j * 0.1, 0.14);
      leaf.rotation.z = (j - 1) * 0.45;
    }
  }
  return { tank, grid, surface };
}

export function createFish(color: string) {
  const fish = new THREE.Group();
  fish.name = 'Red tilapia';
  const skin = material(color, 0.5);
  const finMaterial = new THREE.MeshStandardMaterial({ color: '#d65353', roughness: 0.65, side: THREE.DoubleSide });
  const body = mesh(new THREE.SphereGeometry(1, 24, 16), skin, fish);
  body.scale.set(0.58, 0.29, 0.2);
  function fin(points: [number, number][], parent: THREE.Object3D) {
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y));
    shape.closePath();
    return mesh(new THREE.ShapeGeometry(shape), finMaterial, parent);
  }
  const tail = new THREE.Group();
  tail.position.x = -0.48;
  fish.add(tail);
  fin([[0, 0], [-0.36, 0.29], [-0.31, 0], [-0.36, -0.29]], tail);
  fin([[-0.38, 0.16], [-0.28, 0.4], [-0.17, 0.35], [-0.08, 0.42], [0.04, 0.36], [0.25, 0.23]], fish);
  fin([[-0.28, -0.18], [-0.14, -0.39], [0.11, -0.25]], fish);
  for (const side of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.083, 16, 12), material('#fff5df'), fish, [0.36, 0.09, side * 0.16]);
    eye.scale.z = 0.4;
    mesh(new THREE.SphereGeometry(0.044, 12, 10), material('#192d35'), fish, [0.38, 0.09, side * 0.19]);
    const pectoral = fin([[0.1, 0], [-0.17, -0.22], [-0.21, 0.02]], fish);
    pectoral.position.z = side * 0.19;
    pectoral.rotation.x = side * 0.65;
  }
  const mouth = mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 12), finMaterial, fish, [0.57, -0.03, 0]);
  mouth.rotation.y = Math.PI / 2;
  return { fish, tail };
}
