import { content } from "./content.js";

export function createScores()
{
    let scores = [];
    let persistent = true;
    try
    {
        const saved = JSON.parse(localStorage.getItem(content.storageKey) ?? "[]");
        if (Array.isArray(saved))
        {
            scores = saved.filter((entry) => /^[A-Z]{3}$/.test(entry.initials) && Number.isSafeInteger(entry.score) && entry.score > 0)
                .sort((a, b) => b.score - a.score).slice(0, 5);
        }
    }
    catch
    {
        persistent = false;
    }
    function render()
    {
        const list = document.querySelector("#scores");
        list.replaceChildren();
        for (let i = 0; i < 5; i++)
        {
            const li = document.createElement("li");
            const player = scores[i];
            li.innerHTML = `<span><em>0${i + 1}</em>${player?.initials ?? content.messages.emptyPlayer}</span><span>${player ? String(player.score).padStart(5, "0") : content.messages.emptyScore}</span>`;
            list.append(li);
        }
        document.querySelector("#storage-note").textContent = persistent ? content.messages.local : content.messages.memory;
    }
    function persist()
    {
        try
        {
            localStorage.setItem(content.storageKey, JSON.stringify(scores));
        }
        catch
        {
            persistent = false;
        }
        render();
    }
    render();
    return {
        qualifies(score)
        {
            return score > 0 && (scores.length < 5 || score > scores.at(-1).score);
        },
        add(initials, score)
        {
            if (!/^[A-Z]{3}$/.test(initials) || !Number.isSafeInteger(score) || score <= 0) return false;
            scores = [...scores, { initials, score }].sort((a, b) => b.score - a.score).slice(0, 5);
            persist();
            return true;
        },
        reset()
        {
            scores = [];
            persist();
        }
    };
}
