import * as THREE from "./vendor/three.module.js";
import { CONTENT } from "./content.js";

export const ROAD_LINES = [-96, -48, 0, 48, 96];
export const PORCHES = [{ x: -24, z: -40 }, { x: 24, z: 8 }, { x: 72, z: 56 }];
export const PICKUP = { x: -14, z: -88 };
export const GATES =
[
    { x: 0, z: -48, yaw: Math.PI / 2 },
    { x: 48, z: -30, yaw: 0 },
    { x: 48, z: 40, yaw: 0 },
    { x: 0, z: 48, yaw: -Math.PI / 2 },
    { x: -48, z: 30, yaw: Math.PI },
    { x: -48, z: -40, yaw: Math.PI }
];

export function makeWorld(canvas)
{
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xd8d6c6);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd8d6c6, 250, 660);
    const camera = new THREE.OrthographicCamera(-150, 150, 125, -125, .1, 900);
    const hemi = new THREE.HemisphereLight(0xffe6d3, 0x51736b, 2.4);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe5b7, 3.1);
    sun.position.set(-100, 160, -60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -160, right: 160, top: 160, bottom: -160, far: 450 });
    sun.shadow.normalBias = .12;
    sun.shadow.bias = -.0001;
    scene.add(sun);
    const obstacles = [];
    const lamps = [];
    const windows = [];
    const materials = new Map();
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wheelGeometry = new THREE.CylinderGeometry(.6, .6, .35, 10);
    const mapBlocks = [];

    function material(color, extra = {})
    {
        const key = `${color}:${JSON.stringify(extra)}`;
        if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: 1, ...extra }));
        return materials.get(key);
    }

    function box(x, y, z, width, height, depth, color, shadow = false, parent = scene)
    {
        const mesh = new THREE.Mesh(boxGeometry, material(color));
        mesh.position.set(x, y, z);
        mesh.scale.set(width, height, depth);
        mesh.castShadow = shadow;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }

    function sign(text, width, height, x, y, z, parent = scene)
    {
        const sheet = document.createElement("canvas");
        sheet.width = 768;
        sheet.height = 160;
        const c = sheet.getContext("2d");
        c.fillStyle = "#f4e8cc";
        c.fillRect(0, 0, sheet.width, sheet.height);
        c.strokeStyle = "#365247";
        c.lineWidth = 6;
        c.strokeRect(10, 10, 748, 140);
        c.fillStyle = "#23493c";
        c.font = "600 48px Fraunces";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, 384, 83, 680);
        const texture = new THREE.CanvasTexture(sheet);
        texture.colorSpace = THREE.SRGBColorSpace;
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
        mesh.position.set(x, y, z);
        mesh.rotation.y = Math.PI;
        parent.add(mesh);
        return mesh;
    }

    function tree(x, z, size = 1, tint = 0x59775a)
    {
        box(x, 2 * size, z, .65 * size, 4 * size, .65 * size, 0x856650, true);
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2 * size, 0), material(tint));
        crown.position.set(x, 5.2 * size, z);
        crown.scale.y = 1.25;
        crown.castShadow = true;
        scene.add(crown);
        obstacles.push({ x, z, w: 1.1, d: 1.1 });
    }

    function lamp(x, z)
    {
        box(x, 3.3, z, .18, 6.6, .18, 0x43564b);
        box(x, 6.6, z, 1.3, .18, 1.3, 0x43564b);
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(.8, 1, .8), new THREE.MeshStandardMaterial({ color: 0xffe5aa, emissive: 0xffbc66, emissiveIntensity: .3 }));
        bulb.position.set(x, 6.1, z);
        scene.add(bulb);
        lamps.push(bulb);
    }

    box(0, -2.5, 0, 246, 5, 246, 0x748e78, true);
    box(0, -.26, 0, 235, .5, 235, 0xadb29a);
    box(0, -4.5, 0, 1800, 1, 1800, 0x96b6ad);
    for (const line of ROAD_LINES)
    {
        box(line, .05, 0, 14, .16, 215, 0x7d8d85);
        box(0, .06, line, 215, .17, 14, 0x7d8d85);
        for (let dash = -102; dash <= 102; dash += 8)
        {
            if (ROAD_LINES.some((road) => Math.abs(dash - road) < 10)) continue;
            box(line, .16, dash, .18, .025, 3.8, 0xc9cfad);
            box(dash, .17, line, 3.8, .025, .18, 0xc9cfad);
        }
    }
    for (const x of ROAD_LINES)
    {
        for (const z of ROAD_LINES)
        {
            if (Math.abs(x) === 96 || Math.abs(z) === 96) continue;
            for (let stripe = -4; stripe <= 4; stripe += 2)
            {
                box(x + stripe, .18, z + 9, 1, .02, 3, 0xe7ddbf);
                box(x + 9, .18, z + stripe, 3, .02, 1, 0xe7ddbf);
            }
        }
    }
    const colors = [0xc79a7f, 0xdfbb8e, 0xaeb8a1, 0xd7b5a3, 0xcc9e82, 0x90a99c, 0xe2c69c, 0xb9a7a5];
    let number = 0;
    for (const z of [-72, -24, 24, 72])
    {
        for (const x of [-72, -24, 24, 72])
        {
            box(x, .28, z, 34, .6, 34, 0xd0ccb2);
            box(x, .64, z, 31.7, .15, 31.7, 0xdad1b7);
            const park = number === 8;
            if (park)
            {
                box(x, .8, z, 29, .2, 29, 0x8eaa78);
                box(x, .94, z, 4, .08, 29, 0xd4c09a);
                box(x, .95, z, 29, .08, 4, 0xd4c09a);
                for (const dx of [-9, 9]) for (const dz of [-9, 9]) tree(x + dx, z + dz, 1.3);
                const fountain = new THREE.Mesh(new THREE.CylinderGeometry(4, 4.5, 1, 12), material(0xd8d3b9));
                fountain.position.set(x, 1.1, z);
                scene.add(fountain);
                const water = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, .15, 16), material(0x82b6b0));
                water.position.set(x, 1.7, z);
                scene.add(water);
                obstacles.push({ x, z, w: 8, d: 8 });
                mapBlocks.push({ x, z, park: true });
                number++;
                continue;
            }
            const clubhouse = x === -24 && z === -72;
            const h = clubhouse ? 9 : 8 + ((number * 7) % 12);
            const width = 25;
            const depth = 25;
            box(x, h / 2 + .75, z, width, h, depth, colors[number % colors.length], true);
            box(x, h + 1.05, z, width + 1.2, .8, depth + 1.2, 0x697b6c, true);
            box(x, h + 1.75, z, width - 2, .7, depth - 2, 0x8a9680);
            box(x + 6, h + 2.8, z + 6, 3.5, 2, 3.5, 0xa3a493, true);
            box(x - 7, h + 2, z - 5, 4, .8, 5, 0x8a8172);
            obstacles.push({ x, z, w: width + .5, d: depth + .5 });
            mapBlocks.push({ x, z, park: false });
            const pane = material(0x647d74, { emissive: 0xf0b95c, emissiveIntensity: .1 });
            for (let y = 5; y < h - 1; y += 4.5)
            {
                for (const dx of [-8, -2.7, 2.7, 8])
                {
                    for (const side of [-1, 1])
                    {
                        const window = new THREE.Mesh(boxGeometry, pane);
                        window.scale.set(2.2, 2.4, .1);
                        window.position.set(x + dx, y, z + side * (depth / 2 + .06));
                        scene.add(window);
                        windows.push(window);
                    }
                    box(x + width / 2 + .07, y, z + dx, .1, 2.4, 2.2, 0x6a8074);
                }
            }
            box(x, 2, z - 12.65, 3, 3, .15, 0x39584e);
            box(x + 1, 1.85, z - 12.8, .15, .16, .15, 0xf7d392);
            box(x - 6, 2.5, z - 12.7, 7, 2.5, .15, 0x688d80);
            box(x + 6, 2.5, z - 12.7, 7, 2.5, .15, 0x688d80);
            for (let stripe = 0; stripe < 11; stripe++)
            {
                const awning = box(x - 10 + stripe * 2, 4.5, z - 14, 2, .22, 3.2, stripe % 2 ? 0xf3ddad : (clubhouse ? 0x598d76 : 0xba6c51), true);
                awning.rotation.x = -.12;
            }
            sign(clubhouse ? CONTENT.brand : CONTENT.shops[number], 17, 2.4, x, 6.5, z - 12.77);
            for (const dx of [-14.7, 14.7])
            {
                box(x + dx, 1, z - 13.5, 1.7, .9, 2, 0xb57d60);
                const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), material(0x5c8060));
                plant.position.set(x + dx, 1.9, z - 13.5);
                scene.add(plant);
            }
            tree(x - 15, z + 12, .75, number % 3 ? 0x688361 : 0xb59a67);
            tree(x + 15, z + 12, .85);
            lamp(x + 18.5, z - 18.5);
            box(x - 5, 1, z - 15, 4.5, .25, 1.1, 0x8b6c50);
            box(x - 5, 1.65, z - 15.5, 4.5, 1, .2, 0x8b6c50);
            number++;
        }
    }
    for (let index = 0; index < 19; index++)
    {
        const x = -106 + index * 12;
        box(x, .4, 111, 1.1, 1.4, 1.1, 0x7e8f7b);
        box(x, 1.4, 111, 1.5, .3, 1.5, 0xd0c8ad);
        box(111, .4, x, 1.1, 1.4, 1.1, 0x7e8f7b);
    }
    box(0, .7, 111, 216, .2, .3, 0xe0d5b6);
    box(111, .7, 0, .3, .2, 216, 0xe0d5b6);
    for (let board = 0; board < 19; board++) box(-70, -1.7, 117 + board, 12, .4, .8, 0x9b947c);
    for (const x of [-75, -65]) box(x, -2.5, 131, .6, 6, .6, 0x787963);
    sign(CONTENT.district, 17, 3, 73, 4, -109);
    box(66, 2, -109, .3, 4, .3, 0x496b5b);
    box(80, 2, -109, .3, 4, .3, 0x496b5b);
    const player = new THREE.Group();
    box(0, 1.05, 0, .85, 1.25, .6, 0xd7834c, true, player);
    box(0, 2, 0, .65, .65, .65, 0xe9bd91, true, player);
    box(0, 2.4, .03, .86, .18, .8, 0xf1d596, true, player);
    const leftLeg = box(-.23, .35, 0, .25, .7, .32, 0x37534b, false, player);
    const rightLeg = box(.23, .35, 0, .25, .7, .32, 0x37534b, false, player);
    scene.add(player);
    const marker = new THREE.Mesh(new THREE.ConeGeometry(.8, 1.5, 3), material(0xf6e8b8));
    marker.rotation.x = Math.PI;
    marker.position.y = 4;
    player.add(marker);

    function makeCar(color = 0xebcc93, pool = false)
    {
        const group = new THREE.Group();
        box(0, .9, 0, 2.8, 1.05, 5.4, color, true, group);
        box(0, 1.9, -.35, 2.4, 1.2, 2.8, color, true, group);
        box(0, 1.98, 1.08, 2.1, .83, .06, 0x638d87, false, group);
        box(0, 1.98, -1.78, 2.1, .83, .06, 0x638d87, false, group);
        for (const side of [-1, 1])
        {
            box(side * 1.22, 2, -.34, .04, .8, 2.3, 0x638d87, false, group);
            box(side * 1.26, 2, -.2, .05, .82, .15, color, false, group);
            box(side * .9, 1, 2.73, .65, .32, .06, 0xfbe9ad, false, group);
            box(side * .94, .94, -2.73, .5, .25, .06, 0xa44f3c, false, group);
            for (const z of [-1.6, 1.65])
            {
                const wheel = new THREE.Mesh(wheelGeometry, material(0x33483f));
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(side * 1.44, .6, z);
                group.add(wheel);
            }
        }
        box(0, .65, 2.76, 2.7, .22, .15, 0xc2c5ad, false, group);
        box(0, .65, -2.76, 2.7, .22, .15, 0xc2c5ad, false, group);
        if (pool)
        {
            box(0, 1.44, 1.95, .65, .04, 1.5, 0x75b99e, false, group);
            box(0, 2.52, -.35, .65, .04, 2.8, 0x75b99e, false, group);
            box(0, 1.44, -2.2, .65, .04, .9, 0x75b99e, false, group);
        }
        const parts = new Map();
        for (const mesh of [...group.children])
        {
            const key = `${mesh.geometry.uuid}:${mesh.material.uuid}`;
            if (!parts.has(key)) parts.set(key, []);
            parts.get(key).push(mesh);
        }
        for (const meshes of parts.values())
        {
            if (meshes.length < 2) continue;
            const instance = new THREE.InstancedMesh(meshes[0].geometry, meshes[0].material, meshes.length);
            instance.castShadow = meshes.some((mesh) => mesh.castShadow);
            instance.receiveShadow = true;
            meshes.forEach((mesh, index) =>
            {
                mesh.updateMatrix();
                instance.setMatrixAt(index, mesh.matrix);
                group.remove(mesh);
            });
            instance.computeBoundingSphere();
            group.add(instance);
        }
        scene.add(group);
        return group;
    }
    const poolCars =
    [
        { x: -3, z: -88, yaw: 0 },
        { x: 44, z: -70, yaw: Math.PI },
        { x: -92, z: 24, yaw: 0 },
        { x: 74, z: 100, yaw: Math.PI / 2 }
    ].map((position, index) =>
    {
        const mesh = makeCar(0xf0e3bf, true);
        const car = { ...position, start: { ...position }, speed: 0, mesh, name: CONTENT.poolNames[index] };
        mesh.position.set(car.x, .15, car.z);
        mesh.rotation.y = car.yaw;
        return car;
    });
    const target = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3, .14, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffd18a }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .9;
    target.add(ring);
    const parcel = box(0, 1.8, 0, 1.7, 1.4, 1.7, 0xd59658, true, target);
    box(0, 1.8, 0, .2, 1.46, 1.76, 0xfae0a6, false, target);
    const beacon = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.2, 4), new THREE.MeshBasicMaterial({ color: 0xffd18a }));
    beacon.rotation.x = Math.PI;
    beacon.position.y = 5;
    target.add(beacon);
    target.visible = false;
    scene.add(target);
    const gateMeshes = GATES.map((gate) =>
    {
        const group = new THREE.Group();
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(4.7, .22, 6, 32, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffc887 }));
        hoop.position.y = .5;
        group.add(hoop);
        const mat = new THREE.MeshBasicMaterial({ color: 0xeaa36e, transparent: true, opacity: .14, side: THREE.DoubleSide });
        const fill = new THREE.Mesh(new THREE.CircleGeometry(4.6, 24, 0, Math.PI), mat);
        fill.position.y = .5;
        group.add(fill);
        group.position.set(gate.x, .2, gate.z);
        group.rotation.y = gate.yaw;
        group.visible = false;
        scene.add(group);
        return group;
    });
    const batches = new Map();
    scene.updateMatrixWorld(true);
    for (const mesh of [...scene.children])
    {
        if (!mesh.isMesh || mesh.geometry !== boxGeometry) continue;
        if (!batches.has(mesh.material)) batches.set(mesh.material, []);
        batches.get(mesh.material).push(mesh);
    }
    for (const [surface, meshes] of batches)
    {
        const batch = new THREE.InstancedMesh(boxGeometry, surface, meshes.length);
        batch.castShadow = meshes.some((mesh) => mesh.castShadow);
        batch.receiveShadow = true;
        meshes.forEach((mesh, index) =>
        {
            batch.setMatrixAt(index, mesh.matrixWorld);
            scene.remove(mesh);
        });
        batch.computeBoundingSphere();
        scene.add(batch);
    }
    return { THREE, renderer, scene, camera, sun, hemi, lamps, windows, player, leftLeg, rightLeg, obstacles, mapBlocks, poolCars, makeCar, target, parcel, beacon, gateMeshes };
}
