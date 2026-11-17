import { C, homeContent, wardrobeContent, arcadeContent, nextContent, shellContent } from "./content.mjs";
import { initial, tick, care, log, purchase } from "./simulation.mjs";
import { load, save } from "./storage.mjs";
import { pet, habitat, accessory } from "./art.mjs";
import { Game } from "./game.mjs";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => `<svg aria-hidden="true"><use href="./icons.svg#${name}"></use></svg>`;
const safe = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
document.body.innerHTML = shellContent;
let loaded;
try { loaded = load(window.localStorage); }
catch { loaded = { state: initial(), notice: C.text.storage, unavailable: true }; }
let state = loaded.state;
let view = "";
let game;
let selected = "catch";
let cooldown = 0;
let reactionTimer;
let toastTimer;
let saveUnavailable = loaded.unavailable || false;
let destination;
let exitWasRunning;
let returnFocus;
let displayedCoins = state.coins;

function persist()
{
    try { if (!save(state, window.localStorage)) throw Error(); }
    catch
    {
        if (!saveUnavailable) toast(C.text.storage);
        saveUnavailable = true;
    }
    const indicator = $("#save-state");
    if (indicator) indicator.textContent = saveUnavailable ? C.text.storage : C.text.saved;
}
function toast(message)
{
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2400);
}
function heading(eyebrow, title, description, label = "")
{
    return `<section class="view-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>${label ? `<span class="quiet-label">${label}</span>` : ""}</section>`;
}
function renderHome()
{
    return homeContent(state, { heading, habitat, pet, icon });
}
function renderWardrobe()
{
    return wardrobeContent(state, { heading, pet, icon });
}
function renderArcade()
{
    return arcadeContent(selected, state, { heading, pet, icon });
}
function update()
{
    $$("[data-balance]").forEach((el) => el.textContent = state.coins);
    if (displayedCoins !== state.coins && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        $(".wallet").animate([{ backgroundColor: "#F6C453", color: "#241D31" }, { backgroundColor: "transparent", color: "#F6C453" }], 300);
    }
    displayedCoins = state.coins;
    if (view === "home")
    {
        for (const m of C.meters)
        {
            const value = Math.round(state[m.key]);
            $(`#${m.key}-value`).textContent = value;
            $(`#${m.key}-bar`).setAttribute("aria-valuenow", value);
            $(`#${m.key}-bar i`).style.width = `${value}%`;
            $(`#${m.key}-status`).textContent = C.tiers[value >= 70 ? 3 : value >= 40 ? 2 : value > 0 ? 1 : 0];
        }
        const lowest = C.meters.reduce((a, b) => state[a.key] <= state[b.key] ? a : b);
        $("#recommendation").textContent = C.text.recommend(C.actions[lowest.action].label);
        $("#scene-condition").textContent = C.moods[state[lowest.key] >= 70 ? 0 : state[lowest.key] >= 40 ? 1 : 2];
        $("#scene-summary").textContent = `${C.pet}, a ${C.kind}, in ${C.habitat}. ${C.meters.map((m) => `${m.label} ${Math.round(state[m.key])} of 100`).join(". ")}.`;
        $(".scene").classList.toggle("needy", state[lowest.key] < 40);
        $("#activity").innerHTML = state.activity.map((a, i) => `<li><span class="moment-dot ${i === 0 ? "new" : ""}"></span>${safe(a)}</li>`).join("");
        const next = C.items.find((i) => !state.owned.includes(i.id));
        $("#next-item").innerHTML = nextContent(next, state, { pet, icon });
        $("#cooldown").textContent = Date.now() < cooldown ? C.text.cooldown : C.text.ready;
        $("#save-state").textContent = saveUnavailable ? C.text.storage : C.text.saved;
    }
    if (view === "wardrobe")
    {
        $("#equipped-name").textContent = C.items.find((i) => i.id === state.equipped)?.name || C.text.none;
        const overlay = $(".dressing-stage .accessory");
        if (overlay.dataset.accessory !== (state.equipped || "none"))
        {
            overlay.innerHTML = accessory(state.equipped);
            overlay.dataset.accessory = state.equipped || "none";
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches) overlay.animate([{ opacity: 0 }, { opacity: 1 }], 120);
        }
        $$("[data-buy]").forEach((button) =>
        {
            const item = C.items.find((i) => i.id === button.dataset.buy);
            const owned = state.owned.includes(item.id);
            const equipped = state.equipped === item.id;
            button.className = equipped ? "lavender" : owned || state.coins >= item.price ? "leaf" : "unaffordable";
            button.innerHTML = `${icon(equipped ? "check" : owned ? "shirt" : "lock")}${equipped ? C.text.equippedLabel : owned ? C.text.equip : C.text.unlock(item.price)}`;
            button.setAttribute("aria-pressed", equipped);
            button.closest(".outfit").classList.toggle("equipped", equipped);
        });
    }
    if (view === "games")
    {
        $$("[data-best]").forEach((el) => el.textContent = state.scores[el.dataset.best] === null ? C.text.noScore : C.text.high(state.scores[el.dataset.best]));
        $("#best").textContent = state.scores[selected] === null ? C.text.noScore : C.text.high(state.scores[selected]);
    }
}
function reaction(action)
{
    const scene = $(".scene");
    if (!scene) return;
    clearTimeout(reactionTimer);
    scene.dataset.reaction = action;
    $("#thought").textContent = C.actions[action]?.thought || C.text.petThought;
    reactionTimer = setTimeout(() =>
    {
        delete scene.dataset.reaction;
        if ($("#thought")) $("#thought").textContent = C.thought;
    }, 900);
}
function perform(action)
{
    if (Date.now() < cooldown) return toast(C.text.cooldown);
    const result = care(state, action);
    state = result.state;
    if (result.error)
    {
        reaction("blocked");
        $("#thought").textContent = result.error;
        toast(result.error);
        update();
        return;
    }
    cooldown = Date.now() + 1200;
    reaction(action);
    update();
    persist();
    setTimeout(() => { if (view === "home") update(); }, 1200);
}
function pathView()
{
    return location.hash === "#/games" ? "games" : location.hash === "#/wardrobe" ? "wardrobe" : "home";
}
function render()
{
    game?.destroy();
    game = null;
    clearTimeout(reactionTimer);
    view = pathView();
    document.title = C.text.documentTitle(view);
    $("#main").innerHTML = view === "home" ? renderHome() : view === "games" ? renderArcade() : renderWardrobe();
    $$("[data-nav]").forEach((a) =>
    {
        if (a.dataset.nav === view) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
    });
    update();
    if (view === "games") prepareGame();
}
function prepareGame()
{
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pet(state.equipped).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '))}`;
    let lastSecond;
    game = new Game($("#game"), selected,
    {
        petImage: image,
        update(snapshot)
        {
            $("#score").textContent = snapshot.score;
            $("#time").textContent = `${snapshot.remaining}s`;
            $("#pause").disabled = !["running", "paused"].includes(snapshot.phase);
            $("#pause").innerHTML = icon(snapshot.phase === "paused" ? "play" : "pause") + `<span>${snapshot.phase === "paused" ? C.text.resume : C.text.pause}</span>`;
            if (snapshot.remaining !== lastSecond)
            {
                $("#game-live").textContent = C.text.remaining(snapshot.score, snapshot.remaining);
                lastSecond = snapshot.remaining;
            }
            if (snapshot.phase === "paused")
            {
                $("#game-overlay").hidden = false;
                $("#game-overlay").innerHTML = `<div><h2>${C.text.paused}</h2><p>${C.text.pauseDescription}</p><button id="resume" class="leaf">${C.text.resume}</button></div>`;
            }
            else if (snapshot.phase === "running") $("#game-overlay").hidden = true;
        },
        complete(score, type)
        {
            state = log({ ...state, coins: state.coins + score, scores: { ...state.scores, [type]: Math.max(state.scores[type] || 0, score) } }, C.text.reward(score, C.games[type].title));
            update();
            persist();
            $("#game-overlay").hidden = false;
            $("#game-overlay").innerHTML = `<div><p class="eyebrow">${C.text.nice}</p><h2>${C.text.complete}</h2><p>${C.text.score} ${score} · <strong>+${score} ${C.coin}</strong></p><button id="again" class="leaf">${C.text.playAgain}</button><a href="./index.html" data-home>${C.text.back}</a></div>`;
            $("#again").focus({ preventScroll: true });
        }
    });
    image.onload = () => game?.draw();
    for (const [id, key] of [["left", "arrowleft"], ["right", "arrowright"]])
    {
        const button = $(`#${id}`);
        const press = (event) =>
        {
            if (game.phase !== "running") return;
            event.preventDefault();
            game.keys.add(key);
            if (event.isTrusted && event.pointerId !== undefined) button.setPointerCapture(event.pointerId);
        };
        button.addEventListener("pointerdown", press);
        button.addEventListener("pointerup", () => game.keys.delete(key));
        button.addEventListener("pointercancel", () => game.keys.delete(key));
        button.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") press(e); });
        button.addEventListener("keyup", () => game.keys.delete(key));
        button.addEventListener("blur", () => game?.keys.delete(key));
    }
    $(".touch-controls").hidden = selected !== "catch";
}
function openExit(callback)
{
    destination = callback;
    returnFocus = document.activeElement;
    exitWasRunning = game?.phase === "running";
    if (exitWasRunning) game.pause();
    $("#exit-dialog").showModal();
    $("#cancel-exit").focus();
}
function navigateHome()
{
    history.pushState(null, "", "./index.html");
    render();
}
document.addEventListener("click", (e) =>
{
    const button = e.target.closest("button");
    const link = e.target.closest("a");
    if (link && (link.dataset.nav || link.hasAttribute("data-home") || link.classList.contains("brand") || link.getAttribute("href") === "./index.html"))
    {
        e.preventDefault();
        const go = () => link.getAttribute("href") === "./index.html" ? navigateHome() : location.hash = link.hash;
        if (game && ["running", "paused"].includes(game.phase)) openExit(go);
        else go();
        return;
    }
    if (link && link.hash && ["#/games", "#/wardrobe"].includes(link.hash) && game && ["running", "paused"].includes(game.phase))
    {
        e.preventDefault();
        openExit(() => location.hash = link.hash);
        return;
    }
    if (!button) return;
    if (button.dataset.care) perform(button.dataset.care);
    if (button.id === "pat")
    {
        reaction("happy");
        state = log(state, C.text.petHappy);
        update();
        persist();
    }
    if (button.id === "reset-open")
    {
        returnFocus = button;
        $("#reset-dialog").showModal();
        $("#cancel-reset").focus();
    }
    if (button.id === "cancel-reset") { $("#reset-dialog").close(); returnFocus?.focus(); }
    if (button.id === "confirm-reset")
    {
        state = initial();
        cooldown = 0;
        $("#reset-dialog").close();
        render();
        persist();
        toast(C.text.reset);
        $("#reset-open").focus();
    }
    if (button.id === "remove-accessory")
    {
        state = log({ ...state, equipped: null }, C.text.originalLook);
        update();
        persist();
    }
    if (button.dataset.buy)
    {
        const result = purchase(state, button.dataset.buy);
        if (result.error) return toast(result.error);
        state = result.state;
        update();
        persist();
        if (result.unlocked)
        {
            toast(state.activity[0]);
            $(".dressing-stage").classList.remove("sparkle");
            void $(".dressing-stage").offsetWidth;
            $(".dressing-stage").classList.add("sparkle");
        }
    }
    if (button.dataset.game)
    {
        const change = () => { selected = button.dataset.game; render(); };
        if (game && ["running", "paused"].includes(game.phase)) openExit(change);
        else change();
    }
    if (button.id === "start") game.start();
    if (button.id === "pause" || button.id === "resume") game.pause();
    if (button.id === "restart")
    {
        if (["running", "paused"].includes(game.phase)) openExit(() => render());
        else render();
    }
    if (button.id === "again") render();
    if (button.id === "cancel-exit")
    {
        $("#exit-dialog").close();
        returnFocus?.focus();
        if (exitWasRunning && game?.phase === "paused") game.pause();
    }
    if (button.id === "confirm-exit")
    {
        $("#exit-dialog").close();
        game?.destroy();
        game = null;
        destination?.();
        toast(C.text.outOfRound);
    }
});
$("#reset-dialog").addEventListener("cancel", () => setTimeout(() => returnFocus?.focus(), 0));
$$("dialog").forEach((dialog) => dialog.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button:not(:disabled),a[href]")];
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
}));
$("#exit-dialog").addEventListener("cancel", () =>
{
    setTimeout(() =>
    {
        returnFocus?.focus();
        if (exitWasRunning && game?.phase === "paused") game.pause();
    }, 0);
});
document.addEventListener("keydown", (e) =>
{
    if (view !== "home" || e.ctrlKey || e.metaKey || e.altKey || e.repeat || $("dialog[open]") || e.target.closest("input,textarea,select,[contenteditable=true]")) return;
    const entry = Object.entries(C.actions).find(([, a]) => a.shortcut.toLowerCase() === e.key.toLowerCase());
    if (entry) { e.preventDefault(); perform(entry[0]); }
});
window.addEventListener("hashchange", () =>
{
    if (game && ["running", "paused"].includes(game.phase))
    {
        const next = location.hash;
        history.replaceState(null, "", "#/games");
        openExit(() => { location.hash = next; });
        return;
    }
    render();
});
window.addEventListener("popstate", () => { if (pathView() === view) return; if (!game || !["running", "paused"].includes(game.phase)) render(); });
window.addEventListener("pagehide", persist);
setInterval(() => { state = tick(state); if (view === "home") update(); }, 1000);
setInterval(persist, 10000);
render();
persist();
if (loaded.notice) toast(loaded.notice);
