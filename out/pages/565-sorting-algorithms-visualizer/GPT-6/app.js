import { content as c } from "./content.js";
import { algorithms } from "./engine/algorithms.js";
import { makeArray } from "./engine/arrays.js";
import { Player, raceAt } from "./engine/player.js";
import { BarStage } from "./stage.js";
import { icons } from "./icons.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => icons[name] || "";
const number = (n) => n.toLocaleString("en-US");
const algorithm = (id) => c.algorithms.find((a) => a.id === id);
const logo = `<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><path fill="#F5A524" d="M5 19h5v8H5zM13 12h5v15h-5z"/><path fill="#3CC8E0" d="M21 5h5v22h-5z"/></svg>`;
const brand = `<a class="brand" href="#visualizer">${logo}<span class="wordmark">${c.brand}</span></a>`;
const button = (action, label, glyph, extra = "") => `<button type="button" class="icon-button ${extra}" data-action="${action}" aria-label="${label}" title="${label}">${icon(glyph)}</button>`;
const transportButtons = () => [
    button("reset", c.labels.reset, "skip-back"),
    button("back", c.labels.back, "step-back"),
    button("play", c.labels.play, "play", "play-button"),
    button("next", c.labels.next, "step-forward"),
    button("shuffle", c.labels.shuffle, "shuffle")
].join("");
const options = (selected) => c.algorithms.map((a) => `<option value="${a.id}" ${selected === a.id ? "selected" : ""}>${a.name}</option>`).join("");
const patternOptions = c.patterns.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
const sectionHeading = (id) =>
{
    const [eyebrow, title, sub] = c.sections[id];
    return `<div class="section-head"><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>`;
};
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduced = reducedQuery.matches;

$("#app").innerHTML = `
<header class="site-header"><div class="header-inner wrap">${brand}
    <nav aria-label="Main">${c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
    <span class="browser-chip mono">${c.browser}</span>
</div></header>
<main>
    <section id="visualizer" class="wrap" aria-labelledby="visualizer-title">
        <div class="visualizer-heading">
            <div><h1 id="visualizer-title">${c.headline}</h1><p class="caption mono" id="caption"></p></div>
            <div class="tabs" role="tablist" aria-label="${c.sections.algorithms[0]}">
                ${c.algorithms.map((a) => `<button class="tab" id="tab-${a.id}" role="tab" aria-selected="${a.id === "quick"}" aria-controls="stage-region" tabindex="${a.id === "quick" ? "0" : "-1"}" data-algorithm="${a.id}">${a.name}</button>`).join("")}
            </div>
        </div>
        <div class="lab-grid">
            <div class="stage-column">
                <div class="canvas-panel" id="stage-region" role="tabpanel" aria-labelledby="tab-quick">
                    <div class="stage-meta"><span id="seed"></span><span id="hover"></span></div>
                    <canvas id="main-canvas" role="img" aria-label="${c.stage}"></canvas>
                </div>
                <div class="scrub-row"><input id="scrubber" type="range" min="0" max="1" value="0" aria-label="Step"><output id="step-label" for="scrubber"></output></div>
                <div class="transport">
                    <div class="transport-buttons">${transportButtons()}</div>
                    <div class="settings">
                        <div class="setting"><label for="speed">${c.labels.speed}<output id="speed-value" for="speed"></output></label><input id="speed" type="range" min="0" max="1000" value="629" aria-label="${c.labels.speed}"></div>
                        <div class="setting"><label for="size">${c.labels.size}<output id="size-value" for="size"></output></label><input id="size" type="range" min="8" max="128" value="48" aria-label="${c.labels.size}"></div>
                        <div class="setting"><label>${c.labels.pattern}</label><div class="pattern-buttons" role="group" aria-label="${c.labels.pattern}">${c.patterns.map((p) => `<button class="pattern-button" data-pattern="${p.id}" aria-pressed="${p.id === "random"}">${p.name}</button>`).join("")}</div></div>
                    </div>
                </div>
                <p class="hint mono">${c.hint}</p>
                <p class="reduced-note" ${reduced ? "" : "hidden"}>${c.reduced}</p>
            </div>
            <aside class="rail" aria-label="Live counters and narration">
                <div class="counters">${["comparisons", "swaps", "writes"].map((key, i) => `<div class="metric ${i === 0 ? "compare" : ""}"><span class="metric-label mono"><i class="dot"></i>${c.labels[key]}</span><strong id="metric-${i}">0</strong></div>`).join("")}</div>
                <div class="now-panel"><div class="eyebrow">${c.labels.now}</div><p id="narration"></p></div>
                <div class="key-panel"><div class="eyebrow">${c.labels.key}</div><div class="legend">${c.legend.map(([key, text]) => `<span><i class="${key}"></i>${text}</span>`).join("")}</div></div>
                <div class="summary" id="algorithm-summary"></div>
            </aside>
        </div>
    </section>
    <section id="algorithms" class="section"><div class="wrap">
        ${sectionHeading("algorithms")}
        <div class="algorithm-grid" id="algorithm-cards"></div>
    </div></section>
    <section id="race" class="section"><div class="wrap">
        ${sectionHeading("race")}
        <div class="race-controls">
            <div class="lane-selects">
                <label for="lane-a">${c.labels.laneA}<select id="lane-a">${options("bubble")}</select></label>
                <span class="versus mono">${c.race.versus}</span>
                <label for="lane-b">${c.labels.laneB}<select id="lane-b">${options("quick")}</select></label>
            </div>
            <label for="race-pattern">${c.labels.pattern}<select id="race-pattern">${patternOptions}</select></label>
            <div class="race-slider setting"><label for="race-size">${c.labels.size}<output id="race-size-value"></output></label><input id="race-size" type="range" min="8" max="128" value="48"></div>
            <div class="race-slider setting"><label for="race-speed">${c.labels.speed}<output id="race-speed-value"></output></label><input id="race-speed" type="range" min="1" max="500" value="90"></div>
            <div class="race-actions">
                <button class="text-button primary" data-race="play">${c.labels.start}</button>
                <button class="text-button" data-race="step">${c.labels.step}</button>
                <button class="text-button" data-race="reset">${c.labels.reset}</button>
                <button class="text-button" data-race="new">${c.labels.newArray}</button>
            </div>
        </div>
        <div id="race-tick" class="tick"></div>
        <div class="lanes">${["A", "B"].map((lane, i) => `
            <article class="lane" aria-label="Race lane ${lane}">
                <div class="lane-head">
                    <div><h3 class="lane-name"><span class="lane-badge">${lane}</span><span id="lane-name-${i}"></span></h3><div class="lane-stats" id="lane-stats-${i}"></div></div>
                    <div><div class="lane-step" id="lane-step-${i}"></div><div class="lane-status" id="lane-status-${i}"></div></div>
                </div>
                <div class="canvas-panel"><div class="stage-meta"><span class="race-seed"></span></div><canvas id="race-canvas-${i}" role="img" aria-label="Sorting stage in lane ${lane}"></canvas></div>
                <div class="lane-progress"><span id="lane-progress-${i}"></span></div>
            </article>`).join("")}
        </div>
        <div class="result" id="race-result" aria-live="polite"></div><p class="race-note">${c.race.note}</p>
    </div></section>
    <section id="patterns" class="section"><div class="wrap">
        ${sectionHeading("patterns")}<div class="table-panel"><table aria-label="${c.sections.patterns[1]}">
            <thead><tr><th scope="col"></th>${c.patterns.map((p) => `<th scope="col"><span class="full">${p.name}</span><span class="short">${p.short}</span></th>`).join("")}</tr></thead>
            <tbody id="pattern-body"></tbody>
        </table></div><p class="pattern-note">${c.patternNote}</p>
    </div></section>
    <section id="notes" class="section"><div class="wrap">
        ${sectionHeading("notes")}<div class="notes-grid">${c.notes.map(([q, a]) => `<article class="note"><h3>${q}</h3><p>${a}</p></article>`).join("")}</div>
    </div></section>
</main>
<footer><div class="footer-inner wrap"><div>${brand}<p>A browser tool for ${c.audience}.</p></div>
    <div class="footer-right"><p>${c.footer}</p><a href="${c.credit[1]}">${c.credit[0]}</a><br><a href="${c.license[1]}">${c.license[0]}</a></div>
</div></footer>
<div class="mobile-transport visible" id="mobile-main" aria-label="Visualizer transport">${transportButtons()}</div>
<div class="mobile-transport" id="mobile-race" aria-label="Race transport">
    <button class="text-button primary" data-race="play">${c.labels.start}</button>
    <button class="text-button" data-race="step">${c.labels.step}</button>
    <button class="text-button" data-race="reset">${c.labels.reset}</button>
</div>`;

export const main = { id: "quick", n: 48, pattern: "random", seed: 2048, speed: 50, playing: false, accumulator: 0 };
export const race = { ids: ["bubble", "quick"], n: 48, pattern: "random", seed: 2048, speed: 90, playing: false, tick: 0, accumulator: 0, autoStarted: false };
const stage = new BarStage($("#main-canvas"), reduced, $("#hover"));
const raceStages = [0, 1].map((i) => new BarStage($(`#race-canvas-${i}`), reduced));
let debounce;
let resumeAfterRegenerate = false;
let interacted = false;
let tableTotals = {};
let mobileMode = "main";

function updateMain()
{
    const p = main.player;
    $("#scrubber").max = p.total;
    $("#scrubber").value = p.position;
    $("#scrubber").setAttribute("aria-valuetext", c.stepLabel(p.position, p.total));
    $("#step-label").textContent = c.stepLabel(p.position, p.total);
    p.metrics.forEach((value, i) => $(`#metric-${i}`).textContent = number(value));
    $("#narration").textContent = p.finished ? c.finished(p.total) : p.step ? c.narrate(p.step) : c.ready;
    $$('[data-action="play"]').forEach((b) =>
    {
        const label = main.playing ? c.labels.pause : p.finished ? c.labels.replay : c.labels.play;
        b.innerHTML = icon(main.playing ? "pause" : p.finished ? "rotate-ccw" : "play");
        b.setAttribute("aria-label", label);
        b.title = label;
    });
    $$('[data-action="back"]').forEach((b) => b.disabled = p.position === 0);
    $$('[data-action="next"]').forEach((b) => b.disabled = p.finished);
    stage.set(p, main.speed);
}

function selectVisuals()
{
    $$(".tab").forEach((tab) =>
    {
        const selected = tab.dataset.algorithm === main.id;
        tab.setAttribute("aria-selected", selected);
        tab.tabIndex = selected ? 0 : -1;
    });
    $("#stage-region").setAttribute("aria-labelledby", `tab-${main.id}`);
    $$(".algorithm-card").forEach((card) =>
    {
        const selected = card.dataset.load === main.id;
        card.classList.toggle("selected", selected);
        card.setAttribute("aria-pressed", selected);
    });
    $$(".pattern-button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.pattern === main.pattern));
    $$("#pattern-body button").forEach((b) => b.classList.toggle("selected", b.dataset.cellAlgorithm === main.id && b.dataset.cellPattern === main.pattern));
    $("#algorithm-summary").textContent = c.summary(algorithm(main.id));
}

function drawCards()
{
    const max = Math.max(...Object.values(main.players).map((p) => p.total), 1);
    $("#algorithm-cards").innerHTML = c.algorithms.map((a) =>
    {
        const player = main.players[a.id];
        const metrics = player.counts.map((prefix) => prefix[player.total]);
        return `<button type="button" class="algorithm-card" data-load="${a.id}" aria-label="${c.labels.load}: ${a.name} sort">
            <h3>${a.name} sort</h3>
            <dl class="complexity">${["best", "average", "worst", "space", "stable"].map((k, i) => `<dt>${c.labels[k]}</dt><dd>${a.complexity[i]}</dd>`).join("")}</dl>
            <p class="explanation">${a.explanation}</p><div class="meter"><span style="width:${player.total / max * 100}%"></span></div>
            <div class="measured">${c.measured(...metrics)}</div><div class="card-total">${c.total(player.total)}</div>
            <span class="load-label">${c.labels.load}${icon("step-forward")}</span>
        </button>`;
    }).join("");
}

function drawTable()
{
    tableTotals = {};
    for (const pattern of c.patterns)
    {
        const input = makeArray(main.n, pattern.id, main.seed);
        for (const a of c.algorithms) tableTotals[`${a.id}:${pattern.id}`] = algorithms[a.id](input).length;
    }
    const logs = Object.values(tableTotals).map((n) => Math.log(n + 1));
    const min = Math.min(...logs);
    const max = Math.max(...logs);
    $("#pattern-body").innerHTML = c.algorithms.map((a) => `<tr><th scope="row">${a.name}</th>${c.patterns.map((p) =>
    {
        const total = tableTotals[`${a.id}:${p.id}`];
        const alpha = 0.02 + (Math.log(total + 1) - min) / Math.max(0.001, max - min) * 0.26;
        return `<td><button data-cell-algorithm="${a.id}" data-cell-pattern="${p.id}" style="--tint:rgb(245 165 36 / ${alpha})" aria-label="${c.cellLabel(a.name, p.name, total)}">${number(total)}</button></td>`;
    }).join("")}</tr>`).join("");
}

function regenerate()
{
    clearTimeout(debounce);
    debounce = null;
    main.input = makeArray(main.n, main.pattern, main.seed);
    main.players = Object.fromEntries(c.algorithms.map((a) => [a.id, new Player(main.input, algorithms[a.id](main.input))]));
    main.player = main.players[main.id];
    main.accumulator = 0;
    $("#caption").textContent = c.caption(main.n);
    $("#seed").textContent = c.seed(main.seed);
    $("#size-value").textContent = main.n;
    $("#size").value = main.n;
    drawCards();
    drawTable();
    selectVisuals();
    updateMain();
}

function queueRegenerate()
{
    interacted = true;
    if (!debounce) resumeAfterRegenerate = main.playing;
    main.playing = false;
    clearTimeout(debounce);
    debounce = setTimeout(() =>
    {
        main.playing = resumeAfterRegenerate;
        debounce = null;
        regenerate();
    }, 120);
}

function flushRegeneration()
{
    if (!debounce) return;
    clearTimeout(debounce);
    debounce = null;
    main.playing = resumeAfterRegenerate;
    regenerate();
}

function loadAlgorithm(id, play, scroll = false)
{
    interacted = true;
    flushRegeneration();
    main.id = id;
    main.playing = play ?? main.playing;
    main.accumulator = 0;
    main.player = main.players[id].seek(0);
    selectVisuals();
    updateMain();
    if (scroll) $("#visualizer").scrollIntoView();
}

function seekMain(k)
{
    main.player.seek(k);
    main.accumulator = 0;
    if (main.player.finished) main.playing = false;
    updateMain();
}

function mainAction(action)
{
    interacted = true;
    flushRegeneration();
    if (action === "play")
    {
        if (main.player.finished) seekMain(0);
        main.playing = !main.playing;
        main.accumulator = 0;
        updateMain();
    }
    else if (action === "shuffle")
    {
        main.seed++;
        queueRegenerate();
    }
    else
    {
        main.playing = false;
        seekMain(action === "reset" ? 0 : main.player.position + (action === "back" ? -1 : 1));
    }
}

function updateRace()
{
    const result = raceAt(race.players, race.tick);
    race.tick = result.tick;
    if (race.tick === result.total) race.playing = false;
    $("#race-tick").textContent = c.race.tick(race.tick);
    race.players.forEach((p, i) =>
    {
        $(`#lane-name-${i}`).textContent = `${algorithm(race.ids[i]).name} sort`;
        $(`#lane-stats-${i}`).textContent = c.race.counters(p.metrics);
        $(`#lane-step-${i}`).textContent = c.stepLabel(p.position, p.total);
        const first = result.winner === i && p.finished;
        $(`#lane-status-${i}`).innerHTML = first ? `${icon("flag")}${c.race.first}` : p.finished ? result.winner === null ? c.race.tie(p.total) : c.race.behind(result.margin) : "";
        $(`#lane-progress-${i}`).style.width = `${p.total ? p.position / p.total * 100 : 100}%`;
        raceStages[i].set(p, race.speed);
    });
    const firstDone = result.winner !== null && race.players[result.winner].finished;
    const resultText = firstDone ? c.race.winner(algorithm(race.ids[result.winner]).name, result.margin)
        : race.tick === result.total ? c.race.tie(result.total) : race.tick ? c.race.running : c.race.waiting;
    if ($("#race-result").textContent !== resultText) $("#race-result").textContent = resultText;
    $$('[data-race="play"]').forEach((b) => b.textContent = race.playing ? c.labels.pause : c.labels.start);
    $$('[data-race="step"]').forEach((b) => b.disabled = race.tick >= result.total);
}

function resetRace(manual = true)
{
    race.playing = false;
    race.tick = 0;
    race.accumulator = 0;
    if (manual) race.autoStarted = true;
    race.input = makeArray(race.n, race.pattern, race.seed);
    race.players = race.ids.map((id) => new Player(race.input, algorithms[id](race.input)));
    $$(".race-seed").forEach((el) => el.textContent = c.seed(race.seed));
    $("#race-size-value").textContent = race.n;
    $("#race-speed-value").textContent = c.ticksPerSecond(race.speed);
    $$("#lane-a option").forEach((o) => o.disabled = o.value === race.ids[1]);
    $$("#lane-b option").forEach((o) => o.disabled = o.value === race.ids[0]);
    updateRace();
}

function raceAction(action)
{
    race.autoStarted = true;
    if (action === "play")
    {
        if (race.tick >= Math.max(...race.players.map((p) => p.total))) resetRace();
        race.playing = !race.playing;
        race.accumulator = 0;
        updateRace();
    }
    else if (action === "step")
    {
        race.playing = false;
        race.tick++;
        race.accumulator = 0;
        updateRace();
    }
    else
    {
        if (action === "new") race.seed++;
        resetRace();
    }
}

document.addEventListener("click", (event) =>
{
    const b = event.target.closest("button");
    if (!b) return;
    if (b.dataset.action) mainAction(b.dataset.action);
    if (b.dataset.race) raceAction(b.dataset.race);
    if (b.dataset.algorithm) loadAlgorithm(b.dataset.algorithm);
    if (b.dataset.pattern)
    {
        main.pattern = b.dataset.pattern;
        queueRegenerate();
    }
    if (b.dataset.load) loadAlgorithm(b.dataset.load, !reduced, true);
    if (b.dataset.cellAlgorithm)
    {
        main.pattern = b.dataset.cellPattern;
        main.id = b.dataset.cellAlgorithm;
        main.playing = !reduced;
        interacted = true;
        regenerate();
        $("#visualizer").scrollIntoView();
    }
});

$("#scrubber").addEventListener("input", (event) =>
{
    interacted = true;
    flushRegeneration();
    main.playing = false;
    seekMain(Number(event.target.value));
});
$("#speed").value = Math.round(Math.log(50) / Math.log(500) * 1000);
$("#speed-value").textContent = c.stepsPerSecond(50);
$("#speed").addEventListener("input", (event) =>
{
    main.speed = Math.round(Math.exp(Number(event.target.value) / 1000 * Math.log(500)));
    event.target.setAttribute("aria-valuetext", c.stepsPerSecond(main.speed));
    $("#speed-value").textContent = c.stepsPerSecond(main.speed);
});
$("#size").addEventListener("input", (event) =>
{
    main.n = Number(event.target.value);
    $("#size-value").textContent = main.n;
    queueRegenerate();
});
$("#lane-a").addEventListener("change", (event) =>
{
    race.ids[0] = event.target.value;
    resetRace();
});
$("#lane-b").addEventListener("change", (event) =>
{
    race.ids[1] = event.target.value;
    resetRace();
});
for (const [id, key] of [["race-pattern", "pattern"], ["race-size", "n"], ["race-speed", "speed"]])
{
    $(`#${id}`).addEventListener("input", (event) =>
    {
        race[key] = key === "pattern" ? event.target.value : Number(event.target.value);
        resetRace();
    });
}

document.addEventListener("keydown", (event) =>
{
    const target = event.target;
    if (target.matches('[role="tab"]') && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    {
        event.preventDefault();
        const index = c.algorithms.findIndex((a) => a.id === main.id);
        const next = event.key === "Home" ? 0 : event.key === "End" ? 4 : (index + (event.key === "ArrowRight" ? 1 : 4)) % 5;
        loadAlgorithm(c.algorithms[next].id);
        $(`#tab-${main.id}`).focus();
        return;
    }
    if (target.closest("input, select, button, a, textarea") || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    const actions = { " ": "play", arrowleft: "back", arrowright: "next", r: "reset", s: "shuffle" };
    if (!actions[key]) return;
    event.preventDefault();
    if (mobileMode === "race")
    {
        if (key === "arrowleft") return;
        raceAction(key === " " ? "play" : key === "r" ? "reset" : key === "s" ? "new" : "step");
    }
    else mainAction(actions[key]);
});

function updateMobileTransport()
{
    const r = $("#race").getBoundingClientRect();
    const v = $("#visualizer").getBoundingClientRect();
    const raceVisible = r.top < innerHeight - 80 && r.bottom > 100;
    const stageVisible = v.top < innerHeight - 80 && v.bottom > 100;
    mobileMode = raceVisible ? "race" : "main";
    $("#mobile-main").classList.toggle("visible", stageVisible && !raceVisible);
    $("#mobile-race").classList.toggle("visible", raceVisible);
}
window.addEventListener("scroll", updateMobileTransport, { passive: true });
window.addEventListener("resize", updateMobileTransport);
const raceObserver = new IntersectionObserver((entries) =>
{
    if (entries[0].intersectionRatio >= 0.4 && !race.autoStarted && !reduced)
    {
        race.autoStarted = true;
        race.playing = true;
        race.accumulator = 0;
        updateRace();
    }
}, { threshold: [0.4] });
raceObserver.observe($("#race"));

reducedQuery.addEventListener("change", (event) =>
{
    reduced = event.matches;
    stage.reduced = reduced;
    raceStages.forEach((s) => s.reduced = reduced);
    $(".reduced-note").hidden = !reduced;
    if (reduced)
    {
        main.playing = false;
        race.playing = false;
        updateMain();
        updateRace();
    }
});

regenerate();
resetRace(false);
updateMobileTransport();
document.fonts.ready.then(() =>
{
    stage.dirty = true;
    raceStages.forEach((s) => s.dirty = true);
});
setTimeout(() =>
{
    if (!reduced && !interacted)
    {
        main.playing = true;
        updateMain();
    }
}, 400);
let lastFrame;
function frame(time)
{
    const elapsed = lastFrame === undefined ? 0 : Math.min(time - lastFrame, 250) / 1000;
    lastFrame = time;
    if (main.playing)
    {
        main.accumulator += elapsed * main.speed;
        const advance = Math.floor(main.accumulator);
        if (advance)
        {
            main.accumulator -= advance;
            main.player.seek(main.player.position + advance);
            if (main.player.finished) main.playing = false;
            updateMain();
        }
    }
    if (race.playing)
    {
        race.accumulator += elapsed * race.speed;
        const advance = Math.floor(race.accumulator);
        if (advance)
        {
            race.accumulator -= advance;
            race.tick += advance;
            updateRace();
        }
    }
    stage.draw(time);
    raceStages.forEach((s) => s.draw(time));
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
