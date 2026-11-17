import { content as c } from "./content.js";
import { SnakeGame } from "./game.js";
import { LocalRuns } from "./storage.js";
import { BeatAudio } from "./audio.js";
import { FloorScene } from "./scene.js";
import { GameUI } from "./ui.js";

const KEYS =
{
    ArrowUp: "north", w: "north", W: "north",
    ArrowLeft: "west", a: "west", A: "west",
    ArrowDown: "south", s: "south", S: "south",
    ArrowRight: "east", d: "east", D: "east"
};

class Application
{
    constructor()
    {
        document.title = c.title;
        this.canvas = document.querySelector("#floor");
        this.canvas.setAttribute("aria-label", c.canvasLabel);
        this.motion = matchMedia("(prefers-reduced-motion: reduce)");
        this.reduced = this.motion.matches;
        this.game = new SnakeGame();
        let storage;
        try { storage = localStorage; } catch { storage = null; }
        this.runs = new LocalRuns(storage);
        this.audio = new BeatAudio(this.runs.muted);
        this.ui = new GameUI(document.querySelector("#app"), this.runs,
        {
            start: () => this.start(),
            again: () => this.start(),
            resume: () => this.resume(),
            pause: () => this.pause(),
            end: () =>
            {
                this.audio.resume();
                this.game.finish("ended");
                this.events();
            },
            change: () => this.title(),
            sound: () =>
            {
                this.runs.mute(!this.runs.muted);
                this.audio.mute(this.runs.muted);
                this.ui.sound();
            },
            rule: (rule) =>
            {
                this.game.reset(rule);
                this.ui.refreshTitle(rule);
            },
            turn: (direction) => this.game.queue(direction),
            save: () => this.save()
        });
        this.controller = new AbortController();
        const on = (target, type, listener) => target.addEventListener(type, listener, { signal: this.controller.signal });
        on(window, "keydown", (event) => this.key(event));
        on(window, "resize", () => this.scene?.resize());
        on(window, "blur", () => this.pause());
        on(document, "visibilitychange", () =>
        {
            if (document.hidden) this.pause();
        });
        on(this.motion, "change", (event) =>
        {
            this.reduced = event.matches;
            if (this.scene) this.scene.reduced = this.reduced;
        });
        on(this.canvas, "pointerdown", (event) =>
        {
            if (this.game.state !== "playing") return;
            this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
            this.canvas.setPointerCapture(event.pointerId);
        });
        on(this.canvas, "pointerup", (event) =>
        {
            if (!this.pointer || this.pointer.id !== event.pointerId) return;
            const dx = event.clientX - this.pointer.x;
            const dy = event.clientY - this.pointer.y;
            this.clearPointer();
            if (this.game.state !== "playing") return;
            const x = Math.abs(dx);
            const y = Math.abs(dy);
            if (Math.max(x, y) <= 28 || Math.max(x, y) < Math.min(x, y) * 1.15) return;
            this.game.queue(x > y ? dx > 0 ? "east" : "west" : dy > 0 ? "south" : "north");
        });
        on(this.canvas, "pointercancel", () => this.clearPointer());
        on(this.canvas, "webglcontextlost", (event) =>
        {
            event.preventDefault();
            this.fail();
        });
        on(window, "pagehide", () => this.dispose());
        this.time = 0;
        this.lastFrame = performance.now();
        this.frozenPhase = 0;
        this.failed = false;
        try
        {
            this.scene = new FloorScene(this.canvas, this.reduced);
            this.scene.draw(this.game, 0, 0, 0, 0);
            this.frame = requestAnimationFrame((time) => this.tick(time));
        }
        catch (error)
        {
            this.fail(error);
        }
        Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 800))]).then(() =>
        {
            if (this.disposed) return;
            this.ui.startCard.hidden = false;
            if (this.failed) this.ui.root.querySelector("summary").focus();
            else this.ui.$("start").focus({ preventScroll: true });
        });
    }

    clearPointer()
    {
        if (this.pointer && this.canvas.hasPointerCapture(this.pointer.id))
        {
            this.canvas.releasePointerCapture(this.pointer.id);
        }
        this.pointer = null;
    }

    start()
    {
        if (this.failed || this.game.state === "playing") return;
        this.game.reset(this.game.rule);
        this.game.start();
        this.phaseStart = this.time;
        this.audio.start();
        this.ui.state("playing");
        this.ui.update(this.game);
        this.ui.announce(c.started);
        this.ui.$("pause").focus({ preventScroll: true });
    }

    pause()
    {
        this.clearPointer();
        if (this.game.state !== "playing") return;
        this.frozenPhase = this.audio.context ? this.audio.phase : (this.time - this.phaseStart) % 0.625;
        this.game.pause();
        this.audio.pause();
        this.ui.state("paused");
        this.ui.announce(c.paused);
        this.ui.$("resume").focus();
    }

    resume()
    {
        if (this.game.state !== "paused" || document.hidden) return;
        this.game.resume();
        this.audio.resume();
        this.ui.state("playing");
        this.ui.$("pause").focus({ preventScroll: true });
    }

    title()
    {
        this.audio.running = false;
        this.audio.stopNotes();
        this.audio.pause();
        this.game.reset(this.game.rule);
        this.ui.refreshTitle(this.game.rule);
        this.ui.state("title");
        this.ui.startCard.scrollTop = 0;
        this.ui.$("start").focus({ preventScroll: true });
    }

    save()
    {
        if (this.game.state !== "over" || this.ui.$("save").disabled) return;
        const name = this.ui.$("initials").value.replace(/[^A-Z]/g, "").slice(0, 3) || c.defaultName;
        this.runs.save(this.game.rule, name, this.game.score, this.game.body.length);
        this.ui.board("over-board", this.game.rule, 5);
        this.ui.$("save").textContent = c.saved;
        this.ui.$("save").disabled = true;
        this.ui.$("initials").disabled = true;
        this.ui.$("again").focus();
    }

    key(event)
    {
        if (event.target instanceof HTMLInputElement && event.target.id === "initials") return;
        if (event.repeat || !["playing", "paused"].includes(this.game.state)) return;
        if (KEYS[event.key])
        {
            event.preventDefault();
            if (this.game.state === "playing") this.game.queue(KEYS[event.key]);
        }
        else if (["p", "P", "Escape"].includes(event.key))
        {
            event.preventDefault();
            if (this.game.state === "playing") this.pause();
            else this.resume();
        }
    }

    events()
    {
        for (const event of this.game.events.splice(0))
        {
            if (event.type === "eat")
            {
                this.audio.eat();
                if (!this.reduced)
                {
                    this.ui.$("score").classList.remove("score-pop");
                    void this.ui.$("score").offsetWidth;
                    this.ui.$("score").classList.add("score-pop");
                }
            }
            else if (event.type === "over")
            {
                this.clearPointer();
                this.frozenPhase = this.audio.context ? this.audio.phase : (this.time - this.phaseStart) % 0.625;
                if (this.scene && ["rail", "cross"].includes(event.reason)) this.scene.deathAt = this.time;
                this.audio.end(event.reason);
                const best = this.runs.best(this.game.rule, this.game.score);
                this.ui.gameOver(this.game, best);
            }
        }
    }

    tick(now)
    {
        if (this.failed || this.disposed) return;
        const rawDelta = Math.max(0, (now - this.lastFrame) / 1000);
        const delta = Math.min(rawDelta, 0.05);
        this.lastFrame = now;
        if (this.game.state !== "paused" && this.game.state !== "over") this.time += delta;
        // Death tint and the gentle final camera rise can settle after simulation stops.
        if (this.game.state === "over") this.time += delta;
        this.game.update(delta);
        this.events();
        this.audio.schedule();
        this.ui.update(this.game);
        const phase = this.game.state === "title" ? this.time % 0.625 :
            this.game.state === "paused" ? this.frozenPhase :
            this.game.state === "over" ? this.frozenPhase :
            this.audio.context ? this.audio.phase : (this.time - this.phaseStart) % 0.625;
        try
        {
            this.scene.draw(this.game, delta, this.time, phase, rawDelta);
        }
        catch (error)
        {
            this.fail(error);
            return;
        }
        this.frame = requestAnimationFrame((time) => this.tick(time));
    }

    fail(error)
    {
        this.failureReason = error?.message || "WebGL context lost";
        this.failed = true;
        cancelAnimationFrame(this.frame);
        this.audio.running = false;
        this.audio.pause();
        this.canvas.hidden = true;
        this.ui.fallback();
    }

    async dispose()
    {
        if (this.disposed) return;
        this.disposed = true;
        cancelAnimationFrame(this.frame);
        this.controller.abort();
        this.clearPointer();
        this.scene?.dispose();
        await this.audio.dispose();
        this.ui.dispose();
    }
}

export const app = new Application();
