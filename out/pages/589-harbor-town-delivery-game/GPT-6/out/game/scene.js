import * as THREE from "../vendor/three.module.min.js";
import { jobs, roads, depot, seed, content, BRAND, TOWN_NAME } from "./content.js";

export function createScene(canvas)
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#91c9c6");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const camera = new THREE.OrthographicCamera(-65, 65, 45, -45, 0.1, 400);
    camera.position.set(82, 102, 98);
    camera.lookAt(-1, 0, 0);
    scene.add(new THREE.HemisphereLight("#fff5df", "#88aaa0", 2.8));
    const sun = new THREE.DirectionalLight("#fff1d2", 3);
    sun.position.set(-35, 75, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -65, right: 65, top: 65, bottom: -65, near: 1, far: 180 });
    sun.shadow.bias = -0.0007;
    sun.shadow.normalBias = 0.06;
    scene.add(sun);
    const colliders = [];
    const materials = new Map();
    function material(color)
    {
        if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.92 }));
        return materials.get(color);
    }
    function box(w, h, d, x, y, z, color, parent = scene)
    {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color));
        mesh.position.set(x, y, z);
        mesh.castShadow = h > 0.5;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }
    function cylinder(r1, r2, h, x, y, z, color, sides = 8, parent = scene)
    {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, sides), material(color));
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        parent.add(mesh);
        return mesh;
    }
    function sign(text, width, x, y, z, color = "#385d55", rotation = 0, parent = scene)
    {
        const art = document.createElement("canvas");
        art.width = 512;
        art.height = 128;
        const ctx = art.getContext("2d");
        ctx.fillStyle = "#fff7e6";
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, 496, 112);
        ctx.fillStyle = color;
        ctx.font = "600 48px Fredoka";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 256, 68, 476);
        const texture = new THREE.CanvasTexture(art);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotation;
        parent.add(mesh);
        return mesh;
    }
    function tree(x, z, size = 1)
    {
        cylinder(0.18 * size, 0.24 * size, 2.3 * size, x, 1.15 * size + 0.5, z, "#8d795d", 6);
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7 * size, 0), material("#729d79"));
        crown.position.set(x, 3.4 * size, z);
        crown.castShadow = true;
        scene.add(crown);
        colliders.push({ x, z, w: 0.6, d: 0.6 });
    }
    const sea = box(280, 0.5, 280, 0, -2.1, 0, "#88c4c0");
    sea.material = new THREE.MeshBasicMaterial({ color: "#88c4c0" });
    box(74, 2.4, 74, 0, -0.85, 0, "#c8bc9c");
    box(72.5, 0.4, 72.5, 0, 0.5, 0, "#dce0bb");
    box(74, 0.3, 2, 0, 0.6, 36, "#e6dac0");
    box(2, 0.3, 74, -36, 0.6, 0, "#e6dac0");
    roads.forEach(road =>
    {
        box(7.6, 0.12, 68, road, 0.77, 0, "#bdb9a5");
        box(68, 0.12, 7.6, 0, 0.78, road, "#bdb9a5");
        for (let mark = -31; mark <= 31; mark += 7)
        {
            if (roads.some(cross => Math.abs(mark - cross) < 5)) continue;
            box(0.13, 0.02, 2.2, road, 0.85, mark, "#e7e1ca");
            box(2.2, 0.02, 0.13, mark, 0.86, road, "#e7e1ca");
        }
    });
    for (const x of [-28, 0, 28])
    {
        for (let stripe = -2; stripe <= 2; stripe++)
        {
            box(0.55, 0.02, 2.4, x + stripe, 0.88, 23.2, "#f5eedb");
        }
    }
    const doorways = [];
    jobs.forEach((job, index) =>
    {
        const height = [7.6, 6.3, 8.2, 6.5, 7.3, 6][index];
        const width = index < 2 || index > 3 ? 9 : 8;
        const x = job.buildingX;
        box(width, height, 10, x, height / 2 + 0.8, job.z, job.color);
        colliders.push({ x, z: job.z, w: width / 2, d: 5 });
        const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 1, 4), material(job.roof));
        roof.scale.set(width * 0.82, 3.1, 7.7);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(x, height + 2.3, job.z);
        roof.castShadow = true;
        scene.add(roof);
        box(1.1, 2, 1.1, x + 2.5, height + 3, job.z - 1.4, "#e4d7b8");
        for (const offset of [-2.7, 2.7])
        {
            box(1.65, 2.1, 0.15, x + offset, 3.6, job.z + 5.08, "#5a888b");
            box(1.8, 0.2, 0.3, x + offset, 2.45, job.z + 5.13, "#fff1d4");
            box(0.12, 2.15, 0.2, x + offset, 3.6, job.z + 5.2, "#fff1d4");
            box(1.65, 0.12, 0.2, x + offset, 3.6, job.z + 5.2, "#fff1d4");
        }
        box(1.8, 3, 0.18, x, 2.3, job.z + 5.1, "#52756a");
        const awning = box(width + 0.4, 0.3, 2, x, 5.1, job.z + 5.5, job.roof);
        awning.rotation.x = 0.15;
        sign(job.sign, width - 0.8, x, height - 0.2, job.z + 5.12);
        const portal = new THREE.Group();
        portal.position.set(job.doorX, 0.9, job.z);
        const glow = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.7, 40), new THREE.MeshBasicMaterial({ color: "#f8c857", side: THREE.DoubleSide }));
        glow.rotation.x = -Math.PI / 2;
        portal.add(glow);
        const beacon = new THREE.Group();
        const glowMaterial = new THREE.MeshStandardMaterial({ color: "#ffd26b", emissive: "#ef9e2e", emissiveIntensity: 0.5 });
        for (const [w, h, x, y] of [[0.22, 3.8, -1.2, 1.9], [0.22, 3.8, 1.2, 1.9], [2.6, 0.22, 0, 3.8]])
        {
            const bar = box(w, h, 0.22, x, y, 0, "#ffd26b", beacon);
            bar.material = glowMaterial;
        }
        portal.add(beacon);
        const label = sign(String(index + 1).padStart(2, "0"), 3.8, 0, 13, 0, "#a86a26", 0.6, portal);
        label.material.depthTest = false;
        label.renderOrder = 10;
        portal.userData = { glow, beacon, label };
        scene.add(portal);
        doorways.push(portal);
    });
    box(10, 5, 5, -9.5, 3.3, 20.5, "#b3c5a5");
    box(11, 0.7, 6, -9.5, 6.1, 20.5, "#537a6c");
    box(5.2, 3.5, 0.15, -9.5, 2.6, 23.1, "#e4d6b7");
    sign(BRAND.toUpperCase(), 10, -9.5, 5, 23.2);
    colliders.push({ x: -9.5, z: 20.5, w: 5, d: 2.5 });
    for (let index = 0; index < 4; index++)
    {
        box(1.5, 1.4, 1.4, -26 + index * 1.4, 1.6, 32, "#c99158");
        box(0.17, 1.43, 1.43, -26 + index * 1.4, 1.6, 32, "#e8c999");
    }
    const depotRing = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.1, 48), new THREE.MeshBasicMaterial({ color: "#f4ce69", side: THREE.DoubleSide }));
    depotRing.rotation.x = -Math.PI / 2;
    depotRing.position.set(depot.x, 0.9, depot.z);
    scene.add(depotRing);
    box(12, 0.55, 4.5, -12, -0.1, 41, "#a99270");
    box(4, 0.55, 12, -19, -0.1, 38, "#a99270");
    for (let x = -17; x <= -7; x += 2)
    {
        box(0.12, 0.04, 4.5, x, 0.21, 41, "#c5ad84");
    }
    const boats = [];
    function boat(x, z, color, angle)
    {
        const group = new THREE.Group();
        group.position.set(x, -0.35, z);
        group.rotation.y = angle;
        const hull = cylinder(1.1, 0.55, 1.1, 0, 0.3, 0, color, 6, group);
        hull.scale.z = 2.6;
        box(1.6, 0.3, 3.4, 0, 0.9, 0, "#f5e9d1", group);
        cylinder(0.07, 0.09, 6, 0, 3.3, 0, "#866e53", 6, group);
        const sail = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.6, 3, 1, false, 0, Math.PI), material("#fff0d4"));
        sail.scale.z = 0.04;
        sail.position.set(0.7, 3.6, 0);
        group.add(sail);
        scene.add(group);
        boats.push(group);
    }
    boat(-8, 48, "#cd7753", -0.3);
    boat(-29, 45, "#557e8c", 0.45);
    boat(-44, 13, "#d6ac62", 0.5);
    box(10, 1.8, 10, -43, -0.7, -31, "#c7b99b");
    cylinder(2, 2.8, 13, -43, 6.3, -31, "#f4e8c9", 10);
    cylinder(2.2, 2.2, 1.5, -43, 8, -31, "#c9775a", 10);
    cylinder(2.4, 2.4, 1.4, -43, 13.4, -31, "#4e7370", 10);
    cylinder(0, 3, 2, -43, 15, -31, "#c9775a", 10);
    let randomState = seed;
    function random()
    {
        randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
        return randomState / 4294967296;
    }
    [[-16, 7], [-10, -20], [-15, -6], [-13, 21], [10, 24], [33, 7], [33, -21], [-32, -33], [5, -33], [19, -33]].forEach(([x, z]) => tree(x, z, 0.75 + random() * 0.35));
    for (let n = 0; n < 21; n++)
    {
        const x = -33 + random() * 66;
        const z = n % 2 ? -34 : 34;
        const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65 + random() * 0.5, 0), material(n % 3 ? "#91a47a" : "#e5ad87"));
        shrub.position.set(x, 1.1, z);
        scene.add(shrub);
    }
    [[-7, 7], [-8, -7], [21, 5]].forEach(([x, z]) =>
    {
        box(3.2, 0.25, 1, x, 1.3, z, "#9d805e");
        box(3.2, 1, 0.18, x, 1.8, z + 0.5, "#9d805e");
        box(0.2, 1.1, 0.8, x - 1.1, 0.8, z, "#557267");
        box(0.2, 1.1, 0.8, x + 1.1, 0.8, z, "#557267");
    });
    sign(TOWN_NAME.toUpperCase(), 13, -7, 2.7, 35.5);
    const van = new THREE.Group();
    box(2.55, 1.4, 4.3, 0, 1.35, 0.15, "#d87d3d", van);
    box(2.5, 1.6, 2.85, 0, 2.55, 0.75, "#f0b858", van);
    box(2.48, 1.2, 1.5, 0, 2.25, -1.35, "#f0b858", van);
    box(2.15, 0.8, 0.08, 0, 2.45, -2.13, "#497779", van);
    box(0.08, 0.7, 1, 1.28, 2.45, -1.3, "#497779", van);
    box(0.08, 0.7, 1, -1.28, 2.45, -1.3, "#497779", van);
    box(2.7, 0.28, 0.2, 0, 0.95, -2.15, "#e9e1c9", van);
    for (const x of [-0.88, 0.88])
    {
        box(0.47, 0.45, 0.12, x, 1.5, -2.14, "#fff1c8", van);
    }
    for (const x of [-1.25, 1.25])
    {
        for (const z of [-1.3, 1.5])
        {
            const wheel = cylinder(0.6, 0.6, 0.38, x, 0.82, z, "#3b4e48", 12, van);
            wheel.rotation.z = Math.PI / 2;
        }
    }
    box(0.08, 0.9, 1.2, 1.3, 2.65, 0.8, "#fff1cb", van);
    box(0.1, 0.1, 1.3, 1.35, 2.65, 0.8, "#bc7547", van);
    scene.add(van);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.5, 3), material("#fff5d5"));
    arrow.rotation.z = Math.PI;
    scene.add(arrow);
    function resize()
    {
        const { width, height } = canvas.getBoundingClientRect();
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const worldWidth = aspect < 1 ? 111 : 138;
        camera.left = -worldWidth / 2;
        camera.right = worldWidth / 2;
        camera.top = worldWidth / aspect / 2;
        camera.bottom = -worldWidth / aspect / 2;
        camera.updateProjectionMatrix();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function render(player, missions, time)
    {
        van.position.set(player.x, 0, player.z);
        van.rotation.y = player.heading;
        arrow.position.set(player.x, reduced ? 6 : 6 + Math.sin(time * 3) * 0.3, player.z);
        const s = missions.state;
        doorways.forEach((door, index) =>
        {
            const active = s.cargo > 0 && index === s.delivered;
            door.visible = active || index < s.delivered;
            door.userData.glow.material.color.set(index < s.delivered ? "#79a688" : "#ffd260");
            door.userData.beacon.visible = active;
            door.userData.label.visible = active;
            door.userData.label.quaternion.copy(camera.quaternion);
            if (active && !reduced) door.userData.glow.scale.setScalar(1 + Math.sin(time * 4) * 0.08);
        });
        depotRing.visible = !s.cargo && s.delivered === 0;
        if (!reduced)
        {
            boats.forEach((boat, index) =>
            {
                boat.position.y = -0.35 + Math.sin(time * 1.3 + index * 1.8) * 0.12;
                boat.rotation.z = Math.sin(time + index) * 0.025;
            });
        }
        renderer.render(scene, camera);
    }
    resize();
    function projectTarget(target)
    {
        const projected = new THREE.Vector3(target.x, 10, target.z).project(camera);
        return { x: (projected.x + 1) * 50, y: (1 - projected.y) * 50 };
    }
    return { colliders, render, renderer, camera, scene, projectTarget, dispose: () => { observer.disconnect(); renderer.dispose(); } };
}
