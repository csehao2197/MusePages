import fs from "node:fs/promises";
import path from "node:path";
import { base } from "../../../270-invitation-based-vpn-account-portal-test-plan/GPT-6/.checks/ui.mjs";
const folder = path.join(process.cwd(), "out", "pages", "278-art-gallery", "GPT-6");
const works = [["Slow Water (iv)", "2025", "Oil and pigment on linen", "180 × 140 cm"], ["Slow Water (vii)", "2026", "Oil and pigment on linen", "210 × 165 cm"], ["Holdfast", "2025", "Oil on canvas", "90 × 90 cm"], ["Untitled (Jutland)", "2026", "Pigment and wax on unstretched linen", "240 × 190 cm"], ["Slow Water (i)", "2024", "Oil on canvas", "120 × 100 cm"], ["Low Tide, Repeated", "2026", "Oil and pigment on linen", "165 × 165 cm"]];
const palettes = [["#c7c3a9", "#6f8d8a", "#344e54", "#d9d4bb"], ["#c5c6b0", "#a3afb0", "#557778", "#d8d1b3"], ["#b2a08d", "#8d5c4e", "#c48060", "#d5b79a"], ["#bfc5bf", "#7d918b", "#384f51", "#c9be9d"], ["#d0c8b3", "#9aa398", "#72837c", "#e5ddc1"], ["#a9b5b0", "#5f7c7b", "#2c4b50", "#c3b491"]];
function art(i, prefix)
{
    const c = palettes[i];
    return `<svg viewBox="0 0 500 610" role="img" aria-label="Original abstract landscape study ${i + 1}"><defs><filter id="${prefix}grain"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="3" seed="${i + 5}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><filter id="${prefix}edge"><feTurbulence baseFrequency=".012" numOctaves="3" seed="${i + 3}"/><feDisplacementMap in="SourceGraphic" scale="25"/></filter></defs><rect width="500" height="610" fill="${c[0]}"/><g filter="url(#${prefix}edge)"><path d="M-20 ${170 + i * 18}Q180 ${240 - i * 12} 520 ${180 + i * 8}V630H-20Z" fill="${c[1]}"/><path d="M-20 ${330 - i * 6}Q230 ${250 + i * 15} 520 ${350 - i * 8}V630H-20Z" fill="${c[2]}"/><path d="M-20 ${470 - i * 9}Q150 ${440 + i * 6} 520 ${510 - i * 8}V630H-20Z" fill="${c[3]}"/><path d="M-20 354Q130 326 520 374" fill="none" stroke="${c[0]}" stroke-width="${12 + i * 3}" opacity=".55"/></g><rect width="500" height="610" fill="transparent" filter="url(#${prefix}grain)"/></svg>`;
}
const artists = [["Ines Okafor", "Painting. Weather, water, and the failure of horizons."], ["Tobias Lind", "Sculpture in cast aluminium and salvaged timber."], ["Mariam Haddad", "Photography and archival print, working with family document."], ["Petra Solberg", "Installation and sound, often site-responsive."], ["Kenji Aoyama", "Ceramics and glaze research."], ["Rune Dahl", "Drawing at very large scale, graphite and gesso."]];
const archive = [["2026", "Tobias Lind", "Ballast", "12 June–26 July"], ["2026", "Group", "Four Rooms", "8 March–19 April"], ["2025", "Mariam Haddad", "The Second Archive", "14 November–21 December"], ["2025", "Kenji Aoyama", "Ash Glaze", "5 September–25 October"], ["2025", "Petra Solberg", "Low Frequency", "30 May–12 July"], ["2025", "Rune Dahl", "Two Metres of Graphite", "21 February–5 April"]];
const body = `<header><div class="wrap nav"><a class="logo" href="#home">VESSEL GALLERY<small>COPENHAGEN</small></a><button id="menu" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation">${[["Current", "current"], ["Works", "works"], ["Artists", "artists"], ["Archive", "archive"], ["Visit", "visit"]].map(([n, id]) => `<a href="#${id}">${n}</a>`).join("")}</nav></div></header>
<main><section class="wrap hero"><p class="eyebrow">FEATURED EXHIBITION / AUTUMN 2026</p><h1>Ines Okafor<br><em>Slow Water</em></h1><p class="dates">6 September – 18 October 2026</p><p class="curatorial">Nine new paintings made over two winters in Jutland, in which the horizon is never quite where you expect it.</p><p class="concept-note">Fictional exhibition · original interpretive illustrations</p></section>
<section class="wrap installation" id="current"><div class="gallery-wall"><div>${art(0, "wallA")}</div><div>${art(1, "wallB")}</div><div>${art(3, "wallC")}</div></div><div class="installation-caption"><p>Ines Okafor<br><em>Slow Water</em>, installation concept, 2026</p><p>Okafor works in thin layers of oil and raw pigment, building surfaces that read as weather before they read as landscape. An exhibition imagined from the original brief, not documentation of a real show.</p></div></section>
<section class="wrap section" id="works"><h2>Selected works</h2><p class="muted note">Original SVG studies for this concept. Availability list on request.</p><div class="works">${works.map(([n, y, m, d], i) => `<figure><button class="artwork" data-work="${i}" aria-label="View ${n}">${art(i, "work" + i)}</button><figcaption><span>Ines Okafor <small>(fictional artist)</small></span><em>${n}</em>, ${y}<br>${m}<br>${d}<br><button data-work="${i}" class="caption-link">View work →</button></figcaption></figure>`).join("")}</div></section>
<section class="wrap narrow section" id="artists"><p class="eyebrow">REPRESENTED / CONCEPT ROSTER</p><h2>Artists</h2>${artists.map(([n, d]) => `<details class="artist"><summary>${n}</summary><p>${d}</p><p class="note">Fictional artist profile from the project brief. Enquire for the concept availability list.</p></details>`).join("")}</section>
<section class="wrap section" id="archive"><div class="archive-heading"><div><p class="eyebrow">PAST EXHIBITIONS</p><h2>Archive</h2></div><label>Year<select id="year"><option value="">All years</option><option>2026</option><option>2025</option></select></label></div><div class="archive-table">${archive.map(([y, n, t, d]) => `<article class="archive-row" data-year="${y}"><span>${y}</span><span>${n}</span><em>${t}</em><time>${d}</time></article>`).join("")}</div><p class="note" id="archive-count" role="status">6 exhibition records</p></section>
<section class="wrap narrow section"><p class="eyebrow">FOR COLLECTORS & INSTITUTIONS</p><h2>Viewing room</h2><p>A private viewing room would offer full documentation, condition reports and installation views at scale. Access is arranged individually.</p><a class="text-link" href="mailto:enquiries@vesselgallery.dk?subject=Viewing%20room%20enquiry">Enquire about access →</a><p class="note">This concept has no gated room or actual condition reports.</p></section>
<section class="wrap narrow section fairs"><p class="eyebrow">ART FAIRS / 2026 PROGRAMME CONCEPT</p>${[["Enter Art Fair, Copenhagen", "Booth B14 · 27–30 August"], ["Paris Internationale", "Booth 22 · 15–19 October"], ["Art Basel Miami Beach", "Nova, Booth N08 · 4–7 December"]].map(([n, d]) => `<article><h3>${n}</h3><p>${d} 2026</p></article>`).join("")}</section>
<section class="wrap section visit" id="visit"><div><p class="eyebrow">ENQUIRIES</p><h2>A conversation, not a checkout.</h2><p>For availability, pricing and documentation:</p><a href="mailto:enquiries@vesselgallery.dk">enquiries@vesselgallery.dk</a><br><a href="tel:+4533550142">+45 33 55 0142</a><p class="note">Concept contact details. Availability is not held on this page.</p></div><div><p class="eyebrow">VISIT / CONCEPT INFORMATION</p><p>Vesterbrogade 74<br>1620 Copenhagen V</p><p>Tue–Fri 12:00–18:00<br>Sat 11:00–16:00</p><p>Admission free<br>Step-free entrance from the courtyard.</p><details><summary>Plan your visit</summary><p>Confirm current opening hours and courtyard access with the gallery before travelling. This fictional programme is not a live schedule.</p></details></div></section></main>
<footer><div class="wrap">VESSEL GALLERY · Copenhagen · © 2026 Concept<br>All six artworks and the installation view are original digital illustrations, not works or photographs by a real represented artist.<p><a href="mailto:enquiries@vesselgallery.dk?subject=Mailing%20list">Mailing list enquiry →</a></p></div></footer>
<dialog id="work-dialog"><button id="close-work">Close</button><div id="work-image"></div><h2 id="work-title"></h2><p id="work-label"></p><p class="note">Original interpretive illustration for a fictional exhibition.</p><a id="work-enquiry">Enquire about this work →</a><div class="dialog-nav"><button id="previous">← Previous</button><button id="next">Next →</button></div><p id="position" aria-live="polite"></p></dialog>`;
const css = `:root {--paper:#fff;--ink:#141414;--accent:#555;--muted:#6d6d6d;--line:#e6e6e6;}body {font-weight:300;font-size:15px;}header {position:static;border:0;}.wrap {width:min(1060px,calc(100% - 96px));}.nav {min-height:110px;}.logo {font-size:15px;font-weight:500;letter-spacing:1px;}.logo small {font-size:9px;letter-spacing:1px;margin-top:3px;}nav {font-size:11px;gap:30px;}.hero {padding-top:100px;padding-bottom:130px;}.eyebrow {color:#777;font-size:10px;font-weight:400;letter-spacing:1.5px;}h1 {font-size:43px;font-weight:300;line-height:1.4;letter-spacing:-1px;margin:25px 0;}h2 {font-size:25px;font-weight:400;letter-spacing:-.4px;}h3 {font-size:16px;font-weight:400;} .dates {font-size:12px;}.curatorial {max-width:470px;font-size:14px;color:#666;margin-top:28px;}.concept-note,.note {font-size:11px;color:#777;}.concept-note {margin-top:30px;}.gallery-wall {background:#f1f0eb;display:flex;align-items:center;gap:9%;height:430px;padding:60px 10%;border-bottom:60px solid #d5d4ce;}.gallery-wall>div {width:27%;box-shadow:3px 4px 2px #78776a18;}.gallery-wall>div:nth-child(2) {width:30%;}.gallery-wall svg {height:230px;}.installation-caption {display:grid;grid-template-columns:1fr 1fr;gap:90px;font-size:11px;color:var(--muted);padding:20px 0;}.section {padding-top:95px;padding-bottom:95px;}.works {display:grid;grid-template-columns:1fr 1fr;gap:90px 130px;margin-top:65px;}figure {margin:0;}.artwork {display:block;border:0;padding:0;width:100%;background:#fafafa;}.artwork svg {width:100%;height:auto;max-height:490px;}.artwork:hover {filter:none;cursor:crosshair;}figcaption {font-size:11px;color:#6d6d6d;line-height:1.9;margin-top:25px;}figcaption>span {display:block;color:#141414;}figcaption small {font-size:9px;color:#777;}.caption-link {border:0;border-bottom:1px solid #ddd;padding:0;font-size:11px;margin-top:10px;}.narrow {max-width:670px;}.artist summary {font-size:18px;font-weight:400;list-style:none;}.artist p {font-size:13px;}.archive-heading {display:flex;justify-content:space-between;align-items:center;}.archive-heading label {width:140px;font-size:10px;}.archive-heading select {font-size:11px;padding:7px;}.archive-row {display:grid;grid-template-columns:60px 1fr 1fr 1.2fr;gap:25px;border-top:1px solid var(--line);padding:20px 0;font-size:11px;color:#666;}.archive-row time {text-align:right;}.text-link {border-bottom:1px solid #aaa;font-size:13px;}.fairs article {padding:15px 0;border-bottom:1px solid var(--line);}.fairs p {font-size:12px;color:#777;}.visit {display:grid;grid-template-columns:1.3fr 1fr;gap:100px;}.visit a {font-size:14px;}.visit p {font-size:13px;}.visit details p {font-size:12px;}footer {font-size:10px;line-height:1.9;}#work-dialog {width:min(700px,calc(100% - 32px));padding:25px;}#close-work {float:right;border:0;padding:0 0 15px;font-size:12px;}#work-image {clear:both;}#work-image svg {max-height:60vh;width:100%;}#work-label {font-size:12px;color:#666;}#work-enquiry {font-size:12px;border-bottom:1px solid #ccc;}.dialog-nav {display:flex;justify-content:space-between;margin-top:25px;}.dialog-nav button {font-size:11px;border:0;padding:0;}#position {text-align:center;font-size:10px;color:#777;}@media(max-width:760px) {.wrap {width:calc(100% - 44px);}.nav {min-height:85px;}#navigation {top:85px;}.hero {padding-top:65px;padding-bottom:80px;}h1 {font-size:36px;}.gallery-wall {height:260px;padding:40px 7%;gap:8%;border-bottom-width:35px;}.gallery-wall svg {height:140px;}.installation-caption,.works,.visit {grid-template-columns:1fr;gap:30px;}.works {gap:70px;margin-top:45px;}.artwork svg {max-height:440px;}.section {padding-top:65px;padding-bottom:65px;}.archive-row {grid-template-columns:50px 1fr;gap:10px;}.archive-row time {text-align:left;}.archive-row em {grid-column:2;}.archive-row time {grid-column:2;}.visit {gap:60px;}.logo {font-size:13px;}}`;
const js = `
const $ = (s) => document.querySelector(s);
$("#menu").onclick = () =>
{
    const open = $("#navigation").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
};
document.querySelectorAll("nav a").forEach((a) => a.onclick = () =>
{
    $("#navigation").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
const works = ${JSON.stringify(works)};
let selected = 0;
function show()
{
    const w = works[selected];
    $("#work-title").textContent = w[0];
    $("#work-label").textContent = "Ines Okafor · " + w[1] + " · " + w[2] + " · " + w[3];
    $("#work-image").replaceChildren(document.querySelector(".artwork[data-work='" + selected + "'] svg").cloneNode(true));
    $("#work-enquiry").href = "mailto:enquiries@vesselgallery.dk?subject=" + encodeURIComponent("Work enquiry: " + w[0]);
    $("#position").textContent = (selected + 1) + " / " + works.length;
}
document.querySelectorAll("[data-work]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.work);
    show();
    $("#work-dialog").showModal();
});
$("#close-work").onclick = () => $("#work-dialog").close();
$("#next").onclick = () =>
{
    selected = (selected + 1) % works.length;
    show();
};
$("#previous").onclick = () =>
{
    selected = (selected + works.length - 1) % works.length;
    show();
};
$("#year").onchange = () =>
{
    let count = 0;
    document.querySelectorAll(".archive-row").forEach((r) =>
    {
        r.hidden = Boolean($("#year").value) && r.dataset.year !== $("#year").value;
        if (!r.hidden) count++;
    });
    $("#archive-count").textContent = count + " exhibition records";
};
`;
const tests = `
export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;
    assert(await page.locator(".artwork").count() === 6, "Six original work illustrations");
    await page.locator(".artwork").first().click();
    assert(await page.locator("#work-title").textContent() === "Slow Water (iv)", "Correct work details");
    await page.locator("#previous").click();
    assert(await page.locator("#position").textContent() === "6 / 6", "Previous wraps to last work");
    await page.locator("#next").click();
    assert(await page.locator("#position").textContent() === "1 / 6", "Next wraps to first work");
    assert((await page.locator("#work-enquiry").getAttribute("href")).includes("Slow%20Water"), "Work-specific enquiry subject");
    await page.keyboard.press("Escape");
    assert(!await page.locator("#work-dialog").isVisible(), "Escape closes work");
    await page.locator("#year").selectOption("2025");
    assert(await page.locator(".archive-row:visible").count() === 4, "Archive 2025 filter");
    await page.locator("#year").selectOption("2026");
    assert(await page.locator(".archive-row:visible").count() === 2, "Archive 2026 filter");
    await page.locator("#year").selectOption("");
    assert(await page.locator(".archive-row:visible").count() === 6, "Archive filter reset");
    await page.locator(".artist summary").nth(2).click();
    assert((await page.locator(".artist").nth(2).textContent()).includes("archival print"), "Artist practice disclosure");
    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu open");
        await page.locator('#navigation a[href="#visit"]').click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes after anchor");
    }
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
`;
await fs.writeFile(path.join(folder, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vessel Gallery: Slow Water</title><link rel="stylesheet" href="style.css"><script defer src="app.js"></script></head><body id="home">${body}</body></html>`);
await fs.writeFile(path.join(folder, "style.css"), base + css.replace(/\s*\{\s*/g, "\n{\n    ").replace(/;\s*/g, ";\n    ").replace(/\s*\}\s*/g, "\n}\n"));
await fs.writeFile(path.join(folder, "app.js"), js);
await fs.writeFile(path.join(folder, "verify.mjs"), tests);
await fs.writeFile(path.join(folder, ".checks", "spec.json"), JSON.stringify({ title: "Vessel Gallery: Slow Water", tags: ["Contemporary Art", "Gallery", "White Cube"], features: "Six original textured SVG artworks, installation illustration, work viewer with cyclic navigation and specific email subjects, artist disclosures, year-filtered archive and visit information.", limits: "Fictional gallery, artists, exhibition programme and contact details. Original digital illustrations are explicitly not physical works by a real artist. No ecommerce, availability database, forms or actual private viewing room. Static system-font adaptation." }, null, 4));
await fs.writeFile(path.join(folder, ".checks", "source.ready"), "");
