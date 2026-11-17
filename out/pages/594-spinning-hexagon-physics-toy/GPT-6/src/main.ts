// @ts-nocheck
import { content as c } from "./content.js";
import { createWorld, reset, step, shake, queueShake, setCount, BASE_STEP } from "./physics.js";
import { createRenderer } from "./draw.js";

const icons =
{
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    shake: '<path d="m13 3-8 10h6l-1 8 9-11h-7Z"/>',
    slow: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l-3 3"/>',
    reset: '<path d="M5 8a8 8 0 1 1-1 7M5 3v6h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    mark: '<path d="m12 2 9 5v10l-9 5-9-5V7Z"/><circle cx="9" cy="10" r="1" fill="#FF3DA4"/><circle cx="15" cy="10" r="1" fill="#C7F43F"/><circle cx="12" cy="15" r="1" fill="#FF8A34"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const world = createWorld(reduced);
let running = !reduced;
let started = !reduced;
let accumulator = 0;
let last = 0;
let completedCount = world.balls.length;
const words = c.headline.split(" ");
const lastWord = words.pop();
const lineBreak = Math.ceil((words.length + 1) / 2);
document.title = c.brand;
document.querySelector("#app").innerHTML = `
    <header class="header shell">
        <a class="brand" href="./index.html">${icon("mark")}<span>${c.brand}</span></a>
        <div class="header-right"><span>${c.tagline}</span><button id="how-button">${c.actions.how}${icon("plus")}</button></div>
    </header>
    <main class="shell">
        <section class="intro">
            <div><p class="eyebrow">${c.eyebrow}</p><h1><span>${words.slice(0, lineBreak).join(" ")}</span> ${words.slice(lineBreak).join(" ")} <em>${lastWord}</em></h1><p class="intro-copy">${c.intro}</p></div>
            <div class="candy-note"><div class="swatches">${c.palette.map(color => `<i style="--c:${color}"></i>`).join("")}</div><span>${c.swatch}</span></div>
        </section>
        <section class="workspace">
            <div class="arena">
                <div class="arena-heading"><h2>${c.toy}</h2><span id="status"></span></div>
                <div class="stage"><div class="pink-shape"></div><div class="orange-shape"></div><canvas id="canvas" role="img" aria-label="${c.caption}"></canvas></div>
                <div class="transport">
                    <button id="pause"></button>
                    <button id="shake" class="shake" aria-label="${c.actions.shake}">${icon("shake")}<span class="desktop-label">${c.actions.shake}</span><span class="mobile-label">${c.actions.shakeShort}</span></button>
                    <button id="slow" class="slow" aria-label="${c.actions.slow}" aria-pressed="false">${icon("slow")}<span class="desktop-label">${c.actions.slow}</span><span class="mobile-label">${c.actions.slowShort}</span></button>
                    <output id="time"></output>
                </div>
            </div>
            <details class="tuning" id="tuning" open>
                <summary><span><strong>${c.lab}</strong><small>${c.labHelper}</small></span><span class="mobile-summary" id="lab-summary"></span><span class="disclosure-plus">${icon("plus")}</span></summary>
                <div class="lab-body">
                    <div class="ranges">${c.controls.map(control => `
                        <div class="control" style="--accent:${control.color}">
                            <div class="control-heading"><label for="${control.key}">${control.label}</label>
                            ${control.key === "count" ? `<div class="count-actions"><button id="fewer" aria-label="${c.actions.fewer}">${icon("minus")}</button>` : ""}
                            <output id="${control.key}-value" for="${control.key}"></output>
                            ${control.key === "count" ? `<button id="more" aria-label="${c.actions.more}">${icon("plus")}</button></div>` : ""}
                            </div>
                            <input type="range" id="${control.key}" min="${control.min}" max="${control.max}" step="${control.step}">
                            <p>${control.helper}</p>
                        </div>`).join("")}</div>
                    <div class="presets">${c.presets.map((preset, i) => `<button data-preset="${i}" aria-pressed="false"><span>${preset.name}<small>${preset.description}</small></span>${icon("check")}</button>`).join("")}</div>
                    <button id="reset" class="reset">${icon("reset")}${c.actions.reset}</button>
                </div>
            </details>
        </section>
        <div class="under-workspace"><span id="scene-summary"></span><span id="feedback">${c.keyboard.hint}</span></div>
        <section class="explanation">
            <details id="how"><summary><span class="how-pill">${c.actions.how}${icon("plus")}</span><span class="teaser">${c.how.teaser}</span></summary>
                <div class="facts">${c.how.rows.map(row => `<p><strong>${row[0]}</strong><br>${row[1]}</p>`).join("")}</div><p class="disclaimer">${c.how.disclaimer}</p>
            </details>
            <details class="keyboard"><summary>${c.keyboard.title}</summary><p>${c.keyboard.help}</p></details>
        </section>
    </main>
    <footer class="shell"><span>${c.brand}</span><div><span>${c.footer}</span><a href="${c.creditUrl}" target="_blank" rel="noreferrer">${c.credit}</a></div></footer>
    <p class="sr-only" id="announcement" role="status" aria-live="polite"></p>
    <p class="sr-only" id="accessible-summary"></p>`;

const $ = id => document.getElementById(id);
const announce = text =>
{
    $("announcement").textContent = text;
    $("feedback").textContent = text;
};
const direction = () => world.spin > 0 ? c.status.clockwise : world.spin < 0 ? c.status.counterclockwise : c.status.stopped;
function summary()
{
    return `${world.balls.length} ${c.status.balls} · ${Math.abs(world.spin)} ${c.status.degrees} ${direction()} · ${world.slow ? c.status.slow : c.status.normal}`;
}
function sync()
{
    for (const control of c.controls)
    {
        const value = world[control.key];
        $(control.key).value = String(value);
        $(control.key).style.setProperty("--fill", `${(value - control.min) / (control.max - control.min) * 100}%`);
        $(`${control.key}-value`).textContent = control.key === "gravity" ? `${value.toFixed(2)}x` :
            control.key === "friction" ? value.toFixed(2) : control.key === "spin" ?
                `${Math.abs(value)} ${c.status.degrees} ${direction()}` :
                world.balls.length < world.count ? `${world.balls.length} / ${world.count}` : String(world.balls.length);
        if (control.key === "spin") $(`${control.key}-value`).setAttribute("aria-label", `${Math.abs(value)} ${c.status.degrees} ${direction()}`);
    }
    const state = running ? c.status.live : !started && reduced ? c.status.reduced : c.status.paused;
    $("status").textContent = world.balls.length < world.count ? c.status.adding : state;
    $("status").classList.toggle("is-paused", !running);
    const pauseText = running ? c.actions.pause : !started && reduced ? c.actions.start : c.actions.resume;
    $("pause").innerHTML = `${icon(running ? "pause" : "play")}<span>${pauseText}</span>`;
    $("pause").setAttribute("aria-pressed", String(!running));
    $("slow").setAttribute("aria-pressed", String(world.slow));
    $("slow").setAttribute("aria-label", world.slow ? c.actions.slowOn : c.actions.slow);
    $("time").textContent = world.slow ? c.status.slow : c.status.normal;
    $("lab-summary").textContent = `${world.balls.length} ${c.status.balls} · ${world.gravity.toFixed(2)}x`;
    $("scene-summary").textContent = summary();
    $("accessible-summary").textContent = `${state}. ${summary()}`;
    $("fewer").disabled = world.count === 4;
    $("more").disabled = world.count === 40;
    document.querySelectorAll("[data-preset]").forEach(button =>
    {
        const preset = c.presets[Number(button.dataset.preset)];
        button.setAttribute("aria-pressed", String(world.balls.length === preset.count &&
            ["gravity", "friction", "spin", "count"].every(key => world[key] === preset[key])));
    });
    if (world.balls.length === world.count && completedCount !== world.count)
    {
        completedCount = world.count;
        announce(`${world.count} ${c.status.balls}.`);
    }
}
function togglePause()
{
    running = !running;
    if (running)
    {
        started = true;
        if (world.pendingShake.length) shake(world);
    }
    accumulator = 0;
    last = 0;
    announce(running ? c.status.live : c.status.paused);
    sync();
}
function doShake()
{
    queueShake(world);
    if (running) shake(world);
    announce(running ? c.status.shaken : c.status.ready);
    sync();
}
function toggleSlow()
{
    world.slow = !world.slow;
    accumulator = 0;
    sync();
}
function doReset()
{
    reset(world);
    accumulator = 0;
    completedCount = 20;
    announce(c.status.reset);
    sync();
}
for (const control of c.controls)
{
    $(control.key).addEventListener("input", event =>
    {
        const value = Number(event.target.value);
        if (control.key === "count") setCount(world, value);
        else world[control.key] = value;
        sync();
    });
}
$("fewer").addEventListener("click", () => { setCount(world, world.count - 1); sync(); });
$("more").addEventListener("click", () => { setCount(world, world.count + 1); sync(); });
$("pause").addEventListener("click", togglePause);
$("shake").addEventListener("click", doShake);
$("slow").addEventListener("click", toggleSlow);
$("reset").addEventListener("click", doReset);
document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () =>
{
    const preset = c.presets[Number(button.dataset.preset)];
    for (const key of ["gravity", "friction", "spin"]) world[key] = preset[key];
    setCount(world, preset.count);
    sync();
}));
$("how-button").addEventListener("click", () =>
{
    $("how").open = true;
    const element = $("how").querySelector("summary");
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "nearest" });
});
const mobile = matchMedia("(max-width: 759px)");
$("tuning").open = !mobile.matches;
mobile.addEventListener("change", () => { $("tuning").open = !mobile.matches; });
$("tuning").querySelector("summary").addEventListener("click", event =>
{
    if (!mobile.matches) event.preventDefault();
});
document.addEventListener("keydown", event =>
{
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat ||
        event.target.closest("input,textarea,select,button,a,summary,[contenteditable]")) return;
    const action = { " ": togglePause, s: doShake, m: toggleSlow, r: doReset }[event.key.toLowerCase()];
    if (action)
    {
        event.preventDefault();
        action();
    }
});
document.addEventListener("visibilitychange", () => { accumulator = 0; last = 0; });
const draw = createRenderer($("canvas"));
function frame(timestamp)
{
    const delta = last ? Math.min((timestamp - last) / 1000, 0.05) : 0;
    last = timestamp;
    if (!document.hidden && running)
    {
        accumulator += delta * (world.slow ? 0.25 : 1);
        let iterations = 0;
        while (accumulator >= BASE_STEP && iterations++ < 12)
        {
            step(world);
            accumulator -= BASE_STEP;
        }
        if (accumulator >= BASE_STEP) accumulator = 0;
        if (world.balls.length !== completedCount) sync();
    }
    draw(world, running && !document.hidden ? accumulator / BASE_STEP : 1);
    requestAnimationFrame(frame);
}
sync();
requestAnimationFrame(frame);
if (new URLSearchParams(location.search).has("qa"))
{
    Object.defineProperty(window, "__toy", { value:
    {
        world, step, reset: doReset,
        get running() { return running; },
        get accumulator() { return accumulator; },
        sync
    } });
}
