import { C } from "./content.js";
import { initial, transact } from "./engine.js";
import { load, save } from "./storage.js";
import { icons } from "./icons.js";

const $ = (selector) => document.querySelector(selector);
const t = C.copy;
const restored = load();
let state = restored.state;
let focused = 7;
let busy = false;
let toastTimer;
let trigger;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const icon = (name, cls = "") => icons[name].replace("<svg ", `<svg class="icon ${cls}" aria-hidden="true" `);
const leaf = `<path d="M0 0C-17-2-18-16-16-19C-3-19 1-10 0 0M0 0C17-2 18-16 16-19C3-19-1-10 0 0" fill="#6e9b61" stroke="#304032" stroke-width="1.3"/><path d="M0 7V-7" stroke="#304032" stroke-width="2"/>`;

function cropArt(kind, progress, size = 1)
{
    const crop = C.crops[kind];
    const ratio = progress / crop.days;
    let drawing;
    if (!progress)
    {
        drawing = `<ellipse cy="-3" rx="9" ry="4" fill="#ad7f59"/><path d="m-2-6 3-2 3 2" fill="none" stroke="#f3c969" stroke-width="2"/>`;
    }
    else if (ratio < 0.5)
    {
        drawing = `<g transform="translate(0 -5) scale(.6)">${leaf}</g>`;
    }
    else if (ratio < 1)
    {
        drawing = `<g transform="translate(0 -9) scale(.85)">${leaf}<path d="M-1-6C-13-6-19-24-11-25 0-23 4-13-1-6" fill="#a8c686" stroke="#4f704b"/></g><ellipse cy="-2" rx="9" ry="3" fill="${crop.color}" opacity=".6"/>`;
    }
    else
    {
        const produce =
        [
            `<path d="M-12-17Q0-25 12-17L2 7Q0 10-2 7Z" fill="${crop.color}" stroke="#975338" stroke-width="1.5"/><path d="m-9-13 9 2m-5 5 7 1m-4 5 4 1" stroke="#f5ba73" stroke-width="2"/>`,
            `<path d="M-14-12Q-14-23 0-22Q16-22 14-10Q13 1 1 4L-1 9-3 3Q-14 1-14-12" fill="#eee7d7" stroke="#9e698d" stroke-width="1.5"/><path d="M-13-15Q0-27 14-15L12-9Q0-14-12-8Z" fill="${crop.color}"/>`,
            `<path d="M-16-13Q-18-26-5-23L0-20Q12-28 17-17Q17-5 3 7Q0 10-3 7Z" fill="${crop.color}" stroke="#91443c" stroke-width="1.5"/><path d="m-10-12 1 2m9-7 1 2m9-2 1 2m-7 6 1 2m-8-4 1 2m3 3 1 2" stroke="#f5d490" stroke-width="2"/>`
        ];
        drawing = `<g transform="translate(0 -8)">${produce[kind]}<g transform="translate(0 -22) scale(.78)">${leaf}</g></g><path d="m20-40 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#f3c969"/>`;
    }
    return `<g class="produce" transform="scale(${size})">${drawing}</g>`;
}

function tileDescription(index)
{
    const tile = state.tiles[index];
    const base = `${t.row} ${Math.floor(index / 6) + 1}, ${t.column} ${index % 6 + 1}`;
    if (tile.crop === null) return `${base} · ${tile.soil ? t.soil : t.grass}`;
    const crop = C.crops[tile.crop];
    return `${base} · ${crop.name} · ${tile.progress === crop.days ? t.ripe : `${tile.progress}/${crop.days} ${t.days} · ${tile.watered ? t.wet : t.dry}`}`;
}

function nextHint(tile)
{
    if (!tile.soil) return t.nextTill;
    if (tile.crop === null) return t.nextPlant;
    if (tile.progress === C.crops[tile.crop].days) return t.nextHarvest;
    return tile.watered ? t.nextDay : t.nextWater;
}

function legal(tile)
{
    return state.tool === 0 ? !tile.soil :
        state.tool === 1 ? tile.soil && tile.crop === null && state.inventory[state.seed] > 0 :
        state.tool === 2 ? tile.crop !== null && !tile.watered && tile.progress < C.crops[tile.crop].days :
        tile.crop !== null && tile.progress === C.crops[tile.crop].days;
}

function tree(x, y, scale = 1)
{
    return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="41" rx="26" ry="9" fill="#304032" opacity=".13"/><path d="M-5 39-3-13H5L7 39" fill="#94634b" stroke="#6f4336" stroke-width="2"/><path d="m0 12-14-14m17 9 13-16" fill="none" stroke="#6f4336" stroke-width="3"/><path d="M-31-13C-42-32-24-55-7-51 9-65 36-49 32-32 48-17 32 6 16 4 0 19-28 8-31-13" fill="#6e9b61" stroke="#4f7952" stroke-width="2"/><path d="M-25-24C-30-40-14-48-6-43 7-53 24-41 22-33" fill="none" stroke="#a8c686" stroke-width="7" stroke-linecap="round"/><path d="m-18-10 5 1m26-15 5-2" stroke="#a8c686" stroke-width="3"/></g>`;
}

function scenery()
{
    return `<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#ecedd6"/><stop offset="1" stop-color="#fff9ea"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="9"/></filter></defs>
        <g class="scenery" aria-hidden="true">
        <path d="M0 110Q60 5 160 77 238 17 330 75 440 14 508 69 599 15 640 94V220H0Z" fill="#e1e6c6"/>
        <path d="M0 130Q67 51 149 101 231 63 289 107 372 58 466 108 567 64 640 120V250H0Z" fill="#cbd9b2"/>
        <circle cx="486" cy="50" r="22" fill="#f3c969"/><circle cx="486" cy="50" r="29" fill="none" stroke="#f3c969" opacity=".3" stroke-width="2"/>
        <g class="cloud"><path d="M77 46Q71 34 85 31 89 15 105 27 119 23 122 37 137 47 122 50H83Z" fill="#fff9ea"/><path d="M349 47Q347 36 360 35 364 21 378 30 394 26 396 40 410 52 391 54H362Z" fill="#fff9ea"/></g>
        <path d="M608 106Q506 127 570 182T562 270Q545 295 608 310L640 328V113Z" fill="#78b7c2" opacity=".8"/><path d="M604 126Q555 144 593 184M590 213Q564 234 589 257" fill="none" stroke="#d4e5dc" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="320" cy="323" rx="239" ry="45" fill="#304032" opacity=".12" filter="url(#soft)"/>
        <path d="m68 213 252-126 252 126v23L320 362 68 236Z" fill="#8a7650" stroke="#796342" stroke-width="2"/><path d="m68 213 252 126 252-126" fill="none" stroke="#b09a68" stroke-width="4"/>
        ${tree(112, 137, .87)}${tree(531, 126, .72)}
        <g stroke="#94634b" stroke-width="7" stroke-linecap="round"><path d="m170 98 72-36m-65 23v30m23-42v30m23-42v30"/><path d="m404 63 67 34m-63-46v29m22-18v29m22-18v29"/></g><g stroke="#c49b71" stroke-width="2"><path d="m170 95 72-36m162 1 67 34"/></g>
        <g fill="#b3b69a" stroke="#969e87"><ellipse cx="111" cy="292" rx="9" ry="5"/><ellipse cx="124" cy="300" rx="5" ry="3"/><ellipse cx="530" cy="316" rx="8" ry="4"/></g>
        <g stroke="#8ca471" stroke-width="2" fill="none" stroke-linecap="round"><path d="m85 273 4 5 3-8m455 57 4 6 4-9M176 340l3 5 4-6m316-9 4 5 3-7"/></g>
        </g>`;
}

function board()
{
    const tiles = state.tiles.map((tile, index) => ({ tile, index })).sort((a, b) =>
        Math.floor(a.index / 6) + a.index % 6 - Math.floor(b.index / 6) - b.index % 6);
    return `<svg id="field" viewBox="0 0 640 430" aria-label="${C.farm}" xmlns="http://www.w3.org/2000/svg">
        ${scenery()}
        ${tiles.map(({ tile, index }) =>
        {
            const r = Math.floor(index / 6);
            const c = index % 6;
            const x = 320 + (c - r) * 42;
            const y = 102 + (r + c) * 21;
            const color = tile.soil ? tile.watered ? "#5d443c" : "#79503d" : (r + c) % 2 ? "#79a56a" : "#6e9b61";
            return `<g class="tile ${legal(tile) ? "legal" : ""} ${tile.crop !== null && tile.progress === C.crops[tile.crop].days ? "ready" : ""}" data-tile="${index}" tabindex="0" role="button" aria-label="${tileDescription(index)}" transform="translate(${x} ${y})">
                <path class="diamond" d="M0-21 42 0 0 21-42 0Z" fill="${color}" stroke="#304032" stroke-opacity=".16" stroke-width="1.5"/>
                ${tile.soil ? `<g class="scenery" fill="none" stroke="#b28462" stroke-width="1.5" opacity=".6"><path d="m-24-1 20 10m-8-16 20 10m-8-16 23 11"/></g>` :
                `<g class="scenery" fill="none" stroke="#b1ce8e" stroke-width="1.5" opacity=".6"><path d="m-17 1 3 2 1-5m19 5 3 2 2-5"/></g>`}
                ${tile.watered ? `<g class="scenery" stroke="#78b7c2" stroke-width="2" stroke-linecap="round"><path d="m-21 5 7 3m24-12 7 3"/></g>` : ""}
                <g class="crop-wrap" style="--delay:${index * .13}s">${tile.crop === null ? "" : cropArt(tile.crop, tile.progress)}</g>
                <path class="tile-focus" d="M0-21 42 0 0 21-42 0Z" fill="none" stroke="#fff9ea" stroke-width="3"/>
            </g>`;
        }).join("")}
        <g class="scenery"><path d="M0 0H640V430H0Z" class="lighting"/><g class="stars" fill="#fff9ea"><path d="m187 40 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm182-18 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm-73 47 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g></g>
        <text x="320" y="406" text-anchor="middle" class="scene-caption">${t.tag}</text>
    </svg>`;
}

function seedContent()
{
    return `<div class="pouch"><div class="eyebrow">${t.pouch}</div><div class="seed-list">${C.crops.map((crop, index) =>
        `<button class="seed ${state.seed === index ? "selected" : ""}" data-seed="${index}" ${state.inventory[index] ? "" : "disabled"} aria-pressed="${state.seed === index}">
        <svg viewBox="-30 -55 60 72" aria-hidden="true">${cropArt(index, crop.days)}</svg><span>${crop.name}</span><b>×${state.inventory[index]}</b></button>`).join("")}</div></div>
        <div class="shop"><div class="shop-title"><h2>${t.shop}</h2>${icon("ShoppingBasket")}</div><p class="muted">${t.shopIntro}</p>
        ${C.crops.map((crop, index) => `<div class="shop-row"><svg viewBox="-30 -55 60 72" aria-hidden="true">${cropArt(index, crop.days)}</svg><div><h3>${crop.name}</h3><span>${crop.days} ${t.days} · ${t.sellLabel} ${crop.sell}</span><strong>${crop.buy} <small>${C.currency}</small></strong></div><button data-buy="${index}" ${state.coins < crop.buy ? `disabled title="${t.poor}"` : ""}>${t.buy}</button></div>`).join("")}
        ${C.crops.some((crop) => crop.buy > state.coins) ? `<p class="afford">${t.poor}</p>` : ""}
        </div>`;
}

function shell()
{
    $("#app").innerHTML = `<header><div class="brand">${icon("Sprout")}<div><h1>${C.brand}</h1><span>${C.farm}</span></div></div>
        <div class="resources"><div class="pill day-pill">${icon("Sun")}<span id="day"></span></div><div class="pill money-pill">${icon("Coins")}<span id="coins"></span></div><div class="saved">${icon("Check")}<span id="save-status"></span></div></div>
        <div class="header-actions"><button data-dialog="help" aria-label="${t.help}">${icon("HelpCircle")}<span>${t.help}</span></button><button data-dialog="reset" aria-label="${t.reset}">${icon("RotateCcw")}<span>${t.reset}</span></button></div></header>
        <main>
        <aside class="left-rail"><section class="day-card">
        <svg class="sunrise" viewBox="0 0 180 94" aria-hidden="true"><path d="M8 75Q37 44 66 64 109 26 172 75" fill="#dbe4c2"/><path d="M54 68a36 36 0 0 1 72 0" fill="#f3c969"/><g stroke="#bd9b4b" stroke-width="2" stroke-linecap="round"><path d="M90 13V5m-38 23-6-6m82 6 6-6M33 59h-9m123 0h9"/></g><path d="M19 75h142M48 84h85" stroke="#8ca471" stroke-width="2" stroke-linecap="round"/></svg>
        <div class="eyebrow">${t.day} <span id="rail-day"></span> / ${t.morning}</div><h2>${t.today}</h2><p class="intro">${t.intro}</p>
        <ol>${t.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
        <button id="end-day" class="primary">${icon("Sunset")}${t.end}</button><p class="overnight">${t.overnight}</p>
        </section><section class="field-notes"><h3>${t.notes}</h3><div><span>${t.plots}</span><span>${t.tools}</span></div><p>${icon("Check")}${t.local}</p></section></aside>
        <section class="center"><div class="board-panel"><div class="board-heading"><div><div class="eyebrow">${t.field}</div><h2>${C.farm}</h2></div><span class="live-dot" aria-hidden="true"></span></div><p class="board-instruction">${t.instruction}</p><div id="board"></div></div>
        <section class="toolbelt" aria-label="${t.tools}"><div class="tool-buttons">${C.tools.map((tool, i) => `<button data-tool="${i}" aria-pressed="${state.tool === i}">${icon(tool.icon)}<span>${tool.name}</span></button>`).join("")}</div><p id="tool-hint"></p></section>
        <div class="inspector"><span class="soil-swatch" aria-hidden="true"></span><div><strong id="tile-state"></strong><small id="tile-hint"></small></div></div>
        </section><aside class="right-rail" id="desktop-shop"></aside>
        <button class="mobile-shop" data-dialog="shop">${icon("ShoppingBasket")}<span>${t.mobileShop}</span><b id="total-seeds"></b></button>
        </main><footer><span>${C.brand} · ${t.footer}</span><span>${t.privacy} <a href="${t.creditUrl}" target="_blank" rel="noopener">${t.credit}</a></span></footer>`;
    document.title = C.brand;
    render();
}

function render()
{
    const activeTile = document.activeElement?.dataset.tile;
    $("#day").textContent = `${t.day} ${state.day} · ${t.morning}`;
    $("#rail-day").textContent = String(state.day).padStart(2, "0");
    $("#coins").innerHTML = `${state.coins} <small>${C.currency}</small>`;
    $("#save-status").textContent = restored.available ? t.saved : t.unsaved;
    $("#board").innerHTML = board();
    $("#desktop-shop").innerHTML = seedContent();
    $("#total-seeds").textContent = `${state.inventory.reduce((a, b) => a + b, 0)} ${t.stock}`;
    document.querySelectorAll("[data-tool]").forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.tool) === state.tool));
    $("#tool-hint").textContent = C.tools[state.tool].hint;
    inspector();
    if ($("#dialog").open && $("#dialog").dataset.type === "shop")
    {
        const active = document.activeElement;
        const selector = active?.dataset.buy !== undefined ? `[data-buy="${active.dataset.buy}"]` : active?.dataset.seed !== undefined ? `[data-seed="${active.dataset.seed}"]` : ".dialog-close";
        $("#dialog .sheet-content").innerHTML = seedContent();
        ($("#dialog").querySelector(selector + ":not(:disabled)") || $("#dialog .dialog-close")).focus();
    }
    if (activeTile !== undefined) $(`[data-tile="${activeTile}"]`).focus({ preventScroll: true });
}

function inspector()
{
    $("#tile-state").textContent = tileDescription(focused);
    $("#tile-hint").textContent = nextHint(state.tiles[focused]);
}

function toast(message)
{
    if (!message) return;
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2500);
}

function dispatch(action)
{
    if (busy) return;
    const previousTile = action.type === "tile" ? structuredClone(state.tiles[action.value]) : null;
    const result = transact(state, action);
    if (result.ok)
    {
        state = result.state;
        restored.available = save(state);
        render();
    }
    toast(result.message);
    if (action.type === "tile")
    {
        const tile = $(`[data-tile="${action.value}"]`);
        tile.classList.add(result.ok ? `effect-${result.effect}` : "invalid");
        if (result.ok && !reduced.matches)
        {
            const fx = document.createElementNS("http://www.w3.org/2000/svg", "g");
            fx.setAttribute("class", "action-fx");
            if (result.effect === "water")
            {
                fx.innerHTML = [-12, 0, 12].map((x, i) => `<path class="water-drop" style="animation-delay:${i * 45}ms" d="M${x}-28q-8 12 0 12t0-12" fill="#78b7c2"/>`).join("");
            }
            if (result.effect === "harvest")
            {
                fx.innerHTML = `<g class="harvest-ghost">${cropArt(previousTile.crop, previousTile.progress)}</g>` +
                    Array.from({ length: 6 }, (_, i) => `<ellipse class="harvest-particle" style="--dx:${Math.cos(i * Math.PI / 3) * 30}px;--dy:${Math.sin(i * Math.PI / 3) * 20 - 24}px" cy="-14" rx="3" ry="${i % 2 ? 5 : 3}" fill="${i % 2 ? "#a8c686" : "#f3c969"}"/>`).join("");
            }
            if (result.effect === "till")
            {
                fx.innerHTML = Array.from({ length: 6 }, (_, i) => `<circle class="harvest-particle" style="--dx:${(i - 3) * 9}px;--dy:${-10 - i % 3 * 5}px" r="2" fill="#b68e64"/>`).join("");
            }
            tile.append(fx);
            setTimeout(() => fx.remove(), 650);
        }
        setTimeout(() => tile.classList.remove(`effect-${result.effect}`, "invalid"), 650);
    }
    if (result.effect === "purchase")
    {
        $(".money-pill").animate([{ background: "#f3c969" }, { background: "#fff9ea" }], { duration: reduced.matches ? 0 : 240 });
    }
}

async function endDay()
{
    if (busy) return;
    busy = true;
    $("#app").setAttribute("inert", "");
    $("#end-day").disabled = true;
    $("#board").classList.add("day-transition");
    if (!reduced.matches) await new Promise((resolve) => setTimeout(resolve, 700));
    const result = transact(state, { type: "day" });
    state = result.state;
    restored.available = save(state);
    const oldBoard = $("#board");
    // Keep the lighting animation mounted while the reducer advances exactly once.
    const freshBoard = document.createElement("div");
    freshBoard.innerHTML = board();
    oldBoard.querySelectorAll(".tile").forEach((tile, i) => tile.replaceWith(freshBoard.querySelectorAll(".tile")[0]));
    $("#day").textContent = `${t.day} ${state.day} · ${t.night}`;
    if (!reduced.matches) await new Promise((resolve) => setTimeout(resolve, 700));
    busy = false;
    $("#app").removeAttribute("inert");
    $("#end-day").disabled = false;
    $("#board").classList.remove("day-transition");
    render();
    $("#end-day").focus({ preventScroll: true });
    toast(result.message);
}

function openDialog(type, button)
{
    trigger = button;
    const dialog = $("#dialog");
    dialog.dataset.type = type;
    const title = type === "help" ? t.routine : type === "reset" ? t.resetTitle : t.mobileShop;
    const body = type === "help" ? `<ol class="help-steps">${t.helpSteps.map((step) => `<li>${step}</li>`).join("")}</ol><p class="muted">${t.keyboard}</p><button class="primary" data-close>${t.grow}</button>` :
        type === "reset" ? `<p class="reset-copy">${t.resetBody}</p><div class="dialog-actions"><button data-close>${t.keep}</button><button id="confirm-reset" class="primary">${t.start}</button></div>` :
            `<div class="sheet-content">${seedContent()}</div>`;
    dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button class="dialog-close" data-close aria-label="${t.close}">${icon("X")}</button></div>${body}`;
    dialog.showModal();
    dialog.querySelector(type === "reset" ? "[data-close]:not(.dialog-close)" : "button").focus();
}

document.addEventListener("click", (event) =>
{
    const tile = event.target.closest("[data-tile]");
    if (tile)
    {
        focused = Number(tile.dataset.tile);
        dispatch({ type: "tile", value: focused });
        return;
    }
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.tool !== undefined) dispatch({ type: "tool", value: Number(button.dataset.tool) });
    if (button.dataset.seed !== undefined) dispatch({ type: "seed", value: Number(button.dataset.seed) });
    if (button.dataset.buy !== undefined) dispatch({ type: "buy", value: Number(button.dataset.buy) });
    if (button.dataset.dialog) openDialog(button.dataset.dialog, button);
    if (button.hasAttribute("data-close")) $("#dialog").close();
    if (button.id === "end-day") endDay();
    if (button.id === "confirm-reset")
    {
        state = initial();
        restored.available = save(state);
        focused = 7;
        render();
        $("#dialog").close();
        toast(t.welcome);
    }
});

document.addEventListener("focusin", (event) =>
{
    if (event.target.dataset.tile !== undefined)
    {
        focused = Number(event.target.dataset.tile);
        inspector();
    }
});
document.addEventListener("keydown", (event) =>
{
    const tile = event.target.closest("[data-tile]");
    if (tile && !busy)
    {
        const index = Number(tile.dataset.tile);
        if (event.key === "Enter" || event.key === " ")
        {
            event.preventDefault();
            if (!event.repeat) dispatch({ type: "tile", value: index });
        }
        const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 6, ArrowUp: -6 };
        if (moves[event.key])
        {
            event.preventDefault();
            $(`[data-tile="${Math.max(0, Math.min(35, index + moves[event.key]))}"]`).focus();
        }
    }
    const dialog = $("#dialog");
    if (dialog.open && event.key === "Tab")
    {
        const items = [...dialog.querySelectorAll("button:not(:disabled), a[href]")];
        const first = items[0];
        const last = items.at(-1);
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
    }
});
$("#dialog").addEventListener("close", () => trigger?.focus({ preventScroll: true }));
shell();
restored.available = save(state);
render();
if (restored.fresh) toast(t.fresh);
