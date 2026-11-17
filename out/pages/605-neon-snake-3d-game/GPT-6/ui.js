import { content as c } from "./content.js";
import { icon } from "./icons.js";

const number = (value) => value.toLocaleString("en-US");

export class GameUI
{
    constructor(root, runs, actions)
    {
        this.runs = runs;
        this.actions = actions;
        root.innerHTML = `
            <header class="topbar">
                <div class="brand">
                    <span class="brand-mark" aria-hidden="true"></span>
                    <div class="brand-type"><div class="wordmark">${c.brand}</div><span class="studio-small">${c.studio}</span></div>
                </div>
                <div class="hud" hidden>
                    <div class="chip"><span>${c.score}</span><b id="score">0</b></div>
                    <div class="chip"><span>${c.length}</span><b id="length">4</b></div>
                    <div class="chip"><span>${c.step}</span><b id="step">1</b><div class="pips" aria-hidden="true">${"<i></i>".repeat(5)}</div></div>
                    <div class="chip rule-chip" id="rule-chip">${c.wrap}</div>
                </div>
                <div class="top-actions">
                    <button class="icon-button" id="sound" type="button"></button>
                    <button class="icon-button" id="pause" aria-label="${c.pause}" hidden type="button"></button>
                </div>
            </header>
            <main>
                <section class="card start-card" aria-labelledby="start-heading" hidden>
                    <p class="eyebrow">${c.studio}</p>
                    <h1 id="start-heading">${c.brand}</h1>
                    <p class="deck">${c.tagline}</p>
                    <p class="collect">${c.collect}</p>
                    <p class="rule-line">${c.points}</p>
                    <p id="fallback" class="deck" hidden>${c.fallback}</p>
                    <button class="primary start-button" id="start" type="button">${c.start}<span aria-hidden="true">↗</span></button>
                    <details>
                        <summary>${c.how}</summary>
                        <div class="instructions">${c.instructions.map((line) => `<p>${line}</p>`).join("")}</div>
                    </details>
                    <div id="floor-options">
                        <fieldset>
                            <legend>${c.rules}</legend>
                            <div class="rule-options">
                                ${["wrap", "walls"].map((rule) => `<label class="rule-option"><input type="radio" name="rule" value="${rule}" ${rule === "wrap" ? "checked" : ""}><span>${c[rule]}</span></label>`).join("")}
                            </div>
                        </fieldset>
                        <p class="rule-hint" id="rule-hint">${c.wrapHint}</p>
                        <div class="bests">
                            <div><span>${c.bestWrap}</span><strong id="best-wrap">${c.emptyBest}</strong></div>
                            <div><span>${c.bestWalls}</span><strong id="best-walls">${c.emptyBest}</strong></div>
                        </div>
                        <section aria-label="${c.recent}">
                            <h3 class="section-label">${c.recent}</h3>
                            <div id="recent"></div>
                        </section>
                    </div>
                    <footer>
                        <p class="place">${c.place}</p>
                        <a class="credit" href="${c.creditUrl}" target="_blank" rel="noopener noreferrer">${c.credit}</a>
                    </footer>
                </section>
                <div class="scene-note" aria-hidden="true">
                    <strong>${c.floorSize}</strong><p>${c.floorLabel}</p><small>${c.floorCaption}</small>
                </div>
                <div class="scrim" id="pause-dialog" hidden>
                    <section class="card dialog-card" role="dialog" aria-modal="true" aria-labelledby="pause-heading">
                        <p class="eyebrow">${c.studio}</p>
                        <h2 id="pause-heading">${c.paused}</h2>
                        <p class="deck">${c.holding}</p>
                        <div class="dialog-buttons">
                            <button class="primary" id="resume" type="button">${c.resume}</button>
                            <button id="end" type="button">${c.end}</button>
                        </div>
                    </section>
                </div>
                <div class="scrim" id="over-dialog" hidden>
                    <section class="card dialog-card" role="dialog" aria-modal="true" aria-labelledby="over-heading">
                        <p class="eyebrow">${c.studio}</p>
                        <h2 id="over-heading">${c.over}</h2>
                        <p id="cause"></p>
                        <div class="stats" id="over-stats"></div>
                        <p class="new-best" id="new-best" hidden></p>
                        <label class="save-label" for="initials">${c.initialsLabel}</label>
                        <div class="save-row">
                            <input id="initials" aria-label="${c.initials}" maxlength="3" autocomplete="off" spellcheck="false" placeholder="${c.defaultName}">
                            <button id="save" type="button">${c.save}</button>
                        </div>
                        <h3 class="section-label">${c.recent}</h3>
                        <div id="over-board"></div>
                        <div class="dialog-buttons">
                            <button class="primary" id="again" type="button">${c.again}</button>
                            <button id="change" type="button">${c.change}</button>
                        </div>
                        <p class="privacy">${c.private}</p>
                    </section>
                </div>
                <div class="pad" hidden>
                    ${Object.entries(c.directions).map(([direction, label]) => `<button type="button" data-direction="${direction}" aria-label="${label}"></button>`).join("")}
                </div>
                <div class="play-hints" hidden><span>${c.playHint}</span><span>${c.pauseHint}</span></div>
            </main>
            <div class="sr-only" id="announcements" aria-live="polite" aria-atomic="true"></div>
        `;
        this.root = root;
        this.startCard = root.querySelector(".start-card");
        this.hud = root.querySelector(".hud");
        this.pad = root.querySelector(".pad");
        this.pauseDialog = root.querySelector("#pause-dialog");
        this.overDialog = root.querySelector("#over-dialog");
        this.topbar = root.querySelector(".topbar");
        this.$("pause").append(icon("pause"));
        this.sound();
        for (const [id, action] of Object.entries(actions))
        {
            const element = root.querySelector(`#${id}`);
            if (element) element.addEventListener("click", action);
        }
        root.querySelectorAll('input[name="rule"]').forEach((input) =>
        {
            input.addEventListener("change", () => actions.rule(input.value));
        });
        root.querySelectorAll("[data-direction]").forEach((button) =>
        {
            button.addEventListener("pointerdown", (event) =>
            {
                event.preventDefault();
                actions.turn(button.dataset.direction);
            });
            button.addEventListener("click", (event) =>
            {
                if (event.detail === 0) actions.turn(button.dataset.direction);
            });
        });
        this.$("initials").addEventListener("input", (event) =>
        {
            event.target.value = event.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
        });
        this.trap = (event) =>
        {
            if (event.key !== "Tab") return;
            const dialog = !this.pauseDialog.hidden ? this.pauseDialog : !this.overDialog.hidden ? this.overDialog : null;
            if (!dialog) return;
            const focusables = [...dialog.querySelectorAll("button:not(:disabled), input:not(:disabled)")];
            const first = focusables[0];
            const last = focusables.at(-1);
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
        };
        root.addEventListener("keydown", this.trap);
        this.refreshTitle("wrap");
    }

    $(id)
    {
        return this.root.querySelector(`#${id}`);
    }

    announce(text)
    {
        this.$("announcements").textContent = text;
    }

    sound()
    {
        const element = this.$("sound");
        const label = this.runs.muted ? c.soundOff : c.soundOn;
        element.setAttribute("aria-label", label);
        element.setAttribute("aria-pressed", String(!this.runs.muted));
        element.replaceChildren(icon(this.runs.muted ? "muted" : "volume"));
    }

    board(id, rule, limit)
    {
        const rows = this.runs.data[rule].board.slice(0, limit);
        this.$(id).innerHTML = rows.length ?
            `<ol class="board">${rows.map((run, index) => `<li><div><span class="rank">${String(index + 1).padStart(2, "0")}</span>${run.name}</div><span>${number(run.score)}</span></li>`).join("")}</ol>` :
            `<p class="empty">${c.noRuns}</p>`;
    }

    refreshTitle(rule)
    {
        for (const key of ["wrap", "walls"])
        {
            this.$(`best-${key}`).textContent = this.runs.data[key].best ? number(this.runs.data[key].best) : c.emptyBest;
            this.root.querySelector(`input[value="${key}"]`).checked = key === rule;
        }
        this.$("rule-hint").textContent = c[`${rule}Hint`];
        this.board("recent", rule, 3);
    }

    state(state)
    {
        this.startCard.hidden = state !== "title";
        this.hud.hidden = !["playing", "paused"].includes(state);
        this.pad.hidden = state !== "playing";
        this.$("pause").hidden = state !== "playing";
        this.root.querySelector(".play-hints").hidden = state !== "playing";
        this.root.querySelector(".scene-note").hidden = state !== "title";
        this.pauseDialog.hidden = state !== "paused";
        this.overDialog.hidden = state !== "over";
        this.topbar.inert = ["paused", "over"].includes(state);
    }

    update(game)
    {
        this.$("score").textContent = number(game.score);
        this.$("length").textContent = game.body.length;
        this.$("step").textContent = game.step;
        this.$("rule-chip").textContent = c[game.rule];
        this.$("rule-chip").classList.toggle("walls", game.rule === "walls");
        this.root.querySelectorAll(".pips i").forEach((pip, index) => pip.classList.toggle("filled", index < game.step));
    }

    gameOver(game, best)
    {
        this.state("over");
        this.$("over-heading").textContent = game.reason === "clear" ? c.clear : c.over;
        this.$("cause").textContent = c.reasons[game.reason];
        this.$("over-stats").innerHTML =
            [[c.score, number(game.score)], [c.length, game.body.length], [c.step, game.step], [c.rules, c[game.rule]]]
                .map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("");
        this.$("new-best").hidden = !best;
        this.$("new-best").textContent = c.newBest(c[game.rule]);
        this.$("initials").value = "";
        this.$("initials").disabled = false;
        this.$("save").disabled = false;
        this.$("save").textContent = c.save;
        this.board("over-board", game.rule, 5);
        this.announce(`${c.announcedOver(game.score)} ${best ? c.newBest(c[game.rule]) : ""}`);
        this.$("again").focus();
    }

    fallback()
    {
        this.state("title");
        this.$("fallback").hidden = false;
        this.$("start").hidden = true;
        this.$("floor-options").hidden = true;
        this.root.querySelector(".scene-note").hidden = true;
    }

    dispose()
    {
        this.root.removeEventListener("keydown", this.trap);
        this.root.replaceChildren();
    }
}
