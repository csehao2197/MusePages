import { C } from "./content.js";
import { levels } from "./levels.js";

export class Simulation
{
    constructor(event = () => {})
    {
        this.event = event;
        this.round = 0;
        this.points = 0;
        this.sparks = 3;
        this.bar = 0;
        this.lastMove = 1;
        this.rebuild();
        this.state = "start";
    }

    get speed() { return levels[this.round].speed; }
    get halfWidth() { return this.girder > 0 ? 2.08 : 1.28; }
    get remaining() { return this.bricks.filter(b => b.hp > 0).length; }

    rebuild()
    {
        this.bricks = [];
        levels[this.round].rows.forEach((row, r) => [...row].forEach((type, col) =>
        {
            if (type !== "-")
            {
                this.bricks.push({ x: -5.84 + col * 1.46, z: 18.15 - r * .86, row: r, col, type, hp: type === "l" ? 2 : 1, lime: type === "l" });
            }
        }));
        this.bar = 0;
        this.balls = [{ x: 0, z: 1.87, vx: 0, vz: 0, held: true, cooldown: 0, trail: [] }];
        this.pickups = [];
        this.girder = 0;
        this.needle = 0;
        this.shot = .1;
        this.beam = null;
        this.state = "serve";
        this.event("rebuild");
    }

    reset()
    {
        this.round = 0;
        this.points = 0;
        this.sparks = 3;
        this.rebuild();
    }

    move(x)
    {
        const next = Math.max(-7.45 + this.halfWidth, Math.min(7.45 - this.halfWidth, x));
        if (next !== this.bar) this.lastMove = Math.sign(next - this.bar);
        this.bar = next;
        for (const ball of this.balls) if (ball.held) ball.x = next;
    }

    launch()
    {
        if (!["serve", "play"].includes(this.state)) return;
        for (const ball of this.balls.filter(b => b.held))
        {
            ball.held = false;
            ball.vx = this.lastMove * .28 * this.speed;
            ball.vz = Math.sqrt(this.speed ** 2 - ball.vx ** 2);
        }
        this.state = "play";
    }

    normalize(ball)
    {
        const n = Math.hypot(ball.vx, ball.vz);
        ball.vx *= this.speed / n;
        ball.vz *= this.speed / n;
    }

    hit(brick)
    {
        if (brick.hp <= 0 || !["play", "serve"].includes(this.state)) return;
        brick.hp--;
        this.points += brick.hp ? 40 : brick.lime ? 160 : 100;
        this.event(brick.hp ? "chip" : "break", brick);
        if (!brick.hp)
        {
            const drop = levels[this.round].drops.find(d => d[0] === brick.row && d[1] === brick.col);
            if (drop && this.pickups.length < 2) this.pickups.push({ x: brick.x, z: brick.z, type: drop[2] });
        }
        if (!this.remaining)
        {
            this.points += 800;
            this.returned = this.sparks < 5;
            this.sparks = Math.min(5, this.sparks + 1);
            this.state = this.round === 4 ? "win" : "clear";
            this.event(this.state);
        }
    }

    catchPickup(type)
    {
        this.points += 200;
        if (type === "girder") this.girder = 8;
        if (type === "needle")
        {
            this.needle = 6;
            this.shot = .1;
        }
        if (type === "scatter")
        {
            const original = this.balls.find(b => !b.held) || this.balls[0];
            const count = Math.min(2, 5 - this.balls.length);
            if (original)
            {
                const angle = original.held ? Math.atan2(.28, Math.sqrt(1 - .28 ** 2)) : Math.atan2(original.vx, original.vz);
                for (let i = 0; i < count; i++)
                {
                    const a = angle + (i ? -.45 : .45);
                    this.balls.push({ x: original.x, z: original.z, vx: Math.sin(a) * this.speed, vz: Math.cos(a) * this.speed, held: false, cooldown: .08, trail: [] });
                }
                if (count) this.state = "play";
            }
            this.event("toast", C.scatter(count));
        }
        else this.event("toast", C[type]);
        this.event("pickup");
    }

    step(dt)
    {
        if (!["serve", "play"].includes(this.state)) return;
        this.girder = Math.max(0, this.girder - dt);
        this.move(this.bar);
        if (this.beam && (this.beam.life -= dt) <= 0) this.beam = null;
        if (this.needle > 0)
        {
            this.needle = Math.max(0, this.needle - dt);
            this.shot -= dt;
            if (this.shot <= 0)
            {
                this.shot += .45;
                const first = this.bricks.filter(b => b.hp && Math.abs(b.x - this.bar) <= .72).sort((a, b) => a.z - b.z)[0];
                this.beam = { x: this.bar, z: first ? first.z : 19.2, life: .07 };
                if (first) this.hit(first);
                if (!["serve", "play"].includes(this.state)) return;
            }
        }
        for (const p of [...this.pickups])
        {
            p.z -= 3.5 * dt;
            if (p.z >= 1.05 && p.z <= 1.7 && Math.abs(p.x - this.bar) <= this.halfWidth + .28)
            {
                this.pickups.splice(this.pickups.indexOf(p), 1);
                this.catchPickup(p.type);
            }
            else if (p.z < .2) this.pickups.splice(this.pickups.indexOf(p), 1);
        }
        const substeps = Math.ceil(this.speed * dt / .18);
        const h = dt / substeps;
        for (let i = 0; i < substeps; i++)
        {
            for (const ball of [...this.balls])
            {
                if (ball.held) continue;
                const beforeZ = ball.z;
                ball.cooldown = Math.max(0, ball.cooldown - h);
                ball.x += ball.vx * h;
                ball.z += ball.vz * h;
                if (Math.abs(ball.x) > 7.25)
                {
                    ball.x = Math.sign(ball.x) * 7.25;
                    ball.vx = -ball.vx;
                    this.event("wall");
                }
                if (ball.z > 19.15)
                {
                    ball.z = 19.15;
                    ball.vz = -Math.abs(ball.vz);
                    this.event("wall");
                }
                if (ball.vz < 0 && !ball.cooldown && beforeZ >= 1.78 && ball.z <= 1.78 && Math.abs(ball.x - this.bar) <= this.halfWidth + .2)
                {
                    const offset = Math.max(-1, Math.min(1, (ball.x - this.bar) / this.halfWidth));
                    ball.vx = offset * .78 * this.speed;
                    ball.vz = Math.sqrt(this.speed ** 2 - ball.vx ** 2);
                    ball.z = 1.87;
                    ball.cooldown = .08;
                    this.event("bar");
                }
                let collision;
                for (const b of this.bricks)
                {
                    if (!b.hp) continue;
                    const dx = .84 - Math.abs(ball.x - b.x);
                    const dz = .49 - Math.abs(ball.z - b.z);
                    if (dx > 0 && dz > 0 && (!collision || Math.min(dx, dz) < collision.pen)) collision = { b, dx, dz, pen: Math.min(dx, dz) };
                }
                if (collision)
                {
                    const { b, dx, dz } = collision;
                    const both = Math.abs(dx - dz) <= Math.max(dx, dz) * .15;
                    if (dx < dz || both)
                    {
                        const sign = Math.sign(ball.x - b.x) || -Math.sign(ball.vx);
                        ball.x += sign * (dx + .01);
                        ball.vx = sign * Math.abs(ball.vx);
                    }
                    if (dz <= dx || both)
                    {
                        const sign = Math.sign(ball.z - b.z) || -Math.sign(ball.vz);
                        ball.z += sign * (dz + .01);
                        ball.vz = sign * Math.abs(ball.vz);
                    }
                    this.normalize(ball);
                    this.hit(b);
                    if (!["play", "serve"].includes(this.state)) return;
                }
                this.normalize(ball);
                if (!ball.trail.length || Math.hypot(ball.x - ball.trail[0].x, ball.z - ball.trail[0].z) >= .12)
                {
                    ball.trail.unshift({ x: ball.x, z: ball.z });
                    ball.trail.length = Math.min(10, ball.trail.length);
                }
                if (ball.z < .15) this.balls.splice(this.balls.indexOf(ball), 1);
            }
        }
        if (!this.balls.length)
        {
            this.sparks--;
            this.pickups = [];
            this.needle = this.girder = 0;
            if (!this.sparks)
            {
                this.state = "fail";
                this.event("fail");
            }
            else
            {
                this.state = "serve";
                this.balls.push({ x: this.bar, z: 1.87, vx: 0, vz: 0, held: true, cooldown: 0, trail: [] });
                this.event("lost", C.lost(this.sparks));
            }
        }
        else if (this.balls.every(b => b.held)) this.state = "serve";
    }
}
