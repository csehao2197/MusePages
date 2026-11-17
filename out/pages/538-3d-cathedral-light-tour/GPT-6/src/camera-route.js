import * as THREE from "./vendor/three.module.js";
import { content } from "./content.js";

const position = new THREE.Vector3();
const target = new THREE.Vector3();
const direction = new THREE.Vector3();
const spherical = new THREE.Spherical();

export function updateCamera(camera, state, reduced, entrance = 0)
{
    const progress = reduced ? state.activeStop : state.tourProgress * 5;
    const first = Math.min(4, Math.floor(progress));
    const second = first + 1;
    const t = progress >= 5 ? 1 : THREE.MathUtils.smoothstep(progress - first, 0, 1);
    position.fromArray(content.stops[first].position).lerp(new THREE.Vector3(...content.stops[second].position), t);
    target.fromArray(content.stops[first].target).lerp(new THREE.Vector3(...content.stops[second].target), t);
    if (state.tourProgress === 0)
    {
        position.z += entrance;
    }
    camera.position.copy(position);
    direction.copy(target).sub(position);
    spherical.setFromVector3(direction);
    spherical.theta += state.lookOffset.yaw;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + state.lookOffset.pitch, .1, Math.PI - .1);
    direction.setFromSpherical(spherical);
    camera.lookAt(position.clone().add(direction));
}
