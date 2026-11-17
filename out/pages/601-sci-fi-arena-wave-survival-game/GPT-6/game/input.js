import { compact } from "./rules.js";

export class Input
{
    constructor(canvas, game)
    {
        this.canvas = canvas;
        this.game = game;
        this.mode = compact() ? "touch" : "lock";
        this.keys = new Set();
        this.moveStick = { x: 0, y: 0 };
        this.lookStick = { x: 0, y: 0 };
        this.move = { x: 0, y: 0 };
        this.look = { x: 0, y: 0 };
        this.fireButton = false;
        this.mouseFire = false;
        this.dragging = false;
        this.intentional = false;
        this.lockAttempt = 0;
        this.bind();
    }

    get playing()
    {
        return this.game.state === "playing";
    }

    clear()
    {
        this.keys.clear();
        this.fireButton = false;
        this.mouseFire = false;
        this.dragging = false;
        this.moveStick.x = this.moveStick.y = 0;
        this.lookStick.x = this.lookStick.y = 0;
        document.querySelectorAll(".nub").forEach((nub) => nub.style.transform = "");
    }

    fallback()
    {
        if (!this.playing || this.mode === "touch") return;
        this.mode = "drag";
        this.game.hud.hintUntil = performance.now() + 4000;
        this.game.hud.controls(this.mode, true);
    }

    requestLock()
    {
        if (this.mode !== "lock") return;
        const attempt = ++this.lockAttempt;
        if (window.top !== window.self || !this.canvas.requestPointerLock)
        {
            this.fallback();
            return;
        }
        try
        {
            const result = this.canvas.requestPointerLock();
            if (result?.catch) result.catch(() => this.fallback());
        }
        catch
        {
            this.fallback();
        }
        setTimeout(() =>
        {
            if (attempt === this.lockAttempt && document.pointerLockElement !== this.canvas) this.fallback();
        }, 400);
    }

    release()
    {
        this.lockAttempt++;
        if (document.pointerLockElement === this.canvas)
        {
            this.intentional = true;
            try { document.exitPointerLock(); } catch { this.intentional = false; }
        }
        this.clear();
    }

    bind()
    {
        const handled = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyR", "KeyF", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"]);
        window.addEventListener("keydown", (event) =>
        {
            if (handled.has(event.code)) event.preventDefault();
            if (event.code === "Escape" && !event.repeat)
            {
                if (this.playing) this.game.pause();
                else if (this.game.state === "paused") this.game.resume();
                return;
            }
            if (!this.playing) return;
            this.keys.add(event.code);
            if (event.code === "KeyR" && !event.repeat) this.game.weapon.reload();
        });
        window.addEventListener("keyup", (event) => this.keys.delete(event.code));
        window.addEventListener("blur", () =>
        {
            this.clear();
            if (this.playing) this.game.pause();
        });
        document.addEventListener("visibilitychange", () =>
        {
            this.clear();
            if (!document.hidden && this.playing && this.mode === "lock" && document.pointerLockElement !== this.canvas) this.game.pause();
        });
        document.addEventListener("pointerlockerror", () => this.fallback());
        document.addEventListener("pointerlockchange", () =>
        {
            if (document.pointerLockElement === this.canvas)
            {
                if (!this.playing)
                {
                    this.release();
                    return;
                }
                this.mode = "lock";
                this.game.hud.controls(this.mode, true);
            }
            else if (this.intentional) this.intentional = false;
            else if (this.playing && this.mode === "lock") this.game.pause();
        });
        document.addEventListener("mousemove", (event) =>
        {
            if (this.playing && this.mode === "lock" && document.pointerLockElement === this.canvas)
            {
                this.game.player.look(event.movementX * 0.0022, event.movementY * 0.0022);
            }
        });
        this.canvas.addEventListener("pointerdown", (event) =>
        {
            if (!this.playing || event.button !== 0) return;
            if (this.mode === "drag")
            {
                this.dragging = true;
                this.previous = { x: event.clientX, y: event.clientY };
                this.canvas.setPointerCapture(event.pointerId);
            }
            else if (this.mode === "lock") this.mouseFire = true;
        });
        this.canvas.addEventListener("pointermove", (event) =>
        {
            if (!this.playing || this.mode !== "drag" || !this.dragging) return;
            this.game.player.look((event.clientX - this.previous.x) * 0.0022, (event.clientY - this.previous.y) * 0.0022);
            this.previous = { x: event.clientX, y: event.clientY };
        });
        window.addEventListener("pointerup", () =>
        {
            this.dragging = false;
            this.mouseFire = false;
        });
        this.canvas.addEventListener("pointercancel", () => this.clear());
        this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
        window.addEventListener("resize", () =>
        {
            if (compact() && this.mode !== "touch")
            {
                this.release();
                this.mode = "touch";
            }
            else if (!compact() && this.mode === "touch") this.mode = "drag";
            this.game.hud.controls(this.mode, this.playing);
        });
    }

    attachControls()
    {
        this.stick(document.querySelector("#move-stick"), this.moveStick);
        this.stick(document.querySelector("#look-stick"), this.lookStick);
        const fire = document.querySelector("#fire");
        fire.addEventListener("pointerdown", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            if (!this.playing) return;
            this.fireButton = true;
            fire.setPointerCapture(event.pointerId);
        });
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
        {
            fire.addEventListener(type, (event) =>
            {
                event.stopPropagation();
                this.fireButton = false;
            });
        }
        document.querySelector("#reload").addEventListener("click", (event) =>
        {
            event.stopPropagation();
            if (this.playing) this.game.weapon.reload();
        });
        fire.addEventListener("keydown", (event) =>
        {
            if (this.playing && ["Space", "Enter"].includes(event.code))
            {
                event.preventDefault();
                this.fireButton = true;
            }
        });
        fire.addEventListener("keyup", () => this.fireButton = false);
        fire.addEventListener("blur", () => this.fireButton = false);
    }

    stick(element, value)
    {
        let pointer = null;
        const nub = element.querySelector(".nub");
        const change = (event) =>
        {
            const rect = element.getBoundingClientRect();
            let x = (event.clientX - rect.left - 56) / 34;
            let y = (event.clientY - rect.top - 56) / 34;
            const length = Math.hypot(x, y);
            if (length > 1)
            {
                x /= length;
                y /= length;
            }
            nub.style.transform = `translate(${x * 34}px, ${y * 34}px)`;
            const strength = Math.min(1, Math.max(0, (length - 0.15) / 0.85));
            const norm = Math.hypot(x, y);
            value.x = norm ? x / norm * strength : 0;
            value.y = norm ? y / norm * strength : 0;
        };
        element.addEventListener("pointerdown", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            if (!this.playing || pointer !== null) return;
            pointer = event.pointerId;
            element.setPointerCapture(pointer);
            change(event);
        });
        element.addEventListener("pointermove", (event) =>
        {
            event.preventDefault();
            if (event.pointerId === pointer) change(event);
        });
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
        {
            element.addEventListener(type, (event) =>
            {
                if (event.pointerId !== pointer) return;
                event.stopPropagation();
                pointer = null;
                value.x = value.y = 0;
                nub.style.transform = "";
            });
        }
    }

    update()
    {
        const key = (name) => this.keys.has(name) ? 1 : 0;
        const stickActive = Math.hypot(this.moveStick.x, this.moveStick.y) > 0;
        this.move.x = stickActive ? this.moveStick.x : key("KeyD") - key("KeyA");
        this.move.y = stickActive ? this.moveStick.y : key("KeyS") - key("KeyW");
        this.look.x = (key("ArrowRight") - key("ArrowLeft")) * 1.35 + this.lookStick.x * 1.55;
        this.look.y = (key("ArrowDown") - key("ArrowUp")) * 1.35 + this.lookStick.y * 1.55;
        this.firing = this.keys.has("KeyF") || this.fireButton || this.mouseFire;
    }
}
