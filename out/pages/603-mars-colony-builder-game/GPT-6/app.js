import { C, glyphs } from "./content.js";
import { STOCKS, newGame, tick, terrain, housing, forecast, applyAction, checkAction, solarYield } from "./sim.js";
import { load, store, clearSave, soundPreference } from "./save.js";
import { Crater } from "./draw.js";
import { Audio } from "./audio.js";
import { icons } from "./icons.js";

document.title = C.title;
const root = document.querySelector("#app");
const svg = (kind) => `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">${glyphs[kind]}</svg>`;
const mark = '<img src="./favicon.svg" width="40" height="40" alt="">';
const credit = `<a class="credit" href="${C.creditUrl}" target="_blank" rel="noopener noreferrer">${C.credit}</a>`;
root.innerHTML = `
    <header class="topbar"><span class="mobile-name">${mark}<strong>${C.brand}</strong><small>${C.crater}</small></span><span id="mobile-sol"></span><button id="mobile-sound" data-action="sound" class="icon-button" aria-label="${C.soundOff}">${icons.mute}</button><button id="mobile-help" data-action="help" class="icon-button" aria-label="${C.help}">${icons.help}</button></header>
    <canvas id="crater" aria-hidden="true"></canvas>
    <div id="fallback" hidden>${C.fallback}</div>
    <div id="hud" class="hud"></div>
    <div class="map-caption"><span>${C.crater.toUpperCase()}</span><i></i><span>${C.mapLabel}</span></div>
    <div id="toast" class="toast" aria-hidden="true"></div>
    <div id="announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <dialog id="dialog" aria-labelledby="dialog-title"></dialog>`;
const canvas = document.querySelector("#crater"), hud = document.querySelector("#hud");
const dialog = document.querySelector("#dialog"), announcer = document.querySelector("#announcer");
let state = newGame(), started = false, pending = null, tool = null, cursor = null, keyboardCursor = { c: 5, r: 6 };
let saved = load(), log = C.ready, toastTimer, dialogKind = null, returnFocus = null;
let advanced = false, failedResult = null;
const audio = new Audio(soundPreference());
let crater;
function currentBuildings() { return applyAction(state, pending); }
function announce(message)
{
    announcer.textContent = "";
    requestAnimationFrame(() => { announcer.textContent = message; });
}
function notify(message)
{
    log = message;
    const node = document.querySelector("#toast");
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("visible"), 2200);
    announce(message);
}
function save()
{
    if (!store(state)) notify(C.storageError);
    saved = load();
}
function status()
{
    if (!cursor) return matchMedia("(pointer: coarse)").matches ? C.mapTouch : C.mapHint;
    const { c, r } = cursor, t = terrain(c, r);
    const building = currentBuildings().find((b) => b.c === c && b.r === r);
    if (building) return C.location(c, r, C.tools.find((b) => b.kind === building.kind).label);
    if (t !== "floor") return C.location(c, r, C.cellNames[t]);
    return C.floor(solarYield(currentBuildings(), cursor, false), solarYield(currentBuildings(), cursor, true));
}
function updateStatus()
{
    const el = document.querySelector("#cell-status");
    if (el) el.textContent = status();
    crater?.paint();
}
function render()
{
    const focusId = document.activeElement?.id;
    const preview = tick(state, pending), next = preview.state;
    const weather = forecast(state.sol), disabled = !started ? 'disabled aria-disabled="true"' : 'aria-disabled="false"';
    const stocks = STOCKS.map((key) => `
        <div class="stock ${key}${state[key] < 25 ? " low" : ""}">
            <div class="stock-head"><span>${C.stocks[key]}</span><span><b data-stock="${key}">${state[key]}</b><small>${state[key] < 25 ? C.low : C.stockUnit}</small></span></div>
            <div class="track"><i style="width:${state[key]}%"></i></div>
        </div>`).join("");
    const previewRows = [...STOCKS, "population"].map((key) => `
        <div class="preview-item ${key !== "population" && next[key] < 25 ? "danger" : next[key] < state[key] ? "falling" : ""}">
            <span>${C.abbreviations[key]}</span><b data-preview="${key}">${state[key]} <em>→</em> ${next[key]}${key !== "population" && next[key] < 25 ? ` <small>${C.low}</small>` : ""}</b>
        </div>`).join("");
    hud.innerHTML = `
        <section class="left glass" aria-label="${C.brand}">
            <div class="brand"><div class="eyebrow">${mark}<span>${C.eyebrow}</span></div><h1>${C.brand}</h1><p class="crater-name">${C.crater}</p><p class="tagline">${C.tagline}</p></div>
            ${!started ? `<div class="intro"><span class="mobile-eyebrow eyebrow">${C.eyebrow}</span><h1 class="mobile-title">${C.brand}</h1><p class="mobile-tagline">${C.tagline}</p><p class="intro-body">${C.body}</p><div class="title-actions"><button id="open" class="primary" data-action="open">${C.open}<span aria-hidden="true">↗</span></button><button id="resume" class="secondary" data-action="resume" ${!saved ? "disabled" : ""}>${C.resume}</button></div>${credit}</div>` : ""}
            <div class="sol-block"><span class="eyebrow">${C.sol}</span><strong id="sol">${String(state.sol).padStart(2, "0")}</strong><span class="sol-line"></span></div>
            <div class="forecast-pop"><div class="forecast ${weather.active ? "storm" : ""}"><span class="weather-dot"></span>${C.weather(weather.active, weather.count)}</div><p id="population">${C.population(state.population, housing(currentBuildings()))}</p></div>
            <div class="stocks">${stocks}</div>
            <div class="field-note"><span class="eyebrow">${C.logLabel}</span><p>${log}</p></div>
            <footer class="left-footer"><button id="help" data-action="help" class="utility">${icons.help}<span>${C.help}</span><kbd>H</kbd></button><button id="sound" data-action="sound" class="icon-button" aria-label="${audio.enabled ? C.soundOn : C.soundOff}" aria-pressed="${audio.enabled}">${audio.enabled ? icons.sound : icons.mute}</button></footer>
        </section>
        <section class="right glass" aria-label="${C.operations}">
            <div class="operations-heading"><span class="eyebrow">${C.operations}</span><h2>${C.buildHeading}</h2><p>${C.buildSub}</p></div>
            <div class="tools">${C.tools.map((t) => `<button id="tool-${t.kind}" data-tool="${t.kind}" class="tool ${tool === t.kind ? "selected" : ""}" ${disabled} aria-pressed="${tool === t.kind}">${svg(t.kind)}<span class="tool-copy"><strong class="desktop-label">${t.label}</strong><strong class="mobile-label">${t.short}</strong><small>${t.detail}</small></span><kbd>${t.key}</kbd></button>`).join("")}</div>
            <div class="readout"><span class="eyebrow">${C.selectLabel}</span><p id="cell-status">${status()}</p></div>
            <div class="planning"><div class="hint"><span>${pending ? C.pending : advanced ? C.hint : C.hintFirst}</span>${pending ? `<button id="undo" data-action="undo" class="undo" aria-label="${C.undo}">${icons.undo}</button>` : ""}</div><div class="preview"><div class="preview-label"><span>${C.next}</span><span class="${preview.powered ? "" : "danger"}">${preview.powered ? C.powered : C.idle}</span></div><div class="preview-grid">${previewRows}</div></div></div>
            <button id="advance" data-action="advance" class="primary advance ${preview.failed ? "warning" : ""}" ${disabled}><span>${preview.failed ? C.anyway : C.advance}</span><span class="advance-key">N <b aria-hidden="true">→</b></span></button>
            <p class="keyboard-hint">${C.keyHint}</p>
        </section>`;
    document.querySelector("#mobile-sol").textContent = `${C.sol} ${String(state.sol).padStart(2, "0")}`;
    const sound = document.querySelector("#mobile-sound");
    sound.innerHTML = audio.enabled ? icons.sound : icons.mute;
    sound.setAttribute("aria-label", audio.enabled ? C.soundOn : C.soundOff);
    sound.setAttribute("aria-pressed", String(audio.enabled));
    root.classList.toggle("started", started);
    root.classList.toggle("title-screen", !started);
    if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus({ preventScroll: true });
    crater?.paint();
}
function openDialog(kind, body, buttons, heading)
{
    returnFocus = document.activeElement?.id || (kind === "help" ? "help" : "advance");
    dialogKind = kind;
    dialog.className = kind === "help" ? "help-dialog" : "";
    dialog.innerHTML = `<div class="dialog-top"><span class="eyebrow">${C.eyebrow}</span>${kind === "help" ? `<button id="close-help" class="icon-button" data-action="close-help" aria-label="${C.close}">${icons.close}</button>` : ""}</div><h2 id="dialog-title">${heading}</h2><div class="dialog-body">${body}</div><div class="dialog-actions">${buttons}</div>`;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("button")?.focus({ preventScroll: true });
    if (kind === "fail" || kind === "win") announce(heading);
}
function closeDialog()
{
    const id = returnFocus;
    dialog.close();
    dialogKind = null;
    document.getElementById(id)?.focus({ preventScroll: true });
}
const dialogButton = (action, label, secondary = false) => `<button id="dialog-${action}" data-action="${action}" class="${secondary ? "secondary" : "primary"}">${label}</button>`;
function showHelp()
{
    openDialog("help", `<p>${C.audience}</p><p>${C.roster}</p>${C.helpSections.map(([title, text]) => `<section><h3>${title}</h3><p>${text}</p></section>`).join("")}${credit}`, "", C.helpTitle);
}
function startFresh()
{
    state = newGame(); pending = null; tool = null; cursor = null; started = true; advanced = false; log = C.ready;
    keyboardCursor = { c: 5, r: 6 };
    render();
}
function choose(kind)
{
    if (!started) return;
    tool = tool === kind ? null : kind;
    if (tool) announce(C.selected(C.tools.find((t) => t.kind === tool).label));
    render();
}
function undo()
{
    if (!started || !pending) return;
    pending = null;
    notify(C.noChange);
    render();
}
function act(cell)
{
    if (!started || dialog.open) return;
    if (!cell) { tool = null; render(); return; }
    cursor = { ...cell };
    if (pending && pending.c === cell.c && pending.r === cell.r) { undo(); return; }
    if (pending) { notify(C.errors.oneChange); updateStatus(); return; }
    if (!tool) { notify(C.errors.choose); updateStatus(); return; }
    const action = { ...cell, kind: tool }, invalid = checkAction(state, action, pending);
    if (invalid) { notify(C.errors[invalid]); updateStatus(); return; }
    pending = action;
    const label = C.tools.find((t) => t.kind === tool).label;
    notify(tool === "remove" ? C.removed(cell.c, cell.r) : C.queued(label, cell.c, cell.r));
    audio.play(tool === "remove" ? "remove" : "place");
    tool = null;
    render();
}
function advance()
{
    if (!started || dialog.open) return;
    const result = tick(state, pending);
    if (result.failed)
    {
        failedResult = result;
        audio.play("fail");
        const values = STOCKS.map((k) => `<div class="failure-value ${result.state[k] === 0 ? "danger" : ""}"><span>${C.stocks[k]}</span><b>${result.state[k]}</b></div>`).join("");
        openDialog("fail", `${result.failedStocks.map((k) => `<p>${C.fail[k]}</p>`).join("")}<p>${C.failedSol(result.attemptedSol)}</p><div class="failure-grid">${values}</div>`,
            dialogButton("retry", C.retry) + dialogButton("leave", C.leave, true), C.failTitle);
        return;
    }
    state = result.state; pending = null; advanced = true;
    notify(C.toast(result));
    save();
    audio.play(result.stormStart ? "storm" : result.growth ? "growth" : "advance");
    render();
    if (state.population >= 50 && !state.wonDismissed)
    {
        audio.play("win");
        openDialog("win", `<p>${C.winBody}</p><p class="dialog-tagline">${C.tagline}</p><p class="mono">${C.wonSol(result.attemptedSol)}</p>`,
            dialogButton("keep-surveying", C.keepSurveying) + dialogButton("found-again", C.foundAgain, true), C.winTitle);
    }
}
const handlers =
{
    open()
    {
        if (saved) openDialog("replace", `<p>${C.replaceBody}</p>`, dialogButton("replace", C.replace) + dialogButton("keep", C.keep, true), C.replaceTitle);
        else startFresh();
    },
    replace() { closeDialog(); startFresh(); save(); },
    keep() { closeDialog(); },
    resume()
    {
        const latest = load();
        if (!latest) return;
        state = latest; pending = null; tool = null; started = true; advanced = state.sol > 1; render();
    },
    help: showHelp,
    "close-help": closeDialog,
    sound()
    {
        audio.enabled = !audio.enabled;
        soundPreference(audio.enabled);
        announce(audio.enabled ? C.soundOn : C.soundOff);
        render();
    },
    undo,
    advance,
    retry()
    {
        if (!failedResult) return;
        pending = null; failedResult = null;
        closeDialog(); notify(C.noChange); render();
    },
    leave()
    {
        closeDialog();
        const cleared = clearSave();
        saved = null; state = newGame(); pending = null; tool = null; cursor = null; started = false; advanced = false; log = C.ready;
        failedResult = null;
        render();
        document.querySelector("#open")?.focus();
        if (!cleared) notify(C.storageError);
    },
    "keep-surveying"()
    {
        state = { ...state, wonDismissed: true };
        save(); closeDialog(); render();
    },
    "found-again"()
    {
        openDialog("reset", `<p>${C.resetBody}</p>`, dialogButton("reset", C.resetConfirm) + dialogButton("reset-cancel", C.resetCancel, true), C.reset);
    },
    "reset-cancel"()
    {
        closeDialog();
        openDialog("win", `<p>${C.winBody}</p><p>${C.tagline}</p>`,
            dialogButton("keep-surveying", C.keepSurveying) + dialogButton("found-again", C.foundAgain, true), C.winTitle);
    },
    reset() { closeDialog(); startFresh(); save(); }
};
root.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.dataset.tool) choose(button.dataset.tool);
    else handlers[button.dataset.action]?.();
});
dialog.addEventListener("cancel", (event) =>
{
    event.preventDefault();
    if (dialogKind === "help") closeDialog();
});
dialog.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab") return;
    const targets = [...dialog.querySelectorAll("button, a[href]")];
    if (event.shiftKey && document.activeElement === targets[0])
    {
        event.preventDefault(); targets.at(-1)?.focus();
    }
    else if (!event.shiftKey && document.activeElement === targets.at(-1))
    {
        event.preventDefault(); targets[0]?.focus();
    }
});
document.addEventListener("keydown", (event) =>
{
    if (dialog.open || event.ctrlKey || event.metaKey || event.altKey || event.target.closest("button, a, input, textarea, select")) return;
    const key = event.key.toLowerCase();
    if (!["1", "2", "3", "4", "x", "u", "backspace", "escape", "n", "h", "m", "arrowleft", "arrowright", "arrowup", "arrowdown", "enter"].includes(key)) return;
    event.preventDefault();
    if (key === "h") { showHelp(); return; }
    if (key === "m") { handlers.sound(); return; }
    if (!started) return;
    if (key === "escape") { tool = null; render(); return; }
    if (key === "u" || key === "backspace") { undo(); return; }
    if (key === "n") { advance(); return; }
    if (key === "enter") { act(keyboardCursor); return; }
    const kinds = { "1": "habitat", "2": "solar", "3": "greenhouse", "4": "drill", x: "remove" };
    if (kinds[key]) { choose(kinds[key]); return; }
    const delta = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] }[key];
    if (delta)
    {
        do
        {
            keyboardCursor.c = (keyboardCursor.c + delta[0] + 12) % 12;
            keyboardCursor.r = (keyboardCursor.r + delta[1] + 12) % 12;
        } while (terrain(keyboardCursor.c, keyboardCursor.r) === "void");
        cursor = { ...keyboardCursor }; updateStatus();
    }
});
render();
crater = new Crater(canvas, () => ({ state, pending, tool, cursor }), act, (p) => { cursor = p; updateStatus(); },
    () => { document.querySelector("#fallback").hidden = false; });
window.addEventListener("pagehide", () =>
{
    clearTimeout(toastTimer);
    crater.dispose();
    audio.dispose();
}, { once: true });
