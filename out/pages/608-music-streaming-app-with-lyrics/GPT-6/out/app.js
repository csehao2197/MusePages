import { content as C, tracks, playlists, chart } from "./content.js";
import { icons } from "./icons.js";

const L = C.labels;
const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = name => icons[name] || icons.music;
const ids = tracks.map(track => track.id);
const trackById = id => tracks.find(track => track.id === id);
const key = `${C.slug}:v1`;
const initial = () => ({ current: ids[0], queue: [...ids], removed: [], saved: [], likes: [], comments: [] });
const baseCommentIds = tracks.flatMap(t => t.comments.map((_, i) => `${t.id}-${i}`));
let state = initial();
try
{
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && typeof stored === "object")
    {
        const validIds = values => Array.isArray(values) ? [...new Set(values.filter(id => ids.includes(id)))] : [];
        state.current = ids.includes(stored.current) ? stored.current : ids[0];
        state.queue = validIds(stored.queue);
        if (!state.queue.includes(state.current)) state.queue.unshift(state.current);
        state.removed = validIds(stored.removed);
        state.saved = Array.isArray(stored.saved) ? [...new Set(stored.saved.filter(id => playlists.some(p => p.id === id)))] : [];
        state.comments = Array.isArray(stored.comments) ? stored.comments.filter(note =>
            note && typeof note.id === "string" && note.id.startsWith("local-") && ids.includes(note.track) &&
            typeof note.body === "string" && note.body.trim().length > 0 && note.body.length <= 240
        ).slice(-200).filter((note, index, list) => list.findIndex(other => other.id === note.id) === index).map(note => ({ id: note.id, track: note.track, body: note.body })) : [];
        const knownNotes = [...baseCommentIds, ...state.comments.map(note => note.id)];
        state.likes = Array.isArray(stored.likes) ? [...new Set(stored.likes.filter(id => knownNotes.includes(id)))] : [];
    }
}
catch
{
    state = initial();
}

let lyricsEnabled = true;
let sort = "original";
let route = "/";
let toastTimer;
let raf;
let lastLine = -1;
let confirmAction;
let opener;
let audioRevision = 0;
let playbackWasActive = false;
let audioReady = Promise.resolve(false);
const audioFiles = new Map();
const audio = $("#audio");
const main = $("#main");
const queueDialog = $("#queue-dialog");
const confirmDialog = $("#confirm-dialog");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

function persist()
{
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
}

function toast(message)
{
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 1800);
}

function current() { return trackById(state.current); }
function upcoming() { return state.queue.slice(state.queue.indexOf(state.current) + 1); }
function cover(track, className = "", decorative = false)
{
    return `<img class="cover ${className}" src="./public/images/${track.file}.webp" alt="${decorative ? "" : escape(track.alt)}" width="320" height="320">`;
}
function button(action, label, name, extra = "", text = false)
{
    if (text && route === "/now-playing")
    {
        if (action === "add") label = L.addToQueue;
        if (action === "queue") label = L.openQueue;
    }
    return `<button type="button" class="${text ? "text-button" : "icon-button"}" data-action="${action}" aria-label="${escape(label)}" title="${escape(label)}" ${extra}>${icon(name)}${text ? `<span>${escape(label)}</span>` : ""}</button>`;
}
function collage(indices, className = "")
{
    return `<div class="collage ${indices.length === 2 ? "two" : ""} ${className}">${indices.map(i => cover(tracks[i])).join("")}</div>`;
}
function navLinks()
{
    return C.nav.map(([path, label, name]) => `<a href="#${path}" ${route === path ? 'aria-current="page"' : ""}>${icon(name)}<span>${label}</span>${route === path ? '<i class="nav-dot"></i>' : ""}</a>`).join("");
}
function savedButton(playlist, compact = false)
{
    const saved = state.saved.includes(playlist.id);
    return `<button class="${compact ? "icon-button" : "save-button"} ${saved ? "saved" : ""}" type="button" data-action="save" data-id="${playlist.id}" aria-pressed="${saved}" aria-label="${escape(saved ? L.saved : L.save)}" title="${escape(saved ? L.saved : L.save)}">${icon(saved ? "check" : "heart")}${compact ? "" : `<span>${saved ? L.saved : L.save}</span>`}</button>`;
}
function renderShell()
{
    $("#sidebar").innerHTML = `
        <a class="wordmark" href="#/"><img src="./public/images/mark.svg" alt="" width="34" height="34">${C.brand}<span>®</span></a>
        <div class="sidebar-body"><p class="eyebrow">${L.library}</p><nav aria-label="Primary navigation">${navLinks()}</nav>
        <div class="sidebar-divider"></div><p class="eyebrow">${L.collection}s</p>
        <div class="playlist-shortcuts">${playlists.map(p => `<button type="button" data-action="collection-view" data-id="${p.id}"><span class="shortcut-art">${cover(tracks[p.covers[0]], "", true)}</span><span>${p.title}<small>${p.ids.length} ${L.count}</small></span></button>`).join("")}</div>
        <div class="sidebar-note">${icon("disc")}<span>${C.tagline}</span></div></div>
        <div class="sidebar-footer"><div class="local-indicator"><i></i>${L.local}</div><button type="button" class="reset-button" data-action="reset">${icon("reset")}${L.reset}</button><a href="${C.credit.url}" target="_blank" rel="noreferrer">${C.credit.label}${icon("arrow")}</a></div>`;
    $("#mobile-nav").innerHTML = navLinks();
    $("#topbar").innerHTML = `<a class="mobile-wordmark" href="#/"><img src="./public/images/mark.svg" alt="" width="30" height="30">${C.brand}</a>
        <div class="search-wrap"><label class="search-field">${icon("search")}<input type="search" id="search" autocomplete="off" placeholder="${L.search}" aria-label="${L.search}" aria-controls="search-results" aria-expanded="false"><span class="search-hint">/</span></label><div id="search-results" hidden></div></div>
        <div class="topbar-right"><span class="topbar-note">${C.tagline}</span><button type="button" data-action="queue" class="queue-button">${icon("queue")}<span>${L.queue}</span><b data-queue-count>${upcoming().length}</b></button></div>`;
    $("#search").addEventListener("input", renderSearch);
    $("#search").addEventListener("keydown", event =>
    {
        if (event.key === "Escape")
        {
            event.target.value = "";
            renderSearch();
        }
        if (event.key === "ArrowDown" && !$("#search-results").hidden)
        {
            event.preventDefault();
            $("#search-results button")?.focus();
        }
    });
}
function renderSearch()
{
    const query = $("#search").value.trim().toLowerCase();
    const box = $("#search-results");
    $("#search").setAttribute("aria-expanded", String(Boolean(query)));
    if (!query)
    {
        box.hidden = true;
        return;
    }
    const found = tracks.filter(t => `${t.title} ${t.artist} ${C.mood}`.toLowerCase().includes(query)).slice(0, 6);
    const collections = playlists.filter(p => p.title.toLowerCase().includes(query)).slice(0, 6 - found.length);
    box.innerHTML = `${found.length ? `<p class="eyebrow">${L.resultTracks}</p>${found.map(t => `<button type="button" data-action="search-track" data-id="${t.id}">${cover(t, "", true)}<span>${t.title}<small>${t.artist}</small></span>${icon("arrow")}</button>`).join("")}` : ""}
        ${collections.length ? `<p class="eyebrow">${L.resultPlaylists}</p>${collections.map(p => `<button type="button" data-action="collection-view" data-id="${p.id}">${icon("disc")}<span>${p.title}</span>${icon("arrow")}</button>`).join("")}` : ""}
        ${!found.length && !collections.length ? `<p>${L.noResults}</p>` : ""}`;
    box.hidden = false;
}
function renderPlayer()
{
    const t = current();
    $("#player").innerHTML = `<a class="player-track" href="#/now-playing">${cover(t, "", true)}<span><strong data-player-title>${t.title}</strong><small data-player-artist>${t.artist}</small></span>${icon("chevron")}</a>
        <div class="player-center"><div class="transport">${button("previous", L.previous, "previous")}${button("toggle", L.play, "play", "data-toggle")}${button("next", L.next, "next")}</div>
        <div class="player-progress"><span class="mono" data-time>0:00</span><input type="range" min="0" max="18" step="0.05" value="0" data-seek aria-label="${L.seek}"><span class="mono">0:18</span></div></div>
        <div class="player-right">${button("mute", L.mute, "volume", "data-mute")}<input type="range" min="0" max="1" step="0.05" value="${audio.volume}" data-volume aria-label="${L.volume}">${button("queue", L.queue, "queue")}</div>
        <div class="mobile-player-actions">${button("toggle", L.play, "play", "data-toggle")}${button("expand", L.expand, "arrow")}${button("queue", L.queue, "queue")}</div>`;
    syncPlayback();
}
function playlistActions(p, hero = false)
{
    return `<button type="button" class="${hero ? "primary" : "play-collection"}" data-action="playlist" data-id="${p.id}">${icon("play")}<span>${hero ? L.playlist : L.play}</span></button>
        ${hero ? `<button type="button" class="secondary" data-action="playlist-add" data-id="${p.id}">${icon("add")}<span>${L.addAll}</span></button>` : button("playlist-add", L.playlistQueue, "add", `data-id="${p.id}"`)}
        ${savedButton(p, !hero)}`;
}
function trackRows(order = ids, isChart = false)
{
    return `<div class="track-table ${isChart ? "chart-table" : ""}"><div class="table-labels"><span>#</span><span></span><span>${L.resultTracks}</span><span>${isChart ? L.sample : L.comments}</span>${isChart ? `<span>${L.editorial}</span>` : ""}<span>${L.preview}</span><span></span></div>
    ${order.map((id, i) =>
    {
        const t = trackById(id);
        const count = t.comments.length + state.comments.filter(note => note.track === id).length;
        return `<article class="track-row ${id === state.current ? "current" : ""}" data-track-row="${id}">
            <span class="rank mono">${String(i + 1).padStart(2, "0")}<span class="equalizer"><i></i><i></i><i></i></span></span>${cover(t, "", true)}
            <div class="track-name"><strong>${t.title}</strong><small>${t.artist}</small></div><span class="track-meta mono">${isChart ? `${t.plays.toLocaleString("en-US")}<small>${L.sample}</small>` : `${icon("comment")}${String(count).padStart(2, "0")}`}</span>
            ${isChart ? `<span class="movement mono">${t.movement}</span>` : ""}<span class="duration mono">0:18</span>
            <div class="track-actions">${button("track-play", L.play, "play", `data-id="${id}"`, true)}${button("add", L.add, "add", `data-id="${id}"`, true)}${button("lyrics", L.lyrics, "disc", `data-id="${id}"`, true)}</div>
        </article>`;
    }).join("")}</div>`;
}
function localNote()
{
    return `<section class="local-note"><div>${icon("music")}<h2>${C.noteTitle}</h2><p>${C.note}</p></div><div class="note-actions"><a class="text-link" href="#/now-playing">${L.read}${icon("arrow")}</a><button type="button" class="text-button" data-action="reset">${icon("reset")}${L.reset}</button></div></section>`;
}
function renderLibrary()
{
    main.innerHTML = `<div class="page-heading"><div><p class="eyebrow">${C.brand} / ${L.library}</p><h2 class="page-label">${L.subtitle}</h2></div><span class="mono catalog-count">VOL. 01 <i></i> 06 ORIGINALS</span></div>
        <section class="featured" id="featured"><div class="featured-copy"><div class="eyebrow"><span class="small-line"></span>${C.mood}</div><p class="mix-label">${L.originalMix}</p><h1 tabindex="-1">${C.featured}</h1><p class="feature-intro">${C.intro}</p><p class="featured-tagline">${C.tagline}</p><div class="hero-actions">${playlistActions(playlists[0], true)}</div><p class="hero-footnote mono">${L.sixNote}</p></div>
        <div class="featured-art">${collage(playlists[0].covers)}<span class="art-corner top-left"></span><span class="art-corner bottom-right"></span><span class="edition mono">${L.edition}</span></div></section>
        <section class="collections"><div class="section-heading"><div><p class="eyebrow">${L.nextChapter}</p><h2>${L.collections}</h2></div><span>${L.collectionDetail}</span></div>
        <div class="playlist-grid">${playlists.map((p, index) => `<article class="playlist-card" id="${p.id}">${collage(p.covers)}<div class="playlist-copy"><p class="eyebrow">${L.collection} ${String(index + 1).padStart(2, "0")} <span>${p.ids.length} ${L.count}</span></p><h3>${p.title}</h3><p>${p.description}</p><div class="card-actions">${playlistActions(p)}</div></div></article>`).join("")}</div></section>
        <section class="catalog"><div class="section-heading"><div><p class="eyebrow">${L.catalogLabel}</p><h2>${L.tracks}</h2></div><span class="mono">06 / 06</span></div>${trackRows()}</section>${localNote()}`;
}
function renderCharts()
{
    main.innerHTML = `<section class="chart-heading"><p class="eyebrow">${C.brand} ${L.comments}</p><h1 tabindex="-1">${L.chartTitle}</h1><div><p>${L.chartCopy}</p><button class="primary" data-action="chart-play" type="button">${icon("play")}${L.chartPlay}</button></div></section>
        <div class="chart-podium">${chart.slice(0, 3).map((id, i) =>
        {
            const t = trackById(id);
            return `<button type="button" data-action="chart-track" data-id="${id}" class="podium-card">${cover(t)}<span class="podium-rank mono">${String(i + 1).padStart(2, "0")}</span><span class="podium-label"><strong>${t.title}</strong><small>${t.artist} · ${t.plays.toLocaleString("en-US")} ${L.sample.toLowerCase()}</small></span><span class="podium-play">${icon("play")}</span></button>`;
        }).join("")}</div>
        <section class="catalog"><div class="section-heading"><h2>${L.allTracks}</h2>${button("chart-info", L.info, "info")}</div>${trackRows(chart, true)}</section>
        <section class="listening-guide"><div class="panel"><p class="eyebrow">${L.queue}</p><h2>${L.upNext}</h2><div id="queue-preview"></div><div class="inline-actions"><button class="secondary" type="button" data-action="queue">${L.queue}</button><button type="button" class="text-button" data-action="clear">${L.clear}</button></div></div>
        <div class="panel"><p class="eyebrow">${C.tagline}</p><h2>${L.guide}</h2><ol>${L.steps.map(text => `<li>${text}</li>`).join("")}</ol><button type="button" class="text-button" data-action="reset">${icon("reset")}${L.reset}</button></div></section>${localNote()}`;
    renderQueuePreview();
}
function soundControls()
{
    return `<details class="sound"><summary>${icon("volume")}${L.sound}</summary><div>${button("mute", L.mute, "volume", "data-mute")}<input type="range" min="0" max="1" step="0.05" value="${audio.volume}" data-volume aria-label="${L.volume}"></div></details>`;
}
function renderNowPlaying()
{
    const t = current();
    main.innerHTML = `<div class="now-heading"><a href="#/">${L.stagePath}</a><button type="button" class="secondary lyric-toggle" data-action="toggle-lyrics" aria-pressed="${lyricsEnabled}">${icon("disc")}${lyricsEnabled ? L.lyricsOn : L.lyricsOff}</button></div>
        <section class="now-stage"><div class="vinyl-column"><p class="eyebrow">${L.now} / ${L.instrumental}</p><div class="vinyl"><span class="vinyl-shine"></span><div class="vinyl-label">${cover(t, "", true)}</div><i class="spindle"></i></div><div class="stage-title"><h1 tabindex="-1">${t.title}</h1><p>${t.artist}</p></div><p class="source-note">${C.source}</p></div>
        <div class="lyrics-column"><div id="lyrics-panel"></div><div class="stage-controls"><div class="transport">${button("previous", L.previous, "previous")}${button("toggle", L.play, "play", "data-toggle")}${button("next", L.next, "next")}</div><div class="stage-seek"><span class="mono" data-time>0:00</span><input type="range" min="0" max="18" step="0.05" value="${audio.currentTime}" data-seek aria-label="${L.seek}"><span class="mono">0:18</span></div><div class="stage-actions">${soundControls()}${button("add", L.add, "add", `data-id="${t.id}"`, true)}${button("queue", L.queue, "queue", "", true)}</div></div></div></section>
        <section class="listener-section"><div class="section-heading"><div><p class="eyebrow">${C.brand} / ${L.comments}</p><h2>${L.comments} <span id="comment-count"></span></h2></div><label class="sort-label"><select id="sort" aria-label="Sort listener notes"><option value="original">${L.originalOrder}</option><option value="likes">${L.mostLiked}</option></select></label></div>
        <div class="comments-layout"><div id="comments"></div><details class="composer" open><summary>${L.write}${icon("comment")}</summary><form id="comment-form"><label for="comment-body">${L.guest}</label><textarea id="comment-body" rows="5" maxlength="240" placeholder="${L.placeholder}" required></textarea><div class="composer-count mono"><span id="character-count">0</span> / 240</div><p>${L.localNote}</p><p class="form-error" id="comment-error" aria-live="polite"></p><button type="submit" class="primary">${L.publish}${icon("send")}</button></form></details></div></section>`;
    renderLyrics();
    renderComments();
    $("#sort").value = sort;
    $("#sort").addEventListener("change", event => { sort = event.target.value; renderComments(); });
    $("#comment-body").addEventListener("input", event =>
    {
        $("#character-count").textContent = event.target.value.length;
        $("#comment-error").textContent = "";
    });
    $("#comment-form").addEventListener("submit", event =>
    {
        event.preventDefault();
        const body = $("#comment-body").value.trim();
        if (!body || body.length > 240)
        {
            $("#comment-error").textContent = L.invalid;
            return;
        }
        state.comments.push({ id: `local-${crypto.randomUUID()}`, track: state.current, body });
        persist();
        $("#comment-body").value = "";
        $("#character-count").textContent = "0";
        renderComments();
        toast(L.noteToast);
    });
    syncPlayback();
    updateProgress();
}
function renderLyrics()
{
    if (!$("#lyrics-panel")) return;
    $("#lyrics-panel").innerHTML = lyricsEnabled ? `<div class="lyric-label eyebrow"><span class="small-line"></span>${L.lyrics} <span class="mono">01 — 06</span></div><div class="lyrics" aria-label="${L.lyrics}">${current().lyrics.map((line, i) => `<button type="button" class="lyric" data-action="lyric" data-index="${i}" data-start="${i * 3}" aria-label="${L.lyricStart} 0:${String(i * 3).padStart(2, "0")}: ${escape(line)}"><span class="mono">0:${String(i * 3).padStart(2, "0")}</span><span>${escape(line)}</span></button>`).join("")}</div>` :
        `<div class="lyrics-off">${cover(current())}<h2>${current().title}</h2><p>${L.offCopy}</p><button type="button" class="secondary" data-action="toggle-lyrics">${L.lyricsOn}</button></div>`;
    lastLine = -1;
    updateProgress(true);
}
function avatar(index)
{
    const colors = [["#d6a78f", "#574255"], ["#aca6bb", "#474453"], ["#afbdab", "#46534d"]];
    const [light, dark] = colors[index % colors.length];
    return `<svg class="avatar" viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" rx="14" fill="${dark}"/><path d="M7 44v-8c0-12 30-12 30 0v8" fill="${light}"/><path d="M15 12q7-7 14 0v10q-7 8-14 0z" fill="${light}"/></svg>`;
}
function renderComments()
{
    if (!$("#comments")) return;
    let notes = current().comments.map(([name, body, likes], i) => ({ id: `${state.current}-${i}`, name, body, likes, local: false }));
    notes.push(...state.comments.filter(note => note.track === state.current).map(note => ({ ...note, name: L.guest, likes: 0, local: true })));
    if (sort === "likes") notes = notes.sort((a, b) => b.likes + Number(state.likes.includes(b.id)) - a.likes - Number(state.likes.includes(a.id)));
    $("#comment-count").textContent = String(notes.length).padStart(2, "0");
    $("#comments").innerHTML = notes.map((note, i) => `<article class="comment" data-note="${note.id}">${avatar(i)}<div><strong>${escape(note.name)}</strong>${note.local ? `<small class="local-post">${L.posted}</small>` : ""}<p>${escape(note.body)}</p>${note.local ? button("delete-comment", L.delete, "remove", `data-id="${note.id}"`, true) : ""}</div><button type="button" class="like ${state.likes.includes(note.id) ? "liked" : ""}" data-action="like" data-id="${note.id}" aria-pressed="${state.likes.includes(note.id)}" aria-label="Like note by ${escape(note.name)}">${icon("heart")}<span>${note.likes + Number(state.likes.includes(note.id))}</span></button></article>`).join("");
}
function renderView(focus = false)
{
    if (route === "/charts") renderCharts();
    else if (route === "/now-playing") renderNowPlaying();
    else renderLibrary();
    for (const nav of [$("#sidebar nav"), $("#mobile-nav")]) nav.innerHTML = navLinks();
    document.title = `${C.brand} · ${route === "/now-playing" ? `${current().title} · ` : ""}${C.tagline}`;
    main.classList.remove("view-enter");
    void main.offsetWidth;
    main.classList.add("view-enter");
    if (focus)
    {
        main.querySelector("h1")?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
    }
    syncPlayback();
}
function setRoute()
{
    let next = location.hash.slice(1) || "/";
    if (!C.nav.some(([path]) => path === next))
    {
        history.replaceState(null, "", "#/");
        next = "/";
    }
    const changed = route !== next;
    route = next;
    renderView(changed);
}
function updateCounts()
{
    all("[data-queue-count]").forEach(node => { node.textContent = upcoming().length; });
    renderQueuePreview();
}
function renderQueuePreview()
{
    const el = $("#queue-preview");
    if (el) el.innerHTML = upcoming().slice(0, 3).map((id, i) => `<p><span class="mono">${String(i + 1).padStart(2, "0")}</span>${escape(trackById(id).title)}</p>`).join("") || `<p>${L.empty}</p>`;
}
function renderQueue()
{
    const focusKey = queueDialog.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
    queueDialog.innerHTML = `<div class="drawer-header"><div><p class="eyebrow">${C.brand} / ${L.queue}</p><h2 id="queue-title">${L.queueTitle}</h2></div>${button("close-queue", L.close, "close")}</div><p class="drawer-description">${L.queueDescription}</p>
        <p class="eyebrow">${L.queueCurrent}</p><div class="current-queue">${cover(current(), "", true)}<div><strong>${current().title}</strong><small>${current().artist}</small></div>${icon("disc")}</div>
        <div class="queue-list"><p class="eyebrow">${L.upNext} <span>${upcoming().length}</span></p>${upcoming().length ? upcoming().map((id, i, list) =>
        {
            const t = trackById(id);
            return `<article class="queue-row">${cover(t, "", true)}<div class="queue-identity"><button type="button" data-action="queue-select" data-id="${id}" data-focus="select-${id}">${t.title}</button><small>${t.artist}</small><span class="mono">0:18</span></div><div class="queue-row-actions">
                ${button("queue-up", L.moveUp, "up", `data-id="${id}" data-focus="up-${id}" ${i === 0 ? "disabled" : ""}`)}
                ${button("queue-down", L.moveDown, "down", `data-id="${id}" data-focus="down-${id}" ${i === list.length - 1 ? "disabled" : ""}`)}
                ${button("queue-remove", L.remove, "remove", `data-id="${id}" data-focus="remove-${id}"`)}
                <button type="button" class="play-next" data-action="queue-next" data-id="${id}" data-focus="next-${id}">${L.playNext}</button></div></article>`;
        }).join("") : `<div class="queue-empty">${icon("queue")}<p>${L.empty}</p><a href="#/" data-action="browse">${L.browse}</a></div>`}</div>
        <div class="drawer-footer"><button type="button" class="secondary" data-action="clear" ${upcoming().length ? "" : "disabled"}>${L.clear}</button><button type="button" class="primary" data-action="restore">${icon("add")}${L.restore}</button></div>`;
    if (focusKey)
    {
        const target = all("#queue-dialog [data-focus]").find(node => node.dataset.focus === focusKey && !node.disabled);
        (target || queueDialog.querySelector('[data-action="close-queue"]')).focus();
    }
}
function openQueue()
{
    opener = document.activeElement;
    renderQueue();
    if (!queueDialog.open) queueDialog.showModal();
    queueDialog.querySelector('[data-action="close-queue"]').focus();
}
function confirm(title, copy, action, info = false)
{
    confirmAction = action;
    confirmDialog.innerHTML = `<h2 id="confirm-title">${title}</h2><p>${copy}</p><div class="inline-actions"><button type="button" class="secondary" data-action="cancel-confirm">${info ? L.close : L.cancel}</button>${info ? "" : `<button type="button" class="primary" data-action="confirm">${L.confirm}</button>`}</div>`;
    confirmDialog.showModal();
}
function loadTrack(id)
{
    audioRevision++;
    playbackWasActive = false;
    audio.pause();
    state.current = id;
    prepareAudio();
    persist();
    lastLine = -1;
    renderPlayer();
    if (route === "/now-playing") renderView();
    else
    {
        all("[data-track-row]").forEach(row => row.classList.toggle("current", row.dataset.trackRow === id));
    }
    if (queueDialog.open) renderQueue();
    updateCounts();
    document.title = `${C.brand} · ${route === "/now-playing" ? `${current().title} · ` : ""}${C.tagline}`;
}
async function play()
{
    const revision = audioRevision;
    try
    {
        if (!await audioReady || revision !== audioRevision) return;
        if (audio.ended || audio.currentTime >= 17.99) audio.currentTime = 0;
        await audio.play();
        if (revision !== audioRevision) return;
        toast(`${L.play}: ${current().title}`);
    }
    catch (error)
    {
        if (error.name !== "AbortError") toast(L.audioError);
    }
}
function prepareAudio()
{
    const revision = audioRevision;
    const source = `./public/audio/${current().file}.wav`;
    audio.dataset.source = source;
    if (!audioFiles.has(source))
    {
        audioFiles.set(source, fetch(source).then(response =>
        {
            if (!response.ok) throw Error(L.audioError);
            return response.blob();
        }).then(blob => URL.createObjectURL(new Blob([blob], { type: "audio/wav" }))));
    }
    // A complete local Blob stays seekable even on static hosts without byte-range support.
    audioReady = audioFiles.get(source).then(url =>
    {
        if (revision !== audioRevision) return false;
        audio.src = url;
        audio.load();
        return true;
    }).catch(() =>
    {
        toast(L.audioError);
        return false;
    });
}
function select(id, start = false, order)
{
    if (order)
    {
        state.queue = [id, ...order.filter(value => value !== id)];
        state.removed = state.removed.filter(value => !state.queue.includes(value));
    }
    else if (!state.queue.includes(id))
    {
        state.queue.splice(state.queue.indexOf(state.current) + 1, 0, id);
        state.removed = state.removed.filter(value => value !== id);
    }
    if (id !== state.current || order) loadTrack(id);
    else if (!start) audio.pause();
    persist();
    updateCounts();
    if (start) void play();
    else toast(L.currentToast);
}
function append(values)
{
    for (const id of values)
    {
        if (!state.queue.includes(id)) state.queue.push(id);
        state.removed = state.removed.filter(value => value !== id);
    }
    persist();
    updateCounts();
    if (queueDialog.open) renderQueue();
    toast(L.addedToast);
}
function advance(automatic = false)
{
    const next = upcoming()[0];
    if (!next) return;
    loadTrack(next);
    if (automatic) void play();
}
function syncPlayback()
{
    const playing = !audio.paused && !audio.ended;
    document.body.classList.toggle("playing", playing);
    document.body.classList.toggle("document-hidden", document.hidden);
    all("[data-toggle]").forEach(node =>
    {
        const label = playing ? L.pause : audio.ended ? L.replay : L.play;
        node.innerHTML = icon(playing ? "pause" : "play");
        node.setAttribute("aria-label", label);
        node.setAttribute("title", label);
        node.setAttribute("aria-pressed", String(playing));
    });
    all("[data-mute]").forEach(node =>
    {
        node.innerHTML = icon(audio.muted ? "mute" : "volume");
        node.setAttribute("aria-label", audio.muted ? L.unmute : L.mute);
        node.setAttribute("aria-pressed", String(audio.muted));
    });
    all("[data-volume]").forEach(node => { node.value = audio.volume; });
    updateProgress();
}
function updateProgress(immediate = false)
{
    const time = Math.min(18, Math.max(0, audio.currentTime || 0));
    all("[data-time]").forEach(node => { node.textContent = `0:${String(Math.floor(time)).padStart(2, "0")}`; });
    all("[data-seek]").forEach(node =>
    {
        if (document.activeElement !== node) node.value = time;
        node.style.setProperty("--fill", `${Number(node.value) / 18 * 100}%`);
    });
    const active = Math.min(5, Math.floor(time / 3));
    if (active !== lastLine && $(".lyrics"))
    {
        lastLine = active;
        all(".lyric").forEach((line, i) =>
        {
            line.classList.toggle("active", i === active);
            if (i === active) line.setAttribute("aria-current", "true");
            else line.removeAttribute("aria-current");
        });
        const viewport = $(".lyrics");
        const line = viewport.children[active];
        viewport.scrollTo({ top: line.offsetTop - viewport.offsetTop - viewport.clientHeight / 2 + line.clientHeight / 2, behavior: immediate || audio.paused || audio.ended || reduced.matches ? "instant" : "smooth" });
    }
}
function frame()
{
    updateProgress();
    if (!audio.paused && !document.hidden) raf = requestAnimationFrame(frame);
}
function seek(time)
{
    if (audio.readyState >= 1)
    {
        audio.currentTime = Math.min(18, Math.max(0, time));
        lastLine = -1;
        updateProgress(true);
    }
}

document.addEventListener("click", event =>
{
    if (event.target.closest(".skip"))
    {
        event.preventDefault();
        main.focus();
        main.scrollIntoView({ block: "start" });
        return;
    }
    const node = event.target.closest("[data-action]");
    if (!node) return;
    const { action, id } = node.dataset;
    switch (action)
    {
        case "toggle": audio.paused ? void play() : audio.pause(); break;
        case "previous":
        {
            if (audio.currentTime > 2) seek(0);
            else
            {
                const previous = state.queue[state.queue.indexOf(state.current) - 1];
                if (previous) select(previous);
                else seek(0);
            }
            break;
        }
        case "next": advance(); break;
        case "mute": audio.muted = !audio.muted; syncPlayback(); break;
        case "queue": openQueue(); break;
        case "close-queue": queueDialog.close(); break;
        case "expand": location.hash = "/now-playing"; break;
        case "playlist":
        {
            const p = playlists.find(p => p.id === id);
            select(p.ids[0], true, p.ids);
            break;
        }
        case "playlist-add": append(playlists.find(p => p.id === id).ids); break;
        case "track-play": select(id, true, ids); break;
        case "chart-track": select(id, true, chart); location.hash = "/now-playing"; break;
        case "chart-play": select(chart[0], true, chart); break;
        case "lyrics":
        case "search-track":
            select(id); location.hash = "/now-playing"; $("#search").value = ""; renderSearch(); break;
        case "collection-view":
            location.hash = "/";
            $("#search").value = "";
            renderSearch();
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "center" }), 40);
            break;
        case "add": append([id]); break;
        case "save":
        {
            const saved = state.saved.includes(id);
            state.saved = saved ? state.saved.filter(value => value !== id) : [...state.saved, id];
            persist();
            all(`[data-action="save"][data-id="${id}"]`).forEach(button =>
            {
                button.classList.toggle("saved", !saved);
                button.setAttribute("aria-pressed", String(!saved));
                button.setAttribute("aria-label", saved ? L.save : L.saved);
                button.innerHTML = icon(saved ? "heart" : "check") + (button.classList.contains("save-button") ? `<span>${saved ? L.save : L.saved}</span>` : "");
            });
            toast(saved ? L.unsavedToast : L.savedToast);
            break;
        }
        case "lyric": seek(Number(node.dataset.start)); break;
        case "toggle-lyrics": lyricsEnabled = !lyricsEnabled; renderNowPlaying(); break;
        case "like":
            state.likes = state.likes.includes(id) ? state.likes.filter(value => value !== id) : [...state.likes, id];
            persist(); renderComments();
            all('[data-action="like"]').find(button => button.dataset.id === id)?.focus({ preventScroll: true });
            toast(L.likeToast); break;
        case "delete-comment":
            state.comments = state.comments.filter(note => note.id !== id);
            state.likes = state.likes.filter(value => value !== id);
            persist(); renderComments(); $("#comment-body")?.focus({ preventScroll: true }); toast(L.deleteToast); break;
        case "queue-select": select(id); break;
        case "queue-up":
        case "queue-down":
        {
            const index = state.queue.indexOf(id);
            const other = index + (action === "queue-up" ? -1 : 1);
            if (other > state.queue.indexOf(state.current) && other < state.queue.length) [state.queue[index], state.queue[other]] = [state.queue[other], state.queue[index]];
            persist(); renderQueue(); updateCounts(); toast(L.queueToast); break;
        }
        case "queue-next":
            state.queue = state.queue.filter(value => value !== id);
            state.queue.splice(state.queue.indexOf(state.current) + 1, 0, id);
            persist(); renderQueue(); updateCounts(); toast(L.queueToast); break;
        case "queue-remove":
            state.queue = state.queue.filter(value => value !== id);
            if (!state.removed.includes(id)) state.removed.push(id);
            persist(); renderQueue(); updateCounts(); toast(L.queueToast); break;
        case "restore": append(chart); break;
        case "clear":
            confirm(L.clearTitle, L.clearCopy, () =>
            {
                state.removed = [...new Set([...state.removed, ...upcoming()])];
                state.queue = state.queue.slice(0, state.queue.indexOf(state.current) + 1);
                persist(); updateCounts(); if (queueDialog.open) renderQueue(); toast(L.clearToast);
            }); break;
        case "reset":
            confirm(L.resetTitle, L.resetCopy, () =>
            {
                state = initial(); persist(); loadTrack(state.current); renderView(); toast(L.resetToast);
            }); break;
        case "chart-info": confirm(L.info, L.chartInfo, null, true); break;
        case "confirm": confirmDialog.close(); confirmAction?.(); break;
        case "cancel-confirm": confirmDialog.close(); break;
        case "browse": queueDialog.close(); break;
    }
});
document.addEventListener("input", event =>
{
    if (event.target.matches("[data-seek]")) seek(Number(event.target.value));
    if (event.target.matches("[data-volume]"))
    {
        audio.volume = Number(event.target.value);
        audio.muted = false;
        syncPlayback();
    }
});
document.addEventListener("keydown", event =>
{
    if (event.key === "/" && !event.target.matches("input,textarea,select") && !queueDialog.open && !confirmDialog.open)
    {
        event.preventDefault();
        $("#search").focus();
    }
    if (event.code === "Space" && event.target === document.body && !queueDialog.open && !confirmDialog.open)
    {
        event.preventDefault();
        audio.paused ? void play() : audio.pause();
    }
});
for (const dialog of [queueDialog, confirmDialog])
{
    dialog.addEventListener("click", event =>
    {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
}
queueDialog.addEventListener("close", () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
audio.addEventListener("play", () =>
{
    playbackWasActive = true;
    cancelAnimationFrame(raf);
    syncPlayback();
    raf = requestAnimationFrame(frame);
});
audio.addEventListener("pause", () =>
{
    if (!audio.ended) playbackWasActive = false;
    cancelAnimationFrame(raf);
    syncPlayback();
});
audio.addEventListener("timeupdate", () => updateProgress());
audio.addEventListener("seeked", () => updateProgress(true));
audio.addEventListener("loadedmetadata", () => updateProgress(true));
audio.addEventListener("ended", () =>
{
    cancelAnimationFrame(raf);
    if (playbackWasActive && audio.ended && upcoming().length) advance(true);
    else syncPlayback();
});
audio.addEventListener("error", () => toast(L.audioError));
document.addEventListener("visibilitychange", () =>
{
    document.body.classList.toggle("document-hidden", document.hidden);
    cancelAnimationFrame(raf);
    if (!document.hidden && !audio.paused) raf = requestAnimationFrame(frame);
});
window.addEventListener("hashchange", setRoute);
audio.volume = 0.65;
prepareAudio();
renderShell();
renderPlayer();
setRoute();
