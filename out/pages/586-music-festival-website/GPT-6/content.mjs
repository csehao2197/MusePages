import { FestivalAudio } from "./audio.mjs";
import { icons } from "./icons.mjs";

export const content =
{
    brand: "Sunspill",
    dates: "July 16–18, 2027",
    location: "Cinder Meadows · Port Alder, WA",
    photo: "./images/meadow-crowd.jpg",
    days: ["Fri Jul 16", "Sat Jul 17", "Sun Jul 18"],
    acts:
    [
        { name: "VELVET ORBIT", genre: "Disco after dark", day: 0, stage: "Sun Stage", time: "21:30", hue: "pink", root: 138.59 },
        { name: "PEACH STATIC", genre: "Sun-warmed indie", day: 1, stage: "Sun Stage", time: "21:00", hue: "orange", root: 164.81 },
        { name: "THE SLOW HOURS", genre: "Wide-open electronics", day: 2, stage: "Sun Stage", time: "20:30", hue: "green", root: 110 },
        { name: "MOTEL TANGERINE", genre: "Poolside grooves", day: 0, stage: "Willow Tent", time: "18:00", hue: "green", root: 146.83 },
        { name: "LUNAR LAUNDRY", genre: "Fresh-spun house", day: 1, stage: "Willow Tent", time: "19:00", hue: "pink", root: 196 },
        { name: "HONEY CIRCUIT", genre: "Golden-hour synths", day: 2, stage: "Willow Tent", time: "18:30", hue: "orange", root: 174.61 },
        { name: "FERN FREQUENCY", genre: "Left-field indie", day: 0, stage: "Sun Stage", time: "16:30", hue: "orange", root: 130.81 },
        { name: "SOFT SATELLITE", genre: "Small hours, big feelings", day: 1, stage: "Sun Stage", time: "16:00", hue: "green", root: 220 },
        { name: "DISCO BOTANICA", genre: "A very good last dance", day: 2, stage: "Sun Stage", time: "16:30", hue: "pink", root: 123.47 }
    ],
    tiers:
    [
        { name: "Day Pass", price: 79, label: "A little taste", details: "One day · Both stages · All the good bits", camp: false, vip: false },
        { name: "3-Day General", price: 189, label: "The whole story", details: "All three days · Both stages · Come and go", camp: false, vip: false },
        { name: "Camp Weekend", price: 269, label: "Stay for the stars", details: "3-day access · Three nights camping · Showers", camp: true, vip: false },
        { name: "Golden Hour VIP", price: 449, label: "A little extra sunshine", details: "3-day access · Shaded lounge · Viewing terrace", camp: false, vip: true }
    ],
    zones:
    [
        { name: "Sun Stage", x: 340, y: 145, description: "The big one. Open-air sets from 16:00; music ends at 23:00 Friday and Saturday, 22:00 Sunday. Step-free viewing platform on the east side." },
        { name: "Willow Tent", x: 590, y: 265, description: "Warm electronics under canvas. A smaller dance floor, a very large mood. Step-free entry and a quiet seating edge." },
        { name: "Little Ember Food", x: 210, y: 310, description: "Invented local vendors: Crumb Club flatbreads, Happy Sprout bowls and Melt Theory toasties. Vegetarian, vegan and gluten-free choices. Open 12:00–23:00." },
        { name: "Mosslight Camp", x: 610, y: 110, description: "Camp Weekend wristbands only. Open Friday 10:00 to Monday 10:00. Bring your own tent; quiet hours 01:00–08:00. No fires or vehicle camping." },
        { name: "Water & Welfare", x: 410, y: 320, description: "Free water refills, first aid, earplugs and a low-sensory space. The welfare team is here all festival long. Bring an empty reusable bottle." },
        { name: "Welcome Gate", x: 310, y: 440, description: "Gates open at noon daily. Fictional shuttle from Port Alder Station every 20 minutes, 11:00–00:00. Accessible drop-off beside the gate. No real service operates." }
    ],
    footer: "Three days. Two stages. One very good field.",
    credit: "https://vibefather.ai/t/music-festival-website"
};
const c = content;
const arrow = icons.arrow;
const sun = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 23a14 14 0 0 1 28 0Z" fill="currentColor"/><path d="M2 27h28" stroke="currentColor" stroke-width="2"/></svg>';
const page = document.body.dataset.page;
const audio = new FestivalAudio();
const main = document.querySelector("main");
const ticketLink = `<a class="button" href="./tickets.html">Get your tickets ${arrow}</a>`;
document.querySelector("#shell").innerHTML = `
    <header>
        <a class="logo" href="./index.html" aria-label="Sunspill home">${sun}sunspill</a>
        <nav aria-label="Main navigation">
            <a href="./index.html#lineup" ${page === "home" ? 'aria-current="page"' : ""}>Line-up</a>
            <a href="./index.html#schedule">Schedule</a>
            <a href="./map.html" ${page === "map" ? 'aria-current="page"' : ""}>The grounds</a>
        </nav>
        ${ticketLink}
    </header>`;
document.querySelector("#tail").innerHTML = `
    <footer>
        <div class="footer-top">
            <div><a class="logo" href="./index.html">${sun}sunspill</a><p>${c.footer}</p></div>
            <div><p>${c.dates}<br>${c.location}<br>Indie, disco & warm electronics.</p></div>
            <div><p>A fictional festival. A real good daydream.<br>No real tickets, reservations or travel services.</p></div>
        </div>
        <div class="footer-bottom">
            <small>© 2027 Sunspill · An independent festival concept.</small>
            <small><a href="${c.credit}">Template by VibeFather</a> · <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a></small>
        </div>
    </footer>
    <a class="mobile-ticket" href="./tickets.html"><span>Find your summer · Passes from $79</span>${arrow}</a>`;

function tabs(id, includeAll = false)
{
    return `<div class="tabs" role="group" aria-label="${id === "lineup" ? "Filter line-up" : "Choose schedule day"}">
        ${includeAll ? '<button data-day="all" aria-pressed="true">All weekend</button>' : ""}
        ${c.days.map((day, i) => `<button data-day="${i}" aria-pressed="${!includeAll && i === 0}">${day}</button>`).join("")}
    </div>`;
}

function fieldArt()
{
    return `<svg viewBox="0 0 500 350" role="img" aria-label="Original illustration of a sun setting over Cinder Meadows">
        <circle cx="250" cy="145" r="95" fill="#ff6d9d" stroke="#25113e" stroke-width="3"/>
        <path d="M0 235Q120 135 260 240T500 215V350H0Z" fill="#dcff7d" stroke="#25113e" stroke-width="3"/>
        <path d="M0 285Q160 180 330 285T500 250V350H0Z" fill="#25113e"/>
        <path d="m335 250 42-90 42 90ZM365 250v-55m-260 40 30-65 30 65Zm30 0v-40" fill="#fff3da" stroke="#25113e" stroke-width="3"/>
        <path d="M220 350q-40-60 35-90t-25-40" fill="none" stroke="#ffa14d" stroke-width="24"/>
        <g fill="#25113e"><circle cx="72" cy="80" r="4"/><circle cx="440" cy="110" r="5"/><path d="m100 100 8-20 8 20-8-8Zm310-60 8-20 8 20-8-8Z"/></g>
        <text x="20" y="330" fill="#fff3da" font-family="monospace" font-size="12">A FIELD WORTH FINDING. ↗</text>
    </svg>`;
}

if (page === "home")
{
    main.innerHTML = `
        <section class="hero">
            <div class="hero-meta eyebrow"><span>Three days. All the feelings.</span><span>${c.dates} · Port Alder, WA</span></div>
            <h1 aria-label="Sunspill"><span>sunspill</span></h1>
            <div class="hero-bottom">
                <div><h2>A little louder.<br>A little longer.</h2><p>Indie, disco & warm electronics. Bare feet optional.<br>${c.location}</p></div>
                <div class="hero-actions"><a class="button" href="./tickets.html">Your summer starts here ${arrow}</a><small>3-DAY PASSES FROM $189 · GOOD TIMES INCLUDED</small></div>
            </div>
            <div class="soundscape">
                <img src="${c.photo}" alt="An open-air concert crowd beneath glowing stage lights at dusk" fetchpriority="high">
                <canvas aria-label="Animated festival audio spectrum"></canvas>
                <div class="audio-controls">
                    <button id="play" aria-label="Play festival loop" aria-pressed="false">${icons.play}</button>
                    <button id="mute" aria-label="Mute audio" aria-pressed="false">${icons.volume}</button>
                    <span id="audio-status" role="status">A little taste of the weekend<br>Press play · Original festival loop</span>
                </div>
                <span class="sound-label eyebrow">Find your frequency ↗</span>
            </div>
        </section>
        <div class="marquee" aria-label="Good music, good people, long summer nights"><div aria-hidden="true">${("GOOD MUSIC. GOOD PEOPLE. LONG SUMMER NIGHTS. &nbsp; ✳ &nbsp; TWO STAGES. NO BAD PLANS. &nbsp; ✳ &nbsp; ").repeat(4)}</div></div>
        <section class="section" id="lineup">
            <div class="section-heading">
                <div><span class="eyebrow">01 / Your new favorite noise</span><h2 class="display">Meet the daydreamers.</h2></div>
                <p>Big feelings. Beautiful frequencies.<br>Nine very good reasons to miss Monday.</p>
            </div>
            ${tabs("lineup", true)}
            <div class="posters"></div>
            <p class="hint">Invented artists. Original synth sketches. Enable sound with Play, then hover a poster, focus its preview, or tap Listen.</p>
        </section>
        <section class="section schedule" id="schedule">
            <div class="section-heading"><div><span class="eyebrow">02 / Right place, right time</span><h2 class="display">Make a loose plan.</h2></div><p>Save a set with +. Leave some room for a happy accident.</p></div>
            ${tabs("schedule")}
            <div id="schedule-rows"></div>
            <p id="saved-status" role="status" class="notice">No sets saved yet. Your plan stays in this browser.</p>
        </section>
        <section class="section split">
            <div class="field-art">${fieldArt()}</div>
            <div><span class="eyebrow">03 / A place to get a little lost</span><h2 class="display">Less concrete.<br>More possibility.</h2><p>Two stages tucked between the willows and Cinder Lake. Food made with love. Free water. A quiet corner when you need one.</p><a class="button" href="./map.html">Get the lay of the land ${arrow}</a></div>
        </section>
        <section class="section closing"><span class="eyebrow">Put something good on your calendar</span><h2 class="display">Meet you in the golden hour.</h2>${ticketLink}<p class="notice">July 16–18, 2027 · Come as you are. Leave a little sunnier.</p></section>`;
    const posters = document.querySelector(".posters");
    function renderPosters(day)
    {
        audio.stopPreview();
        posters.innerHTML = c.acts.map((act, i) => ({ ...act, i })).filter(act => day === "all" || act.day === Number(day)).map(act => `
            <article class="poster ${act.hue}" data-act="${act.i}">
                <small>${c.days[act.day]} · ${act.time}</small><div class="orb" aria-hidden="true"></div>
                <h3>${act.name}</h3><p>${act.genre} · ${act.stage}</p>
                <button aria-label="Listen to ${act.name} preview">Listen to a little ${arrow}</button>
            </article>`).join("");
        for (const card of posters.children)
        {
            const index = Number(card.dataset.act);
            const preview = () => audio.preview(index, c.acts[index].root);
            card.addEventListener("pointerenter", () => { if (audio.context && matchMedia("(hover: hover)").matches) preview(); });
            card.addEventListener("pointerleave", () => audio.stopPreview());
            const button = card.querySelector("button");
            button.addEventListener("click", async () =>
            {
                await audio.ready();
                preview();
            });
            button.addEventListener("focus", () => { if (audio.context) preview(); });
            button.addEventListener("blur", () => audio.stopPreview());
        }
    }
    document.querySelector("#lineup .tabs").addEventListener("click", e =>
    {
        const button = e.target.closest("button");
        if (!button) return;
        selectTab(button);
        renderPosters(button.dataset.day);
    });
    renderPosters("all");
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("sunspill-sets") || "[]"); } catch { saved = []; }
    if (!Array.isArray(saved)) saved = [];
    function savedStatus()
    {
        document.querySelector("#saved-status").textContent = saved.length ? `${saved.length} set${saved.length === 1 ? "" : "s"} saved: ${saved.map(i => c.acts[i]?.name).filter(Boolean).join(", ")}. Stored on this device only.` : "No sets saved yet. Your plan stays in this browser.";
    }
    function renderSchedule(day)
    {
        document.querySelector("#schedule-rows").innerHTML = c.acts.map((a, i) => ({ ...a, i })).filter(a => a.day === Number(day)).sort((a, b) => a.time.localeCompare(b.time)).map(a => `
            <div class="schedule-row"><time>${a.time}</time><h3>${a.name}</h3><span>${a.stage}</span><button class="save-act" data-act="${a.i}" aria-label="Save ${a.name}" aria-pressed="${saved.includes(a.i)}">${saved.includes(a.i) ? "✓" : "+"}</button></div>`).join("");
        savedStatus();
    }
    document.querySelector("#schedule .tabs").addEventListener("click", e =>
    {
        const button = e.target.closest("button");
        if (!button) return;
        selectTab(button);
        renderSchedule(button.dataset.day);
    });
    document.querySelector("#schedule-rows").addEventListener("click", e =>
    {
        const button = e.target.closest("button");
        if (!button) return;
        const i = Number(button.dataset.act);
        saved = saved.includes(i) ? saved.filter(n => n !== i) : [...saved, i];
        try { localStorage.setItem("sunspill-sets", JSON.stringify(saved)); } catch { /* The in-memory plan remains usable when storage is disabled. */ }
        button.setAttribute("aria-pressed", saved.includes(i));
        button.textContent = saved.includes(i) ? "✓" : "+";
        savedStatus();
    });
    renderSchedule(0);
    document.querySelector("#play").addEventListener("click", async () =>
    {
        const playing = await audio.toggle();
        document.querySelector("#play").setAttribute("aria-pressed", playing);
        document.querySelector("#play").setAttribute("aria-label", playing ? "Pause festival loop" : "Play festival loop");
        document.querySelector("#play").innerHTML = playing ? icons.pause : icons.play;
        document.querySelector("#audio-status").textContent = audio.failed ? "Audio could not load. The visuals keep running." : playing ? "Now playing · Sunspill original / 124 BPM" : "Paused · Pick up right where you left off";
    });
    document.querySelector("#mute").addEventListener("click", () =>
    {
        const muted = audio.mute();
        document.querySelector("#mute").setAttribute("aria-pressed", muted);
        document.querySelector("#mute").setAttribute("aria-label", muted ? "Unmute audio" : "Mute audio");
        document.querySelector("#mute").innerHTML = muted ? icons.muted : icons.volume;
    });
    fitHeadline();
    addEventListener("resize", fitHeadline);
    document.fonts.ready.then(fitHeadline);
    drawVisualizer(document.querySelector("canvas"));
}

function selectTab(button)
{
    for (const sibling of button.parentElement.children) sibling.setAttribute("aria-pressed", sibling === button);
}

function fitHeadline()
{
    const heading = document.querySelector(".hero h1");
    const span = heading?.firstElementChild;
    if (!span) return;
    heading.style.fontSize = "100px";
    span.style.display = "inline-block";
    heading.style.fontSize = `${Math.floor(100 * heading.clientWidth / span.getBoundingClientRect().width)}px`;
}

function drawVisualizer(canvas)
{
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = 0;
    function frame(t)
    {
        if (!document.hidden && t - last > 32)
        {
            last = t;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
            ctx.clearRect(0, 0, w, h);
            const data = audio.frequency();
            ctx.fillStyle = "#dcff7d";
            const count = 62;
            const step = w / count;
            for (let i = 0; i < count; i++)
            {
                const energy = data ? data[i * 3] / 255 : (Math.sin(i * .6 + (reduced ? 0 : t * .0018)) + 1) * .17 + .05;
                const height = energy * h * .7 + 2;
                ctx.fillRect(i * step, h * .52 - height / 2, Math.max(2, step * .14), height);
            }
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

if (page === "map")
{
    main.innerHTML = `
        <section class="page-intro"><span class="eyebrow">Cinder Meadows · Port Alder, WA</span><h1 class="display">Find your corner.</h1><p class="intro">Follow the bass. Or take the scenic route. Six places to make your weekend a little easier.</p></section>
        <section class="section map-layout">
            <div><svg class="grounds" viewBox="0 0 800 520" role="group" aria-label="Illustrated festival site map, not to scale">
                <path d="M0 0H800V520H0Z" fill="#d9e59c"/>
                <path d="M0 50Q150 20 165 130T0 290Z" fill="#8bbbbb" stroke="#25113e" stroke-width="2"/><text x="18" y="125" transform="rotate(-65 18 125)">CINDER LAKE</text>
                <path d="M310 520V430Q340 355 410 320T590 265M410 320Q320 300 210 310M410 320Q400 240 340 145M590 265Q680 210 610 110" fill="none" stroke="#fff3da" stroke-width="24" stroke-linecap="round"/>
                <path d="M270 180v-60q70-55 140 0v60Z" fill="#ff6d9d" stroke="#25113e" stroke-width="3"/>
                <path d="m530 290 60-100 60 100Z" fill="#ffa14d" stroke="#25113e" stroke-width="3"/>
                <g fill="#77945a"><path d="m690 430 25-65 25 65Zm-20-10 15-45 15 45ZM90 430l25-65 25 65Z"/></g>
                <g fill="#fff3da" stroke="#25113e" stroke-width="2"><path d="m570 120 30-60 30 60Zm70 30 25-50 25 50ZM160 335v-45h95v45Z"/><path d="M370 335v-40h80v40Z"/></g>
                <text x="590" y="470">N ↑</text><text x="25" y="495">NOT TO SCALE · WANDERING ENCOURAGED</text>
                ${c.zones.map((zone, i) => `<g class="zone" role="button" tabindex="0" data-zone="${i}" aria-label="${zone.name}" aria-pressed="${i === 0}"><circle cx="${zone.x}" cy="${zone.y}" r="20"/><text x="${zone.x}" y="${zone.y + 5}" text-anchor="middle">${i + 1}</text></g>`).join("")}
            </svg><p class="hint">Select a numbered point or use the buttons. Illustrative layout, not a navigation or safety map.</p></div>
            <aside><span class="eyebrow">Your field guide</span><div class="zone-list">${c.zones.map((zone, i) => `<button data-zone="${i}" aria-pressed="${i === 0}">${i + 1}. ${zone.name}</button>`).join("")}</div><div class="zone-detail" aria-live="polite"></div></aside>
        </section>
        <section class="section schedule split"><div><span class="eyebrow">Good to know</span><h2 class="display">Pack light.<br>Dance heavy.</h2></div><div><p>Gates open at noon. Bring ID, sun protection, a light layer and an empty reusable bottle. No glass, outside alcohol or open flames.</p><p>Step-free paths connect the gate, stages, water and accessible toilets. Assistance dogs welcome. This is a fictional event; no access arrangements can actually be booked.</p></div></section>`;
    function chooseZone(index)
    {
        const zone = c.zones[index];
        document.querySelector(".zone-detail").innerHTML = `<span class="eyebrow">Stop 0${index + 1}</span><h2>${zone.name}</h2><p>${zone.description}</p>`;
        document.querySelectorAll("[data-zone]").forEach(el => el.setAttribute("aria-pressed", Number(el.dataset.zone) === index));
    }
    document.querySelectorAll("[data-zone]").forEach(el =>
    {
        el.addEventListener("click", () => chooseZone(Number(el.dataset.zone)));
        if (el.tagName.toLowerCase() === "g") el.addEventListener("keydown", e =>
        {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseZone(Number(el.dataset.zone)); }
        });
    });
    chooseZone(0);
}

if (page === "tickets")
{
    main.innerHTML = `
        <section class="page-intro"><span class="eyebrow">${c.dates} · Make a weekend of it</span><h1 class="display">Your kind of sunshine.</h1><p class="intro">One great day or the whole glorious thing. Clear prices. No surprise fees. No checkout — this is a fictional festival.</p></section>
        <section class="section">
            <div class="tiers">${c.tiers.map((tier, i) => `<article class="tier ${i === 1 ? "featured" : ""}"><span class="eyebrow">${i === 1 ? "The crowd favorite" : tier.label}</span><h2>${tier.name}</h2><strong>$${tier.price}</strong><span> / person</span><p>${tier.details}</p><p>${tier.camp ? "Camping included" : "Camping not included"}<br>${tier.vip ? "VIP lounge + terrace" : "Free water + welfare"}</p><button class="button" data-tier="${i}">Price this pass ${arrow}</button></article>`).join("")}</div>
            <form class="calculator" id="calculator">
                <div><h2>Do the happy math.</h2><label for="tier">Your pass</label><select id="tier">${c.tiers.map((tier, i) => `<option value="${i}" ${i === 1 ? "selected" : ""}>${tier.name} · $${tier.price}</option>`).join("")}</select><div class="form-row"><div id="day-field" hidden><label for="day">Which day?</label><select id="day">${c.days.map(day => `<option>${day}</option>`).join("")}</select></div><div><label for="quantity">People (1–8)</label><input id="quantity" type="number" min="1" max="8" value="2" required></div></div></div>
                <div><span class="eyebrow">Your weekend, on paper</span><p id="estimate" class="notice" aria-live="polite"></p><div class="total"><span>Total · USD</span><output id="total" aria-live="polite">$378</output></div><p class="hint">All illustrative taxes and fees included.</p><p class="notice"><strong>A calculator, not a checkout.</strong><br>No payment, ticket, reservation or personal data is collected. Prices and availability are fictional. Nothing here guarantees entry to any event.</p></div>
            </form>
        </section>
        <section class="section"><span class="eyebrow">A few things before you pack</span><h2 class="display">Good questions.</h2><br>
            <details><summary>What comes with every pass?</summary><p>Access to both stages on your selected days, food vendors, free water stations, welfare and step-free viewing areas. Food and drinks cost extra. Prices are illustrative and all festival names and facilities are invented.</p></details>
            <details><summary>Can I camp with a General or VIP pass?</summary><p>No. Only Camp Weekend includes camping, from Friday 10:00 to Monday 10:00. Bring your own tent. Golden Hour VIP does not include camping. No camping upgrades are sold on this demo.</p></details>
            <details><summary>Is there an age policy?</summary><p>This fictional festival is 18+. Everyone would need their own pass and valid photo ID. There are no real age checks or admissions on this website.</p></details>
            <details><summary>Can I actually buy tickets?</summary><p>No. Sunspill is an invented festival website. The calculator helps compare the fictional tiers; there is no checkout, box office, refund policy or real booking service.</p></details>
        </section>`;
    const tier = document.querySelector("#tier");
    const quantity = document.querySelector("#quantity");
    const day = document.querySelector("#day");
    function calculate()
    {
        const selected = c.tiers[Number(tier.value)];
        document.querySelector("#day-field").hidden = tier.value !== "0";
        if (!quantity.validity.valid || !Number.isInteger(Number(quantity.value)))
        {
            document.querySelector("#total").value = "—";
            document.querySelector("#estimate").textContent = "Choose a whole number of people from 1 to 8.";
            return;
        }
        const number = Number(quantity.value);
        document.querySelector("#estimate").textContent = `${number} × ${selected.name}${tier.value === "0" ? ` · ${day.value}` : " · July 16–18"} at $${selected.price} each.`;
        document.querySelector("#total").value = `$${selected.price * number}`;
    }
    document.querySelector("form").addEventListener("submit", e => e.preventDefault());
    document.querySelector("form").addEventListener("input", calculate);
    document.querySelectorAll("[data-tier]").forEach(button => button.addEventListener("click", () =>
    {
        tier.value = button.dataset.tier;
        calculate();
        document.querySelector("#calculator").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        tier.focus({ preventScroll: true });
    }));
    calculate();
}

addEventListener("pagehide", () => audio.close());
