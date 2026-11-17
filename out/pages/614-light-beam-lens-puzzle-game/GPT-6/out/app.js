import { content, shell } from "./content.js";
import { levels } from "./levels.js";
import { traceBeam } from "./trace.js";
import { initialState, reducer, persisted, storageKey } from "./state.js";
import { CrystalScene } from "./scene.js";
import { CaveAudio } from "./audio.js";
import { icons } from "./icons.js";

document.body.insertAdjacentHTML("afterbegin", shell);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let storageAvailable = true;
let saved;
try
{
    saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
}
catch
{
    storageAvailable = false;
}
let state = initialState(saved || {});
const audio = new CaveAudio();
const dialog = $("#dialog");
let restoreFocus = null;
let completionTimer;
let suppressClose = false;
const scene = new CrystalScene($("#board"), (index) => dispatch({ type: "rotate", index }));

function paintIcons(root = document)
{
    for (const button of root.querySelectorAll("[data-icon]"))
    {
        button.querySelector("svg")?.remove();
        button.insertAdjacentHTML("afterbegin", icons[button.dataset.icon]);
    }
}

function persist()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(persisted(state)));
    }
    catch
    {
        storageAvailable = false;
    }
    if (!storageAvailable) $(".rail-footer p:nth-child(2)").textContent = content.storageUnavailable;
}

function render(rebuild = false, animate = true)
{
    const level = levels[state.current];
    const trace = traceBeam(level, state.rotations);
    $("#chamber").textContent = content.chamber(level.id);
    $("#level-number").textContent = content.levelNumber(level.id);
    $("#level-name").textContent = level.name;
    $("#instruction").textContent = content.instructions[state.current];
    $("#moves").textContent = state.moves;
    $("#target").textContent = level.target;
    $("#best").textContent = state.best[level.id] ? content.best(state.best[level.id]) : "";
    $("#receiver-status").textContent = content.receiverStatus(trace.lit.length, level.receivers.length);
    $("#completion-status").textContent = trace.solved ? content.complete : "";
    $(".receiver-status").classList.toggle("active", trace.lit.length > 0);
    $$('[data-action="undo"]').forEach((button) => { button.disabled = !state.history.length; });
    $("#splitter-legend").hidden = !level.pieces.some((piece) => piece.type === "P");
    $("#continue").hidden = !trace.solved;
    $("#piece-count").textContent = String(level.pieces.length).padStart(2, "0");
    const focusedPiece = document.activeElement?.dataset.piece;
    $("#piece-list").innerHTML = level.pieces.map((piece) =>
        `<button data-piece="${piece.id}" aria-current="${piece.id === state.selected}">${content.piece(piece, state.rotations[piece.id])}</button>`).join("");
    if (focusedPiece !== undefined) $(`[data-piece="${focusedPiece}"]`)?.focus({ preventScroll: true });
    $$('[data-action="sound"]').forEach((button) =>
    {
        button.dataset.icon = state.sound ? "Volume2" : "VolumeX";
        button.innerHTML = `<span>${state.sound ? content.soundOn : content.soundOff}</span>`;
        button.setAttribute("aria-pressed", String(state.sound));
    });
    paintIcons();
    if (rebuild) scene.build(level);
    scene.update(state, trace, animate);
    return trace;
}

function dispatch(action)
{
    clearTimeout(completionTimer);
    const before = state;
    const wasSolved = traceBeam(levels[state.current], state.rotations).solved;
    state = reducer(state, action);
    const trace = render(action.type === "level", action.type !== "level" && action.type !== "restart");
    persist();
    if (["level", "restart", "undo"].includes(action.type)) closeDialog(false);
    if (!wasSolved && trace.solved && action.type === "rotate")
    {
        audio.chime();
        completionTimer = setTimeout(() => openDialog("complete"), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450);
    }
    if (before.current !== state.current) scene.wasSolved = false;
}

function closeDialog(focus = true)
{
    clearTimeout(completionTimer);
    if (dialog.open)
    {
        suppressClose = true;
        dialog.close();
        suppressClose = false;
    }
    state = reducer(state, { type: "dialog", dialog: null });
    if (focus) (restoreFocus?.isConnected ? restoreFocus : $("#board")).focus({ preventScroll: true });
}

function openDialog(kind)
{
    clearTimeout(completionTimer);
    if (!dialog.open) restoreFocus = document.activeElement;
    state = reducer(state, { type: "dialog", dialog: kind });
    let markup;
    if (kind === "levels")
    {
        markup = `<p class="eyebrow">${content.brand.toUpperCase()}</p><h2 id="dialog-title">${content.levels}</h2><p>${content.levelsIntro}</p>
        <div class="level-grid">${levels.map((level, index) =>
        `<button data-level="${index}" aria-current="${state.current === index}"><span class="level-id">${String(level.id).padStart(2, "0")}</span>
        <span class="level-title">${level.name}</span>${state.solved.includes(level.id) ? `${icons.Check}<small>${content.best(state.best[level.id])}</small>` : ""}</button>`).join("")}</div>`;
    }
    else if (kind === "help")
    {
        markup = `<p class="eyebrow">${content.brand.toUpperCase()}</p><h2 id="dialog-title">${content.help}</h2><p>${content.helpIntro}</p>
        <ol>${content.steps.map((step) => `<li>${step}</li>`).join("")}</ol><p>${content.rules}</p>
        <p class="keyboard-help">${content.keyboard}</p><button data-action="sound" data-icon="VolumeX"></button>`;
    }
    else
    {
        const level = levels[state.current];
        markup = `<div class="completion-mark"><img src="./facet.svg" alt="" width="50" height="60"></div>
        <p class="eyebrow">${level.name.toUpperCase()}</p><h2 id="dialog-title">${content.complete}</h2>
        <p>${content.completeStats(state.moves, level.target)}</p><p class="completion-tagline">${content.tagline}</p>
        <div class="dialog-actions"><button class="primary" data-action="next">${state.current === 11 ? content.back : content.next}${icons.ChevronRight}</button>
        <button data-action="restart">${content.replay}</button></div>`;
    }
    $("#dialog-content").innerHTML = markup;
    if (!dialog.open) dialog.showModal();
    render();
    $("#close-dialog").focus({ preventScroll: true });
}

async function toggleSound()
{
    if (state.sound)
    {
        audio.disable();
        dispatch({ type: "sound" });
    }
    else if (await audio.enable())
    {
        dispatch({ type: "sound" });
    }
}

function actionClick(event)
{
    const piece = event.target.closest("[data-piece]");
    if (piece)
    {
        dispatch({ type: "rotate", index: Number(piece.dataset.piece) });
        return;
    }
    const level = event.target.closest("[data-level]");
    if (level)
    {
        dispatch({ type: "level", index: Number(level.dataset.level) });
        $("#board").focus({ preventScroll: true });
        return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "levels" || action === "help" || action === "complete") openDialog(action);
    else if (action === "sound") void toggleSound();
    else if (["rotate", "undo", "restart"].includes(action)) dispatch({ type: action });
    else if (action === "next")
    {
        if (state.current === 11) openDialog("levels");
        else dispatch({ type: "level", index: state.current + 1 });
    }
}

function keydown(event)
{
    if (dialog.open)
    {
        if (event.key === "Escape")
        {
            event.preventDefault();
            closeDialog();
        }
        return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("button, a, input, select, textarea, summary")) return;
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key))
    {
        event.preventDefault();
        const step = key === "arrowleft" || key === "arrowup" ? -1 : 1;
        dispatch({ type: "select", index: state.selected + step });
    }
    else if (key === "enter" || key === " ")
    {
        event.preventDefault();
        dispatch({ type: "rotate" });
    }
    else if (key === "u") dispatch({ type: "undo" });
    else if (key === "r") dispatch({ type: "restart" });
    else if (key === "l") openDialog("levels");
}

$("#close-dialog").addEventListener("click", () => closeDialog());
dialog.addEventListener("cancel", (event) =>
{
    event.preventDefault();
    closeDialog();
});
dialog.addEventListener("close", () =>
{
    if (!suppressClose) state = reducer(state, { type: "dialog", dialog: null });
});
document.addEventListener("click", actionClick);
document.addEventListener("keydown", keydown);
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden) audio.disable();
    // Audio only resumes after a new explicit activation.
});
render(true, false);
persist();
// A remembered preference must not start audio before a user gesture.
if (state.sound)
{
    state = { ...state, sound: false };
    render();
}
window.addEventListener("pagehide", () =>
{
    clearTimeout(completionTimer);
    scene.dispose();
    void audio.close();
    document.removeEventListener("click", actionClick);
    document.removeEventListener("keydown", keydown);
}, { once: true });
