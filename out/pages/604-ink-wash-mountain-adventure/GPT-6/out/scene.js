import * as THREE from "./vendor/three.module.js";
import { CONTENT, STORAGE_KEY, trailX, trailY } from "./content.js";
import { inkMaterial } from "./shader.js";
import { makeTerrain } from "./terrain.js";
import { makeWeather } from "./weather.js";

export function createScene(canvas)
{
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor("#e4e6d9");
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, .1, 240);
    const seed = [...STORAGE_KEY].reduce((a, c) => a * 31 + c.charCodeAt(0), 0) >>> 0;
    makeTerrain(scene, seed);
    const weather = makeWeather(scene, seed + 1);
    const wood = inkMaterial("#756d50");
    const black = inkMaterial("#2f4841");
    const paper = inkMaterial("#d9d3bb");
    const rust = inkMaterial("#a7543a");
    const lightWood = inkMaterial("#b9a875");
    const cylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
    const box = new THREE.BoxGeometry(1, 1, 1);
    const sphere = new THREE.SphereGeometry(1, 10, 7);
    const hat = new THREE.ConeGeometry(.58, .24, 12);
    function piece(group, geometry, material, position, scale)
    {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        group.add(mesh);
        return mesh;
    }
    const player = new THREE.Group();
    const robe = piece(player, new THREE.ConeGeometry(.37, .95, 9), rust, [0, .85, 0], [1, 1, 1]);
    piece(player, sphere, paper, [0, 1.52, 0], [.18, .22, .18]);
    piece(player, hat, paper, [0, 1.73, 0], [1, 1, 1]);
    piece(player, cylinder, black, [0, 1.6, 0], [.21, .08, .21]);
    const legs =
    [
        piece(player, cylinder, black, [-.13, .26, 0], [.08, .46, .08]),
        piece(player, cylinder, black, [.13, .26, 0], [.08, .46, .08])
    ];
    const arm = piece(player, cylinder, rust, [-.33, 1.1, 0], [.085, .54, .085]);
    arm.rotation.z = -.25;
    const strikeArm = piece(player, cylinder, rust, [.34, 1.12, 0], [.09, .6, .09]);
    strikeArm.rotation.z = .3;
    piece(player, box, paper, [0, 1.1, -.28], [.33, .05, .09]);
    scene.add(player);
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: "#263f36", transparent: true, opacity: .17, depthWrite: false });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(.65, 20), shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);
    const strokeMaterial = new THREE.MeshBasicMaterial({ color: "#f7f1cf", side: THREE.DoubleSide, transparent: true, opacity: .7 });
    const stroke = new THREE.Mesh(new THREE.TorusGeometry(1, .025, 3, 32, Math.PI * 1.3), strokeMaterial);
    stroke.rotation.x = -Math.PI / 2;
    player.add(stroke);
    stroke.position.y = .8;
    const guardianVisuals = CONTENT.guardians.map((data, index) =>
    {
        const group = new THREE.Group();
        group.position.set(trailX(data.z), trailY(data.z), data.z);
        piece(group, cylinder, black, [0, .1, 0], [1.1, .2, 1.1]);
        piece(group, cylinder, wood, [0, 1, 0], [.22, 1.8, .22]);
        const body = piece(group, cylinder, index === 1 ? black : lightWood, [0, 1.4, 0], [.43, .9, .43]);
        piece(group, sphere, lightWood, [0, 2.12, 0], [.3, .32, .3]);
        piece(group, hat, black, [0, 2.43, 0], [1.35, 1.2, 1.35]);
        const arms = piece(group, cylinder, wood, [0, 1.65, 0], [.105, 2.3, .105]);
        arms.rotation.z = Math.PI / 2;
        piece(group, box, rust, [0, 1.5, .435], [.15, .55, .02]);
        const ribbon = piece(group, box, rust, [1.03, 1.37, 0], [.12, .62, .05]);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: "#b45940", transparent: true, opacity: .0, side: THREE.DoubleSide, depthWrite: false });
        function groundGeometry(geometry)
        {
            geometry.rotateX(-Math.PI / 2);
            const positions = geometry.attributes.position;
            for (let i = 0; i < positions.count; i++)
            {
                positions.setY(i, trailY(data.z + 1 + positions.getZ(i)) - trailY(data.z) + .25);
            }
            return geometry;
        }
        const ring = new THREE.Mesh(groundGeometry(new THREE.RingGeometry(4.5, 4.65, 64)), ringMaterial);
        ring.position.set(trailX(data.z), trailY(data.z), data.z + 1);
        const fill = new THREE.Mesh(groundGeometry(new THREE.CircleGeometry(4.6, 64)), new THREE.MeshBasicMaterial({ color: "#bb5b42", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
        fill.position.copy(ring.position);
        fill.position.y -= .02;
        const gate = new THREE.Group();
        gate.position.set(trailX(data.z - 5), trailY(data.z - 5), data.z - 5);
        for (const x of [-3.6, 3.6])
        {
            piece(gate, cylinder, black, [x, 1.85, 0], [.15, 3.7, .15]);
            piece(gate, box, paper, [x, 2.8, .19], [.25, .6, .05]);
        }
        piece(gate, cylinder, wood, [0, 3.7, 0], [.15, 7.7, .15]).rotation.z = Math.PI / 2;
        const barrier = piece(gate, box, rust, [0, 1, 0], [7, .06, .06]);
        for (let n = -2; n <= 2; n++)
        {
            piece(gate, box, paper, [n * 1.1, .83, 0], [.18, .38, .025]).rotation.z = n * .12;
        }
        scene.add(group, ring, fill, gate);
        return { group, body, arms, ring, fill, ringMaterial, gate, barrier, ribbon };
    });
    const summit = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.35, 64), black);
    summit.rotation.x = -Math.PI / 2;
    summit.position.set(0, trailY(-89) + .2, -89);
    scene.add(summit);
    for (const x of [-3.2, 3.2])
    {
        const lantern = new THREE.Group();
        lantern.position.set(x, trailY(-89), -89);
        piece(lantern, box, black, [0, .7, 0], [.13, 1.4, .13]);
        piece(lantern, box, paper, [0, 1.5, 0], [.45, .5, .45]);
        piece(lantern, new THREE.ConeGeometry(.47, .24, 4), black, [0, 1.85, 0], [1, 1, 1]);
        scene.add(lantern);
    }
    const point = new THREE.Vector3();
    const cameraGoal = new THREE.Vector3();
    const lookGoal = new THREE.Vector3();
    let firstFrame = true;
    let mobile = false;
    function resize()
    {
        mobile = innerWidth <= 800;
        camera.aspect = innerWidth / innerHeight;
        camera.fov = mobile ? 53 : 43;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight, false);
    }
    resize();
    window.addEventListener("resize", resize);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, .075).normalize(), 0);
    return {
        clickPoint(clientX, clientY)
        {
            mouse.set(clientX / innerWidth * 2 - 1, -clientY / innerHeight * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            if (!raycaster.ray.intersectPlane(ground, point)) return null;
            return { x: point.x, z: point.z };
        },
        render(state, time)
        {
            const p = state.player;
            player.position.set(p.x, trailY(p.z) + .16, p.z);
            player.rotation.y = p.facing;
            player.rotation.z = p.dodge > 0 ? Math.sin(p.dodge * 6.3) * .7 : 0;
            const walk = p.walking ? Math.sin(time * 13) * .45 : 0;
            legs[0].rotation.x = walk;
            legs[1].rotation.x = -walk;
            robe.rotation.z = Math.sin(time * 2) * .03;
            strikeArm.rotation.x = p.swing > 0 ? -1.5 + Math.sin(p.swing * 16) : .1;
            player.visible = !(p.invulnerable > .6 && Math.floor(time * 14) % 2);
            stroke.visible = p.swing > 0;
            stroke.rotation.z = p.swing * 20;
            shadow.position.set(p.x, trailY(p.z) + .17, p.z);
            cameraGoal.set(trailX(p.z) + (mobile ? 6.5 : 12), trailY(p.z) + (mobile ? 15 : 14), p.z + (mobile ? 20 : 22));
            lookGoal.set(trailX(p.z - 10) - (mobile ? .6 : 1.7), trailY(p.z - 10) + .5, p.z - (mobile ? 2 : 10));
            camera.position.lerp(cameraGoal, firstFrame ? 1 : .065);
            camera.lookAt(lookGoal);
            firstFrame = false;
            state.guardians.forEach((g, index) =>
            {
                const v = guardianVisuals[index];
                v.group.rotation.y = g.phase === "sweep" ? g.phaseTime * Math.PI * 10 : 0;
                v.body.rotation.z = g.hit > 0 ? Math.sin(g.hit * 35) * .15 : 0;
                v.ribbon.rotation.x = Math.sin(time * 2.7 + index) * .3;
                v.arms.rotation.y = g.phase === "telegraph" ? g.phaseTime * .4 : 0;
                v.group.rotation.z = g.resolved ? .12 : 0;
                v.ringMaterial.opacity = g.resolved ? 0 : g.phase === "telegraph" ? .75 : g.phase === "sweep" ? 1 : 0;
                v.fill.material.opacity = g.resolved ? 0 : g.phase === "telegraph" ? .045 + g.phaseTime / g.windup * .09 : g.phase === "sweep" ? .23 : 0;
                const ringScale = g.phase === "telegraph" ? 1 - g.phaseTime / g.windup * .16 : 1;
                v.ring.scale.set(ringScale, 1, ringScale);
                v.gate.children.forEach((child, childIndex) =>
                {
                    if (childIndex >= 5) child.visible = !g.resolved;
                });
            });
            weather.update(time, p);
            renderer.render(scene, camera);
            const index = state.guardians.findIndex((g) => !g.resolved);
            if (index >= 0)
            {
                const g = state.guardians[index];
                point.set(trailX(g.z), trailY(g.z) + 3.4, g.z).project(camera);
                return { x: (point.x * .5 + .5) * innerWidth, y: (-point.y * .5 + .5) * innerHeight, visible: point.z < 1 && Math.abs(p.z - g.z) < 21 };
            }
            return null;
        },
        dispose()
        {
            window.removeEventListener("resize", resize);
            const geometries = new Set();
            const materials = new Set();
            scene.traverse((object) =>
            {
                if (object.geometry) geometries.add(object.geometry);
                if (object.material) materials.add(object.material);
            });
            geometries.forEach((geometry) => geometry.dispose());
            materials.forEach((material) => material.dispose());
            renderer.dispose();
            renderer.forceContextLoss();
        }
    };
}
