import { content, catalog, featured, artFilms, seedReviews, storageKey, initialState } from "./content.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const main = $("#main");
const composer = $("#composer");
const mobileMenu = $("#mobile-menu");
const html = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const number = (value) => Number(value).toLocaleString("en-US");
const filmBy = (slug) => catalog.find((film) => film.slug === slug);
const initials = (name) => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("");
const href = (route) => `./index.html#${route}`;
const filmHref = (film) => href(`/film/${film.slug}`);
const paths =
{
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    bookmark: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    star: '<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.4 20.3l1-6.3L3 9.6l6.2-.9z"/>',
    thumb: '<path d="M7 10v12H3V10zm0 0 5-9a3 3 0 0 1 2 4l-1 4h6a3 3 0 0 1 3 3l-2 7a3 3 0 0 1-3 3H7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    pen: '<path d="m16 3 5 5M3 21l5-1L21 7a3 3 0 0 0-5-5L3 15z"/>',
    frame: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M8 7h8v10H8z"/>'
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
let storageAvailable = true;
let state = loadState();
const ui =
{
    route: "/", filmTab: "short", filmSort: { short: "helpful", essay: "helpful" },
    reviewType: "all", reviewGenre: "", reviewSearch: "", reviewSort: "helpful", reviewLimit: 6,
    canonSearch: "", canonGenre: "", canonDecade: "", canonMinimum: "", canonSort: "rank", canonLimit: 20,
    shelf: "watched", shelfSearch: "", shelfSort: "recent", inlineRating: "", expanded: new Set(), collapsed: new Set(),
    editorType: state.draft.type || "short", editorPreview: false, dialogReturn: null
};
let statusTimer;

function validState(saved)
{
    if (!saved || saved.version !== 1 || !Array.isArray(saved.watched) || !Array.isArray(saved.queue) ||
        !Array.isArray(saved.reviews) || !Array.isArray(saved.votes) || !Array.isArray(saved.changes) ||
        !saved.ratings || typeof saved.ratings !== "object" || !saved.draft || typeof saved.draft !== "object") return false;
    const validSlugs = (slugs) => new Set(slugs).size === slugs.length && slugs.every((slug) => typeof slug === "string" && filmBy(slug));
    if (!validSlugs(saved.watched) || !validSlugs(saved.queue) || saved.queue.some((slug) => saved.watched.includes(slug))) return false;
    if (!Object.entries(saved.ratings).every(([slug, rating]) => filmBy(slug) && saved.watched.includes(slug) && Number.isInteger(rating) && rating >= 1 && rating <= 5)) return false;
    if (!saved.reviews.every((review) => review && typeof review.id === "string" && filmBy(review.film) &&
        review.author === content.profile && ["short", "essay"].includes(review.type) && typeof review.body === "string" &&
        typeof review.title === "string" && Number.isInteger(review.stars) && review.stars >= 1 && review.stars <= 5 &&
        Number.isFinite(review.helpful) && Number.isFinite(review.sequence))) return false;
    if (!saved.votes.every((vote) => typeof vote === "string") ||
        !saved.changes.every((change) => change && filmBy(change.slug) && typeof change.action === "string")) return false;
    if (!["type", "film", "title", "body"].every((key) => saved.draft[key] === undefined || typeof saved.draft[key] === "string")) return false;
    if (saved.drafts !== undefined && (!saved.drafts || typeof saved.drafts !== "object" || Array.isArray(saved.drafts) ||
        !Object.entries(saved.drafts).every(([slug, draft]) => filmBy(slug) && draft && typeof draft === "object" &&
            ["type", "film", "title", "body"].every((key) => draft[key] === undefined || typeof draft[key] === "string")))) return false;
    return true;
}

function loadState()
{
    try
    {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (validState(saved)) return saved;
    }
    catch
    {
        storageAvailable = false;
    }
    return initialState();
}

function save()
{
    state.drafts ||= {};
    if (filmBy(state.draft.film)) state.drafts[state.draft.film] = { ...state.draft };
    if (!storageAvailable) return;
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }
    catch
    {
        storageAvailable = false;
    }
}

function announce(message)
{
    clearTimeout(statusTimer);
    $("#status").textContent = message;
    statusTimer = setTimeout(() => { $("#status").textContent = ""; }, 4500);
}

function allReviews()
{
    return [...state.reviews, ...seedReviews];
}

function aggregate(film)
{
    const counts = [...film.counts];
    if (state.ratings[film.slug]) counts[5 - state.ratings[film.slug]]++;
    const total = counts.reduce((a, b) => a + b, 0);
    return { counts, total, average: counts.reduce((sum, count, index) => sum + count * (5 - index), 0) / total };
}

function changed(slug, action)
{
    state.changes = [{ slug, action }, ...state.changes.filter((change) => change.slug !== slug)].slice(0, 100);
    save();
}

function rate(slug, value)
{
    state.ratings[slug] = value;
    if (!state.watched.includes(slug)) state.watched.unshift(slug);
    state.queue = state.queue.filter((entry) => entry !== slug);
    changed(slug, `Rated ${value} stars`);
    announce(`Your rating: ${value} out of 5. Marked watched.`);
    renderMain();
}

function listChange(slug, destination)
{
    const wasQueued = state.queue.includes(slug);
    if (destination === "queue")
    {
        state.watched = state.watched.filter((entry) => entry !== slug);
        delete state.ratings[slug];
        state.queue = [slug, ...state.queue.filter((entry) => entry !== slug)];
        changed(slug, "Added to want to watch");
        announce("Added to want to watch. Any previous personal rating was removed.");
    }
    else if (destination === "watched")
    {
        state.queue = state.queue.filter((entry) => entry !== slug);
        state.watched = [slug, ...state.watched.filter((entry) => entry !== slug)];
        changed(slug, "Marked watched");
        announce("Marked watched.");
    }
    else
    {
        state.queue = state.queue.filter((entry) => entry !== slug);
        if (!wasQueued)
        {
            state.watched = state.watched.filter((entry) => entry !== slug);
            delete state.ratings[slug];
        }
        changed(slug, wasQueued ? "Removed from want to watch" : "Removed from watched");
        announce(wasQueued ? "Removed from want to watch." : "Removed from watched.");
    }
    renderMain();
}

function poster(film, extra = "")
{
    if (film.image) return `<img class="poster ${extra}" src="${film.image}" alt="${html(film.alt)}" width="300" height="400">`;
    const seed = [...film.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const x = 70 + seed % 120;
    const colors = ["#203943", "#c85f49", "#83927d", "#d49a3a"];
    const background = colors[seed % 4];
    const shapes =
    {
        Drama: `<circle cx="${x}" cy="130" r="45" fill="#d49a3a"/><path d="M0 250Q100 180 300 260V400H0" fill="#e8e1cf"/><path d="M0 320Q180 240 300 290V400H0" fill="#83927d"/>`,
        "Science fiction": `<circle cx="150" cy="180" r="80" fill="none" stroke="#f3f0e8" stroke-width="2"/><ellipse cx="150" cy="180" rx="130" ry="38" fill="none" stroke="#d49a3a" stroke-width="6" transform="rotate(-35 150 180)"/><circle cx="${x}" cy="180" r="36" fill="#c85f49"/><path d="M0 340 300 280v120H0" fill="#17262e"/>`,
        Mystery: `<path d="M55 80h190v260H55z" fill="#17262e"/><path d="M75 100h150v220H75z" fill="#d49a3a"/><path d="M150 100v220M75 200h150" stroke="#17262e" stroke-width="12"/><path d="m150 320 90 80H30" fill="#fffdf7"/>`,
        Romance: `<path d="M40 400Q250 250 100 0M260 400Q50 250 200 0" fill="none" stroke="#f3f0e8" stroke-width="22"/><circle cx="150" cy="210" r="33" fill="#c85f49"/>`,
        Comedy: `<circle cx="100" cy="155" r="73" fill="#d49a3a"/><circle cx="190" cy="210" r="73" fill="#f3f0e8"/><circle cx="100" cy="275" r="36" fill="#c85f49"/><path d="m0 370 300-60v90H0" fill="#17262e"/>`,
        Adventure: Array.from({ length: 10 }, (_, i) => `<path d="M-20 ${90 + i * 27}Q150 ${i * 13} 320 ${140 + i * 23}" fill="none" stroke="${i % 2 ? "#f3f0e8" : "#d49a3a"}" stroke-width="3"/>`).join(""),
        Animation: `<path d="M80 320C-20 240 30 110 110 160 100 10 270 70 220 200 350 280 210 390 80 320" fill="#83927d"/><circle cx="${x}" cy="150" r="49" fill="#d49a3a"/><path d="M150 200v200M150 290l-60-30m60 0 60-50" stroke="#f3f0e8" stroke-width="7"/>`,
        Documentary: `<path d="M30 90h240v220H30z" fill="none" stroke="#f3f0e8" stroke-width="4"/><path d="M55 115h190v170H55z" fill="#17262e"/><circle cx="150" cy="200" r="45" fill="#c85f49"/><path d="M100 365h100" stroke="#d49a3a" stroke-width="8"/>`,
        Horror: `<path d="M70 400V130l80-55 80 55v270" fill="#17262e"/><path d="M130 400V230h40v170" fill="#d49a3a"/><path d="m170 230 130 170H170" fill="#0d1b23" opacity=".7"/><circle cx="${x}" cy="65" r="22" fill="#fffdf7"/>`,
        Thriller: Array.from({ length: 9 }, (_, i) => `<path d="M${i * 45 - 30} 400 150 ${90 + seed % 50}" stroke="${i % 2 ? "#f3f0e8" : "#d49a3a"}" stroke-width="3"/>`).join("") + '<circle cx="150" cy="110" r="27" fill="#c85f49"/>'
    };
    return `<svg class="poster ${extra}" viewBox="0 0 300 400" role="img" aria-label="${html(film.alt)}"><rect width="300" height="400" fill="${background}"/>${shapes[film.genre]}<path d="M15 15h270v370H15z" fill="none" stroke="#fffdf7" stroke-opacity=".23"/></svg>`;
}

function bookmark(film, compact = false)
{
    const selected = state.queue.includes(film.slug);
    return `<button type="button" class="${compact ? "icon-button" : ""}" data-action="bookmark" data-film="${film.slug}" aria-pressed="${selected}" aria-label="${selected ? "Saved to want to watch" : "Want to watch"}: ${html(film.title)}" title="${selected ? "Saved to want to watch" : "Want to watch"}">${icon(selected ? "check" : "bookmark")}${compact ? "" : selected ? "Saved to want to watch" : "Want to watch"}</button>`;
}

function filmCard(film, reason = "")
{
    return `<article class="film-card">
        <a class="poster-link" href="${filmHref(film)}">${poster(film)}</a>
        <h3><a href="${filmHref(film)}">${html(film.title)}</a></h3>
        <p class="meta">${film.year} · ${html(film.genre)}</p>
        ${reason ? `<p class="muted">${html(reason)}</p>` : ""}
        <div class="card-bottom"><span class="numbers"><span class="star">★</span> ${aggregate(film).average.toFixed(2)}</span>${bookmark(film, true)}</div>
    </article>`;
}

function stars(slug, id = "rating")
{
    const value = state.ratings[slug] || 0;
    return `<div class="rating-input" role="radiogroup" aria-label="Your rating" data-slug="${slug}">
        ${[1,2,3,4,5].map((rating) => `<button type="button" role="radio" aria-label="${rating} out of 5" aria-checked="${value === rating}" class="${rating <= value ? "filled" : ""}" data-action="rate" data-film="${slug}" data-value="${rating}" id="${id}-${rating}" tabindex="${value ? rating === value ? 0 : -1 : rating === 1 ? 0 : -1}">${icon("star")}</button>`).join("")}
        </div><span class="meta rating-value">${value ? `${value} out of 5` : "Not rated yet"}</span>`;
}

function metric(value, label)
{
    return `<div class="metric"><strong>${html(value)}</strong><span>${html(label)}</span></div>`;
}

function bar(label, value, total, color = "")
{
    const percent = total ? value / total * 100 : 0;
    return `<div class="bar-row"><span>${html(label)}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${percent}%;${color ? `background:${color}` : ""}"></div></div><span class="value">${number(value)} · ${Math.round(percent)}%</span></div>`;
}

function genreCounts()
{
    return content.genres.map((genre) => ({ genre, count: state.watched.filter((slug) => filmBy(slug).genre === genre).length }));
}

function personalAverage()
{
    const values = Object.values(state.ratings);
    return values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : "—";
}

function navLinks()
{
    return content.nav.map(([route, label]) => `<a href="${href(route)}"${route === ui.route || route !== "/" && ui.route.startsWith(route) ? ' aria-current="page"' : ""}>${html(label)}</a>`).join("");
}

function renderShell()
{
    $("#header").innerHTML = `<div class="container header-inner">
        <a class="brand" href="${href("/")}">${icon("frame")}${html(content.brand)}</a>
        <nav class="desktop-nav" aria-label="Main navigation">${navLinks()}</nav>
        <div class="search-wrap">${icon("search")}<input id="catalog-search" aria-label="Search the 100-film catalog" placeholder="Search the 100-film catalog…" autocomplete="off" aria-controls="catalog-results" aria-expanded="false"><div class="search-results" id="catalog-results" aria-label="Catalog search results"></div></div>
        <a href="${href("/profile")}" class="avatar" aria-label="${html(content.profile)}'s taste profile">${initials(content.profile)}</a>
        <div class="mobile-actions"><button data-action="search-toggle" aria-label="Open catalog search">${icon("search")}</button><button data-action="menu" aria-haspopup="dialog">${icon("menu")}Menu</button></div>
    </div>`;
    $("#footer").innerHTML = `<div class="container"><div class="footer-top"><div><a class="brand" href="${href("/")}">${icon("frame")}${html(content.brand)}</a><p class="serif" style="font-size:23px;margin-top:12px">A slower place for film conversations.</p></div><nav aria-label="Footer navigation">${navLinks()}</nav></div><div class="footer-bottom"><p>${html(content.disclosure)}</p><a href="${content.credit}" target="_blank" rel="noreferrer">Template by VibeFather</a></div></div>`;
}

function reviewCard(review, showFilm = false, forceExpanded = false)
{
    const film = filmBy(review.film);
    const voted = state.votes.includes(review.id);
    const expanded = forceExpanded ? !ui.collapsed.has(review.id) : ui.expanded.has(review.id);
    const body = review.type === "essay" && !expanded ? review.body.split(". ").slice(0, 3).join(". ") + "…" : review.body;
    return `<article class="review ${review.type}" id="review-${review.id}">
        ${showFilm ? `<a class="review-film" href="${filmHref(film)}">${poster(film)}${html(film.title)}</a>` : ""}
        <div class="review-header"><span class="avatar">${initials(review.author)}</span><div><strong>${html(review.author)}</strong><div class="meta"><span class="star" aria-label="${review.stars} out of 5 stars">${"★".repeat(review.stars)}</span> · ${review.type === "essay" ? "Long essay" : "Short take"}</div></div></div>
        <h3 tabindex="-1" id="review-heading-${review.id}">${html(review.title || (showFilm ? "A note from the walk home" : film.title))}</h3>
        <p>${html(body)}</p>
        <div class="review-footer">
            <button type="button" data-action="helpful" data-id="${review.id}" aria-pressed="${voted}">${icon("thumb")}${voted ? "Helpful given" : "Helpful"} · ${number(review.helpful + (voted ? 1 : 0))}</button>
            ${review.type === "essay" ? `<button type="button" data-action="expand" data-id="${review.id}" aria-expanded="${expanded}">${expanded ? "Collapse essay" : "Read full essay"}</button>` : ""}
            <button class="icon-button" type="button" data-action="report" aria-label="Report review by ${html(review.author)}" title="Report review">···</button>
        </div>
    </article>`;
}

function renderHome()
{
    const stats = aggregate(featured);
    const short = seedReviews.find((review) => review.film === featured.slug && review.type === "short");
    const essay = seedReviews.find((review) => review.film === featured.slug && review.type === "essay");
    const genres = genreCounts().sort((a, b) => b.count - a.count).slice(0, 4);
    return `<div class="view">
        <section class="hero" aria-label="Discover films">
            <div class="hero-copy"><p class="eyebrow">A film diary for ${html(content.audience)}</p>
                <h1>${html(content.tagline).replace("Know your taste.", "<em>Know your taste.</em>")}</h1>
                <p>${html(content.invitation)}</p>
                <div class="actions"><a class="button primary" href="${href("/reviews")}">Explore the community ${icon("arrow")}</a><a class="button" href="${href("/library")}">Open my film diary</a></div>
                <p class="search-hint">${icon("search")} Not sure where to begin? Search by title, genre, or mood.</p>
            </div>
            <div class="feature"><div class="feature-label"><span>THE EVENING FEATURE</span><span>NO. ${String(featured.rank).padStart(3, "0")} / 100</span></div>
                <div class="feature-main"><a href="${filmHref(featured)}" aria-label="View ${html(featured.title)}">${poster(featured)}</a>
                    <div><div class="meta">${html(featured.genre)} · ${featured.year} · ${featured.runtime}m</div><h2>${html(featured.title)}</h2><p>${html(featured.logline)}</p>
                        <div><span class="star">★★★★★</span> <span class="rating-big">${stats.average.toFixed(2)}</span></div><div class="meta">${number(stats.total)} community ratings</div><a class="button" href="${filmHref(featured)}">View film ${icon("arrow")}</a>
                    </div>
                    <div class="floating-review"><p>“${html(short.body)}”</p><div class="meta">${html(short.author)} &nbsp; <span class="star">★★★★★</span> &nbsp; ${short.helpful + (state.votes.includes(short.id) ? 1 : 0)} found this helpful</div></div>
                </div>
                <div class="queue-strip"><span>TONIGHT'S QUEUE</span>${state.queue.slice(0, 3).map((slug) => { const film = filmBy(slug); return `<a href="${filmHref(film)}">${poster(film)}<span>${html(film.title)}</span></a>`; }).join("")}${state.queue.length ? "" : `<a href="${href("/rankings")}">Find your next film ${icon("arrow")}</a>`}</div>
            </div>
        </section>
        <section class="section"><div class="section-heading"><div><h2>Tonight's selection</h2><p>Six original films, six reasons to stay up a little later.</p></div><a class="text-link" href="${href("/rankings")}">Browse the full canon ${icon("arrow")}</a></div><div class="film-grid">${artFilms.map((film) => filmCard(film)).join("")}</div></section>
        <section class="section two-col"><div><div class="section-heading"><h2>From the community notebook</h2></div><div class="essay-feature">${reviewCard(essay)}</div>
            ${[0,6,11].map((index) => { const review = seedReviews[index]; const film = filmBy(review.film); return `<div class="mini-take"><p>“${html(review.body)}”</p><span class="meta">${html(review.author)} on <a href="${filmHref(film)}">${html(film.title)}</a></span></div>`; }).join("")}</div>
            <aside class="panel diary-panel"><p class="eyebrow">${html(content.profile)}'s notebook</p><h2>Your film diary, so far</h2><p class="muted">A small record of the worlds you return to.</p><div class="metrics">${metric(state.watched.length, "Watched")}${metric(state.queue.length, "Want to watch")}${metric(state.reviews.length, "Reviews")}</div>${genres.map(({ genre, count }) => bar(genre, count, state.watched.length)).join("")}<a class="text-link" href="${href("/profile")}">See your taste profile ${icon("arrow")}</a></aside>
        </section><div class="quote-strip"><p>Good films end. Good conversations do not.</p><a class="button" href="${href("/reviews?compose=1")}">${icon("pen")}Write a review</a></div>
    </div>`;
}

function options(values, selected, first)
{
    return `${first ? `<option value="">${html(first)}</option>` : ""}${values.map((entry) =>
    {
        const [value, label] = Array.isArray(entry) ? entry : [entry, entry];
        return `<option value="${html(value)}"${String(value) === String(selected) ? " selected" : ""}>${html(label)}</option>`;
    }).join("")}`;
}

function selectField(id, label, entries, value, first = "")
{
    return `<div><label for="${id}">${label}</label><select id="${id}" data-filter="${id}">${options(entries, value, first)}</select></div>`;
}

function textField(id, label, placeholder, value, extra = "")
{
    return `<div class="${extra}"><label for="${id}">${label}</label><input id="${id}" data-filter="${id}" type="search" placeholder="${placeholder}" value="${html(value)}"></div>`;
}

function titleBlock(eyebrow, title, body)
{
    return `<div class="page-title"><p class="eyebrow">${html(eyebrow)}</p><h1>${html(title)}</h1><p>${html(body)}</p></div>`;
}

function canonFilms()
{
    return catalog.filter((film) =>
        (!ui.canonSearch || `${film.title} ${film.director}`.toLowerCase().includes(ui.canonSearch.toLowerCase())) &&
        (!ui.canonGenre || film.genre === ui.canonGenre || film.secondary === ui.canonGenre) &&
        (!ui.canonDecade || Math.floor(film.year / 10) * 10 === Number(ui.canonDecade)) &&
        (!ui.canonMinimum || aggregate(film).average >= Number(ui.canonMinimum)))
        .sort((a, b) => ui.canonSort === "title" ? a.title.localeCompare(b.title) : ui.canonSort === "rating" ? aggregate(b).average - aggregate(a).average || a.rank - b.rank : a.rank - b.rank);
}

function canonActive()
{
    return ui.canonSearch || ui.canonGenre || ui.canonDecade || ui.canonMinimum || ui.canonSort !== "rank";
}

function renderRankings()
{
    const results = canonFilms();
    const mean = catalog.reduce((sum, film) => sum + aggregate(film).average, 0) / catalog.length;
    return `<div class="view">${titleBlock("The community canon", content.canon, "One hundred fictional films, ordered by the editorial desk and opened up to your own filters. Rank is a point of view, not a permanent verdict.")}
        <div class="metrics">${metric(catalog.length, "Films")}${metric(content.genres.length, "Genres")}${metric(mean.toFixed(2), "Mean community rating")}</div>
        <div class="filters">${textField("canonSearch", "Find a film", "Title or director…", ui.canonSearch, "wide")}
        ${selectField("canonGenre", "Genre", content.genres, ui.canonGenre, "All genres")}
        ${selectField("canonDecade", "Decade", [2020,2010,2000,1990,1980,1970,1960].map((year) => [year, `${year}s`]), ui.canonDecade, "All decades")}
        ${selectField("canonMinimum", "Minimum rating", [["4.5","4.5+"],["4","4.0+"],["3.5","3.5+"]], ui.canonMinimum, "Any")}
        ${selectField("canonSort", "Sort", [["rank","Editorial rank"],["rating","Highest rated"],["title","Title A–Z"]], ui.canonSort)}
        ${canonActive() ? '<button data-action="canon-reset">Clear filters</button>' : ""}</div>
        <div class="result-count" role="status">${results.length} of 100 films · Save a film to your library</div>
        <div class="rank-table" aria-label="Ranked film canon"><div class="rank-head"><span>Rank</span><span>Film</span><span>Details</span><span>Community</span><span>Your library</span></div>
        ${results.slice(0, ui.canonLimit).map((film) =>
        {
            const stats = aggregate(film);
            return `<article class="rank-row"><span class="rank">${String(film.rank).padStart(3, "0")}</span><div class="rank-film"><a href="${filmHref(film)}" tabindex="-1" aria-hidden="true">${poster(film)}</a><div><h3><a href="${filmHref(film)}">${html(film.title)}</a></h3><span class="meta">Directed by ${html(film.director)}</span></div></div><div class="rank-details meta">${film.year} · ${film.runtime}m<br>${html(film.genre)} / ${html(film.secondary)}</div><div class="rank-community"><span class="numbers"><span class="star">★</span> ${stats.average.toFixed(2)}</span><div class="meta">${number(stats.total)} ratings</div></div><div class="rank-actions">${bookmark(film, true)}${state.watched.includes(film.slug) ? `<span class="state-label">Watched</span>` : state.queue.includes(film.slug) ? '<span class="state-label queued">Queued</span>' : ""}${state.ratings[film.slug] ? `<span class="meta">Your rating: ${state.ratings[film.slug]} / 5</span>` : ""}</div></article>`;
        }).join("")}</div>
        ${!results.length ? `<div class="empty"><h2>No films match those filters.</h2><p>${html([ui.canonSearch,ui.canonGenre,ui.canonDecade && `${ui.canonDecade}s`,ui.canonMinimum && `${ui.canonMinimum}+`].filter(Boolean).join(" · "))}</p><button data-action="canon-reset">Reset filters</button></div>` : ""}
        ${results.length > ui.canonLimit ? '<div class="center"><button data-action="canon-more">Show 20 more</button></div>' : ""}
    </div>`;
}

function sortedReviews(reviews, sort)
{
    return [...reviews].sort((a, b) => sort === "latest" ? b.sequence - a.sequence :
        b.helpful + Number(state.votes.includes(b.id)) - a.helpful - Number(state.votes.includes(a.id)) || b.sequence - a.sequence);
}

function reviewFilters()
{
    return allReviews().filter((review) =>
    {
        const film = filmBy(review.film);
        return (ui.reviewType === "all" || review.type === ui.reviewType) &&
            (!ui.reviewGenre || film.genre === ui.reviewGenre || film.secondary === ui.reviewGenre) &&
            (!ui.reviewSearch || `${review.body} ${review.title} ${film.title} ${review.author}`.toLowerCase().includes(ui.reviewSearch.toLowerCase()));
    });
}

function reviewTabs(selected, action, includeAll = false)
{
    return `<div class="tabs" role="tablist" aria-label="Review type">${(includeAll ? [["all","All"],["short","Short takes"],["essay","Long essays"]] : [["short","Short takes"],["essay","Long essays"]]).map(([value, label]) => `<button role="tab" aria-selected="${value === selected}" tabindex="${value === selected ? 0 : -1}" data-action="${action}" data-value="${value}">${label}</button>`).join("")}</div>`;
}

function renderReviews()
{
    const reviews = sortedReviews(reviewFilters(), ui.reviewSort);
    const active = ui.reviewSearch || ui.reviewType !== "all" || ui.reviewGenre || ui.reviewSort !== "helpful";
    return `<div class="view">${titleBlock("The review desk", "Notes worth arguing over.", "Quick reactions for the walk home. Longer essays for the films that need more room.")}
        <div class="section-heading"><p class="muted">Both quick notes and patient essays belong here.</p><button class="primary" data-action="compose">${icon("pen")}Write a review</button></div>
        <div class="filters">${textField("reviewSearch", "Search the notebook", "Search reviews or film titles…", ui.reviewSearch, "search-field")}
        ${reviewTabs(ui.reviewType, "review-tab", true)}
        ${selectField("reviewGenre", "Genre", content.genres, ui.reviewGenre, "All genres")}
        ${selectField("reviewSort", "Sort", [["helpful","Most helpful"],["latest","Latest added"]], ui.reviewSort)}
        ${active ? '<button data-action="review-reset">Clear filters</button>' : ""}</div>
        <div class="result-count" role="status">${reviews.length} reviews across ${new Set(reviews.map((review) => review.film)).size} films</div>
        <div class="reviews-layout"><div id="review-feed" role="tabpanel" aria-label="${ui.reviewType === "all" ? "All reviews" : ui.reviewType === "short" ? "Short takes" : "Long essays"}">${reviews.slice(0, ui.reviewLimit).map((review) => reviewCard(review, true)).join("")}
        ${!reviews.length ? '<div class="empty"><h2>No reviews match those filters yet.</h2><button data-action="review-reset">Clear filters</button></div>' : ""}
        ${reviews.length > ui.reviewLimit ? '<div class="center"><button data-action="reviews-more">Show more reviews</button></div>' : ""}</div>
        <aside class="rail panel"><p class="eyebrow">An open notebook</p><h2>Reviewing this week</h2>${artFilms.map((film) => `<a href="${filmHref(film)}" class="rail-film">${poster(film)}<div><strong>${html(film.title)}</strong><div class="meta">${allReviews().filter((review) => review.film === film.slug).length} reviews · ★ ${aggregate(film).average.toFixed(2)}</div></div></a>`).join("")}<p class="muted" style="margin-top:20px">Both quick notes and patient essays belong here.</p></aside></div>
    </div>`;
}

function editor(film, inDialog = false)
{
    activateDraft(film.slug);
    const draft = state.draft;
    const type = ui.editorType;
    return `<form class="editor ${inDialog ? "" : "panel"}" id="${inDialog ? "dialog-editor" : "film-editor"}" data-film="${film.slug}" novalidate>
        ${inDialog ? `<label for="compose-film">Film</label><input id="compose-film" list="film-options" placeholder="Search all 100 film titles…" value="${html(film.title)}" required autocomplete="off"><datalist id="film-options">${catalog.map((entry) => `<option value="${html(entry.title)}"></option>`).join("")}</datalist>` : '<h2>Add to the conversation</h2>'}
        <p class="muted">Your words stay in this browser in this static edition.</p>
        <label>Your rating</label>${stars(film.slug, inDialog ? "dialog-stars" : "editor-stars")}
        <div class="tabs" role="tablist" aria-label="Review format"><button type="button" role="tab" aria-selected="${type === "short"}" data-action="editor-type" data-value="short">Short take</button><button type="button" role="tab" aria-selected="${type === "essay"}" data-action="editor-type" data-value="essay">Long essay</button></div>
        <div class="tabs" aria-label="Editor mode"><button type="button" aria-pressed="${!ui.editorPreview}" data-action="editor-mode" data-value="edit">Edit</button><button type="button" aria-pressed="${ui.editorPreview}" data-action="editor-mode" data-value="preview">Preview</button></div>
        ${ui.editorPreview ? `<div class="panel"><h3>${html(draft.title || (type === "essay" ? "Your essay title" : "Your short take"))}</h3><p style="white-space:pre-wrap">${html(draft.body || "Your words will appear here.")}</p></div>` : `
        ${type === "essay" ? `<label for="draft-title">Essay title</label><input id="draft-title" data-draft="title" maxlength="80" value="${html(draft.title || "")}" aria-describedby="editor-error">` : ""}
        <label for="draft-body">${type === "short" ? "What stayed with you?" : "Your essay"}</label><textarea id="draft-body" data-draft="body" maxlength="${type === "short" ? 280 : 2000}" ${type === "essay" ? 'style="min-height:240px"' : ""} aria-describedby="draft-counter editor-error">${html(draft.body || "")}</textarea><div class="counter" id="draft-counter">${(draft.body || "").length} / ${type === "short" ? 280 : 2000}${type === "essay" ? " · 40 characters minimum" : ""}</div>`}
        <div id="editor-error" class="error" role="status"></div>
        <div class="actions"><button type="submit" class="primary">${icon("pen")}Publish ${type === "essay" ? "essay" : "short take"}</button><button type="button" data-action="discard-draft">Discard draft</button></div><div id="discard-confirm"></div>
    </form>`;
}

function distributionPanel(film)
{
    const stats = aggregate(film);
    return `<aside class="panel distribution"><p class="eyebrow">A collective impression</p><h2>How the community rated it</h2><div class="rating-big"><span class="star">★</span> ${stats.average.toFixed(2)} <span class="meta">/ 5</span></div><p class="meta">${number(stats.total)} ratings</p>${stats.counts.map((count, index) => bar(`${5 - index} ★`, count, stats.total, "var(--ochre)")).join("")}${state.ratings[film.slug] ? '<p class="meta">Your rating is included in this distribution</p>' : ""}</aside>`;
}

function currentFilm()
{
    const slug = ui.route.split("/")[2];
    return slug ? filmBy(slug) || catalog[0] : featured;
}

function renderFilm()
{
    const film = currentFilm();
    const unknown = ui.route.split("/")[2] && !filmBy(ui.route.split("/")[2]);
    const reviews = allReviews().filter((review) => review.film === film.slug);
    const selected = sortedReviews(reviews.filter((review) => review.type === ui.filmTab), ui.filmSort[ui.filmTab]);
    const related = catalog.filter((entry) => entry.genre === film.genre && entry.slug !== film.slug).slice(0, 3);
    return `<div class="view"><div class="breadcrumb"><a href="${href("/")}">Discover</a> / ${html(film.title)}</div>
        ${unknown ? '<p class="notice">That film is not in this canon. Here is the first film instead.</p>' : ""}
        <section class="film-overview">${poster(film)}<div class="film-main"><p class="eyebrow">A film by ${html(film.director)}</p><h1>${html(film.title)}</h1><p class="meta">${film.year} · ${film.runtime}m · ${html(film.genre)} / ${html(film.secondary)}</p><p class="logline">${html(film.logline)}</p>
            <div class="film-actions"><div class="actions">${bookmark(film)}<button data-action="watched" data-film="${film.slug}" aria-pressed="${state.watched.includes(film.slug)}">${icon("check")}Watched</button></div><label>Your rating</label>${stars(film.slug)}
                ${state.ratings[film.slug] ? `<button data-action="remove-rating" data-film="${film.slug}">Remove rating</button>` : ""}
                <div class="actions"><button data-action="write-film" data-value="short">Write a short take</button><button data-action="write-film" data-value="essay">Write an essay</button></div>
            </div></div>${distributionPanel(film)}</section>
        <section class="section"><div class="section-heading"><h2>The conversation</h2><span class="meta">${reviews.length} notes on this film</span></div><div class="filters">${reviewTabs(ui.filmTab, "film-tab")}<span class="meta">${reviews.filter((review) => review.type === "short").length} short takes · ${reviews.filter((review) => review.type === "essay").length} long essays</span>${selectField("filmSort", "Sort", [["helpful","Most helpful"],["latest","Latest added"]], ui.filmSort[ui.filmTab])}</div>
        <div role="tabpanel" aria-label="${ui.filmTab === "short" ? "Short takes" : "Long essays"}" class="${ui.filmTab === "short" ? "two-col equal-col" : ""}" style="${ui.filmTab === "essay" ? "max-width:760px" : ""}">${selected.map((review) => reviewCard(review, false, ui.filmTab === "essay")).join("") || '<p class="empty">The notebook is open. Leave the first note on this film.</p>'}</div>
        ${editor(film)}</section>
        <section class="section"><div class="section-heading"><h2>More like this</h2><a class="text-link" href="${href("/rankings")}">See the full canon ${icon("arrow")}</a></div><div class="film-grid related" id="related-rail">${related.map((entry) => filmCard(entry, `Another ${film.genre.toLowerCase()} to sit with.`)).join("")}</div><div class="actions"><button data-action="rail-previous" aria-label="Previous related film">Previous</button><button data-action="rail-next" aria-label="Next related film">Next</button></div></section>
    </div>`;
}

function shelfFilms()
{
    return state[ui.shelf].map(filmBy).filter((film) => !ui.shelfSearch || film.title.toLowerCase().includes(ui.shelfSearch.toLowerCase()))
        .sort((a, b) => ui.shelfSort === "title" ? a.title.localeCompare(b.title) : ui.shelfSort === "rating" ? aggregate(b).average - aggregate(a).average :
            ((state.changes.findIndex((change) => change.slug === a.slug) + 1) || 1000) - ((state.changes.findIndex((change) => change.slug === b.slug) + 1) || 1000));
}

function renderLibrary()
{
    const films = shelfFilms();
    const watched = ui.shelf === "watched";
    return `<div class="view"><section class="shelf-header"><div><p class="eyebrow">${html(content.profile)}'s film diary</p><h1>Your shelves, your rules.</h1><p>Keep the maybes separate from the memories. Ratings and reviews follow every film you mark watched.</p><div class="actions"><a class="button" href="${href("/rankings")}">Browse the canon ${icon("arrow")}</a><button data-action="reset-diary">Reset sample diary</button></div><div id="reset-confirm"></div></div><div class="metrics">${metric(state.watched.length,"Watched")}${metric(state.queue.length,"Want to watch")}${metric(state.reviews.length,"Reviews written")}</div></section>
        <section class="section"><div class="filters"><div class="tabs" role="tablist" aria-label="Diary shelves">${[["watched","Watched"],["queue","Want to watch"]].map(([value,label]) => `<button role="tab" aria-selected="${ui.shelf === value}" tabindex="${ui.shelf === value ? 0 : -1}" data-action="shelf-tab" data-value="${value}">${label} · ${state[value].length}</button>`).join("")}</div>${textField("shelfSearch","Find on this shelf","Search your shelf…",ui.shelfSearch)}${selectField("shelfSort","Sort",[["recent","Recently changed"],["title","Title A–Z"],["rating","Community rating"]],ui.shelfSort)}</div>
        <p class="result-count" role="status">${films.length} films on this shelf</p><div class="shelf-grid" role="tabpanel" aria-label="${watched ? "Watched" : "Want to watch"}">
        ${films.map((film) => `<article class="panel shelf-card"><a href="${filmHref(film)}">${poster(film)}</a><div><h3><a href="${filmHref(film)}">${html(film.title)}</a></h3><p class="meta">${film.year} · ${html(film.genre)} · ${film.runtime}m<br>Community ★ ${aggregate(film).average.toFixed(2)}${watched ? `<br>Your rating: ${state.ratings[film.slug] ? `${state.ratings[film.slug]} / 5` : "Not rated yet"}` : ""}</p><div class="actions">${watched ? `<button data-action="inline-rate" data-film="${film.slug}">Rate</button><a class="button" href="${filmHref(film)}?compose=1">Write a review</a><button data-action="move-queue" data-film="${film.slug}">Move to want to watch</button>` : `<button data-action="watched" data-film="${film.slug}">Mark watched</button><button data-action="remove-list" data-film="${film.slug}">Remove</button>`}</div></div>${ui.inlineRating === film.slug ? `<div class="inline-rating">${stars(film.slug, "shelf-stars")}${state.ratings[film.slug] ? `<button data-action="remove-rating" data-film="${film.slug}">Remove rating</button>` : ""}</div>` : ""}</article>`).join("")}</div>
        ${!films.length ? `<div class="empty"><h2>${ui.shelfSearch ? "No films match that search." : watched ? "Your first watched film starts the diary." : "Your maybe-later shelf is open."}</h2><p>${ui.shelfSearch ? "Try another title or clear your search." : "Save a film from the canon."}</p><a class="button" href="${href("/rankings")}">${watched ? "Find a film" : "Browse films"}</a></div>` : ""}</section>
        <section class="section"><h2>Recently changed</h2>${state.changes.slice(0,6).map((change) => { const film = filmBy(change.slug); return `<a class="rail-film" href="${filmHref(film)}">${poster(film)}<div><strong>${html(film.title)}</strong><div class="meta">${html(change.action)}</div></div>${icon("arrow")}</a>`; }).join("")}</section></div>`;
}

function renderProfile()
{
    const genres = genreCounts().sort((a,b) => b.count - a.count || content.genres.indexOf(a.genre) - content.genres.indexOf(b.genre));
    const rated = Object.entries(state.ratings);
    const topRated = content.genres.map((genre) =>
    {
        const entries = rated.filter(([slug]) => filmBy(slug).genre === genre);
        return { genre, average: entries.length ? entries.reduce((sum, [,value]) => sum + value, 0) / entries.length : -1 };
    }).sort((a,b) => b.average - a.average)[0];
    const decades = Array.from({ length: 7 }, (_, index) =>
    {
        const decade = 1960 + index * 10;
        return { decade, count: state.watched.filter((slug) => Math.floor(filmBy(slug).year / 10) * 10 === decade).length };
    });
    const max = Math.max(1, ...decades.map((entry) => entry.count));
    const leastCount = Math.min(...genres.map((genre) => genre.count));
    const leastGenres = genres.filter((genre) => genre.count === leastCount).map((genre) => genre.genre);
    const recommendations = catalog.filter((film) => !state.watched.includes(film.slug) && leastGenres.includes(film.genre))
        .sort((a,b) => aggregate(b).average - aggregate(a).average || a.rank - b.rank).slice(0,3);
    return `<div class="view"><section class="profile-header"><div class="profile-identity"><span class="avatar">${initials(content.profile)}</span><div><p class="eyebrow">Taste profile</p><h1>${html(content.profile)}, your taste has a shape.</h1><p>Not a verdict. Just a useful map of what you return to, what you rate generously, and where your next surprise might live.</p><a class="button" href="${href("/library")}">Update your diary ${icon("arrow")}</a></div></div><div class="metrics">${metric(state.watched.length,"Films watched")}${metric(state.reviews.length,"Reviews written")}${metric(personalAverage(),"Average personal rating")}${metric(state.queue.length,"Want to watch")}</div></section>
        <div class="two-col equal-col profile-panels"><section class="panel"><h2>Genres you return to</h2><p class="muted">A share of your watched library, one primary genre per film.</p>${genres.map(({genre,count}) => bar(genre,count,state.watched.length)).join("")}</section><section class="panel"><h2>How you rate</h2><p class="muted">${rated.length} rated films · ${personalAverage()} average</p>${[5,4,3,2,1].map((value) => bar(`${value} stars`,rated.filter(([,rating]) => rating === value).length,rated.length,"var(--ochre)")).join("")}<p class="serif" style="font-size:26px;margin-top:28px">${rated.length ? `You watch ${html(genres[0].genre.toLowerCase())} most often; ${html(topRated.genre.toLowerCase())} earns your highest average.` : "Your next rating will begin a new map."}</p></section></div>
        <div class="two-col profile-panels"><section class="panel"><h2>Your decades</h2><p class="muted">When the films on your shelf were made.</p><div class="decades" role="img" aria-label="${decades.map(({decade,count}) => `${decade}s: ${count} films`).join("; ")}">${decades.map(({decade,count}) => `<div class="decade"><b>${count}</b><div style="height:${count / max * 160}px"></div><span>${decade}s</span></div>`).join("")}</div></section><section class="panel"><h2>A different corner of the canon</h2>${recommendations.map((film) => `<article class="recommendation"><a href="${filmHref(film)}">${poster(film)}</a><div><h3><a href="${filmHref(film)}">${html(film.title)}</a></h3><p>${html(film.logline)}</p><p class="meta">You have watched ${leastCount} ${html(film.genre.toLowerCase())} films. Start here. · ★ ${aggregate(film).average.toFixed(2)}</p>${bookmark(film)}</div></article>`).join("") || '<p>You have watched every film in your least-watched genres. Explore the full canon for a rewatch.</p>'}<a class="text-link" href="${href("/rankings")}">Explore the full canon ${icon("arrow")}</a></section></div>
        <section class="section"><div class="section-heading"><h2>In your own words</h2><a class="text-link" href="${href("/reviews?compose=1")}">Write another review ${icon("arrow")}</a></div><div class="recent-grid">${[...state.reviews].sort((a,b) => b.sequence - a.sequence).slice(0,3).map((review) => reviewCard(review,true)).join("") || '<p>Your review notebook is ready.</p>'}</div></section></div>`;
}

function preserveFocus(callback)
{
    const active = document.activeElement;
    const id = active?.id;
    const action = active?.dataset.action;
    const film = active?.dataset.film;
    const value = active?.dataset.value;
    const reviewId = active?.dataset.id;
    let start, end;
    try
    {
        start = active?.selectionStart;
        end = active?.selectionEnd;
    }
    catch {}
    callback();
    let replacement = id ? document.getElementById(id) : null;
    if (!replacement && action)
    {
        replacement = $$(`[data-action="${action}"]`).find((element) => (!film || element.dataset.film === film) && (!value || element.dataset.value === value) && (!reviewId || element.dataset.id === reviewId));
    }
    replacement?.focus({ preventScroll: true });
    if (typeof start === "number" && replacement?.setSelectionRange)
    {
        try { replacement.setSelectionRange(start,end); } catch {}
    }
}

function renderMain()
{
    preserveFocus(() =>
    {
        main.innerHTML = ui.route.startsWith("/film") ? renderFilm() : ui.route === "/reviews" ? renderReviews() :
            ui.route === "/rankings" ? renderRankings() : ui.route === "/library" ? renderLibrary() :
            ui.route === "/profile" ? renderProfile() : renderHome();
    });
    const title = ui.route.startsWith("/film") ? currentFilm().title : content.nav.find(([route]) => route === ui.route)?.[1] || "Discover";
    document.title = `${title} — ${content.brand}`;
}

function navigate()
{
    if (composer.open) composer.close();
    if (mobileMenu.open) mobileMenu.close();
    const hash = location.hash.slice(1) || "/";
    const [route, query] = hash.split("?");
    ui.route = route;
    renderShell();
    renderMain();
    window.scrollTo(0,0);
    const parameters = new URLSearchParams(query);
    if (parameters.get("compose") === "1")
    {
        if (route === "/reviews") openComposer();
        else if (route.startsWith("/film")) focusEditor("short");
    }
}

function openComposer()
{
    ui.dialogReturn = document.activeElement;
    const film = filmBy(state.draft.film) || featured;
    composer.innerHTML = `<div class="dialog-top"><h2 id="dialog-title">Add to the conversation</h2><button data-action="close-composer" aria-label="Close review composer" class="icon-button">${icon("close")}</button></div>${editor(film,true)}`;
    composer.showModal();
    document.body.style.overflow = "hidden";
    $("#compose-film", composer).focus();
}

function refreshEditor()
{
    if (composer.open)
    {
        const film = filmBy($("#dialog-editor").dataset.film) || featured;
        $("#dialog-editor").outerHTML = editor(film,true);
    }
    else
    {
        $("#film-editor").outerHTML = editor(currentFilm());
    }
}

function activateDraft(slug)
{
    state.drafts ||= {};
    if (state.draft.film === slug) return;
    if (filmBy(state.draft.film)) state.drafts[state.draft.film] = { ...state.draft };
    const stored = state.drafts[slug];
    state.draft = stored && typeof stored.body === "string" ?
        { film: slug, body: stored.body, title: typeof stored.title === "string" ? stored.title : "", type: stored.type === "essay" ? "essay" : "short" } : { film: slug };
    ui.editorType = state.draft.type || "short";
    save();
}

function focusEditor(type)
{
    ui.editorType = type;
    ui.editorPreview = false;
    state.draft.type = type;
    state.draft.film = currentFilm().slug;
    save();
    renderMain();
    $("#film-editor").scrollIntoView({ block: "start" });
    $("#draft-body")?.focus({ preventScroll: true });
}

function publish(form)
{
    const film = form.id === "dialog-editor" ? catalog.find((entry) => entry.title.toLowerCase() === $("#compose-film").value.trim().toLowerCase()) : filmBy(form.dataset.film);
    const body = (state.draft.body || "").trim();
    const title = (state.draft.title || "").trim();
    const type = ui.editorType;
    let error = "";
    if (!film) error = "Choose a film from the 100-film catalog.";
    else if (!state.ratings[film.slug]) error = "Choose a star rating before publishing.";
    else if (!body) error = "Write what stayed with you before publishing.";
    else if (type === "short" && body.length > 280) error = "Short takes must be 280 characters or fewer.";
    else if (type === "essay" && (!title || title.length > 80)) error = "Give your essay a title of 1–80 characters.";
    else if (type === "essay" && (body.length < 40 || body.length > 2000)) error = "Your essay needs 40–2,000 characters.";
    if (error)
    {
        $("#editor-error",form).textContent = error;
        return;
    }
    const sequence = Math.max(0,...state.reviews.map((review) => review.sequence)) + 1;
    const review = { id: `local-${sequence}`, film: film.slug, author: content.profile, type, title: type === "essay" ? title : "", body, stars: state.ratings[film.slug], helpful: 0, sequence };
    state.reviews.unshift(review);
    delete state.drafts?.[film.slug];
    state.draft = {};
    changed(film.slug,"Reviewed");
    ui.editorPreview = false;
    ui.reviewSort = "latest";
    ui.reviewSearch = "";
    ui.reviewGenre = "";
    ui.reviewType = "all";
    ui.reviewLimit = 6;
    ui.filmSort[type] = "latest";
    ui.filmTab = type;
    if (composer.open) composer.close();
    renderMain();
    $(`#review-heading-${review.id}`)?.focus({ preventScroll: false });
    announce("Your review is on this film page. Saved only in this browser.");
}

function searchCatalog(value)
{
    const results = $("#catalog-results");
    const term = value.trim().toLowerCase();
    if (!term)
    {
        results.innerHTML = "";
        $("#catalog-search").setAttribute("aria-expanded","false");
        return;
    }
    const films = catalog.filter((film) => `${film.title} ${film.genre} ${film.secondary} ${film.logline}`.toLowerCase().includes(term)).slice(0,8);
    results.innerHTML = films.map((film) => `<a href="${filmHref(film)}">${html(film.title)}<div class="meta">${film.year} · ${html(film.genre)} · ★ ${aggregate(film).average.toFixed(2)}</div></a>`).join("") || '<p>No films match. Try a title, genre, or mood.</p>';
    $("#catalog-search").setAttribute("aria-expanded","true");
}

document.addEventListener("input", (event) =>
{
    const target = event.target;
    if (target.id === "catalog-search") searchCatalog(target.value);
    if (target.dataset.filter)
    {
        if (target.dataset.filter !== "filmSort") ui[target.dataset.filter] = target.value;
        if (target.dataset.filter.startsWith("canon")) ui.canonLimit = 20;
        if (target.dataset.filter.startsWith("review")) ui.reviewLimit = 6;
        if (target.dataset.filter === "filmSort") ui.filmSort[ui.filmTab] = target.value;
        renderMain();
    }
    if (target.dataset.draft)
    {
        state.draft[target.dataset.draft] = target.value;
        state.draft.type = ui.editorType;
        state.draft.film = target.closest("form").dataset.film;
        save();
        if (target.dataset.draft === "body") $("#draft-counter").textContent = `${target.value.length} / ${ui.editorType === "short" ? 280 : 2000}${ui.editorType === "essay" ? " · 40 characters minimum" : ""}`;
    }
    if (target.id === "compose-film")
    {
        const film = catalog.find((entry) => entry.title.toLowerCase() === target.value.toLowerCase());
        if (film)
        {
            activateDraft(film.slug);
            save();
            const form = target.closest("form");
            form.dataset.film = film.slug;
            refreshEditor();
            $("#compose-film").focus();
        }
    }
});

document.addEventListener("submit", (event) =>
{
    if (event.target.matches(".editor"))
    {
        event.preventDefault();
        publish(event.target);
    }
});

document.addEventListener("click", (event) =>
{
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const { action, film: slug, value, id } = target.dataset;
    if (action === "rate")
    {
        const inDialog = composer.open;
        rate(slug,Number(value));
        if (inDialog)
        {
            refreshEditor();
            $(`#dialog-stars-${value}`)?.focus();
        }
    }
    else if (action === "bookmark") listChange(slug,state.queue.includes(slug) ? "remove" : "queue");
    else if (action === "watched") listChange(slug,state.watched.includes(slug) ? "remove" : "watched");
    else if (action === "move-queue") listChange(slug,"queue");
    else if (action === "remove-list") listChange(slug,"remove");
    else if (action === "remove-rating")
    {
        delete state.ratings[slug];
        changed(slug,"Removed rating");
        renderMain();
        announce("Rating removed. The prior community aggregate has been restored.");
    }
    else if (action === "helpful")
    {
        state.votes = state.votes.includes(id) ? state.votes.filter((entry) => entry !== id) : [...state.votes,id];
        save();
        renderMain();
        announce(state.votes.includes(id) ? "Helpful vote saved." : "Helpful vote removed.");
    }
    else if (action === "report") announce("Thanks for the feedback. This static edition does not send reports.");
    else if (action === "expand")
    {
        if (ui.expanded.has(id)) ui.expanded.delete(id);
        else ui.expanded.add(id);
        if (ui.collapsed.has(id)) ui.collapsed.delete(id);
        else ui.collapsed.add(id);
        renderMain();
    }
    else if (action === "film-tab") { ui.filmTab = value; renderMain(); }
    else if (action === "review-tab") { ui.reviewType = value; ui.reviewLimit = 6; renderMain(); }
    else if (action === "shelf-tab") { ui.shelf = value; ui.shelfSearch = ""; renderMain(); }
    else if (action === "canon-more") { ui.canonLimit += 20; renderMain(); }
    else if (action === "reviews-more") { ui.reviewLimit += 6; renderMain(); }
    else if (action === "canon-reset")
    {
        Object.assign(ui,{ canonSearch: "", canonGenre: "", canonDecade: "", canonMinimum: "", canonSort: "rank", canonLimit: 20 });
        renderMain();
    }
    else if (action === "review-reset")
    {
        Object.assign(ui,{ reviewSearch: "", reviewGenre: "", reviewType: "all", reviewSort: "helpful", reviewLimit: 6 });
        renderMain();
    }
    else if (action === "inline-rate")
    {
        ui.inlineRating = ui.inlineRating === slug ? "" : slug;
        renderMain();
        $(".inline-rating .rating-input button[tabindex='0']")?.focus();
    }
    else if (action === "write-film") focusEditor(value);
    else if (action === "compose") openComposer();
    else if (action === "close-composer") composer.close();
    else if (action === "editor-type")
    {
        ui.editorType = value;
        state.draft.type = value;
        ui.editorPreview = false;
        save();
        refreshEditor();
        $(`[data-action="editor-type"][data-value="${value}"]`)?.focus();
    }
    else if (action === "editor-mode")
    {
        ui.editorPreview = value === "preview";
        refreshEditor();
        $(`[data-action="editor-mode"][data-value="${value}"]`)?.focus();
    }
    else if (action === "discard-draft") $("#discard-confirm").innerHTML = '<p>Discard the saved text? Your rating will stay.</p><button type="button" data-action="confirm-discard">Discard text</button><button type="button" data-action="cancel-discard">Keep writing</button>';
    else if (action === "confirm-discard")
    {
        delete state.drafts?.[state.draft.film];
        state.draft = {};
        ui.editorPreview = false;
        save();
        refreshEditor();
        announce("Draft discarded.");
    }
    else if (action === "cancel-discard") $("#discard-confirm").innerHTML = "";
    else if (action === "reset-diary") $("#reset-confirm").innerHTML = '<p>This restores the original fictional profile and removes your local ratings, reviews, votes, and drafts.</p><button data-action="confirm-reset">Restore original diary</button><button data-action="cancel-reset">Keep my changes</button>';
    else if (action === "cancel-reset") $("#reset-confirm").innerHTML = "";
    else if (action === "confirm-reset")
    {
        state = initialState();
        ui.shelf = "watched";
        save();
        renderMain();
        $('[data-action="shelf-tab"][data-value="watched"]').focus();
        announce("Original fictional diary restored.");
    }
    else if (action === "menu")
    {
        ui.dialogReturn = target;
        mobileMenu.innerHTML = `<div class="dialog-top"><span class="brand">${html(content.brand)}</span><button data-action="close-menu" aria-label="Close menu">${icon("close")}</button></div><nav>${navLinks()}</nav>`;
        mobileMenu.showModal();
        document.body.style.overflow = "hidden";
    }
    else if (action === "close-menu") mobileMenu.close();
    else if (action === "search-toggle")
    {
        $(".search-wrap").classList.toggle("open");
        $("#catalog-search").focus();
    }
    else if (action === "rail-next" || action === "rail-previous")
    {
        const rail = $("#related-rail");
        rail.scrollBy({ left: (action === "rail-next" ? 1 : -1) * (rail.firstElementChild.clientWidth + 12), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
});

document.addEventListener("keydown", (event) =>
{
    const target = event.target;
    const isField = /INPUT|TEXTAREA|SELECT/.test(target.tagName) || target.isContentEditable;
    if (event.key === "/" && !isField && !composer.open && !mobileMenu.open)
    {
        event.preventDefault();
        $(".search-wrap").classList.add("open");
        $("#catalog-search").focus();
    }
    if (event.key === "Escape")
    {
        $("#catalog-results").innerHTML = "";
        $("#catalog-search").setAttribute("aria-expanded","false");
        if (!composer.open && !mobileMenu.open) $(".search-wrap").classList.remove("open");
    }
    if (target.id === "catalog-search" && (event.key === "ArrowDown" || event.key === "Enter"))
    {
        const first = $("#catalog-results a");
        if (first)
        {
            event.preventDefault();
            if (event.key === "Enter") first.click();
            else first.focus();
        }
    }
    if (target.closest("#catalog-results") && ["ArrowDown","ArrowUp"].includes(event.key))
    {
        event.preventDefault();
        const links = $$("#catalog-results a");
        const index = links.indexOf(target);
        if (event.key === "ArrowUp" && index === 0) $("#catalog-search").focus();
        else links[(index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
    }
    if (target.closest(".rating-input") && ["ArrowLeft","ArrowRight"].includes(event.key))
    {
        event.preventDefault();
        const value = Math.max(1,Math.min(5,Number(target.dataset.value) + (event.key === "ArrowRight" ? 1 : -1)));
        const group = target.closest(".rating-input");
        const idPrefix = target.id.replace(/-\d$/,"");
        const inDialog = composer.open;
        rate(group.dataset.slug,value);
        if (inDialog) refreshEditor();
        document.getElementById(`${idPrefix}-${value}`)?.focus({ preventScroll: true });
    }
    if (target.getAttribute("role") === "tab" && ["ArrowLeft","ArrowRight","Home","End"].includes(event.key))
    {
        event.preventDefault();
        const tabs = $$('[role="tab"]',target.closest('[role="tablist"]'));
        const index = tabs.indexOf(target);
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click();
        const replacement = $$(`[data-action="${target.dataset.action}"]`).find((tab) => tab.dataset.value === tabs[next].dataset.value);
        replacement?.focus();
    }
    if (event.key === "Tab" && (composer.open || mobileMenu.open))
    {
        const dialog = composer.open ? composer : mobileMenu;
        const focusable = $$('a[href],button,input,textarea,select,[tabindex="0"]',dialog).filter((element) => !element.disabled && element.getAttribute("tabindex") !== "-1");
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && target === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && target === last) { event.preventDefault(); first.focus(); }
    }
});

for (const dialog of [composer,mobileMenu])
{
    dialog.addEventListener("close", () =>
    {
        document.body.style.overflow = "";
        ui.dialogReturn?.focus?.({ preventScroll: true });
    });
}

document.addEventListener("click", (event) =>
{
    if (!event.target.closest(".search-wrap") && !event.target.closest('[data-action="search-toggle"]'))
    {
        $("#catalog-results").innerHTML = "";
        $("#catalog-search").setAttribute("aria-expanded","false");
    }
});

window.addEventListener("hashchange", navigate);
document.addEventListener("pointerover", (event) => previewRating(event.target));
document.addEventListener("focusin", (event) => previewRating(event.target));
document.addEventListener("pointerout", (event) =>
{
    const group = event.target.closest(".rating-input");
    if (group && !group.contains(event.relatedTarget)) restoreRating(group);
});
document.addEventListener("focusout", (event) =>
{
    const group = event.target.closest(".rating-input");
    if (group && !group.contains(event.relatedTarget)) restoreRating(group);
});

function previewRating(target)
{
    const button = target.closest('[data-action="rate"]');
    if (!button) return;
    const group = button.closest(".rating-input");
    const value = Number(button.dataset.value);
    $$("button",group).forEach((entry) => entry.classList.toggle("filled",Number(entry.dataset.value) <= value));
    group.nextElementSibling.textContent = `${value} out of 5`;
}

function restoreRating(group)
{
    const value = state.ratings[group.dataset.slug] || 0;
    $$("button",group).forEach((entry) => entry.classList.toggle("filled",Number(entry.dataset.value) <= value));
    group.nextElementSibling.textContent = value ? `${value} out of 5` : "Not rated yet";
}

save();
navigate();
