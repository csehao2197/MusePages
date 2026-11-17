import { content as C } from "./content.js";

const U = C.ui;
const L = C.labels;
const app = document.querySelector("#app");
const dialog = document.querySelector("#dialog");
const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const timecode = (seconds) => `0:${String(Math.max(0, Math.floor(seconds || 0))).padStart(2, "0")}`;
let memory = {};
let storageAvailable = true;
try
{
    memory = JSON.parse(localStorage.getItem("rillcast-local-v1") || "{}") || {};
}
catch
{
    storageAvailable = false;
}
let saved = new Set(Array.isArray(memory.saved) ? memory.saved.filter((id) => C.videos.some((v) => v.id === id)) : []);
let followed = new Set(Array.isArray(memory.followed) ? memory.followed.filter((id) => C.videos.some((v) => v.handle === id)) : []);
let comments = Array.isArray(memory.comments) ? memory.comments.filter((item) =>
    item && C.videos.some((v) => v.id === item.video && Number.isFinite(item.time) && item.time >= 0 && item.time < v.duration) &&
    typeof item.text === "string" && item.text.length <= 100 && /^[\u0020-\u024f\u2000-\u206f]+$/.test(item.text) &&
    [L.thoughtful, L.questions, L.reaction].includes(item.kind)) : [];
let preferences =
{
    overlay: memory.preferences?.overlay !== false,
    sparse: memory.preferences?.sparse === true,
    filter: [L.all, L.thoughtful, L.questions, L.reaction, L.mine].includes(memory.preferences?.filter) ? memory.preferences.filter : L.all
};
let section = "discover";
let category = U.categories[0];
let query = "";
let sort = "trending";
let cleanup = () => {};
let toastTimer;
let currentVideo;
const playback = new Map();

function toast(message)
{
    const node = document.querySelector("#toast");
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("visible"), 3300);
}

function persist()
{
    memory = { saved: [...saved], followed: [...followed], comments, preferences };
    if (!storageAvailable) return;
    try
    {
        localStorage.setItem("rillcast-local-v1", JSON.stringify(memory));
    }
    catch
    {
        storageAvailable = false;
        toast(U.storageWarning);
    }
}

function modal(title, body, extra = "")
{
    dialog.innerHTML = `<h2 id="dialog-title">${escape(title)}</h2><p>${escape(body)}</p>${extra}<form method="dialog"><button class="action">${L.close}</button></form>`;
    dialog.showModal();
}

function header()
{
    return `<header class="topbar">
        <a class="brand" href="#/" aria-label="${C.brand} home"><img src="assets/mark.svg" alt="">${C.brand}</a>
        <form class="search" role="search">${icon("Search")}<label class="sr-only" for="search">${U.search}</label><input id="search" type="search" placeholder="${U.search}" value="${escape(query)}" autocomplete="off"><kbd>/</kbd></form>
        <div class="top-end"><span class="top-note"><i class="status-dot"></i>${L.local}</span>
        <button class="icon-button" data-about aria-label="${L.about}">${icon("CircleHelp")}</button>
        <button class="avatar icon-button" data-profile aria-label="${L.profile}">Y</button></div>
    </header>`;
}

function sidebar()
{
    return `<aside class="sidebar" aria-label="Main navigation">
        <button class="nav-item ${section === "discover" ? "active" : ""}" data-nav="discover">${icon("Compass")}${U.discover}</button>
        <div class="nav-label">${U.navGroup}</div>
        <button class="nav-item ${section === "saved" ? "active" : ""}" data-nav="saved">${icon("Bookmark")}${U.library}</button>
        <button class="nav-item ${section === "following" ? "active" : ""}" data-nav="following">${icon("Users")}${U.following}</button>
        <div class="side-card">${icon("MessagesSquare")}<strong>${U.collection}</strong><p>${U.collectionBody}</p>
        <button class="text-link" data-about>${L.learn}${icon("ArrowUpRight")}</button></div>
        <div class="side-footer">${L.sideFooter}<br><br>${C.tagline}</div>
    </aside>`;
}

function footer()
{
    return `<footer class="page-footer"><div><strong>${C.tagline}</strong>${U.footer}<br>${U.demo}</div>
        <div><button class="text-link" data-about>${L.footerAbout}${icon("ArrowUpRight")}</button><br>
        <a href="${U.creditUrl}" target="_blank" rel="noopener">${U.credit}</a> · <a href="LICENSE.txt">${L.license}</a></div></footer>`;
}

function avatar(video)
{
    return `<span class="avatar" style="background:${video.color}">${video.initials}</span>`;
}

function card(video)
{
    return `<article class="film-card" data-film="${video.id}"><a class="thumb" href="#/watch?id=${video.id}" aria-label="${L.watch || U.watch}: ${video.title}">
        <img src="assets/${video.id}.png" alt="${escape(video.description)}" loading="eager" width="960" height="540">
        <span class="hover-play">${icon("Play")}</span><span class="duration">${timecode(video.duration)}</span></a>
        <p class="card-kicker">${video.category.toUpperCase()}</p>
        <h3><a href="#/watch?id=${video.id}">${video.title}</a></h3>
        <div class="card-meta">${avatar(video)}<span>${video.creator}</span><span class="views" title="${L.views}">${video.views} views</span></div></article>`;
}

function home()
{
    const v = C.videos[0];
    return `<main id="main">
        <div class="intro"><div><p class="eyebrow">${U.eyebrow}</p><h1>${U.heading}</h1><p>${U.introduction}</p></div>
        <span class="edition">${icon("Sun")}${L.edition}</span></div>
        <section class="featured" aria-label="${U.featured}">
        <div class="hero"><div class="hero-copy"><p class="eyebrow">${icon("Sparkles")}${U.featured}</p>
        <h2>${v.title}</h2><p>${v.short}</p><a class="primary" href="#/watch">${icon("Play")}${U.watch}</a></div>
        <a class="hero-media" href="#/watch" aria-label="${U.watch}: ${v.title}">
        <img src="assets/city.png" width="960" height="540" alt="Original dawn city illustration: a salmon-colored sun, layered buildings and a train crossing the river.">
        <span class="floating-comment first">${L.movieComment}</span><span class="floating-comment second">${L.movieComment2}</span>
        <span class="hero-label">${L.original}</span><span class="duration">${timecode(v.duration)}</span></a></div>
        <div class="hero-meta"><span>${avatar(v)}${v.creator}<span class="tiny-dot">·</span>${v.category}<span class="tiny-dot">·</span><span title="${L.views}">${v.views} views</span></span><span>${icon("MessagesSquare")}${C.reactions.length} ${L.reactions}</span></div>
        </section>
        <section aria-labelledby="feed-title"><div class="feed-heading"><div><h2 id="feed-title">${U.feedTitle}</h2><p id="feed-subtitle">${U.feedSubtitle}</p></div>
        <label class="sort-wrap"><span>${L.sort}</span><select id="sort" aria-label="${L.sort}">
        <option value="trending">${L.trending}</option><option value="newest">${L.newest}</option><option value="title">${L.title}</option><option value="length">${L.length}</option></select></label></div>
        <div class="filters" role="group" aria-label="${L.filterLabel}">${U.categories.map((name, i) => `<button class="chip ${category === name ? "active" : ""}" aria-pressed="${category === name}" data-category="${i}">${i === 0 ? icon("LayoutGrid") : ""}${name}</button>`).join("")}</div>
        <div class="film-grid" id="feed"></div></section>${footer()}</main>`;
}

function refreshFeed()
{
    const normalized = query.toLowerCase().trim();
    const records = C.videos.filter((v) =>
        (!normalized || `${v.title} ${v.creator} ${v.category} ${v.description}`.toLowerCase().includes(normalized)) &&
        (category === U.categories[0] || category === v.category) &&
        (section !== "saved" || saved.has(v.id)) &&
        (section !== "following" || followed.has(v.handle)));
    records.sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) :
        sort === "length" ? a.duration - b.duration : sort === "newest" ? C.videos.indexOf(b) - C.videos.indexOf(a) : b.trend - a.trend);
    document.querySelector("#feed").innerHTML = records.length ? records.map(card).join("") :
        `<div class="empty">${icon("Search")}<h3>${U.empty}</h3><p>${section === "following" ? L.emptyFollowing : U.emptyBody}</p></div>`;
    document.querySelector("#feed-title").textContent = query ? L.searchResults :
        section === "saved" ? U.library : section === "following" ? U.following : U.feedTitle;
    document.querySelector("#feed-subtitle").textContent = query ? L.searchHint :
        section === "saved" ? L.saveHint : section === "following" ? L.followingHint : U.feedSubtitle;
    document.querySelector(".featured").hidden = section !== "discover" || Boolean(query);
    document.querySelector(".intro").hidden = section !== "discover" || Boolean(query);
    document.querySelectorAll("[data-category]").forEach((button) =>
    {
        const active = U.categories[Number(button.dataset.category)] === category;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active);
    });
    document.querySelectorAll("[data-nav]").forEach((button) =>
        button.classList.toggle("active", button.dataset.nav === section));
}

function allComments(v)
{
    return [...C.reactions.filter((r) => r.time < v.duration && (!r.cityOnly || v.id === "city")),
        ...comments.filter((r) => r.video === v.id)].sort((a, b) => a.time - b.time);
}

function filteredComments(v)
{
    return allComments(v).filter((r) => preferences.filter === L.all ||
        (preferences.filter === L.mine ? r.mine : r.kind === preferences.filter));
}

function watch(v)
{
    const count = allComments(v).length;
    return `<main class="watch-main" id="main"><a class="back" href="#/">${icon("ArrowLeft")}${L.back}</a>
        <div class="watch-layout"><section aria-labelledby="film-title">
        <div class="player" id="player" tabindex="0" role="region" aria-label="${v.title}. ${U.playerHint}">
        <div class="screen"><video id="film" playsinline preload="auto" poster="assets/${v.id}.png" data-source="assets/${v.file}" aria-label="${v.title} — ${L.original}"></video>
        <div class="overlay" id="overlay" role="presentation" aria-label="${U.overlayLabel}"></div>
        <button class="big-play" id="big-play" aria-label="${L.play}">${icon("Play")}</button></div>
        <div class="density" id="density" role="group" aria-label="${U.densityLabel}"></div>
        <div class="player-controls"><button id="play" aria-label="${L.play}">${icon("Play")}</button>
        <span class="clock"><span id="current-time">0:00</span> / ${timecode(v.duration)}</span>
        <input id="seek" aria-label="${L.seek}" type="range" min="0" max="${v.duration}" step="0.05" value="0">
        <button id="overlay-toggle" aria-label="${L.overlay}" aria-pressed="${preferences.overlay}">${icon("MessagesSquare")}</button></div>
        <div class="player-caption">${U.playerHint}</div></div>
        <p class="card-kicker">${v.category.toUpperCase()} / ${v.badge}</p><h1 class="watch-heading" id="film-title">${v.title}</h1>
        <div class="watch-stats"><span title="${L.views}">${v.views} views</span> · <span id="comment-count">${count}</span> comments · ${timecode(v.duration)} original film</div>
        <div class="actions"><button id="save" class="action" aria-pressed="${saved.has(v.id)}">${icon("Bookmark")}<span>${saved.has(v.id) ? L.saved : L.save}</span></button>
        <button id="share" class="action">${icon("Share2")}${L.share}</button></div><p class="description">${v.description}</p>
        <div class="uploader">${avatar(v)}<div><strong>${v.creator}</strong><p>${v.handle}<br>${v.role}</p></div>
        <button id="follow" class="action" aria-pressed="${followed.has(v.handle)}">${followed.has(v.handle) ? L.following : L.follow}</button></div>
        <p class="watch-notes">${L.originalNote}<br>${U.note}<br>${U.demo}</p></section>
        <aside class="conversation" aria-label="${U.comments}"><div class="conversation-header"><h2>${U.comments}</h2><p>${U.commentsBody}</p>
        <label class="sr-only" for="comment-filter">${L.type}</label><select id="comment-filter">${[L.all, L.thoughtful, L.reaction, L.questions, L.mine].map((label) => `<option ${label === preferences.filter ? "selected" : ""}>${label}</option>`).join("")}</select>
        <label class="preferences" for="sparse">${L.reduced}<input type="checkbox" id="sparse" ${preferences.sparse ? "checked" : ""}></label></div>
        <div id="comment-list" class="comment-list"></div>
        <form class="comment-form" id="comment-form"><label class="sr-only" for="comment-text">${U.commentPlaceholder}</label>
        <input id="comment-text" type="text" placeholder="${U.commentPlaceholder}" maxlength="100" required>
        <div class="comment-compose"><label class="sr-only" for="comment-kind">${L.composeType}</label><select id="comment-kind"><option>${L.thoughtful}</option><option>${L.reaction}</option><option>${L.questions}</option></select><button class="send" type="submit">${L.send} ${icon("Send")}</button></div>
        <small>${L.liveTime} <span id="comment-time">0:00</span>. ${U.localNote}</small></form></aside></div>
        <section aria-labelledby="related-title"><div class="feed-heading"><div><h2 id="related-title">${L.related}</h2><p>${L.relatedBody}</p></div></div>
        <div class="film-grid">${C.videos.filter((item) => item.id !== v.id).slice(0, 3).map(card).join("")}</div></section>${footer()}</main>`;
}

function setupPlayer(v)
{
    const video = document.querySelector("#film");
    currentVideo = video;
    let frame;
    let nodes = [];
    let lastPlaying = false;
    let lastTime = -1;
    let destroyed = false;
    let mediaUrl;
    const loading = new AbortController();
    const overlay = document.querySelector("#overlay");
    const seek = document.querySelector("#seek");
    const playButton = document.querySelector("#play");
    const bigPlay = document.querySelector("#big-play");
    playButton.disabled = true;
    bigPlay.disabled = true;
    // A fully local Blob keeps seeking reliable on static hosts without Range support.
    fetch(new URL(video.dataset.source, import.meta.url), { signal: loading.signal }).then(async (response) =>
    {
        if (!response.ok) throw Error(`Film response ${response.status}`);
        const blob = await response.blob();
        if (destroyed) return;
        mediaUrl = URL.createObjectURL(blob);
        video.src = mediaUrl;
        playButton.disabled = false;
        bigPlay.disabled = false;
    }).catch((error) =>
    {
        if (!destroyed && error.name !== "AbortError") toast(L.playerError);
    });
    const updatePlay = () =>
    {
        playButton.setAttribute("aria-label", video.ended ? L.replay : video.paused ? L.play : L.pause);
        playButton.innerHTML = icon(video.paused ? "Play" : "Pause");
        bigPlay.hidden = !video.paused;
        bigPlay.setAttribute("aria-label", video.ended ? L.replay : L.play);
    };
    const renderConversation = () =>
    {
        const records = filteredComments(v);
        document.querySelector("#comment-list").innerHTML = records.length ? records.map((r) =>
            `<div class="comment-row"><button data-seek="${r.time}" aria-label="${L.timestamp} ${timecode(r.time)}">${timecode(r.time)}</button><p><small>${r.mine ? L.you : L.viewer} · ${escape(r.kind)}</small>${escape(r.text)}</p></div>`).join("") : `<p class="watch-notes">${L.noComments}</p>`;
        document.querySelector("#comment-count").textContent = allComments(v).length;
        const bins = window.innerWidth <= 720 ? 6 : 16;
        const counts = Array.from({ length: bins }, (_, i) =>
            records.filter((r) => Math.floor(r.time / v.duration * bins) === i).length);
        const peak = Math.max(1, ...counts);
        const barHeight = window.innerWidth <= 720 ? 38 : 26;
        document.querySelector("#density").innerHTML = counts.map((count, i) =>
            `<button data-seek="${(i * v.duration / bins).toFixed(2)}" aria-label="${L.timestamp} ${timecode(i * v.duration / bins)} — ${count} comments" title="${count} comments"><span style="height:${Math.max(3, count / peak * barHeight)}px"></span></button>`).join("");
        overlay.replaceChildren();
        nodes = records.filter((_, i) => !preferences.sparse || i % 2 === 0).map((comment, i) =>
        {
            const node = document.createElement("span");
            node.className = `danmaku${comment.mine ? " mine" : ""}`;
            node.textContent = comment.text;
            node.style.color = comment.color || "#fff4ba";
            node.style.top = `${8 + i % (preferences.sparse ? 2 : 4) * 14}%`;
            node.hidden = true;
            overlay.append(node);
            return { comment, node };
        });
        lastTime = -1;
    };
    const draw = () =>
    {
        if (destroyed) return;
        const current = Math.min(video.currentTime || 0, v.duration);
        if (Math.abs(current - lastTime) > 0.003)
        {
            const width = overlay.clientWidth;
            nodes.forEach(({ comment, node }) =>
            {
                const age = current - comment.time;
                node.hidden = !preferences.overlay || age < 0 || age > 5.2;
                if (!node.hidden)
                {
                    node.style.transform = `translateX(${width - age / 5.2 * (width + node.offsetWidth)}px)`;
                }
            });
            seek.value = current;
            document.querySelector("#current-time").textContent = timecode(current);
            document.querySelector("#comment-time").textContent = timecode(current);
            lastTime = current;
        }
        if (lastPlaying !== !video.paused)
        {
            lastPlaying = !video.paused;
            updatePlay();
        }
        frame = requestAnimationFrame(draw);
    };
    const toggle = async () =>
    {
        if (!video.paused) video.pause();
        else
        {
            try
            {
                if (video.ended || video.currentTime >= v.duration - 0.15) video.currentTime = 0;
                await video.play();
            }
            catch
            {
                toast(L.playerError);
            }
        }
        updatePlay();
    };
    const jump = (value) =>
    {
        const position = Math.max(0, Math.min(v.duration - 0.08, Number(value)));
        video.currentTime = position;
        lastTime = -1;
    };
    const toggleOverlay = () =>
    {
        preferences.overlay = !preferences.overlay;
        document.querySelector("#overlay-toggle").setAttribute("aria-pressed", preferences.overlay);
        lastTime = -1;
        persist();
    };
    playButton.onclick = toggle;
    bigPlay.onclick = toggle;
    video.onclick = toggle;
    video.onended = updatePlay;
    video.onerror = () => toast(L.playerError);
    video.onloadedmetadata = () =>
    {
        if (playback.has(v.id)) jump(playback.get(v.id));
    };
    seek.oninput = () => jump(seek.value);
    document.querySelector("#player").onkeydown = (event) =>
    {
        if (event.target.matches("input, button, select")) return;
        if (event.code === "Space")
        {
            event.preventDefault();
            toggle();
        }
        else if (event.key === "ArrowRight" || event.key === "ArrowLeft")
        {
            event.preventDefault();
            jump(video.currentTime + (event.key === "ArrowRight" ? 5 : -5));
        }
        else if (event.key.toLowerCase() === "m") toggleOverlay();
    };
    document.querySelector("#overlay-toggle").onclick = toggleOverlay;
    document.querySelector("#comment-filter").onchange = (event) =>
    {
        preferences.filter = event.target.value;
        persist();
        renderConversation();
    };
    document.querySelector("#sparse").onchange = (event) =>
    {
        preferences.sparse = event.target.checked;
        persist();
        renderConversation();
    };
    document.querySelector("#comment-form").onsubmit = (event) =>
    {
        event.preventDefault();
        const input = document.querySelector("#comment-text");
        const text = input.value.trim();
        if (!text || !/^[\u0020-\u024f\u2000-\u206f]+$/.test(text))
        {
            input.setCustomValidity(L.invalid);
            input.reportValidity();
            return;
        }
        comments.push({ video: v.id, time: Math.min(video.currentTime, v.duration - 0.1), text,
            kind: document.querySelector("#comment-kind").value, mine: true, color: "#fff2bc" });
        preferences.overlay = true;
        preferences.filter = L.all;
        document.querySelector("#comment-filter").value = L.all;
        document.querySelector("#overlay-toggle").setAttribute("aria-pressed", "true");
        persist();
        input.value = "";
        renderConversation();
        toast(U.added);
    };
    document.querySelector("#comment-text").oninput = (event) => event.target.setCustomValidity("");
    document.querySelector("#main").addEventListener("click", (event) =>
    {
        const control = event.target.closest("[data-seek]");
        if (control) jump(control.dataset.seek);
    });
    document.querySelector("#save").onclick = (event) =>
    {
        const isSaved = !saved.has(v.id);
        if (isSaved) saved.add(v.id);
        else saved.delete(v.id);
        const button = event.currentTarget;
        button.setAttribute("aria-pressed", isSaved);
        button.querySelector("span").textContent = isSaved ? L.saved : L.save;
        persist();
        toast(isSaved ? U.saved : U.unsaved);
    };
    document.querySelector("#follow").onclick = (event) =>
    {
        const isFollowed = !followed.has(v.handle);
        if (isFollowed) followed.add(v.handle);
        else followed.delete(v.handle);
        event.currentTarget.setAttribute("aria-pressed", isFollowed);
        event.currentTarget.textContent = isFollowed ? L.following : L.follow;
        persist();
        toast(isFollowed ? U.followed : U.unfollowed);
    };
    document.querySelector("#share").onclick = async () =>
    {
        const url = new URL(location.href);
        url.hash = `/watch?id=${v.id}`;
        try
        {
            if (!navigator.clipboard?.writeText) throw Error("Clipboard unavailable");
            await navigator.clipboard.writeText(url.href);
            toast(U.shared);
        }
        catch
        {
            modal(L.shareTitle, `${L.shareBody} ${U.copyFallback}`, `<input aria-label="Film link" readonly value="${escape(url.href)}">`);
            dialog.querySelector("input").select();
        }
    };
    renderConversation();
    frame = requestAnimationFrame(draw);
    cleanup = () =>
    {
        destroyed = true;
        playback.set(v.id, video.currentTime);
        video.pause();
        video.removeAttribute("src");
        video.load();
        loading.abort();
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        cancelAnimationFrame(frame);
        currentVideo = null;
    };
}

function render()
{
    cleanup();
    cleanup = () => {};
    const route = location.hash.slice(1);
    const isWatch = route.startsWith("/watch");
    const id = new URLSearchParams(route.split("?")[1]).get("id");
    const v = C.videos.find((item) => item.id === id) || C.videos[0];
    app.innerHTML = `<a class="sr-only" href="#main">Skip to content</a>${header()}<div class="shell">${sidebar()}${isWatch ? watch(v) : home()}</div>`;
    document.title = isWatch ? `${v.title} — Rillcast` : L.homeTitle;
    document.querySelectorAll("[data-about]").forEach((button) => button.onclick = () => modal(U.about, U.aboutBody));
    document.querySelector("[data-profile]").onclick = () => modal(L.profile, `${U.aboutBody} ${L.privacy}`);
    const search = document.querySelector("#search");
    const find = () =>
    {
        query = search.value;
        section = "discover";
        category = U.categories[0];
        if (isWatch) location.hash = "/";
        else refreshFeed();
    };
    search.oninput = find;
    search.form.onsubmit = (event) =>
    {
        event.preventDefault();
        find();
        if (!isWatch) document.querySelector("#feed-title").scrollIntoView({ block: "nearest" });
    };
    document.querySelectorAll("[data-nav]").forEach((button) => button.onclick = () =>
    {
        section = button.dataset.nav;
        query = "";
        category = U.categories[0];
        search.value = "";
        if (isWatch) location.hash = "/";
        else refreshFeed();
    });
    if (isWatch) setupPlayer(v);
    else
    {
        document.querySelector("#sort").value = sort;
        document.querySelector("#sort").onchange = (event) =>
        {
            sort = event.target.value;
            refreshFeed();
        };
        document.querySelectorAll("[data-category]").forEach((button) => button.onclick = () =>
        {
            category = U.categories[Number(button.dataset.category)];
            refreshFeed();
        });
        refreshFeed();
    }
    window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("pagehide", () =>
{
    cleanup();
    clearTimeout(toastTimer);
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "/" && !event.target.matches("input, select, textarea") && !dialog.open)
    {
        event.preventDefault();
        document.querySelector("#search").focus();
    }
});
render();
if (!storageAvailable) toast(U.storageWarning);
