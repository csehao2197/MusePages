import * as T from "./vendor/three.module.js";
import { C } from "./content.js";
import { makeTrack, at, lamps } from "./track.js";
import { makeCar, placeCar } from "./cars.js";
import { Race } from "./race.js";
import { createInput } from "./input.js";
import { Sound } from "./audio.js";
import { HUD } from "./hud.js";

document.title = C.title;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const input = createInput();
const sound = new Sound();
let storage = null;
try { storage = localStorage; }
catch { /* The race remains local and playable without persistent storage. */ }
const race = new Race(storage, (text) => document.getElementById("announce").textContent = text);
let controlsReturn = "start";
let renderer;
let camera;
let scene;
let playerMesh;
let ghostMesh;
let rivals = [];
let lastState = "start";
const hud = new HUD(race, async (action) =>
{
    input.clear();
    if (action === "sound")
    {
        await sound.toggle();
        hud.sound = sound.enabled;
    }
    if ((action === "start" || action === "restart") && !hud.failed) race.start();
    if (action === "pause") race.pause();
    if (action === "resume") race.resume();
    if (action === "home")
    {
        race.reset();
        race.state = "start";
        controlsReturn = "start";
    }
    if (action === "controls")
    {
        controlsReturn = race.state;
        race.state = "controls";
    }
    if (action === "back") race.state = controlsReturn;
    if (action === "clear") race.clearBest();
    hud.render();
    input.bind();
});
input.onCount = (n) => sound.tone(n === 3 ? 660 : 440, n === 3 ? .14 : .08);
input.onBoost = () => sound.boost();
input.action = (key) =>
{
    if (key === "Enter")
    {
        document.querySelector(".sheet button.primary")?.click();
        return;
    }
    if (key === "Escape" && race.state === "controls") hud.action("back");
    else if (key === "Escape" || key === "KeyP")
    {
        if (race.state === "paused") hud.action("resume");
        else if (["racing", "countdown"].includes(race.state)) hud.action("pause");
    }
};
addEventListener("blur", () =>
{
    race.pause();
    input.clear();
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden)
    {
        race.pause();
        input.clear();
        sound.update(0, false);
        hud.update();
    }
});
await document.fonts.ready;
try
{
    renderer = new T.WebGLRenderer({ canvas: document.getElementById("world"), antialias: true, powerPreference: "high-performance" });
}
catch
{
    hud.failed = true;
}
if (renderer)
{
    scene = new T.Scene();
    scene.fog = new T.FogExp2("#e0a06a", .011);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    camera = new T.PerspectiveCamera(68, innerWidth / innerHeight, .1, 1800);
    scene.add(new T.HemisphereLight("#ffd2a8", "#6b5344", .5));
    const sun = new T.DirectionalLight("#ffb067", 2.35);
    sun.position.set(-90, 22, 40);
    sun.castShadow = true;
    const shadowSize = innerWidth < 800 ? 1024 : 2048;
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    sun.shadow.camera.far = 250;
    sun.shadow.bias = -.0003;
    scene.add(sun);
    scene.add(sun.target);
    const sky = new T.Mesh(new T.SphereGeometry(1300, 32, 16), new T.ShaderMaterial({
        side: T.BackSide,
        uniforms: { sunDirection: { value: sun.position.clone().normalize() } },
        vertexShader: "varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader: `varying vec3 v; uniform vec3 sunDirection;
            void main()
            {
                vec3 d=normalize(v);
                vec3 horizon=vec3(.906,.631,.353);
                vec3 zenith=vec3(.118,.227,.373);
                vec3 low=vec3(.769,.416,.227);
                vec3 c=mix(horizon,zenith,smoothstep(0.,.75,d.y));
                c=mix(c,low,1.-smoothstep(-.45,0.,d.y));
                float sun=smoothstep(.9982,.9996,dot(d,sunDirection));
                c=mix(c,vec3(1.,.945,.8),sun);
                gl_FragColor=vec4(c,1.);
            }`,
        depthWrite: false
    }));
    scene.add(sky);
    makeTrack(scene);
    playerMesh = makeCar("#c4512c", 14);
    ghostMesh = makeCar("#c4512c", 14, true);
    scene.add(playerMesh, ghostMesh);
    rivals = ["#2f6f62", "#d7a441", "#3d4c7a"].map((color, i) =>
    {
        const car = makeCar(color, [7, 22, 3][i]);
        scene.add(car);
        return car;
    });
    const dust = new T.InstancedMesh(new T.IcosahedronGeometry(.12, 0), new T.MeshBasicMaterial({ color: "#c4a15a", transparent: true, opacity: .5 }), 12);
    dust.visible = false;
    scene.add(dust);
    const dustMatrix = new T.Matrix4();
    let qualityCut = false;
    let frameTotal = 0;
    let frameCount = 0;
    function resize()
    {
        renderer.setPixelRatio(qualityCut ? 1 : Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.75));
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
    }
    addEventListener("resize", resize);
    resize();
    let previous = performance.now();
    let accumulator = 0;
    const target = new T.Vector3();
    const look = new T.Vector3();
    let first = true;
    let lastBanner = "";
    function frame(now)
    {
        const rawDt = (now - previous) / 1000;
        const dt = Math.min(.1, rawDt);
        previous = now;
        if (document.hidden)
        {
            accumulator = 0;
            requestAnimationFrame(frame);
            return;
        }
        accumulator = Math.min(.1, accumulator + dt);
        while (accumulator >= 1 / 60)
        {
            race.step(1 / 60, input);
            accumulator -= 1 / 60;
        }
        if (lastState !== race.state)
        {
            input.clear();
            if (race.state === "podium")
            {
                [523, 659, 784].forEach((frequency, i) => sound.tone(frequency, .12, i * .16));
            }
            lastState = race.state;
            hud.render();
            input.bind();
        }
        const p = race.player;
        placeCar(playerMesh, p);
        rivals.forEach((mesh, i) => placeCar(mesh, race.rivals[i]));
        const ghost = race.ghost();
        ghostMesh.visible = Boolean(ghost);
        if (ghost) placeCar(ghostMesh, ghost);
        const f = at(p.s);
        const forward = new T.Vector3(Math.cos(p.yaw), 0, Math.sin(p.yaw));
        const right = new T.Vector3(-Math.sin(p.yaw), 0, Math.cos(p.yaw));
        const parked = race.state === "start" || race.state === "controls" && controlsReturn === "start";
        const mobile = innerWidth < 700;
        if (parked)
        {
            target.set(p.x, 2, p.z).addScaledVector(forward, mobile ? -11 : -12).addScaledVector(right, mobile ? 5 : 10);
            target.y += mobile ? 7 : 5;
            look.set(p.x, 2.5, p.z).addScaledVector(forward, 4).addScaledVector(right, mobile ? -1 : -5);
            if (mobile) look.y -= 7;
            if (!reduced) target.y += Math.sin(now / 6000 * Math.PI * 2) * .15;
        }
        else
        {
            target.set(p.x, f.p.y, p.z).addScaledVector(forward, mobile ? -9.2 : -7.2);
            target.y += mobile ? 4 : 2.6;
            look.set(p.x, f.p.y + .7, p.z).addScaledVector(forward, 6);
        }
        camera.position.lerp(target, first ? 1 : 1 - Math.exp(-8 * dt));
        camera.lookAt(look);
        if (!reduced && !parked) camera.rotateZ(-p.steer * Math.PI / 45);
        const desiredFov = (mobile ? 76 : 68) + (!reduced && p.boost > 0 ? 6 : 0);
        if (camera.fov !== desiredFov)
        {
            camera.fov += (desiredFov - camera.fov) * Math.min(1, dt * 8);
            camera.updateProjectionMatrix();
        }
        const lampColor = race.state === "countdown" ? race.count < 2.1 ? "#d8452f" : "#d6e38a" :
            race.state === "racing" && race.clock < 1.1 ? "#d6e38a" : "#1c1612";
        for (const material of lamps)
        {
            material.color.set(lampColor);
            material.emissive.set(lampColor === "#1c1612" ? "#000000" : lampColor);
            material.emissiveIntensity = reduced ? .2 : .6;
        }
        dust.visible = !reduced && p.drifting && race.state === "racing";
        if (dust.visible)
        {
            for (let i = 0; i < 12; i++)
            {
                const age = ((now / 750 + i / 12) % 1);
                const side = i % 2 ? -1 : 1;
                dustMatrix.makeTranslation(p.x - forward.x * (2 + age * 5) + right.x * side,
                    f.p.y + .1 + age * .8, p.z - forward.z * (2 + age * 5) + right.z * side);
                dust.setMatrixAt(i, dustMatrix);
            }
            dust.instanceMatrix.needsUpdate = true;
        }
        sun.target.position.set(p.x, 0, p.z);
        sun.position.set(p.x - 90, 22, p.z + 40);
        if (race.visibleBanner !== lastBanner)
        {
            lastBanner = race.visibleBanner;
            if ([C.labels.wrong, C.labels.reset].includes(lastBanner)) document.querySelector("#announce").textContent = lastBanner;
        }
        hud.update();
        sound.update(p.speed, race.state === "racing");
        renderer.render(scene, camera);
        if (first)
        {
            hud.render();
            first = false;
            document.body.dataset.ready = "true";
        }
        if (frameCount < 180 && rawDt < 1)
        {
            frameTotal += rawDt;
            frameCount++;
            if (frameCount === 180 && frameTotal / 180 > .022)
            {
                qualityCut = true;
                sun.shadow.mapSize.set(1024, 1024);
                sun.shadow.map?.dispose();
                sun.shadow.map = null;
                resize();
            }
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
else
{
    hud.render();
    document.body.dataset.ready = "fallback";
    document.querySelector("[data-action=start]")?.setAttribute("disabled", "");
}

// Read-only state makes browser playtests inspect real simulation, not displayed counters.
Object.defineProperty(window, "raceSnapshot", { value: () => race.snapshot() });
