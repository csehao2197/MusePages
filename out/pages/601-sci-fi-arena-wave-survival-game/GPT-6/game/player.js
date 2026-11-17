import { T } from "./scene.js";
import { rules, reduced } from "./rules.js";

export class Player
{
    constructor(yard, audio)
    {
        this.yard = yard;
        this.audio = audio;
        this.position = new T.Vector3();
        this.reset();
    }

    reset()
    {
        this.position.set(0, rules.eye, 7.4);
        this.yaw = 0;
        this.pitch = 0;
        this.health = rules.health;
        this.shield = rules.shield;
        this.invulnerable = 0;
        this.hurt = 0;
        this.kick = 0;
        this.bob = 0;
        this.time = 0;
        this.camera();
    }

    damage()
    {
        if (this.invulnerable > 0 || this.health <= 0) return false;
        const absorbed = Math.min(this.shield, rules.boltDamage);
        this.shield -= absorbed;
        this.health = Math.max(0, this.health - (rules.boltDamage - absorbed));
        this.invulnerable = rules.invulnerability;
        this.hurt = 0.14;
        this.audio.cue("hurt");
        return true;
    }

    look(x, y)
    {
        this.yaw -= x;
        this.pitch = T.MathUtils.clamp(this.pitch - y, -1.05, 1.05);
    }

    update(delta, input)
    {
        this.time += delta;
        this.invulnerable = Math.max(0, this.invulnerable - delta);
        this.hurt = Math.max(0, this.hurt - delta);
        this.kick = Math.max(0, this.kick - delta);
        this.look(input.look.x * delta, input.look.y * delta);
        const move = new T.Vector2(input.move.x, input.move.y);
        if (move.length() > 1) move.normalize();
        const x = (move.x * Math.cos(this.yaw) + move.y * Math.sin(this.yaw)) * rules.moveSpeed * delta;
        const z = (-move.x * Math.sin(this.yaw) + move.y * Math.cos(this.yaw)) * rules.moveSpeed * delta;
        if (!this.yard.blocked(this.position.x + x, this.position.z)) this.position.x += x;
        if (!this.yard.blocked(this.position.x, this.position.z + z)) this.position.z += z;
        const moving = Math.hypot(x, z) / Math.max(delta, 0.001) > 0.4;
        const desired = moving && !reduced() ? 1 : 0;
        this.bob = T.MathUtils.damp(this.bob, desired, 24, delta);
        this.camera();
    }

    camera()
    {
        const camera = this.yard.camera;
        const calm = reduced();
        camera.position.copy(this.position);
        if (!calm)
        {
            camera.position.y += Math.sin(this.time * 10.5) * 0.016 * this.bob;
            camera.position.x += Math.sin(this.time * 5.25) * 0.008 * this.bob;
            if (this.hurt > 0.04) camera.position.x += 0.012;
        }
        camera.rotation.set(this.pitch + (!calm && this.kick > 0 ? 0.008 : 0), this.yaw, calm ? 0 : Math.sin(this.time * 5.25) * 0.004 * this.bob);
        camera.updateMatrixWorld(true);
    }
}
