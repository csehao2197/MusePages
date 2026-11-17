import { content } from "./content.js";
import { initialTier, tiers, createGovernor } from "./quality.js";
import { mulberry32 } from "./scene/palette.js";
import { createWater } from "./scene/water.js";
import { createKoi } from "./scene/koi.js";
import { createFlora } from "./scene/flora.js";
import { createParticles } from "./scene/particles.js";
import { createRipples } from "./scene/ripples.js";
import { createSeasons } from "./scene/seasons.js";
import { createNight } from "./scene/night.js";
import { createAudio } from "./audio.js";
import { createUI } from "./ui.js";
import { createInput } from "./input.js";

const query = new URLSearchParams(location.search);
const seasonIndex = content.seasons.findIndex((s) => s.id === query.get("season"));
const season = seasonIndex >= 0 ? seasonIndex : content.seasons.findIndex((s) => s.id === content.startSeason);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const random = mulberry32(7);
export const state =
{
    w: innerWidth, h: innerHeight, u: Math.sqrt(innerWidth * innerHeight) / 1140,
    wide: innerWidth >= 900 && innerWidth >= innerHeight,
    tier: initialTier(), ratio: 1, reduced: reduced.matches, fps: 60, firstFrameMs: null,
    time: 0, season, seasonMix: new Float32Array([0, 0, 0, 0]),
    night: query.has("night") ? Number(query.get("night") === "1") : Number(content.startNight),
    rain: Number(query.get("rain") === "1"), lastTap: null, renderer: null
};
state.seasonMix[season] = 1;
const lifeCanvas = document.querySelector("#life");
const surfaceCanvas = document.querySelector("#surface");
const life = lifeCanvas.getContext("2d");
const surface = surfaceCanvas.getContext("2d");
export const ripples = createRipples(state, random);
const water = createWater(state, random, ripples);
export const koi = createKoi(state, random, ripples);
export const flora = createFlora(state, random, ripples);
const particles = createParticles(state, random, ripples);
const seasons = createSeasons(state);
const night = createNight(state, random, flora);
export const audio = createAudio(state, random);
export const ui = createUI(state, seasons, audio, ripples);
const input = createInput(state, ripples, flora, audio, ui);
let frame = 0;
let last = performance.now();
let resizeTimer;
let first = true;
let closed = false;

function resize()
{
    const oldW = state.w;
    const oldH = state.h;
    state.w = innerWidth;
    state.h = innerHeight;
    state.u = Math.sqrt(state.w * state.h) / 1140;
    state.wide = state.w >= 900 && state.w >= state.h;
    state.ratio = Math.min(devicePixelRatio || 1, tiers[state.tier].dpr);
    for (const f of koi.fish)
    {
        f.x = Math.max(0, Math.min(state.w, f.x * state.w / oldW));
        f.y = Math.max(0, Math.min(state.h, f.y * state.h / oldH));
        for (const point of f.spine)
        {
            point.x *= state.w / oldW;
            point.y *= state.h / oldH;
        }
    }
    for (const c of [lifeCanvas, surfaceCanvas])
    {
        c.width = Math.round(state.w * state.ratio);
        c.height = Math.round(state.h * state.ratio);
    }
    life.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
    surface.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
    water.resize();
    flora.resize();
    ui.resize();
}

function update(dt)
{
    state.time += dt;
    seasons.update(dt);
    input.update(dt);
    ripples.update(dt);
    koi.update(dt);
    flora.update(dt);
    particles.update(dt);
}

function draw()
{
    water.draw();
    life.clearRect(0, 0, state.w, state.h);
    surface.clearRect(0, 0, state.w, state.h);
    koi.draw(life);
    ripples.drawFood(life);
    flora.draw(surface);
    particles.draw(surface);
    ripples.draw(surface);
    night.draw(surface);
    input.draw(surface);
}

const governor = createGovernor(state, () =>
{
    koi.quality();
    resize();
});
function animate(now)
{
    if (closed || document.hidden) return;
    const elapsed = Math.max(1, now - last);
    last = now;
    const dt = Math.min(1 / 30, elapsed / 1000);
    update(dt);
    draw();
    if (first)
    {
        state.firstFrameMs = performance.now();
        first = false;
    }
    else governor(elapsed);
    frame = requestAnimationFrame(animate);
}

Object.defineProperty(window, "__pond",
{
    configurable: false,
    writable: false,
    value: Object.freeze(
    {
        get firstFrameMs() { return state.firstFrameMs; },
        get tier() { return state.tier; },
        get fps() { return Math.round(state.fps * 10) / 10; }
    })
});
resize();
for (let i = 0; i < 300; i++)
{
    state.time += 1 / 60;
    koi.update(1 / 60);
}
frame = requestAnimationFrame(animate);
window.addEventListener("resize", () =>
{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
});
reduced.addEventListener("change", (event) => { state.reduced = event.matches; });
document.addEventListener("visibilitychange", () =>
{
    cancelAnimationFrame(frame);
    if (!document.hidden && !closed)
    {
        last = performance.now();
        frame = requestAnimationFrame(animate);
    }
});
window.addEventListener("pagehide", () =>
{
    closed = true;
    cancelAnimationFrame(frame);
    clearTimeout(resizeTimer);
    input.close();
    ui.close();
    audio.close();
});
