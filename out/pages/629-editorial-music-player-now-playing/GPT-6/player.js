"use strict";

const $ = (id) => document.getElementById(id);
const audio = $("audio");
const tracks = [
    { id: 0, title: "Slow afternoon", file: "slow-afternoon", duration: 32, cover: "slow<br>afternoon" },
    { id: 1, title: "Amber windows", file: "amber-windows", duration: 36, cover: "amber<br>windows" },
    { id: 2, title: "Somewhere, still", file: "somewhere-still", duration: 40, cover: "somewhere,<br>still" },
    { id: 3, title: "Last light", file: "last-light", duration: 32, cover: "last<br>light" }
];
let order = [0, 1, 2, 3];
let current = 0;
let shuffled = false;
let editing = false;
let saved = [];
let audioUrl;
let loadSequence = 0;
let loadPromise;
try
{
    const stored = JSON.parse(localStorage.getItem("off-hours-saved") || "[]");
    if (Array.isArray(stored)) saved = stored.filter((id) => Number.isInteger(id) && tracks[id]);
}
catch
{
    saved = [];
}
const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const time = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const announce = (message) => $("status").textContent = message;
const fill = (input) => input.style.setProperty("--fill", `${100 * (input.value - input.min) / (input.max - input.min)}%`);

async function loadTrack(id)
{
    const sequence = ++loadSequence;
    const response = await fetch(`assets/${tracks[id].file}.wav`);
    if (!response.ok) throw Error("Local audio is unavailable.");
    const blob = await response.blob();
    if (sequence !== loadSequence) return;
    const previousUrl = audioUrl;
    audioUrl = URL.createObjectURL(blob);
    audio.src = audioUrl;
    if (previousUrl) URL.revokeObjectURL(previousUrl);
}

function renderQueue(focusId)
{
    $("tracks").innerHTML = order.map((id, position) =>
    {
        const track = tracks[id];
        return `<li class="queue-row${id === current ? " current" : ""}" data-id="${id}">
            <button class="track-button" data-track="${id}" ${id === current ? 'aria-current="true"' : ""} aria-label="Play ${track.title}">
                <span class="thumb tone-${id}">${id === current ? icon("audio-lines") : ""}</span>
                <span class="row-text"><strong>${track.title}</strong><small>The Quiet Hours</small></span><span class="track-duration">${time(track.duration)}</span>
            </button>
            ${editing ? `<span class="reorder"><button data-move="${id}" data-step="-1" aria-label="Move ${track.title} up" ${position === 0 ? "disabled" : ""}>${icon("arrow-up")}</button><button data-move="${id}" data-step="1" aria-label="Move ${track.title} down" ${position === order.length - 1 ? "disabled" : ""}>${icon("arrow-down")}</button></span>` : ""}
        </li>`;
    }).join("");
    if (focusId !== undefined) document.querySelector(`[data-track="${focusId}"]`).focus();
}

function updateSaved()
{
    $("like").setAttribute("aria-pressed", String(saved.includes(current)));
    $("like").setAttribute("aria-label", `${saved.includes(current) ? "Unsave" : "Save"} ${tracks[current].title}`);
}

async function play()
{
    try
    {
        await loadPromise;
        await audio.play();
        announce(`Playing ${tracks[current].title}`);
    }
    catch
    {
        announce("Audio could not start. Please press Play to try again.");
    }
}

function choose(id, shouldPlay = true)
{
    current = id;
    audio.pause();
    loadPromise = loadTrack(id);
    $("track-title").textContent = tracks[id].title;
    document.querySelector(".cover-bottom > span").innerHTML = tracks[id].cover;
    document.querySelector(".cover-top > span:last-child").textContent = `STUDY 0${id + 1}`;
    $("seek").max = tracks[id].duration;
    $("seek").value = 0;
    $("elapsed").textContent = "0:00";
    $("duration").textContent = time(tracks[id].duration);
    fill($("seek"));
    renderQueue();
    updateSaved();
    if (shouldPlay) void play();
}

function advance(direction)
{
    let position = order.indexOf(current);
    if (shuffled && direction > 0)
    {
        const candidates = order.filter((id) => id !== current);
        choose(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    else
    {
        choose(order[(position + direction + order.length) % order.length]);
    }
}

$("play").addEventListener("click", () => audio.paused ? void play() : audio.pause());
audio.addEventListener("play", () =>
{
    $("play").setAttribute("aria-label", "Pause");
    $("play").innerHTML = icon("pause");
});
audio.addEventListener("pause", () =>
{
    $("play").setAttribute("aria-label", "Play");
    $("play").innerHTML = icon("play");
});
audio.addEventListener("timeupdate", () =>
{
    $("seek").value = audio.currentTime;
    $("elapsed").textContent = time(audio.currentTime);
    fill($("seek"));
});
audio.addEventListener("loadedmetadata", () =>
{
    $("seek").max = audio.duration;
    $("duration").textContent = time(audio.duration);
});
audio.addEventListener("ended", () =>
{
    if ($("repeat").getAttribute("aria-pressed") === "true")
    {
        audio.currentTime = 0;
        void play();
    }
    else advance(1);
});
$("seek").addEventListener("input", () =>
{
    if (Number.isFinite(audio.duration)) audio.currentTime = Math.min(Number($("seek").value), audio.duration - .05);
    $("elapsed").textContent = time(Number($("seek").value));
    fill($("seek"));
});
$("volume").addEventListener("input", () =>
{
    audio.volume = Number($("volume").value);
    audio.muted = false;
    $("mute").setAttribute("aria-pressed", "false");
    $("mute").setAttribute("aria-label", "Mute");
    $("mute").innerHTML = icon("volume-1");
    fill($("volume"));
});
$("mute").addEventListener("click", () =>
{
    audio.muted = !audio.muted;
    $("mute").setAttribute("aria-pressed", String(audio.muted));
    $("mute").setAttribute("aria-label", audio.muted ? "Unmute" : "Mute");
    $("mute").innerHTML = icon(audio.muted ? "volume-x" : "volume-1");
});
$("next").addEventListener("click", () => advance(1));
$("previous").addEventListener("click", () =>
{
    if (audio.currentTime > 3) audio.currentTime = 0;
    else advance(-1);
});
$("shuffle").addEventListener("click", () =>
{
    shuffled = !shuffled;
    $("shuffle").setAttribute("aria-pressed", String(shuffled));
    announce(`Shuffle ${shuffled ? "on" : "off"}`);
});
$("repeat").addEventListener("click", () =>
{
    const active = $("repeat").getAttribute("aria-pressed") !== "true";
    $("repeat").setAttribute("aria-pressed", String(active));
    announce(`Repeat track ${active ? "on" : "off"}`);
});
$("like").addEventListener("click", () =>
{
    saved = saved.includes(current) ? saved.filter((id) => id !== current) : [...saved, current];
    try
    {
        localStorage.setItem("off-hours-saved", JSON.stringify(saved));
        announce(saved.includes(current) ? "Track saved in this browser." : "Track removed from saved.");
    }
    catch
    {
        announce("Saved for this visit. Browser storage is unavailable.");
    }
    updateSaved();
});
$("queue-edit").addEventListener("click", () =>
{
    editing = !editing;
    $("queue-edit").innerHTML = `${editing ? "Done" : "Queue"} ${icon(editing ? "check" : "list-music")}`;
    document.querySelector(".queue-help").hidden = !editing;
    renderQueue();
});
$("tracks").addEventListener("click", (event) =>
{
    const selected = event.target.closest("[data-track]");
    if (selected) choose(Number(selected.dataset.track));
    const move = event.target.closest("[data-move]");
    if (move)
    {
        const id = Number(move.dataset.move);
        const position = order.indexOf(id);
        const destination = position + Number(move.dataset.step);
        if (destination < 0 || destination >= order.length) return;
        [order[position], order[destination]] = [order[destination], order[position]];
        renderQueue(id);
        announce(`${tracks[id].title} moved to position ${destination + 1}.`);
    }
});
$("collapse").addEventListener("click", () =>
{
    const hidden = !$("listening").hidden;
    $("listening").hidden = hidden;
    $("collapse").setAttribute("aria-expanded", String(!hidden));
    $("collapse").setAttribute("aria-label", hidden ? "Show now playing" : "Show queue");
});
$("more").addEventListener("click", () => $("about").showModal());
$("close-about").addEventListener("click", () => $("about").close());
document.addEventListener("keydown", (event) =>
{
    if (event.code === "Space" && !event.repeat && !$("about").open && !event.target.closest("button, input, a, textarea"))
    {
        event.preventDefault();
        audio.paused ? void play() : audio.pause();
    }
});
audio.volume = 0.65;
fill($("volume"));
renderQueue();
updateSaved();
loadPromise = loadTrack(current).catch(() => announce("Local audio is unavailable. Please reload to try again."));
window.addEventListener("pagehide", () =>
{
    audio.pause();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
});
