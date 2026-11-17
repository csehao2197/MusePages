import { CONTENT } from "./content.js";

export function updateLighting(world, seconds)
{
    const t = Math.min(1, seconds / 150);
    const { THREE } = world;
    world.hemi.intensity = 2.4 - t * 1.65;
    world.sun.intensity = 3.1 - t * 2.6;
    world.sun.color.setRGB(1, .88 - t * .15, .72 + t * .2);
    const color = new THREE.Color(0xd8d6c6).lerp(new THREE.Color(0x535f7e), t);
    world.renderer.setClearColor(color);
    world.scene.fog.color.copy(color);
    for (const light of world.lamps) light.material.emissiveIntensity = .3 + t * 2.7;
    for (const window of world.windows) window.material.emissiveIntensity = .1 + t * .7;
    document.getElementById("time-label").textContent = t > .8 ? CONTENT.messages.night : CONTENT.messages.beforeNight;
}
