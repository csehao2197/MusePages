import fs from "node:fs/promises";
import path from "node:path";
import { base } from "../../../270-invitation-based-vpn-account-portal-test-plan/GPT-6/.checks/ui.mjs";
const folder = path.join(process.cwd(), "out", "pages", "279-art-studio", "GPT-6");
const classes = [["Monday, oil for beginners.", "Three hours. Six people. Twelve weeks, start any week.", "MONDAYS 18:30", 22], ["Wednesday, life drawing.", "Two and a half hours, a model, no instruction unless you ask for it.", "WEDNESDAYS 19:00", 16], ["Thursday, acrylic and colour.", "Three hours. Eight people. Mixing, mostly, for the first month.", "THURSDAYS 18:30", 22], ["Saturday, open studio.", "Four hours, no tutor, bring your own work. A workspace and a sink.", "SATURDAYS 10:00", 9]];
const captions = ["Jess, first term", "Mo, second attempt at the same jug", "Priya, life drawing, twenty minutes", "Alan, after four years", "Dee, week three", "Tom, abandoned and then finished"];
const compositions = [
    `<rect width="360" height="420" fill="#beb9a1"/><path d="M0 265L360 239V420H0" fill="#9d8e75"/><path d="M113 136H225L210 183L233 328Q166 348 101 321L124 185Z" fill="#e0d4b8"/><path d="M222 182Q306 170 276 245L220 263" fill="none" stroke="#ded0ae" stroke-width="18"/><ellipse cx="169" cy="142" rx="57" ry="15" fill="#7c7c67"/><path d="M139 171L126 302" stroke="#f0e2c5" stroke-width="10" opacity=".6"/>`,
    `<rect width="360" height="420" fill="#9aafa8"/><path d="M0 258H360V420H0" fill="#ab946f"/><path d="M119 95L213 104L204 170Q235 241 213 312Q161 339 112 308Q101 230 130 170Z" fill="#6c7f88"/><path d="M213 161Q299 160 273 228L219 245" fill="none" stroke="#526a73" stroke-width="15"/><path d="M142 129L130 294" stroke="#9eafa6" stroke-width="17"/><path d="M113 311Q167 334 213 313" fill="none" stroke="#344951" stroke-width="4"/>`,
    `<rect width="360" height="420" fill="#d0c4ae"/><g stroke="#615c50" fill="none" stroke-width="3"><ellipse cx="196" cy="73" rx="26" ry="34"/><path d="M180 104Q143 148 157 214L132 283L102 358M210 106Q234 163 217 217L245 283L285 336M157 135L113 203L148 241M218 139L254 203L216 228M158 214L216 217M132 283L245 283M155 214L187 278L163 362"/></g><path d="M134 286H258V309H134" fill="#a88d72" opacity=".45"/>`,
    `<rect width="360" height="420" fill="#c6c5a5"/><path d="M0 160Q80 110 180 170T360 153V420H0" fill="#8f9b79"/><path d="M0 240Q150 160 360 245V420H0" fill="#5f7764"/><path d="M0 320Q140 255 360 290V420H0" fill="#afb28a"/><path d="M0 288L360 228" stroke="#d1cc9e" stroke-width="13"/><path d="M230 240V70M230 110L194 90M230 142L270 101" stroke="#4b6250" stroke-width="7"/><path d="M178 100Q186 25 245 40Q302 40 280 111Q242 140 178 100" fill="#6c8062"/>`,
    `<rect width="360" height="420" fill="#d2af8d"/><path d="M0 268L360 220V420H0" fill="#965a47"/><ellipse cx="117" cy="287" rx="55" ry="38" fill="#c99349"/><path d="M240 160Q310 205 278 297Q218 324 193 278Q174 206 240 160" fill="#9eab80"/><path d="M242 168L257 139" stroke="#655d3e" stroke-width="10"/><path d="M78 274Q102 254 137 272" fill="none" stroke="#e1b46c" stroke-width="8"/><path d="M218 211Q202 254 226 277" fill="none" stroke="#bac396" stroke-width="12"/>`,
    `<rect width="360" height="420" fill="#acaaa0"/><rect x="36" y="34" width="270" height="245" fill="#d7d0bc"/><rect x="48" y="45" width="110" height="222" fill="#b3c5bf"/><rect x="171" y="45" width="122" height="222" fill="#9daea7"/><path d="M50 198L157 159V267H50M172 170L293 120V267H172" fill="#778c7c"/><path d="M0 340L360 300V420H0" fill="#9f8c71"/><path d="M70 296H307V319H70Z" fill="#d2b999"/><path d="M97 319V420M278 319V420" stroke="#6b6656" stroke-width="12"/>`
];
const art = (i) => `<svg viewBox="0 0 360 420" role="img" aria-label="Original student-work illustration: ${captions[i]}">${compositions[i]}</svg>`;
const room = `<svg viewBox="0 0 1400 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Original illustration of a working studio interior, with windows and canvases"><rect width="1400" height="720" fill="#454840"/><path d="M0 0L850 80V480L0 650Z" fill="#65695b"/><path d="M850 80L1400 0V650L850 480Z" fill="#7b7d6a"/><path d="M0 650L850 480L1400 650V720H0Z" fill="#494c40"/><path d="M920 100L1330 50V430L920 375Z" fill="#b8c2ad"/><g stroke="#777b66" stroke-width="15"><path d="M1050 85V393M1200 65V415M920 238L1330 238"/></g><path d="M0 90L690 140V310L0 340Z" fill="#8f8e77"/><path d="M45 115L220 130V285L45 291Z" fill="#b4a07e"/><path d="M290 138L470 152V290L290 295Z" fill="#9eaa8f"/><path d="M285 235L470 188V290L290 295Z" fill="#657c69"/><path d="M530 156L670 164V291L530 294Z" fill="#bfac8a"/><path d="M840 405L1230 460L1390 427L1020 380Z" fill="#ac9c7d"/><path d="M862 410V598M1218 459V675M1370 430V599" stroke="#44483c" stroke-width="14"/><path d="M650 440L813 418V605L652 635Z" fill="#b4a68b"/><path d="M672 455L794 439V590L672 611Z" fill="#86917d"/><path d="M1300 0L850 480L1040 720H1400V0Z" fill="#d4d8ba" opacity=".07"/></svg>`;
const body = `<header><div class="wrap nav"><a class="logo" href="#home">NINTH STREET<small>PAINTING STUDIO. MANCHESTER.</small></a><button id="menu" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation"><a href="#classes" class="underlined">Classes</a><a href="#room">The room</a><a href="#terms">Terms</a></nav></div></header>
<main><section class="hero">${room}<div class="hero-copy"><h1>A room with<br>bad light and<br><em>good company.</em></h1><p>EVENING CLASSES. EIGHT AT A TIME.</p></div><span class="image-note">Original studio illustration</span></section>
<section class="wrap statement"><p class="meta">EIGHT AT A TIME</p><p class="statement-copy">Eight places, one room above a carpet warehouse, and a tutor who will not tell you that you have a good eye.</p><p>We teach oil and acrylic to people who have never held a brush and to people who painted at school in 1974 and stopped. Nobody shows anybody their phone photographs of the Lake District.</p><p class="note">A fictional Manchester studio concept. All work and room imagery are original illustrations.</p></section>
<section class="wrap classes" id="classes"><p class="meta section-label">SOMETHING FOR YOUR EVENING</p><h2>Make a little room.</h2><label class="class-filter">Show<select id="class-filter"><option value="">All sessions</option><option value="evening">Evening classes</option><option value="weekend">Weekend studio</option></select></label>${classes.map(([n, d, t, p], i) => `<article class="class-block class-${i}" data-type="${i === 3 ? "weekend" : "evening"}"><p class="meta">${t} <span>£${p} A SESSION</span></p><h3>${n}</h3><p>${d}</p><button class="class-select" data-class="${i}">Work out the cost</button></article>`).join("")}<p id="class-count" role="status">4 sessions shown</p>
<section class="budget" id="budget"><p class="meta">A BACK-OF-THE-ENVELOPE BUDGET</p><h3 id="budget-title">Monday, oil for beginners.</h3><div class="budget-fields"><label>Sessions<input id="sessions" type="number" min="1" max="12" value="1" step="1"></label><label>Saturday easel hire<select id="hire"><option value="0">Not needed</option><option value="45">Add term hire · £45</option></select></label></div><p id="budget-result" role="status">1 session × £22 = £22</p><p class="note">Illustrative costs only. This does not reserve a place or collect payment.</p></section></section>
<section class="provided"><div class="wrap provided-inner"><p class="meta">WHAT YOU WORK ON</p><div class="provided-columns"><div><h2>Already here.</h2>${["A workspace and board", "Oil or acrylic paint in the basic range", "Tools, including the ones you will ruin", "Turps, rags and a sink", "Somewhere to leave a wet canvas for a week"].map((s) => `<p>${s}</p>`).join("")}</div><div><h2>Bring this.</h2><p>An apron or a shirt you have stopped caring about.</p><p>Your own canvas if you want a size we do not stock.</p><p>Nothing else.</p></div></div></div></section>
<section class="wall" id="room"><div class="wrap wall-inner"><p class="meta">FROM THE ROOM / ILLUSTRATED STUDIES</p><h2>Not quietly edited<br>to look better.</h2><div class="paintings">${captions.map((c, i) => `<figure class="painting painting-${i}">${art(i)}<figcaption>${c}</figcaption></figure>`).join("")}</div><p class="wall-caption">Some of these are first attempts and we have not quietly left those out.</p><p class="note">Fictional student captions from the brief. The images are original digital studies, not actual student submissions.</p></div></section>
<section class="wrap tutors"><p class="meta">THE PEOPLE IN THE ROOM</p><h2>Two tutors.<br>No artistic temperament.</h2>${[["Ruth Agyeman", "Paints large, teaches small. Twelve years here and she still sets up her own workspace on a Monday."], ["Stefan Barcz", "Life drawing only. Says almost nothing for the first hour and then says the one thing that fixes it."]].map(([n, d], i) => `<article><svg viewBox="0 0 120 140" role="img" aria-label="Illustrative portrait, not a photograph of ${n}"><rect width="120" height="140" fill="${i ? "#c0b9a2" : "#b8bca7"}"/><path d="M12 140Q15 90 60 90Q105 90 110 140" fill="${i ? "#797a68" : "#555d4c"}"/><ellipse cx="61" cy="60" rx="27" ry="34" fill="${i ? "#ba9c7c" : "#97775c"}"/><path d="M33 53Q25 12 63 18Q95 18 90 53L77 34L44 36Z" fill="#454b40"/></svg><div><h3>${n}.</h3><p>${d}</p></div></article>`).join("")}<p class="note">Fictional tutor biographies and illustrative portraits.</p></section>
<section class="term-section" id="terms"><div class="wrap terms"><p class="meta">TERM DATES / FROM THE CONCEPT BRIEF</p><h2>A place for a week.<br>No payment to hold it.</h2><div class="term-options" aria-label="Choose a term">${[["autumn", "AUTUMN · FROM 15 SEPTEMBER"], ["winter", "WINTER · FROM 6 JANUARY"], ["spring", "SPRING · FROM 20 APRIL"]].map(([id, n], i) => `<button data-term="${id}" aria-pressed="${i === 0}">${n}</button>`).join("")}</div><p id="term-info" role="status"></p><p>Availability in the brief is not live. Ask about the next start date before making plans.</p><a id="email-enquiry" class="underlined">Ask about this class</a><details><summary>Easel hire</summary><p>Term hire is £45 in the concept brief for Saturday work. Confirm access, storage and term length with the studio. No hire is arranged here.</p></details></div></section></main>
<footer><div class="wrap"><p>Ninth Street, Unit 2a, Hilton Works, Manchester M4 6AF</p><p><a href="mailto:hello@ninthstreet.studio">hello@ninthstreet.studio</a></p><p><a href="#classes">Classes</a> · <a href="#terms">Terms</a> · <a href="#terms">Easel hire</a> · Fictional studio concept</p></div></footer>`;
const css = `:root {--paper:#ede7da;--ink:#1c1a16;--accent:#a53a19;--muted:#635f56;--line:#c5bdac;} body {font-size:16px;font-weight:300;} header {position:static;border:0;} .wrap {width:min(1160px,calc(100% - 64px));}.nav {min-height:90px;}.logo {font-size:19px;letter-spacing:1px;}.logo small {font-size:14px;letter-spacing:0;font-weight:300;}.nav nav {font-size:14px;gap:35px;}.underlined {color:var(--accent);text-decoration:underline;text-underline-offset:5px;} .hero {height:660px;position:relative;overflow:hidden;}.hero>svg {width:100%;height:100%;object-fit:cover;}.hero-copy {position:absolute;left:max(5%,calc((100vw - 1160px)/2));bottom:50px;color:#f5eee0;}.hero h1 {font:400 clamp(58px,7vw,100px)/.93 Georgia,serif;letter-spacing:-3px;margin:0 0 30px;}.hero h1 em {font-weight:400;}.hero-copy p {font:14px Consolas,monospace;letter-spacing:1px;}.image-note {position:absolute;top:20px;right:25px;font-size:14px;color:#f3ecdd;background:#45483b;padding:4px 8px;}.meta,.note,small,figcaption,label,footer {font-size:14px;}.meta {font-family:Consolas,monospace;letter-spacing:.3px;color:var(--muted);}h2,h3 {font-family:Georgia,serif;font-weight:400;}h2 {font-size:45px;} .statement {padding:115px 0 90px;padding-left:17%;padding-right:20%;}.statement-copy {font:32px/1.35 Georgia,serif;}.statement .note {color:var(--muted);margin-top:30px;}.classes {padding:40px 0 110px;}.classes>h2,.section-label {margin-left:7%;}.class-filter {width:230px;margin-left:53%;margin-top:35px;}.class-block {max-width:620px;border-top:1px solid var(--line);padding:30px 0 35px;}.class-block .meta {font-size:14px;display:flex;flex-wrap:wrap;gap:20px;}.class-block .meta span {color:var(--accent);}.class-block h3 {font-size:37px;line-height:1.15;margin:20px 0;}.class-0 {margin-left:9%;}.class-1 {margin-left:34%;}.class-2 {margin-left:0;}.class-3 {margin-left:43%;}.class-select {font-size:14px;border:0;border-bottom:1px solid var(--ink);padding:0 0 4px;}.class-select[aria-pressed=true] {color:var(--accent);border-color:var(--accent);}#class-count {margin:25px 0 40px 9%;font-size:14px;color:var(--muted);}.budget {margin-left:18%;max-width:610px;padding:30px;border:1px solid var(--line);}.budget h3 {font-size:28px;}.budget-fields {display:grid;grid-template-columns:1fr 2fr;gap:20px;}#budget-result {font:22px Georgia,serif;color:var(--accent);}.note {color:var(--muted);}.provided {background:#e2dbcb;}.provided-inner {padding:75px 7% 85px;}.provided-columns {display:grid;grid-template-columns:1fr 1fr;gap:85px;}.provided p {border-bottom:1px solid #c8c0af;padding-bottom:12px;}.provided .meta {border:0;}.wall-inner {padding:100px 0;}.wall h2 {margin-left:22%;}.wall .meta {margin-left:5%;}.paintings {display:grid;grid-template-columns:repeat(12,1fr);gap:60px 30px;align-items:start;margin-top:55px;}.painting {margin:0;position:relative;}.painting::before {content:"";position:absolute;top:-5px;left:45%;width:7px;height:7px;background:var(--accent);border-radius:0;}.painting svg {width:100%;height:auto;}.painting figcaption {font:14px/1.6 Consolas,monospace;margin-top:15px;}.painting-0 {grid-column:1/5;transform:rotate(-2deg);}.painting-1 {grid-column:6/9;padding-top:20px;transform:rotate(2deg);}.painting-2 {grid-column:10/13;transform:rotate(-1deg);}.painting-3 {grid-column:2/6;transform:rotate(1deg);}.painting-4 {grid-column:7/10;transform:rotate(-2deg);padding-top:20px;}.painting-5 {grid-column:10/13;transform:rotate(2deg);}.wall-caption {margin:70px 0 0 14%;max-width:600px;font:26px/1.4 Georgia,serif;}.wall .note {margin-left:14%;max-width:600px;}.tutors {padding:20px 0 110px 34%;}.tutors article {display:flex;gap:25px;margin:40px 0;align-items:start;}.tutors svg {width:120px;flex-shrink:0;}.tutors h3 {font-size:25px;margin:0;}.tutors p {margin-top:10px;font-size:16px;}.term-section {background:#e2dbcb;}.terms {padding:80px 8% 85px;}.term-options {display:flex;flex-direction:column;align-items:start;gap:15px;margin-top:35px;}.term-options button {border:0;padding:0;font:14px/1.6 Consolas,monospace;text-align:left;}.term-options [aria-pressed=true]::before {content:"■ ";color:var(--accent);}#term-info {font-size:14px;color:var(--accent);min-height:45px;margin-top:25px;}.terms details {margin-top:25px;}.terms summary {font-weight:400;}.terms details p {color:var(--muted);}footer {border:0;font-size:14px;padding:45px 0;}footer p {margin:7px 0;}@media(max-width:760px) {.wrap {width:calc(100% - 48px);}.nav {min-height:95px;}.logo {font-size:17px;}.logo small {font-size:14px;max-width:220px;}.nav nav {top:95px;}.hero {height:530px;}.hero-copy {left:24px;bottom:40px;}.hero h1 {font-size:54px;letter-spacing:-1.5px;}.hero-copy p {max-width:290px;font-size:14px;}.image-note {top:10px;right:15px;font-size:14px;}.statement {padding:65px 0;}.statement-copy {font-size:29px;}.classes {padding:20px 0 65px;}.classes>h2,.section-label,.class-filter,.class-block,#class-count,.budget {margin-left:0;}.class-filter {width:100%;}.class-block h3 {font-size:33px;}.budget {padding:23px;}.budget-fields {grid-template-columns:1fr;gap:0;}.provided-inner {padding:55px 0;}.provided-columns {grid-template-columns:1fr;gap:25px;}.wall-inner {padding:65px 0;}.wall h2,.wall .meta,.wall-caption,.wall .note {margin-left:0;}.wall h2 {font-size:38px;}.paintings {display:block;margin:45px 0;}.painting {width:85%;margin:55px 0;}.painting-1,.painting-4 {margin-left:12%;padding-top:20px;width:78%;}.painting-2 {width:75%;}.painting-3 {width:94%;}.painting-5 {width:83%;margin-left:9%;}.tutors {padding:25px 0 65px;}.tutors article {display:block;}.tutors svg {margin-bottom:20px;}.tutors h2 {font-size:37px;}.terms {padding:60px 0;}h2 {font-size:37px;}}`;
const js = `
const $ = (s) => document.querySelector(s);
const classes = ${JSON.stringify(classes)};
let selected = 0;
let term = "autumn";
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
function update()
{
    const sessions = Number($("#sessions").value);
    const hire = Number($("#hire").value);
    $("#budget-title").textContent = classes[selected][0];
    if (!Number.isInteger(sessions) || sessions < 1 || sessions > 12)
    {
        $("#budget-result").textContent = "Choose a whole number of sessions from 1 to 12.";
        $("#email-enquiry").removeAttribute("href");
        return;
    }
    const rate = classes[selected][3];
    $("#budget-result").textContent = sessions + " session" + (sessions === 1 ? "" : "s") + " × £" + rate + (hire ? " + £45 term hire" : "") + " = £" + (sessions * rate + hire);
    $("#email-enquiry").href = "mailto:hello@ninthstreet.studio?subject=" + encodeURIComponent("Class enquiry: " + classes[selected][0]) + "&body=" + encodeURIComponent("I am interested in " + sessions + " session(s), " + term + " term. Illustrative budget £" + (sessions * rate + hire) + ". Please confirm dates, availability and any easel hire.");
}
document.querySelectorAll("[data-class]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.class);
    document.querySelectorAll("[data-class]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    update();
    $("#budget").scrollIntoView({ block: "center" });
});
$("#sessions").oninput = update;
$("#hire").onchange = update;
$("#class-filter").onchange = () =>
{
    let count = 0;
    document.querySelectorAll(".class-block").forEach((c) =>
    {
        c.hidden = Boolean($("#class-filter").value) && c.dataset.type !== $("#class-filter").value;
        if (!c.hidden) count++;
    });
    $("#class-count").textContent = count + " sessions shown";
};
document.querySelectorAll("[data-term]").forEach((b) => b.onclick = () =>
{
    term = b.dataset.term;
    document.querySelectorAll("[data-term]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#term-info").textContent = term === "autumn" ? "Brief lists two autumn places. This is sample information, not a live availability claim. Nothing is held here." : "Brief lists this term as open. Confirm the next dates and available places by email. Nothing is held here.";
    update();
});
document.querySelector("[data-term]").click();
update();
`;
const tests = `
export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;
    assert(await page.locator(".class-block:visible").count() === 4, "Four distinct sessions");
    await page.locator("#class-filter").selectOption("weekend");
    assert(await page.locator(".class-block:visible").count() === 1, "Weekend filter");
    await page.locator('[data-class="3"]').click();
    await page.locator("#sessions").fill("3");
    assert((await page.locator("#budget-result").textContent()).includes("£27"), "Saturday session calculation");
    await page.locator("#hire").selectOption("45");
    assert((await page.locator("#budget-result").textContent()).includes("£72"), "Term hire added once");
    await page.locator("#sessions").fill("0");
    assert((await page.locator("#budget-result").textContent()).includes("1 to 12"), "Zero session rejected");
    assert(await page.locator("#email-enquiry").getAttribute("href") === null, "Invalid budget disables email draft");
    await page.locator("#sessions").fill("2.5");
    assert((await page.locator("#budget-result").textContent()).includes("whole number"), "Fraction rejected");
    await page.locator("#sessions").fill("13");
    assert((await page.locator("#budget-result").textContent()).includes("1 to 12"), "Session upper bound");
    await page.locator("#sessions").fill("2");
    await page.locator("#hire").selectOption("0");
    await page.locator("#class-filter").selectOption("evening");
    assert(await page.locator(".class-block:visible").count() === 3, "Evening filter");
    await page.locator('[data-class="1"]').click();
    assert((await page.locator("#budget-result").textContent()).includes("£32"), "Life drawing rate");
    await page.locator('[data-term="winter"]').click();
    assert((await page.locator("#term-info").textContent()).includes("Nothing is held"), "No false place reservation");
    assert(decodeURIComponent(await page.locator("#email-enquiry").getAttribute("href")).includes("winter"), "Term in email draft");
    assert(decodeURIComponent(await page.locator("#email-enquiry").getAttribute("href")).includes("Wednesday"), "Class in email draft");
    await page.locator("#class-filter").selectOption("");
    assert(await page.locator(".class-block:visible").count() === 4, "Restore all classes");
    assert(await page.locator(".painting").count() === 6, "Six original student-work studies");
    await page.locator("summary").click();
    assert(await page.locator("details").getAttribute("open") !== null, "Easel hire details");
    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu expands");
        await page.locator('#navigation a[href="#room"]').click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes after anchor");
    }
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
`;
await fs.writeFile(path.join(folder, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ninth Street: A room with good company</title><link rel="stylesheet" href="style.css"><script defer src="app.js"></script></head><body id="home">${body}</body></html>`);
await fs.writeFile(path.join(folder, "style.css"), base + (css + "header {position:relative;}").replace(/\s*\{\s*/g, "\n{\n    ").replace(/;\s*/g, ";\n    ").replace(/\s*\}\s*/g, "\n}\n"));
await fs.writeFile(path.join(folder, "app.js"), js);
await fs.writeFile(path.join(folder, "verify.mjs"), tests);
await fs.writeFile(path.join(folder, ".checks", "spec.json"), JSON.stringify({ title: "Ninth Street Painting Studio", tags: ["Painting Classes", "Studio Wall", "Raw Canvas"], features: "Intentionally offset studio-wall layout, original room/six artwork/tutor illustrations, evening/weekend class filter, bounded whole-session cost calculator, term-hire addition, term selection and class-specific email draft.", limits: "Fictional studio, tutors, student captions and availability from the brief. Illustrations are labeled, not actual student work or photographs. No reservation, payment, actual class availability or booking engine. Email opens the user's client only. Static system-font adaptation." }, null, 4));
await fs.writeFile(path.join(folder, ".checks", "source.ready"), "");
