import { content as C } from "./content.js";
import { score, matchingPrefix, formatTime, parseRecords } from "./scoring.js";
import { drawTrack, drawShare } from "./renderer.js";
import { icons } from "./icons.js";

const $ = (id) => document.getElementById(id);
const L = C.labels;
$("app").innerHTML = C.shell;

function setButton(button, text, icon)
{
    button.replaceChildren();
    if (icons[icon])
    {
        button.insertAdjacentHTML("beforeend", icons[icon]);
    }
    button.append(document.createTextNode(text));
}

document.querySelectorAll("[data-icon]").forEach((button) =>
{
    setButton(button, button.textContent, button.dataset.icon);
});

let difficulty = "Medium";
let passageIndex = 0;
let expected = [];
let typed = [];
let entries = 0;
let correctEntries = 0;
let state = "idle";
let elapsedBank = 0;
let startedAt = null;
let countdownTimer;
let countIndex = 0;
let countText = "";
let pausedFrom = null;
let confirmRestart = false;
let confirmClear = false;
let latestResult = null;
let records = { runs: [], bests: {}, sequence: 0 };
let storageAvailable = true;
let feedbackTimer;

try
{
    const raw = localStorage.getItem(C.storageKey);
    if (raw)
    {
        records = parseRecords(raw, C.levels, C.passages);
    }
    localStorage.setItem(`${C.storageKey}:probe`, "1");
    localStorage.removeItem(`${C.storageKey}:probe`);
}
catch
{
    storageAvailable = false;
}

function elapsed()
{
    return elapsedBank + (startedAt === null ? 0 : performance.now() - startedAt);
}

function metrics()
{
    return score(matchingPrefix(typed, expected), entries, correctEntries, elapsed(), expected.length, C.levels[difficulty].pace);
}

function saveRecords()
{
    try
    {
        if (storageAvailable)
        {
            localStorage.setItem(C.storageKey, JSON.stringify({ version: 1, ...records }));
        }
    }
    catch
    {
        storageAvailable = false;
    }
}

function renderRecords(newRecord = false)
{
    $("best-rows").replaceChildren();
    for (const level of Object.keys(C.levels))
    {
        const best = records.bests[level];
        const row = document.createElement("tr");
        const values = [level, best?.wpm ?? L.blank, best ? `${best.bestAccuracy.toFixed(1)}%` : L.blank, best ? formatTime(best.lastElapsed) : L.blank];
        for (const value of values)
        {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.append(cell);
        }
        if (newRecord && latestResult?.personalBest && latestResult.difficulty === level)
        {
            row.className = "new-record";
        }
        $("best-rows").append(row);
    }
    $("empty").textContent = Object.keys(records.bests).length ? "" : L.empty;
    $("recent").replaceChildren();
    if (!records.runs.length)
    {
        const row = document.createElement("li");
        row.textContent = L.noRecent;
        $("recent").append(row);
    }
    for (const run of records.runs)
    {
        const row = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = `${L.run} ${String(run.sequence).padStart(2, "0")} · ${run.difficulty} · ${L.passage} ${run.passage + 1}`;
        const data = document.createElement("strong");
        data.textContent = `${run.wpm} ${L.wpm} · ${run.accuracy.toFixed(1)}% · ${formatTime(run.elapsed)}`;
        row.append(name, data);
        if (run.personalBest)
        {
            const marker = document.createElement("small");
            marker.textContent = L.pb;
            row.append(marker);
        }
        $("recent").append(row);
    }
    $("storage-note").textContent = storageAvailable ? L.recordsNote : L.storageUnavailable;
    $("clear").disabled = records.runs.length === 0 && Object.keys(records.bests).length === 0;
}

function updateControls()
{
    const locked = !["idle", "finished"].includes(state);
    document.querySelectorAll("#difficulties button").forEach((button) =>
    {
        button.disabled = locked;
        button.setAttribute("aria-pressed", String(button.dataset.level === difficulty));
    });
    $("next").disabled = locked;
    $("restart").disabled = state === "idle";
    $("typing").disabled = state !== "racing";
    $("primary").disabled = state === "countdown";
    const text = state === "racing" ? L.pause : state === "paused" ? L.resume : state === "finished" ? L.again : L.start;
    setButton($("primary"), text, state === "racing" ? "Pause" : "Play");
    setButton($("restart"), confirmRestart ? L.confirmRestart : L.restart, "RotateCcw");
    $("race").dataset.state = state;
}

function renderPassage(scroll = false)
{
    const prefix = matchingPrefix(typed, expected);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < expected.length; i++)
    {
        const char = document.createElement("span");
        char.textContent = expected[i];
        if (i < prefix)
        {
            char.className = "correct";
        }
        else if (i === prefix)
        {
            char.className = typed.length > prefix ? "wrong" : "caret";
        }
        fragment.append(char);
    }
    const priorTop = $("passage").scrollTop;
    $("passage").replaceChildren(fragment);
    $("passage").scrollTop = priorTop;
    $("character-count").textContent = `${prefix} / ${expected.length}`;
    if (scroll)
    {
        const active = $("passage").querySelector(".caret, .wrong");
        if (active)
        {
            const parentBox = $("passage").getBoundingClientRect();
            const activeBox = active.getBoundingClientRect();
            if (activeBox.bottom > parentBox.bottom - 12 || activeBox.top < parentBox.top)
            {
                $("passage").scrollTop += activeBox.top - parentBox.top - 32;
            }
        }
    }
}

function status()
{
    const wrong = typed.length > matchingPrefix(typed, expected);
    const text = state === "idle" ? L.idle : state === "countdown" ? `${L.countdown} ${countText}` :
        state === "paused" ? L.paused : state === "finished" ? L.finished :
        wrong ? L.error : startedAt === null && elapsedBank === 0 ? L.ready : L.racing;
    $("race-status").textContent = text;
    $("race-status").classList.toggle("error", wrong);
}

function reset()
{
    clearTimeout(countdownTimer);
    state = "idle";
    typed = [];
    entries = 0;
    correctEntries = 0;
    elapsedBank = 0;
    startedAt = null;
    countText = "";
    pausedFrom = null;
    confirmRestart = false;
    expected = Array.from(C.passages[difficulty][passageIndex]);
    $("typing").value = "";
    $("results").hidden = true;
    $("copy-fallback").hidden = true;
    $("share-status").textContent = "";
    $("countdown").textContent = "";
    $("passage").scrollTop = 0;
    $("passage-label").textContent = `${C.pack.toUpperCase()} / ${L.passage.toUpperCase()} ${String(passageIndex + 1).padStart(2, "0")}`;
    $("track-difficulty").textContent = `${difficulty.toUpperCase()} / ${C.levels[difficulty].pace} ${L.wpm}`;
    renderPassage();
    updateControls();
    status();
    renderMetrics();
}

function focusInput()
{
    if (state === "racing")
    {
        $("typing").focus({ preventScroll: true });
        $("typing").setSelectionRange($("typing").value.length, $("typing").value.length);
    }
    else if (state === "idle")
    {
        $("primary").focus({ preventScroll: true });
    }
}

function countdown()
{
    clearTimeout(countdownTimer);
    state = "countdown";
    countIndex = 0;
    updateControls();
    const sequence = ["3", "2", "1", "GO"];
    function step()
    {
        countText = sequence[countIndex];
        $("countdown").textContent = countText;
        $("countdown").classList.remove("count-tick");
        void $("countdown").offsetWidth;
        $("countdown").classList.add("count-tick");
        status();
        if (countIndex === 3)
        {
            state = "racing";
            countText = "GO";
            updateControls();
            status();
            focusInput();
            countdownTimer = setTimeout(() =>
            {
                countText = "";
                $("countdown").textContent = "";
            }, 650);
            return;
        }
        countIndex++;
        countdownTimer = setTimeout(step, 650);
    }
    step();
}

function pause()
{
    if (!["racing", "countdown"].includes(state))
    {
        return;
    }
    pausedFrom = state;
    elapsedBank = elapsed();
    startedAt = null;
    clearTimeout(countdownTimer);
    countText = "";
    $("countdown").textContent = "";
    state = "paused";
    updateControls();
    status();
    renderMetrics();
}

function resume()
{
    if (pausedFrom === "countdown")
    {
        countdown();
        return;
    }
    state = "racing";
    if (entries > 0)
    {
        startedAt = performance.now();
    }
    updateControls();
    status();
    focusInput();
}

function summary(run)
{
    return `${C.brand} — ${C.tagline}\n${run.difficulty} · ${run.wpm} ${L.wpm} · ${run.accuracy.toFixed(1)}% ${L.accuracy.toLowerCase()} · ${formatTime(run.elapsed)}\n${run.personalBest ? L.newBest : L.bestUnchanged}`;
}

async function finish()
{
    clearTimeout(countdownTimer);
    countText = "";
    $("countdown").textContent = "";
    elapsedBank = elapsed();
    startedAt = null;
    state = "finished";
    const final = metrics();
    const previousBest = records.bests[difficulty];
    latestResult =
    {
        difficulty,
        passage: passageIndex,
        wpm: final.wpm,
        accuracy: final.accuracy,
        elapsed: elapsedBank,
        entries,
        correctEntries,
        personalBest: !previousBest || final.wpm > previousBest.wpm,
        sequence: records.sequence + 1
    };
    records.sequence = latestResult.sequence;
    records.runs.unshift(latestResult);
    records.runs = records.runs.slice(0, 10);
    const bestAccuracy = Math.max(previousBest?.bestAccuracy || 0, final.accuracy);
    records.bests[difficulty] =
    {
        ...(latestResult.personalBest ? latestResult : previousBest),
        bestAccuracy,
        lastElapsed: elapsedBank
    };
    saveRecords();
    renderRecords(true);
    $("result-values").textContent = `${final.wpm} ${L.wpm} · ${final.accuracy.toFixed(1)}% · ${formatTime(elapsedBank)} · ${difficulty}`;
    const ghostFinishTime = expected.length * 60 / (C.levels[difficulty].pace * 5) * 1000;
    $("winner").textContent = elapsedBank < ghostFinishTime ? L.youWin : elapsedBank > ghostFinishTime ? L.ghostWins : L.tie;
    $("personal-best").textContent = latestResult.personalBest ? L.newBest : `${Math.max(0, previousBest.wpm - final.wpm)} ${L.bestGap}`;
    $("results").hidden = false;
    updateControls();
    status();
    renderMetrics();
    await drawShare($("share-card"), latestResult);
    $("result-title").focus({ preventScroll: true });
    $("results").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

function consumeInput()
{
    if (state !== "racing")
    {
        $("typing").value = typed.join("");
        return;
    }
    const next = Array.from($("typing").value);
    const old = typed.join("");
    if (next.length < typed.length && old.startsWith(next.join("")))
    {
        typed = next;
    }
    else if (next.join("").startsWith(old))
    {
        for (const char of next.slice(typed.length))
        {
            if (typed.length > matchingPrefix(typed, expected) || state !== "racing")
            {
                break;
            }
            if (/[\u0000-\u001f\u007f]/u.test(char))
            {
                continue;
            }
            if (startedAt === null)
            {
                startedAt = performance.now();
            }
            entries++;
            if (char === expected[typed.length])
            {
                correctEntries++;
            }
            typed.push(char);
            if (typed.length === expected.length && matchingPrefix(typed, expected) === expected.length)
            {
                // A zero-duration synthetic input is not a timed completed run.
                if (elapsed() > 0)
                {
                    void finish();
                }
                break;
            }
        }
    }
    $("typing").value = typed.join("");
    $("typing").setSelectionRange($("typing").value.length, $("typing").value.length);
    confirmRestart = false;
    renderPassage(true);
    updateControls();
    status();
    renderMetrics();
}

function renderMetrics()
{
    const data = metrics();
    $("wpm").textContent = String(data.wpm);
    $("accuracy").replaceChildren(document.createTextNode(data.accuracy.toFixed(1)));
    const symbol = document.createElement("span");
    symbol.textContent = "%";
    $("accuracy").append(symbol);
    $("time").textContent = formatTime(elapsed());
    $("percent").innerHTML = `${Math.floor(data.player * 100)}% <small>${L.completeWord}</small>`;
    $("position").textContent = data.ghost === 1 && data.player < 1 ? L.ghostFinished :
        ["idle", "countdown"].includes(state) || (data.player === 0 && data.ghost === 0) ? L.level :
        data.player > data.ghost ? L.youLead : data.player < data.ghost ? L.ghostLead : L.equal;
    $("race").dataset.elapsed = String(elapsed());
    $("race").dataset.entries = String(entries);
    $("race").dataset.correctEntries = String(correctEntries);
    drawTrack($("track"), data.player, data.ghost, countText);
}

for (const [level, definition] of Object.entries(C.levels))
{
    const button = document.createElement("button");
    button.dataset.level = level;
    button.append(document.createTextNode(level));
    const detail = document.createElement("small");
    detail.textContent = `${L.ghostWord} ${definition.pace} ${L.wpm}`;
    button.append(detail);
    button.addEventListener("click", () =>
    {
        difficulty = level;
        passageIndex = 0;
        reset();
    });
    $("difficulties").append(button);
}

$("primary").addEventListener("click", () =>
{
    if (state === "racing")
    {
        pause();
    }
    else if (state === "paused")
    {
        resume();
    }
    else
    {
        if (state === "finished")
        {
            reset();
        }
        countdown();
    }
});
$("restart").addEventListener("click", () =>
{
    if (typed.length > 0 && state !== "finished" && !confirmRestart)
    {
        confirmRestart = true;
        updateControls();
        return;
    }
    reset();
    countdown();
});

function nextPassage()
{
    passageIndex = (passageIndex + 1) % 2;
    reset();
}

$("next").addEventListener("click", nextPassage);
$("result-next").addEventListener("click", nextPassage);
$("again").addEventListener("click", () =>
{
    reset();
    countdown();
});
$("passage").addEventListener("click", focusInput);
$("passage").addEventListener("keydown", (event) =>
{
    if (["Enter", " "].includes(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey)
    {
        event.preventDefault();
        focusInput();
    }
});
$("tap").addEventListener("click", focusInput);
$("typing").addEventListener("input", (event) =>
{
    if (!event.isComposing)
    {
        consumeInput();
    }
});
$("typing").addEventListener("compositionend", consumeInput);
$("typing").addEventListener("beforeinput", (event) =>
{
    if (["insertFromPaste", "insertFromDrop", "insertReplacementText", "historyUndo", "historyRedo"].includes(event.inputType))
    {
        event.preventDefault();
        $("race-status").textContent = L.blocked;
    }
    if (event.inputType === "deleteContentBackward" && state === "racing")
    {
        event.preventDefault();
        typed.pop();
        $("typing").value = typed.join("");
        renderPassage(true);
        status();
        renderMetrics();
    }
});
for (const eventName of ["paste", "drop"])
{
    $("typing").addEventListener(eventName, (event) =>
    {
        event.preventDefault();
        $("race-status").textContent = L.blocked;
    });
}
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden)
    {
        pause();
    }
});
$("clear").addEventListener("click", () =>
{
    if (!confirmClear)
    {
        confirmClear = true;
        setButton($("clear"), L.confirmClear, "Trash2");
        return;
    }
    records = { runs: [], bests: {}, sequence: 0 };
    try
    {
        localStorage.removeItem(C.storageKey);
    }
    catch
    {
        storageAvailable = false;
    }
    confirmClear = false;
    setButton($("clear"), L.clear, "Trash2");
    renderRecords();
});

function feedback(message)
{
    clearTimeout(feedbackTimer);
    $("share-status").textContent = message;
    feedbackTimer = setTimeout(() =>
    {
        $("share-status").textContent = "";
    }, 1500);
}

$("copy").addEventListener("click", async () =>
{
    const text = summary(latestResult);
    try
    {
        await navigator.clipboard.writeText(text);
        $("copy-fallback").hidden = true;
        feedback(L.copySuccess);
    }
    catch
    {
        clearTimeout(feedbackTimer);
        $("copy-fallback").hidden = false;
        $("copy-fallback").value = text;
        $("copy-fallback").focus();
        $("copy-fallback").select();
        $("share-status").textContent = L.copyManual;
    }
});
$("download").addEventListener("click", async () =>
{
    await drawShare($("share-card"), latestResult);
    $("share-card").toBlob((blob) =>
    {
        if (!blob)
        {
            return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${C.brand.toLowerCase().replaceAll(" ", "-")}-${latestResult.difficulty.toLowerCase()}-${latestResult.wpm}wpm.png`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        feedback(L.downloaded);
    }, "image/png");
});

new ResizeObserver(renderMetrics).observe($("track"));
document.fonts.ready.then(renderMetrics);
reset();
renderRecords();
let previousFrame = 0;
function frame(now)
{
    if (now - previousFrame >= 50)
    {
        renderMetrics();
        previousFrame = now;
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
