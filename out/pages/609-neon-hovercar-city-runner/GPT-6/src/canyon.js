import { WebGLRenderer, FogExp2, PMREMGenerator } from "three";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { track, course, bend } from "./track.js";
import { content } from "./content.js";
import { createSkiff } from "./skiff.js";

export function createCanyon(canvas)
{
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x060b1c, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    const scene = new THREE.Scene();
    scene.fog = new FogExp2(0x13182c, 0.0105);
    const pmrem = new PMREMGenerator(renderer);
    const environment = new THREE.Scene();
    environment.background = new THREE.Color(0x273b63);
    const environmentMap = pmrem.fromScene(environment);
    scene.environment = environmentMap.texture;
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0x7787c5, 0x102034, 2.2));
    const moonlight = new THREE.DirectionalLight(0x73cfff, 3);
    moonlight.position.set(-15, 40, -20);
    scene.add(moonlight);
    const camera = new THREE.PerspectiveCamera(59, 1, 0.1, 400);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.56, 0.6, 0.7);
    composer.addPass(bloom);
    const { car, engines } = createSkiff();
    scene.add(car);
    const road = new THREE.Group();
    scene.add(road);
    const segments = [];
    const matRoad = new THREE.MeshStandardMaterial({ color: 0x122135, roughness: 0.24, metalness: 0.88 });
    const cyan = new THREE.MeshBasicMaterial({ color: 0x40b8d5 });
    const pink = new THREE.MeshBasicMaterial({ color: 0xdf518c });
    for (let index = 0; index < track.viewDistance / track.roadStep; index++)
    {
        const group = new THREE.Group();
        const surface = new THREE.Mesh(new THREE.BoxGeometry(track.roadWidth, 0.2, track.roadStep + 0.15), matRoad);
        surface.position.y = -0.12;
        group.add(surface);
        for (const side of [-1, 1])
        {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.11, track.roadStep), side < 0 ? cyan : pink);
            rail.position.set(side * track.roadWidth / 2, 0.12, 0);
            group.add(rail);
            const wall = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, track.roadStep), new THREE.MeshStandardMaterial({ color: 0x202c40, metalness: 0.6, roughness: 0.5 }));
            wall.position.set(side * 6.65, 0.16, 0);
            group.add(wall);
        }
        for (const x of [-2, 2])
        {
            const line = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 2.4), cyan);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.007, 0);
            group.add(line);
        }
        const reflection = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 3.4), new THREE.MeshBasicMaterial({ color: index % 2 ? 0x1388ad : 0x8c245b, transparent: true, opacity: 0.11 }));
        reflection.rotation.x = -Math.PI / 2;
        reflection.position.set(index % 2 ? -4 : 4, 0.012, 0);
        group.add(reflection);
        segments.push(group);
        road.add(group);
    }
    const towers = [];
    for (let index = 0; index < track.towerCount; index++)
    {
        const group = new THREE.Group();
        const height = 13 + (index * 17 % 42);
        const width = 4 + index % 5;
        const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, 7), new THREE.MeshStandardMaterial({ color: index % 2 ? 0x192136 : 0x22273d, roughness: 0.8, metalness: 0.35 }));
        tower.position.y = height / 2 - 4;
        group.add(tower);
        for (let level = 0; level < height; level += 2.8)
        {
            for (let window = -1; window <= 1; window++)
            {
                if ((index + level + window) % 4 < 1) continue;
                const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.28 + index % 2 * 0.6, 0.45), new THREE.MeshBasicMaterial({ color: index % 4 === 0 ? 0xe7a454 : index % 3 === 0 ? 0xc04b89 : 0x477b96 }));
                pane.position.set(window * 1.4, level - 2, 3.51);
                group.add(pane);
            }
        }
        const edge = new THREE.Mesh(new THREE.BoxGeometry(0.08, height * 0.8, 0.08), index % 2 ? cyan : pink);
        edge.position.set(-width / 2, height / 2 - 4, 3.55);
        group.add(edge);
        group.userData = { side: index % 2 ? -1 : 1, offset: 10 + index % 6 * 4, along: Math.floor(index / 2) * 8 };
        towers.push(group);
        scene.add(group);
    }
    const objects = course.map((item) =>
    {
        const group = new THREE.Group();
        if (item.kind === "crystal")
        {
            group.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0x7affdb, emissive: 0x15dfaf, emissiveIntensity: 2, metalness: 0.4, roughness: 0.2 })));
        }
        else if (item.kind === "drone")
        {
            group.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.45, 0.7), new THREE.MeshStandardMaterial({ color: 0x5f223f, emissive: 0x9f173c, emissiveIntensity: 0.8 })));
            const wings = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.25), pink);
            group.add(wings);
            const eye = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.08), new THREE.MeshBasicMaterial({ color: 0xff4b73 }));
            eye.position.z = 0.38;
            group.add(eye);
        }
        else
        {
            for (const x of [-5.7, 5.7])
            {
                const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 5, 0.25), cyan);
                leg.position.set(x, 1.5, 0);
                group.add(leg);
            }
            const top = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.2, 0.25), cyan);
            top.position.y = 4;
            group.add(top);
        }
        scene.add(group);
        return { item, group };
    });
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const signContext = signCanvas.getContext("2d");
    signContext.fillStyle = "#0e1929";
    signContext.fillRect(0, 0, 1024, 256);
    signContext.fillStyle = "#6fe4eb";
    signContext.font = "600 100px Rajdhani";
    signContext.fillText(content.city.toUpperCase(), 30, 120);
    signContext.font = "500 50px Rajdhani";
    signContext.fillText(content.destination.toUpperCase() + "  ↗", 34, 200);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
    sign.position.set(1, 8, -65);
    scene.add(sign);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(11, 64), new THREE.MeshBasicMaterial({ color: 0x9b879b, transparent: true, opacity: 0.22, fog: false }));
    moon.position.set(30, 29, -220);
    scene.add(moon);
    const berth = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 25), matRoad);
    deck.position.y = 0.07;
    berth.add(deck);
    const landingRing = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.3, 48), cyan);
    landingRing.rotation.x = -Math.PI / 2;
    landingRing.position.y = 0.24;
    berth.add(landingRing);
    const berthCanvas = document.createElement("canvas");
    berthCanvas.width = 1024;
    berthCanvas.height = 128;
    const berthContext = berthCanvas.getContext("2d");
    berthContext.font = "600 90px Rajdhani";
    berthContext.textAlign = "center";
    berthContext.fillStyle = "#92f2db";
    berthContext.fillText(content.destination.toUpperCase(), 512, 96);
    const berthSign = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.25), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(berthCanvas), transparent: true }));
    berthSign.position.set(0, 4.5, -9);
    berth.add(berthSign);
    scene.add(berth);
    function resize()
    {
        const phone = innerWidth < 650;
        renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.25 : 1.75));
        renderer.setSize(innerWidth, innerHeight);
        composer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
    }
    resize();
    addEventListener("resize", resize);
    return {
        render(run, input, reduced, time)
        {
            const origin = bend(run.distance);
            for (let index = 0; index < segments.length; index++)
            {
                const ahead = index * track.roadStep - 15 - run.distance % track.roadStep;
                segments[index].position.set(bend(run.distance + ahead) - origin, 0, -ahead);
                segments[index].rotation.y = -Math.atan((bend(run.distance + ahead + 1) - bend(run.distance + ahead - 1)) / 2);
            }
            for (const tower of towers)
            {
                const ahead = (tower.userData.along - run.distance * 0.7) % 336;
                const distance = (ahead + 336) % 336 - 30;
                tower.position.set(bend(run.distance + distance) - origin + tower.userData.side * tower.userData.offset, 0, -distance);
            }
            for (const { item, group } of objects)
            {
                const ahead = item.distance - run.distance;
                group.visible = ahead > -8 && ahead < track.viewDistance && !run.passed.has(item.id);
                if (!group.visible) continue;
                group.position.set(bend(item.distance) - origin + item.x, item.kind === "arch" ? 0 : 1.3, -ahead);
                if (item.kind === "crystal" && !reduced) group.rotation.y = time * 0.8;
            }
            const phone = innerWidth < 650;
            if (phone && run.phase !== "running")
            {
                camera.setViewOffset(innerWidth, innerHeight, 0, innerHeight * 0.29, innerWidth, innerHeight);
            }
            else camera.clearViewOffset();
            car.position.x = run.x;
            berth.position.set(bend(track.length) - origin, 0, -(track.length - run.distance));
            berth.visible = track.length - run.distance < track.viewDistance;
            car.position.y = track.hover + (reduced ? 0 : Math.sin(time * 2) * 0.04);
            car.rotation.z = reduced ? 0 : (Number(input.left) - Number(input.right)) * 0.13;
            for (const engine of engines) engine.scale.y = input.boost && run.phase === "running" && run.surge > 1 ? 2 : 0.6;
            camera.position.set(run.x * 0.3 + (phone ? 0 : -0.1), phone ? 6.1 : 5.1, phone ? 13 : 11.6);
            camera.lookAt(run.x * 0.12, 1.4, -26);
            bloom.strength = reduced ? 0.24 : 0.52;
            composer.render();
        },
        dispose()
        {
            removeEventListener("resize", resize);
            environmentMap.dispose();
            composer.dispose();
            renderer.dispose();
            scene.traverse((object) =>
            {
                object.geometry?.dispose();
                const materials = object.material ? [].concat(object.material) : [];
                for (const material of materials) material.dispose();
            });
        }
    };
}
