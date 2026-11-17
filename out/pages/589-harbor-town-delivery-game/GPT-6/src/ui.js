import { content as c, BRAND, TOWN_NAME, jobs, ROUND_SECONDS } from "./content.js";
import createElement from "../vendor/lucide/createElement.js";
import Package from "../vendor/lucide/icons/package.js";
import Truck from "../vendor/lucide/icons/truck.js";
import Pause from "../vendor/lucide/icons/pause.js";
import Volume2 from "../vendor/lucide/icons/volume-2.js";
import VolumeX from "../vendor/lucide/icons/volume-x.js";
import RotateCcw from "../vendor/lucide/icons/rotate-ccw.js";
import HelpCircle from "../vendor/lucide/icons/circle-help.js";
import ArrowRight from "../vendor/lucide/icons/arrow-right.js";
import ArrowUp from "../vendor/lucide/icons/arrow-up.js";
import ArrowDown from "../vendor/lucide/icons/arrow-down.js";
import ArrowLeft from "../vendor/lucide/icons/arrow-left.js";
import Anchor from "../vendor/lucide/icons/anchor.js";
import Clock from "../vendor/lucide/icons/clock.js";
import Check from "../vendor/lucide/icons/check.js";
import Navigation from "../vendor/lucide/icons/navigation.js";

const icons = { package: Package, truck: Truck, pause: Pause, volume: VolumeX, reset: RotateCcw, help: HelpCircle, right: ArrowRight, up: ArrowUp, down: ArrowDown, left: ArrowLeft, anchor: Anchor, clock: Clock, check: Check, navigation: Navigation };
const icon = name => `<span class="icon" data-icon="${name}" aria-hidden="true"></span>`;
export function createUI(root)
{
    root.innerHTML = `
        <header class="masthead">
            <a class="brand" href="./index.html" aria-label="${BRAND}"><span class="brand-mark">${icon("package")}</span><span>${BRAND}<small>${c.edition}</small></span></a>
            <div class="header-note">${icon("anchor")} ${c.headerNote}</div>
            <nav class="utilities" aria-label="${c.help}">
                <button id="sound" class="icon-button" aria-label="${c.soundOff}" title="${c.soundOff}" aria-pressed="false">${icon("volume")}</button>
                <button id="help" class="icon-button" aria-label="${c.help}" title="${c.help}">${icon("help")}</button>
            </nav>
        </header>
        <main>
            <div class="section-heading"><div><p class="eyebrow">${c.shift}</p><h1>${c.mapTitle}</h1><p class="subtitle">${c.mapSubtitle}</p></div><div class="location">${icon("anchor")}<span>${TOWN_NAME}<small>${c.live}</small></span><i></i></div></div>
            <div class="game-layout">
                <section class="game-board" aria-label="${c.mapAria}">
                    <canvas id="world" tabindex="0" aria-label="${c.mapAria}"></canvas>
                    <div id="target-marker" class="target-marker" aria-hidden="true" hidden></div>
                    <div class="hud">
                        <div class="stat timer">${icon("clock")}<div><small>${c.time}</small><strong id="time">3:00</strong></div></div>
                        <div class="stat"><div><small>${c.score}</small><strong id="score">000</strong></div></div>
                        <div class="stat"><div><small>${c.cargo}</small><strong><span id="cargo">0</span><em> / 6</em></strong></div></div>
                        <button id="pause" class="icon-button" aria-label="${c.pause}" title="${c.pause}">${icon("pause")}</button>
                    </div>
                    <div class="world-label">${icon("anchor")} ${TOWN_NAME}<span>${c.headerNote}</span></div>
                    <div id="modal" class="modal-layer" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                        <div class="start-card">
                            <span class="postmark">${icon("truck")}</span>
                            <p id="modal-eyebrow" class="eyebrow"></p>
                            <h2 id="modal-title"></h2>
                            <p id="modal-copy"></p>
                            <div id="result" hidden><span>${c.roundScore}</span><strong id="result-score"></strong><small id="result-note"></small></div>
                            <button id="primary" class="primary-button"></button>
                            <small id="modal-hint"></small>
                        </div>
                    </div>
                    <div class="route-nudge" id="route-nudge" hidden>${icon("navigation")}<span id="nudge"></span><button id="interact">${icon("package")}<span id="action-label"></span><kbd>E</kbd></button></div>
                    <button id="recover" class="recover" aria-label="${c.recover}" title="${c.recover}">${icon("reset")}<span>${c.recover}</span><kbd>R</kbd></button>
                    <div class="touch-controls" aria-label="${c.touchNote}">
                        <div class="steer-pad"><button data-key="ArrowLeft" aria-label="${c.mobileLeft}">${icon("left")}</button><button data-key="ArrowRight" aria-label="${c.mobileRight}">${icon("right")}</button></div>
                        <div class="pedal-pad"><button data-key="ArrowDown" aria-label="${c.mobileReverse}">${icon("down")}</button><button data-key="Space" aria-label="${c.mobileBrake}"><span class="brake-symbol">Ⅱ</span></button><button data-key="ArrowUp" aria-label="${c.mobileForward}">${icon("up")}</button></div>
                    </div>
                    <div id="load-status" class="load-status">${c.loading}</div>
                </section>
                <aside class="manifest">
                    <div class="manifest-title"><span class="eyebrow">${c.manifest}</span>${icon("package")}</div>
                    <h2>${c.route}</h2><p class="manifest-intro">${c.routeIntro}</p>
                    <div class="progress-label"><span id="progress-label">${c.progress(0)}</span><strong id="progress-percent">0%</strong></div>
                    <div class="progress-track"><div id="progress-fill"></div></div>
                    <div class="next-stop"><small>${c.destination}</small><strong id="next-stop">${c.depot}</strong><p id="next-copy">${c.pickup}</p></div>
                    <ol class="delivery-list">${jobs.map((job, index) => `<li data-job="${index}"><span class="stop-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${job.name}</strong><small>${job.resident}</small></div><span class="stop-dot" aria-label="${c.pending}"></span></li>`).join("")}</ol>
                    <div class="mini-heading"><span class="eyebrow">${c.overview}</span>${icon("navigation")}</div>
                    <canvas id="minimap" width="194" height="146"></canvas>
                    <div class="map-key"><span><i class="van-dot"></i>${c.player}</span><span><i></i>${c.stop}</span></div>
                </aside>
            </div>
            <div class="below-game">
                <div class="key-guide"><span class="eyebrow">${c.keyboard}</span><span><kbd>↑↓←→</kbd><b>/</b><kbd>WASD</kbd> ${c.drive}</span><span><kbd>${c.space}</kbd> ${c.brake}</span><span><kbd>${c.keyE}</kbd> ${c.interact}</span><span><kbd>${c.pauseKey}</kbd> ${c.pause.toLowerCase()}</span></div>
                <div class="best">${icon("check")}<span>${c.best} <strong id="best">—</strong></span></div>
            </div>
            <div class="status-line"><span id="status" role="status" aria-live="polite">${c.readyStatus}</span><button id="reset">${icon("reset")}${c.reset}</button></div>
        </main>
        <footer><span>${c.footer}</span><span>${c.localNote}<a href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${c.credit} ↗</a></span></footer>`;
    function refreshIcons(scope = root)
    {
        scope.querySelectorAll("[data-icon]").forEach(node =>
        {
            const svg = createElement(icons[node.dataset.icon]);
            svg.setAttribute("aria-hidden", "true");
            node.replaceChildren(svg);
        });
    }
    refreshIcons();
    const get = id => document.getElementById(id);
    let modalKind;
    function modal(kind, state)
    {
        if (modalKind === kind) return;
        modalKind = kind;
        get("modal").hidden = !kind;
        get("result").hidden = kind !== "won" && kind !== "timeout";
        get("route-nudge").hidden = !!kind;
        get("primary").disabled = false;
        if (!kind)
        {
            get("world").focus({ preventScroll: true });
            return;
        }
        const values = kind === "ready" ? [c.readyEyebrow, c.readyTitle, c.readyCopy, c.start, c.startHint]
            : kind === "paused" ? [c.pausedEyebrow, c.pauseTitle, c.pauseCopy, c.resume, ""]
            : kind === "help" ? [c.keyboard, c.helpTitle, c.helpCopy, c.helpDone, c.touchNote]
            : kind === "won" ? [c.winEyebrow, c.winTitle, c.winCopy, c.restart, c.unsaved]
            : [c.timeoutEyebrow, c.timeoutTitle, c.timeoutCopy(state.delivered), c.restart, c.unsaved];
        ["modal-eyebrow", "modal-title", "modal-copy", "primary", "modal-hint"].forEach((id, index) => get(id).textContent = values[index]);
        get("primary").setAttribute("aria-label", values[3]);
        if (kind === "won" || kind === "timeout")
        {
            get("result-score").textContent = state.score.toLocaleString("en-US");
            get("result-note").textContent = c.bonus(state.bonus);
        }
        queueMicrotask(() => get("primary").focus({ preventScroll: true }));
    }
    let lastMessage;
    function update(missions, van, help)
    {
        const s = missions.state;
        const seconds = Math.ceil(s.remaining);
        get("time").textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
        get("time").parentElement.parentElement.classList.toggle("urgent", seconds < 30);
        get("score").textContent = String(s.score).padStart(3, "0");
        get("cargo").textContent = s.cargo;
        get("best").textContent = s.best ? s.best.toLocaleString("en-US") : "—";
        get("progress-label").textContent = c.progress(s.delivered);
        get("progress-percent").textContent = `${Math.round(s.delivered / jobs.length * 100)}%`;
        get("progress-fill").style.width = `${s.delivered / jobs.length * 100}%`;
        const target = missions.target();
        get("next-stop").textContent = s.phase === "won" ? c.completed : target?.name || c.depot;
        get("next-copy").textContent = s.phase === "won" ? c.roundComplete : s.cargo ? target?.resident || c.completed : c.pickup;
        root.querySelectorAll("[data-job]").forEach((node, index) =>
        {
            node.classList.toggle("delivered", index < s.delivered);
            node.classList.toggle("active", !!s.cargo && index === s.delivered);
            const dot = node.querySelector(".stop-dot");
            dot.textContent = index < s.delivered ? "✓" : "";
            dot.setAttribute("aria-label", index < s.delivered ? c.completed : index === s.delivered && s.cargo ? c.current : c.pending);
        });
        if (lastMessage !== s.message)
        {
            get("status").textContent = s.message;
            lastMessage = s.message;
        }
        const near = target && Math.hypot(van.x - target.x, van.z - target.z) <= 6;
        get("nudge").textContent = s.cargo ? target?.name || c.completed : c.pickup;
        get("action-label").textContent = near ? Math.abs(van.speed) > 5 ? c.slowAction : s.cargo ? c.deliveryAction : c.pickupAction : c.farAction;
        get("interact").disabled = !near || Math.abs(van.speed) > 5;
        get("pause").disabled = !["playing", "paused"].includes(s.phase);
        get("recover").hidden = s.phase !== "playing";
        modal(help ? "help" : s.phase === "playing" ? null : s.phase, s);
    }
    function sound(enabled)
    {
        icons.volume = enabled ? Volume2 : VolumeX;
        get("sound").setAttribute("aria-label", enabled ? c.soundOn : c.soundOff);
        get("sound").title = enabled ? c.soundOn : c.soundOff;
        get("sound").setAttribute("aria-pressed", String(enabled));
        refreshIcons(get("sound"));
    }
    return { get, update, sound, modal, get modalKind() { return modalKind; } };
}
