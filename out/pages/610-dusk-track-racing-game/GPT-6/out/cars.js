import * as T from "./vendor/three.module.js";
import { box, mat, at } from "./track.js";

export function makeCar(color, number, ghost = false)
{
    const pivot = new T.Group();
    const body = new T.Group();
    pivot.add(body);
    const paint = mat(color, { roughness: .62, metalness: .08 });
    box(body, [1.78, .28, 4.2], [0, .36, 0], paint, true);
    box(body, [1.62, .32, 1.35], [0, .55, 1.25], paint, true);
    box(body, [1.4, .18, .7], [0, .48, 1.85], paint, true);
    box(body, [1.7, .36, .85], [0, .62, -1.55], paint, true);
    box(body, [1.28, .55, 1.45], [0, 1.02, -.15], "#241c18", true);
    const windshield = box(body, [1.18, .42, .08], [0, 1.08, .55], mat("#b7d4d8", { transparent: true, opacity: .55 }));
    windshield.rotation.x = -32 * Math.PI / 180;
    for (const x of [-.5, .5]) box(body, [.08, .3, .1], [x, .96, -1.6], "#1c1612");
    box(body, [1.4, .08, .3], [0, 1.12, -1.6], paint, true);
    const wheels = [];
    for (const x of [-.92, .92])
    {
        for (const z of [-1.28, 1.28])
        {
            box(body, [.25, .2, .9], [x * .88, .68, z], paint);
            const steer = new T.Group();
            steer.position.set(x, .36, z);
            body.add(steer);
            const wheel = new T.Mesh(new T.CylinderGeometry(.36, .36, .24, 10), mat("#1c1612"));
            wheel.rotation.z = Math.PI / 2;
            steer.add(wheel);
            const hub = new T.Mesh(new T.CylinderGeometry(.17, .17, .25, 10), mat("#e8d7b0"));
            hub.rotation.z = Math.PI / 2;
            steer.add(hub);
            wheels.push({ steer, wheel, hub, front: z > 0 });
        }
    }
    for (const x of [-.53, .53])
    {
        box(body, [.38, .14, .06], [x, .58, 2.21], mat("#fff1cc", { emissive: "#fff1cc", emissiveIntensity: .7 }));
        box(body, [.4, .13, .06], [x, .68, -2], mat("#d8452f", { emissive: "#d8452f", emissiveIntensity: .7 }));
    }
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6f1e7";
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#1c1612";
    ctx.font = "800 110px Shoulders";
    ctx.textAlign = "center";
    ctx.fillText(String(number), 128, 105);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    for (const side of [-1, 1])
    {
        const plate = new T.Mesh(new T.PlaneGeometry(.8, .4), new T.MeshStandardMaterial({ map: texture }));
        plate.position.set(side * .903, .57, -.05);
        plate.rotation.y = side * Math.PI / 2;
        body.add(plate);
    }
    if (ghost)
    {
        pivot.traverse((mesh) =>
        {
            if (!mesh.isMesh) return;
            mesh.material = mesh.material.clone();
            mesh.material.transparent = true;
            mesh.material.opacity = .32;
            mesh.material.depthWrite = false;
            mesh.material.emissive?.set("#ffb067");
            mesh.material.emissiveIntensity = .15;
            mesh.castShadow = false;
        });
    }
    pivot.userData = { body, wheels };
    return pivot;
}
export function placeCar(mesh, car)
{
    const f = at(car.s, car.lateral);
    mesh.position.set(car.x ?? f.p.x, f.p.y + .05, car.z ?? f.p.z);
    mesh.rotation.y = Math.PI / 2 - (car.yaw ?? f.yaw);
    mesh.userData.body.rotation.z = f.bank;
    for (const w of mesh.userData.wheels)
    {
        w.wheel.rotation.x = (car.travel || 0) / .36;
        w.hub.rotation.x = (car.travel || 0) / .36;
        if (w.front) w.steer.rotation.y = -(car.steer || 0) * Math.PI / 10;
    }
}
