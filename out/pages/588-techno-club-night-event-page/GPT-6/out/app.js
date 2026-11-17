import { content as c } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const lines = (value) => escape(value).replaceAll("\n", "<br>");
const icon = (name) =>
{
    const paths =
    {
        arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
        play: '<path d="m8 5 11 7-11 7V5Z"/>',
        pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>',
        close: '<path d="m18 6-12 12M6 6l12 12"/>',
        bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        plus: '<path d="M12 5v14M5 12h14"/>'
    };
    return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};
const text = (value) => escape(value);
const currency = (amount) => `$${amount}`;
const storeKey = "phase-assembly-local-v1";
let storageOK = true;
let savedArtists = [];
let savedPlan = null;
try
{
    const stored = JSON.parse(localStorage.getItem(storeKey) || "{}");
    savedArtists = Array.isArray(stored.artists) ? [...new Set(stored.artists.filter((id) => Number.isInteger(id) && id >= 0 && id < c.lineup.artists.length))] : [];
    const p = stored.plan;
    if (p && Number.isInteger(p.tier) && c.tickets.tiers[p.tier] && Number.isInteger(p.qty) && p.qty >= 1 && p.qty <= 6 && p.id === true && p.policy === true)
    {
        savedPlan = p;
    }
}
catch
{
    storageOK = false;
}
function persist()
{
    try
    {
        localStorage.setItem(storeKey, JSON.stringify({ artists: savedArtists, plan: savedPlan }));
        return true;
    }
    catch
    {
        storageOK = false;
        $("#storage-warning").hidden = false;
        return false;
    }
}
const emblem = (type) =>
{
    const shapes =
    {
        orbit: '<g fill="none" stroke="currentColor" stroke-width="4"><ellipse cx="50" cy="50" rx="43" ry="15" transform="rotate(-40 50 50)"/><ellipse cx="50" cy="50" rx="43" ry="15" transform="rotate(40 50 50)"/><circle cx="50" cy="50" r="8" fill="currentColor"/></g>',
        grid: '<g fill="none" stroke="currentColor" stroke-width="5"><path d="M10 15h65v65H10zM25 25h65v65H25zM10 80 75 15M25 90 90 25"/></g>',
        wave: '<g fill="none" stroke="currentColor" stroke-width="6"><path d="M5 50Q17 0 29 50T53 50T77 50T101 50M5 70Q17 20 29 70T53 70T77 70"/></g>',
        star: '<g fill="none" stroke="currentColor" stroke-width="5"><path d="m50 6 8 30 27-16-16 27 25 8-29 7 15 26-28-14-10 23-5-29-30 6 22-21L7 35l30 1Z"/></g>'
    };
    return `<svg class="emblem" viewBox="0 0 100 100" aria-hidden="true">${shapes[type]}</svg>`;
};

$("#app").innerHTML = `
    <a class="skip" href="#poster">${text(c.nav.skip)}</a>
    <header class="site-header">
        <a class="brand" href="#poster" aria-label="${text(c.variables.brand)}">
            <img src="./assets/mark.svg" alt="" width="46" height="46">
            <span>${c.nav.logo.map(text).join("<br>")}</span>
        </a>
        <nav aria-label="${text(c.nav.label)}">${c.nav.items.map(([label, href]) => `<a href="${href}">${text(label)}</a>`).join("")}</nav>
        <span class="header-badge">${text(c.nav.badge)}</span>
    </header>
    <main>
        <section class="hero" id="poster" aria-labelledby="poster-title">
            <div class="poster">
                <p class="eyebrow">${text(c.hero.eyebrow)}</p>
                <h1 id="poster-title">${c.hero.title.map((line) => `<span>${text(line)}</span>`).join("")}</h1>
                <p class="intro">${text(c.hero.intro)}</p>
                <div class="poster-actions">
                    <a class="button" href="#tickets">${text(c.hero.primary)}${icon("arrow")}</a>
                    <a class="policy-link" href="#policy">${text(c.hero.secondary)}</a>
                </div>
                <div class="poster-location"><span>${text(c.hero.location)}</span>${icon("arrow")}</div>
            </div>
            <div class="sound-field">
                <div class="field-corners"><span>${text(c.hero.corner)}</span><span>${text(c.hero.serial)}</span></div>
                <div class="sculpture-wrap"><img class="sculpture" src="./assets/signal-sculpture.svg" alt="${text(c.hero.artworkAlt)}" width="700" height="490"></div>
                <div class="player">
                    <div class="player-heading"><h2>${text(c.audio.title)}</h2><span class="signal-dot" aria-hidden="true"></span></div>
                    <p class="audio-label">${text(c.audio.label)}</p>
                    <div class="signal-display">
                        <canvas id="signal" width="900" height="124" aria-label="${text(c.audio.canvas)}" role="img"></canvas>
                        <div class="time-row"><span id="audio-state">${text(c.audio.idle)}</span><span><span id="elapsed">0:00</span> / <span id="duration">0:07</span></span></div>
                    </div>
                    <div class="player-controls">
                        <button class="play-button" id="play">${icon("play")}<span>${text(c.audio.play)}</span></button>
                        <div class="mode-controls" role="group" aria-label="${text(c.audio.waveform)} / ${text(c.audio.spectrum)}">
                            <button data-mode="waveform" aria-pressed="true">${text(c.audio.waveform)}</button>
                            <button data-mode="spectrum" aria-pressed="false">${text(c.audio.spectrum)}</button>
                        </div>
                    </div>
                    <div class="volume-row">
                        <label>${text(c.audio.volume)} <input id="volume" type="range" min="0" max="100" value="35"><output id="volume-value" for="volume">35%</output></label>
                        <button class="visual-toggle" id="visual-toggle" aria-pressed="false">${text(c.audio.pauseVisuals)}</button>
                    </div>
                    <div class="audio-error" id="audio-error" role="alert" hidden>${text(c.audio.error)}<button id="audio-retry" class="play-button">${text(c.audio.retry)}</button></div>
                    <audio id="loop" src="${c.audio.file}" preload="auto" loop></audio>
                </div>
                <p class="audio-note">${text(c.audio.note)}</p>
            </div>
        </section>
        <div class="ticker" aria-hidden="true">${c.hero.bottom.map((item) => `<span>${text(item)}</span>`).join("")}</div>
        <p id="storage-warning" class="storage-warning" role="status" ${storageOK ? "hidden" : ""}>${text(c.tickets.storage)}</p>
        <section class="lineup" id="lineup" aria-labelledby="lineup-title">
            <div class="section-inner">
                <p class="section-number">${text(c.lineup.number)}</p>
                <div class="section-heading"><h2 id="lineup-title">${lines(c.lineup.title)}</h2><p>${text(c.lineup.intro)}</p></div>
                <div class="lineup-tools">
                    <label class="check-label"><input type="checkbox" id="saved-only">${text(c.lineup.savedOnly)}</label>
                    <span id="saved-count" role="status"></span>
                    <button class="text-button" id="clear-saved">${text(c.lineup.clear)}</button>
                </div>
                <div id="artists"></div>
                <p class="overnight">${text(c.lineup.overnight)}</p>
            </div>
        </section>
        <section class="room" id="room" aria-labelledby="room-title">
            <div class="section-inner">
                <p class="section-number">${text(c.room.number)}</p>
                <div class="room-heading"><h2 id="room-title">${lines(c.room.title)}</h2></div>
                <div class="room-layout">
                    <div class="map-wrap">
                        <svg class="venue-map" viewBox="0 0 600 360" role="img" aria-label="${text(c.room.mapLabel)}">
                            <path d="M20 20H580V340H20Z" fill="none" stroke="#fff" stroke-width="2"/>
                            <g class="map-zone" data-zone="3"><rect x="50" y="46" width="180" height="90"/><text x="140" y="98" text-anchor="middle">${text(c.room.zones[3].name)}</text></g>
                            <g class="map-zone" data-zone="1"><rect x="255" y="90" width="190" height="185"/><text x="350" y="190" text-anchor="middle">${text(c.room.zones[1].name)}</text></g>
                            <g class="map-zone" data-zone="2"><rect x="470" y="85" width="85" height="185"/><text x="513" y="169" text-anchor="middle"><tspan x="513">${text(c.room.zones[2].name.split(" ")[0])}</tspan><tspan x="513" dy="22">${text(c.room.zones[2].name.split(" ")[1])}</tspan></text></g>
                            <g class="map-zone selected" data-zone="0"><rect x="50" y="235" width="155" height="70"/><text x="127" y="277" text-anchor="middle">${text(c.room.zones[0].name)}</text></g>
                            <path class="map-route" d="M127 325V305M127 315H240V155H140V136M240 155H255M240 315H458V180H470"/>
                            <path d="m116 341 11-13 11 13" fill="none" stroke="#c6ff00" stroke-width="3"/>
                        </svg>
                        <p class="map-legend">${text(c.room.legend)}</p>
                    </div>
                    <div class="room-details">
                        <h3>${text(c.room.subtitle)}</h3>
                        <p>${text(c.room.address)}</p><p>${text(c.room.demo)}</p>
                        <div class="zone-buttons" role="group" aria-label="${text(c.room.subtitle)}">${c.room.zones.map((zone, i) => `<button data-select-zone="${i}" aria-pressed="${i === 0}">${text(zone.name)}</button>`).join("")}</div>
                        <div class="zone-note" id="zone-note" aria-live="polite"></div>
                    </div>
                </div>
                <div class="room-footnotes"><p>${text(c.room.access)}</p><p>${text(c.room.travel)}</p></div>
            </div>
        </section>
        <section id="tickets" aria-labelledby="tickets-title">
            <div class="section-inner">
                <p class="section-number">${text(c.tickets.number)}</p>
                <div class="ticket-heading"><h2 id="tickets-title">${lines(c.tickets.title)}</h2><p>${text(c.tickets.intro)}</p></div>
                <div class="ticket-grid">${c.tickets.tiers.map((tier, i) => `
                    <article class="ticket">
                        <div class="kicker">${text(tier.label)}</div><h3>${text(tier.name)}</h3>
                        <div class="price"><sup>$</sup>${tier.price}</div><small>${text(c.tickets.unit)}</small>
                        <p>${text(tier.rule)}</p><button class="button" data-ticket="${i}" aria-haspopup="dialog">${text(c.tickets.choose)}${icon("arrow")}</button>
                    </article>`).join("")}</div>
                <p class="ticket-note">${text(c.tickets.note)}</p>
                <div class="saved-plan" id="saved-plan" hidden></div>
            </div>
        </section>
        <section class="policy" id="policy" aria-labelledby="policy-title">
            <div class="section-inner">
                <p class="section-number">${text(c.policy.number)}</p>
                <div class="policy-layout"><h2 id="policy-title">${lines(c.policy.title)}</h2><ol class="rules">${c.policy.rules.map((rule) => `<li>${text(rule)}</li>`).join("")}</ol></div>
                <p class="policy-disclaimer">${text(c.policy.disclaimer)}</p>
            </div>
        </section>
        <section class="faq section-inner" aria-labelledby="faq-title">
            <h2 id="faq-title">${text(c.policy.faqTitle)}</h2>
            <div class="faq-grid">${c.policy.faqs.map(([q, a]) => `<details><summary>${text(q)}</summary><p>${text(a)}</p></details>`).join("")}</div>
        </section>
    </main>
    <footer class="site-footer">
        <div class="footer-top"><h2>${text(c.variables.brand)}</h2><a href="#poster">${text(c.footer.back)}${icon("arrow")}</a></div>
        <div class="footer-bottom">
            <div><span>${text(c.footer.location)}</span><p>${text(c.footer.note)}</p></div>
            <div class="footer-credits"><a href="${c.meta.creditUrl}" target="_blank" rel="noopener noreferrer">${text(c.variables.credit)}</a><a href="${c.footer.licenseUrl}" target="_blank" rel="noopener noreferrer">${text(c.footer.license)}</a></div>
        </div>
    </footer>
    <dialog class="artist-modal" id="artist-dialog" aria-labelledby="artist-dialog-title"></dialog>
    <dialog class="drawer" id="ticket-dialog" aria-labelledby="ticket-dialog-title">
        <div class="dialog-top"><h2 id="ticket-dialog-title">${text(c.tickets.drawerTitle)}</h2><button class="close-dialog" data-close aria-label="${text(c.tickets.close)}">${icon("close")}</button></div>
        <p class="drawer-intro">${text(c.tickets.drawerNote)}</p>
        <form id="ticket-form">
            <fieldset class="tier-choices"><legend>${text(c.tickets.tier)}</legend>${c.tickets.tiers.map((tier, i) => `<label class="check-label"><input type="radio" name="tier" value="${i}" required>${text(tier.name)} / ${currency(tier.price)}</label>`).join("")}</fieldset>
            <label class="field-label">${text(c.tickets.quantity)}<input id="quantity" type="number" min="1" max="6" step="1" value="1" required></label>
            <dl class="estimate" aria-live="polite"><div><dt id="line-description"></dt><dd id="line-total"></dd></div><div><dt>${text(c.tickets.fees)}</dt><dd>${text(c.tickets.noFees)}</dd></div><div class="total"><dt>${text(c.tickets.total)}</dt><dd id="estimate-total"></dd></div></dl>
            <label class="check-label"><input id="agree-id" type="checkbox" required>${text(c.tickets.id)}</label>
            <label class="check-label"><input id="agree-policy" type="checkbox" required>${text(c.tickets.policy)}</label>
            <a class="policy-link" href="#policy" id="drawer-policy">${text(c.tickets.readPolicy)}</a>
            <button type="submit" class="button acid">${text(c.tickets.save)}${icon("bookmark")}</button>
            <button type="button" class="text-button" id="reset-plan">${text(c.tickets.reset)}</button>
            <p class="form-result" id="plan-result" role="status"></p>
        </form>
    </dialog>`;

function renderArtists()
{
    const only = $("#saved-only").checked;
    const visible = c.lineup.artists.map((artist, i) => ({ ...artist, i })).filter((artist) => !only || savedArtists.includes(artist.i));
    $("#artists").innerHTML = visible.length ? visible.map((artist) => `
        <article class="artist-row">
            <span class="artist-number" aria-hidden="true">0${artist.i + 1}</span>${emblem(artist.type)}
            <div class="artist-copy"><span class="time-tag">${text(artist.time)}</span><h3>${text(artist.name)}</h3><p>${text(artist.sound)}</p></div>
            <div class="artist-actions">
                <button data-artist="${artist.i}" aria-haspopup="dialog">${text(c.lineup.note)}${icon("arrow")}</button>
                <button data-save="${artist.i}" aria-pressed="${savedArtists.includes(artist.i)}">${icon("bookmark")}${text(savedArtists.includes(artist.i) ? c.lineup.remove : c.lineup.save)}</button>
            </div>
        </article>`).join("") : `<p class="empty">${text(c.lineup.empty)}</p>`;
    $("#saved-count").textContent = `${savedArtists.length} ${c.lineup.count}`;
}
renderArtists();
$("#saved-only").addEventListener("change", renderArtists);
$("#clear-saved").addEventListener("click", () =>
{
    savedArtists = [];
    persist();
    renderArtists();
});
let opener = null;
function openDialog(dialog, trigger)
{
    opener = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add("modal-open");
    dialog.querySelector("button, input")?.focus();
}
function closeDialog(dialog)
{
    dialog.close();
}
$$("dialog").forEach((dialog) =>
{
    dialog.addEventListener("close", () =>
    {
        document.body.classList.remove("modal-open");
        if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    dialog.addEventListener("click", (event) =>
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom))
        {
            closeDialog(dialog);
        }
        if (event.target.closest("[data-close]")) closeDialog(dialog);
    });
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab") return;
        const controls = [...dialog.querySelectorAll("button, a[href], input, select")].filter((el) => !el.disabled && el.getClientRects().length);
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
});
$("#artists").addEventListener("click", (event) =>
{
    const note = event.target.closest("[data-artist]");
    const save = event.target.closest("[data-save]");
    if (note)
    {
        const artist = c.lineup.artists[Number(note.dataset.artist)];
        $("#artist-dialog").innerHTML = `<div class="dialog-top"><h2 id="artist-dialog-title">${text(artist.name)}</h2><button class="close-dialog" data-close aria-label="${text(c.lineup.close)}">${icon("close")}</button></div><p class="eyebrow">${text(c.lineup.fictional)}</p><span class="time-tag">${text(artist.time)}</span><p>${text(artist.bio)}</p>`;
        openDialog($("#artist-dialog"), note);
    }
    if (save)
    {
        const id = Number(save.dataset.save);
        savedArtists = savedArtists.includes(id) ? savedArtists.filter((item) => item !== id) : [...savedArtists, id];
        persist();
        renderArtists();
        const replacement = $(`[data-save="${id}"]`);
        (replacement || $("#saved-only")).focus({ preventScroll: true });
    }
});
function selectZone(id)
{
    $$("[data-select-zone]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.selectZone) === id)));
    $$(".map-zone").forEach((zone) => zone.classList.toggle("selected", Number(zone.dataset.zone) === id));
    $(".map-route").classList.toggle("selected", id === 4);
    $("#zone-note").innerHTML = `<h4>${text(c.room.zones[id].name)}</h4><p>${text(c.room.zones[id].note)}</p>`;
}
selectZone(0);
$$("[data-select-zone]").forEach((button) => button.addEventListener("click", () => selectZone(Number(button.dataset.selectZone))));

function selectedTier()
{
    return Number($('input[name="tier"]:checked')?.value || 0);
}
function updateEstimate()
{
    const tier = c.tickets.tiers[selectedTier()];
    const qty = Number($("#quantity").value);
    const valid = Number.isInteger(qty) && qty >= 1 && qty <= 6;
    $("#line-description").textContent = `${tier.name} × ${valid ? qty : "—"}`;
    $("#line-total").textContent = valid ? currency(tier.price * qty) : "—";
    $("#estimate-total").textContent = valid ? currency(tier.price * qty) : "—";
}
function renderPlan()
{
    const target = $("#saved-plan");
    target.hidden = !savedPlan;
    if (!savedPlan) return;
    const tier = c.tickets.tiers[savedPlan.tier];
    target.innerHTML = `<p class="eyebrow">${text(storageOK ? c.tickets.savedLabel : c.tickets.unsavedLabel)}</p><p>${text(tier.name)} × ${savedPlan.qty} / ${currency(tier.price * savedPlan.qty)}</p><p>${text(storageOK ? c.tickets.confirmation : c.tickets.storage)}</p><button class="button acid" id="edit-plan" aria-haspopup="dialog">${text(c.tickets.edit)}</button><button class="text-button" id="remove-plan">${text(c.tickets.remove)}</button>`;
}
function openTicket(tier, trigger)
{
    const values = savedPlan ? { ...savedPlan, tier } : { tier, qty: 1, id: false, policy: false };
    $(`input[name="tier"][value="${values.tier}"]`).checked = true;
    $("#quantity").value = values.qty;
    $("#agree-id").checked = values.id;
    $("#agree-policy").checked = values.policy;
    $("#plan-result").textContent = "";
    updateEstimate();
    openDialog($("#ticket-dialog"), trigger);
}
renderPlan();
$$("[data-ticket]").forEach((button) => button.addEventListener("click", () => openTicket(Number(button.dataset.ticket), button)));
$("#saved-plan").addEventListener("click", (event) =>
{
    if (event.target.closest("#edit-plan")) openTicket(savedPlan.tier, $("#edit-plan"));
    if (event.target.closest("#remove-plan"))
    {
        savedPlan = null;
        persist();
        renderPlan();
        $("[data-ticket]").focus({ preventScroll: true });
    }
});
$("#ticket-form").addEventListener("input", () =>
{
    $("#plan-result").textContent = "";
    updateEstimate();
});
$("#ticket-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!$("#ticket-form").reportValidity())
    {
        $("#plan-result").textContent = c.tickets.validation;
        return;
    }
    savedPlan = { tier: selectedTier(), qty: Number($("#quantity").value), id: $("#agree-id").checked, policy: $("#agree-policy").checked };
    const persisted = persist();
    renderPlan();
    $("#plan-result").textContent = persisted ? c.tickets.confirmation : c.tickets.storage;
});
$("#reset-plan").addEventListener("click", () =>
{
    savedPlan = null;
    persist();
    renderPlan();
    $("#ticket-form").reset();
    $('input[name="tier"][value="0"]').checked = true;
    updateEstimate();
    $("#plan-result").textContent = c.tickets.removed;
});
$("#drawer-policy").addEventListener("click", () => closeDialog($("#ticket-dialog")));

const audio = $("#loop");
const canvas = $("#signal");
const drawing = canvas.getContext("2d");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let context;
let source;
let analyser;
let gain;
let waveform;
let spectrum;
let mode = "waveform";
let frozen = false;
let frame = 0;
let lastFrame = 0;
let smoothLevel = 0;
function clock(seconds)
{
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
function updateTime()
{
    $("#elapsed").textContent = clock(audio.currentTime);
    if (Number.isFinite(audio.duration)) $("#duration").textContent = clock(audio.duration);
}
function idleCanvas()
{
    drawing.fillStyle = "#080808";
    drawing.fillRect(0, 0, canvas.width, canvas.height);
    drawing.strokeStyle = "#c6ff00";
    drawing.lineWidth = 2;
    drawing.beginPath();
    drawing.moveTo(0, canvas.height / 2);
    drawing.lineTo(canvas.width, canvas.height / 2);
    drawing.stroke();
}
function sampleLevel()
{
    analyser.getByteTimeDomainData(waveform);
    let energy = 0;
    for (const value of waveform) energy += ((value - 128) / 128) ** 2;
    const rms = Math.sqrt(energy / waveform.length);
    smoothLevel += (rms - smoothLevel) * .15;
    return smoothLevel;
}
function signalFrame(timestamp)
{
    if (audio.paused || frozen || reduced.matches || document.hidden)
    {
        frame = 0;
        return;
    }
    frame = requestAnimationFrame(signalFrame);
    if (timestamp - lastFrame < 1000 / 30) return;
    lastFrame = timestamp;
    const rms = sampleLevel();
    const scale = 1 + Math.min(.1, rms * .3);
    $(".sculpture").style.scale = String(scale);
    drawing.fillStyle = "#080808";
    drawing.fillRect(0, 0, canvas.width, canvas.height);
    drawing.strokeStyle = "#c6ff00";
    drawing.fillStyle = "#c6ff00";
    drawing.lineWidth = 2;
    if (mode === "waveform")
    {
        drawing.beginPath();
        for (let i = 0; i < waveform.length; i++)
        {
            const x = i / (waveform.length - 1) * canvas.width;
            const y = canvas.height / 2 + (waveform[i] - 128) / 128 * canvas.height * .44;
            if (i === 0) drawing.moveTo(x, y);
            else drawing.lineTo(x, y);
        }
        drawing.stroke();
    }
    else
    {
        analyser.getByteFrequencyData(spectrum);
        const bars = 56;
        const width = canvas.width / bars;
        for (let i = 0; i < bars; i++)
        {
            const height = spectrum[Math.floor(i * spectrum.length / bars)] / 255 * canvas.height;
            drawing.fillRect(i * width + 2, canvas.height - height, width - 4, height);
        }
    }
}
function stopFrames()
{
    cancelAnimationFrame(frame);
    frame = 0;
}
function refreshPlayback()
{
    const playing = !audio.paused;
    $("#play").innerHTML = `${icon(playing ? "pause" : "play")}<span>${text(playing ? c.audio.pause : c.audio.play)}</span>`;
    $(".sound-field").classList.toggle("playing", playing);
    $(".sound-field").classList.toggle("frozen", frozen || reduced.matches || document.hidden);
    $("#audio-state").textContent = !playing ? c.audio.idle : reduced.matches ? c.audio.reduced : frozen ? c.audio.frozen : c.audio.active;
    stopFrames();
    if (playing && !frozen && !reduced.matches && !document.hidden) frame = requestAnimationFrame(signalFrame);
    if (!playing) idleCanvas();
}
async function playLoop()
{
    $("#play").disabled = true;
    try
    {
        if (!context)
        {
            context = new AudioContext();
            source = context.createMediaElementSource(audio);
            analyser = context.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = .85;
            gain = context.createGain();
            gain.gain.value = Number($("#volume").value) / 100;
            source.connect(analyser);
            analyser.connect(gain);
            gain.connect(context.destination);
            waveform = new Uint8Array(analyser.fftSize);
            spectrum = new Uint8Array(analyser.frequencyBinCount);
        }
        await context.resume();
        await audio.play();
        $("#audio-error").hidden = true;
    }
    catch
    {
        audio.pause();
        $("#audio-error").hidden = false;
    }
    finally
    {
        $("#play").disabled = false;
        refreshPlayback();
    }
}
$("#play").addEventListener("click", () =>
{
    if (audio.paused) playLoop();
    else audio.pause();
});
$("#audio-retry").addEventListener("click", () =>
{
    audio.load();
    playLoop();
});
audio.addEventListener("error", () =>
{
    $("#audio-error").hidden = false;
});
audio.addEventListener("play", refreshPlayback);
audio.addEventListener("pause", refreshPlayback);
audio.addEventListener("timeupdate", updateTime);
audio.addEventListener("loadedmetadata", updateTime);
$("#volume").addEventListener("input", () =>
{
    const value = Number($("#volume").value);
    $("#volume-value").textContent = `${value}%`;
    if (gain) gain.gain.setTargetAtTime(value / 100, context.currentTime, .02);
});
$$("[data-mode]").forEach((button) => button.addEventListener("click", () =>
{
    mode = button.dataset.mode;
    $$("[data-mode]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
}));
$("#visual-toggle").addEventListener("click", () =>
{
    frozen = !frozen;
    $("#visual-toggle").textContent = frozen ? c.audio.resumeVisuals : c.audio.pauseVisuals;
    $("#visual-toggle").setAttribute("aria-pressed", String(frozen));
    refreshPlayback();
});
document.addEventListener("visibilitychange", refreshPlayback);
reduced.addEventListener("change", refreshPlayback);
const levelTimer = setInterval(() =>
{
    if (!audio.paused && analyser && reduced.matches && !document.hidden)
    {
        $("#audio-state").textContent = `${c.audio.reduced} / ${c.audio.level} ${Math.round(sampleLevel() * 100)}%`;
        updateTime();
    }
}, 500);
window.addEventListener("pagehide", () =>
{
    audio.pause();
    stopFrames();
    clearInterval(levelTimer);
    context?.close();
});
idleCanvas();
