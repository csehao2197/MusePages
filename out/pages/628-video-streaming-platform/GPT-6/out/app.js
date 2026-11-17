"use strict";

const paths =
{
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    play: '<path d="m8 5 12 7-12 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="m6 6 12 12M6 18 18 6"/>',
    "arrow-down": '<path d="M12 5v14m-6-6 6 6 6-6"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    sparkles: '<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7zM20 2v4M18 4h4"/>',
    bookmark: '<path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    aperture: '<circle cx="12" cy="12" r="10"/><path d="m14.3 2.3 3.4 6M21.7 9.7h-7M19.4 18.7l-3.5-6M9.7 21.7l-3.4-6M2.3 14.3h7M4.6 5.3l3.5 6"/>',
    maximize: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.play}</svg>`;
document.querySelectorAll("[data-icon]").forEach((node) => node.insertAdjacentHTML("afterbegin", icon(node.dataset.icon)));
const $ = (selector) => document.querySelector(selector);
const films =
[
    { id: "quiet", title: "The Quiet Between", genre: "Nature", mood: "Explore", age: "G", description: "Follow the light across an imagined alpine wilderness. An original animated study in stillness." },
    { id: "tidal", title: "Tidal Hours", genre: "Ambient", mood: "Unwind", age: "G", description: "A shoreline, a setting sun, and the rhythm of water. Eight seconds to take a breath." },
    { id: "night", title: "Night / Shift", genre: "Animation", mood: "Discover", age: "PG", description: "Neon windows flicker awake in an imaginary city after dark. A little nocturnal energy." },
    { id: "higher", title: "A Higher Ground", genre: "Nature", mood: "Explore", age: "G", description: "Layers of mountain ridges drift under a golden sky. A journey with no destination." },
    { id: "orbit", title: "Soft Orbit", genre: "Animation", mood: "Wonder", age: "G", description: "Color, gravity, and a quiet dance of planets. An original abstract cosmic animation." },
    { id: "rain", title: "After the Rain", genre: "Ambient", mood: "Unwind", age: "G", description: "A rainy forest catches its first light. An animated moment of green and renewal." }
];
let state;
try
{
    const stored = JSON.parse(localStorage.getItem("frame-cinema-v1") || "{}");
    const valid = (value) => value && typeof value === "object" && !Array.isArray(value);
    state =
    {
        saved: Array.isArray(stored.saved) ? stored.saved.filter((id) => films.some((film) => film.id === id)) : [],
        progress: valid(stored.progress) ? stored.progress : {},
        ratings: valid(stored.ratings) ? stored.ratings : {},
        family: stored.family === true
    };
}
catch
{
    state = { saved: [], progress: {}, ratings: {}, family: false };
}
let view = "home";
let genre = "All";
let query = "";
let current = null;
let mediaUrl = null;
let mediaRequest = 0;
let returnFocus = null;
let toastTimer;
const video = $("#video");
const player = $("#player-dialog");
const info = $("#info-dialog");
function persist()
{
    try
    {
        localStorage.setItem("frame-cinema-v1", JSON.stringify(state));
    }
    catch
    {
        notify("Storage is unavailable. Changes last for this visit only.");
    }
}
function notify(text)
{
    clearTimeout(toastTimer);
    $("#toast").textContent = text;
    $("#toast").hidden = false;
    toastTimer = setTimeout(() => $("#toast").hidden = true, 2500);
}
function allowed(film)
{
    return !state.family || film.age === "G";
}
function card(film, resume = false)
{
    const saved = state.saved.includes(film.id);
    const progress = Math.min(100, Math.max(0, Number(state.progress[film.id] || 0) / 8 * 100));
    return `<article class="film-card"><button class="poster-button" data-play="${film.id}" aria-label="${resume ? "Resume" : "Play"} ${film.title}"><img src="assets/${film.id}.svg" alt="" loading="lazy"><span class="poster-badge">FRAME ORIGINAL</span><span class="poster-name">${film.title}</span><span class="poster-play">${icon("play")}</span>${resume ? `<span class="progress-line" style="width:${progress}%"></span>` : ""}</button><div class="card-caption"><div><h3>${film.title}</h3><p>${film.genre} &nbsp;·&nbsp; 8 sec &nbsp;·&nbsp; ${film.age}</p></div><button class="save-card" data-save="${film.id}" aria-label="${saved ? "Remove" : "Save"} ${film.title}${saved ? " from" : " to"} my list" aria-pressed="${saved}">${icon(saved ? "check" : "plus")}</button></div></article>`;
}
function syncSaves()
{
    $("#list-count").textContent = state.saved.length;
    for (const [selector, film] of [["#hero-save", films[0]], ["#player-save", current]])
    {
        if (!film) continue;
        const button = $(selector);
        const saved = state.saved.includes(film.id);
        button.innerHTML = `${icon(saved ? "check" : "plus")}<span class="save-label">${saved ? "In my list" : "My list"}</span>`;
        button.setAttribute("aria-pressed", saved);
    }
}
function render()
{
    const visible = films.filter((film) => allowed(film) && (genre === "All" || film.genre === genre) && (view !== "watchlist" || state.saved.includes(film.id)) && `${film.title} ${film.genre} ${film.mood}`.toLowerCase().includes(query));
    $("#film-grid").innerHTML = visible.map((film) => card(film)).join("");
    $("#result-count").textContent = `${visible.length} original ${visible.length === 1 ? "film" : "films"}`;
    $("#section-title").textContent = query ? "A little closer to your next film" : view === "watchlist" ? "Your own little collection" : view === "films" ? "Small films. Big feelings." : genre === "All" ? "Made for a little escape" : `${genre}, in a new light`;
    $("#empty").hidden = visible.length > 0;
    $("#empty-title").textContent = query || genre !== "All" ? "No films in this frame" : "Your collection starts here";
    $("#empty-copy").textContent = query || genre !== "All" ? "Try another title or explore all genres." : "Save a film with the + button to make it yours.";
    const continued = films.filter((film) => allowed(film) && Number(state.progress[film.id]) > .3 && Number(state.progress[film.id]) < 7.7);
    $("#continue-section").hidden = !continued.length || view === "watchlist" || !!query;
    $("#continue-grid").innerHTML = continued.map((film) => card(film, true)).join("");
    document.querySelectorAll("[data-view]").forEach((button) =>
    {
        button.classList.toggle("active", button.dataset.view === view);
        if (button.dataset.view === view) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-genre]").forEach((button) =>
    {
        const active = button.dataset.genre === genre;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active);
    });
    syncSaves();
}
function save(film)
{
    if (state.saved.includes(film.id)) state.saved = state.saved.filter((id) => id !== film.id);
    else state.saved.push(film.id);
    persist();
    render();
    notify(state.saved.includes(film.id) ? `${film.title} added to your list` : `${film.title} removed from your list`);
}
function time(value)
{
    return `0:${String(Math.floor(Number.isFinite(value) ? value : 0)).padStart(2, "0")}`;
}
function updatePlayback()
{
    const playing = !video.paused && !video.ended;
    $("#play-pause").innerHTML = icon(playing ? "pause" : "play");
    $("#play-pause").setAttribute("aria-label", playing ? "Pause" : "Play");
    $("#big-play").hidden = playing;
}
async function togglePlayback()
{
    if (video.paused)
    {
        try
        {
            await video.play();
        }
        catch
        {
            notify("Playback could not start. Press Play to try again.");
        }
    }
    else video.pause();
}
async function openFilm(film)
{
    if (!allowed(film))
    {
        notify("This film is hidden in the All ages profile.");
        return;
    }
    if (!player.open) returnFocus = document.activeElement;
    video.pause();
    video.removeAttribute("src");
    video.load();
    current = film;
    const request = ++mediaRequest;
    video.poster = `assets/${film.id}.svg`;
    video.playbackRate = Number($("#speed").value);
    $("#seek").value = 0;
    $("#time").textContent = "0:00 / 0:08";
    $("#player-title").textContent = film.title;
    $("#player-description").textContent = film.description;
    $("#rating").value = String(state.ratings[film.id] || "");
    syncSaves();
    if (!player.open) player.showModal();
    updatePlayback();
    try
    {
        // Blob-backed local media remains seekable on static hosts without byte-range support.
        const response = await fetch(`assets/${film.id}.webm`);
        if (!response.ok) throw Error("Local film unavailable");
        const blob = await response.blob();
        if (request !== mediaRequest || !player.open) return;
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        mediaUrl = URL.createObjectURL(blob);
        video.src = mediaUrl;
        video.load();
    }
    catch
    {
        notify("The local film could not load. Please reload this page.");
    }
}
function closeFilm()
{
    mediaRequest++;
    video.pause();
    persist();
    player.close();
}
video.addEventListener("loadedmetadata", () =>
{
    $("#seek").max = Number.isFinite(video.duration) ? video.duration : 8;
    const progress = Number(state.progress[current.id]);
    if (progress > .3 && progress < 7.7) video.currentTime = Math.min(progress, 7.7);
});
video.addEventListener("timeupdate", () =>
{
    $("#seek").value = video.currentTime;
    $("#time").textContent = `${time(video.currentTime)} / ${time(Number.isFinite(video.duration) ? video.duration : 8)}`;
    if (current && video.readyState >= 1) state.progress[current.id] = video.currentTime;
});
video.addEventListener("play", updatePlayback);
video.addEventListener("pause", () =>
{
    updatePlayback();
    persist();
});
video.addEventListener("ended", () =>
{
    if (current) state.progress[current.id] = 8;
    persist();
    updatePlayback();
});
video.addEventListener("error", () => notify("The local film could not load. Please reload this page."));
player.addEventListener("close", () =>
{
    mediaRequest++;
    video.pause();
    persist();
    render();
    if (returnFocus?.isConnected) returnFocus.focus();
    else $("#hero-play").focus();
});
player.addEventListener("keydown", (event) =>
{
    if (["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return;
    if (event.code === "Space")
    {
        event.preventDefault();
        togglePlayback();
    }
    if (event.code === "ArrowRight" || event.code === "ArrowLeft")
    {
        event.preventDefault();
        video.currentTime = Math.max(0, Math.min(Number.isFinite(video.duration) ? video.duration : 8, video.currentTime + (event.code === "ArrowRight" ? 2 : -2)));
    }
});
document.addEventListener("click", (event) =>
{
    const playButton = event.target.closest("[data-play]");
    const saveButton = event.target.closest("[data-save]");
    if (playButton) openFilm(films.find((film) => film.id === playButton.dataset.play));
    if (saveButton)
    {
        const id = saveButton.dataset.save;
        save(films.find((film) => film.id === id));
        document.querySelector(`[data-save="${id}"]`)?.focus({ preventScroll: true });
    }
    const nav = event.target.closest("[data-view]");
    if (nav)
    {
        view = nav.dataset.view;
        query = "";
        genre = "All";
        $("#search").value = "";
        render();
        $("#discover").scrollIntoView({ behavior: "smooth" });
    }
    const filter = event.target.closest("[data-genre]");
    if (filter)
    {
        genre = filter.dataset.genre;
        render();
    }
});
$("#hero-play").onclick = () => openFilm(films[0]);
$("#hero-save").onclick = () => save(films[0]);
$("#player-save").onclick = () => save(current);
$("#player-close").onclick = closeFilm;
$("#play-pause").onclick = togglePlayback;
$("#big-play").onclick = togglePlayback;
video.onclick = togglePlayback;
$("#seek").oninput = (event) =>
{
    if (video.readyState >= 1) video.currentTime = Number(event.target.value);
};
$("#speed").onchange = (event) => video.playbackRate = Number(event.target.value);
$("#fullscreen").onclick = async () =>
{
    try
    {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await player.requestFullscreen();
    }
    catch
    {
        notify("Fullscreen is unavailable in this browser.");
    }
};
$("#rating").onchange = (event) =>
{
    state.ratings[current.id] = Number(event.target.value);
    persist();
    notify("Your rating is saved in this browser");
};
$("#next-film").onclick = () =>
{
    const next = films.slice(films.indexOf(current) + 1).concat(films).find(allowed);
    openFilm(next);
};
$("#clear-progress").onclick = () =>
{
    state.progress = {};
    persist();
    render();
    notify("Viewing history cleared");
};
$("#reset").onclick = () =>
{
    view = "home";
    genre = "All";
    query = "";
    $("#search").value = "";
    $("#suggestions").replaceChildren();
    render();
};
function searchPanel(open)
{
    $("#search-panel").hidden = !open;
    $("#search-toggle").setAttribute("aria-expanded", open);
    if (open) $("#search").focus();
    else
    {
        query = "";
        $("#search").value = "";
        $("#suggestions").replaceChildren();
        render();
        $("#search-toggle").focus();
    }
}
$("#search-toggle").onclick = () => searchPanel($("#search-panel").hidden);
$("#search-close").onclick = () => searchPanel(false);
$("#search").oninput = (event) =>
{
    query = event.target.value.trim().toLowerCase();
    render();
    const matches = query ? films.filter((film) => allowed(film) && `${film.title} ${film.genre} ${film.mood}`.toLowerCase().includes(query)) : [];
    $("#suggestions").innerHTML = matches.map((film) => `<button class="suggestion" data-play="${film.id}">${film.title}</button>`).join("");
};
$("#search").onkeydown = (event) =>
{
    if (event.key === "Escape") searchPanel(false);
    if (event.key === "ArrowDown")
    {
        event.preventDefault();
        $(".suggestion")?.focus();
    }
};
function showInfo(title, body)
{
    $("#info-title").textContent = title;
    $("#info-body").innerHTML = body;
    info.showModal();
}
$("#info-close").onclick = () => info.close();
$("#profile").onclick = () =>
{
    showInfo("Your space, your pace.", `<p>You're watching as <strong>Jamie</strong>, a local demo profile. No sign-in or account is created.</p><label><input id="family-mode" type="checkbox" ${state.family ? "checked" : ""}> All ages · show G-rated films only</label><p>This is a browser-only display filter, not secure parental authorization. Your list, ratings, and playback progress are stored on this device. Nothing syncs to other devices.</p><button class="button secondary" id="reset-data">Reset local viewing data</button>`);
    $("#family-mode").onchange = (event) =>
    {
        state.family = event.target.checked;
        persist();
        render();
        notify(state.family ? "All ages profile enabled" : "All films are now visible");
    };
    $("#reset-data").onclick = () =>
    {
        state.saved = [];
        state.progress = {};
        state.ratings = {};
        persist();
        render();
        notify("Local viewing data reset");
    };
};
$("#notifications").onclick = () => showInfo("Fresh in the frame", "<p><strong>Six little escapes, now playing.</strong><br>Explore our first collection of original animated micro-films.</p><p><strong>A quieter kind of cinema.</strong><br>Every film is silent, locally hosted, and ready to watch. These are sample catalog announcements, not live notifications.</p>");
const credits = () => showInfo("Small cinema. Honest details.", '<p>FRAME is a fictional streaming concept. All six 8-second films and their artwork are original, programmatically authored animations released under MIT. There are no commercial films, stock footage, or external media requests.</p><p>This homepage is a static HTML/CSS/JavaScript adaptation, not a production streaming service. The native custom-controlled player plays local 640 × 360 WebM files. Films are silent; there are no audio tracks, captions, HLS, transcoding, or DRM.</p><p>Search, genre filters, ratings, a watchlist, progress, and the all-ages profile run only in this browser. No real accounts, subscriptions, payments, uploads, AI recommendations, analytics, live streaming, or device sync are connected.</p><p>Prompt: Video streaming platform by KingLeoJr (2025), MIT. Icons: Lucide / Feather, ISC / MIT. See the included <a href="LICENSE.txt">license notices</a>.</p>');
$("#credits").onclick = credits;
$("#about").onclick = credits;
window.addEventListener("pagehide", persist);
render();
