import { C, ordinal } from "./content.js";
import { at } from "./track.js";
import { drive, newPlayer } from "./drive.js";

export function loadBest(storage)
{
    try
    {
        const best = JSON.parse(storage?.getItem(C.key) || "null");
        if (!best || !Number.isFinite(best.time) || best.time <= 0 ||
            !Array.isArray(best.samples) || best.samples.length < 2 || best.samples.length > 800) return null;
        if (best.samples.some((s, i) => !Array.isArray(s) || s.length !== 5 ||
            s.some((n) => !Number.isFinite(n)) || s[0] < 0 || s[0] > best.time + .2 ||
            (i > 0 && s[0] <= best.samples[i - 1][0]) || Math.abs(s[1]) > 2000 || Math.abs(s[2]) > 2000)) return null;
        return best;
    }
    catch
    {
        return null;
    }
}
export class Race
{
    constructor(storage = null, announce = () => {})
    {
        this.storage = storage;
        this.announce = announce;
        this.best = loadBest(storage);
        this.storageFailed = false;
        this.state = "start";
        this.reset();
    }
    reset()
    {
        this.player = newPlayer();
        this.rivals = C.names.map((name, i) => ({
            name, number: [7, 22, 3][i], s: [52, 36, 8][i], lateral: [-2.4, 2.6, .4][i],
            lane: [-2.4, 2.6, .4][i], speed: 0, completed: 0, finish: null, travel: 0
        }));
        this.clock = 0;
        this.lapStart = 0;
        this.lapTimes = [];
        this.record = [];
        this.nextSample = 0;
        this.newBest = false;
        this.banner = "";
        this.bannerUntil = 0;
        this.count = 0;
        this.previousCount = -1;
    }
    start()
    {
        this.reset();
        this.state = "countdown";
    }
    pause()
    {
        if (this.state === "racing" || this.state === "countdown")
        {
            this.returnState = this.state;
            this.state = "paused";
        }
    }
    resume()
    {
        this.state = this.returnState || "racing";
    }
    callout(text, duration = .7)
    {
        this.banner = text;
        this.bannerUntil = this.clock + duration;
        this.announce(text);
    }
    clearBest()
    {
        this.best = null;
        this.newBest = false;
        try { this.storage?.removeItem(C.key); }
        catch { this.storageFailed = true; }
    }
    order()
    {
        return [{ ...this.player, name: C.driver, me: true }, ...this.rivals].sort((a, b) =>
        {
            if (a.finish !== null && b.finish !== null) return a.finish - b.finish;
            if (a.finish !== null) return -1;
            if (b.finish !== null) return 1;
            return (b.completed * 1000 + b.s) - (a.completed * 1000 + a.s);
        });
    }
    position()
    {
        return this.order().findIndex((c) => c.me) + 1;
    }
    finishLap()
    {
        const p = this.player;
        const elapsed = this.clock - this.lapStart;
        this.lapTimes.push(elapsed);
        if (!this.best || elapsed < this.best.time)
        {
            this.best = { time: elapsed, samples: this.record.map((s) => [...s]) };
            this.newBest = true;
            try { this.storage?.setItem(C.key, JSON.stringify(this.best)); }
            catch { this.storageFailed = true; }
        }
        p.completed++;
        p.gate = 0;
        this.lapStart = this.clock;
        this.record = [];
        this.nextSample = 0;
        this.announce(`${C.labels.lap} ${Math.min(3, p.completed + 1)} / 3`);
        if (p.completed === 3)
        {
            p.finish = this.clock;
            this.state = "podium";
            this.announce(C.result(this.position()));
        }
    }
    step(dt, input)
    {
        if (this.state === "countdown")
        {
            this.count += dt;
            const n = Math.min(3, Math.floor(this.count / .7));
            if (n !== this.previousCount)
            {
                this.previousCount = n;
                input.onCount?.(n);
            }
            if (this.count >= 2.5) this.state = "racing";
            return;
        }
        if (this.state !== "racing") return;
        this.clock += dt;
        const p = this.player;
        const lapClock = this.clock - this.lapStart;
        if (lapClock >= this.nextSample && this.record.length < 800)
        {
            this.record.push([lapClock, p.x, p.z, p.yaw, p.s]);
            this.nextSample += .1;
        }
        const movement = drive(p, input, dt);
        if (movement.reset) this.callout(C.labels.reset, .8);
        if (p.s >= 40 && p.s < 800) p.reached40 = true;
        if (movement.delta > 0 && movement.delta < 10)
        {
            const target = p.gate + 250;
            const crossed = target === 1000 ?
                movement.previousS > 900 && p.s < 100 :
                movement.previousS < target && p.s >= target;
            if (crossed && (target !== 1000 || p.reached40))
            {
                if (target === 1000)
                {
                    this.callout(C.line);
                    this.finishLap();
                }
                else
                {
                    p.gate = target;
                    this.callout(C.gates[target / 250 - 1]);
                }
            }
        }
        for (const rival of this.rivals)
        {
            if (rival.finish !== null) continue;
            const target = rival.s < 180 ? 34 : rival.s < 460 ? 27 : rival.s < 700 ? 32 : rival.s < 860 ? 18 : 34;
            rival.speed += Math.max(-10 * dt, Math.min(10 * dt, target - rival.speed));
            rival.travel += rival.speed * dt;
            rival.s += rival.speed * dt;
            if (rival.s >= 1000)
            {
                rival.s -= 1000;
                rival.completed++;
                if (rival.completed >= 3)
                {
                    rival.finish = this.clock;
                    rival.speed = 0;
                }
            }
            rival.lateral += Math.max(-4 * dt, Math.min(4 * dt, rival.lane - rival.lateral));
            const f = at(rival.s, rival.lateral);
            if (Math.hypot(p.x - f.p.x, p.z - f.p.z) < 2.4 && !p.cooldown && p.resetTime === 0)
            {
                const sign = p.lateral > rival.lateral ? 1 : -1;
                p.x += f.r.x * .6 * sign;
                p.z += f.r.z * .6 * sign;
                rival.lateral -= .6 * sign;
                p.speed *= .92;
                rival.speed *= .92;
                p.cooldown = .25;
            }
        }
    }
    get visibleBanner()
    {
        if (this.player.resetTime > 0) return C.labels.reset;
        if (this.player.wrongTime > .4) return C.labels.wrong;
        if (Math.abs(this.player.lateral) > 8) return C.labels.off;
        return this.bannerUntil > this.clock ? this.banner : "";
    }
    ghost()
    {
        if (!this.best || this.state === "start") return null;
        const elapsed = this.clock - this.lapStart;
        const samples = this.best.samples;
        if (elapsed > this.best.time) return null;
        let i = 0;
        while (i < samples.length - 2 && samples[i + 1][0] < elapsed) i++;
        const a = samples[i];
        const b = samples[i + 1];
        const t = Math.max(0, Math.min(1, (elapsed - a[0]) / (b[0] - a[0])));
        const mix = (n) => a[n] + (b[n] - a[n]) * t;
        const yaw = a[3] + Math.atan2(Math.sin(b[3] - a[3]), Math.cos(b[3] - a[3])) * t;
        return { x: mix(1), z: mix(2), yaw, s: mix(4), lateral: 0 };
    }
    snapshot()
    {
        return { state: this.state, clock: this.clock, player: { ...this.player }, lapTimes: [...this.lapTimes], position: ordinal(this.position()), best: this.best?.time ?? null };
    }
}
