export function applyStep(array, sorted, step)
{
    if (step.k === "swap")
    {
        [array[step.i], array[step.j]] = [array[step.j], array[step.i]];
    }
    else if (step.k === "write") array[step.i] = step.value;
    else if (step.k === "sorted") step.indices.forEach((i) => sorted.add(i));
}

export class Player
{
    constructor(input, steps)
    {
        this.input = [...input];
        this.steps = steps;
        this.snapshots = new Map();
        this.counts = ["compare", "swap", "write"].map(() => new Int32Array(steps.length + 1));
        const array = [...input];
        const sorted = new Set();
        this.snapshots.set(0, { array: [...array], sorted: [] });
        steps.forEach((step, index) =>
        {
            applyStep(array, sorted, step);
            ["compare", "swap", "write"].forEach((kind, metric) =>
            {
                this.counts[metric][index + 1] = this.counts[metric][index] + Number(step.k === kind);
            });
            if ((index + 1) % 256 === 0)
            {
                this.snapshots.set(index + 1, { array: [...array], sorted: [...sorted] });
            }
        });
        this.seek(0);
    }

    seek(position)
    {
        this.position = Math.max(0, Math.min(this.steps.length, Math.trunc(position)));
        const nearest = Math.floor(this.position / 256) * 256;
        const snapshot = this.snapshots.get(nearest);
        this.array = [...snapshot.array];
        this.sorted = new Set(snapshot.sorted);
        for (let i = nearest; i < this.position; i++) applyStep(this.array, this.sorted, this.steps[i]);
        this.step = this.steps[this.position - 1];
        this.metrics = this.counts.map((prefix) => prefix[this.position]);
        return this;
    }

    get total()
    {
        return this.steps.length;
    }

    get finished()
    {
        return this.position === this.total;
    }
}

export function raceAt(players, tick)
{
    const total = Math.max(...players.map((player) => player.total));
    const position = Math.max(0, Math.min(total, Math.trunc(tick)));
    players.forEach((player) => player.seek(position));
    const [a, b] = players.map((player) => player.total);
    return { tick: position, total, winner: a === b ? null : a < b ? 0 : 1, margin: Math.abs(a - b) };
}
