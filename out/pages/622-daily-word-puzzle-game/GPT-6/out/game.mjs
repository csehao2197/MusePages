import { answers, accepted, content } from "./content.mjs";

export const gameSlug = content.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export const storageKey = `${gameSlug}:stats`;
const dictionary = new Set(accepted);

export function pickAnswer(index)
{
    return answers[((index % answers.length) + answers.length) % answers.length];
}

export function isValid(word)
{
    return typeof word === "string" && dictionary.has(word.toUpperCase());
}

export function judge(guess, answer)
{
    guess = guess.toUpperCase();
    answer = answer.toUpperCase();
    const states = Array(5).fill("miss");
    const remaining = {};
    for (let i = 0; i < 5; i++)
    {
        if (guess[i] === answer[i]) states[i] = "hit";
        else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++)
    {
        if (states[i] !== "hit" && remaining[guess[i]] > 0)
        {
            states[i] = "near";
            remaining[guess[i]]--;
        }
    }
    return states;
}

export function roundStatus(rows, index)
{
    if (rows.at(-1) === pickAnswer(index)) return "won";
    return rows.length === 6 ? "lost" : "playing";
}

export function buildResultRow(statesByRow)
{
    const symbols = { hit: "▉", near: "◪", miss: "▢" };
    return statesByRow.map((row) => row.map((state) => symbols[state]).join(" ")).join("\n");
}

export function shareResult(round)
{
    return `${content.shareHeader(round.status, round.rows.length, round.answerIndex % 40 + 1)}\n${buildResultRow(round.rows.map((word) => judge(word, pickAnswer(round.answerIndex))))}`;
}

export function emptyStats()
{
    return { played: 0, wins: 0, streak: 0, best: 0, distribution: [0, 0, 0, 0, 0, 0] };
}

export function createStore(storage)
{
    let warning = "";
    let data = {
        version: 1,
        round: { answerIndex: 0, rows: [], current: "", status: "playing" },
        stats: emptyStats(),
        history: [],
        helpSeen: false
    };
    const integer = (n) => Number.isSafeInteger(n) && n >= 0;
    const validStats = (s) => s && ["played", "wins", "streak", "best"].every((key) => integer(s[key])) &&
        Array.isArray(s.distribution) && s.distribution.length === 6 && s.distribution.every(integer) &&
        s.distribution.reduce((a, b) => a + b, 0) === s.wins && s.wins <= s.played &&
        s.streak <= s.best && s.best <= s.wins;
    const validRound = (r) => r && integer(r.answerIndex) && r.answerIndex < Number.MAX_SAFE_INTEGER &&
        Array.isArray(r.rows) && r.rows.length <= 6 && r.rows.every((w) => /^[A-Z]{5}$/.test(w) && isValid(w)) &&
        !r.rows.slice(0, -1).includes(pickAnswer(r.answerIndex)) &&
        /^[A-Z]{0,5}$/.test(r.current) && r.status === roundStatus(r.rows, r.answerIndex) &&
        (r.status === "playing" || r.current === "");
    try
    {
        const raw = storage.getItem(storageKey);
        if (raw)
        {
            const parsed = JSON.parse(raw);
            if (parsed.version !== 1 || !validRound(parsed.round) || !validStats(parsed.stats) ||
                typeof parsed.helpSeen !== "boolean" || !Array.isArray(parsed.history) || parsed.history.length > 40 ||
                !parsed.history.every((r) => validRound(r) && r.status !== "playing")) throw Error("Invalid saved state");
            data = parsed;
        }
    }
    catch (error)
    {
        warning = error instanceof SyntaxError || error.message === "Invalid saved state" ? content.recovered : content.storageWarning;
    }
    const subscribers = new Set();
    function save(event = "change")
    {
        try
        {
            storage.setItem(storageKey, JSON.stringify(data));
        }
        catch
        {
            warning = content.storageWarning;
        }
        subscribers.forEach((listener) => listener(event));
    }
    return {
        get: () => structuredClone(data),
        warning: () => warning,
        subscribe(listener)
        {
            subscribers.add(listener);
            return () => subscribers.delete(listener);
        },
        seenHelp()
        {
            data.helpSeen = true;
            save();
        },
        input(key)
        {
            const round = data.round;
            if (round.status !== "playing") return { ignored: true };
            if (/^[A-Z]$/.test(key))
            {
                if (round.current.length < 5)
                {
                    round.current += key;
                    save("type");
                }
                return {};
            }
            if (key === "Backspace")
            {
                round.current = round.current.slice(0, -1);
                save("type");
                return {};
            }
            if (key !== "Enter") return { ignored: true };
            if (round.current.length !== 5) return { error: content.needLetters };
            if (!isValid(round.current)) return { error: content.invalid };
            round.rows.push(round.current);
            round.current = "";
            round.status = roundStatus(round.rows, round.answerIndex);
            if (round.status !== "playing")
            {
                const stats = data.stats;
                stats.played++;
                if (round.status === "won")
                {
                    stats.wins++;
                    stats.streak++;
                    stats.best = Math.max(stats.best, stats.streak);
                    stats.distribution[round.rows.length - 1]++;
                }
                else stats.streak = 0;
                data.history.unshift(structuredClone(round));
                data.history = data.history.slice(0, 40);
            }
            save("commit");
            return { committed: true, row: round.rows.length - 1 };
        },
        next()
        {
            if (data.round.status === "playing") return;
            data.round = { answerIndex: data.round.answerIndex + 1, rows: [], current: "", status: "playing" };
            save("next");
        },
        resetStats()
        {
            data.stats = emptyStats();
            data.history = [];
            save("reset");
        }
    };
}
