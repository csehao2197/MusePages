import { content as c } from "./content.mjs";
import { createStore, judge, pickAnswer, shareResult } from "./game.mjs";

const $ = (id) => document.getElementById(id);
const paths = {
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    stats: '<path d="M5 21v-6M12 21V3M19 21V9"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    delete: '<path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6m0-6-6 6"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
let storage;
try
{
    storage = window.localStorage;
}
catch
{
    storage = { getItem() { throw Error("Storage unavailable"); }, setItem() { throw Error("Storage unavailable"); } };
}
const store = createStore(storage);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let statsOpen = false;
let animation = null;
let toastTimer;
let helpReturnFocus;

function toast(message)
{
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").hidden = false;
    toastTimer = setTimeout(() => { $("toast").hidden = true; }, 2200);
}

function setup()
{
    const strings = {
        eyebrow: c.eyebrow, headline: c.headline, "round-subtitle": c.subtitle,
        "result-kicker": c.resultKicker, "next-button": c.next, rotation: c.rotation(1),
        "stats-kicker": c.statsKicker, "stats-heading": c.statsHeading, "back-button": c.back,
        "help-kicker": c.helpKicker, "help-title": c.helpTitle, "dry-line": c.dry,
        "help-start": c.start, "footer-note": c.footer, credit: c.credit
    };
    for (const [id, value] of Object.entries(strings)) $(id).textContent = value;
    $("credit").href = c.creditUrl;
    $("help-button").innerHTML = icon("help");
    $("stats-button").innerHTML = icon("stats");
    $("close-help").innerHTML = icon("close");
    $("copy-button").innerHTML = `${icon("copy")}<span>${c.copy}</span>`;
    $("help-rules").replaceChildren(...c.helpRules.map((text) =>
    {
        const p = document.createElement("p");
        p.textContent = text;
        return p;
    }));
    $("help-examples").innerHTML = c.examples.map((example) =>
        `<div class="example"><div class="example-word" aria-label="${example.word}">${[...example.word].map((letter, i) =>
            `<span class="example-tile" ${i === example.index ? `data-state="${example.state}"` : ""}>${letter}</span>`).join("")}</div><strong>${example.title}</strong><p>${example.copy}</p></div>`).join("");
    $("legend").innerHTML = c.legend.map(([state, label]) => `<span><i data-state="${state}"></i>${label}</span>`).join("");
    for (let row = 0; row < 6; row++)
    {
        const line = document.createElement("div");
        line.className = "tile-row";
        for (let col = 0; col < 5; col++)
        {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.style.setProperty("--i", col);
            tile.dataset.row = row;
            tile.dataset.col = col;
            line.append(tile);
        }
        $("board").append(line);
    }
    for (const letters of ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"])
    {
        const row = document.createElement("div");
        row.className = "key-row";
        const values = letters === "ZXCVBNM" ? ["Enter", ...letters, "Backspace"] : [...letters];
        for (const value of values)
        {
            const button = document.createElement("button");
            button.className = `key${value.length > 1 ? " key-wide" : ""}`;
            button.dataset.key = value;
            button.setAttribute("aria-label", value);
            button.innerHTML = value === "Backspace" ? icon("delete") : value;
            button.addEventListener("click", () => input(value));
            row.append(button);
        }
        $("keyboard").append(row);
    }
    $("help-button").addEventListener("click", openHelp);
    $("close-help").addEventListener("click", () => $("help-dialog").close());
    $("help-start").addEventListener("click", () => $("help-dialog").close());
    $("help-dialog").addEventListener("close", () => helpReturnFocus?.focus());
    $("help-dialog").addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab") return;
        const first = $("close-help");
        const last = $("help-start");
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first.focus();
        }
    });
    $("help-dialog").addEventListener("click", (event) =>
    {
        if (event.target === $("help-dialog"))
        {
            const bounds = $("help-dialog").getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $("help-dialog").close();
        }
    });
    $("stats-button").addEventListener("click", () =>
    {
        if (animation) return;
        if (store.get().round.status !== "playing")
        {
            $("result-panel").focus();
            return;
        }
        statsOpen = !statsOpen;
        render();
        if (statsOpen) $("stats-panel").focus();
    });
    $("back-button").addEventListener("click", () =>
    {
        statsOpen = false;
        render();
        $("stats-button").focus();
    });
    $("next-button").addEventListener("click", () =>
    {
        if (!animation)
        {
            statsOpen = false;
            $("share-fallback").hidden = true;
            store.next();
            $("help-button").focus();
        }
    });
    $("copy-button").addEventListener("click", copy);
    window.addEventListener("keydown", (event) =>
    {
        if ($("help-dialog").open || statsOpen || event.ctrlKey || event.metaKey || event.altKey ||
            event.target.matches("textarea, input, select, [contenteditable=true]")) return;
        if (event.key === "Enter" && event.target.closest("button, a") && !event.target.closest("[data-key]")) return;
        const key = /^[a-z]$/i.test(event.key) ? event.key.toUpperCase() : event.key;
        if (/^[A-Z]$/.test(key) || key === "Enter" || key === "Backspace")
        {
            event.preventDefault();
            if (/^[A-Z]$/.test(key) && !animation && store.get().round.status === "playing" &&
                event.target.closest("button, a") && !event.target.closest("[data-key]"))
            {
                $("board").focus({ preventScroll: true });
            }
            input(key);
        }
    });
    store.subscribe((event) =>
    {
        if (event === "commit") return;
        render();
    });
    render();
    if (!store.get().helpSeen) openHelp();
    if (store.warning()) toast(store.warning());
}

function openHelp()
{
    helpReturnFocus = document.activeElement;
    if (!helpReturnFocus || helpReturnFocus === document.body) helpReturnFocus = $("help-button");
    $("help-dialog").showModal();
    $("close-help").focus();
    store.seenHelp();
}

function input(key)
{
    if (animation || statsOpen || $("help-dialog").open) return;
    const result = store.input(key);
    if (result.error)
    {
        toast(result.error);
        const row = $("board").children[store.get().round.rows.length];
        row.classList.remove("shake");
        void row.offsetWidth;
        row.classList.add("shake");
    }
    if (result.committed) reveal(result.row);
}

function reveal(row)
{
    const line = $("board").children[row];
    animation = { row, revealed: reducedMotion.matches ? 5 : 0, landed: reducedMotion.matches ? 5 : 0 };
    render();
    if (reducedMotion.matches)
    {
        finishReveal();
        return;
    }
    line.classList.add("flipping");
    for (let i = 0; i < 5; i++)
    {
        setTimeout(() =>
        {
            animation.revealed = i + 1;
            render();
        }, 260 + i * 110);
        setTimeout(() =>
        {
            animation.landed = i + 1;
            render();
        }, 520 + i * 110);
    }
    setTimeout(() =>
    {
        line.classList.remove("flipping");
        if (store.get().round.status === "won")
        {
            line.classList.add("bounce");
            setTimeout(() => line.classList.remove("bounce"), 600);
        }
        finishReveal();
    }, 970);
}

function finishReveal()
{
    animation = null;
    render();
    const round = store.get().round;
    if (round.status === "won") toast(c.winner);
    if (round.status !== "playing") $("result-panel").focus({ preventScroll: true });
    if (store.warning()) toast(store.warning());
}

function render()
{
    const { round } = store.get();
    const answer = pickAnswer(round.answerIndex);
    const committed = round.rows.map((word) => judge(word, answer));
    const rank = { miss: 1, near: 2, hit: 3 };
    const keys = {};
    for (let r = 0; r < round.rows.length; r++)
    {
        for (let col = 0; col < 5; col++)
        {
            if (animation?.row === r && col >= animation.landed) continue;
            const letter = round.rows[r][col];
            const state = committed[r][col];
            if ((rank[keys[letter]] || 0) < rank[state]) keys[letter] = state;
        }
    }
    for (const tile of $("board").querySelectorAll(".tile"))
    {
        const row = Number(tile.dataset.row);
        const col = Number(tile.dataset.col);
        const letter = round.rows[row]?.[col] || (row === round.rows.length ? round.current[col] : "") || "";
        let state = committed[row]?.[col] || (letter ? "typed" : "empty");
        if (animation?.row === row && col >= animation.revealed) state = "typed";
        if (tile.textContent !== letter)
        {
            tile.textContent = letter;
            tile.classList.toggle("typed", Boolean(letter));
        }
        tile.dataset.state = state;
        tile.setAttribute("aria-label", `Row ${row + 1}, letter ${col + 1}: ${letter ? `${letter}, ` : ""}${c.stateNames[state]}`);
    }
    for (const key of $("keyboard").querySelectorAll("button"))
    {
        const state = keys[key.dataset.key] || "empty";
        key.dataset.state = state;
        key.disabled = Boolean(animation) || round.status !== "playing";
        key.setAttribute("aria-label", `${key.dataset.key}${state !== "empty" ? `, ${c.stateNames[state]}` : ""}`);
    }
    $("puzzle-label").textContent = c.puzzle(round.answerIndex % 40 + 1);
    const terminal = round.status !== "playing" && !animation;
    $("board-status").textContent = animation ? c.revealing : terminal ?
        (round.status === "won" ? c.solved(round.rows.length) : c.lost) : round.rows.length ? c.progress(round.rows.length) : c.status(round.answerIndex % 40 + 1);
    $("keyboard").hidden = terminal || statsOpen;
    $("result-panel").hidden = !terminal;
    $("stats-panel").hidden = !statsOpen || terminal;
    $("legend").hidden = terminal || statsOpen;
    $("stats-button").setAttribute("aria-expanded", String(statsOpen || terminal));
    if (terminal)
    {
        $("result-heading").textContent = round.status === "won" ? c.solved(round.rows.length) : c.lost;
        $("answer").textContent = answer;
        $("loss-copy").hidden = round.status !== "lost";
        $("loss-copy").textContent = c.loss(answer);
        $("rotation").textContent = c.rotation(round.answerIndex % 40 + 1);
        renderStats($("result-stats"));
    }
    if (statsOpen && !terminal) renderStats($("standalone-stats"));
}

function renderStats(target)
{
    const { stats, history, round } = store.get();
    const numbers = [stats.played, stats.played ? Math.round(stats.wins / stats.played * 100) : 0, stats.streak, stats.best];
    const maximum = Math.max(1, ...stats.distribution);
    target.innerHTML = `<dl class="stats-grid">${numbers.map((value, i) => `<div><dt>${c.statsLabels[i]}</dt><dd>${value}${i === 1 ? "<small>%</small>" : ""}</dd></div>`).join("")}</dl>
        <div class="distribution-title"><h3>${c.distribution}</h3><button class="text-button reset-trigger">${c.reset}</button></div>
        <div class="distribution">${stats.distribution.map((count, i) => `<div class="distribution-row" aria-label="${i + 1} guesses: ${count} wins"><span>${i + 1}</span><div class="bar-track"><span class="bar ${round.status === "won" && round.rows.length === i + 1 && count ? "winning" : ""}" style="--width:${Math.max(7, count / maximum * 100)}%;--delay:${i * 40}ms">${count}</span></div></div>`).join("")}</div>
        ${stats.played ? "" : `<p class="empty-stats">${c.noStats}</p>`}
        <div class="reset-confirm" hidden role="group" aria-label="Reset stats confirmation"><p>${c.resetQuestion}</p><button class="ghost cancel-reset">${c.cancel}</button><button class="primary confirm-reset">${c.resetConfirm}</button></div>
        <details class="history"><summary>${c.history}${history.length ? ` · ${history.length}` : ""}</summary>${history.length ? `<ol>${history.map((item) => `<li><span>Puzzle ${item.answerIndex % 40 + 1} · ${pickAnswer(item.answerIndex)}</span><strong>${item.status === "won" ? `${item.rows.length}/6` : "X/6"}</strong></li>`).join("")}</ol>` : `<p>${c.historyEmpty}</p>`}</details>`;
    target.querySelector(".reset-trigger").addEventListener("click", () =>
    {
        target.querySelector(".reset-confirm").hidden = false;
        target.querySelector(".cancel-reset").focus();
    });
    target.querySelector(".cancel-reset").addEventListener("click", () =>
    {
        target.querySelector(".reset-confirm").hidden = true;
        target.querySelector(".reset-trigger").focus();
    });
    target.querySelector(".confirm-reset").addEventListener("click", () =>
    {
        store.resetStats();
        toast(c.resetDone);
        target.querySelector(".reset-trigger").focus();
    });
}

async function copy()
{
    const text = shareResult(store.get().round);
    try
    {
        await navigator.clipboard.writeText(text);
        $("copy-button").innerHTML = `${icon("check")}<span>${c.copy}</span>`;
        toast(c.copied);
        setTimeout(() => { $("copy-button").innerHTML = `${icon("copy")}<span>${c.copy}</span>`; }, 2200);
    }
    catch
    {
        $("share-fallback").value = text;
        $("share-fallback").hidden = false;
        $("share-fallback").focus();
        $("share-fallback").select();
        toast(c.copyFallback);
    }
}

setup();
