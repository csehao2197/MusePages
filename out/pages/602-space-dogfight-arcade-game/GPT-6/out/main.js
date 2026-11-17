import * as THREE from "./vendor/three.module.js";
import { BRAND, CALLSIGN, SECTOR, CRAFT, AUDIENCE, COPY } from "./content.js";
import { T } from "./tuning.js";
import { Tones } from "./audio.js";
import { Patrol } from "./game.js";

const $ = id => document.getElementById(id);
const show = (id, visible) => $(id).classList.toggle("hidden", !visible);
document.title = BRAND;
$("brand").textContent = BRAND;
$("craft-name").textContent = COPY.craft;
$("callsign").textContent = CALLSIGN.toUpperCase();
$("pilot-sector").textContent = SECTOR;
const tones = new Tones();
const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
const coarseQuery = matchMedia("(pointer: coarse)");
const keys = new Set();
const input = { x: 0, y: 0, fire: false, lock: false, boost: false, roll: false };
const pointer = { x: 0, y: 0, fire: false, lock: false };
const touch = { x: 0, y: 0, fire: false, lock: false };
let stickPointer = null;
let renderer;
let lastState = "";
let skipDelta = false;
let lastTime = performance.now();
let frames = 0;
let frameSum = 0;
let performanceChecked = false;
let messageUntil = 0;
let mobile = innerWidth < 768;
let touchEnabled = mobile || coarseQuery.matches;
export let game;

function titleCard(ended = false)
{
    $("sector").textContent = ended ? COPY.retryEyebrow : COPY.sector;
    $("overline").textContent = ended ? "PATROL REPORT" : "ARCADE PATROL";
    $("heading").textContent = ended ? "Shields down" : COPY.title;
    $("deck").textContent = ended ? `Wave reached ${game.wave}.` : COPY.deck;
    $("audience").textContent = ended ? COPY.retry : AUDIENCE;
    $("meta").textContent = ended ? `Score ${game.score} · ${game.metrics.kills} drones scattered` : COPY.meta;
    $("launch").innerHTML = `${ended ? "Fly again" : "Launch patrol"} <span aria-hidden="true">↗</span>`;
    show("title", ended);
    document.querySelector(".controls").classList.toggle("hidden", ended);
    $("note").textContent = ended ? "A fresh shield. The same field." : "Tones start when you launch. M to mute.";
    $("card").scrollTop = 0;
}

function clearInput()
{
    keys.clear();
    pointer.fire = pointer.lock = touch.fire = touch.lock = false;
    touch.x = touch.y = pointer.x = pointer.y = 0;
    input.boost = input.roll = false;
    document.querySelectorAll(".held").forEach(element => element.classList.remove("held"));
    $("stick").querySelector("i").style.transform = "";
    $("stick").setAttribute("aria-valuenow", "0");
    stickPointer = null;
}

function start()
{
    if (!game) return;
    clearInput();
    tones.start();
    game.launch();
    resize();
    lastState = "";
    $("announcer").textContent = "Patrol started. Wave 1.";
    updateUI();
}

function resize()
{
    mobile = innerWidth < 768;
    touchEnabled = mobile || coarseQuery.matches;
    if (!renderer) return;
    renderer.setPixelRatio(game?.performanceCut ? 1 : Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
    renderer.setSize(innerWidth, innerHeight, false);
    if (game)
    {
        game.camera.aspect = innerWidth / innerHeight;
        game.resize(mobile);
    }
}

function updateUI()
{
    if (!game) return;
    const playing = game.state === "play";
    const ended = game.state === "ended";
    const cardOpen = game.state === "title" || ended && game.endWait <= 0;
    if (lastState !== `${game.state}-${cardOpen}`)
    {
        lastState = `${game.state}-${cardOpen}`;
        show("card", cardOpen);
        show("hud", game.state !== "title");
        show("masthead", game.state === "title");
        show("footer", game.state === "title");
        show("field-label", game.state === "title");
        show("craft-label", game.state === "title");
        show("reticle", playing);
        show("touch", playing && touchEnabled);
        if (cardOpen)
        {
            titleCard(ended);
            $("launch").focus({ preventScroll: true });
        }
    }
    show("touch", playing && touchEnabled);
    $("wave").textContent = String(game.wave).padStart(2, "0");
    const remaining = game.drones.filter(drone => drone.alive).length;
    $("remaining").textContent = game.breather > 0 ? "NEXT WAVE" : `${remaining} LEFT`;
    $("score").textContent = `SCORE ${String(game.score).padStart(4, "0")}`;
    $("shield-number").textContent = String(Math.ceil(game.shield));
    $("shield-fill").style.width = `${game.shield}%`;
    $("shield-fill").style.background = game.shield < 25 ? "#E8A23A" : "#8FCBE3";
    $("shield-fill").style.opacity = game.shield < 25 && game.shield > 0 && !game.reduced ? String(.775 + .225 * Math.sin(game.time * Math.PI * 4)) : "1";
    const boosting = game.boostTime > 0;
    $("boost-label").textContent = boosting ? "BOOST" : game.boostCD > 0 ? game.boostCD.toFixed(1) : "READY";
    const ring = $("boost-ring").querySelector("circle");
    ring.style.stroke = boosting || game.boostCD > 0 ? "#E8A23A" : "#8FCBE3";
    ring.style.strokeDashoffset = game.boostCD > 0 ? String(163.36 * (1 - game.boostCD / T.BOOST_CD)) : "0";
    $("boost").style.borderColor = game.boostCD === 0 ? "#8FCBE3" : "#727b85";
    $("boost").textContent = game.boostCD > 0 ? game.boostCD.toFixed(1) : "BOOST";
    $("lock-arc").style.strokeDashoffset = String(175.93 * (1 - game.lockProgress));
    show("lock-word", !!game.candidate);
    $("tones").textContent = tones.muted ? "Tones off" : "Tones on";
    $("hud").classList.toggle("boundary", playing && game.boundary && Math.floor(game.time * 4) % 2 === 0);
    const inverse = game.ship.quaternion.clone().invert();
    $("dots").innerHTML = game.drones.filter(drone => drone.alive).map(drone =>
    {
        const point = drone.mesh.position.clone().sub(game.ship.position).applyQuaternion(inverse);
        const plot = new THREE.Vector2(point.x, point.z).multiplyScalar(64 / T.SPHERE).clampLength(0, 64);
        return `<circle class="dot" cx="${74 + plot.x}" cy="${74 + plot.y}" r="${drone === game.candidate ? 3 : 2}" style="fill:${drone === game.candidate ? "#E8A23A" : "#C5CED8"}"/>`;
    }).join("");
    while (game.events.length)
    {
        const event = game.events.shift();
        $("announcer").textContent = event;
        $("message").textContent = event;
        messageUntil = game.time + 2.5;
    }
    if (game.boundary && playing) $("message").textContent = "VOLUME EDGE · RETURNING TO SECTOR";
    else if (game.time > messageUntil) $("message").textContent = "";
}

window.addEventListener("keydown", event =>
{
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
    if (!keys.has(event.code) && game?.state === "play")
    {
        if (event.code === "ShiftLeft" || event.code === "ShiftRight") input.boost = true;
        if (event.code === "KeyR") input.roll = true;
    }
    if (event.code === "KeyM" && !event.repeat && game?.state !== "title") tones.toggle();
    keys.add(event.code);
});
window.addEventListener("keyup", event => keys.delete(event.code));
window.addEventListener("blur", clearInput);
document.addEventListener("visibilitychange", () =>
{
    clearInput();
    skipDelta = true;
    if (document.hidden) tones.context?.suspend().catch(() => {});
    else if (game?.state !== "title") tones.context?.resume().catch(() => {});
});
window.addEventListener("resize", resize);
reducedQuery.addEventListener("change", () => { if (game) game.reduced = reducedQuery.matches; });
coarseQuery.addEventListener("change", resize);
$("field").addEventListener("pointermove", event =>
{
    if (touchEnabled) return;
    pointer.x = THREE.MathUtils.clamp((event.clientX - innerWidth / 2) / (innerWidth * .28), -1, 1);
    pointer.y = THREE.MathUtils.clamp((innerHeight / 2 - event.clientY) / (innerHeight * .28), -1, 1);
    if (Math.abs(pointer.x) < .08) pointer.x = 0;
    if (Math.abs(pointer.y) < .08) pointer.y = 0;
});
$("field").addEventListener("pointerdown", event =>
{
    if (touchEnabled) return;
    if (event.button === 0) pointer.fire = true;
    if (event.button === 2) pointer.lock = true;
    $("field").setPointerCapture(event.pointerId);
});
window.addEventListener("pointerup", event =>
{
    if (event.button === 0) pointer.fire = false;
    if (event.button === 2) pointer.lock = false;
});
$("field").addEventListener("pointercancel", () =>
{
    pointer.fire = pointer.lock = false;
});
$("field").addEventListener("contextmenu", event => event.preventDefault());
for (const id of ["fire", "lock"])
{
    const button = $(id);
    button.addEventListener("pointerdown", event =>
    {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        touch[id] = true;
        button.classList.add("held");
    });
    const release = () =>
    {
        touch[id] = false;
        button.classList.remove("held");
    };
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
}
for (const id of ["boost", "roll"])
{
    $(id).addEventListener("pointerup", () => input[id] = true);
    $(id).addEventListener("keydown", event =>
    {
        if (event.code === "Enter" || event.code === "Space") input[id] = true;
    });
}
function moveStick(event)
{
    const box = $("stick").getBoundingClientRect();
    const point = new THREE.Vector2(event.clientX - box.left - 58, event.clientY - box.top - 58).clampLength(0, 36);
    touch.x = Math.abs(point.x / 36) < .12 ? 0 : point.x / 36;
    touch.y = Math.abs(point.y / 36) < .12 ? 0 : -point.y / 36;
    $("stick").querySelector("i").style.transform = `translate(${point.x}px,${point.y}px)`;
    $("stick").setAttribute("aria-valuenow", String(Math.round(touch.x * 100)));
}
$("stick").addEventListener("pointerdown", event =>
{
    stickPointer = event.pointerId;
    $("stick").setPointerCapture(event.pointerId);
    moveStick(event);
});
$("stick").addEventListener("pointermove", event =>
{
    if (event.pointerId === stickPointer) moveStick(event);
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
{
    $("stick").addEventListener(type, () =>
    {
        stickPointer = null;
        touch.x = touch.y = 0;
        $("stick").querySelector("i").style.transform = "";
        $("stick").setAttribute("aria-valuenow", "0");
    });
}
$("tones").addEventListener("click", () => tones.toggle());
$("launch").addEventListener("click", start);
$("title").addEventListener("click", () =>
{
    clearInput();
    tones.context?.suspend().catch(() => {});
    game.title();
    resize();
    lastState = "";
    updateUI();
});

function frame(now)
{
    requestAnimationFrame(frame);
    const elapsed = (now - lastTime) / 1000;
    lastTime = now;
    if (document.hidden) return;
    if (skipDelta)
    {
        skipDelta = false;
        return;
    }
    const dt = Math.min(elapsed, .033);
    const keyboardX = Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft"));
    const keyboardY = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown"));
    const keyboardActive = ["KeyD", "KeyA", "KeyW", "KeyS", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].some(key => keys.has(key));
    input.x = keyboardActive ? keyboardX : touchEnabled ? touch.x : pointer.x;
    input.y = keyboardActive ? keyboardY : touchEnabled ? touch.y : pointer.y;
    input.fire = keys.has("Space") || pointer.fire || touch.fire;
    input.lock = keys.has("KeyF") || pointer.lock || touch.lock;
    game.step(dt, input);
    input.boost = input.roll = false;
    updateUI();
    renderer.render(game.scene, game.camera);
    if (!performanceChecked)
    {
        frames++;
        frameSum += elapsed;
        if (frames >= 180)
        {
            performanceChecked = true;
            if (frameSum / frames > .022)
            {
                game.performanceCut = true;
                resize();
            }
        }
    }
}

titleCard();
try
{
    renderer = new THREE.WebGLRenderer({ canvas: $("field"), antialias: !mobile, powerPreference: "high-performance" });
    renderer.setClearColor("#07080C");
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#07080C", 80, 220);
    scene.add(new THREE.AmbientLight("#A8B2C0", .7));
    const light = new THREE.DirectionalLight("#F3F6FA", 1.35);
    light.position.set(40, 70, 24);
    scene.add(light);
    const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 700);
    game = new Patrol(scene, camera, tones, reducedQuery.matches);
    resize();
    renderer.render(scene, camera);
    updateUI();
    requestAnimationFrame(frame);
}
catch
{
    $("note").textContent = "This browser could not start the 3D view.";
    $("launch").disabled = true;
}
$("launch").focus({ preventScroll: true });
