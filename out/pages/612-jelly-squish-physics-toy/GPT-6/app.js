import * as THREE from "./vendor/three.module.min.js";
import { BRAND, ACCENT, FLAVORS, CONTENT } from "./content.js";

document.title = BRAND;
document.documentElement.style.setProperty("--accent", ACCENT);
document.querySelectorAll("[data-copy]").forEach((element) =>
{
    element.textContent = CONTENT[element.dataset.copy];
});
const stage = document.querySelector("#stage");
stage.setAttribute("aria-label", CONTENT.stage);
document.querySelector(".controls").setAttribute("aria-label", CONTENT.controls);
const announcement = document.querySelector("#announcement");
const credit = document.querySelector("#credit");
credit.textContent = CONTENT.credit;
credit.href = CONTENT.creditUrl;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const stateLabel = document.querySelector("#state");
const stiffness = document.querySelector("#stiffness");
let feel = Number(stiffness.value) / 100;
let flavor = 0;
let sound = false;
let audio;
let master;
let lastSound = 0;

function squelch(intensity = 0.6)
{
    if (!sound || !audio || audio.state !== "running" || audio.currentTime - lastSound < 0.09) return;
    const now = audio.currentTime;
    lastSound = now;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(Math.min(0.14, 0.045 + intensity * 0.07), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    gain.connect(master);
    const oscillator = audio.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(160 + intensity * 80, now);
    oscillator.frequency.exponentialRampToValueAtTime(48, now + 0.21);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.2), audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * 0.6;
    const noise = audio.createBufferSource();
    noise.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1300, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.2);
    filter.Q.value = 2;
    noise.connect(filter).connect(gain);
    noise.start(now);
    noise.stop(now + 0.21);
    oscillator.onended = () => oscillator.disconnect();
    noise.onended = () =>
    {
        noise.disconnect();
        filter.disconnect();
        gain.disconnect();
    };
}

document.querySelector("#sound").addEventListener("click", async (event) =>
{
    const button = event.currentTarget;
    try
    {
        if (!audio)
        {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) throw Error("Audio unavailable");
            audio = new Audio();
            master = audio.createDynamicsCompressor();
            master.threshold.value = -16;
            master.ratio.value = 8;
            master.connect(audio.destination);
        }
        sound = !sound;
        if (sound) await audio.resume();
        else await audio.suspend();
        button.setAttribute("aria-pressed", String(sound));
        button.querySelector("span").textContent = sound ? CONTENT.soundOn : CONTENT.soundOff;
        if (sound) squelch(0.2);
    }
    catch
    {
        sound = false;
        button.setAttribute("aria-pressed", "false");
        button.querySelector("span").textContent = CONTENT.soundUnavailable;
    }
});

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.5 : 1.75));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.94;
stage.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color("#faf4e9");
const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
camera.position.set(3.6, 2.95, 5.3);
camera.lookAt(0, 0.85, 0);
const light = new THREE.DirectionalLight(0xfff6e5, 3.2);
light.position.set(-3, 6, 4);
light.intensity = 2.4;
scene.add(light);
const rim = new THREE.DirectionalLight(0xffe6d4, 1.9);
rim.position.set(4, 3, -3);
scene.add(rim, new THREE.HemisphereLight(0xfff8ee, 0xbe9473, 1.3));

const reflection = document.createElement("canvas");
reflection.width = 1024;
reflection.height = 512;
const brush = reflection.getContext("2d");
const environmentGradient = brush.createLinearGradient(0, 0, 0, 512);
environmentGradient.addColorStop(0, "#eee0cf");
environmentGradient.addColorStop(0.5, "#e9d8c6");
environmentGradient.addColorStop(1, "#9b7d65");
brush.fillStyle = environmentGradient;
brush.fillRect(0, 0, 1024, 512);
brush.fillStyle = "#fffdf3";
brush.fillRect(160, 45, 170, 190);
brush.fillRect(640, 90, 50, 180);
const reflectionTexture = new THREE.CanvasTexture(reflection);
reflectionTexture.mapping = THREE.EquirectangularReflectionMapping;
const pmrem = new THREE.PMREMGenerator(renderer);
const environment = pmrem.fromEquirectangular(reflectionTexture);
scene.environment = environment.texture;
reflectionTexture.dispose();
pmrem.dispose();

const plateMaterial = new THREE.MeshPhysicalMaterial(
{
    color: 0xfffaf0,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.12
});
const profile =
[
    [0, 0], [1.35, 0], [1.58, 0.025], [1.86, 0.095], [2, 0.18],
    [2.01, 0.21], [1.98, 0.24], [1.89, 0.23], [1.72, 0.17],
    [1.5, 0.12], [0, 0.12]
].map(([x, y]) => new THREE.Vector2(x, y));
const plate = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), plateMaterial);
scene.add(plate);
const rimMaterial = new THREE.MeshBasicMaterial({ color: 0xe9dfd1 });
for (const radius of [1.77, 1.94])
{
    const edge = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 8, 128), rimMaterial);
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = radius === 1.77 ? 0.216 : 0.265;
    scene.add(edge);
}
const shadowCanvas = document.createElement("canvas");
shadowCanvas.width = shadowCanvas.height = 128;
const shadowBrush = shadowCanvas.getContext("2d");
const shadowGradient = shadowBrush.createRadialGradient(64, 64, 8, 64, 64, 64);
shadowGradient.addColorStop(0, "rgba(91,58,37,.28)");
shadowGradient.addColorStop(0.55, "rgba(91,58,37,.13)");
shadowGradient.addColorStop(1, "rgba(91,58,37,0)");
shadowBrush.fillStyle = shadowGradient;
shadowBrush.fillRect(0, 0, 128, 128);
const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 4.5),
    new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -0.015;
scene.add(shadow);
const contact = new THREE.Mesh(new THREE.CircleGeometry(1.47, 64),
    new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }));
contact.rotation.x = -Math.PI / 2;
contact.position.y = 0.126;
scene.add(contact);

const RINGS = 19;
const SEGMENTS = 48;
const FLOOR = 0.145;
const rest = [];
for (let ring = 0; ring < RINGS; ring++)
{
    const latitude = (ring / RINGS) * Math.PI / 2;
    const radius = 1.23 * Math.pow(Math.cos(latitude), 0.62);
    for (let segment = 0; segment < SEGMENTS; segment++)
    {
        const angle = segment / SEGMENTS * Math.PI * 2;
        const flute = 1 + 0.07 * Math.cos(angle * 12) * Math.pow(Math.cos(latitude), 0.35);
        const r = radius * flute;
        rest.push(r * Math.cos(angle),
            FLOOR + 1.63 * Math.sin(latitude) - 0.065 * Math.exp(-r * r / 0.16),
            r * Math.sin(angle));
    }
}
const bottom = rest.length / 3;
rest.push(0, FLOOR, 0);
const top = rest.length / 3;
rest.push(0, FLOOR + 1.56, 0);
const count = rest.length / 3;
const positions = new Float32Array(rest);
const velocities = new Float32Array(rest.length);
const previous = new Float32Array(rest.length);
const triangles = [];
const links = [];
const linked = new Set();
function connect(a, b)
{
    const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
    if (linked.has(key)) return;
    linked.add(key);
    const i = a * 3;
    const j = b * 3;
    links.push([i, j, Math.hypot(rest[i] - rest[j], rest[i + 1] - rest[j + 1], rest[i + 2] - rest[j + 2])]);
}
for (let ring = 0; ring < RINGS; ring++)
{
    for (let segment = 0; segment < SEGMENTS; segment++)
    {
        const a = ring * SEGMENTS + segment;
        const b = ring * SEGMENTS + (segment + 1) % SEGMENTS;
        connect(a, b);
        if (ring < RINGS - 1)
        {
            const c = a + SEGMENTS;
            const d = b + SEGMENTS;
            triangles.push(a, c, b, b, c, d);
            connect(a, c);
            connect(a, d);
            connect(b, c);
            if (ring < RINGS - 2) connect(a, a + SEGMENTS * 2);
        }
        if (ring === 0)
        {
            triangles.push(bottom, a, b);
            connect(bottom, a);
        }
        if (ring === RINGS - 1)
        {
            triangles.push(top, b, a);
            connect(top, a);
        }
    }
}
const restCenter = [0, 0, 0];
for (let i = 0; i < rest.length; i++) restCenter[i % 3] += rest[i] / count;
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
geometry.setIndex(triangles);
geometry.computeVertexNormals();
const material = new THREE.MeshPhysicalMaterial(
{
    color: FLAVORS[0].color,
    roughness: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    transmission: 0.45,
    thickness: 0.8,
    ior: 1.42,
    attenuationColor: new THREE.Color(FLAVORS[0].color),
    attenuationDistance: 1.6
});
const jelly = new THREE.Mesh(geometry, material);
scene.add(jelly);
const targetColor = new THREE.Color(FLAVORS[0].color);
const transitionColor = targetColor.clone();
let colorChangedAt = 0;
const bubbles = [];
const bubbleMaterial = new THREE.MeshPhysicalMaterial(
{
    color: 0xffe9db, transparent: true, opacity: 0.28, roughness: 0.1, transmission: 0.4
});
for (const [ring, segment, size] of [[5, 3, 0.035], [10, 9, 0.025], [13, 35, 0.03], [8, 44, 0.02], [15, 16, 0.025]])
{
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 8), bubbleMaterial);
    scene.add(bubble);
    bubbles.push({ mesh: bubble, index: (ring * SEGMENTS + segment) * 3 });
}

let grab = null;
let lastAction = -10000;
let dropping = false;
let dropCount = 0;
let impulseCount = 0;
let stepCount = 0;
let lastImpact = 0;
let speed = 0;
let status = CONTENT.resting;
let lastPointer = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const worldPoint = new THREE.Vector3();
const normal = new THREE.Vector3();

function announce(text)
{
    announcement.textContent = text;
}

function pick(event)
{
    const rect = stage.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
}

function poke(index, strength = 1)
{
    const factor = (reduced.matches ? 0.55 : 1) * strength;
    const center = index * 3;
    for (let i = 0; i < positions.length; i += 3)
    {
        const distance = Math.hypot(rest[i] - rest[center], rest[i + 1] - rest[center + 1], rest[i + 2] - rest[center + 2]);
        const influence = Math.exp(-distance * distance / 0.42) * factor;
        velocities[i] -= rest[center] * influence * 2.8;
        velocities[i + 1] -= influence * 4.7;
        velocities[i + 2] -= rest[center + 2] * influence * 2.8;
    }
    impulseCount++;
    lastAction = performance.now();
    squelch(strength);
}

stage.addEventListener("pointerdown", (event) =>
{
    if (grab || event.button > 0) return;
    pick(event);
    const hit = raycaster.intersectObject(jelly)[0];
    if (!hit) return;
    event.preventDefault();
    const indices = [hit.face.a, hit.face.b, hit.face.c];
    const index = indices.reduce((best, candidate) =>
    {
        const distance = (n) => hit.point.distanceToSquared(new THREE.Vector3().fromArray(positions, n * 3));
        return distance(candidate) < distance(best) ? candidate : best;
    });
    const offset = index * 3;
    normal.copy(camera.position).sub(hit.point).normalize();
    dragPlane.setFromNormalAndCoplanarPoint(normal, hit.point);
    grab =
    {
        id: event.pointerId,
        index,
        target: new THREE.Vector3().fromArray(positions, offset),
        origin: new THREE.Vector3().fromArray(positions, offset),
        offset: new THREE.Vector3().fromArray(positions, offset).sub(hit.point),
        x: event.clientX,
        y: event.clientY,
        moved: false,
        cluster: []
    };
    for (let i = 0; i < positions.length; i += 3)
    {
        const d = Math.hypot(rest[i] - rest[offset], rest[i + 1] - rest[offset + 1], rest[i + 2] - rest[offset + 2]);
        if (d < 0.95) grab.cluster.push([i, Math.exp(-d * d / 0.2)]);
    }
    lastPointer = event.pointerId;
    stage.setPointerCapture(event.pointerId);
    lastAction = performance.now();
});
stage.addEventListener("pointermove", (event) =>
{
    if (!grab || grab.id !== event.pointerId) return;
    pick(event);
    if (!raycaster.ray.intersectPlane(dragPlane, worldPoint)) return;
    if (Math.hypot(event.clientX - grab.x, event.clientY - grab.y) > 4) grab.moved = true;
    const delta = worldPoint.clone().add(grab.offset).sub(grab.origin).clampLength(0, 1.7);
    grab.target.copy(grab.origin).add(delta);
    grab.target.y = THREE.MathUtils.clamp(grab.target.y, FLOOR + 0.04, 3.6);
});
function release(event)
{
    if (!grab || event.pointerId !== grab.id) return;
    const saved = grab;
    grab = null;
    lastAction = performance.now();
    if (!saved.moved && event.type !== "pointercancel") poke(saved.index);
    else squelch(0.7);
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
}
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("lostpointercapture", release);

function resetShape(height = 0)
{
    grab = null;
    if (lastPointer !== null && stage.hasPointerCapture(lastPointer)) stage.releasePointerCapture(lastPointer);
    positions.set(rest);
    for (let i = 1; i < positions.length; i += 3) positions[i] += height;
    velocities.fill(0);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
}
document.querySelector("#drop").addEventListener("click", () =>
{
    resetShape(reduced.matches ? 0.62 : 1.6);
    dropping = true;
    dropCount++;
    lastAction = performance.now();
    announce(CONTENT.dropped);
    squelch(0.35);
});
document.querySelector("#squish").addEventListener("click", () =>
{
    poke(13 * SEGMENTS + 7, 1.15);
    announce(CONTENT.squished);
});
document.querySelector("#reset").addEventListener("click", () =>
{
    resetShape();
    dropping = false;
    lastAction = performance.now() - 5000;
    announce(CONTENT.resetDone);
});
stiffness.addEventListener("input", () =>
{
    feel = Number(stiffness.value) / 100;
    document.querySelector("#stiffness-value").textContent = stiffness.value;
});
function selectFlavor(index, speak = true)
{
    flavor = index;
    transitionColor.copy(material.color);
    colorChangedAt = performance.now();
    targetColor.set(FLAVORS[index].color);
    if (reduced.matches)
    {
        material.color.copy(targetColor);
        material.attenuationColor.copy(targetColor);
    }
    document.querySelectorAll(".flavor").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    document.querySelector("#flavor-note").textContent = FLAVORS[index].note;
    document.querySelector("#flavor-dot").style.backgroundColor = FLAVORS[index].color;
    if (speak) announce(`${FLAVORS[index].name} ${CONTENT.flavorChanged}`);
}
FLAVORS.forEach((item, index) =>
{
    const button = document.createElement("button");
    button.className = "flavor";
    button.type = "button";
    button.style.setProperty("--flavor", item.color);
    const swatch = document.createElement("i");
    swatch.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.textContent = item.name;
    button.append(swatch, name);
    button.addEventListener("click", () => selectFlavor(index));
    document.querySelector("#flavors").append(button);
});
selectFlavor(0, false);

function simulate(dt)
{
    stepCount++;
    previous.set(positions);
    let cx = 0;
    let cy = 0;
    let cz = 0;
    let vx = 0;
    let vy = 0;
    let vz = 0;
    for (let i = 0; i < positions.length; i += 3)
    {
        cx += positions[i] / count;
        cy += positions[i + 1] / count;
        cz += positions[i + 2] / count;
        vx += velocities[i] / count;
        vy += velocities[i + 1] / count;
        vz += velocities[i + 2] / count;
    }
    const restoration = 60 + feel * 180;
    const damping = (reduced.matches ? 9 : 2.4) + feel * 4.2;
    const supportedCenter = Math.max(cy, restCenter[1]);
    for (let i = 0; i < positions.length; i += 3)
    {
        velocities[i] += ((rest[i] + cx - restCenter[0] - positions[i]) * restoration - (velocities[i] - vx) * damping - vx * 1.6 - cx * 1.3) * dt;
        velocities[i + 1] += ((rest[i + 1] + supportedCenter - restCenter[1] - positions[i + 1]) * restoration - (velocities[i + 1] - vy) * damping - (cy < restCenter[1] + 0.25 ? vy * 1.4 : 0) - 9.8) * dt;
        velocities[i + 2] += ((rest[i + 2] + cz - restCenter[2] - positions[i + 2]) * restoration - (velocities[i + 2] - vz) * damping - vz * 1.6 - cz * 1.3) * dt;
    }
    if (grab)
    {
        const i = grab.index * 3;
        for (const [j, weight] of grab.cluster)
        {
            velocities[j] += (grab.target.x + (rest[j] - rest[i]) - positions[j]) * weight * 360 * dt;
            velocities[j + 1] += (grab.target.y + (rest[j + 1] - rest[i + 1]) - positions[j + 1]) * weight * 360 * dt;
            velocities[j + 2] += (grab.target.z + (rest[j + 2] - rest[i + 2]) - positions[j + 2]) * weight * 360 * dt;
        }
    }
    for (let i = 0; i < positions.length; i++)
    {
        velocities[i] = THREE.MathUtils.clamp(velocities[i], -9, 9);
        positions[i] += velocities[i] * dt;
    }
    const tension = 0.18 + feel * 0.34;
    for (let iteration = 0; iteration < 4; iteration++)
    {
        for (const [i, j, length] of links)
        {
            const dx = positions[j] - positions[i];
            const dy = positions[j + 1] - positions[i + 1];
            const dz = positions[j + 2] - positions[i + 2];
            const distance = Math.hypot(dx, dy, dz);
            if (distance < 0.00001) continue;
            const correction = (distance - length) / distance * tension * 0.5;
            positions[i] += dx * correction;
            positions[i + 1] += dy * correction;
            positions[i + 2] += dz * correction;
            positions[j] -= dx * correction;
            positions[j + 1] -= dy * correction;
            positions[j + 2] -= dz * correction;
        }
        if (grab)
        {
            const anchor = grab.index * 3;
            for (const [i, weight] of grab.cluster)
            {
                const compliance = weight * 0.18;
                positions[i] += (grab.target.x + rest[i] - rest[anchor] - positions[i]) * compliance;
                positions[i + 1] += (grab.target.y + rest[i + 1] - rest[anchor + 1] - positions[i + 1]) * compliance;
                positions[i + 2] += (grab.target.z + rest[i + 2] - rest[anchor + 2] - positions[i + 2]) * compliance;
            }
        }
        for (let i = 0; i < positions.length; i += 3)
        {
            positions[i + 1] = Math.max(FLOOR, positions[i + 1]);
            // A bounded radial envelope keeps extreme, repeated drags recoverable.
            const dx = positions[i] - cx;
            const dy = positions[i + 1] - cy;
            const dz = positions[i + 2] - cz;
            const distance = Math.hypot(dx, dy, dz);
            if (distance > 2.7)
            {
                positions[i] = cx + dx / distance * 2.7;
                positions[i + 1] = Math.max(FLOOR, cy + dy / distance * 2.7);
                positions[i + 2] = cz + dz / distance * 2.7;
            }
        }
    }
    let minY = Infinity;
    let movement = 0;
    for (let i = 0; i < positions.length; i += 3)
    {
        velocities[i] = (positions[i] - previous[i]) / dt;
        velocities[i + 1] = (positions[i + 1] - previous[i + 1]) / dt;
        velocities[i + 2] = (positions[i + 2] - previous[i + 2]) / dt;
        if (positions[i + 1] <= FLOOR + 0.002)
        {
            velocities[i] *= 0.9;
            velocities[i + 2] *= 0.9;
            velocities[i + 1] = Math.max(0, velocities[i + 1]);
        }
        movement += velocities[i] ** 2 + velocities[i + 1] ** 2 + velocities[i + 2] ** 2;
        minY = Math.min(minY, positions[i + 1]);
    }
    speed = Math.sqrt(movement / count);
    if (dropping && minY < FLOOR + 0.015)
    {
        dropping = false;
        lastImpact = performance.now();
        lastAction = lastImpact;
        squelch(1);
    }
}

function resize()
{
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    camera.aspect = width / height;
    camera.zoom = width < 500 ? 1.02 : 1.12;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}
new ResizeObserver(resize).observe(stage);
resize();
let last = performance.now();
let accumulator = 0;
let hidden = document.hidden;
document.addEventListener("visibilitychange", () =>
{
    hidden = document.hidden;
    last = performance.now();
    accumulator = 0;
    if (hidden)
    {
        grab = null;
        if (audio?.state === "running") audio.suspend();
    }
    else if (sound) audio?.resume().catch(() => {});
});
function render(now)
{
    requestAnimationFrame(render);
    if (hidden) return;
    const elapsed = Math.min((now - last) / 1000, 0.05);
    last = now;
    accumulator += elapsed;
    while (accumulator >= 1 / 120)
    {
        simulate(1 / 120);
        accumulator -= 1 / 120;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    for (const bubble of bubbles)
    {
        bubble.mesh.position.fromArray(positions, bubble.index).multiplyScalar(0.94);
    }
    material.color.lerpColors(transitionColor, targetColor, reduced.matches ? 1 : Math.min(1, (now - colorChangedAt) / 220));
    material.attenuationColor.copy(material.color);
    const next = grab ? CONTENT.stretching : dropping ? CONTENT.dropping :
        speed > 0.065 || now - lastAction < 1200 ? CONTENT.wobbling : CONTENT.resting;
    if (next !== status)
    {
        status = next;
        stateLabel.textContent = status;
    }
    contact.material.opacity = Math.max(0.12, 0.7 - Math.max(0, positions[1] - FLOOR) * 0.35);
    renderer.render(scene, camera);
}
requestAnimationFrame(render);

// Read-only physical evidence for local QA; all test actions use real controls.
Object.defineProperty(window, "jellyDiagnostics",
{
    get()
    {
        let minY = Infinity;
        let maxY = -Infinity;
        let cx = 0;
        let cy = 0;
        let cz = 0;
        for (let i = 0; i < positions.length; i += 3)
        {
            minY = Math.min(minY, positions[i + 1]);
            maxY = Math.max(maxY, positions[i + 1]);
            cx += positions[i] / count;
            cy += positions[i + 1] / count;
            cz += positions[i + 2] / count;
        }
        let shapeError = 0;
        for (let i = 0; i < positions.length; i += 3)
        {
            shapeError += (positions[i] - cx - rest[i] + restCenter[0]) ** 2 +
                (positions[i + 1] - cy - rest[i + 1] + restCenter[1]) ** 2 +
                (positions[i + 2] - cz - rest[i + 2] + restCenter[2]) ** 2;
        }
        const anchor = new THREE.Vector3(0.35, 1.1, 0.8).project(camera);
        const rect = stage.getBoundingClientRect();
        return {
            count, constraints: links.length, stepCount, dropCount, impulseCount, speed,
            minY, maxY, height: maxY - minY, shapeError: Math.sqrt(shapeError / count),
            center: [cx, cy, cz], flavor: FLAVORS[flavor].name,
            color: `#${material.color.getHexString()}`, stiffness: feel,
            grabbing: Boolean(grab), clusterSize: grab?.cluster.length || 0,
            positions: Array.from(positions), status, reducedMotion: reduced.matches,
            audioState: audio?.state || "not-created",
            lastImpact,
            anchor: { x: rect.left + (anchor.x + 1) * rect.width / 2, y: rect.top + (1 - anchor.y) * rect.height / 2 }
        };
    }
});
window.addEventListener("pagehide", () =>
{
    audio?.close().catch(() => {});
    renderer.dispose();
    environment.dispose();
});
