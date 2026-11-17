import { Yard } from "./scene.js";
import { Player } from "./player.js";
import { Weapon } from "./weapon.js";
import { Drones } from "./drones.js";
import { Pickups } from "./pickups.js";
import { Waves } from "./waves.js";
import { Input } from "./input.js";
import { HUD } from "./hud.js";
import { Audio } from "./audio.js";
import { compact } from "./rules.js";

class Game
{
    constructor()
    {
        this.state = "title";
        this.audio = new Audio();
        this.hud = new HUD(this);
        try
        {
            this.yard = new Yard(document.querySelector("#yard"));
        }
        catch
        {
            this.failed = true;
            this.hud.show("title", true);
            return;
        }
        this.player = new Player(this.yard, this.audio);
        this.weapon = new Weapon(this.yard, this.player, this.audio);
        this.drones = new Drones(this.yard, this.player, this.audio);
        this.pickups = new Pickups(this.yard, this.player, this.audio);
        this.waves = new Waves(this.drones, this.audio);
        this.input = new Input(this.yard.canvas, this);
        this.input.attachControls();
        this.weapon.mesh.visible = false;
        this.last = performance.now();
        requestAnimationFrame((time) => this.frame(time));
    }

    start()
    {
        if (this.failed) return;
        this.audio.start();
        this.input.clear();
        this.yard.clearEffects();
        this.player.reset();
        this.weapon.reset();
        this.drones.reset();
        this.pickups.reset();
        this.waves.start(1);
        this.input.mode = compact() ? "touch" : "lock";
        this.state = "playing";
        this.weapon.mesh.visible = true;
        this.hud.show("playing");
        document.activeElement?.blur();
        this.input.requestLock();
    }

    pause()
    {
        if (this.state !== "playing") return;
        this.state = "paused";
        this.input.release();
        this.audio.silence();
        this.hud.show("paused");
    }

    resume()
    {
        if (this.state !== "paused") return;
        this.audio.start();
        this.state = "playing";
        this.hud.show("playing");
        document.activeElement?.blur();
        this.input.requestLock();
    }

    lose()
    {
        if (this.state !== "playing") return;
        this.state = "gameover";
        this.input.release();
        this.audio.silence();
        this.hud.show("gameover");
    }

    frame(time)
    {
        const delta = Math.min(0.05, Math.max(0, (time - this.last) / 1000));
        this.last = time;
        if (!document.hidden)
        {
            if (this.state === "title")
            {
                this.drones.title(delta);
                this.pickups.update(delta, false);
            }
            else if (this.state === "playing")
            {
                this.input.update();
                this.player.update(delta, this.input);
                this.weapon.update(delta, this.input.firing, this.drones);
                this.drones.update(delta, this.waves.number);
                if (this.player.health === 0) this.lose();
                else
                {
                    this.pickups.update(delta, true);
                    this.waves.update(delta);
                    this.yard.updateEffects(delta);
                }
            }
            this.hud.update();
            this.yard.render();
        }
        requestAnimationFrame((next) => this.frame(next));
    }
}

export const game = new Game();
