import { content as c } from "./content.js";
import { icon } from "./icons.js";
import { track } from "./track.js";
import { drawMap } from "./minimap.js";
export function createHud()
{
    const app = document.querySelector("#app");
    app.innerHTML = `
        <header class="masthead">
            <a class="wordmark" href="./index.html" aria-label="${c.brand}"><span class="mark">L<span>/</span>L</span><span>${c.brand}<small>${c.edition}</small></span></a>
            <div class="city"><span class="status-dot"></span>${c.eyebrow}</div>
            <nav aria-label="${c.help}">
                <button class="icon-button" id="sound" aria-label="${c.soundOn}" title="${c.soundOn}">${icon("volume-x")}</button>
                <button class="icon-button" id="help" aria-label="${c.help}" title="${c.help}">${icon("circle-help")}</button>
                <button class="icon-button" id="pause" aria-label="${c.pause}" title="${c.pause}" disabled>${icon("pause")}</button>
            </nav>
        </header>
        <main>
            <section class="hud" aria-label="${c.online}">
                <div class="frame"><div class="label">${c.frame}<strong id="frame-value">100<span>%</span></strong></div><div class="meter"><i id="frame-bar"></i></div></div>
                <div class="surge"><div class="label">${c.surge}<span id="surge-value">100%</span></div><div class="meter"><i id="surge-bar"></i></div></div>
                <div class="haul"><span class="label">${c.haul}</span><strong id="haul-value">0000</strong><small>${c.crystalsUnit}</small></div>
                <div class="distance"><span class="label">${c.berth}</span><strong id="distance-value">4,200</strong><small>${c.distanceUnit}</small></div>
            </section>
            <section id="card" class="card" aria-labelledby="card-title"></section>
            <aside class="route"><span class="label">${c.route}</span><div class="route-end">${c.routeEnd}<b>◇</b></div><canvas id="map" width="120" height="146" aria-label="${c.mapLabel}"></canvas><span class="route-start">${c.routeStart}</span></aside>
            <div id="notification" class="notification" role="status"></div>
            <div class="pace"><span class="label">${c.speed}</span><div><strong id="speed-value">000</strong><span>${c.unit}</span></div><span class="pace-ticks">Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ Ⅰ</span></div>
            <div class="sector"><span class="label">${c.sector}</span><strong id="sector-value">${c.sectorNames[0]}</strong><span id="run-status">${c.ready}</span></div>
            <div class="touch-controls" aria-label="${c.steer}">
                <button data-control="left" aria-label="${c.left}">${icon("chevron-left")}</button><button data-control="right" aria-label="${c.right}">${icon("chevron-right")}</button>
                <button data-control="pace">${c.push}</button><button data-control="boost">${c.boost}</button>
            </div>
        </main>
        <footer><span>${c.footer}</span><div class="keyboard-hints"><span><kbd>${c.keys}</kbd>${c.steer}</span><span><kbd>${c.paceKey}</kbd>${c.push}</span><span><kbd>${c.surgeKey}</kbd>${c.boost}</span><span><kbd>${c.pauseKey}</kbd>${c.pause}</span></div><a href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${c.credit} ↗</a></footer>`;
    const card = document.querySelector("#card");
    let cardMode = "";
    let actionHandler;
    let closeHelp;
    let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function renderCard(run, best, help = false)
    {
        const mode = help ? "help" : run.phase;
        if (mode === cardMode) return;
        cardMode = mode;
        card.hidden = mode === "running";
        document.body.dataset.phase = run.phase;
        document.querySelector("#pause").disabled = ["ready", "reached", "failed"].includes(run.phase);
        if (card.hidden) return;
        if (help)
        {
            card.innerHTML = `<span class="eyebrow">${c.help}</span><h1 id="card-title">${c.helpTitle}</h1><p>${c.helpBody}</p><p>${c.rules}</p><label class="motion"><input id="motion" type="checkbox" ${reduced ? "checked" : ""}>${c.motion}</label><button class="primary" id="close-help">${c.close}${icon("x")}</button>`;
            document.querySelector("#motion").onchange = (event) => { reduced = event.target.checked; };
            document.querySelector("#close-help").onclick = () => closeHelp();
            return;
        }
        const ready = mode === "ready";
        const paused = mode === "paused";
        const reached = mode === "reached";
        const eyebrow = ready ? c.online : paused ? c.paused : reached ? c.reached : c.failed;
        const title = ready ? c.title : paused ? c.pausedTitle : reached ? c.reachedTitle : c.failedTitle;
        const body = ready ? c.intro : paused ? c.pausedBody : reached ? c.reachedBody : c.failedBody;
        card.innerHTML = `
            <div class="eyebrow"><span class="status-dot"></span>${eyebrow}</div>
            <h1 id="card-title" class="${ready ? "brand-title" : ""}">${title}${ready ? '<span class="title-period">.</span>' : ""}</h1>
            ${ready ? `<h2>${c.subtitle}</h2>` : ""}
            <p>${body}</p>
            ${ready ? `<div class="dispatch"><span>${c.dispatch}</span><blockquote>${c.quote}</blockquote></div>` : !paused ? `<div class="result-stats"><div><span class="label">${c.resultHaul}</span><strong>${run.haul}</strong></div><div><span class="label">${c.elapsed}</span><strong>${run.elapsed.toFixed(1)}<small>s</small></strong></div></div>` : ""}
            <button id="action" class="primary">${ready ? c.launch : paused ? c.resume : c.again}${icon(ready || paused ? "play" : "rotate-ccw")}</button>
            <div class="card-bottom"><span>${ready ? c.panelMeta : c.limit}</span><span>${c.best} <b>${best}</b></span></div>`;
        document.querySelector("#action").onclick = () => actionHandler();
    }
    const get = (id) => document.querySelector(id);
    return {
        renderCard,
        onAction(fn) { actionHandler = fn; },
        onCloseHelp(fn) { closeHelp = fn; },
        get reduced() { return reduced; },
        update(run, best, help)
        {
            renderCard(run, best, help);
            get("#frame-value").innerHTML = `${Math.ceil(run.frame)}<span>%</span>`;
            get("#frame-bar").style.width = `${run.frame}%`;
            get("#surge-bar").style.width = `${run.surge}%`;
            get("#surge-value").textContent = `${Math.round(run.surge)}%`;
            get("#haul-value").textContent = String(run.haul).padStart(4, "0");
            get("#distance-value").textContent = Math.ceil(track.length - run.distance).toLocaleString("en-US");
            get("#speed-value").textContent = String(Math.round(run.speed * 2.2)).padStart(3, "0");
            get("#sector-value").textContent = c.sectorNames[Math.min(2, Math.floor(run.distance / track.length * 3))];
            get("#run-status").textContent = run.phase === "ready" ? c.ready : run.phase === "paused" ? c.paused : run.phase === "running" ? c.running : run.phase === "reached" ? c.reached : c.failed;
            const events = { pickup: c.noticePickup, arch: c.noticeArch, hit: c.noticeHit, wall: c.noticeWall };
            get("#notification").textContent = run.phase === "running" && run.elapsed - run.eventTime < 2 ? events[run.event] || c.noticeReady : "";
            drawMap(get("#map"), run);
        }
    };
}
