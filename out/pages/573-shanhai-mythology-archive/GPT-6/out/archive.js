"use strict";

const beasts =
[
    {
        id: "zhulong", name: "Zhulong", archiveNo: "S-001", epithet: "The eye of day and night",
        domain: "The far northern darkness", riskLevel: "Extreme", element: "Time / Light", region: "North", seal: "DAY",
        shortDescription: "Its open eye brings the day; its breath calls the night. An ancient horizon holds its gaze.",
        curatorNote: "More than a great beast, Zhulong imagines the order of day and night as a living presence. Circular sun-and-moon marks and a single pale eye make time visible.",
        visualMotif: "A watchful eye, cinnabar scales, concentric sun-and-moon rings"
    },
    {
        id: "dijiang", name: "Dijiang", archiveNo: "S-002", epithet: "An echo before the world",
        domain: "The deep western wilds", riskLevel: "Undetermined", element: "Sound / Space", region: "West", seal: "ORIGIN",
        shortDescription: "Faceless yet able to sing: a primordial echo that has not yet been given a name.",
        curatorNote: "No face is supplied to explain the unknown. Six feet, membranous wings, and a drum-like body turn absence into the specimen's defining feature.",
        visualMotif: "Six feet, a faceless drum-shaped body, expanding sound rings"
    },
    {
        id: "jiuweihu", name: "Nine-tailed fox", archiveNo: "S-003", epithet: "Nine paths of possibility",
        domain: "Qingqiu, the green hills", riskLevel: "High", element: "Omens / Apparitions", region: "East", seal: "OMEN",
        shortDescription: "Nine tails unfurl like unfinished roads. Every backward glance is a branching of fate.",
        curatorNote: "This fox is a study in premonition, not seduction. Pale eyes and nine jade-colored tails suggest paths whose destinations remain unseen.",
        visualMotif: "Nine distinct tails, pale eyes, branching jade trails", romanization: "Jiuweihu"
    },
    {
        id: "bifang", name: "Bifang", archiveNo: "S-004", epithet: "The quiet sign of fire",
        domain: "The dry southern forests", riskLevel: "High", element: "Fire / Calamity", region: "South", seal: "FIRE",
        shortDescription: "Standing on a single foot, it carries the first suggestion of fire in the grain of its feathers.",
        curatorNote: "Fire is restrained to narrow cinnabar lines and a trail of red footprints. The stillness of this one-legged bird matters more than a spectacle of flame.",
        visualMotif: "One leg, fine fire-marked feathers, cinnabar footprints"
    },
    {
        id: "yingzhao", name: "Yingzhao", archiveNo: "S-005", epithet: "The keeper of boundaries",
        domain: "The borders of Kunlun", riskLevel: "Moderate", element: "Guardianship / Wind", region: "Central", seal: "GUARD",
        shortDescription: "Part horse, part beast, part bird: an ancient guardian making its unending rounds.",
        curatorNote: "Wings, a horse-like body, bronze armor marks, and patrolling lines speak of boundaries. Its power is the keeping of an order, rather than its destruction.",
        visualMotif: "Broad wings, an equine body, bronze armor-like plates"
    },
    {
        id: "chenghuang", name: "Chenghuang", archiveNo: "S-006", epithet: "A passage on the wind",
        domain: "The open eastern plains", riskLevel: "Low", element: "Wind / Travel", region: "East", seal: "ROAM",
        shortDescription: "An arrival like a road opening into the distance, carrying old dreams of speed and long life.",
        curatorNote: "A light silhouette, a long tail, and flowing wind marks give this specimen its forward motion. Muted jade keeps the encounter gentle.",
        visualMotif: "A long flowing tail, wind lines, soft ancient-jade tones"
    },
    {
        id: "xuangui", name: "Xuangui", archiveNo: "S-007", epithet: "An echo under water",
        domain: "The shores of Blackwater", riskLevel: "Moderate", element: "Water / Sound", region: "North", seal: "WATER",
        shortDescription: "Its shell carries the courses of old rivers. Its low call recalls wood striking stone.",
        curatorNote: "River contours and quiet rings of sound anchor this turtle-like being near the bottom of the cabinet: low, slow, and almost submerged.",
        visualMotif: "A river-patterned shell, a bird-like head, low ripples"
    },
    {
        id: "qiongqi", name: "Qiongqi", archiveNo: "S-008", epithet: "A warning against disorder",
        domain: "The northwestern wastes", riskLevel: "Extreme", element: "Transgression / Warning", region: "West", seal: "CAUTION",
        shortDescription: "Not merely a fierce beast, but a warning specimen of a world whose moral order has come undone.",
        curatorNote: "A sharp silhouette carries the tension. Red appears only in its tiny warning-like eyes; menace does not require excess.",
        visualMotif: "Angular wings, a beast-like body, small warning-red eyes"
    },
    {
        id: "qitu", name: "Qitu", archiveNo: "S-009", epithet: "Three heads, one warning",
        domain: "The shaded mountain forests", riskLevel: "Elevated", element: "Bird omens / Vigilance", region: "South", seal: "WATCH",
        shortDescription: "Three heads watch three directions, as if listening at once for the past, the present, and what comes next.",
        curatorNote: "A simple three-headed silhouette prevents anatomy from becoming spectacle. Dark feathers and fine warning marks keep the mood watchful.",
        visualMotif: "Three bird heads, dark feathers, fine observation marks"
    }
];

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const byId = (id) => beasts.find((beast) => beast.id === id);
const art = (beast, className = "") => `<svg class="${className}" viewBox="0 0 600 600" aria-hidden="true"><use href="specimens.svg#${beast.id}"/></svg>`;
const storageKey = "shanhai-archive-v1";
let state = { collections: [], seals: {}, visits: 0 };
let canStore = true;
try
{
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object")
    {
        state.collections = Array.isArray(saved.collections) ? [...new Set(saved.collections.filter((id) => byId(id)))] : [];
        state.seals = saved.seals && typeof saved.seals === "object" && !Array.isArray(saved.seals) ? saved.seals : {};
        state.visits = Number.isSafeInteger(saved.visits) && saved.visits >= 0 ? saved.visits : 0;
    }
}
catch
{
    canStore = false;
}

function save()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }
    catch
    {
        canStore = false;
    }
}

state.visits += 1;
save();
$("#visit-count").textContent = String(state.visits).padStart(2, "0");
let selectedRegion = "All";
let featured = "zhulong";
let atlasRegion = "North";
let currentRecord = null;
let returnFocus = null;
const recordDialog = $("#record-dialog");
const notebookDialog = $("#notebook-dialog");

function renderArchive()
{
    const query = $("#search").value.trim().toLowerCase();
    const filtered = beasts.filter((beast) =>
        (selectedRegion === "All" || beast.region === selectedRegion) &&
        `${beast.name} ${beast.id} ${beast.element} ${beast.epithet} ${beast.archiveNo}`.toLowerCase().includes(query));
    $("#archive-grid").innerHTML = filtered.map((beast) => `
        <button class="specimen-card" data-record="${beast.id}" aria-label="Open ${beast.name} specimen record">
            <div class="card-art"><span class="card-number">${beast.archiveNo}</span><span class="card-seal">${beast.seal}</span>${art(beast)}</div>
            <div class="card-info"><h3>${beast.name}</h3><p class="card-epithet">${beast.epithet}</p><div class="card-meta"><span>${beast.region.toUpperCase()} / ${beast.element.split(" / ")[0].toUpperCase()}</span><span aria-hidden="true">↗</span></div></div>
        </button>`).join("");
    $("#results").textContent = selectedRegion === "All" && !query ? "Showing all 9 specimens" :
        `${filtered.length} specimen${filtered.length === 1 ? "" : "s"} found${selectedRegion !== "All" ? ` · ${selectedRegion}ern realm`.replace("Centralern", "Central") : ""}`;
    $("#no-results").hidden = filtered.length !== 0;
    all("[data-region]").forEach((button) =>
    {
        const active = button.dataset.region === selectedRegion;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function setRegion(region)
{
    selectedRegion = region;
    renderArchive();
}

function facts(beast)
{
    return `<div><dt>Territory</dt><dd>${beast.domain}</dd></div><div><dt>Element</dt><dd>${beast.element}</dd></div><div><dt>Archive region</dt><dd>${beast.region}ern Mountains</dd></div><div><dt>Mythic risk</dt><dd>${beast.riskLevel}</dd></div>`.replace("Centralern", "Central");
}

function setFeatured(id)
{
    const beast = byId(id);
    featured = id;
    $("#feature-name").textContent = beast.name;
    $("#feature-epithet").textContent = beast.epithet.toUpperCase();
    $("#feature-description").textContent = beast.shortDescription;
    $("#feature-facts").innerHTML = facts(beast);
    $("#feature-note").textContent = beast.curatorNote;
    $("#feature-number").textContent = `PLATE ${["zhulong", "dijiang", "jiuweihu"].indexOf(id) + 1} / ${beast.archiveNo}`;
    $("#featured-image").innerHTML = `<use href="specimens.svg#${id}"/>`;
    $("#featured-image").setAttribute("aria-label", `Original illustration of ${beast.name}`);
    all("[data-feature]").forEach((button) =>
    {
        const selected = button.dataset.feature === id;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

function openRecord(id, trigger)
{
    const beast = byId(id);
    if (!beast)
    {
        return;
    }
    if (notebookDialog.open)
    {
        notebookDialog.close();
    }
    currentRecord = id;
    returnFocus = trigger || document.activeElement;
    $("#record-id").textContent = `${beast.archiveNo} / ${beast.region.toUpperCase()}ERN REALM`.replace("CENTRALERN", "CENTRAL");
    $("#record-content").innerHTML = `<div class="record-layout">${art(beast, "record-art")}<div class="record-copy"><p class="eyebrow">${beast.epithet.toUpperCase()}</p><h2 id="record-name">${beast.name}</h2><p class="caption">${beast.romanization || beast.name} · A contemporary mythic interpretation</p><p style="margin-top:20px">${beast.shortDescription}</p><dl class="specimen-facts">${facts(beast)}</dl><p class="micro">CURATOR'S OBSERVATION</p><blockquote>${beast.curatorNote}</blockquote><div class="record-motif"><span class="micro">IDENTIFYING TRACES</span><br>${beast.visualMotif}</div><button class="button primary" id="collect-record"></button><p class="caption" id="collection-message" role="status"></p></div></div>`;
    updateCollectButton();
    recordDialog.style.transformOrigin = "center";
    if (trigger && trigger.classList.contains("specimen-card"))
    {
        const box = trigger.getBoundingClientRect();
        recordDialog.style.transformOrigin = `${Math.max(0, Math.min(100, (box.x + box.width / 2) / window.innerWidth * 100))}% center`;
    }
    recordDialog.showModal();
    recordDialog.scrollTop = 0;
}

function updateCollectButton()
{
    const collected = state.collections.includes(currentRecord);
    $("#collect-record").textContent = collected ? "Remove from your collection −" : "Collect this record +";
    $("#collect-record").setAttribute("aria-pressed", String(collected));
    $("#collection-count").textContent = `${state.collections.length} / 9 COLLECTED`;
}

function renderNotebook()
{
    const collected = beasts.filter((beast) => state.collections.includes(beast.id));
    $("#notebook-list").innerHTML = collected.length ? collected.map((beast) => `<button class="notebook-record" data-record="${beast.id}">${art(beast)}<span><strong>${beast.name}</strong><small>${beast.archiveNo} / ${beast.epithet}</small></span></button>`).join("") :
        `<p class="feature-summary">Your cabinet is waiting. Open any specimen and choose “Collect this record” to keep your first encounter.</p>`;
}

const realms =
{
    North: { title: "The Northern Mountains", description: "At the edge of light, a dragon keeps time and a river-shell carries its low, submerged song." },
    East: { title: "The Eastern Mountains", description: "Beyond the green hills, nine paths of fate meet a creature born for the open wind." },
    South: { title: "The Southern Mountains", description: "In dry forests and deep shade, birds hold their vigil. Read the quiet signs before the world changes." },
    West: { title: "The Western Mountains", description: "Where the known world loosens its hold, a faceless singer and an angular warning wait to be encountered." },
    Central: { title: "The Central Mountains", description: "The borders of Kunlun belong to the watchful. A winged guardian keeps the passage between realms." }
};

function setAtlas(region)
{
    atlasRegion = region;
    $("#atlas-name").textContent = realms[region].title;
    $("#atlas-description").textContent = realms[region].description;
    $("#atlas-beasts").innerHTML = beasts.filter((beast) => beast.region === region).map((beast) => `<button class="atlas-record" data-record="${beast.id}">${beast.name}<span>${beast.archiveNo} ↗</span></button>`).join("");
    all("[data-atlas]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.atlas === region)));
}

const now = new Date();
const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
const daily = beasts[dayNumber % beasts.length];
$("#ticket-date").textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
$("#ticket-date").dateTime = dateKey;
$("#daily-name").textContent = daily.name;
$("#daily-epithet").textContent = daily.epithet;
$("#ticket-serial").textContent = `${daily.archiveNo} / ${daily.region.toUpperCase()} / ${daily.seal}`;
$("#ticket-image").innerHTML = `<use href="specimens.svg#${daily.id}"/>`;
$("#ticket-image").setAttribute("aria-label", `Today's beast: ${daily.name}`);
$("#collection-count").textContent = `${state.collections.length} / 9 COLLECTED`;

function updateSeal()
{
    const sealed = state.seals[dateKey] === daily.id;
    $("#seal-button").disabled = sealed;
    $("#seal-button").textContent = sealed ? `Sealed · ${daily.seal}` : "Leave your seal ◇";
    if (sealed)
    {
        $("#seal-message").textContent = `Your impression of ${daily.name} is kept${canStore ? " on this device" : " for this visit"}. Return tomorrow for another encounter.`;
    }
}

$("#seal-button").addEventListener("click", () =>
{
    state.seals[dateKey] = daily.id;
    save();
    updateSeal();
});
$("#daily-open").addEventListener("click", (event) => openRecord(daily.id, event.currentTarget));
$("#feature-open").addEventListener("click", (event) => openRecord(featured, event.currentTarget));
$("#search").addEventListener("input", renderArchive);
all("[data-region]").forEach((button) => button.addEventListener("click", () => setRegion(button.dataset.region)));
all("[data-feature]").forEach((button) => button.addEventListener("click", () => setFeatured(button.dataset.feature)));
all("[data-atlas]").forEach((button) => button.addEventListener("click", () => setAtlas(button.dataset.atlas)));
$("#atlas-filter").addEventListener("click", () =>
{
    $("#search").value = "";
    setRegion(atlasRegion);
    $("#archive").scrollIntoView({ behavior: "smooth" });
    all("[data-region]").find((button) => button.dataset.region === atlasRegion).focus({ preventScroll: true });
});
$("#notebook-button").addEventListener("click", () =>
{
    returnFocus = $("#notebook-button");
    renderNotebook();
    notebookDialog.showModal();
});
document.addEventListener("click", (event) =>
{
    const record = event.target.closest("[data-record]");
    if (record)
    {
        openRecord(record.dataset.record, record);
    }
    if (event.target.closest("#collect-record"))
    {
        const index = state.collections.indexOf(currentRecord);
        if (index >= 0)
        {
            state.collections.splice(index, 1);
        }
        else
        {
            state.collections.push(currentRecord);
        }
        save();
        updateCollectButton();
        $("#collection-message").textContent = state.collections.includes(currentRecord) ?
            `Added to your ${canStore ? "personal" : "visit"} collection.` : "Removed from your collection.";
    }
    const close = event.target.closest(".close-dialog");
    if (close)
    {
        close.closest("dialog").close();
    }
});
for (const dialog of [recordDialog, notebookDialog])
{
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab")
        {
            return;
        }
        const focusable = [...dialog.querySelectorAll("button:not(:disabled), a[href], input, [tabindex='0']")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first?.focus();
        }
    });
    dialog.addEventListener("click", (event) =>
    {
        if (event.target === dialog)
        {
            const box = dialog.getBoundingClientRect();
            if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)
            {
                dialog.close();
            }
        }
    });
    dialog.addEventListener("close", () =>
    {
        if (returnFocus?.isConnected && !returnFocus.closest("dialog:not([open])"))
        {
            returnFocus.focus({ preventScroll: true });
        }
        else
        {
            $("#notebook-button").focus({ preventScroll: true });
        }
    });
}

const menuButton = $(".menu-toggle");
function closeMenu()
{
    $("#navigation").classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector("span").textContent = "+";
}
menuButton.addEventListener("click", () =>
{
    const opened = $("#navigation").classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.querySelector("span").textContent = opened ? "−" : "+";
});
all("#navigation a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menuButton.focus();
    }
});
renderArchive();
setFeatured("zhulong");
setAtlas("North");
updateSeal();
