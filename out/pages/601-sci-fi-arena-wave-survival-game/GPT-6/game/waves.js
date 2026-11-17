import { rules, compact } from "./rules.js";

export class Waves
{
    constructor(drones, audio)
    {
        this.drones = drones;
        this.audio = audio;
        this.number = 1;
        this.clear = false;
    }

    start(number)
    {
        this.number = number;
        this.total = rules.waveSize(number);
        this.spawned = 0;
        this.delay = rules.spawnInterval;
        this.breather = 0;
        this.clear = false;
        if (number === 1)
        {
            const first = this.drones.live[0];
            first.title = false;
            first.age = 0;
            this.spawned = 1;
        }
        this.audio.cue("wave");
    }

    update(delta)
    {
        if (this.clear)
        {
            this.breather -= delta;
            if (this.breather <= 0) this.start(this.number + 1);
            return;
        }
        if (this.spawned < this.total)
        {
            const cap = compact() ? 4 : 8;
            if (this.drones.live.length >= cap) this.delay = rules.spawnInterval;
            else
            {
                this.delay -= delta;
                if (this.delay <= 0)
                {
                    this.drones.create(this.spawned, this.number);
                    this.spawned++;
                    this.delay = rules.spawnInterval;
                }
            }
        }
        if (this.spawned === this.total && this.drones.live.length === 0)
        {
            this.clear = true;
            this.breather = rules.breather;
        }
    }
}
