import { C, time, ordinal } from "./content.js";
import { at, samples } from "./track.js";

const button = (action, text, primary = false) => `<button data-action="${action}" class="${primary ? "primary" : ""}">${text}</button>`;
export class HUD
{
    constructor(race, action)
    {
        this.race = race;
        this.action = action;
        this.state = null;
        this.sound = false;
        this.failed = false;
        this.root = document.querySelector("#ui");
        this.root.addEventListener("click", (e) =>
        {
            const target = e.target.closest("[data-action]");
            if (target) this.action(target.dataset.action);
        });
    }
    render()
    {
        const r = this.race;
        this.state = r.state;
        const L = C.labels;
        const best = r.best ? `${L.best} ${time(r.best.time)}` : L.noBest;
        let panel = "";
        let extra = "";
        if (r.state === "start")
        {
            panel = `<div class="eyebrow">${C.place}</div><h1>${C.brand}</h1>
                <p class="subtitle">${C.track} · ${C.car}</p><p class="deck">${C.intro()}</p>
                <div class="best"><span>${best}</span><span>${L.local}</span></div>
                <div class="actions">${button("start", L.start, true)}${button("controls", L.controls)}</div>
                ${r.best ? `<button class="small-button" data-action="clear">${L.clear}</button>` : ""}
                <p class="fine">${C.fine()}</p>
                <a class="credit" href="${C.creditUrl}" target="_blank" rel="noopener">${C.credit}</a>
                ${this.failed ? `<p role="alert">${L.fallback}</p>` : ""}
                ${r.storageFailed ? `<p class="fine">${L.unavailable}</p>` : ""}`;
            extra = `<div class="scene-label"><span>${L.circuit}</span><strong>${C.track}</strong><span>14 / ${C.car}</span></div>
                <div class="bottomline"><span>${L.ready}</span><span>${L.laps} · ${L.standby}</span></div>`;
        }
        else if (r.state === "controls")
        {
            panel = `<div class="eyebrow">${C.brand}</div><h2>${L.controls}</h2><div class="controls-grid">
                ${C.keyboard.map(([key, text]) => `<div class="control-row"><kbd>${key}</kbd><span>${text}</span></div>`).join("")}</div>
                <p class="deck">${C.touchHelp}</p>${button("back", L.back, true)}`;
        }
        else if (r.state === "paused")
        {
            panel = `<div class="eyebrow">${C.track}</div><h2>${L.paused}</h2>
                <div class="best"><span>${L.lapTime}</span><span>${time(r.clock - r.lapStart)}</span></div>
                <div class="actions">${button("resume", L.resume, true)}${button("restart", L.restart)}${button("controls", L.controls)}</div>`;
        }
        else if (r.state === "podium")
        {
            panel = `<div class="eyebrow">${C.track} · ${L.laps}</div><h2>${L.complete}</h2><p>${C.result(r.position())}</p>
                <ol class="results">${r.order().map((car, i) => `<li class="${car.me ? "me" : ""}"><span>${ordinal(i + 1)}</span><span>${car.name}</span><time>${car.finish === null ? `${L.unfinished} · ${car.completed}/3` : time(car.finish)}</time></li>`).join("")}</ol>
                ${r.newBest ? `<p class="micro">${L.newBest} · ${time(r.best.time)}</p>` : ""}
                <div class="actions">${button("restart", L.again, true)}${button("home", L.home)}
                ${r.best ? button("clear", L.clear) : ""}</div>
                ${r.storageFailed ? `<p class="fine">${L.unavailable}</p>` : ""}`;
        }
        const racing = ["racing", "countdown"].includes(r.state);
        this.root.innerHTML = `${!racing ? `<header class="topbar"><div class="wordmark">${C.brand}</div><div class="topright"><small>${L.ready}</small><button class="sound" data-action="sound">${this.sound ? L.soundOn : L.soundOff}</button></div></header>` : ""}
            ${panel ? `<section class="sheet ${r.state === "controls" ? "controls-sheet" : ""}" aria-label="${r.state === "start" ? C.brand : L[r.state] || L.controls}">${panel}</section>` : ""}
            ${extra}
            ${racing ? `<div class="hud">
                <div class="race-top"><div class="stats">
                <div class="stat"><small>${L.position}</small><strong id="position">3rd</strong></div>
                <div class="stat"><small>${L.lap}</small><strong id="lap">1 / 3</strong></div></div>
                <div class="stat timing"><small>${L.lapTime}</small><strong id="lap-time">0:00.00</strong><em id="best-time"></em></div>
                <div class="stat speed"><strong id="speed">0</strong><small>${L.speed}</small></div></div>
                <button id="pause" data-action="pause">${L.pause}</button>
                <button class="sound race-sound" data-action="sound">${this.sound ? L.soundOn : L.soundOff}</button>
                <div id="nearby"></div><div id="banner"></div>
                <canvas id="map" width="336" height="336" aria-hidden="true"></canvas>
                <div class="boost">${L.boost}<div class="boost-track"><div id="boost-fill"></div></div></div>
                </div>
                <div id="count"></div>
                <div class="touch"><button id="steer" aria-label="${C.keyboard[2][1]}">‹ &nbsp; ›<span id="knob"></span></button>
                <div class="pedals"><button id="brake">${L.brake}</button><button id="gas">${L.gas}</button><button id="drift">${L.drift}</button></div></div>` : ""}`;
        this.root.dataset.state = r.state;
        if (panel) this.root.querySelector("button.primary")?.focus({ preventScroll: true });
    }
    update()
    {
        if (this.race.state !== this.state) this.render();
        const r = this.race;
        if (!["racing", "countdown"].includes(r.state)) return;
        const text = (id, value) => document.getElementById(id).textContent = value;
        text("position", ordinal(r.position()));
        text("lap", `${Math.min(3, r.player.completed + 1)} / 3`);
        text("lap-time", time(r.clock - r.lapStart));
        text("best-time", `Best ${r.best ? time(r.best.time) : "—"}`);
        text("speed", `${r.player.speed < 0 ? "R " : ""}${Math.round(Math.abs(r.player.speed) * 3.6)}`);
        text("banner", r.visibleBanner);
        const count = document.getElementById("count");
        const nextCount = r.state === "countdown" ? C.labels.countdown[Math.min(3, Math.floor(r.count / .7))] : "";
        if (count.textContent !== nextCount)
        {
            count.textContent = nextCount;
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
            {
                count.animate([{ transform: "scale(.92)" }, { transform: "scale(1)" }], { duration: 160 });
            }
        }
        document.getElementById("boost-fill").style.transform = `scaleX(${r.player.meter})`;
        document.querySelector(".boost-track").classList.toggle("armed", r.player.meter >= 1);
        const ordered = r.order();
        const position = r.position() - 1;
        const ahead = ordered[position - 1];
        const behind = ordered[position + 1];
        const progress = (c) => c.completed * 1000 + c.s;
        const mine = progress(r.player);
        text("nearby", ahead && progress(ahead) - mine < 30 ? `${C.labels.ahead} ${ahead.name}` :
            behind && mine - progress(behind) < 30 ? `${C.labels.behind} ${behind.name}` : "");
        this.map();
    }
    map()
    {
        const canvas = document.getElementById("map");
        const ctx = canvas.getContext("2d");
        const r = this.race;
        const xs = samples.map((f) => f.p.x);
        const zs = samples.map((f) => f.p.z);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);
        const scale = 235 / Math.max(maxX - minX, maxZ - minZ);
        const point = (p) => [168 + (p.x - (minX + maxX) / 2) * scale, 168 + (p.z - (minZ + maxZ) / 2) * scale];
        ctx.clearRect(0, 0, 336, 336);
        ctx.strokeStyle = "#e7c27a";
        ctx.lineWidth = 6;
        ctx.beginPath();
        samples.forEach((f, i) => ctx[i ? "lineTo" : "moveTo"](...point(f.p)));
        ctx.closePath();
        ctx.stroke();
        for (const s of [0, (r.player.gate + 250) % 1000])
        {
            const f = at(s);
            const [x, y] = point(f.p);
            ctx.strokeStyle = "#f6f1e7";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - f.r.x * 9, y - f.r.z * 9);
            ctx.lineTo(x + f.r.x * 9, y + f.r.z * 9);
            ctx.stroke();
        }
        for (let i = 0; i < r.rivals.length; i++)
        {
            const car = r.rivals[i];
            const [x, y] = point(at(car.s, car.lateral).p);
            ctx.fillStyle = ["#2f6f62", "#d7a441", "#3d4c7a"][i];
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        const ghost = r.ghost();
        if (ghost)
        {
            ctx.strokeStyle = "#e7c27a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(...point(ghost), 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        const [x, y] = point({ x: r.player.x, z: r.player.z });
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r.player.yaw);
        ctx.fillStyle = "#c4512c";
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-8, -7);
        ctx.lineTo(-8, 7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
