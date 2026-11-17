import { show, hosts, guests, topics, episodes, copy, ui } from "./content.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name, extra = "") => `<svg class="icon ${extra}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><use href="${show.icons}#${name}"></use></svg>`;
const arrow = () => icon("ArrowRight");
const link = (episode) => `${show.links.episode}?slug=${episode.slug}`;
const person = (episode) => guests.find((guest) => guest.id === episode.guest);
const portrait = (profile, className = "") => `<img class="${className}" src="${profile.image}" alt="${profile.alt}" loading="lazy" width="480" height="600">`;
const mark = `<svg class="mark" aria-hidden="true" viewBox="0 0 32 32"><path d="M7 12v8M16 5v22M25 9v14" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`;
const wordmark = `<a class="wordmark" href="${show.links.home}" aria-label="${show.brand} ${ui.homeLabel}">${mark}<span>${show.brand.replace(" & ", " <i>&amp;</i> ")}</span></a>`;
const activePage = location.pathname.endsWith("/episodes.html") ? "episodes" : location.pathname.endsWith("/episode.html") ? "episode" : location.pathname.endsWith("/guests.html") ? "guests" : "home";

function cover(episode, className = "")
{
    const palette = ["#7A2E2A", "#A8B4A0", "#E56B45", "#1D1B18"];
    const color = palette[episode.number % palette.length];
    const pattern = episode.number % 4;
    const shapes =
    [
        `<circle cx="105" cy="86" r="64" fill="none" stroke="${color}" stroke-width="24"/><path d="M0 162h210M0 176h210M0 190h210" stroke="#1D1B18" opacity=".22"/><circle cx="105" cy="86" r="14" fill="#E56B45"/>`,
        `<path d="M22 146V72a78 78 0 0 1 156 0v74M48 146V76a52 52 0 0 1 104 0v70M74 146V80a26 26 0 0 1 52 0v66" fill="none" stroke="${color}" stroke-width="13"/><circle cx="160" cy="165" r="16" fill="#E56B45"/>`,
        `<path d="M20 110h170M20 75h170M20 145h170M55 25v165M90 25v165M125 25v165M160 25v165" stroke="${color}" stroke-width="1.2"/><circle cx="107" cy="100" r="56" fill="${color}"/><path d="M65 100h84M107 58v84" stroke="#F4F0E8" stroke-width="3"/>`,
        [25, 45, 70, 38, 90, 60, 110, 74, 42, 64].map((height, index) => `<rect x="${18 + index * 18}" y="${103 - height / 2}" width="10" height="${height}" rx="5" fill="${color}"/>`).join("")
    ];
    return `<svg class="cover ${className}" aria-label="${ui.coverAlt} ${episode.number}" role="img" viewBox="0 0 210 210"><rect width="210" height="210" fill="#E8E3D7"/>${shapes[pattern]}<text x="16" y="195" font-family="monospace" font-size="16" fill="#1D1B18">${episode.number}</text></svg>`;
}

function navigation(footer = false)
{
    return copy.nav.map(([label, key]) => `<a href="${show.links[key]}" ${!footer && (activePage === key || (activePage === "episode" && key === "episodes")) ? 'aria-current="page"' : ""}>${label}</a>`).join("");
}

function header()
{
    return `<header class="site-header"><div class="container header-inner">${wordmark}<button class="menu-button" aria-expanded="false" aria-controls="primary-nav">${icon("Menu")}<span>${ui.menu}</span></button><nav id="primary-nav" aria-label="${ui.mainNavigation}">${navigation()}<a class="button dark small" href="${show.links.subscribe}">${ui.subscribe}${arrow()}</a></nav></div></header>`;
}

function footer()
{
    return `<footer class="site-footer"><div class="container footer-grid"><div>${wordmark}<p class="footer-tagline">${show.tagline}</p><p class="fine">${copy.footerNote}</p></div><div class="footer-right"><nav aria-label="${ui.footerNavigation}">${navigation(true)}</nav><button class="text-button copy-link">${icon("Copy")}<span>${ui.copy}</span></button><p class="fine"><a href="${show.credit.url}" target="_blank" rel="noopener">${show.credit.label} ↗</a></p></div><div class="footer-bottom"><span>${copy.demoNote}</span><span>${ui.privacy}</span></div></div></footer>`;
}

function player(episode)
{
    return `<section class="player" aria-label="${ui.episode} ${episode.number} ${ui.previewLabel}">
        <div class="player-heading"><span class="live-dot"></span><span>${copy.preview}</span><a href="${link(episode)}" aria-label="${ui.episode} ${episode.number} ${ui.episodeNotesLabel}">${icon("ArrowRight")}</a></div>
        <h2 class="player-title">${episode.title}</h2>
        <div class="transport"><button class="play-button" aria-label="${ui.play}">${icon("Play")}</button><button class="icon-button skip-back" aria-label="${ui.skipBack}" disabled>${icon("SkipBack")}<span>15</span></button><button class="icon-button skip-forward" aria-label="${ui.skipForward}" disabled>${icon("SkipForward")}<span>30</span></button><div class="seek-wrap"><input class="seek" type="range" min="0" max="24" step="0.05" value="0" aria-label="${ui.seek}"><div class="time-row"><span class="elapsed">0:00</span><span class="duration">0:24</span></div></div><button class="speed-button" aria-label="${ui.speed}">1×</button></div>
        <div class="player-bottom"><p>${copy.previewNote}</p><button class="icon-button mute" aria-label="${ui.mute}">${icon("Volume2")}</button><input class="volume" type="range" min="0" max="1" step="0.05" value="0.75" aria-label="${ui.volume}"></div>
        <audio preload="auto"></audio><p class="player-status sr-only" aria-live="polite"></p>
    </section>`;
}

function episodeRow(episode)
{
    const guest = person(episode);
    return `<article class="episode-row reveal"><a class="cover-link" href="${link(episode)}" tabindex="-1" aria-hidden="true">${cover(episode)}</a><div class="episode-info"><p class="eyebrow">EP ${episode.number} <span>·</span> ${episode.topic} <span>·</span> ${episode.minutes} MIN</p><h3><a href="${link(episode)}">${episode.title}</a></h3><p class="row-summary">${episode.summary}</p></div><div class="row-guest"><span class="fine">${ui.guest}</span><span>${guest.name}</span></div><a class="row-action" href="${link(episode)}"><span>${ui.notes}</span>${arrow()}</a></article>`;
}

function sectionHead(title, action = "")
{
    return `<div class="section-head"><h2>${title}</h2>${action}</div>`;
}

function subscribe()
{
    return `<section class="subscribe-section" id="subscribe"><div class="container subscribe-grid"><div class="reveal"><p class="eyebrow">${ui.season}</p><h2>${copy.subscribe}</h2><p>${copy.subscribeIntro}</p></div><div class="subscribe-actions reveal"><a class="button paper" href="${show.links.feed}">${icon("Rss")}<span>${ui.rss}</span>${arrow()}</a><button class="button outline-light copy-link">${icon("Copy")}<span>${ui.copy}</span></button><button class="button outline-light email-toggle" aria-expanded="false" aria-controls="email-panel">${icon("Mail")}<span>${ui.email}</span>${icon("ChevronDown")}</button><div id="email-panel" hidden><p class="fine">${copy.emailDisclosure}</p><form class="email-form"><label for="email-address">${ui.emailLabel}</label><div class="email-fields"><input id="email-address" name="email" type="email" autocomplete="email" required placeholder="you@example.com" maxlength="254"><button class="button paper" type="submit">${ui.save}${arrow()}</button></div></form><div class="email-saved" hidden><p>${copy.emailSuccess}</p><p class="saved-address"></p><button class="text-button remove-email" type="button">${ui.remove}</button></div><p class="email-status fine" aria-live="polite"></p></div></div></div></section>`;
}

function home()
{
    return `<main id="main"><section class="hero container"><div class="hero-copy reveal"><p class="eyebrow hero-eyebrow">${show.brand} · A podcast about<br>${show.topic}</p><h1><span>${show.heroLines[0]}</span><em>${show.heroLines[1]}</em></h1><p class="hero-intro">${show.intro}</p><div class="hero-actions"><a class="button dark" href="${show.links.episodes}">${copy.browse}${arrow()}</a><a class="underlink" href="${show.links.guests}">${copy.meet}</a></div><p class="hero-footnote"><span class="mini-line"></span>${ui.season}</p></div><div class="hero-feature reveal"><div class="studio-frame"><img src="${show.image}" alt="${show.imageAlt}" width="1280" height="720" fetchpriority="high"><span class="image-label">${ui.studio} · ${ui.episodeShort} ${episodes[0].number}</span></div><div class="hero-player">${player(episodes[0])}</div><p class="feature-caption"><span>${ui.latest}</span><span>${ui.episodeShort} ${episodes[0].number} · ${episodes[0].topic.toUpperCase()} · ${episodes[0].minutes} ${ui.minutesShort}</span></p><p class="feature-summary">${episodes[0].summary}</p></div></section>
        <section class="topic-section container"><div class="topic-heading reveal"><p class="eyebrow">${ui.begin}</p><h2>${copy.threads}</h2><p>${copy.threadsIntro}</p></div><div class="topics-grid">${topics.map((topic) => `<a class="topic-card reveal" href="./episodes.html?topic=${topic.name.toLowerCase()}"><div class="topic-art">${cover(episodes.find((episode) => episode.number === topic.number))}</div><div><span class="eyebrow">${topic.name}</span><p>${topic.text}</p></div>${arrow()}</a>`).join("")}</div></section>
        <section class="episodes-section container">${sectionHead(copy.recent, `<a class="underlink" href="${show.links.episodes}">${ui.allEpisodes}${arrow()}</a>`)}${episodes.slice(1, 4).map(episodeRow).join("")}</section>
        <section class="voices-section container">${sectionHead(copy.voices)}<div class="voices-grid"><div><p class="eyebrow voices-label">${ui.hosts}</p><div class="host-pair">${hosts.map((host) => `<article class="host-card reveal">${portrait(host)}<h3>${host.name}</h3><p class="fine">${host.role}</p><p>${host.bio}</p></article>`).join("")}</div></div><div class="recent-guests"><p class="eyebrow voices-label">${ui.recentGuests}</p>${guests.slice(0, 3).map((guest) => `<a class="mini-guest reveal" href="./guests.html#${guest.id}">${portrait(guest)}<div><h3>${guest.name}</h3><p class="fine">${guest.role}</p></div>${arrow()}</a>`).join("")}<a class="underlink" href="${show.links.guests}">${copy.meet}${arrow()}</a></div></div></section>${subscribe()}</main>`;
}

function strip(title, text)
{
    return `<section class="container strip reveal"><div><h2>${title}</h2><p>${text}</p></div><div><a class="button dark" href="${show.links.home}">${ui.latest}${arrow()}</a><a class="button bordered" href="${show.links.subscribe}">${ui.subscribe}</a></div></section>`;
}

function archive()
{
    return `<main id="main"><section class="container page-intro archive-intro reveal"><div><p class="eyebrow">${copy.archiveEyebrow}</p><h1>${copy.archiveTitle}</h1><p>${copy.archiveIntro}</p></div><form class="search-form" role="search"><label for="search">${copy.searchLabel}</label><div class="search-field">${icon("Search")}<input type="search" id="search" placeholder="${copy.searchPlaceholder}" autocomplete="off"></div></form></section><section class="container archive-section"><div class="filter-bar"><div class="filters" role="group" aria-label="Filter by topic">${copy.filters.map((name) => `<button class="filter" data-topic="${name.toLowerCase()}" aria-pressed="false">${name}</button>`).join("")}</div><div class="result-meta"><p id="result-count" class="eyebrow" aria-live="polite"></p><button class="text-button clear-filters">${ui.clear}</button></div></div><div id="episode-results"></div></section>${strip(copy.archiveStripTitle, copy.archiveStripCopy)}</main>`;
}

function guestContext(guest)
{
    return `<aside class="guest-context">${guest.image ? portrait(guest) : `<div class="monogram" aria-hidden="true">${guest.name.split(" ").map((name) => name[0]).join("")}</div>`}<div><p class="eyebrow">${ui.guest}</p><h3>${guest.name}</h3><p class="fine">${guest.role}</p><p>${guest.bio}</p>${guest.image ? `<a class="underlink" href="./guests.html#${guest.id}">${ui.guestDirectory}${arrow()}</a>` : ""}<a class="underlink" href="${show.links.subscribe}">${ui.subscribe} to ${show.brand}${arrow()}</a></div></aside>`;
}

function detail()
{
    const episode = episodes.find((item) => item.slug === new URLSearchParams(location.search).get("slug")) || episodes[0];
    const guest = person(episode);
    const related = episodes.filter((item) => item !== episode).sort((a, b) =>
        Number(b.topic === episode.topic) - Number(a.topic === episode.topic) ||
        Number(b.guest === episode.guest) - Number(a.guest === episode.guest)).slice(0, 3);
    return `<main id="main"><section class="container detail-header reveal"><a class="underlink breadcrumb" href="${show.links.episodes}">← ${ui.back}</a><div class="detail-grid"><div class="detail-cover">${cover(episode)}</div><div class="detail-copy"><p class="eyebrow">EP ${episode.number} · ${episode.topic} · ${episode.minutes} MIN</p><h1>${episode.title}</h1><p class="detail-summary">${episode.summary}</p><p class="guest-byline">${ui.guest} <strong>${guest.name}</strong></p><p class="fine">${copy.demoNote}</p></div></div><div class="detail-player">${player(episode)}</div></section>
        <section class="container notes-grid"><aside class="chapter-nav"><p class="eyebrow">${ui.chapters}</p><div class="chapters">${episode.chapters.map(([time, title], index) => `<button class="chapter ${index === 0 ? "selected" : ""}" data-chapter="${index}" aria-current="${index === 0 ? "true" : "false"}"><span>${time}</span>${title}</button>`).join("")}</div><p class="fine">${copy.chaptersNote}</p></aside><div class="notes-content"><p class="eyebrow chapter-announcement" aria-live="polite">${ui.chapterSelected} · ${episode.chapters[0][0]}</p><h2>${copy.notesTitle}</h2>${episode.notes.map((paragraph, index) => `<section class="note-panel ${index === 0 ? "highlight" : ""}" data-note="${index}" aria-label="${episode.chapters[index][1]}"><span class="note-time">${episode.chapters[index][0]}</span><p>${paragraph}</p></section>`).join("")}<section class="note-panel takeaways" data-note="3" aria-label="${episode.chapters[3][1]}"><span class="note-time">${episode.chapters[3][0]}</span><h3>${ui.takeaways}</h3><ol>${episode.takeaways.map((item) => `<li>${item}</li>`).join("")}</ol></section><details class="transcript"><summary>${copy.transcriptTitle}${icon("ChevronDown")}</summary><p class="fine">${copy.transcriptDisclosure}</p>${episode.transcript.map((line) => `<p>${line}</p>`).join("")}</details>${guestContext(guest)}</div></section>
        <section class="container related-section">${sectionHead(copy.relatedTitle)}<div class="related-grid">${related.map((item) => `<article class="related-card reveal"><a href="${link(item)}" tabindex="-1" aria-hidden="true">${cover(item)}</a><p class="eyebrow">EP ${item.number} · ${item.topic} · ${item.minutes} MIN</p><h3><a href="${link(item)}">${item.title}</a></h3><a class="underlink" href="${link(item)}">${ui.notes}${arrow()}</a></article>`).join("")}</div></section></main>`;
}

function directory()
{
    return `<main id="main"><section class="container page-intro reveal"><p class="eyebrow">${copy.guestsEyebrow}</p><h1>${copy.guestsTitle}</h1><p>${copy.guestsIntro}</p></section><section class="container guest-grid">${guests.slice(0, 3).map((guest) => `<article class="guest-card reveal" id="${guest.id}">${portrait(guest)}<div><h2>${guest.name}</h2><p class="eyebrow">${guest.role}</p><p>${guest.bio}</p><div class="guest-episodes">${guest.episodes.map((number) => episodes.find((item) => item.number === number)).map((episode) => `<a href="${link(episode)}"><span class="eyebrow">EP ${episode.number}</span><span>${episode.title}</span>${arrow()}</a>`).join("")}</div></div></article>`).join("")}</section><section class="host-band"><div class="container">${sectionHead(copy.hostsTitle)}<p class="hosts-note">${copy.hostsNote}</p><div class="host-directory">${hosts.map((host) => `<article class="reveal">${portrait(host)}<div><h3>${host.name}</h3><p class="fine">${host.role}</p><p>${host.bio}</p></div></article>`).join("")}</div></div></section>${strip(copy.guestsStripTitle, copy.guestsStripCopy)}</main>`;
}

$("#app").innerHTML = header() + ({ home, episodes: archive, episode: detail, guests: directory }[activePage])() + footer();

const menu = $(".menu-button");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    $("#primary-nav").classList.toggle("open", expanded);
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        menu.click();
        menu.focus();
    }
});

for (const button of $$(".copy-link"))
{
    button.addEventListener("click", async () =>
    {
        const url = new URL(show.links.home, location.href).href;
        try
        {
            await navigator.clipboard.writeText(url);
            button.innerHTML = `${icon("Check")}<span>${ui.copied}</span>`;
            button.setAttribute("aria-live", "polite");
            setTimeout(() => { button.innerHTML = `${icon("Copy")}<span>${ui.copy}</span>`; }, 2000);
        }
        catch
        {
            let fallback = $(".copy-fallback", button.parentElement);
            if (!fallback)
            {
                fallback = document.createElement("label");
                fallback.className = "copy-fallback";
                fallback.textContent = ui.clipboardFallback;
                const input = document.createElement("input");
                input.value = url;
                input.readOnly = true;
                fallback.append(input);
                button.after(fallback);
            }
            $("input", fallback).select();
        }
    });
}

function setupPlayer(root)
{
    const audio = $("audio", root);
    const play = $(".play-button", root);
    const seek = $(".seek", root);
    const back = $(".skip-back", root);
    const forward = $(".skip-forward", root);
    const mute = $(".mute", root);
    const volume = $(".volume", root);
    const speed = $(".speed-button", root);
    const status = $(".player-status", root);
    play.disabled = true;
    seek.disabled = true;
    audio.volume = 0.75;
    let frame;
    const format = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
    function update()
    {
        const duration = Number.isFinite(audio.duration) ? audio.duration : 24;
        seek.max = String(duration);
        seek.value = String(audio.currentTime);
        seek.style.setProperty("--progress", `${audio.currentTime / duration * 100}%`);
        $(".elapsed", root).textContent = format(audio.currentTime);
        $(".duration", root).textContent = format(duration);
        seek.setAttribute("aria-valuetext", `${format(audio.currentTime)} ${ui.of} ${format(duration)}`);
        back.disabled = audio.currentTime < 15;
        forward.disabled = audio.currentTime + 30 > duration;
    }
    function animate()
    {
        update();
        if (!audio.paused) frame = requestAnimationFrame(animate);
    }
    play.addEventListener("click", async () =>
    {
        if (!audio.paused) audio.pause();
        else
        {
            try
            {
                if (audio.ended) audio.currentTime = 0;
                await audio.play();
                status.textContent = "";
            }
            catch
            {
                status.classList.remove("sr-only");
                status.textContent = ui.playError;
            }
        }
    });
    audio.addEventListener("play", () =>
    {
        play.innerHTML = icon("Pause");
        play.setAttribute("aria-label", ui.pause);
        cancelAnimationFrame(frame);
        animate();
    });
    const paused = () =>
    {
        play.innerHTML = icon("Play");
        play.setAttribute("aria-label", ui.play);
        cancelAnimationFrame(frame);
        update();
    };
    audio.addEventListener("pause", paused);
    audio.addEventListener("ended", paused);
    audio.addEventListener("loadedmetadata", () =>
    {
        play.disabled = false;
        seek.disabled = false;
        update();
    });
    audio.addEventListener("timeupdate", update);
    seek.addEventListener("input", () =>
    {
        audio.currentTime = Number(seek.value);
        update();
    });
    back.addEventListener("click", () =>
    {
        if (audio.currentTime >= 15) audio.currentTime -= 15;
        update();
    });
    forward.addEventListener("click", () =>
    {
        if (audio.currentTime + 30 <= audio.duration) audio.currentTime += 30;
        update();
    });
    speed.addEventListener("click", () =>
    {
        const speeds = [1, 1.25, 1.5, 2];
        audio.playbackRate = speeds[(speeds.indexOf(audio.playbackRate) + 1) % speeds.length];
        speed.textContent = `${audio.playbackRate}×`;
    });
    function updateVolume()
    {
        const silent = audio.muted || audio.volume === 0;
        mute.innerHTML = icon(silent ? "VolumeX" : "Volume2");
        mute.setAttribute("aria-label", silent ? ui.unmute : ui.mute);
        volume.style.setProperty("--progress", `${audio.volume * 100}%`);
    }
    mute.addEventListener("click", () =>
    {
        audio.muted = !audio.muted;
        updateVolume();
    });
    volume.addEventListener("input", () =>
    {
        audio.volume = Number(volume.value);
        audio.muted = audio.volume === 0;
        updateVolume();
    });
    updateVolume();
    update();
    // A local Blob keeps real seeking reliable on static hosts without byte-range responses.
    fetch(show.audio).then(async (response) =>
    {
        if (!response.ok) throw new Error("Local audio unavailable");
        const source = URL.createObjectURL(await response.blob());
        audio.src = source;
        window.addEventListener("pagehide", (event) =>
        {
            if (!event.persisted) URL.revokeObjectURL(source);
        });
    }).catch(() =>
    {
        status.classList.remove("sr-only");
        status.textContent = ui.audioLoadError;
    });
}
$$(".player").forEach(setupPlayer);

function reveal()
{
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) =>
    {
        for (const entry of entries)
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.08 });
    $$(".reveal:not(.observed)").forEach((element, index) =>
    {
        element.classList.add("will-reveal", "observed");
        element.style.setProperty("--stagger", `${index % 3 * 80}ms`);
        observer.observe(element);
    });
}

if (activePage === "episodes")
{
    const queryTopic = new URLSearchParams(location.search).get("topic")?.toLowerCase();
    let topic = copy.filters.map((name) => name.toLowerCase()).includes(queryTopic) ? queryTopic : "all";
    const search = $("#search");
    function filter()
    {
        const term = search.value.trim().toLowerCase();
        const results = episodes.filter((episode) =>
        {
            const text = `${episode.title} ${episode.summary} ${episode.topic} ${person(episode).name}`.toLowerCase();
            return (topic === "all" || episode.topic.toLowerCase() === topic) && text.includes(term);
        });
        $("#episode-results").innerHTML = results.length ? results.map(episodeRow).join("") : `<div class="empty-state"><h2>${copy.empty}</h2></div>`;
        $("#result-count").textContent = `${results.length} ${ui.results}`;
        for (const button of $$(".filter")) button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
        reveal();
    }
    for (const button of $$(".filter"))
    {
        button.addEventListener("click", () => { topic = button.dataset.topic; filter(); });
    }
    search.addEventListener("input", filter);
    $(".search-form").addEventListener("submit", (event) => event.preventDefault());
    $(".clear-filters").addEventListener("click", () =>
    {
        topic = "all";
        search.value = "";
        filter();
        search.focus();
    });
    filter();
}

for (const chapter of $$(".chapter"))
{
    chapter.addEventListener("click", () =>
    {
        for (const button of $$(".chapter"))
        {
            button.classList.toggle("selected", button === chapter);
            button.setAttribute("aria-current", String(button === chapter));
        }
        for (const panel of $$(".note-panel")) panel.classList.toggle("highlight", panel.dataset.note === chapter.dataset.chapter);
        $(".chapter-announcement").textContent = `${ui.chapterSelected} · ${$("span", chapter).textContent} · ${chapter.textContent.trim().slice(5).trim()}`;
    });
}

if ($(".email-toggle"))
{
    const form = $(".email-form");
    const saved = $(".email-saved");
    const status = $(".email-status");
    const key = "tangent-and-tide-local-email";
    function refreshEmail()
    {
        try
        {
            const address = localStorage.getItem(key);
            form.hidden = Boolean(address);
            saved.hidden = !address;
            $(".saved-address").textContent = address || "";
        }
        catch
        {
            status.textContent = ui.storageError;
        }
    }
    $(".email-toggle").addEventListener("click", () =>
    {
        const panel = $("#email-panel");
        panel.hidden = !panel.hidden;
        $(".email-toggle").setAttribute("aria-expanded", String(!panel.hidden));
        if (!panel.hidden)
        {
            refreshEmail();
            if (!form.hidden) $("#email-address").focus();
        }
    });
    form.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        if (!form.reportValidity()) return;
        try
        {
            localStorage.setItem(key, $("#email-address").value.trim());
            refreshEmail();
            status.textContent = ui.stored;
            $(".remove-email").focus();
        }
        catch
        {
            status.textContent = ui.storageError;
        }
    });
    $(".remove-email").addEventListener("click", () =>
    {
        try
        {
            localStorage.removeItem(key);
            refreshEmail();
            $("#email-address").value = "";
            $("#email-address").focus();
            status.textContent = ui.localRemoved;
        }
        catch
        {
            status.textContent = ui.storageError;
        }
    });
    refreshEmail();
}
reveal();
if (location.hash)
{
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
