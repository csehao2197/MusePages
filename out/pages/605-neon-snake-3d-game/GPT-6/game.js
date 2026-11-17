export const GRID_SIZE = 16;
export const SPEEDS = [3.4, 4.4, 5.5, 6.6, 7.8];
export const STEP_LENGTHS = [4, 8, 12, 17, 23];
export const OPENING_BODY = [[11, 8], [10, 8], [9, 8], [8, 8]];
export const OPENING_FOOD = [14, 8];
export const DIRECTIONS =
{
    north: [0, -1],
    west: [-1, 0],
    south: [0, 1],
    east: [1, 0]
};
export const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
export const wrap = (value) => (value + GRID_SIZE) % GRID_SIZE;
export const stepFor = (length) => STEP_LENGTHS.filter((minimum) => length >= minimum).length;

export class SnakeGame
{
    constructor(random = Math.random)
    {
        this.random = random;
        this.reset();
    }

    reset(rule = "wrap")
    {
        this.rule = rule;
        this.body = OPENING_BODY.map((cell) => [...cell]);
        this.food = [...OPENING_FOOD];
        this.direction = [...DIRECTIONS.east];
        this.queued = null;
        this.offset = 0;
        this.score = 0;
        this.step = 1;
        this.growQueue = 0;
        this.state = "title";
        this.reason = null;
        this.events = [];
    }

    start()
    {
        this.state = "playing";
    }

    queue(name)
    {
        if (this.state !== "playing") return false;
        const next = DIRECTIONS[name];
        if (!next || next[0] === -this.direction[0] && next[1] === -this.direction[1]) return false;
        this.queued = [...next];
        return true;
    }

    update(delta)
    {
        if (this.state !== "playing") return;
        this.offset += SPEEDS[this.step - 1] * Math.min(Math.max(delta, 0), 0.05);
        let crossings = 0;
        while (this.offset >= 1 && this.state === "playing" && crossings < 3)
        {
            this.cross();
            if (this.state === "playing") this.offset -= 1;
            else this.offset = 1;
            crossings++;
        }
    }

    cross()
    {
        if (this.queued)
        {
            if (!(this.queued[0] === -this.direction[0] && this.queued[1] === -this.direction[1]))
            {
                this.direction = this.queued;
            }
            this.queued = null;
        }
        let next = this.body[0].map((value, axis) => value + this.direction[axis]);
        if (this.rule === "walls" && next.some((value) => value < 0 || value >= GRID_SIZE))
        {
            this.finish("rail");
            return;
        }
        if (this.rule === "wrap") next = next.map(wrap);
        const eats = this.food && sameCell(next, this.food);
        const occupied = this.body.slice(0, this.body.length - (this.growQueue === 0 && !eats ? 1 : 0));
        if (occupied.some((cell) => sameCell(cell, next)))
        {
            this.finish("cross");
            return;
        }
        if (eats)
        {
            this.score += this.step * 10;
            this.growQueue++;
            this.events.push({ type: "eat", score: this.score });
        }
        this.body.unshift(next);
        if (this.growQueue > 0) this.growQueue--;
        else this.body.pop();
        this.step = stepFor(this.body.length);
        if (eats)
        {
            const free = [];
            for (let z = 0; z < GRID_SIZE; z++)
            {
                for (let x = 0; x < GRID_SIZE; x++)
                {
                    if (!this.body.some((cell) => sameCell(cell, [x, z]))) free.push([x, z]);
                }
            }
            this.food = free.length ? free[Math.floor(this.random() * free.length)] : null;
            if (!this.food) this.finish("clear");
        }
    }

    pause()
    {
        if (this.state !== "playing") return;
        this.state = "paused";
        this.queued = null;
    }

    resume()
    {
        if (this.state === "paused") this.state = "playing";
    }

    finish(reason)
    {
        this.state = "over";
        this.reason = reason;
        this.queued = null;
        this.events.push({ type: "over", reason });
    }
}
