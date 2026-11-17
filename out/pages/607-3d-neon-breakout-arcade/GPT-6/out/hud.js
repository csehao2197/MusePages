import { C } from "./content.js";
const button = (action, text, primary = false) => `<button data-action="${action}" class="${primary ? "primary" : "secondary"}">${text}</button>`;

export class Hud
{
    constructor(sim, audio, action, savedBest)
    {
        this.sim = sim;
        this.audio = audio;
        this.action = action;
        this.best = savedBest;
        this.card = document.querySelector("#card");
        this.hud = document.querySelector("#hud");
        this.toast = document.querySelector("#toast");
        this.powers = document.querySelector("#powers");
        this.live = document.querySelector("#live");
        document.querySelector("#court").setAttribute("aria-label", C.canvas);
        document.querySelector("#court-label").textContent = C.courtMark;
        document.title = `${C.brand} — ${C.venue}`;
        document.querySelector("#ui").addEventListener("click", e =>
        {
            const b = e.target.closest("button[data-action]");
            if (b) this.action(b.dataset.action);
        });
        this.previous = "";
    }

    announce(text) { this.live.textContent = text; }

    showToast(text)
    {
        this.toast.textContent = text;
        this.toastEnd = performance.now() + 1300;
    }

    update()
    {
        const s = this.sim;
        const state = s.state;
        const started = !!s.started;
        this.hud.hidden = !started;
        const sound = this.audio.muted || !this.audio.context ? C.soundOff : C.soundOn;
        const pips = Array.from({ length: 5 }, (_, i) => `<i class="pip ${i < s.sparks ? "filled" : ""}"></i>`).join("");
        const html = `<div class="brand">${C.brand}</div><div class="hud-actions">${button("pause", C.pause)}${button("sound", sound)}</div><div class="stat points"><span>${C.pts}</span><b>${C.format(s.points)}</b></div><div class="stat"><span>${C.rnd}</span><b>${s.round + 1}/5</b></div><div class="stat"><span>${C.blocks}</span><b>${s.remaining}</b></div><div class="stat sparks"><span>${C.sparks}</span><b aria-label="${s.sparks} ${C.sparks}">${pips}</b></div><div class="round-name">${C.rounds[s.round]} <em>${s.balls.some(b => !b.held) ? C.live : C.rest}</em></div>`;
        if (this.hudHtml !== html)
        {
            const active = document.activeElement?.dataset.action;
            this.hud.innerHTML = html;
            this.hudHtml = html;
            if (active && !this.card.contains(document.activeElement)) this.hud.querySelector(`[data-action="${active}"]`)?.focus({ preventScroll: true });
        }
        this.powers.textContent = [s.needle > 0 ? `${C.needleChip} ${s.needle.toFixed(1)}` : "", s.girder > 0 ? `${C.girderChip} ${s.girder.toFixed(1)}` : ""].filter(Boolean).join("   ·   ");
        this.toast.style.opacity = performance.now() < this.toastEnd ? "1" : "0";
        const key = [state, s.round, this.best, this.newBest, this.fallback].join("|");
        if (key === this.previous) return;
        this.previous = key;
        this.card.hidden = ["play", "serve"].includes(state);
        this.card.classList.toggle("start", state === "start");
        document.body.dataset.state = state;
        document.querySelector("#court-label").hidden = started;
        let body = "";
        let title = "";
        if (state === "start")
        {
            title = C.brand;
            body = `<p class="deck">${C.deck}</p><p class="attendant">${C.attendantLine}</p><p class="instructions">${C.body}</p>${this.best ? `<p class="best">${C.best} <b>${C.format(this.best)}</b></p>` : ""}<div class="buttons">${button("start", C.play, true)}${button("controls", C.controls)}</div><div class="card-footer"><p>${C.hours}</p><a href="${C.creditUrl}" target="_blank" rel="noopener">${C.credit}</a></div>`;
        }
        if (state === "controls")
        {
            title = C.controlsHeading;
            body = `<div class="help">${C.controlsLines.map(line => `<p>${line}</p>`).join("")}</div>${button("back", C.back, true)}`;
        }
        if (state === "paused")
        {
            title = C.paused;
            body = `<p class="deck">${C.rounds[s.round]}</p><div class="buttons vertical">${button("resume", C.resume, true)}${button("restart", C.restart)}${button("controls", C.controls)}</div>`;
        }
        if (["clear", "win", "fail"].includes(state))
        {
            title = state === "clear" ? C.clear : state === "win" ? C.final : C.fail;
            const sub = state === "clear" ? C.rounds[s.round] : state === "win" ? C.five : `${C.rnd} ${s.round + 1} · ${C.rounds[s.round]}`;
            body = `<p class="deck">${sub}</p><div class="end-points"><span>${C.pts}</span><b>${C.format(s.points)}</b></div><p class="reward">${state === "clear" ? s.returned ? C.returned : C.full : this.newBest ? C.newBest : `${C.best} ${C.format(this.best)}`}</p>${button(state === "clear" ? "next" : "reset", state === "clear" ? C.next : state === "win" ? C.again : C.retry, true)}`;
        }
        if (this.fallback) body += `<p role="alert">${C.fallback}</p>`;
        this.card.innerHTML = `<p class="eyebrow">${C.venue} · ${C.city}</p><h1 id="heading">${title}</h1>${body}`;
        if (!this.card.hidden) requestAnimationFrame(() => this.card.querySelector("button")?.focus({ preventScroll: true }));
    }
}
