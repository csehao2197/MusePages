import { content as c } from "./content.js";
import { patterns, backgroundStars, makerStars, dayFromDate, dateFromDay, displayDate, restoreCreations } from "./sky.js";
import { icons } from "./icons.js";

const u = c.ui;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => icons[name] || "";
const $ = (selector) => document.querySelector(selector);
const state =
{
    mode: "explore",
    selected: 0,
    zoom: 1,
    date: c.defaultDate,
    name: "",
    ids: [],
    saved: [],
    guideOpen: false,
    confirmDelete: null
};
try
{
    state.saved = restoreCreations(localStorage.getItem(c.storageKey));
}
catch
{
    state.saved = [];
}
const button = (action, label, glyph = "", classes = "") => `<button type="button" data-action="${action}" class="${classes}">${glyph ? icon(glyph) : ""}${escape(label)}</button>`;
document.title = `${c.brand} — ${c.collection}`;
$("#app").innerHTML = `
    <div class="shell">
        <header class="header">
            <div class="wordmark"><img src="./favicon.svg" alt="" width="29" height="35">${escape(c.brand)}</div>
            <div class="header-right"><span class="quiet-pill">${u.subtitle}</span>${button("help", u.help, "CircleHelp", "help-button")}</div>
        </header>
        <main class="atlas-layout">
            <aside class="left-column">
                <p class="eyebrow">${u.eyebrow}</p>
                <h1>${c.headline}</h1>
                <p class="intro-body">${c.intro}</p>
                <p class="mobile-intro">${c.mobileIntro}</p>
                <p class="theme">${u.theme}</p>
                <div class="legend"><p><i></i>${u.selected}</p><p><i></i>${u.unselected}</p></div>
                <section class="desktop-index" aria-labelledby="index-title">
                    <h2 class="section-heading" id="index-title">${u.index}<span>06</span></h2>
                    <div class="story-list">${patterns.map((p) => `<button type="button" class="story-choice" data-story="${p.id}" aria-pressed="${p.id === 0}">
                        <span class="number">${p.number}</span><span><strong>${p.name}</strong><small>${p.epithet}</small></span><span class="check">${icon("Check")}</span>
                    </button>`).join("")}</div>
                    <p class="blank">${u.blank}</p>${button("create", u.make, "PencilRuler", "wide-button")}
                </section>
                <div class="mobile-choose"><label for="constellation">${u.choose}</label><select id="constellation">${patterns.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}</select></div>
            </aside>
            <section class="center-column" aria-label="${escape(c.collection)}">
                <div class="stage">
                    <canvas id="sky" tabindex="0" role="img" aria-label="${u.canvasExplore}">${u.canvasExplore}</canvas>
                    <div class="map-labels" aria-hidden="true">${patterns.map((p) => `<span class="map-label${p.id === 0 ? " active" : ""}" data-label="${p.id}">${p.number} / ${p.name}</span>`).join("")}</div>
                    <div class="stage-top">
                        <p class="stage-heading">${u.field}<span>${c.collection}</span></p>
                        <div class="modes" aria-label="${u.field}">
                            <button type="button" data-action="explore" aria-pressed="true">${u.explore}</button>
                            <button type="button" data-action="create" aria-pressed="false">${u.create}</button>
                        </div>
                    </div>
                    <p class="stage-helper" id="stage-helper">${matchMedia("(pointer: coarse)").matches ? u.touch : u.drag}</p>
                    <div class="zoom-controls">
                        <button type="button" data-action="zoom-in" aria-label="${u.zoomIn}">${icon("Plus")}</button>
                        <button type="button" data-action="zoom-out" aria-label="${u.zoomOut}">${icon("Minus")}</button>
                        <button type="button" data-action="reset-view" aria-label="${u.resetView}">${icon("RotateCcw")}</button>
                    </div>
                    <output class="zoom-readout" id="zoom-readout">1.00×</output>
                    <p class="stage-notice">${u.disclosure}</p>
                </div>
                <div class="date-bar">
                    <div class="date-label-group"><p class="date-title">${icon("CalendarDays")}${u.date}</p><output id="date-readout" class="date-readout">${displayDate(state.date)}</output></div>
                    <div class="date-slider-group"><label for="atlas-day" class="sr-only">${u.day}</label><input id="atlas-day" type="range" min="0" max="364" value="${dayFromDate(state.date)}"></div>
                    <div class="date-input-group"><label for="atlas-date" class="sr-only">${u.date}</label><input id="atlas-date" type="date" min="2026-01-01" max="2026-12-31" value="${state.date}">${button("reset-date", u.resetDate)}</div>
                </div>
                <p id="chapter" class="chapter"></p>
                <p id="status" class="status" role="status" aria-live="polite" aria-atomic="true">${u.ready}</p>
            </section>
            <aside id="panel" class="right-panel"></aside>
        </main>
        <footer class="footer"><p>${u.footer}</p><a href="${u.creditUrl}" target="_blank" rel="noopener noreferrer">${u.credit}</a></footer>
    </div>
    <dialog id="guide" aria-labelledby="guide-title">
        <div class="guide-heading"><h2 id="guide-title">${u.guideTitle}</h2><button type="button" data-action="close-guide" aria-label="${u.close}">${icon("X")}</button></div>
        <div class="guide-items">${u.guide.map(([title, body]) => `<section><h3>${title}</h3><p>${body}</p></section>`).join("")}</div>
        <p class="guide-note">${u.guideNote}</p>
    </dialog>`;

const canvas = $("#sky");
const ctx = canvas.getContext("2d");
const labels = [...document.querySelectorAll(".map-label")];
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = motion.matches;
let width = 0;
let height = 0;
let scale = 1;
let pixelRatio = 1;
let panX = 0;
let panY = 0;
let zoom = 1;
let day = dayFromDate(state.date);
let zoomTransition = null;
let dateTransition = null;
let traceStart = null;
let traceProgress = 1;
let makerStart = null;
let makerDuration = 160;
let gesture = null;
let momentum = null;
let frame = null;
let timer = null;
let saveTimer = null;
let lastPaint = 0;
let destroyed = false;
let ready = false;
const cleanups = [];
const ease = (value) => 1 - (1 - value) ** 3;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const listen = (target, event, callback, options) =>
{
    target.addEventListener(event, callback, options);
    cleanups.push(() => target.removeEventListener(event, callback, options));
};
const announce = (message) =>
{
    $("#status").textContent = message;
};

function diagram(pattern)
{
    const xs = pattern.points.map(([x]) => x);
    const ys = pattern.points.map(([, y]) => y);
    const x = Math.min(...xs) - 30;
    const y = Math.min(...ys) - 30;
    const w = Math.max(...xs) - x + 30;
    const h = Math.max(...ys) - y + 30;
    return `<svg class="story-diagram" aria-hidden="true" viewBox="${x} ${y} ${w} ${h}">${pattern.edges.map(([a, b]) => `<line x1="${pattern.points[a][0]}" y1="${pattern.points[a][1]}" x2="${pattern.points[b][0]}" y2="${pattern.points[b][1]}" pathLength="1"/>`).join("")}${pattern.points.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="3.1"/>`).join("")}</svg>`;
}

function renderPanel()
{
    const panel = $("#panel");
    if (state.mode === "explore")
    {
        const p = patterns[state.selected];
        panel.classList.remove("maker");
        panel.innerHTML = `<p class="panel-kicker"><span>${p.number}</span> / ${u.storyLabel}</p><h2>${p.name}</h2><p class="epithet">${p.epithet}</p>
            ${diagram(p)}<p class="story-prose">${p.story}</p><p class="pattern-note"><strong>${u.note}</strong>${p.note}</p>
            ${button("trace", u.trace, "RotateCcw", "wide-button trace-button")}${button("create", u.instead, "", "text-button")}`;
        if (ready && !reduced)
        {
            panel.querySelector(".story-prose").animate([{ opacity: .35 }, { opacity: 1 }], { duration: 160 });
        }
    }
    else
    {
        panel.classList.add("maker");
        panel.innerHTML = `<p class="panel-kicker">${icon("PencilRuler")}${u.create}</p><h2>${u.makerTitle}</h2><p class="maker-body">${u.makerBody}</p>
            <label for="maker-name">${u.name}</label><input type="text" id="maker-name" maxlength="24" placeholder="${u.placeholder}" value="${escape(state.name)}" autocomplete="off">
            <p class="point-count" id="point-count"></p><div class="split-buttons">${button("undo", u.undo, "Undo2")}${button("clear", u.clear, "Trash2")}</div>
            <label for="maker-star">${u.selectStar}</label><select id="maker-star">${makerStars.map((star) => `<option value="${star.id}">${u.star} ${star.id}</option>`).join("")}</select>
            ${button("add", u.add, "Plus", "wide-button")}${button("save", u.save, "Save", "wide-button primary")}
            <p id="save-feedback" class="save-feedback" role="status"></p><h3 class="saved-title">${u.savedTitle}</h3><div id="saved-list"></div>`;
        renderSaved();
        updateMaker();
    }
}

function updateMaker()
{
    if (state.mode !== "create")
    {
        return;
    }
    $("#point-count").textContent = u.count(state.ids.length);
    $('[data-action="undo"]').disabled = !state.ids.length;
    $('[data-action="clear"]').disabled = !state.ids.length;
    $('[data-action="save"]').disabled = state.ids.length < 3 || !state.name.trim() || state.name.trim().length > 24 || state.saved.length >= 6;
    for (const option of $("#maker-star").options)
    {
        option.disabled = state.ids.includes(Number(option.value));
    }
    const select = $("#maker-star");
    if (state.ids.includes(Number(select.value)))
    {
        select.value = String(makerStars.find((star) => !state.ids.includes(star.id))?.id || 1);
    }
    $('[data-action="add"]').disabled = state.ids.length >= 8;
}

function renderSaved()
{
    const list = $("#saved-list");
    list.innerHTML = state.saved.length ? state.saved.map((record, index) => `<div class="saved-row"><strong class="saved-name">${escape(record.name)}</strong>
        <span class="saved-count">${u.savedCount(record.ids.length)}</span><div class="saved-actions">
        <button type="button" data-load="${index}">${icon("BookOpen")}${u.load}</button>
        <button type="button" data-delete="${index}">${icon("Trash2")}${state.confirmDelete === index ? u.confirm : u.delete}</button>
        ${state.confirmDelete === index ? `<button type="button" data-action="cancel-delete">${u.cancel}</button>` : ""}</div></div>`).join("") : `<p class="saved-empty">${u.empty}</p>`;
}

function setMode(mode)
{
    if (state.mode === mode)
    {
        return;
    }
    state.mode = mode;
    state.confirmDelete = null;
    for (const tab of document.querySelectorAll(".modes button"))
    {
        tab.setAttribute("aria-pressed", String(tab.dataset.action === mode));
    }
    $("#stage-helper").textContent = mode === "create" ? u.makerHelp : matchMedia("(pointer: coarse)").matches ? u.touch : u.drag;
    canvas.setAttribute("aria-label", mode === "create" ? u.canvasCreate : u.canvasExplore);
    labels.forEach((label) => label.style.opacity = mode === "create" ? ".25" : "1");
    renderPanel();
    announce(mode === "create" ? u.createStatus : u.exploreStatus);
    makerStart = reduced ? null : performance.now();
    wake();
}

function trace()
{
    traceProgress = reduced ? 1 : 0;
    traceStart = reduced ? null : performance.now();
    if (reduced)
    {
        announce(u.traced(patterns[state.selected].name));
    }
    wake();
}

function selectStory(id)
{
    if (!patterns[id])
    {
        return;
    }
    const wasCreate = state.mode === "create";
    state.selected = id;
    setMode("explore");
    document.querySelectorAll("[data-story]").forEach((row) => row.setAttribute("aria-pressed", String(Number(row.dataset.story) === id)));
    labels.forEach((label, index) => label.classList.toggle("active", index === id));
    $("#constellation").value = String(id);
    if (!wasCreate)
    {
        renderPanel();
    }
    trace();
}

function setDate(value)
{
    const nextDay = dayFromDate(value);
    if (nextDay === null || nextDay < 0 || nextDay > 364)
    {
        $("#atlas-date").value = state.date;
        announce(u.dateLimit);
        return;
    }
    state.date = value;
    $("#atlas-date").value = value;
    $("#atlas-day").value = String(nextDay);
    $("#date-readout").textContent = displayDate(value);
    $("#chapter").textContent = u.chapters[Math.min(3, Math.floor(nextDay / 91.25))];
    if (reduced)
    {
        day = nextDay;
    }
    else
    {
        dateTransition = { from: day, to: nextDay, start: performance.now() };
    }
    announce(u.dateStatus(displayDate(value)));
    wake();
}

function setZoom(value)
{
    state.zoom = clamp(value, .75, 2.2);
    if (reduced)
    {
        zoom = state.zoom;
        zoomTransition = null;
    }
    else
    {
        zoomTransition = { from: zoom, to: state.zoom, start: performance.now() };
    }
    $("#zoom-readout").textContent = `${state.zoom.toFixed(2)}×`;
    announce(u.zoomStatus(Math.round(state.zoom * 100)));
    wake();
}

function addPoint(id)
{
    if (state.ids.includes(id))
    {
        announce(u.duplicate);
        return;
    }
    if (state.ids.length >= 8)
    {
        announce(u.maxPoints);
        return;
    }
    state.ids.push(id);
    makerDuration = 160;
    makerStart = reduced ? null : performance.now();
    updateMaker();
    announce(u.connected(id, state.ids.length));
    wake();
}

function persist(records)
{
    try
    {
        localStorage.setItem(c.storageKey, JSON.stringify(records));
        return true;
    }
    catch
    {
        $("#save-feedback").textContent = u.storageError;
        announce(u.storageError);
        return false;
    }
}

function save()
{
    if (state.ids.length < 3 || state.ids.length > 8 || !state.name.trim() || state.name.trim().length > 24)
    {
        return;
    }
    if (state.saved.length >= 6)
    {
        announce(u.full);
        return;
    }
    const saved = [...state.saved, { name: state.name.trim(), ids: [...state.ids] }];
    if (!persist(saved))
    {
        return;
    }
    state.saved = saved;
    makerDuration = 420;
    makerStart = reduced ? null : performance.now();
    wake();
    renderSaved();
    updateMaker();
    $("#save-feedback").textContent = u.saved;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() =>
    {
        if ($("#save-feedback"))
        {
            $("#save-feedback").textContent = "";
        }
    }, 2400);
    announce(u.savedStatus(state.name.trim()));
}

const actions =
{
    explore: () => setMode("explore"),
    create: () => setMode("create"),
    trace,
    "zoom-in": () => setZoom(state.zoom + .15),
    "zoom-out": () => setZoom(state.zoom - .15),
    "reset-view": () =>
    {
        panX = 0;
        panY = 0;
        momentum = null;
        setZoom(1);
        announce(u.resetStatus);
    },
    "reset-date": () =>
    {
        setDate(c.defaultDate);
        announce(u.dateResetStatus);
    },
    undo: () =>
    {
        state.ids.pop();
        updateMaker();
        announce(u.undone);
        wake();
    },
    clear: () =>
    {
        state.ids = [];
        updateMaker();
        announce(u.cleared);
        wake();
    },
    add: () => addPoint(Number($("#maker-star").value)),
    save,
    "cancel-delete": () =>
    {
        state.confirmDelete = null;
        renderSaved();
        $("[data-delete]")?.focus({ preventScroll: true });
    },
    help: () =>
    {
        state.guideOpen = true;
        $("#guide").showModal();
    },
    "close-guide": () => $("#guide").close()
};

listen(document, "click", (event) =>
{
    const target = event.target.closest("button");
    if (!target || target.disabled)
    {
        return;
    }
    if (target.dataset.story !== undefined)
    {
        selectStory(Number(target.dataset.story));
    }
    else if (target.dataset.load !== undefined)
    {
        const record = state.saved[Number(target.dataset.load)];
        state.ids = [...record.ids];
        state.name = record.name;
        $("#maker-name").value = state.name;
        makerDuration = 420;
        makerStart = reduced ? null : performance.now();
        updateMaker();
        announce(u.loaded(record.name, record.ids.length));
        wake();
    }
    else if (target.dataset.delete !== undefined)
    {
        const index = Number(target.dataset.delete);
        if (state.confirmDelete === index)
        {
            const name = state.saved[index].name;
            const saved = state.saved.filter((_, item) => item !== index);
            if (!persist(saved))
            {
                return;
            }
            state.saved = saved;
            state.confirmDelete = null;
            renderSaved();
            updateMaker();
            ($("[data-delete]") || $('[data-action="save"]')).focus({ preventScroll: true });
            announce(u.deleted(name));
        }
        else
        {
            state.confirmDelete = index;
            renderSaved();
            document.querySelector(`[data-delete="${index}"]`).focus({ preventScroll: true });
        }
    }
    else if (actions[target.dataset.action])
    {
        actions[target.dataset.action]();
    }
});
listen(document, "input", (event) =>
{
    if (event.target.id === "maker-name")
    {
        state.name = event.target.value;
        updateMaker();
    }
    else if (event.target.id === "atlas-day")
    {
        setDate(dateFromDay(Number(event.target.value)));
    }
});
listen($("#constellation"), "change", (event) => selectStory(Number(event.target.value)));
listen($("#atlas-date"), "change", (event) => setDate(event.target.value));
listen($("#guide"), "close", () =>
{
    state.guideOpen = false;
    $('[data-action="help"]').focus({ preventScroll: true });
});
listen($("#guide"), "keydown", (event) =>
{
    if (event.key !== "Tab")
    {
        return;
    }
    const controls = [...$("#guide").querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]')];
    const first = controls[0];
    const last = controls.at(-1);
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
listen($("#guide"), "click", (event) =>
{
    if (event.target === $("#guide"))
    {
        const rect = $("#guide").getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
        {
            $("#guide").close();
        }
    }
});

function dateTransform(x, y)
{
    const angle = Math.sin(day / 365 * Math.PI * 2) * Math.PI / 10;
    const vertical = Math.cos(day / 365 * Math.PI * 2) * 55;
    const dx = x - 800;
    const dy = y - 500;
    return { x: dx * Math.cos(angle) - dy * Math.sin(angle), y: dx * Math.sin(angle) + dy * Math.cos(angle) + vertical };
}

function project(x, y)
{
    const rotated = dateTransform(x, y);
    return { x: width / 2 + panX + rotated.x * scale * zoom, y: height / 2 + panY + rotated.y * scale * zoom };
}

function guidePoint(pattern, index)
{
    return project(pattern.center[0] + pattern.points[index][0], pattern.center[1] + pattern.points[index][1]);
}

function clampPan()
{
    const scaled = scale * zoom;
    panX = clamp(panX, -(width / 2 + 800 * scaled - 45), width / 2 + 800 * scaled - 45);
    panY = clamp(panY, -(height / 2 + 500 * scaled - 45), height / 2 + 500 * scaled - 45);
}

function line(a, b, color, lineWidth = 1, progress = 1)
{
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function dot(point, radius, color)
{
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function paint(time)
{
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .55, height * .42, 0, width / 2, height / 2, Math.max(width, height) * .75);
    glow.addColorStop(0, "#101A36");
    glow.addColorStop(1, "#080D1F");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    for (let x = 0; x <= 1600; x += 100)
    {
        line(project(x, 0), project(x, 1000), "rgba(53,65,94,.22)", .6);
    }
    for (let y = 0; y <= 1000; y += 100)
    {
        line(project(0, y), project(1600, y), "rgba(53,65,94,.22)", .6);
    }
    ctx.save();
    const center = project(800, 500);
    ctx.translate(center.x, center.y);
    ctx.rotate(Math.sin(day / 365 * Math.PI * 2) * Math.PI / 10);
    ctx.scale(scale * zoom, scale * zoom);
    ctx.strokeStyle = "rgba(170,181,205,.18)";
    ctx.lineWidth = .7 / (scale * zoom);
    ctx.setLineDash([6 / (scale * zoom), 9 / (scale * zoom)]);
    for (const radius of [400, 800])
    {
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * .65, -.3, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
    for (const star of backgroundStars)
    {
        const point = project(star.x, star.y);
        const twinkle = reduced ? 1 : .9 + .1 * Math.sin(time / 1600 + star.phase);
        const opacity = star.opacity * twinkle;
        dot(point, star.radius, `rgba(185,203,255,${opacity})`);
        if (star.bright)
        {
            line({ x: point.x - 3.5, y: point.y }, { x: point.x + 3.5, y: point.y }, `rgba(243,233,210,${opacity * .65})`, .6);
            line({ x: point.x, y: point.y - 3.5 }, { x: point.x, y: point.y + 3.5 }, `rgba(243,233,210,${opacity * .65})`, .6);
        }
    }
    const alpha = state.mode === "create" ? .25 : 1;
    ctx.globalAlpha = alpha;
    for (const pattern of patterns)
    {
        for (const [a, b] of pattern.edges)
        {
            line(guidePoint(pattern, a), guidePoint(pattern, b), "rgba(228,188,114,.16)", .8);
        }
    }
    for (const pattern of patterns)
    {
        for (let i = 0; i < pattern.points.length; i++)
        {
            const point = guidePoint(pattern, i);
            const active = pattern.id === state.selected;
            const radius = 2.5 + ((i * 7 + pattern.id) % 18) / 10;
            const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, active ? 16 : 9);
            halo.addColorStop(0, active ? "rgba(185,203,255,.25)" : "rgba(185,203,255,.10)");
            halo.addColorStop(1, "rgba(185,203,255,0)");
            dot(point, active ? 16 : 9, halo);
            dot(point, active ? radius : radius * .7, active ? "#F3E9D2" : "#8e9dbd");
        }
    }
    const selected = patterns[state.selected];
    for (const [a, b] of selected.edges)
    {
        line(guidePoint(selected, a), guidePoint(selected, b), "#E4BC72", 1.6, traceProgress);
    }
    for (let i = 0; i < selected.points.length; i++)
    {
        const point = guidePoint(selected, i);
        ctx.beginPath();
        const expansion = traceStart === null ? 0 : (1 - Math.min(1, (time - traceStart) / 500)) * 5;
        ctx.arc(point.x, point.y, 6 + expansion, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(228,188,114,.32)";
        ctx.lineWidth = .65;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    labels.forEach((label, index) =>
    {
        const pattern = patterns[index];
        const bottom = Math.max(...pattern.points.map(([, y]) => y));
        const point = project(pattern.center[0], pattern.center[1] + bottom + 45);
        label.style.transform = `translate(${point.x}px, ${point.y}px) translateX(-50%)`;
    });
    if (state.mode === "create")
    {
        const progress = makerStart === null ? 1 : ease(clamp((time - makerStart) / makerDuration, 0, 1));
        for (let i = 1; i < state.ids.length; i++)
        {
            const a = makerStars[state.ids[i - 1] - 1];
            const b = makerStars[state.ids[i] - 1];
            line(project(a.x, a.y), project(b.x, b.y), "#E4BC72", 1.6, progress);
        }
        for (const star of makerStars)
        {
            const point = project(star.x, star.y);
            const active = state.ids.includes(star.id);
            dot(point, active ? 4.2 : 3.5, active ? "#E4BC72" : "#B9CBFF");
            ctx.beginPath();
            ctx.arc(point.x, point.y, active ? 8 : 6, 0, Math.PI * 2);
            ctx.strokeStyle = active ? "#E4BC72" : "rgba(185,203,255,.35)";
            ctx.lineWidth = .8;
            ctx.stroke();
        }
    }
    const svg = $(".story-diagram");
    if (svg)
    {
        svg.style.strokeDasharray = "1";
        svg.style.strokeDashoffset = String(1 - traceProgress);
    }
    canvas.dataset.zoom = String(zoom);
    canvas.dataset.pan = `${Math.round(panX)},${Math.round(panY)}`;
    canvas.dataset.day = String(day);
}

function tick(time)
{
    frame = null;
    if (destroyed || !ready || document.hidden)
    {
        return;
    }
    if (zoomTransition)
    {
        const progress = clamp((time - zoomTransition.start) / 140, 0, 1);
        zoom = zoomTransition.from + (zoomTransition.to - zoomTransition.from) * ease(progress);
        if (progress === 1)
        {
            zoomTransition = null;
        }
    }
    if (dateTransition)
    {
        const progress = clamp((time - dateTransition.start) / 160, 0, 1);
        day = dateTransition.from + (dateTransition.to - dateTransition.from) * ease(progress);
        if (progress === 1)
        {
            dateTransition = null;
        }
    }
    if (traceStart !== null)
    {
        const progress = clamp((time - traceStart) / 700, 0, 1);
        traceProgress = ease(progress);
        if (progress === 1)
        {
            traceStart = null;
            announce(u.traced(patterns[state.selected].name));
        }
    }
    if (makerStart !== null && time - makerStart >= makerDuration)
    {
        makerStart = null;
    }
    if (momentum)
    {
        const elapsed = time - momentum.start;
        const delta = Math.min(32, time - lastPaint);
        const damping = Math.exp(-elapsed / 100);
        panX += momentum.vx * delta * damping;
        panY += momentum.vy * delta * damping;
        if (elapsed >= 550 || damping < .006)
        {
            momentum = null;
        }
    }
    clampPan();
    paint(time);
    lastPaint = time;
    const active = gesture || momentum || zoomTransition || dateTransition || traceStart !== null || makerStart !== null;
    if (active)
    {
        frame = requestAnimationFrame(tick);
    }
    else if (!reduced)
    {
        timer = setTimeout(() =>
        {
            timer = null;
            frame = requestAnimationFrame(tick);
        }, 1000 / 24);
    }
}

function wake()
{
    if (!ready || destroyed || document.hidden)
    {
        return;
    }
    clearTimeout(timer);
    timer = null;
    if (frame === null)
    {
        frame = requestAnimationFrame(tick);
    }
}

function resize()
{
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    pixelRatio = Math.min(devicePixelRatio || 1, width <= 700 ? 1.5 : 1.75);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    scale = Math.max(.05, Math.min((width - 120) / 1600, (height - 120) / 1000));
    clampPan();
    wake();
}

function localPointer(event)
{
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function distanceToSegment(point, a, b)
{
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(point.x - a.x - t * dx, point.y - a.y - t * dy);
}

function hit(point)
{
    if (state.mode === "create")
    {
        let nearest = null;
        let distance = 22;
        for (const star of makerStars)
        {
            const p = project(star.x, star.y);
            const d = Math.hypot(p.x - point.x, p.y - point.y);
            if (d < distance)
            {
                distance = d;
                nearest = star;
            }
        }
        if (nearest)
        {
            addPoint(nearest.id);
        }
        return;
    }
    let nearest = null;
    let distance = 20;
    for (const pattern of patterns)
    {
        for (const [a, b] of pattern.edges)
        {
            const d = distanceToSegment(point, guidePoint(pattern, a), guidePoint(pattern, b));
            if (d < distance)
            {
                distance = d;
                nearest = pattern;
            }
        }
        for (let i = 0; i < pattern.points.length; i++)
        {
            const p = guidePoint(pattern, i);
            const d = Math.hypot(p.x - point.x, p.y - point.y);
            if (d < distance)
            {
                distance = d;
                nearest = pattern;
            }
        }
    }
    if (nearest)
    {
        selectStory(nearest.id);
    }
}

listen(canvas, "pointerdown", (event) =>
{
    if (gesture || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0))
    {
        return;
    }
    const p = localPointer(event);
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    momentum = null;
    gesture = { id: event.pointerId, startX: p.x, startY: p.y, lastX: p.x, lastY: p.y, time: performance.now(), moved: false, vx: 0, vy: 0 };
    wake();
});
listen(canvas, "pointermove", (event) =>
{
    if (!gesture || event.pointerId !== gesture.id)
    {
        return;
    }
    const p = localPointer(event);
    const time = performance.now();
    if (!gesture.moved && Math.hypot(p.x - gesture.startX, p.y - gesture.startY) > 6)
    {
        gesture.moved = true;
    }
    if (gesture.moved)
    {
        const dx = p.x - gesture.lastX;
        const dy = p.y - gesture.lastY;
        panX += dx;
        panY += dy;
        gesture.vx = dx / Math.max(8, time - gesture.time);
        gesture.vy = dy / Math.max(8, time - gesture.time);
        clampPan();
        gesture.lastX = p.x;
        gesture.lastY = p.y;
        gesture.time = time;
        wake();
    }
});
function releasePointer(event)
{
    if (!gesture || event.pointerId !== gesture.id)
    {
        return;
    }
    const previous = gesture;
    gesture = null;
    if (canvas.hasPointerCapture(event.pointerId))
    {
        canvas.releasePointerCapture(event.pointerId);
    }
    if (event.type === "pointerup")
    {
        if (!previous.moved)
        {
            hit(localPointer(event));
        }
        else if (!reduced && performance.now() - previous.time < 80)
        {
            momentum = { vx: previous.vx, vy: previous.vy, start: performance.now() };
        }
    }
    wake();
}
listen(canvas, "pointerup", releasePointer);
listen(canvas, "pointercancel", releasePointer);
listen(canvas, "lostpointercapture", releasePointer);
listen(canvas, "keydown", (event) =>
{
    if (event.target !== canvas || event.ctrlKey || event.metaKey || event.altKey)
    {
        return;
    }
    const movement = { ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -40], ArrowDown: [0, 40] };
    if (movement[event.key])
    {
        event.preventDefault();
        momentum = null;
        panX += movement[event.key][0];
        panY += movement[event.key][1];
        clampPan();
        announce(u.panned);
        wake();
    }
    else if (["+", "=", "-", "Escape"].includes(event.key))
    {
        event.preventDefault();
        if (event.key === "Escape")
        {
            setMode("explore");
        }
        else
        {
            setZoom(state.zoom + (event.key === "-" ? -.15 : .15));
        }
    }
});
listen(motion, "change", () =>
{
    reduced = motion.matches;
    if (reduced)
    {
        zoom = state.zoom;
        day = dayFromDate(state.date);
        zoomTransition = null;
        dateTransition = null;
        momentum = null;
        makerStart = null;
        const tracing = traceStart !== null;
        traceStart = null;
        traceProgress = 1;
        if (tracing)
        {
            announce(u.traced(patterns[state.selected].name));
        }
    }
    wake();
});
listen(document, "visibilitychange", () =>
{
    if (document.hidden)
    {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        frame = null;
        timer = null;
        momentum = null;
    }
    else
    {
        wake();
    }
});
const observer = new ResizeObserver(resize);
observer.observe(canvas);
listen(window, "pagehide", (event) =>
{
    if (event.persisted)
    {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        frame = null;
        timer = null;
        return;
    }
    destroyed = true;
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    clearTimeout(saveTimer);
    observer.disconnect();
    cleanups.forEach((cleanup) => cleanup());
});
listen(window, "pageshow", () => wake());
renderPanel();
$("#chapter").textContent = u.chapters[Math.min(3, Math.floor(day / 91.25))];
await document.fonts.ready;
ready = true;
resize();
