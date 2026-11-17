import { content as c } from "./content.js";
import { createGlobe } from "./globe.js";

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const paths =
{
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    move: '<path d="M5 3v16h16M5 19l9-9M2 6l3-3 3 3m10 10 3 3-3 3M10 10h4v4"/>',
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8 4l4 4 4-4M8 20l4-4 4 4M3 11l5-1-1-5m14 8-5 1 1 5M3 13l5 1-1 5m14-8-5-1 1-5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>'
};
const icon = (name, className = "") => `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
const mark = '<svg viewBox="0 0 32 40" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="16" cy="15" r="12"/><path d="M8 26h16l3 7H5zM11 32h10M11 20v-7l5-5 5 5v7M13 14h6"/><path d="M9 10h.1M22 8h.1M23 18h.1M8 19h.1" stroke-width="2.2" stroke-linecap="round"/></svg>';
const thumbnail = (index) =>
{
    const common = '<ellipse cx="32" cy="50" rx="27" ry="5" fill="#849d8a"/><path d="M7 48q25-10 50 0" fill="#dfe7d9"/>';
    const shapes =
    [
        '<path d="M9 43 16 24l7 19zM42 43l7-25 8 25z" fill="#42664d"/><path d="m9 37 7-13 5 13m22-3 6-16 5 16" fill="#dce8df"/><path d="M21 31h24v17H21z" fill="#8a6142"/><path d="m17 32 15-15 17 15z" fill="#e6e9db"/><path d="M25 35h5v6h-5m12-6h5v6h-5" fill="#f2c477"/><path d="M32 40h4v8h-4" fill="#9a4a44"/>',
        '<path d="m17 47 10-10 19 3 7 9z" fill="#7b8e88"/><path d="m26 40 4-24h9l5 24z" fill="#eee7d7"/><path d="m28 27 1-6h11l1 6z" fill="#9a4a44"/><path d="M29 12h12v7H29z" fill="#f2c477"/><path d="m26 12 9-7 9 7z" fill="#e6e9db"/><path d="M9 45h11m30-5h7" stroke="#abd3d0" stroke-width="3"/>',
        '<path d="M10 48V27h10v21m3 0V17h10v31m3 0V8h10v40m3 0V28h8v20" fill="#93a194"/><path d="M8 27h14m-1-10h14m-1-9h14m-1 20h12" stroke="#f3efe3" stroke-width="2"/><path d="M13 31v3m4 4v3m9-20v3m3 4v3m10-18v4m4 5v3m8 7v3" stroke="#f2c477" stroke-width="2"/>'
    ];
    return `<svg class="thumbnail" viewBox="0 0 64 58" aria-hidden="true">${common}${shapes[index]}</svg>`;
};
document.title = `${c.brand} — ${c.collection}`;
const words = c.headline.split(" ");
document.querySelector("#app").innerHTML = `
    <header>
        <div class="brand">${mark}<span>${escape(c.brand)}</span></div>
        <div class="header-right"><span class="tagline">${escape(c.tagline)}</span><button class="help-button" id="help-open">${icon("help")}${escape(c.help)}</button></div>
    </header>
    <main>
        <section class="intro" aria-labelledby="welcome">
            <p class="eyebrow">${escape(c.collection)}</p>
            <h1 id="welcome">${escape(words.slice(0, -2).join(" "))} <em>${escape(words.slice(-2).join(" "))}</em></h1>
            <p class="intro-copy">${escape(c.introduction)}</p>
            <ol class="cues">${c.cues.map((cue, index) => `<li><span class="cue-number">0${index + 1}</span><div><strong>${escape(cue[0])}</strong><p>${escape(cue[1])}</p></div></li>`).join("")}</ol>
            <p class="mobile-cues">${escape(c.mobileCues)}</p>
        </section>
        <section class="stage" aria-label="${escape(c.tagline)}">
            <canvas tabindex="0" role="img"></canvas>
            <div class="stage-top"><span class="stage-overline">${escape(c.eyebrow)}</span><span class="motion-status" id="motion-status">${escape(c.motion)}</span></div>
            <div class="stage-bottom"><span class="scene-type" id="scene-type"></span><h2 class="scene-title" id="scene-title"></h2></div>
            <div class="drag-hint">${icon("move")}<span>${escape(matchMedia("(pointer: coarse)").matches ? c.touchDrag : c.drag)}</span></div>
        </section>
        <aside class="workbench" aria-labelledby="world-label">
            <h2 id="world-label"><span class="section-number">01</span>${escape(c.choose)}</h2>
            <div class="scene-choices">${c.scenes.map((name, index) => `<button class="scene-choice" data-scene="${index}" aria-pressed="${index === 0}">${thumbnail(index)}<span><span class="choice-name">${escape(name)}</span><span class="choice-type">${escape(c.types[index])}</span></span>${icon("check", "selection-check")}</button>`).join("")}</div>
            <section class="message-section">
                <label for="message"><span class="section-number">02</span>${escape(c.messageLabel)}</label>
                <div class="input-wrap"><input id="message" maxlength="28" value="${escape(c.message)}" aria-describedby="message-description"></div>
                <span class="sr-only" id="message-description">${escape(c.messageDescription)}</span>
                <div class="field-meta"><span id="message-helper">${escape(c.messageHelper)}</span><span id="message-count"></span></div>
            </section>
            <div class="actions">
                <button class="action primary" id="shake">${icon("move")}<span>${escape(c.shake)}</span></button>
                <button class="action" id="settle">${icon("snow")}<span>${escape(c.settle)}</span></button>
            </div>
            <div class="keyboard-hint" aria-hidden="true"><span><kbd>S</kbd> ${escape(c.cues[0][0])}</span><span><kbd>R</kbd> ${escape(c.settle)}</span></div>
            <p class="bench-foot" id="world-description">${escape(c.descriptions[0])}</p>
        </aside>
    </main>
    <footer><span>${escape(c.footer)}</span><a href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${escape(c.credit)}</a></footer>
    <div class="sr-only" id="announcements" role="status" aria-live="polite"></div>
    <dialog aria-labelledby="help-title">
        <button class="close-icon" aria-label="${escape(c.closeLabel)}">${icon("close")}</button>
        <h2 id="help-title">${escape(c.helpTitle)}</h2>
        ${c.helpSteps.map((step) => `<h3>${escape(step[0])}</h3><p>${escape(step[1])}</p>`).join("")}
        <p>${escape(c.helpSensor)}</p><p>${escape(c.helpMotion)}</p>
        <a class="dialog-credit" href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${escape(c.credit)}</a>
        <button class="action primary" id="help-close">${escape(c.close)}</button>
    </dialog>`;

const canvas = document.querySelector("canvas");
const input = document.querySelector("#message");
const dialog = document.querySelector("dialog");
const helpOpen = document.querySelector("#help-open");
let selected = 0;
let engine;
let fallbackElement;
let fallbackTimer;
let tiltEnabled = false;
let returnFocus;
function announce(text)
{
    document.querySelector("#announcements").textContent = text;
}
function motion(active)
{
    const element = document.querySelector("#motion-status");
    element.textContent = active ? c.motion : c.rest;
    element.dataset.rest = String(!active);
}
function shakeLabel(active)
{
    document.querySelector("#shake span").textContent = active ? c.shaking : c.shake;
}
function fallbackDraw()
{
    if (!fallbackElement)
    {
        fallbackElement = document.createElement("div");
        fallbackElement.className = "fallback";
        fallbackElement.tabIndex = 0;
        fallbackElement.setAttribute("role", "img");
        canvas.replaceWith(fallbackElement);
        fallbackElement.addEventListener("keydown", (event) =>
        {
            if (event.key.toLowerCase() === "s") shake();
            else if (event.key.toLowerCase() === "r") settle();
            else if (event.key === "ArrowRight" || event.key === "ArrowLeft")
            {
                event.preventDefault();
                select((selected + (event.key === "ArrowRight" ? 1 : 2)) % 3);
            }
        });
    }
    fallbackElement.setAttribute("aria-label", `${c.scenes[selected]}. ${c.keyboard}`);
    const sceneArt = thumbnail(selected).replace('class="thumbnail"', 'x="115" y="190" width="170" height="170"');
    let flakes = "";
    for (let i = 0; i < 30; i++)
    {
        const angle = i * 2.399;
        const radius = Math.sqrt((i + 1) / 30) * 130;
        flakes += `<circle cx="${200 + Math.cos(angle) * radius}" cy="${200 + Math.sin(angle) * radius}" r="2" fill="#f3efe3"/>`;
    }
    fallbackElement.innerHTML = `<svg viewBox="0 0 400 440" aria-hidden="true"><circle cx="200" cy="200" r="160" fill="#162f2b" stroke="#a1c9c4" stroke-width="2"/>${sceneArt}<g class="fallback-flakes">${flakes}</g><path d="M55 346h290l12 58H43z" fill="#5c3828" stroke="#d2a85f" stroke-width="2"/><rect x="93" y="362" width="214" height="27" rx="2" fill="#d2a85f"/><text x="200" y="380" text-anchor="middle" fill="#35251e" font-family="Fraunces,serif" font-size="12">${escape(input.value.trim())}</text></svg><p class="fallback-note">${escape(c.fallback)}</p>`;
}
try
{
    engine = createGlobe(canvas, { onScene: select, onMotion: motion, onShake: shakeLabel });
}
catch
{
    fallbackDraw();
    motion(false);
}
function select(index)
{
    selected = index;
    document.querySelectorAll(".scene-choice").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    document.querySelector("#scene-title").textContent = c.scenes[index];
    document.querySelector("#scene-type").textContent = c.types[index];
    document.querySelector("#world-description").textContent = c.descriptions[index];
    canvas.setAttribute("aria-label", `${c.scenes[index]}. ${c.keyboard}`);
    if (engine) engine.setScene(index);
    else fallbackDraw();
    announce(`${c.sceneAnnouncement} ${c.scenes[index]}.`);
}
function updateMessage()
{
    input.value = input.value.slice(0, 28);
    document.querySelector("#message-count").textContent = `${input.value.length}/28`;
    document.querySelector("#message-helper").textContent = input.value.trim() ? c.messageHelper : c.emptyMessage;
    if (engine) engine.setMessage(input.value);
    else fallbackDraw();
}
function shake()
{
    if (engine)
    {
        engine.shake();
    }
    else
    {
        clearTimeout(fallbackTimer);
        fallbackElement.classList.remove("burst");
        void fallbackElement.offsetWidth;
        fallbackElement.classList.add("burst");
        motion(true);
        shakeLabel(true);
        fallbackTimer = setTimeout(() =>
        {
            fallbackElement.classList.remove("burst");
            motion(false);
            shakeLabel(false);
        }, 600);
    }
}
function settle()
{
    if (engine) engine.settle();
    else
    {
        clearTimeout(fallbackTimer);
        fallbackElement.classList.remove("burst");
        motion(false);
        shakeLabel(false);
    }
}
select(0);
input.addEventListener("input", updateMessage);
document.querySelectorAll(".scene-choice").forEach((button) => button.addEventListener("click", () => select(Number(button.dataset.scene))));
document.querySelector("#shake").addEventListener("click", shake);
document.querySelector("#settle").addEventListener("click", settle);
document.fonts.ready.then(updateMessage);
updateMessage();
function closeHelp()
{
    dialog.close();
}
helpOpen.addEventListener("click", () =>
{
    returnFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector(".close-icon").focus();
});
dialog.querySelector(".close-icon").addEventListener("click", closeHelp);
document.querySelector("#help-close").addEventListener("click", closeHelp);
dialog.addEventListener("close", () => returnFocus?.focus());
dialog.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab") return;
    const controls = dialog.querySelectorAll("button, a[href], input, [tabindex='0']");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first)
    {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
        event.preventDefault();
        first.focus();
    }
});
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeHelp();
    }
});
if ("DeviceOrientationEvent" in window && (navigator.maxTouchPoints > 0 || matchMedia("(pointer: coarse)").matches))
{
    const button = document.createElement("button");
    button.className = "action tilt-button";
    button.innerHTML = `${icon("phone")}<span>${escape(c.enableTilt)}</span>`;
    document.querySelector(".actions").append(button);
    const sensorStatus = document.createElement("p");
    sensorStatus.className = "sensor-status";
    sensorStatus.setAttribute("role", "status");
    document.querySelector(".actions").after(sensorStatus);
    button.addEventListener("click", async () =>
    {
        if (!engine)
        {
            sensorStatus.textContent = c.tiltUnavailable;
            return;
        }
        if (tiltEnabled)
        {
            tiltEnabled = false;
            engine.setSensor(false);
            sensorStatus.textContent = c.tiltOff;
        }
        else
        {
            try
            {
                const permission = typeof DeviceOrientationEvent.requestPermission === "function" ? await DeviceOrientationEvent.requestPermission() : "granted";
                if (permission !== "granted")
                {
                    sensorStatus.textContent = c.tiltDenied;
                    return;
                }
                engine.setSensor(true);
                tiltEnabled = true;
                sensorStatus.textContent = `${c.tiltOn}. ${c.sensorHelp}`;
            }
            catch
            {
                sensorStatus.textContent = c.tiltUnavailable;
                return;
            }
        }
        button.querySelector("span").textContent = tiltEnabled ? c.disableTilt : c.enableTilt;
    });
}
// Read-only local diagnostics support physics and accessibility verification.
Object.defineProperty(window, "__globe",
{
    value: Object.freeze({ stats: () => engine ? engine.stats() : { renderer: "SVG", selected, message: input.value.trim() } })
});
window.addEventListener("pagehide", () =>
{
    engine?.dispose();
    clearTimeout(fallbackTimer);
}, { once: true });
