import * as THREE from "./vendor/three.module.js";

export function timeModel(minutes)
{
    const u = (minutes - 360) / 840;
    const daylight = Math.sin(Math.PI * u);
    const elevation = daylight * 58;
    return {
        minutes, u, elevation, azimuth: 75 + 210 * u,
        sunIntensity: .25 + 2.25 * daylight,
        hemisphereIntensity: .12 + .38 * daylight,
        glassIntensity: .3 + 1.1 * daylight,
        projectionOpacity: .12 + .58 * daylight,
        length: Math.max(8, Math.min(32, 18 / Math.max(Math.tan(elevation * Math.PI / 180), .18)))
    };
}

export function createLighting(scene, materials, mobile)
{
    const sun = new THREE.DirectionalLight("#fff0d1", 2);
    sun.castShadow = !mobile;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 25, bottom: -25, near: .5, far: 110 });
    sun.shadow.bias = -.001;
    sun.shadow.normalBias = .06;
    sun.target.position.set(0, 5, -22);
    const hemisphere = new THREE.HemisphereLight("#eee1c7", "#7e715b", .45);
    scene.add(sun, sun.target, hemisphere);
    const spots = [];
    for (let i = 0; i < 3; i++)
    {
        const light = new THREE.SpotLight(["#d9a44a", "#3d628e", "#4c8078"][i], .8, 30, .45, .7, 1);
        light.position.set(7.5, 14, -i * 16);
        light.target.position.set(-1, 0, -i * 16 + 4);
        scene.add(light, light.target);
        spots.push(light);
    }
    return {
        sun, hemisphere,
        update(model)
        {
            const a = model.azimuth * Math.PI / 180;
            const e = model.elevation * Math.PI / 180;
            sun.position.set(Math.cos(a) * 42, 10 + Math.sin(e) * 42, -22 + Math.sin(a) * 28);
            sun.intensity = model.sunIntensity;
            sun.color.set("#fff1d6").lerp(new THREE.Color("#e6a267"), 1 - Math.sin(Math.PI * model.u));
            hemisphere.intensity = model.hemisphereIntensity;
            for (const material of materials.glass)
            {
                material.emissiveIntensity = model.glassIntensity;
            }
            for (const spot of spots)
            {
                spot.intensity = .24 + .66 * Math.sin(Math.PI * model.u);
                spot.position.x = model.u < .5 ? -7.5 : 7.5;
            }
        }
    };
}
