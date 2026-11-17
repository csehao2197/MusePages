"use strict";

const tracks = [
    { title: "The Last Light", file: "last-light.wav", mood: "Warm keys · Dusk study", note: "A slowly unfolding, original D-major arpeggio. Soft sine keys and a low, rounded pulse trace the edge of the evening." },
    { title: "Velvet Hours", file: "velvet-hours.wav", mood: "Soft pulses · Night study", note: "An original A-minor miniature. Mellow, bell-like keys sit over a soft pulse, with a little space between every note." },
    { title: "A Quiet Return", file: "quiet-return.wav", mood: "Open chords · Dawn study", note: "An original C-major sketch. Gentle descending phrases settle into a sustained chord, like the first light entering a quiet room." }
];
const $ = (selector) => document.querySelector(selector);
const audio = $("#audio");
const seek = $("#seek");
const volume = $("#volume");
const panel = $("#panel");
const audioSources = new Map();
let current = 0;
let repeating = false;
let shuffling = false;
let previousVolume = .65;
let toastTimer;
let saved;
try
{
    saved = new Set(JSON.parse(localStorage.getItem("resonant-favorites") || "[]"));
}
catch
{
    saved = new Set();
}
audio.volume = .65;
$("#play").disabled = true;

async function prepareAudio()
{
    try
    {
        // Full local blobs keep native seeking independent of HTTP Range support.
        await Promise.all(tracks.map(async (track) =>
        {
            const response = await fetch(`assets/${track.file}`);
            if (!response.ok)
            {
                throw new Error("Local audio unavailable");
            }
            audioSources.set(track.file, URL.createObjectURL(await response.blob()));
        }));
        audio.src = audioSources.get(tracks[current].file);
        audio.dataset.originalSrc = `assets/${tracks[current].file}`;
        audio.load();
        $("#play").disabled = false;
    }
    catch
    {
        $("#signal").textContent = "LOCAL AUDIO UNAVAILABLE";
        notify("The original audio could not load. Check the static audio files and reload.");
    }
}

function icon(name)
{
    return `<svg><use href="assets/icons.svg#${name}"/></svg>`;
}

function notify(message)
{
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3500);
}

function format(seconds)
{
    const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function updateTimeline()
{
    const duration = Number.isFinite(audio.duration) ? audio.duration : 36;
    const position = audio.currentTime;
    seek.max = duration;
    seek.value = position;
    seek.style.setProperty("--fill", `${position / duration * 100}%`);
    seek.setAttribute("aria-valuetext", `${format(position)} of ${format(duration)}`);
    $("#elapsed").textContent = format(position);
    $("#remaining").textContent = `−${format(duration - position)}`;
}

function updatePlayback()
{
    const playing = !audio.paused;
    $("#play").setAttribute("aria-label", playing ? "Pause" : "Play");
    $("#play-icon use").setAttribute("href", `assets/icons.svg#${playing ? "pause" : "play"}`);
    $("#signal").textContent = playing ? "STEREO · ORIGINAL AUDIO" : audio.currentTime > 0 ? "PAUSED · TAKE YOUR TIME" : "READY TO LISTEN";
}

async function play()
{
    try
    {
        await audio.play();
    }
    catch
    {
        notify("Playback could not start. Press Play to try again.");
        updatePlayback();
    }
}

function togglePlayback()
{
    if (audio.paused)
    {
        void play();
    }
    else
    {
        audio.pause();
    }
}

function updateFavorite()
{
    const isSaved = saved.has(tracks[current].file);
    $("#favorite").setAttribute("aria-pressed", String(isSaved));
    $("#favorite").setAttribute("aria-label", `${isSaved ? "Unsave" : "Save"} ${tracks[current].title}`);
}

function selectTrack(index, autoplay = false)
{
    if (audioSources.size !== tracks.length)
    {
        notify("The original audio is still loading.");
        return;
    }
    audio.pause();
    current = (index + tracks.length) % tracks.length;
    audio.src = audioSources.get(tracks[current].file);
    audio.dataset.originalSrc = `assets/${tracks[current].file}`;
    audio.load();
    $("#track-title").textContent = tracks[current].title;
    $("#track-number").textContent = String(current + 1).padStart(2, "0");
    updateFavorite();
    updateTimeline();
    updatePlayback();
    if (autoplay)
    {
        void play();
    }
}

function advance(direction)
{
    const index = shuffling ? (current + 1 + Math.floor(Math.random() * (tracks.length - 1))) % tracks.length : current + direction;
    selectTrack(index, !audio.paused);
}

function openPanel(title, html)
{
    $("#options-menu").hidden = true;
    $("#options-open").setAttribute("aria-expanded", "false");
    $("#panel-title").textContent = title;
    $("#panel-body").innerHTML = html;
    if (!panel.open)
    {
        panel.showModal();
    }
}

function showQueue(library = false)
{
    openPanel(library ? "The listening library" : "Up next", `
        <p>AFTER HOURS / VOLUME 01<br>Three original, 36-second instrumental studies.</p>
        <ol class="queue-list">${tracks.map((track, index) => `
            <li><button class="queue-track" data-track="${index}" aria-current="${index === current}">
                <span class="track-index">${String(index + 1).padStart(2, "0")}</span>
                <span><strong>${track.title}</strong><small>${track.mood}</small></span>
                <span class="duration">0:36</span>
            </button></li>`).join("")}</ol>
        <p>Select a track to listen. Playback starts only when you choose it.</p>`);
    panel.querySelectorAll("[data-track]").forEach((button) =>
    {
        button.addEventListener("click", () =>
        {
            selectTrack(Number(button.dataset.track), true);
            panel.close();
        });
    });
}

function showNotes()
{
    openPanel("Behind the sound", `
        <p><strong>${tracks[current].title}</strong><br>Resonant Studio · After Hours</p>
        <p>${tracks[current].note}</p>
        <p>This is an instrumental recording. There are no lyrics.</p>
        <p>Resonant Studio is a fictional artist identity. Every sound is an original synthesized sample created for this player, not a commercial recording.</p>`);
}

function showAbout()
{
    openPanel("Small sounds. Real listening.", `
        <p><strong>The Afterhours Sessions</strong> is a fictional, three-track release made for this listening-room concept.</p>
        <p>The audio is real: original 36-second synthesized instrumental miniatures, served locally as WAV files. There are no borrowed recordings, lyrics, samples or artist affiliations.</p>
        <p>Music, cover artwork and material textures were created for this page and dedicated to CC0. Icons: Lucide, ISC license. The interface uses locally available Inter or your system sans-serif; time readouts use a system monospace.</p>
        <p>No account, streaming catalog, analytics or subscription. Favorites stay in this browser when local storage is available. Device routing depends on your browser.</p>`);
}

function showDevices()
{
    openPanel("Your listening setup", `
        <div class="device-status"><strong>This browser</strong><span>CONNECTED</span></div>
        <p>Audio plays through your system’s selected output. To use headphones or a speaker, connect them in your device’s audio settings.</p>
        <p>Resonant does not discover or simulate remote devices. Use the volume control here to adjust this player independently.</p>`);
}

function updateVolume(value)
{
    audio.volume = Math.min(1, Math.max(0, value));
    audio.muted = false;
    volume.value = Math.round(audio.volume * 100);
    volume.style.setProperty("--fill", `${volume.value}%`);
    volume.setAttribute("aria-valuetext", `${volume.value} percent`);
    $("#mute").setAttribute("aria-pressed", String(audio.volume === 0));
    $("#mute").setAttribute("aria-label", audio.volume === 0 ? "Unmute" : "Mute");
    $("#mute use").setAttribute("href", `assets/icons.svg#${audio.volume === 0 ? "volume-x" : "volume-1"}`);
}

function toggleMute()
{
    if (audio.volume > 0)
    {
        previousVolume = audio.volume;
        updateVolume(0);
    }
    else
    {
        updateVolume(previousVolume || .65);
    }
}

$("#play").addEventListener("click", togglePlayback);
$("#next").addEventListener("click", () => advance(1));
$("#previous").addEventListener("click", () =>
{
    if (audio.currentTime > 3)
    {
        audio.currentTime = 0;
        updateTimeline();
    }
    else
    {
        advance(-1);
    }
});
$("#favorite").addEventListener("click", () =>
{
    const key = tracks[current].file;
    if (saved.has(key))
    {
        saved.delete(key);
    }
    else
    {
        saved.add(key);
    }
    let persistent = true;
    try
    {
        localStorage.setItem("resonant-favorites", JSON.stringify([...saved]));
    }
    catch
    {
        persistent = false;
    }
    updateFavorite();
    notify(saved.has(key) ? persistent ? "Saved to your favorites." : "Saved for this visit. Browser storage is unavailable." : "Removed from your favorites.");
});
$("#shuffle").addEventListener("click", () =>
{
    shuffling = !shuffling;
    $("#shuffle").setAttribute("aria-pressed", String(shuffling));
    notify(shuffling ? "Shuffle on. A different study follows." : "Shuffle off. Original running order.");
});
$("#repeat").addEventListener("click", () =>
{
    repeating = !repeating;
    $("#repeat").setAttribute("aria-pressed", String(repeating));
    notify(repeating ? "Repeat this track is on." : "Repeat is off.");
});
seek.addEventListener("input", () =>
{
    if (audio.readyState >= 1)
    {
        audio.currentTime = Number(seek.value);
        updateTimeline();
    }
});
volume.addEventListener("input", () => updateVolume(Number(volume.value) / 100));
$("#volume-up").addEventListener("click", () => updateVolume(audio.volume + .1));
$("#mute").addEventListener("click", toggleMute);
for (const event of ["loadedmetadata", "durationchange", "timeupdate", "seeked"])
{
    audio.addEventListener(event, updateTimeline);
}
for (const event of ["play", "pause"])
{
    audio.addEventListener(event, updatePlayback);
}
audio.addEventListener("ended", () =>
{
    if (repeating)
    {
        audio.currentTime = 0;
        void play();
    }
    else
    {
        const index = shuffling ? (current + 1 + Math.floor(Math.random() * 2)) % tracks.length : (current + 1) % tracks.length;
        selectTrack(index, true);
    }
});
audio.addEventListener("error", () => notify("The local audio could not load. Check the static audio files."));
$("#queue-open").addEventListener("click", () => showQueue());
$("#library-open").addEventListener("click", () => showQueue(true));
$("#session-open").addEventListener("click", () => showQueue(true));
$("#lyrics").addEventListener("click", showNotes);
$("#about-open").addEventListener("click", showAbout);
$("#devices").addEventListener("click", showDevices);
$("#panel-close").addEventListener("click", () => panel.close());
panel.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab")
    {
        return;
    }
    const controls = [...panel.querySelectorAll("button:not(:disabled), a[href], input, select, textarea, [tabindex='0']")];
    const first = controls[0];
    const last = controls.at(-1);
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
panel.addEventListener("click", (event) =>
{
    if (event.target === panel)
    {
        const bounds = panel.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        {
            panel.close();
        }
    }
});
$("#airplay").addEventListener("click", () =>
{
    if (typeof audio.webkitShowPlaybackTargetPicker === "function")
    {
        audio.webkitShowPlaybackTargetPicker();
    }
    else
    {
        openPanel("Listen beyond the screen", `
            <p><strong>AirPlay is not available in this browser.</strong></p>
            <p>In supported Safari environments, this control opens the native AirPlay picker. Otherwise, choose an output in your system audio settings.</p>
            <p>Nothing has been connected or cast by this page.</p>`);
    }
});
$("#options-open").addEventListener("click", () =>
{
    const open = $("#options-menu").hidden;
    $("#options-menu").hidden = !open;
    $("#options-open").setAttribute("aria-expanded", String(open));
    if (open)
    {
        $("#restart").focus();
    }
});
document.addEventListener("click", (event) =>
{
    if (!event.target.closest(".options-wrap"))
    {
        $("#options-menu").hidden = true;
        $("#options-open").setAttribute("aria-expanded", "false");
    }
});
$("#restart").addEventListener("click", () =>
{
    audio.currentTime = 0;
    updateTimeline();
    $("#options-menu").hidden = true;
    $("#options-open").setAttribute("aria-expanded", "false");
    $("#options-open").focus();
    notify("Back to the beginning.");
});
$("#download").addEventListener("click", () =>
{
    const link = document.createElement("a");
    link.href = `assets/${tracks[current].file}`;
    link.download = `resonant-${tracks[current].file}`;
    link.click();
    $("#options-menu").hidden = true;
    $("#options-open").setAttribute("aria-expanded", "false");
    $("#options-open").focus();
});
$("#shortcuts-open").addEventListener("click", () =>
{
    openPanel("At your fingertips", `
        <p><kbd>Space</kbd> Play / pause</p>
        <p><kbd>← / →</kbd> Seek backward / forward 5 seconds</p>
        <p><kbd>↑ / ↓</kbd> Raise / lower volume</p>
        <p><kbd>M</kbd> Mute / unmute</p>
        <p><kbd>Esc</kbd> Close a dialog or options</p>
        <p>Shortcuts apply outside controls. Focus a slider and use arrow keys for precise adjustment.</p>`);
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape")
    {
        $("#options-menu").hidden = true;
        $("#options-open").setAttribute("aria-expanded", "false");
        return;
    }
    if (panel.open || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("button, input, a, textarea, select"))
    {
        return;
    }
    if (event.code === "Space")
    {
        event.preventDefault();
        togglePlayback();
    }
    else if (event.key === "ArrowRight" || event.key === "ArrowLeft")
    {
        event.preventDefault();
        audio.currentTime = Math.max(0, Math.min(Number.isFinite(audio.duration) ? audio.duration : 36, audio.currentTime + (event.key === "ArrowRight" ? 5 : -5)));
        updateTimeline();
    }
    else if (event.key === "ArrowUp" || event.key === "ArrowDown")
    {
        event.preventDefault();
        updateVolume(audio.volume + (event.key === "ArrowUp" ? .05 : -.05));
    }
    else if (event.key.toLowerCase() === "m")
    {
        toggleMute();
    }
});
updateFavorite();
updatePlayback();
void prepareAudio();
window.addEventListener("pagehide", (event) =>
{
    if (!event.persisted)
    {
        for (const url of audioSources.values())
        {
            URL.revokeObjectURL(url);
        }
    }
});
