import { content as c, names } from "./content.js";
import { rules, compact } from "./rules.js";

export class HUD
{
    constructor(game)
    {
        this.game = game;
        this.hintUntil = 0;
        this.root = document.querySelector("#ui");
        document.title = c.title;
        document.querySelector("#yard").setAttribute("aria-label", c.canvas);
        this.root.innerHTML = `
            <div class="vignette"></div>
            <section class="hud" hidden>
                <div class="wave"><span id="wave-label"></span><small>${names.arena}</small></div>
                <div class="dropped"><span class="label">${c.dropped}</span><strong id="dropped">0</strong></div>
                <div class="vitals">
                    <div><div class="vital-label"><span>${c.shield}</span><span id="shield-number">100</span></div><div class="bar" role="meter" aria-label="${c.shield}" aria-valuemin="0" aria-valuemax="100"><i id="shield-bar"></i></div></div>
                    <div><div class="vital-label"><span>${c.health}</span><span id="health-number">100</span></div><div class="bar health" role="meter" aria-label="${c.health}" aria-valuemin="0" aria-valuemax="100"><i id="health-bar"></i></div></div>
                </div>
                <div class="ammo"><span class="label" id="weapon-label">${names.weapon}</span><strong><span id="ammo-number">12</span> / 12</strong><div class="reload-track"><i></i></div></div>
                <div class="crosshair"><i></i><i></i><i></i><i></i></div>
                <button class="pause" id="pause">${c.pause}</button>
            </section>
            <div class="hint" role="status" hidden>${c.lockHint}</div>
            <div class="controls" hidden>
                <div id="move-stick" class="stick left" aria-label="${c.move}"><div class="nub"></div></div>
                <div id="look-stick" class="stick right" aria-label="${c.look}"><div class="nub"></div></div>
                <div class="fire-controls"><button id="fire">${c.fire}</button><button id="reload">${c.reload}</button></div>
            </div>
            <div class="modal"><section class="card" role="dialog" aria-modal="true" aria-labelledby="card-heading"></section></div>`;
        this.elements = {};
        for (const id of ["wave-label", "dropped", "shield-number", "health-number", "shield-bar", "health-bar", "weapon-label", "ammo-number"])
        {
            this.elements[id] = this.root.querySelector(`#${id}`);
        }
        this.root.querySelector("#pause").addEventListener("click", () => game.pause());
        this.root.querySelector(".modal").addEventListener("keydown", (event) =>
        {
            if (event.key !== "Tab") return;
            const focusable = [...this.root.querySelectorAll(".card button:not([hidden]), .card a")];
            const first = focusable[0];
            const last = focusable.at(-1);
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
        this.show("title");
    }

    credit()
    {
        return `<a class="credit" href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${c.credit}</a>`;
    }

    sound()
    {
        return `<button class="sound" aria-pressed="${this.game.audio.enabled}">${this.game.audio.enabled ? c.soundOn : c.soundOff}</button>`;
    }

    show(state, failure = false)
    {
        const modal = this.root.querySelector(".modal");
        const card = modal.querySelector(".card");
        modal.hidden = state === "playing";
        modal.classList.toggle("dim", state === "paused" || state === "gameover");
        card.classList.toggle("compact", state !== "title");
        this.root.querySelector(".hud").hidden = state !== "playing";
        this.root.querySelector(".hint").hidden = true;
        this.controls(this.game.input?.mode || (compact() ? "touch" : "lock"), state === "playing");
        if (state === "title")
        {
            card.innerHTML = `
                <p class="eyebrow">${c.eyebrow}</p>
                <h1 id="card-heading">${names.brand}</h1>
                <p class="arena">${names.arena}</p>
                <p class="premise">${failure ? c.failure : c.premise}</p>
                <button class="primary" id="enter" ${failure ? "hidden" : ""}>${c.enter}</button>
                <p class="legend">${compact() ? c.touchLegend : `${c.desktopLegend}<span>${c.fallbackLegend}</span>`}</p>
                <p class="cells">${c.cells}</p>
                ${this.sound()}
                ${this.credit()}`;
            card.querySelector("#enter").addEventListener("click", () => this.game.start());
        }
        else if (state === "paused")
        {
            card.innerHTML = `
                <h2 id="card-heading">${c.paused}</h2>
                <p class="stats">${c.waveStat} ${this.game.waves.number}</p>
                <p class="stats">${names.arena}</p>
                <p class="stats">${c.droppedStat} ${this.game.drones.dropped}</p>
                <div class="actions"><button id="resume">${c.resume}</button><button class="ghost" id="retry">${c.retry}</button></div>
                ${this.sound()}${this.credit()}`;
            card.querySelector("#resume").addEventListener("click", () => this.game.resume());
            card.querySelector("#retry").addEventListener("click", () => this.game.start());
        }
        else if (state === "gameover")
        {
            card.innerHTML = `
                <h2 id="card-heading">${c.lost}</h2>
                <p class="stats">${c.reached} ${this.game.waves.number}</p>
                <p class="stats">${c.droppedStat} ${this.game.drones.dropped}</p>
                <button class="primary" id="retry">${c.retry}</button><br>
                ${this.credit()}`;
            card.querySelector("#retry").addEventListener("click", () => this.game.start());
        }
        const sound = card.querySelector(".sound");
        sound?.addEventListener("click", () =>
        {
            this.game.audio.toggle();
            sound.textContent = this.game.audio.enabled ? c.soundOn : c.soundOff;
            sound.setAttribute("aria-pressed", String(this.game.audio.enabled));
        });
        if (state === "paused") card.querySelector("#resume").focus();
        else if (state === "gameover") card.querySelector("#retry").focus();
    }

    controls(mode, playing)
    {
        const controls = this.root.querySelector(".controls");
        controls.hidden = !playing || mode === "lock";
        controls.classList.toggle("drag", mode === "drag");
        for (const stick of controls.querySelectorAll(".stick")) stick.hidden = mode !== "touch";
    }

    update()
    {
        const { player, weapon, waves, drones, state } = this.game;
        if (state !== "playing")
        {
            this.root.querySelector(".vignette").style.opacity = "0";
            return;
        }
        this.elements["wave-label"].textContent = waves.clear ? c.clear : `${c.wave} ${waves.number}`;
        this.elements.dropped.textContent = drones.dropped;
        for (const kind of ["shield", "health"])
        {
            this.elements[`${kind}-number`].textContent = player[kind];
            this.elements[`${kind}-bar`].style.width = `${player[kind]}%`;
            this.elements[`${kind}-bar`].parentElement.setAttribute("aria-valuenow", player[kind]);
        }
        this.elements["weapon-label"].textContent = weapon.reloadRemaining > 0 ? c.reloading : names.weapon;
        this.elements["ammo-number"].textContent = weapon.ammo;
        this.elements["ammo-number"].classList.toggle("empty", weapon.ammo === 0);
        const track = this.root.querySelector(".reload-track");
        track.style.opacity = weapon.reloadRemaining > 0 ? "1" : "0";
        track.firstElementChild.style.transform = `scaleX(${1 - weapon.reloadRemaining / rules.reload})`;
        this.root.querySelector(".crosshair").classList.toggle("hit", weapon.hit > 0);
        this.root.querySelector(".vitals").classList.toggle("low", player.health <= 30);
        this.root.querySelector(".vignette").style.opacity = player.hurt > 0 ? "0.32" : (player.health <= 30 ? "0.18" : "0");
        this.root.querySelector(".hint").hidden = performance.now() >= this.hintUntil;
    }
}
