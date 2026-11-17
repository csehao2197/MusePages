import { content as C } from "./content.js";
import { model, timing, phaseTime } from "./model.js";
import { createDiagram, createValveCloseup } from "./diagram.js";
import { createTrace, createStaticTrace } from "./trace.js";
import { connectScroll } from "./scroll.js";
import { icons } from "./assets/icons.js";

function icon(name)
{
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name].map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([key]) => key !== "key").map(([key, value]) => `${key}="${value}"`).join(" ")}></${tag}>`).join("")}</svg>`;
}
const mark = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0A10 10 0 0 0 10 20Z" fill="#1F4BFF"/><path d="M10 0A10 10 0 0 1 10 20Z" fill="#FF1F3D"/></svg>`;
const svg = (id, classes = "") => `<svg id="${id}" class="diagram ${classes}"></svg>`;
const heading = (title, intro) => `<div class="section-heading"><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ""}</div>`;
const range = (id) => `<input id="${id}" class="rate-slider" aria-label="${C.instrument.label}" type="range" min="40" max="180" step="1" value="72">`;
const controls = (classes = "") => `<div class="phase-controls ${classes}"><button data-step="-1">${icon("chevron-left")}${C.instrument.previous}</button><button data-step="1">${C.instrument.next}${icon("chevron-right")}</button><button class="back-live">${icon("play")}${C.instrument.live}</button></div>`;
const instrument = `<div class="instrument"><div class="instrument-top"><label for="hero-rate">${C.instrument.label}</label><span class="mono instrument-model">${C.instrument.model}</span></div><div class="rate-value"><output class="bpm" for="hero-rate">72</output><span>${C.instrument.unit}</span><button id="pause" class="icon-button" aria-label="${C.instrument.pause}" aria-pressed="false">${icon("pause")}</button></div>${range("hero-rate")}<div class="ticks">${[40, 60, 90, 120, 150, 180].map((n) => `<span>${n}</span>`).join("")}</div><div class="phase-line"><span class="status-dot"></span><output id="phase-name"></output><span id="mode-label"></span></div><div class="durations"><span>${C.instrument.systole} <output class="systole"></output> s</span><span>${C.instrument.diastole} <output class="diastole"></output> s</span></div><div class="share-bar"><span id="systole-share"></span></div></div>`;
document.querySelector("#header").innerHTML = `<a class="brand" href="#beat">${mark}${C.brand}</a><nav aria-label="Sections">${C.nav.map(([id, text]) => `<a href="#${id}">${text}</a>`).join("")}</nav>`;
document.querySelector("#app").innerHTML = `
    <section id="beat" class="hero">
        <div class="hero-upper wrap">
            <div class="hero-title"><p class="eyebrow">${C.eyebrow}</p><h1>${C.title}</h1></div>
            <p class="hero-sub">${C.sub}</p>
            ${instrument}
            <div class="hero-actions"><a class="button primary" href="#path">${C.instrument.follow}${icon("chevron-right")}</a><a class="button" href="#moments">${C.instrument.step}</a></div>
            <div class="hero-plate">${svg("hero-diagram")}<p class="orientation">${C.orientation}</p>${controls("reduced-controls")}</div>
        </div>
        <div class="hero-trace trace-strip"><div class="trace-caption"><span>${C.traceCaption}</span><div class="trace-marks">${C.marks.map(([name], i) => `<span data-mark="${i}">${name}</span>`).join("")}<span id="mark-sentence"></span></div></div><canvas id="hero-trace" role="img" aria-label="${C.traceDescription}"></canvas></div>
        <div class="legend wrap">${C.legend.map((label, i) => `<span><i class="legend-dot legend-${i}"></i>${label}</span>`).join("")}</div>
    </section>
    <section id="path" class="section wrap">
        ${heading(C.path.title, C.path.intro)}
        <div class="path-layout"><div class="path-steps">${C.path.steps.map(([name, title, caption], i) => `<article class="path-step" id="stop-${i + 1}"><div class="step-card"><p class="eyebrow ${i < 5 ? "blue-text" : "red-text"}">${String(i + 1).padStart(2, "0")} · ${name}</p><h3>${title}</h3><p>${caption}</p></div></article>`).join("")}</div>
        <div class="path-sticky"><p id="active-stop" class="mono"></p>${svg("path-diagram")}<canvas id="path-trace" aria-label="${C.traceDescription}" role="img"></canvas><div class="path-dots">${C.path.steps.map(([name], i) => `<a class="path-dot" href="#stop-${i + 1}" aria-label="${C.stopLabel} ${i + 1}: ${name}"></a>`).join("")}</div></div></div>
    </section>
    <section id="moments" class="section wrap">${heading(...C.moments)}
        <div class="moment-grid">${C.phases.map(([name, text, inlet, outlet], i) => `<button class="moment-card" data-phase="${i}" aria-pressed="false">${svg(`moment-${i}`)}<span class="mono phase-number">0${i + 1}</span><h3>${name}</h3><p>${text}</p><span class="chips"><span>${inlet}</span><span>${outlet}</span></span></button>`).join("")}</div>
        ${controls()}
    </section>
    <section id="rate" class="section wrap">${heading(C.rate[0], C.rate[1])}
        <div class="rate-table"><div class="live-rate-row"><div class="live-rate-controls"><label for="table-rate">${C.instrument.current}</label>${range("table-rate")}</div><div class="rate-row" id="live-row"></div></div>${[40, 60, 90, 120, 150, 180].map((rate) => `<div class="rate-row">${barRow(rate)}</div>`).join("")}</div><p class="caption">${C.rate[2]}</p>
    </section>
    <section id="trace" class="section wrap">${heading(C.trace.title, C.trace.intro)}<svg id="static-trace"></svg><div class="trace-layout"><div class="trace-cards">${C.trace.cards.map(([name, text], i) => `<button class="trace-card" data-trace="${i}" aria-pressed="false"><span class="trace-letter">${name}</span><span>${text}</span></button>`).join("")}</div>${svg("trace-diagram")}</div><p class="caption">${C.trace.note}</p></section>
    <section id="valves" class="section wrap">${heading(C.valves.title, C.valves.intro)}<div class="valve-grid">${C.valves.cards.map(([name, text], i) => `<article class="valve-card reveal"><svg id="valve-${i}" role="img" aria-label="${name}"></svg><div><h3>${name}</h3><p>${text}</p><output id="valve-state-${i}" class="mono"></output></div></article>`).join("")}</div></section>
    <section id="class" class="section wrap">${heading(C.classroom.title)}<div class="class-layout"><ol>${C.classroom.prompts.map((text) => `<li>${text}</li>`).join("")}</ol><div class="questions">${C.classroom.questions.map(([q, a]) => `<details><summary>${q}${icon("plus")}</summary><p>${a}</p></details>`).join("")}</div></div></section>`;
document.querySelector("#footer").innerHTML = `<div class="wrap footer-grid"><div><a class="brand" href="#beat">${mark}${C.brand}</a><p>${C.footer.disclaimer}</p></div><div><p class="eyebrow">${C.footer.series}</p>${C.footer.next.map((text) => `<div class="series-item">${text}<span class="mono">${C.footer.pending}</span></div>`).join("")}</div><div class="footer-bottom"><p class="mono">${C.footer.colophon}</p><a href="${C.footer.url}" target="_blank" rel="noopener noreferrer">${C.footer.credit}</a></div></div>`;

function barRow(rate)
{
    const { RR, Ts, Td } = timing(rate);
    return `<span class="mono table-bpm">${rate} <small>${C.instrument.unit}</small></span><div class="time-bar" aria-label="${C.instrument.systole} ${Ts.toFixed(2)} s, ${C.instrument.diastole} ${Td.toFixed(2)} s"><div class="rate-fill" style="width:${RR / 1.5 * 100}%"><span class="time-systole" style="width:${Ts / RR * 100}%"></span><span class="time-diastole"></span></div></div><div class="table-times mono"><span>${Ts.toFixed(2)} s</span><span>${Td.toFixed(2)} s</span></div>`;
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const clock = { t: reduced.matches ? phaseTime(1, 72) : 0, elapsed: 0, rate: 72, running: !reduced.matches, selected: reduced.matches ? 1 : -1 };
const hero = createDiagram(document.querySelector("#hero-diagram"));
const pathDiagram = createDiagram(document.querySelector("#path-diagram"), { labels: false });
const traceDiagram = createDiagram(document.querySelector("#trace-diagram"), { labels: false });
const diagrams = [hero, pathDiagram, traceDiagram];
const thumbnails = C.phases.map((_, i) => createDiagram(document.querySelector(`#moment-${i}`), { labels: false, particles: false, frozenT: phaseTime(i, 72), frozenRate: 72 }));
const traces = [createTrace(document.querySelector("#hero-trace")), createTrace(document.querySelector("#path-trace"))];
const highlightTrace = createStaticTrace(document.querySelector("#static-trace"));
const valveViews = C.valves.cards.map(([, , gate, color], i) => createValveCloseup(document.querySelector(`#valve-${i}`), gate, color));
let lastFrame = null;
let dirty = true;

function draw(delta)
{
    const state = model(clock.t, clock.rate);
    for (const diagram of diagrams) diagram.update(clock.t, clock.rate, delta, reduced.matches);
    traces.forEach((trace) => trace.draw(clock.t, clock.rate, clock.elapsed, delta, reduced.matches));
    valveViews.forEach((update, i) =>
    {
        update(state, delta, reduced.matches);
        const open = state[C.valves.cards[i][2]] > 0.5;
        const output = document.querySelector(`#valve-state-${i}`);
        output.textContent = open ? C.valves.open : C.valves.closed;
        output.classList.toggle("open", open);
    });
    document.querySelector("#phase-name").textContent = C.phases[state.phase][0];
    document.querySelector("#phase-name").dataset.phase = state.phase;
    document.querySelector("#mode-label").textContent = clock.running ? "" : C.instrument.held;
    document.querySelectorAll(".systole").forEach((o) => o.textContent = state.Ts.toFixed(2));
    document.querySelectorAll(".diastole").forEach((o) => o.textContent = state.Td.toFixed(2));
    document.querySelector("#systole-share").style.width = `${state.Ts / state.RR * 100}%`;
    document.querySelectorAll("[data-mark]").forEach((chip, i) => chip.classList.toggle("active", i === state.mark));
    document.querySelector("#mark-sentence").textContent = state.mark === -1 ? "" : C.marks[state.mark][1];
    document.querySelector("#beat").dataset.time = clock.t.toFixed(6);
    document.querySelector("#beat").dataset.running = clock.running;
    document.querySelector("#beat").dataset.scale = state.v.toFixed(6);
    const pause = document.querySelector("#pause");
    pause.innerHTML = icon(clock.running ? "pause" : "play");
    pause.setAttribute("aria-label", clock.running ? C.instrument.pause : C.instrument.play);
    pause.setAttribute("aria-pressed", String(!clock.running));
    document.querySelectorAll(".moment-card").forEach((tile, i) =>
    {
        tile.classList.toggle("selected", clock.selected === i);
        tile.setAttribute("aria-pressed", String(clock.selected === i));
    });
    document.querySelectorAll(".back-live").forEach((button) => button.disabled = reduced.matches);
    document.querySelector("#live-row").innerHTML = barRow(clock.rate);
    dirty = false;
}

function setRate(rate)
{
    clock.t = clock.t / timing(clock.rate).RR * timing(rate).RR;
    clock.rate = rate;
    document.querySelectorAll(".rate-slider").forEach((slider) => slider.value = rate);
    document.querySelector(".bpm").textContent = rate;
    dirty = true;
    draw(0);
}
document.querySelectorAll(".rate-slider").forEach((slider) => slider.addEventListener("input", () => setRate(Number(slider.value))));
function hold(phase)
{
    clock.running = false;
    clock.selected = ((phase % 5) + 5) % 5;
    clock.t = phaseTime(clock.selected, clock.rate);
    dirty = true;
    draw(0);
}
function live()
{
    if (reduced.matches) return;
    clock.running = true;
    clock.selected = -1;
    lastFrame = null;
    dirty = true;
}
function toggle()
{
    if (reduced.matches) return;
    if (clock.running)
    {
        clock.running = false;
        clock.selected = -1;
        draw(0);
    }
    else live();
}
document.querySelector("#pause").addEventListener("click", toggle);
document.querySelectorAll(".moment-card").forEach((tile) => tile.addEventListener("click", () => hold(Number(tile.dataset.phase))));
document.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => hold((clock.selected === -1 ? model(clock.t, clock.rate).phase : clock.selected) + Number(button.dataset.step))));
document.querySelectorAll(".back-live").forEach((button) => button.addEventListener("click", live));
document.addEventListener("keydown", (event) =>
{
    if (event.code === "Space" && !event.target.closest("button,a,input,summary,textarea,select,[contenteditable]"))
    {
        event.preventDefault();
        toggle();
    }
});
let pinnedTrace = -1;
const traceCards = [...document.querySelectorAll(".trace-card")];
function selectTrace(index)
{
    highlightTrace(index);
    traceDiagram.spotlight(index === -1 ? [] : C.trace.cards[index][2]);
    traceCards.forEach((card, i) =>
    {
        card.classList.toggle("active", i === index);
        card.setAttribute("aria-pressed", String(i === pinnedTrace));
    });
}
traceCards.forEach((card, index) =>
{
    card.addEventListener("pointerenter", () => selectTrace(index));
    card.addEventListener("pointerleave", () => selectTrace(pinnedTrace));
    card.addEventListener("focus", () => selectTrace(index));
    card.addEventListener("blur", () => selectTrace(pinnedTrace));
    card.addEventListener("click", () =>
    {
        pinnedTrace = pinnedTrace === index ? -1 : index;
        selectTrace(pinnedTrace);
    });
});
document.addEventListener("visibilitychange", () => lastFrame = null);
window.addEventListener("resize", () =>
{
    traces.forEach((trace) => trace.resize());
    dirty = true;
});
reduced.addEventListener("change", () =>
{
    if (reduced.matches) hold(1);
    else live();
    document.querySelector("#pause").disabled = reduced.matches;
    dirty = true;
});
document.querySelector("#pause").disabled = reduced.matches;
await document.fonts.ready;
thumbnails.forEach((thumbnail) => thumbnail.update(0, 72, 0, reduced.matches));
draw(0);
connectScroll(pathDiagram, reduced);
function frame(timestamp)
{
    const delta = lastFrame === null ? 0 : Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    if (!document.hidden)
    {
        if (clock.running && !reduced.matches)
        {
            clock.t += delta;
            clock.elapsed += delta;
            draw(delta);
        }
        else if (dirty) draw(0);
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
