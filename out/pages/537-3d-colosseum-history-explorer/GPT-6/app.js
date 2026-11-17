import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { content } from "./content.js";

const $ = (id) => document.getElementById(id);
for (const node of document.querySelectorAll("[data-copy]"))
{
    node.textContent = content[node.dataset.copy];
}
for (const node of document.querySelectorAll("[data-label]"))
{
    node.setAttribute("aria-label", content[node.dataset.label]);
}
$("source-link").href = content.sourceUrl;
$("credit").href = content.creditUrl;

let renderer;
let camera;
let controls;
let scene;
let cutaway = false;
let time = 100;
let selected = null;
let tourRunning = false;
let tourIndex = -1;
let tourTimer;
let cameraMove;
let lastFrame = 0;
let frameId;
const sectors = [];
const arenaFloors = [];
const underground = new THREE.Group();
const markers = [];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const diagnostics = {
    ready: false,
    technology: "Three.js procedural WebGL 2",
    cutaway: false,
    time: 100,
    selected: null,
    visibleFacadeBays: 0,
    visibleSeatSections: 0,
    undergroundVisible: true,
    frames: 0,
    camera: []
};
window.exhibitDiagnostics = diagnostics;

function showDetail(item)
{
    $("detail-kicker").textContent = item.kicker;
    $("detail-title").textContent = item.title;
    $("detail-copy").textContent = item.text;
    $("detail-fact").textContent = item.fact;
}
showDetail(content.overview);

for (const [index, item] of content.hotspots.entries())
{
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot-button";
    button.dataset.hotspot = item.id;
    button.setAttribute("aria-pressed", "false");
    const number = document.createElement("span");
    number.className = "number";
    number.textContent = item.number;
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const subtitle = document.createElement("small");
    subtitle.textContent = item.short;
    copy.append(title, subtitle);
    const arrow = document.createElement("span");
    arrow.className = "hotspot-arrow";
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    button.append(number, copy, arrow);
    button.addEventListener("click", () => selectHotspot(index, false));
    $("hotspot-list").append(button);

    const marker = document.createElement("button");
    marker.className = "model-hotspot";
    marker.textContent = item.number;
    marker.setAttribute("aria-label", item.title);
    marker.setAttribute("aria-pressed", "false");
    marker.addEventListener("click", () => selectHotspot(index, false));
    $("hotspot-layer").append(marker);
    markers.push({ node: marker, position: new THREE.Vector3(...item.target) });
}

for (const state of content.states)
{
    const tick = document.createElement("button");
    tick.type = "button";
    tick.textContent = state.tick;
    tick.dataset.time = state.value;
    tick.addEventListener("click", () =>
    {
        pauseTour();
        $("time").value = state.value;
        applyTime(Number(state.value));
    });
    $("timeline-ticks").append(tick);
}

function stopCamera()
{
    cameraMove = null;
}

function pauseTour()
{
    clearTimeout(tourTimer);
    if (tourRunning)
    {
        $("tour-status").textContent = content.tourStopped;
    }
    tourRunning = false;
    $("tour-text").textContent = tourIndex >= 0 && tourIndex < 3 ? content.nextTour : content.startTour;
}

function moveCamera(position, look)
{
    if (!camera) return;
    const to = new THREE.Vector3(...position);
    const target = new THREE.Vector3(...look);
    if (camera.aspect < 1.1)
    {
        to.sub(target).multiplyScalar(1.2).add(target);
    }
    if (reducedMotion)
    {
        camera.position.copy(to);
        controls.target.copy(target);
        controls.update();
        return;
    }
    cameraMove = {
        from: camera.position.clone(),
        fromTarget: controls.target.clone(),
        to,
        target,
        start: performance.now(),
        duration: 1000
    };
}

function selectHotspot(index, fromTour)
{
    if (!fromTour) pauseTour();
    const item = content.hotspots[index];
    selected = item.id;
    diagnostics.selected = selected;
    for (const button of document.querySelectorAll(".hotspot-button"))
    {
        const active = button.dataset.hotspot === selected;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    }
    for (const [i, marker] of markers.entries())
    {
        marker.node.classList.toggle("active", i === index);
        marker.node.setAttribute("aria-pressed", String(i === index));
    }
    if ((item.id === "service" || item.id === "arena") && time < 66)
    {
        $("time").value = 66;
        applyTime(66);
    }
    setCutaway(item.cut);
    showDetail(item);
    moveCamera(item.camera, item.look);
}

function tourStep()
{
    tourIndex += 1;
    if (tourIndex >= content.hotspots.length)
    {
        tourRunning = false;
        tourIndex = -1;
        $("tour-text").textContent = content.startTour;
        $("tour-status").textContent = content.tourDone;
        return;
    }
    selectHotspot(tourIndex, true);
    $("tour-status").textContent = content.tourStep.replace("{step}", tourIndex + 1) + " · " + content.hotspots[tourIndex].title;
    tourTimer = setTimeout(tourStep, 6500);
}

$("tour").addEventListener("click", () =>
{
    if (tourRunning)
    {
        pauseTour();
        stopCamera();
        return;
    }
    tourRunning = true;
    $("tour-text").textContent = content.stopTour;
    if (tourIndex === 3) tourIndex = -1;
    tourStep();
});

function setCutaway(value)
{
    cutaway = value;
    diagnostics.cutaway = value;
    $("cutaway").setAttribute("aria-pressed", String(value));
    $("cutaway").querySelector("span").textContent = value ? content.cutawayActive : content.cutaway;
    updateGeometry();
}

function updateGeometry()
{
    let facadeCount = 0;
    let seatCount = 0;
    for (const part of sectors)
    {
        const removed = cutaway && part.sector >= 0 && part.sector < 16;
        const weatherMissing = time > 66 && part.weather < (time - 66) / 34;
        part.mesh.visible = !removed && time >= part.begins && !weatherMissing;
        if (part.mesh.visible && part.kind === "facade") facadeCount += 1;
        if (part.mesh.visible && part.kind === "seat") seatCount += 1;
    }
    for (const floor of arenaFloors)
    {
        floor.visible = time >= 25 && (!cutaway || floor.userData.rear);
    }
    underground.visible = time >= 66;
    diagnostics.visibleFacadeBays = facadeCount;
    diagnostics.visibleSeatSections = seatCount;
    diagnostics.undergroundVisible = underground.visible;
    diagnostics.visibleArenaSections = arenaFloors.filter((floor) => floor.visible).length;
}

function applyTime(value)
{
    time = value;
    diagnostics.time = value;
    const index = value < 25 ? 0 : value < 58 ? 1 : value <= 75 ? 2 : 3;
    const state = content.states[index];
    $("state-name").textContent = state.name;
    $("state-date").textContent = state.date;
    $("state-description").textContent = state.text;
    $("time").setAttribute("aria-valuetext", state.date + ": " + state.name);
    for (const tick of document.querySelectorAll("[data-time]"))
    {
        const active = Number(tick.dataset.time) === state.value;
        tick.classList.toggle("active", active);
        tick.setAttribute("aria-pressed", String(active));
    }
    updateGeometry();
}
$("time").addEventListener("input", (event) =>
{
    pauseTour();
    applyTime(Number(event.target.value));
});
$("cutaway").addEventListener("click", () =>
{
    pauseTour();
    setCutaway(!cutaway);
});

function zoom(factor)
{
    if (!camera) return;
    pauseTour();
    stopCamera();
    const offset = camera.position.clone().sub(controls.target);
    const length = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(offset.setLength(length));
    controls.update();
}
$("zoom-in").addEventListener("click", () => zoom(0.85));
$("zoom-out").addEventListener("click", () => zoom(1.18));
$("reset").addEventListener("click", () =>
{
    pauseTour();
    selected = null;
    diagnostics.selected = null;
    tourIndex = -1;
    $("tour-status").textContent = "";
    $("tour-text").textContent = content.startTour;
    for (const node of document.querySelectorAll(".hotspot-button, .model-hotspot"))
    {
        node.classList.remove("active");
        node.setAttribute("aria-pressed", "false");
    }
    showDetail(content.overview);
    setCutaway(false);
    moveCamera([20, 17, 23], [0, 1.3, 0]);
});

function stoneTexture()
{
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#d2bd94";
    ctx.fillRect(0, 0, 128, 128);
    let seed = 41;
    for (let i = 0; i < 2700; i += 1)
    {
        seed = (seed * 16807) % 2147483647;
        const x = seed % 128;
        seed = (seed * 16807) % 2147483647;
        const y = seed % 128;
        ctx.fillStyle = i % 2 ? "#ac966533" : "#f7eaca55";
        ctx.fillRect(x, y, 1, 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function wedge(rx, rz, innerX, innerZ, a, b, height)
{
    const shape = new THREE.Shape();
    const points = [];
    const subdivisions = Math.max(4, Math.ceil((b - a) * 16));
    for (let i = 0; i <= subdivisions; i += 1)
    {
        const angle = a + (b - a) * i / subdivisions;
        points.push([Math.cos(angle) * rx, -Math.sin(angle) * rz]);
    }
    for (let i = subdivisions; i >= 0; i -= 1)
    {
        const angle = a + (b - a) * i / subdivisions;
        points.push([Math.cos(angle) * innerX, -Math.sin(angle) * innerZ]);
    }
    shape.moveTo(...points[0]);
    for (const point of points.slice(1)) shape.lineTo(...point);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
        curveSegments: 4
    });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
}

function arcade(width, height, depth)
{
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();
    const hole = new THREE.Path();
    const radius = width * 0.31;
    hole.moveTo(-radius, 0.02);
    hole.lineTo(-radius, height * 0.46);
    hole.absarc(0, height * 0.46, radius, Math.PI, 0, true);
    hole.lineTo(radius, 0.02);
    hole.closePath();
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 10
    });
}

function addPart(mesh, sector, begins, weather, kind)
{
    scene.add(mesh);
    sectors.push({ mesh, sector, begins, weather, kind });
    return mesh;
}

function radialSupport(length)
{
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(length, 0);
    shape.lineTo(length, 4.05);
    shape.lineTo(0, 0.87);
    shape.closePath();
    for (const [x, radius, spring] of [[length * 0.3, 0.38, 0.6], [length * 0.72, 0.46, 1.1]])
    {
        const arch = new THREE.Path();
        arch.moveTo(x - radius, 0.05);
        arch.lineTo(x - radius, spring);
        arch.absarc(x, spring, radius, Math.PI, 0, true);
        arch.lineTo(x + radius, 0.05);
        arch.closePath();
        shape.holes.push(arch);
    }
    return new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false, curveSegments: 8 });
}

function makeModel()
{
    const texture = stoneTexture();
    const stone = new THREE.MeshStandardMaterial({ color: "#e5d8b7", map: texture, roughness: 0.94 });
    const paleStone = new THREE.MeshStandardMaterial({ color: "#c2b08c", roughness: 1 });
    const darkStone = new THREE.MeshStandardMaterial({ color: "#978567", roughness: 1 });
    const arena = new THREE.MeshStandardMaterial({ color: "#d7c8a8", roughness: 1 });
    const floor = new THREE.MeshStandardMaterial({ color: "#8c8065", roughness: 1 });
    const total = 64;
    for (let i = 0; i < total; i += 1)
    {
        const a = i / total * Math.PI * 2;
        const b = (i + 1) / total * Math.PI * 2;
        const center = (a + b) / 2;
        const front = i < 30;
        const foundation = new THREE.Mesh(wedge(9.8, 8.15, 4.9, 2.8, a, b, 0.3), darkStone);
        foundation.position.y = -0.85;
        foundation.receiveShadow = true;
        addPart(foundation, i, 0, 2, "foundation");

        if (i % 2 === 0)
        {
            const inner = new THREE.Vector3(Math.cos(a) * 5.55, -0.5, Math.sin(a) * 3.3);
            const outer = new THREE.Vector3(Math.cos(a) * 9.12, -0.5, Math.sin(a) * 7.4);
            const direction = outer.clone().sub(inner);
            const support = new THREE.Mesh(radialSupport(direction.length()), paleStone);
            support.position.copy(inner);
            support.rotation.y = -Math.atan2(direction.z, direction.x);
            support.castShadow = true;
            support.receiveShadow = true;
            addPart(support, i, 24 + (i % 5), 2, "radial-support");
        }

        for (let level = 0; level < 3; level += 1)
        {
            const rx = 9.6 - level * 0.09;
            const rz = 7.9 - level * 0.09;
            const width = Math.hypot(Math.sin(center) * rx, Math.cos(center) * rz) * (b - a);
            const wall = new THREE.Mesh(arcade(width + 0.025, 1.3, 0.32), stone);
            const rotation = Math.atan2(Math.cos(center) / rx, Math.sin(center) / rz);
            wall.position.set(Math.cos(center) * rx, level * 1.47 - 0.5, Math.sin(center) * rz);
            wall.rotation.y = rotation;
            wall.castShadow = true;
            wall.receiveShadow = true;
            const weather = front && level > 0 ? 0.32 + ((i * 7) % 19) / 35 : 2;
            addPart(wall, i, 15 + level * 15 + (i % 5), weather, "facade");

            const band = new THREE.Mesh(wedge(rx + 0.23, rz + 0.23, rx - 0.32, rz - 0.32, a, b, 0.16), paleStone);
            band.position.y = level * 1.47 + 0.8;
            band.castShadow = true;
            addPart(band, i, 18 + level * 15 + (i % 5), weather, "band");

            const column = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 1.19, 6), paleStone);
            column.position.set(Math.cos(a) * (rx + 0.25), level * 1.47 + 0.07, Math.sin(a) * (rz + 0.25));
            column.castShadow = true;
            addPart(column, i, 15 + level * 15 + (i % 5), weather, "column");
        }

        const attic = new THREE.Mesh(wedge(9.42, 7.72, 9.05, 7.35, a, b, 0.85), stone);
        attic.position.y = 3.91;
        attic.castShadow = true;
        addPart(attic, i, 57 + (i % 7), front ? 0.3 : 2, "attic");
        const cornice = new THREE.Mesh(wedge(9.57, 7.86, 8.98, 7.28, a, b, 0.13), paleStone);
        cornice.position.y = 4.76;
        addPart(cornice, i, 62, front ? 0.3 : 2, "cornice");
        if (i % 2 === 0)
        {
            const window = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.27, 0.03), darkStone);
            window.position.set(Math.cos(center) * 9.63, 4.35, Math.sin(center) * 7.89);
            window.rotation.y = Math.atan2(Math.cos(center) / 9.42, Math.sin(center) / 7.72);
            addPart(window, i, 57 + (i % 7), front ? 0.3 : 2, "window");
        }

        for (let row = 0; row < 15; row += 1)
        {
            const t = row / 15;
            const rx = 5.55 + t * 3.1;
            const rz = 3.3 + t * 3.6;
            const gap = i % 8 === 0 ? 0.013 : 0.002;
            const seat = new THREE.Mesh(wedge(rx + 0.21, rz + 0.24, rx, rz, a + gap, b - gap, 0.19), row % 5 === 0 ? paleStone : stone);
            seat.position.y = 0.43 + row * 0.22;
            seat.castShadow = true;
            seat.receiveShadow = true;
            addPart(seat, i, 14 + row * 2.9, front && row > 10 ? 0.86 : 2, "seat");
        }
        const podium = new THREE.Mesh(wedge(5.57, 3.36, 5.15, 2.95, a, b, 0.63), paleStone);
        podium.position.y = -0.1;
        podium.castShadow = true;
        addPart(podium, i, 20, 2, "podium");
        const arenaPiece = new THREE.Mesh(wedge(5.13, 2.94, 0, 0, a, b, 0.12), arena);
        arenaPiece.position.y = 0.38;
        arenaPiece.receiveShadow = true;
        arenaPiece.userData.rear = i >= 32;
        scene.add(arenaPiece);
        arenaFloors.push(arenaPiece);
    }

    const undergroundFloor = new THREE.Mesh(wedge(5.0, 2.85, 0, 0, 0, Math.PI * 2, 0.09), floor);
    undergroundFloor.position.y = -0.76;
    undergroundFloor.receiveShadow = true;
    underground.add(undergroundFloor);
    for (let lane = -3; lane <= 3; lane += 1)
    {
        const z = lane * 0.64;
        const length = 9.15 * Math.sqrt(1 - (z / 2.8) ** 2);
        const corridor = new THREE.Mesh(new THREE.BoxGeometry(length, 0.73, 0.13), darkStone);
        corridor.position.set(0, -0.35, z);
        corridor.castShadow = true;
        underground.add(corridor);
        for (let cell = -3; cell <= 3; cell += 1)
        {
            if (Math.abs(cell * 1.15) > length / 2 - 0.4) continue;
            const crosswall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.65, 0.52), paleStone);
            crosswall.position.set(cell * 1.15, -0.35, z + 0.28);
            crosswall.castShadow = true;
            underground.add(crosswall);
        }
    }
    for (let shaft = -2; shaft <= 2; shaft += 1)
    {
        const lift = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.82, 0.28), paleStone);
        lift.position.set(shaft * 1.5, -0.27, 1.8);
        underground.add(lift);
    }
    scene.add(underground);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(100, 96), new THREE.MeshStandardMaterial({ color: "#d6d9c5", roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.94;
    ground.receiveShadow = true;
    scene.add(ground);

    const guidePoints = [];
    for (let i = 0; i <= 128; i += 1)
    {
        const angle = i / 128 * Math.PI * 2;
        guidePoints.push(new THREE.Vector3(12.3 * Math.cos(angle), -0.92, 10.15 * Math.sin(angle)));
    }
    const guide = new THREE.Line(new THREE.BufferGeometry().setFromPoints(guidePoints), new THREE.LineDashedMaterial({
        color: "#b0b8a0", dashSize: 0.17, gapSize: 0.2, transparent: true, opacity: 0.5
    }));
    guide.computeLineDistances();
    scene.add(guide);
    diagnostics.proceduralMeshes = sectors.length + arenaFloors.length + underground.children.length;
}

function resize()
{
    if (!renderer) return;
    const bounds = $("canvas-wrap").getBoundingClientRect();
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    renderer.setSize(bounds.width, bounds.height, false);
}

function animate(now)
{
    if (cameraMove)
    {
        const t = Math.min((now - cameraMove.start) / cameraMove.duration, 1);
        const ease = t * t * (3 - 2 * t);
        camera.position.lerpVectors(cameraMove.from, cameraMove.to, ease);
        controls.target.lerpVectors(cameraMove.fromTarget, cameraMove.target, ease);
        if (t === 1) cameraMove = null;
    }
    controls.update();
    renderer.render(scene, camera);
    for (const [index, marker] of markers.entries())
    {
        const point = marker.position.clone().project(camera);
        const visible = point.z > -1 && point.z < 1 && Math.abs(point.x) < 0.94 && Math.abs(point.y) < 0.88 &&
            (index !== 3 || (underground.visible && cutaway)) &&
            (index !== 2 || time >= 25) &&
            (index !== 1 || time >= 20);
        marker.node.hidden = !visible;
        marker.node.style.left = (point.x + 1) * 50 + "%";
        marker.node.style.top = (-point.y + 1) * 50 + "%";
    }
    if (now - lastFrame > 150)
    {
        diagnostics.camera = camera.position.toArray();
        diagnostics.target = controls.target.toArray();
        lastFrame = now;
    }
    diagnostics.frames += 1;
    frameId = requestAnimationFrame(animate);
}

try
{
    renderer = new THREE.WebGLRenderer({ canvas: $("model"), antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#e8e8da");
    scene.fog = new THREE.Fog("#e8e8da", 45, 75);
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(20, 17, 23);
    controls = new OrbitControls(camera, $("model"));
    controls.target.set(0, 1.3, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.enablePan = false;
    controls.minDistance = 13;
    controls.maxDistance = 52;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.addEventListener("start", () =>
    {
        pauseTour();
        stopCamera();
    });
    scene.add(new THREE.HemisphereLight("#fff6e1", "#787c67", 2.5));
    const sunlight = new THREE.DirectionalLight("#ffefd0", 3.2);
    sunlight.position.set(-12, 23, 14);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(2048, 2048);
    Object.assign(sunlight.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 0.1, far: 60 });
    sunlight.shadow.bias = -0.0008;
    sunlight.shadow.normalBias = 0.04;
    scene.add(sunlight);
    const fill = new THREE.DirectionalLight("#e8efdb", 0.7);
    fill.position.set(13, 9, -10);
    scene.add(fill);
    makeModel();
    applyTime(100);
    resize();
    if (camera.aspect < 1.1)
    {
        camera.position.sub(controls.target).multiplyScalar(1.2).add(controls.target);
    }
    controls.update();
    new ResizeObserver(resize).observe($("canvas-wrap"));
    diagnostics.ready = true;
    animate(performance.now());
    $("model").addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home", "Escape"].includes(event.key)) return;
        event.preventDefault();
        pauseTour();
        stopCamera();
        if (event.key === "Home")
        {
            $("reset").click();
            return;
        }
        if (event.key === "Escape") return;
        if (["+", "=", "-"].includes(event.key))
        {
            zoom(event.key === "-" ? 1.18 : 0.85);
            return;
        }
        const offset = camera.position.clone().sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        if (event.key === "ArrowLeft") spherical.theta -= 0.13;
        if (event.key === "ArrowRight") spherical.theta += 0.13;
        if (event.key === "ArrowUp") spherical.phi -= 0.1;
        if (event.key === "ArrowDown") spherical.phi += 0.1;
        spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
        controls.update();
    });
}
catch
{
    $("webgl-status").hidden = false;
    $("webgl-status").textContent = content.webglError;
    diagnostics.ready = false;
    for (const marker of markers) marker.node.hidden = true;
}
window.addEventListener("pagehide", () =>
{
    clearTimeout(tourTimer);
    cancelAnimationFrame(frameId);
    controls?.dispose();
    renderer?.dispose();
});
