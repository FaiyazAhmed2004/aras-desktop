import * as THREE from 'three';

type Point = [number, number, number];

/** Visual circulation routes. Supply pressure/lift is not a hydraulic simulation.
 * Only the bed-to-tank returns are modeled as continuously descending gravity drains. */
export function createWaterPipes(tank: THREE.Group, rack: THREE.Group,
  beds: { bed: THREE.Group }[], filters: THREE.Group, housings: THREE.Group[]) {
  const group = new THREE.Group();
  group.name = 'Water circulation — separate from air supply';
  const waste = new THREE.MeshStandardMaterial({ color: '#367e9a', roughness: 0.4 });
  const filtered = new THREE.MeshStandardMaterial({ color: '#249dc2', roughness: 0.35 });
  const clean = new THREE.MeshStandardMaterial({ color: '#59c4d4', roughness: 0.35 });
  const streamMaterial = new THREE.MeshBasicMaterial({ color: '#b4f4ff', transparent: true, opacity: 0.65, depthWrite: false });
  const markerMaterial = new THREE.MeshBasicMaterial({ color: '#ecffff' });
  const flows: { curve: THREE.CurvePath<THREE.Vector3>; markers: THREE.Mesh[] }[] = [];
  const ripples: THREE.Mesh[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  tank.updateWorldMatrix(true, true);
  rack.updateWorldMatrix(true, true);
  filters.updateWorldMatrix(true, true);
  const world = (object: THREE.Object3D, p: Point) => object.localToWorld(new THREE.Vector3(...p));
  function route(name: string, points: THREE.Vector3[], material: THREE.Material, radius = 0.085) {
    const curve = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < points.length; i++) curve.add(new THREE.LineCurve3(points[i - 1]!, points[i]!));
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(48, points.length * 20), radius, 10, false), material);
    pipe.name = name;
    pipe.castShadow = material !== streamMaterial;
    group.add(pipe);
    // Rounded elbow covers at each bend; terminal ends remain open.
    if (material !== streamMaterial) points.slice(1, -1).forEach(point => {
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.07, 10, 8), material);
      elbow.position.copy(point);
      group.add(elbow);
    });
    const markers = Array.from({ length: Math.max(1, Math.floor(curve.getLength() / 1.5)) }, () => {
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(radius * 1.6, radius * 4, 8), markerMaterial);
      group.add(arrow);
      return arrow;
    });
    flows.push({ curve, markers });
  }
  function drop(name: string, outlet: THREE.Vector3, surfaceY: number, material: THREE.Material) {
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.025, 8, 16), material);
    lip.rotation.x = Math.PI / 2;
    lip.position.copy(outlet);
    group.add(lip);
    const landing = new THREE.Vector3(outlet.x, surfaceY + 0.025, outlet.z);
    route(name, [outlet, landing], streamMaterial, 0.035);
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.095, 24), streamMaterial);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.copy(landing);
    group.add(ripple);
    ripples.push(ripple);
  }
  const inlet = housings[0]!.getObjectByName('Water inlet')!.getWorldPosition(new THREE.Vector3());
  const pickup = world(tank, [2.95, 0.65, 0]);
  route('Tank water with fish waste → filter array', [pickup,
    new THREE.Vector3(pickup.x + 0.35, 0.65, pickup.z),
    new THREE.Vector3(pickup.x + 0.35, 0.25, pickup.z),
    new THREE.Vector3(pickup.x + 0.35, 0.25, 3.2),
    new THREE.Vector3(inlet.x, 0.25, 3.2),
    new THREE.Vector3(inlet.x, inlet.y, 3.2), inlet], waste);
  for (let i = 1; i < housings.length; i++) {
    const previous = housings[i - 1]!.getObjectByName('Water outlet')!.getWorldPosition(new THREE.Vector3());
    const next = housings[i]!.getObjectByName('Water inlet')!.getWorldPosition(new THREE.Vector3());
    route(`Filter ${i} → filter ${i + 1}`, [previous, next], filtered);
  }
  const output = housings[housings.length - 1]!.getObjectByName('Water outlet')!.getWorldPosition(new THREE.Vector3());
  const header = world(rack, [2.65, 7.6, 1.6]);
  route('Filtered nutrient-bearing water → bed supply header', [output,
    new THREE.Vector3(output.x, 7.6, output.z), header], filtered);
  const tankWaterY = world(tank, [0, 3, 0]).y;
  beds.forEach(({ bed }, i) => {
    // Use different positions along the long sides to keep all three drops legible.
    const along = (i - 1) * 1.1;
    const nozzle = world(bed, [along, 0.65, 0.8]);
    const branch = world(bed, [along, 0.85, 1.6]);
    const headerBranch = new THREE.Vector3(branch.x, header.y, branch.z);
    route(`Bed ${i + 1} overhead feed`, [header, headerBranch, branch,
      new THREE.Vector3(nozzle.x, branch.y, nozzle.z), nozzle], filtered);
    drop(`Water falling into bed ${i + 1}`, nozzle, world(bed, [0, 0.22, 0]).y, filtered);
    const drain = world(bed, [along, 0.19, -1.125]);
    const outside = world(bed, [along, 0.08, -1.65]);
    const outlet = new THREE.Vector3(tank.position.x + 2.05, tankWaterY + 0.58, drain.z);
    if (drain.y <= outlet.y || outside.y <= outlet.y) throw new Error('Bed return must descend to an outlet above the tank');
    route(`Bed ${i + 1} gravity return → tank`, [drain, outside,
      new THREE.Vector3(outside.x, tankWaterY + 0.8, outside.z),
      new THREE.Vector3(outlet.x, tankWaterY + 0.7, outlet.z), outlet], clean);
    drop(`Water falling back into tank from bed ${i + 1}`, outlet, tankWaterY, clean);
  });
  function update(time: number) {
    flows.forEach(({ curve, markers }) => markers.forEach((marker, i) => {
      // JS remainder can be negative; CurvePath cannot sample outside [0, 1].
      const t = THREE.MathUtils.euclideanModulo(time * 0.9 / curve.getLength() + i / markers.length, 1);
      marker.position.copy(curve.getPointAt(t));
      marker.quaternion.setFromUnitVectors(up, curve.getTangentAt(t).normalize());
    }));
    ripples.forEach((ripple, i) => ripple.scale.setScalar(1 + ((time * 0.8 + i * 0.17) % 1) * 2));
  }
  update(0);
  return { group, update };
}
