import { content as c } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => (
{
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[character]);
const lines = (text) => escape(text).replaceAll("\n", "<br>");
const icon = (name) => `<img src="${c.ui.icons}${name}.svg" alt="" width="20" height="20" aria-hidden="true">`;
const wordmark = () => `<span class="wordmark"><span class="brand-star" aria-hidden="true"></span>${c.brand}</span>`;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.title = `${c.brand} — ${c.ui.pageTitle}`;
$("#app").innerHTML = `
    <a class="skip" href="#reading-hero">${c.ui.skip}</a>
    <div class="shell">
        <header class="site-header">
            ${wordmark()}
            <nav aria-label="${c.header.guide}">
                <a href="#deck">${c.header.deck}</a>
                <a href="#guide">${c.header.guide}</a>
            </nav>
            <span class="disclaimer-pill">${c.header.note}</span>
        </header>
        <main>
            <section class="hero" id="reading-hero" aria-labelledby="hero-title">
                <div class="hero-copy">
                    <p class="eyebrow">${c.deck.toUpperCase()}<br>${c.hero.eyebrow}</p>
                    <h1 id="hero-title">${escape(c.title.split("\n")[0])}<br><span class="quiet">${escape(c.title.split("\n")[1])}</span></h1>
                    <p class="tagline">${c.tagline}</p>
                    <p class="intro">${c.intro}</p>
                    <div class="mode-switch" role="group" aria-label="${c.ui.modes}">
                        <button type="button" data-mode="daily" aria-pressed="true">${c.hero.daily}</button>
                        <button type="button" data-mode="three" aria-pressed="false">${c.hero.three}</button>
                    </div>
                    <p class="helper" id="mode-help">${c.hero.dailyHelp}</p>
                    <div class="hero-actions">
                        <button class="button" id="primary" type="button" aria-describedby="mode-help">${icon("shuffle")}<span>${c.hero.shuffle}</span>${icon("arrow")}</button>
                        <a class="text-link" href="#guide">${c.header.guide}</a>
                    </div>
                    <p class="privacy-line">${c.disclaimer}</p>
                </div>
                <div class="reading-table" data-state="idle" id="table" aria-busy="false">
                    <div class="table-top"><span>${c.hero.tableLabel}</span>${icon("sparkles")}</div>
                    <div id="table-content"></div>
                    <div class="table-bottom">${c.hero.tableFooter}</div>
                </div>
            </section>
            <section class="journal" id="journal" hidden aria-labelledby="journal-title">
                <div class="journal-layout">
                    <div>
                        <p class="eyebrow">${c.journal.eyebrow}</p>
                        <h2 id="journal-title">${c.journal.title}</h2>
                        <p class="section-note">${c.journal.note}</p>
                    </div>
                    <form id="journal-form">
                        <label for="reflection">${c.journal.label}</label>
                        <textarea id="reflection" maxlength="4000" placeholder="${c.journal.placeholder}"></textarea>
                        <div class="journal-actions">
                            <button class="button" type="submit">${c.journal.save}</button>
                            <button class="button secondary" id="clear-note" type="button">${c.journal.clear}</button>
                        </div>
                        <p class="status" id="journal-status" role="status"></p>
                    </form>
                </div>
            </section>
            <section class="section" id="guide" aria-labelledby="guide-title">
                <div class="guide-layout">
                    <div>
                        <p class="eyebrow">${c.guide.eyebrow}</p>
                        <h2 id="guide-title">${lines(c.guide.title)}</h2>
                        <p class="section-note">${lines(c.guide.note)}</p>
                    </div>
                    <div>${c.guide.steps.map(([title, text], index) => `
                        <article class="step">
                            <span class="step-number">${String(index + 1).padStart(2, "0")}</span>
                            <h3>${title}</h3>
                            <p>${text}</p>
                        </article>`).join("")}
                    </div>
                </div>
                <div class="position-strip">${c.guide.positions.map(([title, text]) => `<p><strong>${title}</strong> — ${text}</p>`).join("")}</div>
            </section>
            <section class="section" id="deck" aria-labelledby="deck-title">
                <div class="section-heading">
                    <div><p class="eyebrow">${c.gallery.eyebrow}</p><h2 id="deck-title">${lines(c.gallery.title)}</h2></div>
                    <p class="section-note">${c.deckIntro}</p>
                </div>
                <div class="deck-gallery">${c.cards.map((card, index) => `
                    <button class="deck-card" type="button" data-card="${card.id}" aria-label="${c.gallery.open} ${card.name}">
                        <span class="art-frame"><img src="${card.art}" alt="${card.alt}" width="300" height="400" loading="lazy"></span>
                        <span class="deck-label"><span class="deck-number">${String(index + 1).padStart(2, "0")}</span>${card.name}</span>
                    </button>`).join("")}
                </div>
                <p class="gallery-hint">${c.gallery.hint}</p>
            </section>
            <section class="section studio-layout" id="studio" aria-labelledby="studio-title">
                <div class="studio-copy">
                    <p class="eyebrow">${c.studio.eyebrow}</p>
                    <h2 id="studio-title">${lines(c.studio.title)}</h2>
                    <p class="section-note">${c.studio.text}</p>
                    <button class="button" id="download" type="button" disabled>${icon("download")}${c.studio.download}</button>
                    <p class="status" id="image-status" role="status">${c.studio.before}</p>
                    <p class="privacy-note">${c.studio.privacy}</p>
                </div>
                <div class="studio-preview"><canvas id="share-canvas" width="1080" height="1350" role="img" aria-label="${c.studio.preview}"></canvas></div>
            </section>
            <section class="section" aria-labelledby="faq-title">
                <div class="faq">
                    <p class="eyebrow">${c.faq.eyebrow}</p>
                    <h2 id="faq-title">${c.faq.title}</h2>
                    ${c.faq.entries.map(([question, answer]) => `<details><summary>${question}${icon("chevron")}</summary><p>${answer}</p></details>`).join("")}
                    <div class="disclaimer"><strong>${c.disclaimer}.</strong><p>${c.faq.closing}</p></div>
                </div>
            </section>
        </main>
        <footer>${wordmark()}<p>${c.footer.text}</p><a href="${c.footer.link}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a></footer>
    </div>
    <dialog id="card-dialog" aria-labelledby="dialog-title">
        <button class="close-dialog" type="button" aria-label="${c.gallery.close}">${icon("close")}</button>
        <div id="dialog-content"></div>
    </dialog>
`;

function localDate()
{
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function dailyKey(date)
{
    return `${c.slug}:reading:${date}`;
}

function readDaily(date)
{
    try
    {
        const saved = JSON.parse(localStorage.getItem(dailyKey(date)));
        if (saved?.version === 1 && saved.date === date && saved.mode === "daily" &&
            c.cards.some((card) => card.id === saved.id) && ["upright", "reversed"].includes(saved.orientation))
        {
            return { id: saved.id, orientation: saved.orientation };
        }
    }
    catch
    {
        return null;
    }
    return null;
}

function seed(text)
{
    let number = 2166136261;
    for (const character of text)
    {
        number = Math.imul(number ^ character.charCodeAt(0), 16777619) >>> 0;
    }
    return number;
}

function dailyDraw(date)
{
    const number = seed(`${c.slug}:${date}`);
    return { id: c.cards[number % c.cards.length].id, orientation: (number >>> 8) % 4 === 0 ? "reversed" : "upright" };
}

function randomUnit()
{
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] / 4294967296;
}

function threeDraw()
{
    const deck = [...c.cards];
    for (let index = deck.length - 1; index > 0; index--)
    {
        const other = Math.floor(randomUnit() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    return deck.slice(0, 3).map((card) => (
    {
        id: card.id,
        orientation: randomUnit() < .25 ? "reversed" : "upright"
    }));
}

const initialDate = localDate();
let daily = readDaily(initialDate);
const machine =
{
    state: daily ? "revealed" : "idle",
    mode: "daily",
    date: initialDate,
    result: daily ? [daily] : [],
    timer: null,
    revision: 0
};
const transitions =
{
    idle: ["shuffling"],
    shuffling: ["ready"],
    ready: ["revealing"],
    revealing: ["revealed"],
    revealed: ["shuffling"]
};

function cancelPending()
{
    window.clearTimeout(machine.timer);
    machine.timer = null;
    machine.revision++;
}

function transition(next)
{
    if (!transitions[machine.state].includes(next))
    {
        return false;
    }
    machine.state = next;
    render();
    return true;
}

function waitThen(callback, duration)
{
    const revision = machine.revision;
    machine.timer = window.setTimeout(() =>
    {
        machine.timer = null;
        if (revision === machine.revision)
        {
            callback();
        }
    }, reducedMotion.matches ? 0 : duration);
}

function syncLocalDay()
{
    const date = localDate();
    if (date === machine.date)
    {
        return false;
    }
    cancelPending();
    machine.date = date;
    daily = readDaily(date);
    machine.result = machine.mode === "daily" && daily ? [daily] : [];
    machine.state = machine.result.length ? "revealed" : "idle";
    render();
    return true;
}

function orientation(item)
{
    return item.orientation === "reversed" ? c.hero.reversed : c.hero.upright;
}

function cardFor(item)
{
    return c.cards.find((card) => card.id === item.id);
}

function interpretation(item)
{
    const card = cardFor(item);
    return `${card[item.orientation]} ${card.expansion}`;
}

function cardMarkup(item, index)
{
    const card = cardFor(item);
    return `
        <div class="reading-slot" data-result-id="${item.id}" data-orientation="${item.orientation}">
            ${machine.mode === "three" ? `<p class="card-position">${c.hero.positions[index]}</p>` : ""}
            <div class="physical-card">
                <div class="card-inner" style="--delay: ${index * 140}ms">
                    <div class="card-side back" aria-hidden="true"></div>
                    <div class="card-side front"><img src="${card.art}" alt="${card.alt}" class="${item.orientation === "reversed" ? "art-reversed" : ""}"></div>
                </div>
            </div>
        </div>`;
}

function meaningMarkup(item, index)
{
    const card = cardFor(item);
    if (machine.mode === "daily")
    {
        return `<div class="meaning"><p class="eyebrow">${c.hero.today}</p><h3>${card.name}</h3><span class="orientation">${orientation(item)}</span><p>${interpretation(item)}</p><p class="question">${card.prompt}</p></div>`;
    }
    return `<details class="meaning" ${window.innerWidth > 520 || index === 0 ? "open" : ""}><summary>${card.name}${icon("chevron")}</summary><span class="orientation">${c.hero.positions[index]} · ${orientation(item)}</span><p>${interpretation(item)}</p><p class="question">${card.prompt}</p></details>`;
}

function renderTable()
{
    const table = $("#table");
    table.dataset.state = machine.state;
    table.setAttribute("aria-busy", String(["shuffling", "revealing"].includes(machine.state)));
    if (["idle", "shuffling", "ready"].includes(machine.state))
    {
        $("#table-content").innerHTML = `
            <div class="fan-stage" aria-hidden="true">
                <p class="table-invitation">${lines(c.hero.tableAside)}</p>
                ${c.cards.map((card, index) =>
                {
                    const angles = [-18, -11, -4, 4, 11, 18];
                    return `<div class="fan-card" style="--offset: ${(index - 2.5) * 34}px; --rise: ${Math.abs(index - 2.5) * 5}px; --angle: ${angles[index]}deg; --split: ${index % 2 ? 52 : -52}px"><img src="${c.ui.cardBack}" alt=""></div>`;
                }).join("")}
            </div>
            <p class="fan-instruction" role="status">${machine.state === "ready" ? c.hero.ready : machine.state === "shuffling" ? c.hero.shuffling : c.hero.instruction}</p>`;
        return;
    }
    const cardRow = `<div class="reading-cards">${machine.result.map(cardMarkup).join("")}</div>`;
    $("#table-content").innerHTML = `
        <div class="reading ${machine.mode}">
            <h2 class="reading-heading" id="reading-heading" tabindex="-1" aria-live="polite">${machine.mode === "daily" ? c.hero.dailyHeading : c.hero.threeHeading}</h2>
            ${machine.mode === "daily" ? `<div class="daily-layout">${cardRow}${meaningMarkup(machine.result[0], 0)}</div>` : `${cardRow}<div class="interpretations">${machine.result.map(meaningMarkup).join("")}</div>`}
        </div>`;
}

function journalKey()
{
    return `${c.slug}:journal:${machine.date}:${machine.mode}`;
}

let loadedJournal = "";
function renderJournal()
{
    const visible = machine.state === "revealed";
    $("#journal").hidden = !visible;
    if (!visible || loadedJournal === journalKey())
    {
        return;
    }
    loadedJournal = journalKey();
    try
    {
        const stored = JSON.parse(localStorage.getItem(loadedJournal));
        $("#reflection").value = typeof stored?.text === "string" ? stored.text.slice(0, 4000) : "";
        $("#journal-status").textContent = stored?.text ? c.journal.saved : "";
    }
    catch
    {
        $("#reflection").value = "";
        $("#journal-status").textContent = "";
    }
}

function render()
{
    for (const button of document.querySelectorAll("[data-mode]"))
    {
        button.setAttribute("aria-pressed", String(button.dataset.mode === machine.mode));
        button.disabled = ["shuffling", "revealing"].includes(machine.state);
    }
    $("#mode-help").textContent = machine.mode === "daily" ? c.hero.dailyHelp : c.hero.threeHelp;
    const primary = $("#primary");
    const busy = ["shuffling", "revealing"].includes(machine.state);
    primary.disabled = busy || (machine.state === "revealed" && machine.mode === "daily");
    const label = machine.state === "idle" ? c.hero.shuffle :
        machine.state === "shuffling" ? c.hero.shuffling :
        machine.state === "ready" ? (machine.mode === "daily" ? c.hero.revealDaily : c.hero.revealThree) :
        machine.state === "revealing" ? c.hero.revealing :
        machine.mode === "daily" ? c.hero.saved : c.hero.again;
    primary.innerHTML = `${icon(machine.state === "ready" ? "sparkles" : "shuffle")}<span>${label}</span>${machine.state === "idle" || machine.state === "ready" ? icon("arrow") : ""}`;
    renderTable();
    renderJournal();
    updateCanvas();
}

$("#primary").addEventListener("click", () =>
{
    if (syncLocalDay())
    {
        return;
    }
    if (machine.state === "idle" || (machine.state === "revealed" && machine.mode === "three"))
    {
        cancelPending();
        machine.result = [];
        transition("shuffling");
        waitThen(() => transition("ready"), 1100);
    }
    else if (machine.state === "ready")
    {
        machine.result = machine.mode === "daily" ? [daily || dailyDraw(machine.date)] : threeDraw();
        if (machine.mode === "daily")
        {
            daily = machine.result[0];
            try
            {
                localStorage.setItem(dailyKey(machine.date), JSON.stringify(
                {
                    version: 1,
                    date: machine.date,
                    ...daily,
                    mode: "daily"
                }));
            }
            catch
            {
                // The date-seeded reading remains stable when browser storage is unavailable.
            }
        }
        transition("revealing");
        waitThen(() =>
        {
            transition("revealed");
            $("#reading-heading")?.focus({ preventScroll: true });
        }, machine.mode === "three" ? 1280 : 1000);
    }
});

for (const button of document.querySelectorAll("[data-mode]"))
{
    button.addEventListener("click", () =>
    {
        syncLocalDay();
        if (button.dataset.mode === machine.mode || ["shuffling", "revealing"].includes(machine.state))
        {
            return;
        }
        cancelPending();
        machine.date = localDate();
        machine.mode = button.dataset.mode;
        daily = readDaily(machine.date) || daily;
        machine.result = machine.mode === "daily" && daily ? [daily] : [];
        machine.state = machine.result.length ? "revealed" : "idle";
        loadedJournal = "";
        render();
    });
}

document.addEventListener("visibilitychange", () =>
{
    if (!document.hidden)
    {
        if (syncLocalDay())
        {
            return;
        }
    }
});
window.addEventListener("pagehide", cancelPending);

$("#journal-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    syncLocalDay();
    try
    {
        localStorage.setItem(journalKey(), JSON.stringify({ version: 1, text: $("#reflection").value }));
        $("#journal-status").textContent = c.journal.saved;
    }
    catch
    {
        $("#journal-status").textContent = c.journal.unavailable;
    }
});
$("#reflection").addEventListener("input", () =>
{
    $("#journal-status").textContent = c.journal.unsaved;
});
$("#clear-note").addEventListener("click", () =>
{
    $("#reflection").value = "";
    try
    {
        localStorage.removeItem(journalKey());
        $("#journal-status").textContent = c.journal.cleared;
    }
    catch
    {
        $("#journal-status").textContent = c.journal.unavailable;
    }
});

const dialog = $("#card-dialog");
let invoker;
for (const button of document.querySelectorAll("[data-card]"))
{
    button.addEventListener("click", () =>
    {
        const card = c.cards.find((entry) => entry.id === button.dataset.card);
        invoker = button;
        $("#dialog-content").innerHTML = `
            <div class="dialog-layout">
                <img class="dialog-art" src="${card.art}" alt="${card.alt}" width="300" height="400">
                <div class="dialog-copy">
                    <p class="eyebrow">${c.deck}</p><h2 id="dialog-title">${card.name}</h2>
                    <h3>${c.hero.upright}</h3><p>${card.upright}</p>
                    <h3>${c.hero.reversed}</h3><p>${card.reversed}</p>
                    <h3>${c.hero.question}</h3><p>${card.prompt}</p>
                </div>
            </div>`;
        dialog.showModal();
    });
}
$(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => invoker?.focus({ preventScroll: true }));
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        {
            dialog.close();
        }
    }
});
window.addEventListener("resize", () =>
{
    if (window.innerWidth > 520)
    {
        document.querySelectorAll(".interpretations details").forEach((details) =>
        {
            details.open = true;
        });
    }
});

const canvas = $("#share-canvas");
const context = canvas.getContext("2d");
let canvasRevision = 0;
let imageReady = false;
let imagesPromise;
const imageCache = new Map();

function images()
{
    if (!imagesPromise)
    {
        imagesPromise = Promise.all([...c.cards.map((card) => card.art), c.ui.cardBack].map(async (url) =>
        {
            const image = new Image();
            image.src = url;
            await image.decode();
            imageCache.set(url, image);
        }));
    }
    return imagesPromise;
}

function wrapText(text, x, y, maxWidth, lineHeight)
{
    let line = "";
    for (const word of text.split(/\s+/))
    {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width > maxWidth && line)
        {
            context.fillText(line, x, y);
            line = word;
            y += lineHeight;
        }
        else
        {
            line = candidate;
        }
    }
    if (line)
    {
        context.fillText(line, x, y);
        y += lineHeight;
    }
    return y;
}

function canvasArt(url, x, y, width, height, reversed = false)
{
    const image = imageCache.get(url);
    context.save();
    context.beginPath();
    context.roundRect(x, y, width, height, 18);
    context.clip();
    context.translate(x + width / 2, y + height / 2);
    if (reversed)
    {
        context.rotate(Math.PI);
    }
    const scale = Math.max(width / image.width, height / image.height);
    context.drawImage(image, -image.width * scale / 2, -image.height * scale / 2, image.width * scale, image.height * scale);
    context.restore();
    context.strokeStyle = "#d5b77d99";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(x, y, width, height, 18);
    context.stroke();
}

function canvasBase()
{
    context.fillStyle = "#0c0b12";
    context.fillRect(0, 0, 1080, 1350);
    context.strokeStyle = "#d5b77d66";
    context.lineWidth = 2;
    context.strokeRect(40, 40, 1000, 1270);
    context.fillStyle = "#d5b77d";
    context.textAlign = "center";
    context.font = "600 58px Cormorant";
    context.fillText(c.brand, 540, 116);
    context.fillStyle = "#b9acbe";
    context.font = "400 23px Manrope";
    context.fillText(c.deck, 540, 163);
    context.font = "400 20px Manrope";
    context.fillText(new Date(`${machine.date}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), 540, 205);
    context.fillStyle = "#d5b77d";
    context.font = "400 23px Manrope";
    context.fillText(c.disclaimer, 540, 1264);
}

async function updateCanvas()
{
    const revision = ++canvasRevision;
    imageReady = false;
    $("#download").disabled = true;
    $("#image-status").textContent = machine.state === "revealed" ? c.studio.preparing : c.studio.before;
    try
    {
        await Promise.all([images(), document.fonts.ready]);
        if (revision !== canvasRevision)
        {
            return;
        }
        canvasBase();
        if (machine.state !== "revealed")
        {
            canvasArt(c.ui.cardBack, 370, 310, 340, 453);
            context.fillStyle = "#f2e8d5";
            context.font = "500 60px Cormorant";
            context.fillText(c.studio.awaiting, 540, 896);
            context.font = "400 25px Manrope";
            context.fillStyle = "#b9acbe";
            context.fillText(c.studio.awaitingNote, 540, 960);
            return;
        }
        if (machine.mode === "daily")
        {
            const item = machine.result[0];
            const card = cardFor(item);
            canvasArt(card.art, 360, 248, 360, 480, item.orientation === "reversed");
            context.fillStyle = "#f2e8d5";
            context.font = "500 70px Cormorant";
            context.fillText(card.name, 540, 814);
            context.font = "400 21px Manrope";
            context.fillStyle = "#d5b77d";
            context.fillText(orientation(item), 540, 856);
            context.font = "400 28px Manrope";
            context.fillStyle = "#b9acbe";
            wrapText(card[item.orientation], 540, 926, 800, 42);
            context.fillStyle = "#f2e8d5";
            context.font = "500 40px Cormorant";
            wrapText(card.prompt, 540, 1130, 820, 46);
        }
        else
        {
            context.font = "400 24px Manrope";
            context.fillStyle = "#d5b77d";
            context.fillText(c.hero.positions.join(" · "), 540, 268);
            machine.result.forEach((item, index) =>
            {
                const card = cardFor(item);
                const x = 92 + index * 312;
                canvasArt(card.art, x, 310, 272, 363, item.orientation === "reversed");
                context.fillStyle = "#f2e8d5";
                context.font = "500 43px Cormorant";
                context.fillText(card.name, x + 136, 738);
                context.fillStyle = "#d5b77d";
                context.font = "400 19px Manrope";
                context.fillText(orientation(item), x + 136, 778);
                context.fillStyle = "#b9acbe";
                context.font = "400 21px Manrope";
                wrapText(card[item.orientation], x + 136, 832, 268, 32);
            });
            context.font = "500 40px Cormorant";
            context.fillStyle = "#f2e8d5";
            wrapText(cardFor(machine.result[0]).prompt, 540, 1132, 820, 46);
        }
        imageReady = true;
        $("#download").disabled = false;
        $("#image-status").textContent = c.studio.ready;
    }
    catch
    {
        if (revision === canvasRevision)
        {
            $("#image-status").textContent = c.studio.failed;
        }
    }
}

$("#download").addEventListener("click", () =>
{
    if (!imageReady || machine.state !== "revealed")
    {
        return;
    }
    canvas.toBlob((blob) =>
    {
        if (!blob)
        {
            $("#image-status").textContent = c.studio.failed;
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${c.slug}-${machine.date}.png`;
        link.href = url;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
});

render();
