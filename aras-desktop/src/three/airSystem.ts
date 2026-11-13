import * as THREE from 'three';

/** Independent aeration circuit. This pump supplies air, never circulation water. */
export function createAirSystem(tank: THREE.Group, rack: THREE.Group, beds: { bed: THREE.Group }[]) {
  const group = new THREE.Group();
  group.name = 'Air pump and independent aeration hoses';
  tank.updateWorldMatrix(true, true);
  rack.updateWorldMatrix(true, true);
  const world = (object: THREE.Object3D, x: number, y: number, z: number) =>
    object.localToWorld(new THREE.Vector3(x, y, z));
  const graphite = new THREE.MeshStandardMaterial({ color: '#34434e', roughness: 0.55 });
  const silver = new THREE.MeshStandardMaterial({ color: '#8fa5b0', roughness: 0.4 });
  const hoseMaterial = new THREE.MeshStandardMaterial({ color: '#dc9a40', roughness: 0.65 });
  const diffuserMaterial = new THREE.MeshStandardMaterial({ color: '#617078', roughness: 1 });
  const bubbleMaterial = new THREE.MeshBasicMaterial({ color: '#e5fbff', transparent: true, opacity: 0.75, depthWrite: false });
  const bubbleGeometry = new THREE.SphereGeometry(0.035, 8, 6);
  function mesh(parent: THREE.Object3D, name: string, geometry: THREE.BufferGeometry, material: THREE.Material,
    position: THREE.Vector3) {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.copy(position);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  }
  const pump = new THREE.Group();
  pump.name = 'Air pump underneath the beds';
  pump.position.copy(world(rack, 0, 0, 0));
  group.add(pump);
  mesh(pump, 'Rubber base', new THREE.BoxGeometry(1.1, 0.12, 0.75), graphite, new THREE.Vector3(0, 0.1, 0));
  const body = mesh(pump, 'Rounded pump housing', new THREE.SphereGeometry(1, 24, 16), silver, new THREE.Vector3(0, 0.38, 0));
  body.scale.set(0.62, 0.35, 0.43);
  mesh(pump, 'Top cover', new THREE.BoxGeometry(0.65, 0.07, 0.42), graphite, new THREE.Vector3(0, 0.68, 0));
  for (let i = 0; i < 5; i++) {
    mesh(pump, 'Vent', new THREE.BoxGeometry(0.025, 0.13, 0.025), graphite, new THREE.Vector3(-0.2 + i * 0.1, 0.4, 0.4));
  }
  const indicator = new THREE.MeshStandardMaterial({ color: '#89df75', emissive: '#358524', emissiveIntensity: 0.4 });
  mesh(pump, 'Illustrative running indicator', new THREE.SphereGeometry(0.045, 12, 8), indicator, new THREE.Vector3(0.38, 0.47, 0.3));
  const outlets = [-0.36, -0.12, 0.12, 0.36].map(x => {
    const outlet = mesh(pump, 'Air outlet', new THREE.CylinderGeometry(0.045, 0.045, 0.16, 10), hoseMaterial,
      new THREE.Vector3(x, 0.32, -0.43));
    outlet.rotation.x = Math.PI / 2;
    return pump.position.clone().add(new THREE.Vector3(x, 0.32, -0.51));
  });
  function hose(name: string, points: THREE.Vector3[]) {
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < points.length; i++) path.add(new THREE.LineCurve3(points[i - 1]!, points[i]!));
    mesh(group, name, new THREE.TubeGeometry(path, points.length * 24, 0.033, 8, false), hoseMaterial, new THREE.Vector3());
    for (const point of points.slice(1, -1)) mesh(group, 'Air hose elbow', new THREE.SphereGeometry(0.036, 8, 6), hoseMaterial, point);
  }
  const emitters: { origin: THREE.Vector3; surface: number; bubbles: THREE.Mesh[] }[] = [];
  function diffuser(name: string, origin: THREE.Vector3, surface: number) {
    mesh(group, name, new THREE.CylinderGeometry(0.10, 0.10, 0.08, 12), diffuserMaterial, origin);
    const bubbles = Array.from({ length: surface - origin.y > 1 ? 20 : 8 }, () => {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      group.add(bubble);
      return bubble;
    });
    emitters.push({ origin: origin.clone().add(new THREE.Vector3(0, 0.045, 0)), surface, bubbles });
  }
  const tankStone = world(tank, -1.8, 0.43, 0.5);
  const tankRim = world(tank, -1.8, 3.6, 0.5);
  hose('Air only: pump → fish tank', [outlets[0]!, world(rack, 0, 0.2, -1.6),
    new THREE.Vector3(tank.position.x + 3.3, 0.2, tankStone.z),
    new THREE.Vector3(tank.position.x + 3.3, 3.6, tankStone.z), tankRim, tankStone]);
  diffuser('Fish tank air stone', tankStone, world(tank, 0, 3, 0).y);
  beds.forEach(({ bed }, i) => {
    const stone = world(bed, 1.5, 0.10, 0.35);
    const overRim = world(bed, 1.5, 0.48, 0.35);
    const riser = world(rack, 2.4 + i * 0.12, 0.25, 1.45 + i * 0.1);
    hose(`Air only: pump → bed ${i + 1}`, [outlets[i + 1]!, riser,
      new THREE.Vector3(riser.x, overRim.y, riser.z), overRim, stone]);
    diffuser(`Bed ${i + 1} air stone`, stone, world(bed, 0, 0.22, 0).y);
  });
  function update(time: number) {
    emitters.forEach(({ origin, surface, bubbles }, index) => {
      const height = surface - origin.y;
      bubbles.forEach((bubble, i) => {
        const phase = THREE.MathUtils.euclideanModulo(time * 0.5 / height + i / bubbles.length, 1);
        bubble.position.set(origin.x + Math.sin(i * 2.4 + time) * 0.055,
          origin.y + phase * height, origin.z + Math.cos(i * 2.4 + index) * 0.055);
        bubble.scale.setScalar(height < 1 ? 0.5 : 0.7 + phase * 0.5);
      });
    });
  }
  update(0);
  return { group, pump, update };
}
