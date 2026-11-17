import { content } from "./content.js";
import { icons } from "./icons.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => icons[name] || "";
const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const feed = $("#feed");
const drawer = $("#drawer");
const blankState = () => ({ likes: [], saves: [], follows: [], comments: {} });
let state = blankState();
let storageAvailable = true;
try
{
    const saved = JSON.parse(localStorage.getItem(content.storageKey) || "null");
    if (saved && typeof saved === "object")
    {
        for (const key of ["likes", "saves", "follows"])
        {
            if (Array.isArray(saved[key]))
            {
                state[key] = [...new Set(saved[key].filter((value) => typeof value === "string"))];
            }
        }
        if (saved.comments && typeof saved.comments === "object" && !Array.isArray(saved.comments))
        {
            for (const story of content.stories)
            {
                if (Array.isArray(saved.comments[story.id]))
                {
                    state.comments[story.id] = saved.comments[story.id].filter((text) => typeof text === "string").slice(-100);
                }
            }
        }
    }
}
catch
{
    storageAvailable = false;
}
let activeIndex = 0;
let visible = [];
let currentRoute = "";
let topic = content.topics[0];
let soundOn = false;
let audio;
let oscillators = [];
let toastTimer;
let observer;
let lastFocus;
let resumeAfterDialog = false;
let localVideo;
const mediaCache = new Map();
let profileTab = "stories";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const creator = (id) => content.creators.find((item) => item.id === id) || content.creators[0];
const count = (number) => number >= 1000 ? `${(number / 1000).toFixed(1)}k` : String(number);

function hydrate(root = document)
{
    $$("[data-icon]", root).forEach((element) => element.innerHTML = icon(element.dataset.icon));
}

function toast(message)
{
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3200);
}

function persist()
{
    try
    {
        localStorage.setItem(content.storageKey, JSON.stringify(state));
    }
    catch
    {
        storageAvailable = false;
        toast("Browser storage unavailable. Changes last for this visit only.");
    }
}

function toggleList(key, id)
{
    state[key] = state[key].includes(id) ? state[key].filter((value) => value !== id) : [...state[key], id];
    persist();
}

function avatar(person)
{
    return `<span class="avatar" style="background:${person.color}">${escape(person.initials)}</span>`;
}

function renderCreators()
{
    $("#creators").innerHTML = content.creators.map((person) => `<div class="creator-row">
        <button data-profile="${person.id}" aria-label="View ${person.name}">${avatar(person)}<span><strong>${person.name}</strong><small>@${person.handle}</small></span></button>
        <button class="follow-small" data-follow="${person.id}" aria-pressed="${state.follows.includes(person.id)}">${state.follows.includes(person.id) ? "Following" : "Follow"}</button>
    </div>`).join("");
}

function renderTopics()
{
    $("#topics").innerHTML = content.topics.map((item) => `<button data-topic="${item}" aria-pressed="${item === topic}">${item}</button>`).join("");
}

function renderStory(story, index)
{
    const person = creator(story.creator);
    const liked = state.likes.includes(story.id);
    const saved = state.saves.includes(story.id);
    return `<article class="story" data-story="${story.id}" aria-label="${escape(story.title)}" aria-posinset="${index + 1}" aria-setsize="${visible.length}">
        <video playsinline muted loop preload="auto" poster="./assets/${story.url ? "sun-room" : story.id}.png" data-src="${story.url || `./assets/${story.id}.webm`}" aria-label="${escape(story.title)} ${story.url ? "Your local video" : "Original animated video"}"></video>
        <div class="story-top"><span class="story-category">${escape(story.category.toUpperCase())}</span><button class="sound-toggle" aria-label="Turn ambient sound ${soundOn ? "off" : "on"}" aria-pressed="${soundOn}" data-action="sound">${icon(soundOn ? "Volume2" : "VolumeX")}</button></div>
        <span class="scene-type">${story.url ? "YOUR LOCAL PREVIEW" : "A HEARTHLINE ORIGINAL"}</span>
        <div class="play-center">${icon("Play")}</div>
        <div class="story-content">
            <div class="creator-line"><button class="creator-link" data-profile="${person.id}">${avatar(person)}<span class="creator-name">${person.name}<small>@${person.handle}</small></span></button><button class="follow-button" data-follow="${person.id}" aria-pressed="${state.follows.includes(person.id)}">${state.follows.includes(person.id) ? "Following" : "+ Follow"}</button></div>
            <h2 class="story-title">${escape(story.title)}</h2>
            <p class="story-caption">${escape(story.caption)}</p><span class="story-tag"># ${escape(story.tag)}</span>
        </div>
        <div class="story-actions">
            <button class="action" data-action="like" aria-label="Like story" aria-pressed="${liked}">${icon("Heart")}<small>${count(story.likes + Number(liked))}</small></button>
            <button class="action" data-action="comments" aria-label="Open comments">${icon("MessageCircle")}<small>${story.comments + (state.comments[story.id]?.length || 0)}</small></button>
            <button class="action" data-action="save" aria-label="Save story" aria-pressed="${saved}">${icon("Bookmark")}<small>${count(story.saves + Number(saved))}</small></button>
            <button class="action" data-action="share" aria-label="Share story">${icon("Send")}<small>Share</small></button>
        </div>
        <div class="playback"><button class="play-toggle" data-action="play" aria-label="Pause video">${icon("Pause")}</button><span class="timecode">0:00 / 0:05</span><input type="range" class="progress" value="0" min="0" max="100" step="0.1" aria-label="Seek video"><span class="loop-label">${icon("Repeat2")} LOOP</span></div>
    </article>`;
}

function updateAudio()
{
    oscillators.forEach((oscillator) => oscillator.stop());
    oscillators = [];
    if (!audio)
    {
        return;
    }
    const video = $(".story.active video", feed);
    if (!soundOn || document.hidden || !video || video.paused || drawer.open)
    {
        audio.suspend().catch(() => {});
        return;
    }
    audio.resume().catch(() => {});
    const story = visible[activeIndex];
    story.notes.forEach((frequency, index) =>
    {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.value = index ? .009 : .014;
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        oscillators.push(oscillator);
    });
}

function setSound()
{
    soundOn = !soundOn;
    if (soundOn && !audio)
    {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio)
        {
            soundOn = false;
            toast("Ambient sound is not supported in this browser.");
            return;
        }
        audio = new Audio();
    }
    $$('[data-action="sound"]').forEach((button) =>
    {
        button.innerHTML = icon(soundOn ? "Volume2" : "VolumeX");
        button.setAttribute("aria-label", `Turn ambient sound ${soundOn ? "off" : "on"}`);
        button.setAttribute("aria-pressed", String(soundOn));
    });
    updateAudio();
    toast(soundOn ? "A little ambient sound. Press M to mute." : "Sound off. A little quiet.");
}

function syncPlayback(article, video)
{
    article.classList.toggle("paused", video.paused);
    const button = $('[data-action="play"]', article);
    button.innerHTML = icon(video.paused ? "Play" : "Pause");
    button.setAttribute("aria-label", `${video.paused ? "Play" : "Pause"} video`);
    if (article.classList.contains("active"))
    {
        updateAudio();
    }
}

function activate(index, autoplay = true)
{
    activeIndex = Math.max(0, Math.min(index, visible.length - 1));
    $$(".story", feed).forEach((article, current) =>
    {
        article.classList.toggle("active", current === activeIndex);
        const video = $("video", article);
        if (current === activeIndex && autoplay && !document.hidden && !drawer.open && !reducedMotion)
        {
            video.play().catch(() => syncPlayback(article, video));
        }
        else
        {
            video.pause();
        }
        syncPlayback(article, video);
    });
    $("#story-position").textContent = `${String(visible.length ? activeIndex + 1 : 0).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    $("#previous").disabled = activeIndex <= 0;
    $("#next").disabled = activeIndex >= visible.length - 1;
    updateAudio();
}

function go(index)
{
    const bounded = Math.max(0, Math.min(index, visible.length - 1));
    const article = $$(".story", feed)[bounded];
    if (article)
    {
        feed.scrollTo({ top: article.offsetTop - feed.offsetTop, behavior: reducedMotion ? "instant" : "smooth" });
    }
}

function togglePlay()
{
    const video = $(".story.active video", feed);
    if (!video)
    {
        return;
    }
    if (video.paused)
    {
        video.play().catch(() => toast("This browser could not play the video."));
    }
    else
    {
        video.pause();
    }
}

function filteredStories()
{
    let stories = [...content.stories, ...(localVideo ? [localVideo] : [])];
    if (currentRoute === "following")
    {
        stories = stories.filter((story) => state.follows.includes(story.creator));
    }
    if (currentRoute === "saved")
    {
        stories = stories.filter((story) => state.saves.includes(story.id));
    }
    if (topic !== content.topics[0])
    {
        stories = stories.filter((story) => story.category === topic);
    }
    const query = $("#search").value.trim().toLowerCase();
    return stories.filter((story) => `${story.title} ${story.caption} ${story.tag} ${story.category} ${creator(story.creator).name}`.toLowerCase().includes(query));
}

function renderFeed(storyId)
{
    observer?.disconnect();
    $$("video", feed).forEach((video) => video.pause());
    visible = filteredStories();
    $("#feed-label").textContent = currentRoute === "following" ? "FROM THE PEOPLE YOU FOLLOW" : currentRoute === "saved" ? "WORTH A SECOND LOOK" : topic === "All stories" ? "A FEW THINGS WORTH NOTICING" : topic.toUpperCase();
    if (!visible.length)
    {
        const type = $("#search").value || topic !== "All stories" ? "Search" : currentRoute === "following" ? "Following" : "Saved";
        feed.innerHTML = `<div class="empty-state">${icon(type === "Saved" ? "Bookmark" : "Sparkles")}<h2>${content.labels[`empty${type}`]}</h2><p>${content.labels[`empty${type}Description`]}</p><button class="primary" data-reset>Explore all stories</button></div>`;
        activate(0, false);
        return;
    }
    feed.innerHTML = visible.map(renderStory).join("");
    $$(".story", feed).forEach((article) =>
    {
        const video = $("video", article);
        video.addEventListener("play", () => syncPlayback(article, video));
        video.addEventListener("pause", () => syncPlayback(article, video));
        video.addEventListener("timeupdate", () =>
        {
            if (!Number.isFinite(video.duration))
            {
                return;
            }
            $(".progress", article).value = String(video.currentTime / video.duration * 100);
            $(".timecode", article).textContent = `0:${String(Math.floor(video.currentTime)).padStart(2, "0")} / 0:${String(Math.floor(video.duration)).padStart(2, "0")}`;
        });
        video.addEventListener("error", () => toast("This video could not load. Try another story."));
        $(".progress", article).addEventListener("input", (event) =>
        {
            if (Number.isFinite(video.duration))
            {
                video.currentTime = Number(event.target.value) / 100 * video.duration;
            }
        });
        const source = video.dataset.src;
        if (!mediaCache.has(source))
        {
            // Whole-file blobs support seeking even on simple static hosts
            // that do not implement HTTP byte-range responses.
            mediaCache.set(source, source.startsWith("blob:") ? Promise.resolve(source) : fetch(source).then((response) =>
            {
                if (!response.ok)
                {
                    throw Error("Video unavailable");
                }
                return response.blob();
            }).then((blob) => URL.createObjectURL(blob)));
        }
        mediaCache.get(source).then((url) =>
        {
            if (!video.isConnected)
            {
                return;
            }
            video.src = url;
            if (article.classList.contains("active") && !reducedMotion && !drawer.open && !document.hidden)
            {
                video.play().catch(() => syncPlayback(article, video));
            }
        }).catch(() => toast("This video could not load. Try another story."));
    });
    activeIndex = Math.max(0, visible.findIndex((story) => story.id === storyId));
    feed.scrollTop = activeIndex * feed.clientHeight;
    activate(activeIndex);
    observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting && entry.intersectionRatio >= .65)
            {
                const index = visible.findIndex((story) => story.id === entry.target.dataset.story);
                if (index !== activeIndex)
                {
                    activate(index);
                }
            }
        });
    }, { root: feed, threshold: .65 });
    $$(".story", feed).forEach((article) => observer.observe(article));
}

function openDialog(title, html)
{
    lastFocus = document.activeElement;
    const video = $(".story.active video", feed);
    resumeAfterDialog = !!video && !video.paused;
    video?.pause();
    $("#dialog-title").textContent = title;
    $("#dialog-content").innerHTML = html;
    drawer.showModal();
    updateAudio();
}

function openComments(story)
{
    const added = state.comments[story.id] || [];
    const comments = [...content.seeds, ...added.map((text) => ({ name: "You", initials: "Y", text, time: "Just now · local" }))];
    openDialog(`A little conversation`, `<p class="local-note">Demo conversation · your comments stay in this browser. The feed count is illustrative.</p>
        <div class="comments-list">${comments.map((comment) => `<div class="comment"><span class="avatar">${comment.initials}</span><div><strong>${comment.name}</strong><time>${comment.time}</time><p>${escape(comment.text)}</p></div></div>`).join("")}</div>
        <form id="comment-form"><input aria-label="Your comment" placeholder="${content.labels.commentPlaceholder}" maxlength="300" required autocomplete="off"><button class="primary" type="submit">Post</button></form>`);
    $("#comment-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const text = $("#comment-form input").value.trim();
        if (!text)
        {
            return;
        }
        state.comments[story.id] = [...(state.comments[story.id] || []), text].slice(-100);
        persist();
        const item = document.createElement("div");
        item.className = "comment";
        item.innerHTML = `<span class="avatar">Y</span><div><strong>You</strong><time>Just now · local</time><p>${escape(text)}</p></div>`;
        $(".comments-list").append(item);
        item.scrollIntoView({ block: "nearest" });
        $("#comment-form").reset();
        const article = $(`[data-story="${story.id}"]`, feed);
        if (article)
        {
            $('[data-action="comments"] small', article).textContent = story.comments + state.comments[story.id].length;
        }
        toast("Your little note is saved in this browser.");
    });
}

async function share(story)
{
    if (story.url)
    {
        toast("Local previews cannot be shared. Nothing has been uploaded.");
        return;
    }
    const url = new URL("index.html", location.href);
    url.searchParams.set("story", story.id);
    try
    {
        if (!navigator.clipboard?.writeText)
        {
            throw Error("Clipboard unavailable");
        }
        await navigator.clipboard.writeText(url.href);
        toast("Story link copied. Pass a little wonder along.");
    }
    catch
    {
        const textarea = document.createElement("textarea");
        textarea.value = url.href;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (copied)
        {
            toast("Story link copied.");
        }
        else
        {
            openDialog("Share a little wonder", `<p>Copy this local story link:</p><input aria-label="Story link" value="${escape(url.href)}" readonly style="width:100%;padding:12px">`);
        }
    }
}

function renderProfile(personId)
{
    const own = !personId;
    const person = own ? { name: "Your little corner", handle: "you", initials: "Y", color: "#7d8c65", bio: content.labels.accountDescription } : creator(personId);
    const stories = profileTab === "saved" ? content.stories.filter((story) => state.saves.includes(story.id)) : own ? content.stories : content.stories.filter((story) => story.creator === person.id);
    $("#profile-view").innerHTML = `<div class="profile-hero">${avatar(person)}<div><h1>${person.name}</h1><small>@${person.handle} · ${own ? "Local demo profile" : "Fictional creator · original collection"}</small><p>${person.bio}</p>${own ? "" : `<button class="primary follow-small" data-follow="${person.id}" aria-pressed="${state.follows.includes(person.id)}">${state.follows.includes(person.id) ? "Following" : "Follow creator"}</button>`}</div></div>
        <div class="profile-tabs"><button data-profile-tab="stories" class="${profileTab === "stories" ? "active" : ""}">${own ? "The collection" : "Stories"}</button><button data-profile-tab="saved" class="${profileTab === "saved" ? "active" : ""}">Your saved stories (${state.saves.length})</button></div>
        <div class="media-grid">${stories.map((story) => `<button class="media-card" data-open-story="${story.id}" aria-label="Watch ${escape(story.title)}"><img src="./assets/${story.id}.png" alt="Original animated ${story.category.toLowerCase()} scene"><span>${escape(story.title)}</span></button>`).join("")}</div>${!stories.length ? `<div class="empty-state"><h2>${content.labels.emptySaved}</h2><p>${content.labels.emptySavedDescription}</p><a class="primary" href="#/">Explore stories</a></div>` : ""}`;
}

function route(storyId)
{
    const path = location.hash.slice(2).split("/");
    currentRoute = ["following", "saved", "profile"].includes(path[0]) ? path[0] : "home";
    $$("[data-nav]").forEach((link) =>
    {
        const active = link.dataset.nav === currentRoute;
        link.classList.toggle("active", active);
        active ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
    });
    $$("[data-tab]").forEach((link) => link.classList.toggle("active", link.dataset.tab === currentRoute));
    const isProfile = currentRoute === "profile";
    $("#feed-layout").hidden = isProfile;
    $("#profile-view").hidden = !isProfile;
    if (isProfile)
    {
        $$("video", feed).forEach((video) => video.pause());
        updateAudio();
        renderProfile(path[1]);
    }
    else
    {
        renderFeed(storyId || new URLSearchParams(location.search).get("story"));
    }
}

document.addEventListener("click", async (event) =>
{
    const follow = event.target.closest("[data-follow]");
    if (follow)
    {
        const id = follow.dataset.follow;
        toggleList("follows", id);
        $$(`[data-follow="${id}"]`).forEach((button) =>
        {
            button.setAttribute("aria-pressed", String(state.follows.includes(id)));
            button.textContent = state.follows.includes(id) ? "Following" : button.classList.contains("follow-button") ? "+ Follow" : "Follow";
        });
        if (currentRoute === "following")
        {
            renderFeed();
        }
        toast(state.follows.includes(id) ? `Following ${creator(id).name} in this browser.` : "Creator unfollowed.");
        return;
    }
    const profile = event.target.closest("[data-profile]");
    if (profile)
    {
        profileTab = "stories";
        location.hash = `/profile/${profile.dataset.profile}`;
        if (drawer.open)
        {
            drawer.close();
        }
        return;
    }
    const topicButton = event.target.closest("[data-topic]");
    if (topicButton)
    {
        topic = topicButton.dataset.topic;
        renderTopics();
        renderFeed();
        return;
    }
    const info = event.target.closest("[data-info]");
    if (info)
    {
        const text = content.info[info.dataset.info];
        openDialog(text.title, `<p>${text.text}</p>`);
        return;
    }
    const reset = event.target.closest("[data-reset]");
    if (reset)
    {
        topic = "All stories";
        $("#search").value = "";
        renderTopics();
        if (location.hash === "#/" || !location.hash)
        {
            route();
        }
        else
        {
            location.hash = "/";
        }
        return;
    }
    const tab = event.target.closest("[data-profile-tab]");
    if (tab)
    {
        profileTab = tab.dataset.profileTab;
        renderProfile(location.hash.split("/")[2]);
        return;
    }
    const open = event.target.closest("[data-open-story]");
    if (open)
    {
        topic = "All stories";
        $("#search").value = "";
        history.replaceState(null, "", `${location.pathname}?story=${open.dataset.openStory}#/`);
        renderTopics();
        route(open.dataset.openStory);
        return;
    }
    const article = event.target.closest(".story");
    if (!article)
    {
        return;
    }
    const story = visible.find((item) => item.id === article.dataset.story);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (event.target.tagName === "VIDEO" || action === "play")
    {
        togglePlay();
    }
    else if (action === "like" || action === "save")
    {
        const key = action === "like" ? "likes" : "saves";
        toggleList(key, story.id);
        const button = $(`[data-action="${action}"]`, article);
        const pressed = state[key].includes(story.id);
        button.setAttribute("aria-pressed", String(pressed));
        $("small", button).textContent = count(story[key] + Number(pressed));
        if (action === "save")
        {
            toast(pressed ? "A little wonder, saved for later." : "Story removed from saved.");
            if (currentRoute === "saved" && !pressed)
            {
                renderFeed();
            }
        }
    }
    else if (action === "comments")
    {
        openComments(story);
    }
    else if (action === "share")
    {
        await share(story);
    }
    else if (action === "sound")
    {
        setSound();
    }
});

$("#next").addEventListener("click", () => go(activeIndex + 1));
$("#previous").addEventListener("click", () => go(activeIndex - 1));
$("#search").addEventListener("input", () =>
{
    if (currentRoute === "profile")
    {
        location.hash = "/";
    }
    else
    {
        renderFeed();
    }
});
$("#mobile-search").addEventListener("click", () =>
{
    $(".topbar").classList.toggle("search-open");
    if ($(".topbar").classList.contains("search-open"))
    {
        $("#search").focus();
    }
});
$("#close-dialog").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (event) =>
{
    if (event.target === drawer)
    {
        const bounds = drawer.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        {
            drawer.close();
        }
    }
});
drawer.addEventListener("close", () =>
{
    if (resumeAfterDialog && currentRoute !== "profile" && !document.hidden)
    {
        $(".story.active video", feed)?.play().catch(() => {});
    }
    lastFocus?.isConnected && lastFocus.focus({ preventScroll: true });
    updateAudio();
});
$("#account").addEventListener("click", () => openDialog("Your little corner", `<p>${content.labels.accountDescription}</p><p class="local-note">${storageAvailable ? "Browser-only storage is available." : "Browser storage is unavailable; changes last for this visit."}</p><button class="primary" id="view-account">View your profile</button>`));
$("#dialog-content").addEventListener("click", (event) =>
{
    if (event.target.id === "view-account")
    {
        drawer.close();
        location.hash = "/profile";
    }
    if (event.target.id === "choose-video")
    {
        $("#upload").click();
    }
});
function createStory()
{
    openDialog("Make a little something", `<p>${content.labels.createDescription}</p><p class="local-note">MP4 or WebM · up to 30 MB · no account or server</p><button class="primary" id="choose-video">Choose your video</button>`);
}
$("#create").addEventListener("click", createStory);
$("#mobile-create").addEventListener("click", createStory);
$("#upload").addEventListener("change", (event) =>
{
    const file = event.target.files[0];
    if (!file)
    {
        return;
    }
    if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 30 * 1024 * 1024)
    {
        toast("Choose an MP4 or WebM under 30 MB.");
        event.target.value = "";
        return;
    }
    if (localVideo)
    {
        URL.revokeObjectURL(localVideo.url);
    }
    localVideo = { ...content.stories[0], id: "your-preview", title: "Your own little moment.", caption: file.name, tag: "Only on this device", likes: 0, comments: 0, saves: 0, url: URL.createObjectURL(file) };
    topic = "All stories";
    $("#search").value = "";
    history.replaceState(null, "", `${location.pathname}#/`);
    drawer.close();
    renderTopics();
    route("your-preview");
    toast("Your video is ready. Local preview only — nothing uploaded.");
});
$("#see-creators").addEventListener("click", () =>
{
    openDialog("People to pause with", `<p class="local-note">Three fictional creators. Six original motion stories.</p>${content.creators.map((person) => `<div class="creator-row"><button data-profile="${person.id}">${avatar(person)}<span><strong>${person.name}</strong><small>@${person.handle}</small></span></button><button class="follow-small" data-follow="${person.id}" aria-pressed="${state.follows.includes(person.id)}">${state.follows.includes(person.id) ? "Following" : "Follow"}</button></div>`).join("")}`);
});
document.addEventListener("keydown", (event) =>
{
    if (["INPUT", "TEXTAREA"].includes(event.target.tagName) || drawer.open || event.ctrlKey || event.metaKey || event.altKey)
    {
        return;
    }
    if (event.key === "/")
    {
        event.preventDefault();
        if (innerWidth <= 700)
        {
            $(".topbar").classList.add("search-open");
        }
        $("#search").focus();
        return;
    }
    if (currentRoute === "profile")
    {
        return;
    }
    if (["ArrowDown", "j", "ArrowUp", "k"].includes(event.key))
    {
        event.preventDefault();
        go(activeIndex + (["ArrowDown", "j"].includes(event.key) ? 1 : -1));
    }
    if (event.code === "Space" && !event.target.closest("button, a"))
    {
        event.preventDefault();
        togglePlay();
    }
    if (event.key.toLowerCase() === "m")
    {
        setSound();
    }
    if (event.key.toLowerCase() === "l")
    {
        $('.story.active [data-action="like"]', feed)?.click();
    }
});
let visibleBeforeHidden = false;
document.addEventListener("visibilitychange", () =>
{
    const video = $(".story.active video", feed);
    if (document.hidden)
    {
        visibleBeforeHidden = !!video && !video.paused;
        video?.pause();
    }
    else if (visibleBeforeHidden && !drawer.open && currentRoute !== "profile")
    {
        video?.play().catch(() => {});
    }
    updateAudio();
});
window.addEventListener("hashchange", () =>
{
    profileTab = "stories";
    route();
});
window.addEventListener("resize", () =>
{
    if (currentRoute !== "profile" && visible.length)
    {
        feed.scrollTop = activeIndex * feed.clientHeight;
    }
});
window.addEventListener("pagehide", () =>
{
    audio?.close().catch(() => {});
    mediaCache.forEach((url) => url.then((value) => URL.revokeObjectURL(value)).catch(() => {}));
    if (localVideo)
    {
        URL.revokeObjectURL(localVideo.url);
    }
});
hydrate();
renderCreators();
renderTopics();
route();
