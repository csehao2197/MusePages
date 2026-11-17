export function score(prefix, entries, correctEntries, elapsed, length, pace)
{
    return {
        wpm: elapsed > 0 ? Math.round((prefix / 5) / (elapsed / 60000)) : 0,
        accuracy: entries ? 100 * correctEntries / entries : 100,
        player: prefix / length,
        ghost: Math.min(1, elapsed / 1000 * pace * 5 / 60 / length)
    };
}

export function formatTime(milliseconds)
{
    const tenths = Math.floor(milliseconds / 100);
    return `${Math.floor(tenths / 600)}:${String(Math.floor(tenths / 10) % 60).padStart(2, "0")}.${tenths % 10}`;
}

export function matchingPrefix(typed, expected)
{
    let prefix = 0;
    while (prefix < typed.length && typed[prefix] === expected[prefix])
    {
        prefix++;
    }
    return prefix;
}

export function validRun(run, levels, passages)
{
    if (!run || typeof run !== "object" || !Object.hasOwn(levels, run.difficulty))
    {
        return false;
    }
    const numbers = [run.wpm, run.accuracy, run.elapsed, run.entries, run.correctEntries, run.sequence, run.passage];
    if (!numbers.every(Number.isFinite) || !Number.isInteger(run.wpm) || run.wpm < 0 ||
        run.accuracy < 0 || run.accuracy > 100 || run.elapsed <= 0 ||
        !Number.isInteger(run.sequence) || run.sequence < 1 ||
        ![0, 1].includes(run.passage) || typeof run.personalBest !== "boolean" ||
        !Number.isInteger(run.entries) || !Number.isInteger(run.correctEntries))
    {
        return false;
    }
    const length = Array.from(passages[run.difficulty][run.passage]).length;
    return run.correctEntries >= length && run.entries >= run.correctEntries &&
        run.wpm === score(length, run.entries, run.correctEntries, run.elapsed, length, levels[run.difficulty].pace).wpm &&
        Math.abs(run.accuracy - 100 * run.correctEntries / run.entries) < 0.000001;
}

export function parseRecords(raw, levels, passages)
{
    const empty = { runs: [], bests: {}, sequence: 0 };
    try
    {
        const data = JSON.parse(raw);
        if (!data || data.version !== 1 || !Array.isArray(data.runs) || !data.bests ||
            !Number.isSafeInteger(data.sequence) || data.sequence < 0 ||
            !data.runs.every((run) => validRun(run, levels, passages) && run.sequence <= data.sequence))
        {
            return empty;
        }
        const bests = {};
        for (const level of Object.keys(levels))
        {
            const best = data.bests[level];
            if (best !== undefined)
            {
                if (!validRun(best, levels, passages) || best.difficulty !== level || best.sequence > data.sequence ||
                    !Number.isFinite(best.bestAccuracy) || best.bestAccuracy < best.accuracy || best.bestAccuracy > 100 ||
                    !Number.isFinite(best.lastElapsed) || best.lastElapsed <= 0)
                {
                    return empty;
                }
                bests[level] = best;
            }
        }
        const runs = data.runs.slice(0, 10);
        if (new Set(runs.map((run) => run.sequence)).size !== runs.length ||
            runs.some((run, index) => index > 0 && run.sequence >= runs[index - 1].sequence))
        {
            return empty;
        }
        for (const run of runs)
        {
            if (!bests[run.difficulty] || run.wpm > bests[run.difficulty].wpm)
            {
                return empty;
            }
        }
        return { runs, bests, sequence: data.sequence };
    }
    catch
    {
        return empty;
    }
}
