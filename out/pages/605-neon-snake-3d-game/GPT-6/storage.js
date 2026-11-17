import { slug } from "./content.js";

const empty = () => ({ wrap: { best: 0, board: [] }, walls: { best: 0, board: [] } });
const validNumber = (value) => Number.isSafeInteger(value) && value >= 0;

export class LocalRuns
{
    constructor(storage)
    {
        this.storage = storage;
        this.data = empty();
        this.muted = false;
        try
        {
            this.muted = storage.getItem(`${slug}-muted`) === "true";
            const raw = storage.getItem(`${slug}-runs`);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            for (const rule of ["wrap", "walls"])
            {
                if (!validNumber(parsed[rule]?.best) || !Array.isArray(parsed[rule]?.board)) throw Error("Invalid scores");
                if (!parsed[rule].board.every((run) => /^[A-Z]{1,3}$/.test(run.name) &&
                    validNumber(run.score) && Number.isInteger(run.length) && run.length >= 4 && run.length <= 256))
                {
                    throw Error("Invalid run");
                }
                this.data[rule] =
                {
                    best: parsed[rule].best,
                    board: parsed[rule].board.sort((a, b) => b.score - a.score || b.length - a.length).slice(0, 5)
                };
            }
        }
        catch
        {
            this.data = empty();
        }
    }

    persist()
    {
        try
        {
            this.storage.setItem(`${slug}-runs`, JSON.stringify(this.data));
        }
        catch
        {
            // A private or full browser store must not interrupt a run.
        }
    }

    best(rule, score)
    {
        const improved = score > 0 && score > this.data[rule].best;
        if (improved)
        {
            this.data[rule].best = score;
            this.persist();
        }
        return improved;
    }

    save(rule, name, score, length)
    {
        this.data[rule].board.push({ name, score, length });
        this.data[rule].board.sort((a, b) => b.score - a.score || b.length - a.length);
        this.data[rule].board = this.data[rule].board.slice(0, 5);
        this.persist();
    }

    mute(value)
    {
        this.muted = value;
        try
        {
            this.storage.setItem(`${slug}-muted`, String(value));
        }
        catch
        {
            // Sound remains controllable when persistent storage is unavailable.
        }
    }
}
