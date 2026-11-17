import * as THREE from "./vendor/three.module.js";
import { seeded } from "./shader.js";

export function makeWeather(scene, seed)
{
    const random = seeded(seed);
    const count = 420;
    const positions = new Float32Array(count * 6);
    const offsets = Array.from({ length: count }, () => ({ x: (random() - .5) * 60, y: random() * 24, z: (random() - .5) * 65 }));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: "#48665d", transparent: true, opacity: .16, depthWrite: false });
    const rain = new THREE.LineSegments(geometry, material);
    rain.frustumCulled = false;
    scene.add(rain);
    return {
        update(time, player)
        {
            for (let i = 0; i < count; i++)
            {
                const o = offsets[i];
                const y = ((o.y - time * 10) % 24 + 24) % 24;
                const index = i * 6;
                positions[index] = o.x + player.x;
                positions[index + 1] = y + -player.z * .075;
                positions[index + 2] = o.z + player.z - 10;
                positions[index + 3] = positions[index] - .12;
                positions[index + 4] = positions[index + 1] - .65;
                positions[index + 5] = positions[index + 2];
            }
            geometry.attributes.position.needsUpdate = true;
        }
    };
}
