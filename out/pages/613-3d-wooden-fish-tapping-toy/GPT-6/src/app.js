import * as THREE from "./vendor/three.module.min.js";
import { content as c } from "./content.js";

const icon = (paths) => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const icons =
{
    brand: icon('<path d="M3 9c5-6 13-6 18 0M3 15c5-6 13-6 18 0M7 18c3-3 7-3 10 0"/>'),
    sound: icon('<path d="M4 10h4l5-4v12l-5-4H4zM17 9c2 2 2 4 0 6M20 6c4 4 4 8 0 12"/>'),
    ambience: icon('<path d="M3 15c3-8 5-8 8 0s5 8 10-5M3 8c3-4 5-4 8 0s5 4 10-3"/>')
};
document.title = c.title;
document.querySelector("#app").innerHTML = `
<div class="shell">
    <header class="identity">
        <div class="brand">${icons.brand}<span>${c.brand}</span></div>
        <div class="quiet"><i></i>${c.status}</div>
    </header>
    <main>
        <section class="stage" aria-labelledby="invitation">
            <div class="invitation">
                <p class="eyebrow">${c.eyebrow}</p>
                <h1 id="invitation">${c.invitation}</h1>
                <p class="intro">${c.introduction}</p>
                <div class="scene-caption"><strong>${c.finish}</strong>${c.room}</div>
            </div>
            <div class="scene-wrap">
                <span class="scene-edition">${c.edition}</span>
                <canvas id="scene" role="img" aria-label="${c.sceneLabel}"></canvas>
                <span class="floating" aria-hidden="true">${c.calm}</span>
            </div>
            <div class="metrics">
                <div class="metric">
                    <p class="metric-label">${c.today}</p>
                    <div class="number" id="today">0</div>
                    <p class="submetric">${c.session}<b id="session">0</b></p>
                </div>
                <div class="metric">
                    <p class="metric-label">${c.rhythm}</p>
                    <div class="rhythm-number"><span class="number" id="combo">0</span><small>${c.rhythmUnit}</small></div>
                    <p class="rhythm-hint" id="rhythmHint">${c.rhythmHint}</p>
                </div>
            </div>
        </section>
        <section class="play" aria-label="${c.strike}">
            <p class="instruction">${matchMedia("(max-width: 760px)").matches ? c.touchInstruction : c.instruction}</p>
            <button class="strike" id="strike">${c.strike}<kbd aria-hidden="true">${c.space}</kbd></button>
            <p class="sound-hint" id="soundHint">${c.firstSound}</p>
        </section>
        <section class="utility" aria-label="${c.sound} ${c.rhythm}">
            <div class="dock">
                <button class="setting" id="sound" aria-pressed="true">${icons.sound}<span>${c.sound}</span><span class="state">${c.on}</span></button>
                <button class="setting" id="ambience" aria-pressed="false">${icons.ambience}<span>${c.ambience}</span><span class="state">${c.off}</span></button>
                <button class="setting" id="auto" role="switch" aria-checked="false" aria-label="${c.startAuto}"><span>${c.auto}</span><span class="switch" aria-hidden="true"></span></button>
            </div>
            <p class="pace" id="pace">${c.manualHint}</p>
        </section>
        <div class="sr-only" aria-live="polite" id="announce"></div>
    </main>
    <footer><span>${c.footer}</span><a href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${c.credit}</a></footer>
</div>`;

const $ = (id) => document.getElementById(id);
const canvas = $("scene");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const localDay = () =>
{
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};
let storage = true;
let saved = {};
try
{
    saved = JSON.parse(localStorage.getItem("hushwood.v1") || "{}") || {};
}
catch
{
    storage = false;
}
const state =
{
    day: localDay(),
    today: saved.day === localDay() && Number.isSafeInteger(saved.today) && saved.today >= 0 ? saved.today : 0,
    session: 0,
    combo: 0,
    last: -Infinity,
    sound: saved.sound !== false,
    ambience: false,
    auto: false
};
function save()
{
    try
    {
        localStorage.setItem("hushwood.v1", JSON.stringify(
        {
            day: state.day,
            today: state.today,
            sound: state.sound,
            ambience: state.ambience
        }));
    }
    catch
    {
        storage = false;
    }
}
function update()
{
    $("today").textContent = state.today.toLocaleString("en-US");
    $("session").textContent = state.session.toLocaleString("en-US");
    $("combo").textContent = state.combo.toLocaleString("en-US");
    $("rhythmHint").textContent = state.combo >= 3 ? c.inRhythm : c.rhythmHint;
    for (const id of ["sound", "ambience"])
    {
        $(id).setAttribute("aria-pressed", String(state[id]));
        $(id).querySelector(".state").textContent = state[id] ? c.on : c.off;
    }
    $("auto").setAttribute("aria-checked", String(state.auto));
    $("auto").setAttribute("aria-label", state.auto ? c.stopAuto : c.startAuto);
    $("pace").textContent = state.auto ? c.autoHint : c.manualHint;
}
update();

let audio;
let reverbImpulse;
let ambienceGain;
let ambienceSources = [];
let audioUnavailable = false;
const audioEvidence = { knocks: 0, peak: 0 };
async function unlock()
{
    try
    {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) throw Error("unsupported");
        if (!audio) audio = new Context();
        if (audio.state === "suspended") await audio.resume();
        if (audio.state !== "running") return false;
        return true;
    }
    catch
    {
        audioUnavailable = true;
        $("soundHint").textContent = c.soundUnavailable;
        return false;
    }
}
function noiseBuffer(seconds)
{
    const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * seconds), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}
function knock()
{
    if (!audio || audio.state !== "running" || !state.sound) return;
    const now = audio.currentTime;
    const master = audio.createGain();
    master.gain.value = .42;
    const analyser = audio.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser);
    analyser.connect(audio.destination);
    for (const [frequency, volume, type, duration] of [[180, .55, "sine", .58], [470, .15, "triangle", .24], [820, .05, "sine", .12]])
    {
        const oscillator = audio.createOscillator();
        const envelope = audio.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * .94, now + .18);
        envelope.gain.setValueAtTime(.0001, now);
        envelope.gain.exponentialRampToValueAtTime(volume, now + .003);
        envelope.gain.exponentialRampToValueAtTime(.0001, now + duration);
        oscillator.connect(envelope);
        envelope.connect(master);
        oscillator.start(now);
        oscillator.stop(now + duration + .02);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    }
    const transient = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    transient.buffer = noiseBuffer(.04);
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    gain.gain.setValueAtTime(.17, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .035);
    transient.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    if (!reverbImpulse)
    {
        reverbImpulse = audio.createBuffer(2, Math.floor(audio.sampleRate * .65), audio.sampleRate);
        for (let channel = 0; channel < 2; channel++)
        {
            const samples = reverbImpulse.getChannelData(channel);
            for (let i = 0; i < samples.length; i++)
            {
                samples[i] = (Math.random() * 2 - 1) * Math.exp(-i / samples.length * 9) * .32;
            }
        }
    }
    const reverb = audio.createConvolver();
    reverb.buffer = reverbImpulse;
    const tail = audio.createGain();
    tail.gain.value = .075;
    master.connect(reverb);
    reverb.connect(tail);
    tail.connect(audio.destination);
    transient.start(now);
    setTimeout(() =>
    {
        if (audio.state === "running")
        {
            const samples = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(samples);
            audioEvidence.peak = Math.max(audioEvidence.peak, ...samples.map(Math.abs));
        }
    }, 24);
    setTimeout(() =>
    {
        transient.disconnect();
        filter.disconnect();
        gain.disconnect();
        master.disconnect();
        analyser.disconnect();
        reverb.disconnect();
        tail.disconnect();
    }, 1000);
    audioEvidence.knocks++;
}
function stopAmbience(immediate = false)
{
    const old = ambienceSources;
    ambienceSources = [];
    if (!audio || !ambienceGain) return;
    const oldGain = ambienceGain;
    ambienceGain = undefined;
    oldGain.gain.cancelScheduledValues(audio.currentTime);
    oldGain.gain.setTargetAtTime(0, audio.currentTime, immediate ? .001 : .075);
    for (const source of old)
    {
        source.stop(audio.currentTime + (immediate ? .01 : .32));
        source.onended = () => source.disconnect();
    }
    setTimeout(() => oldGain.disconnect(), 400);
}
function startAmbience()
{
    if (!audio || audio.state !== "running" || !state.ambience || ambienceGain) return;
    ambienceGain = audio.createGain();
    ambienceGain.gain.setValueAtTime(0, audio.currentTime);
    ambienceGain.gain.linearRampToValueAtTime(.045, audio.currentTime + .3);
    ambienceGain.connect(audio.destination);
    const source = audio.createBufferSource();
    source.buffer = noiseBuffer(3);
    source.loop = true;
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 330;
    source.connect(filter);
    filter.connect(ambienceGain);
    source.start();
    ambienceSources.push(source);
    for (const frequency of [73.4, 73.8])
    {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        gain.gain.value = .2;
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        gain.connect(ambienceGain);
        oscillator.start();
        ambienceSources.push(oscillator);
    }
}

let scene;
let camera;
let renderer;
let fish;
let mallet;
let wood;
let ripple;
let particles;
let particleData;
let fallback = false;
let lastImpact = -Infinity;
let lastFrame = 0;
let animation;
let spring = 0;
let velocity = 0;
const pickables = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function grainTexture()
{
    const image = document.createElement("canvas");
    image.width = 1024;
    image.height = 512;
    const g = image.getContext("2d");
    g.fillStyle = "#a1744f";
    g.fillRect(0, 0, 1024, 512);
    for (let line = 0; line < 420; line++)
    {
        const y = line * 1.3;
        g.beginPath();
        g.lineWidth = line % 7 === 0 ? 1.7 : .65;
        g.strokeStyle = line % 3 === 0 ? "rgba(47,22,10,.23)" : "rgba(242,184,102,.14)";
        for (let x = 0; x <= 1024; x += 8)
        {
            const wave = Math.sin(x * .007 + line * .053) * 7 + Math.sin(x * .017 + line * .021) * 2;
            const knot = Math.exp(-((x - 650) ** 2) / 16000) * Math.sin(line * .09) * 14;
            if (x === 0) g.moveTo(x, y + wave + knot);
            else g.lineTo(x, y + wave + knot);
        }
        g.stroke();
    }
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
}
function mesh(geometry, material, parent, position = [0, 0, 0], scale = [1, 1, 1], pick = false)
{
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.scale.set(...scale);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    if (pick) pickables.push(object);
    return object;
}
function curveTube(points, radius, material, parent)
{
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), 64, radius, 8, false), material, parent);
}
function initScene()
{
    const context = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "low-power" });
    if (!context) throw Error("WebGL is unavailable");
    renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#151915", .065);
    camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
    camera.position.set(4.4, 3.5, 6.7);
    camera.lookAt(0, .85, 0);
    scene.add(new THREE.HemisphereLight("#f0deba", "#171d18", 2));
    const key = new THREE.DirectionalLight("#f0d7b1", 3.8);
    key.position.set(-3, 5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.normalBias = .025;
    key.shadow.radius = 5;
    scene.add(key);
    const rim = new THREE.PointLight("#b5c5b3", 15, 16);
    rim.position.set(3, 3, -3);
    scene.add(rim);
    const sphere = new THREE.SphereGeometry(1, 64, 40);
    wood = new THREE.MeshStandardMaterial({ map: grainTexture(), roughness: .4, metalness: .035, color: "#d1b296" });
    const dark = new THREE.MeshStandardMaterial({ color: "#23190f", roughness: .83 });
    const ridge = new THREE.MeshStandardMaterial({ color: "#704529", roughness: .5, map: wood.map });
    const brass = new THREE.MeshStandardMaterial({ color: "#b78d52", roughness: .42, metalness: .32 });
    const stone = new THREE.MeshStandardMaterial({ color: "#30352f", roughness: .9 });
    const plinth = mesh(new THREE.CylinderGeometry(2.15, 2.22, .27, 128, 1), stone, scene, [0, -.2, 0]);
    plinth.receiveShadow = true;
    mesh(new THREE.CylinderGeometry(2.13, 2.15, .035, 128), new THREE.MeshStandardMaterial({ color: "#3e453b", roughness: .85 }), scene, [0, -.045, 0]);
    mesh(new THREE.CylinderGeometry(2.21, 2.21, .018, 128), new THREE.MeshStandardMaterial({ color: "#1d221c", roughness: .9 }), scene, [0, -.315, 0]);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
    gradient.addColorStop(0, "#0009");
    gradient.addColorStop(1, "#0000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const contact = mesh(new THREE.PlaneGeometry(3.2, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }), scene, [0, -.02, 0]);
    contact.rotation.x = -Math.PI / 2;
    fish = new THREE.Group();
    fish.position.y = 1.08;
    fish.rotation.y = -.42;
    scene.add(fish);
    mesh(sphere, wood, fish, [0, 0, 0], [1.22, .77, .87], true);
    for (const side of [-1, 1])
    {
        mesh(sphere, wood, fish, [side * .39, .03, .65], [.52, .57, .41], true);
        const eye = mesh(new THREE.TorusGeometry(.062, .013, 8, 24), brass, fish, [side * .59, .25, .97]);
        eye.rotation.y = side * .17;
        mesh(sphere, dark, fish, [side * .59, .25, .975], [.043, .043, .018], true);
    }
    curveTube([[-.9, -.06, .55], [-.67, -.15, .88], [0, -.18, 1.02], [.67, -.15, .88], [.9, -.06, .55]], .047, dark, fish);
    curveTube([[-.88, -.12, .55], [-.67, -.22, .86], [0, -.245, .98], [.67, -.22, .86], [.88, -.12, .55]], .016, ridge, fish);
    curveTube([[0, .52, .5], [0, .47, .73], [0, .3, .92], [0, -.16, 1.035]], .029, dark, fish);
    for (const height of [-.32, -.4])
    {
        const points = [];
        for (let i = 0; i <= 96; i++)
        {
            const a = i / 96 * Math.PI * 2;
            points.push([Math.cos(a) * 1.08, height, Math.sin(a) * .75]);
        }
        curveTube(points, .014, ridge, fish);
    }
    const tail = new THREE.Group();
    tail.position.set(0, .07, -.87);
    tail.rotation.x = -.3;
    fish.add(tail);
    for (const [x, z, angle] of [[-.27, -.1, -.4], [0, -.22, 0], [.27, -.1, .4]])
    {
        const lobe = mesh(sphere, wood, tail, [x, 0, z], [.28, .23, .42], true);
        lobe.rotation.y = angle;
    }
    mallet = new THREE.Group();
    mallet.position.set(.13, 2.3, .35);
    mallet.rotation.z = -.36;
    scene.add(mallet);
    const handle = mesh(new THREE.CylinderGeometry(.045, .06, 1.65, 20), wood, mallet, [.82, 0, 0]);
    handle.rotation.z = -Math.PI / 2;
    const pad = mesh(new THREE.CylinderGeometry(.19, .19, .46, 40, 1), new THREE.MeshStandardMaterial({ color: "#e5d7b8", roughness: .9 }), mallet);
    pad.rotation.z = Math.PI / 2;
    for (let i = -4; i <= 4; i++)
    {
        const wrap = mesh(new THREE.TorusGeometry(.191, .007, 6, 32), new THREE.MeshStandardMaterial({ color: "#bfb394", roughness: 1 }), mallet, [i * .047, 0, 0]);
        wrap.rotation.y = Math.PI / 2;
    }
    const roomMaterial = new THREE.MeshStandardMaterial({ color: "#242b22", roughness: 1 });
    for (let i = -6; i <= 6; i++)
    {
        const fin = mesh(new THREE.BoxGeometry(.12, 6.6, .28), roomMaterial, scene, [i * .72, 2, -3.2]);
        fin.castShadow = false;
    }
    const floor = mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: "#151915", roughness: 1 }), scene, [0, -.35, 0]);
    floor.rotation.x = -Math.PI / 2;
    ripple = mesh(new THREE.RingGeometry(.98, 1, 96), new THREE.MeshBasicMaterial({ color: "#d8ad64", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }), scene, [0, -.012, 0]);
    ripple.rotation.x = -Math.PI / 2;
    particleData = new Float32Array(18 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(particleData, 3));
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .035, color: "#edc782", transparent: true, opacity: 0, depthWrite: false }));
    scene.add(particles);
    const dustData = new Float32Array(45 * 3);
    for (let i = 0; i < dustData.length; i++) dustData[i] = Math.sin(i * 16.37) * 4;
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustData, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: "#b0a381", size: .012, transparent: true, opacity: .3 }));
    scene.add(dust);
    resize();
    document.documentElement.dataset.renderer = "webgl";
}
function initFallback()
{
    fallback = true;
    if (renderer) renderer.dispose();
    const replacement = document.createElement("canvas");
    replacement.id = "scene";
    replacement.setAttribute("role", "img");
    replacement.setAttribute("aria-label", c.fallbackLabel);
    canvas.replaceWith(replacement);
    const note = document.createElement("span");
    note.className = "fallback-note";
    note.textContent = c.fallback;
    replacement.parentElement.append(note);
    document.documentElement.dataset.renderer = "canvas";
    resize();
}
function drawFallback()
{
    const fallbackCanvas = $("scene");
    const g = fallbackCanvas.getContext("2d");
    const w = fallbackCanvas.width;
    const h = fallbackCanvas.height;
    g.clearRect(0, 0, w, h);
    g.save();
    g.translate(w / 2, h * .54);
    const scale = Math.min(w / 6, h / 5);
    g.scale(scale, scale);
    g.fillStyle = "#4a4b3b";
    g.beginPath();
    g.ellipse(0, .85, 2, .5, 0, 0, Math.PI * 2);
    g.fill();
    const color = g.createLinearGradient(-1, -1, 1, 1);
    color.addColorStop(0, "#cf9960");
    color.addColorStop(1, "#633b24");
    g.fillStyle = color;
    g.beginPath();
    g.ellipse(0, -.1, 1.2, .82, -.1, 0, Math.PI * 2);
    g.fill();
    for (const x of [-.3, 0, .3])
    {
        g.beginPath();
        g.ellipse(x - .5, -.8, .25, .3, -.5, 0, Math.PI * 2);
        g.fill();
    }
    g.strokeStyle = "#321e12";
    g.lineWidth = .055;
    g.beginPath();
    g.ellipse(0, .01, 1.05, .28, 0, .1, Math.PI - .1);
    g.stroke();
    g.lineWidth = .011;
    for (let i = 0; i < 13; i++)
    {
        g.beginPath();
        g.ellipse(0, -.45 + i * .06, .95, .18, -.1, 0, Math.PI);
        g.stroke();
    }
    g.fillStyle = "#23190f";
    for (const x of [-.48, .48])
    {
        g.beginPath();
        g.arc(x, -.1, .055, 0, Math.PI * 2);
        g.fill();
    }
    g.strokeStyle = "#ab7947";
    g.lineWidth = .08;
    g.beginPath();
    g.moveTo(.4, -1.4);
    g.lineTo(1.7, -1.9);
    g.stroke();
    g.fillStyle = "#ded0b0";
    g.beginPath();
    g.ellipse(.4, -1.4, .25, .18, -.3, 0, Math.PI * 2);
    g.fill();
    g.restore();
}
function resize()
{
    const bounds = $("scene").getBoundingClientRect();
    if (fallback)
    {
        $("scene").width = bounds.width * Math.min(devicePixelRatio, 1.75);
        $("scene").height = bounds.height * Math.min(devicePixelRatio, 1.75);
        drawFallback();
        return;
    }
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.position.set(4.4, 3.5, 6.7);
    if (camera.aspect < 1.2) camera.position.multiplyScalar(1.06);
    camera.lookAt(0, .85, 0);
    camera.updateProjectionMatrix();
}
function render(time)
{
    const delta = Math.min((time - lastFrame) / 1000, .03);
    lastFrame = time;
    const age = (time - lastImpact) / 1000;
    if (!fallback)
    {
        if (reduced.matches)
        {
            fish.position.y = 1.08;
            fish.rotation.z = 0;
            mallet.position.y = 2.3;
            wood.emissive.setHex(age < .12 ? 0x3a210b : 0);
            ripple.material.opacity = 0;
            particles.material.opacity = 0;
        }
        else
        {
            velocity += (-spring * 170 - velocity * 19) * delta;
            spring += velocity * delta;
            if (spring < -.12)
            {
                spring = -.12;
                velocity = Math.max(0, velocity);
            }
            fish.position.y = 1.08 + Math.sin(time / 5000 * Math.PI * 2) * .035 + spring;
            fish.rotation.z = spring * .5;
            const hit = age >= 0 && age < .5 ? (age < .085 ? age / .085 : Math.exp(-(age - .085) * 9)) : 0;
            mallet.position.y = 2.3 - hit * .52;
            mallet.rotation.z = -.36 + hit * .3;
            ripple.scale.setScalar(.4 + Math.min(age / .7, 1) * 1.9);
            ripple.material.opacity = age < .7 ? .42 * (1 - age / .7) : 0;
            particles.material.opacity = age < .6 ? .8 * (1 - age / .6) : 0;
            if (age < .6)
            {
                for (let i = 0; i < 18; i++)
                {
                    const angle = i * 2.399;
                    particleData[i * 3] = Math.cos(angle) * age * (1 + i % 3 * .2);
                    particleData[i * 3 + 1] = 1.7 + age * (1.3 + i % 4 * .2) - age * age * 3;
                    particleData[i * 3 + 2] = .3 + Math.sin(angle) * age;
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
        }
        renderer.render(scene, camera);
    }
    animation = requestAnimationFrame(render);
}
try
{
    initScene();
}
catch
{
    initFallback();
}
new ResizeObserver(resize).observe($("scene").parentElement);
animation = requestAnimationFrame(render);

let autoTimer;
let comboTimer;
let flashTimer;
let lastAnnouncement = -Infinity;
function strike(automatic = false)
{
    if (document.hidden) return;
    const now = performance.now();
    if (state.day !== localDay())
    {
        state.day = localDay();
        state.today = 0;
    }
    state.combo = now - state.last < 1600 ? state.combo + 1 : 1;
    state.last = now;
    state.session++;
    state.today++;
    lastImpact = now;
    velocity = Math.max(velocity - 3.5, -3.5);
    spring = Math.max(spring, -.12);
    update();
    save();
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() =>
    {
        state.combo = 0;
        update();
    }, 1600);
    for (const id of ["today", "combo"])
    {
        $(id).classList.remove("flash");
        void $(id).offsetWidth;
        $(id).classList.add("flash");
    }
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() =>
    {
        $("today").classList.remove("flash");
        $("combo").classList.remove("flash");
    }, 145);
    if (!reduced.matches)
    {
        const message = document.querySelector(".floating");
        message.classList.remove("show");
        void message.offsetWidth;
        message.classList.add("show");
    }
    if (!automatic || now - lastAnnouncement > 12000)
    {
        $("announce").textContent = `${state.session} ${c.announcement}`;
        lastAnnouncement = now;
    }
    $("soundHint").textContent = !storage ? c.storageUnavailable : audioUnavailable ? c.soundUnavailable : state.sound ? c.soundReady : c.soundOffHint;
    if (state.sound)
    {
        if (audio?.state === "running") knock();
        else if (!automatic) void unlock().then((ready) => { if (ready) knock(); });
    }
}
function stopAuto()
{
    clearInterval(autoTimer);
    state.auto = false;
    update();
}
$("strike").addEventListener("click", () => strike());
$("scene").addEventListener("pointerup", (event) =>
{
    if (event.button !== 0 || !event.isPrimary) return;
    const rect = $("scene").getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    if (fallback)
    {
        if ((mouse.x / .42) ** 2 + ((mouse.y + .04) / .34) ** 2 < 1) strike();
        return;
    }
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.intersectObjects(pickables, false).length) strike();
});
$("scene").addEventListener("pointermove", (event) =>
{
    if (fallback) return;
    const rect = $("scene").getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    $("scene").style.cursor = raycaster.intersectObjects(pickables, false).length ? "pointer" : "default";
});
document.addEventListener("keydown", (event) =>
{
    if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey ||
        event.target.closest("button, a, input, select, textarea, [contenteditable='true'], [role='switch']")) return;
    event.preventDefault();
    strike();
});
$("sound").addEventListener("click", () =>
{
    state.sound = !state.sound;
    if (state.sound) void unlock();
    $("soundHint").textContent = state.sound ? c.soundReady : c.soundOffHint;
    update();
    save();
});
$("ambience").addEventListener("click", async () =>
{
    state.ambience = !state.ambience;
    update();
    save();
    if (!state.ambience) stopAmbience();
    else if (await unlock()) startAmbience();
    else
    {
        state.ambience = false;
        update();
        save();
    }
});
$("auto").addEventListener("click", () =>
{
    if (state.auto)
    {
        stopAuto();
        return;
    }
    state.auto = true;
    void unlock();
    update();
    autoTimer = setInterval(() => strike(true), 1200);
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden)
    {
        const wasAuto = state.auto;
        stopAuto();
        stopAmbience(true);
        state.ambience = false;
        update();
        save();
        if (wasAuto) $("pace").textContent = c.paused;
        cancelAnimationFrame(animation);
        if (audio?.state === "running") void audio.suspend().catch(() => {});
    }
    else
    {
        lastFrame = performance.now();
        animation = requestAnimationFrame(render);
    }
});
window.addEventListener("pagehide", () =>
{
    stopAuto();
    stopAmbience(true);
    cancelAnimationFrame(animation);
    if (audio) void audio.close().catch(() => {});
});
