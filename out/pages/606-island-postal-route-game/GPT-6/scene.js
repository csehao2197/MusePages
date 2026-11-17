import * as THREE from "./assets/three.module.min.js";
import { content } from "./content.js";
import { heightAt, seededRandom, solids } from "./terrain.js";

export function createScene(container)
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd8e5de);
    scene.fog = new THREE.Fog(0xd8e5de, 95, 190);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0xd8e5de);
    container.append(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "Live three-dimensional autumn island with a postal courier, three shrines, a river bridge, and the North Temple");
    const camera = new THREE.PerspectiveCamera(39, 1, .1, 250);
    scene.add(new THREE.HemisphereLight(0xfff8dd, 0x7d9783, 2));
    const sunlight = new THREE.DirectionalLight(0xfff1cf, 2.2);
    sunlight.position.set(-30, 55, 20);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(sunlight.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 140 });
    sunlight.shadow.bias = -.001;
    scene.add(sunlight);
    const materials = new Map();
    function material(color)
    {
        if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
        return materials.get(color);
    }
    function mesh(geometry, color, x, y, z, parent = scene)
    {
        const object = new THREE.Mesh(geometry, material(color));
        object.position.set(x, y, z);
        object.castShadow = true;
        object.receiveShadow = true;
        parent.add(object);
        return object;
    }
    function box(w, h, d, color, x, y, z, parent)
    {
        return mesh(new THREE.BoxGeometry(w, h, d), color, x, y, z, parent);
    }
    function cylinder(r1, r2, h, color, x, y, z, vertices = 8, parent)
    {
        return mesh(new THREE.CylinderGeometry(r1, r2, h, vertices), color, x, y, z, parent);
    }
    const sea = mesh(new THREE.PlaneGeometry(200, 200), 0xc3dcd4, 0, -1.7, 0);
    sea.rotation.x = -Math.PI / 2;
    sea.castShadow = false;
    const island = cylinder(24, 21, 3.3, 0xb7b393, 0, -1.2, 0, 40);
    island.scale.z = 1.18;
    const grass = cylinder(24.2, 24.2, .5, 0xb5c28c, 0, .35, 0, 52);
    grass.scale.z = 1.18;
    const shore = new THREE.Mesh(new THREE.RingGeometry(24.5, 25.7, 70), new THREE.MeshBasicMaterial({ color: 0xe7e5cd, transparent: true, opacity: .6, side: THREE.DoubleSide }));
    shore.rotation.x = -Math.PI / 2;
    shore.scale.y = 1.18;
    shore.position.y = -1.65;
    scene.add(shore);
    let pathLayer = 0;
    function path(points, width = 1.4)
    {
        const vertices = [];
        pathLayer += .008;
        for (let i = 1; i < points.length; i++)
        {
            const [x, z] = points[i - 1];
            const [xx, zz] = points[i];
            const steps = Math.ceil(Math.hypot(xx - x, zz - z) / .55);
            const length = Math.hypot(xx - x, zz - z);
            const ox = -(zz - z) / length * width;
            const oz = (xx - x) / length * width;
            for (let j = 0; j < steps; j++)
            {
                const px = x + (xx - x) * j / steps;
                const pz = z + (zz - z) * j / steps;
                const nx = x + (xx - x) * (j + 1) / steps;
                const nz = z + (zz - z) * (j + 1) / steps;
                const a = [px + ox, heightAt(px + ox, pz + oz) + .09 + pathLayer, pz + oz];
                const b = [px - ox, heightAt(px - ox, pz - oz) + .09 + pathLayer, pz - oz];
                const c = [nx + ox, heightAt(nx + ox, nz + oz) + .09 + pathLayer, nz + oz];
                const d = [nx - ox, heightAt(nx - ox, nz - oz) + .09 + pathLayer, nz - oz];
                vertices.push(...a, ...c, ...b, ...b, ...c, ...d);
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        const road = mesh(geometry, 0xd8bd89, 0, 0, 0);
        road.material.side = THREE.DoubleSide;
        road.castShadow = false;
    }
    path([[0, 18], [0, 7], [1, -6], [1, -23]], 1.3);
    path([[0, 7], [-8, 6], [-15, 3]], 1.1);
    path([[0, 7], [16, 7]], 1.1);
    path([[0, 7], [-5, -4], [-9, -13]], 1.15);
    const hill = mesh(new THREE.SphereGeometry(1, 12, 8), 0xa9b67f, -9, -.8, -14);
    hill.scale.set(10, 3, 10);
    const river = box(3.6, .05, 24, 0x8db8ad, 8.3, .64, 10);
    river.castShadow = false;
    const streamLines = [];
    for (let i = 0; i < 13; i++)
    {
        const line = box(.06, .02, .8 + i % 3 * .3, 0xc0d9c8, 7.3 + i % 3 * .8, .68, i * 1.65 - 1);
        line.castShadow = false;
        streamLines.push(line);
    }
    for (let i = 0; i < 13; i++)
    {
        box(.39, .16, 2.6, 0xae8255, 5.8 + i * .42, .94, 7);
    }
    for (const z of [5.65, 8.35])
    {
        box(5.5, .15, .12, 0x8c704d, 8.3, 1.7, z);
        for (const x of [5.7, 8.3, 10.9]) box(.14, 1.05, .14, 0x8c704d, x, 1.25, z);
    }
    function sign(text, x, z, color = "#4a5b44")
    {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f4edd7";
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = "#a9af8f";
        ctx.lineWidth = 6;
        ctx.strokeRect(5, 5, 502, 118);
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "600 34px 'DM Sans'";
        ctx.fillText(text, 256, 64);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const plaque = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.35), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
        plaque.position.set(x, heightAt(x, z) + 2.6, z);
        scene.add(plaque);
        box(.12, 2.7, .12, 0x897650, x, heightAt(x, z) + 1.35, z);
        return plaque;
    }
    sign("POST HOUSE", -3.4, 14.5);
    sign("NORTH TEMPLE", 1, -24.4);
    const house = new THREE.Group();
    house.position.set(-3.2, .6, 18);
    scene.add(house);
    box(4.5, 3.4, 3.5, 0xf1dfb8, 0, 1.7, 0, house);
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute("position", new THREE.Float32BufferAttribute(
    [
        -2.7, 3.35, 2.2, 0, 5, 2.2, -2.7, 3.35, -2.2,
        0, 5, 2.2, 0, 5, -2.2, -2.7, 3.35, -2.2,
        0, 5, 2.2, 2.7, 3.35, 2.2, 2.7, 3.35, -2.2,
        0, 5, -2.2, 0, 5, 2.2, 2.7, 3.35, -2.2,
        -2.7, 3.35, 2.2, 2.7, 3.35, 2.2, 0, 5, 2.2,
        2.7, 3.35, -2.2, -2.7, 3.35, -2.2, 0, 5, -2.2
    ], 3));
    roofGeometry.computeVertexNormals();
    const roof = mesh(roofGeometry, 0xae6845, 0, 0, 0, house);
    roof.material.side = THREE.DoubleSide;
    box(.9, 1.9, .06, 0x708568, .7, .96, 1.8, house);
    box(.9, .9, .08, 0x789b91, -1.1, 1.9, 1.8, house);
    box(1.05, .08, .11, 0xfaf0d2, -1.1, 1.9, 1.9, house);
    box(.08, 1.05, .11, 0xfaf0d2, -1.1, 1.9, 1.9, house);
    box(.5, 2, .5, 0xbdb6a0, 1.2, 4.3, -.3, house);
    box(.55, 1.4, .55, 0x647d65, .9, 1.3, 16);
    box(.85, .55, .7, 0xc2774b, .9, 2.1, 16);
    const envelopes = new THREE.Group();
    box(.5, .38, .08, 0xf7ebce, 0, 0, 0, envelopes);
    envelopes.position.set(.9, 2.7, 16);
    scene.add(envelopes);
    const shrineMeshes = new Map();
    const beams = [];
    for (const shrine of content.shrines)
    {
        const { x, z, color, id } = shrine;
        const y = heightAt(x, z);
        cylinder(1.9, 2.2, .35, 0x9ca48b, x, y + .16, z);
        cylinder(1.5, 1.7, .25, 0xd9d3b3, x, y + .4, z);
        box(1.3, 2, 1.1, 0xe6ddbd, x, y + 1.5, z);
        cylinder(.95, 1.05, .2, color, x, y + 2.6, z, 4).rotation.y = Math.PI / 4;
        const gem = mesh(new THREE.OctahedronGeometry(.55), color, x, y + 3.5, z);
        beams.push(gem);
        shrineMeshes.set(id, gem);
        sign(shrine.name.toUpperCase(), x, z + 2.5);
        for (const offset of [-1, 1])
        {
            box(.12, 2.8, .12, 0x887a51, x + offset * 1.6, y + 1.4, z);
            const flag = box(.8, .55, .045, color, x + offset * 1.6 + .35, y + 2.45, z);
            flag.rotation.z = -.1;
        }
    }
    const temple = new THREE.Group();
    temple.position.set(1, .6, -22.2);
    scene.add(temple);
    for (const x of [-3.1, 3.1])
    {
        box(1.1, 5, 1.3, 0xc5c5a5, x, 2.5, 0, temple);
        box(1.6, .4, 1.8, 0x8c9a76, x, 5.2, 0, temple);
    }
    box(8.4, .8, 1.7, 0x9b9d77, 0, 5.7, 0, temple);
    box(9, .3, 2, 0x6f835f, 0, 6.25, 0, temple);
    const gate = new THREE.Group();
    temple.add(gate);
    for (let i = 0; i < 9; i++) box(.17, 3.7, .18, 0x697b59, -2.4 + i * .6, 2.15, 0, gate);
    box(5.4, .18, .2, 0x697b59, 0, 2.6, 0, gate);
    box(5.4, .18, .2, 0x697b59, 0, 1, 0, gate);
    const templeLetter = box(.8, .55, .15, 0xfaf1d9, 1, 2, -24.8);
    const random = seededRandom();
    function nearRoute(x, z)
    {
        if (Math.abs(x) < 3.4 || Math.hypot(x, z - 7) < 4) return true;
        if (Math.abs(z - 7) < 3.5 && x > 0) return true;
        if (Math.abs(z - (7 + x * .26)) < 3.2 && x < 0 && z > 0) return true;
        if (Math.abs(x - z * .5 + 2) < 3.2 && z < 5) return true;
        if (content.shrines.some(s => Math.hypot(x - s.x, z - s.z) < 4.5 || Math.abs(x - s.x) < 3 && z > s.z && z < s.z + 7)) return true;
        if (x > 5.5 && x < 11 && z > -3) return true;
        return Math.hypot(x + 3, z - 18) < 5;
    }
    for (let i = 0; i < 135; i++)
    {
        const x = (random() - .5) * 47;
        const z = (random() - .5) * 52;
        if ((x / 23) ** 2 + (z / 26.5) ** 2 > .94 || nearRoute(x, z)) continue;
        const y = heightAt(x, z);
        const h = 2.2 + random() * 2.7;
        cylinder(.14, .22, h * .65, 0x887555, x, y + h * .32, z, 5);
        const colors = [0xce9b51, 0xd6ac60, 0xafb875, 0xbc7752, 0xd4b877, 0x8fa66b];
        const crown = mesh(new THREE.IcosahedronGeometry(h * .42, 0), colors[Math.floor(random() * colors.length)], x, y + h * .83, z);
        crown.scale.y = 1.3;
        crown.rotation.y = random() * Math.PI;
        if (random() > .5)
        {
            const shrub = mesh(new THREE.IcosahedronGeometry(.5, 0), 0x899f6a, x + 1, y + .35, z + .6);
            shrub.scale.set(1.3, .7, 1);
        }
    }
    for (const s of solids.slice(1))
    {
        const rock = mesh(new THREE.IcosahedronGeometry(s.radius, 0), 0xa5ad9b, s.x, .7, s.z);
        rock.scale.y = 1.5;
        mesh(new THREE.IcosahedronGeometry(s.radius * .7, 0), 0xc1c5ae, s.x - 1, .8, s.z + 1);
    }
    for (let i = 0; i < 48; i++)
    {
        const x = (random() - .5) * 40;
        const z = (random() - .5) * 44;
        const leaf = mesh(new THREE.CircleGeometry(.07 + random() * .1, 3), i % 2 ? 0xb98c4e : 0xe4c889, x, heightAt(x, z) + .04, z);
        leaf.rotation.x = -Math.PI / 2;
        leaf.castShadow = false;
    }
    const courier = new THREE.Group();
    scene.add(courier);
    box(.65, .85, .45, 0x466654, 0, 1.05, 0, courier);
    cylinder(.32, .3, .45, 0xeac09b, 0, 1.72, .03, 8, courier);
    cylinder(.4, .43, .14, 0x9d6943, 0, 2, .03, 10, courier);
    cylinder(.28, .31, .3, 0xb37c4a, 0, 2.15, .03, 8, courier);
    box(.7, .12, .62, 0xc18a4d, 0, 1.53, 0, courier);
    box(.4, .54, .38, 0xb77b44, .47, 1.05, -.12, courier);
    for (const x of [-.2, .2])
    {
        const leg = box(.23, .6, .26, 0x4d5545, x, .36, 0, courier);
        leg.userData.leg = true;
        box(.18, .7, .22, 0x466654, x * 2.05, 1.05, .02, courier);
    }
    const pointer = mesh(new THREE.ConeGeometry(.23, .42, 4), 0xfaf1cd, 0, 3, 0, courier);
    pointer.rotation.z = Math.PI;
    const ring = mesh(new THREE.TorusGeometry(.68, .035, 6, 24), 0xfff1bd, 0, .05, 0, courier);
    ring.rotation.x = Math.PI / 2;
    let zoom = 1;
    let width = 1;
    let height = 1;
    const observer = new ResizeObserver(() =>
    {
        width = container.clientWidth;
        height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    observer.observe(container);
    function render(elapsed, state, player)
    {
        const mobile = width < 500;
        const scale = mobile ? 1.35 : 1;
        const targetX = player.x * .2;
        const targetZ = player.z * .16;
        camera.position.set(targetX + 7, 46 * scale / zoom, targetZ + 57 * scale / zoom);
        camera.lookAt(targetX, 0, targetZ - 1);
        for (let i = 0; i < beams.length; i++)
        {
            const shrine = content.shrines[i];
            beams[i].position.y = heightAt(shrine.x, shrine.z) + 3.5 + Math.sin(elapsed * 1.7 + i) * .12;
            beams[i].rotation.y = elapsed * .5;
            beams[i].visible = !state.stamps.has(shrine.id);
        }
        gate.visible = state.stamps.size < 3;
        envelopes.visible = !state.carrying && !state.completed;
        templeLetter.visible = state.completed;
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        {
            for (let i = 0; i < streamLines.length; i++) streamLines[i].position.z = ((i * 1.65 + elapsed * .35) % 23) - 1;
        }
        renderer.render(scene, camera);
    }
    return {
        courier, render,
        zoom(delta)
        {
            zoom = THREE.MathUtils.clamp(zoom + delta, .8, 1.8);
        },
        dispose()
        {
            observer.disconnect();
            const geometries = new Set();
            const mats = new Set();
            scene.traverse(object =>
            {
                if (object.geometry) geometries.add(object.geometry);
                if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => mats.add(m));
            });
            geometries.forEach(g => g.dispose());
            mats.forEach(m =>
            {
                m.map?.dispose();
                m.dispose();
            });
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        }
    };
}
