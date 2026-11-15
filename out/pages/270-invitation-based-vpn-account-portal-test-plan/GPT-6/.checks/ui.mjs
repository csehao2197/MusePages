import fs from "node:fs/promises";
import path from "node:path";
export const base = `
*
{
    box-sizing: border-box;
}
html
{
    scroll-behavior: smooth;
    scroll-padding-top: 85px;
}
body
{
    margin: 0;
    color: var(--ink);
    background: var(--paper);
    font: 15px/1.65 "Segoe UI", Arial, sans-serif;
}
button, input, select, textarea
{
    font: inherit;
}
a
{
    color: inherit;
    text-decoration: none;
}
button, .button
{
    display: inline-block;
    border: 1px solid var(--ink);
    background: transparent;
    color: inherit;
    padding: 12px 22px;
    cursor: pointer;
    text-align: center;
}
button:hover, .button:hover
{
    filter: brightness(.9);
}
.primary
{
    background: var(--ink);
    color: var(--paper);
}
:focus-visible
{
    outline: 3px solid var(--accent);
    outline-offset: 4px;
}
.wrap
{
    width: min(1120px, calc(100% - 64px));
    margin: auto;
}
header
{
    position: sticky;
    top: 0;
    z-index: 4;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
}
.nav
{
    min-height: 85px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}
.logo
{
    font-size: 24px;
    font-weight: 650;
    letter-spacing: -1px;
}
.logo small
{
    display: block;
    font-size: 9px;
    letter-spacing: 1.6px;
    font-weight: 400;
}
nav
{
    display: flex;
    align-items: center;
    gap: 25px;
    font-size: 12px;
}
#menu
{
    display: none;
}
.eyebrow
{
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    font-weight: 650;
    color: var(--accent);
}
h1
{
    font-size: clamp(42px, 5.2vw, 72px);
    line-height: 1.04;
    letter-spacing: -2.7px;
    margin: 20px 0;
}
h2
{
    font-size: clamp(28px, 3.2vw, 43px);
    line-height: 1.15;
    letter-spacing: -1.2px;
}
h3
{
    line-height: 1.3;
}
.lead
{
    font-size: 17px;
    color: var(--muted);
    max-width: 470px;
}
.muted
{
    color: var(--muted);
}
.split
{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}
.section
{
    padding-top: 80px;
    padding-bottom: 80px;
}
.grid
{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}
.actions
{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 28px 0;
}
.rule
{
    height: 3px;
    width: 45px;
    background: var(--accent);
}
.card
{
    padding: 28px;
    border: 1px solid var(--line);
}
.card p
{
    color: var(--muted);
    font-size: 13px;
}
.card button
{
    padding: 0;
    border: 0;
    color: var(--accent);
}
.banner
{
    background: var(--ink);
    color: var(--paper);
    padding: 55px 0;
}
.banner .primary
{
    background: var(--accent);
    color: var(--ink);
    border-color: var(--accent);
}
details
{
    border-bottom: 1px solid var(--line);
    padding: 20px 0;
}
summary
{
    cursor: pointer;
    font-weight: 600;
}
details p
{
    max-width: 760px;
    color: var(--muted);
}
footer
{
    padding: 40px 0;
    border-top: 1px solid var(--line);
    font-size: 11px;
    color: var(--muted);
}
dialog
{
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--line);
    width: min(510px, calc(100% - 32px));
    max-height: 90vh;
    overflow: auto;
    padding: 32px;
}
dialog::backdrop
{
    background: #10191dbb;
}
.close
{
    float: right;
    padding: 2px 10px;
}
label
{
    display: block;
    font-size: 12px;
    margin: 15px 0;
}
input, select, textarea
{
    display: block;
    width: 100%;
    min-width: 0;
    border: 1px solid var(--line);
    background: var(--paper);
    color: var(--ink);
    padding: 12px;
    margin-top: 5px;
}
svg
{
    display: block;
    width: 100%;
    height: auto;
}
[hidden]
{
    display: none !important;
}
@media (prefers-reduced-motion: reduce)
{
    html
    {
        scroll-behavior: auto;
    }
}
@media (max-width: 760px)
{
    .wrap
    {
        width: calc(100% - 40px);
    }
    .split, .grid
    {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    .section
    {
        padding-top: 45px;
        padding-bottom: 45px;
    }
    .nav
    {
        min-height: 75px;
    }
    #menu
    {
        display: block;
        padding: 6px 12px;
    }
    nav
    {
        display: none;
        position: absolute;
        top: 75px;
        left: 0;
        right: 0;
        padding: 22px;
        background: var(--paper);
        border-bottom: 1px solid var(--line);
        flex-direction: column;
        align-items: stretch;
    }
    nav.open
    {
        display: flex;
    }
    h1
    {
        letter-spacing: -1.7px;
    }
}
`;
export function nav(brand, sub, links, cta)
{
    return `<header><div class="wrap nav"><a class="logo" href="#home">${brand}<small>${sub}</small></a><button id="menu" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation">${links.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("")}<button class="primary" data-book>${cta}</button></nav></div></header>`;
}
export function dialog(title, serviceLabel = "What can we help with?", options = ["General enquiry"])
{
    return `<dialog id="booking"><button class="close" aria-label="Close dialog">×</button><p class="eyebrow">LET'S MAKE A PLAN</p><h2>${title}</h2><p class="muted">Preview only. This form stays in your browser and sends nothing.</p><form id="booking-form"><label>Your name<input name="name" required maxlength="80" autocomplete="name"></label><label>Email address<input name="email" type="email" required autocomplete="email"></label><label>${serviceLabel}<select name="service">${options.map((o) => `<option>${o}</option>`).join("")}</select></label><button class="primary">Preview request →</button><p id="booking-result" role="status"></p></form></dialog>`;
}
export const commonJS = `
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
document.querySelectorAll("[data-book]").forEach((b) => b.onclick = () =>
{
    $("#booking-result").textContent = "";
    $("#booking").showModal();
});
$(".close").onclick = () => $("#booking").close();
$("#booking-form").onsubmit = (e) =>
{
    e.preventDefault();
    const form = new FormData(e.target);
    $("#booking-result").textContent = "Preview ready for " + form.get("name") + ": " + form.get("service") + ". Nothing has been sent or booked.";
};
`;
export const commonTests = `
    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu expands");
        await page.locator("#navigation a").first().click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes on navigation");
    }
    if (!await page.locator("[data-book]").last().isVisible()) await page.locator("#menu").click();
    await page.locator("[data-book]").last().click();
    assert(await page.locator("#booking").isVisible(), "Request dialog opens");
    await page.locator("#booking-form button").click();
    assert(await page.locator("#booking-result").textContent() === "", "Required fields prevent empty request");
    await page.locator('[name="name"]').fill("Alex Sample");
    await page.locator('[name="email"]').fill("invalid");
    await page.locator("#booking-form button").click();
    assert(await page.locator("#booking-result").textContent() === "", "Invalid email rejected");
    await page.locator('[name="email"]').fill("alex@example.com");
    await page.locator("#booking-form button").click();
    assert((await page.locator("#booking-result").textContent()).includes("Nothing has been sent"), "Honest local form result");
    await page.keyboard.press("Escape");
    assert(!await page.locator("#booking").isVisible(), "Escape dismisses dialog");
`;
export async function writePage(prompt, title, body, css, js, tests, spec)
{
    const folder = path.join(process.cwd(), "out", "pages", prompt, "GPT-6");
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    await fs.writeFile(path.join(folder, "index.html"), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${title} — interactive concept homepage"><title>${title}</title><link rel="stylesheet" href="style.css"><script defer src="app.js"></script></head><body id="home">${body}</body></html>`);
    await fs.writeFile(path.join(folder, "style.css"), base + css.replace(/\s*\{\s*/g, "\n{\n    ").replace(/;\s*/g, ";\n    ").replace(/\s*\}\s*/g, "\n}\n"));
    await fs.writeFile(path.join(folder, "app.js"), commonJS + js);
    await fs.writeFile(path.join(folder, "verify.mjs"), `export async function run(page, assert, width)\n{\n    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;\n${tests}\n${commonTests}\n}\nif (process.argv[1]?.endsWith("verify.mjs"))\n{\n    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");\n    await verifyStandalone(import.meta.url, run);\n}\n`);
    await fs.writeFile(path.join(folder, ".checks", "spec.json"), JSON.stringify({ title, ...spec }, null, 4));
    await fs.writeFile(path.join(folder, ".checks", "source.ready"), "");
}
