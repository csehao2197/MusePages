import { writePage, nav, dialog } from "../../../270-invitation-based-vpn-account-portal-test-plan/GPT-6/.checks/ui.mjs";
const services = ["Accounts & Bookkeeping", "Tax Returns", "VAT Returns", "Payroll", "Business Start-Up", "Financial Planning"];
const descriptions = ["A reliable picture of where your business stands.", "Personal and business returns, carefully prepared.", "Clear records and support with your VAT obligations.", "Keep your people paid and your records in order.", "Get the structure and systems right from day one.", "Make room for what comes next with a practical plan."];
await writePage("271-accountant", "Harlow & Co — Clear numbers, smart decisions",
nav("Harlow & Co", "CHARTERED ACCOUNTANTS · CONCEPT", [["Services", "services"], ["About", "about"], ["Resources", "resources"], ["Contact", "contact"]], "Free consultation →") +
`<main><section class="wrap hero split"><div><p class="eyebrow">ACCOUNTING WITH A HUMAN SIDE</p><h1>Clear Numbers.<br>Smart Decisions.<br><em>Peace of Mind.</em></h1><p class="lead">Accounting, tax, and financial advice for UK small businesses and individuals — straightforward, jargon-free.</p><div class="actions"><button class="primary" data-book>Book a free consultation →</button><a class="button" href="#services">See our services</a></div><p class="trust">PERSONAL SERVICE <span>FIXED MONTHLY FEES</span></p></div><div class="desk"><div class="window"></div><div class="plant"></div><div class="report"><small>THE BIG PICTURE</small><h3>Your next chapter.<br>In clear focus.</h3><div class="chart"><i></i><i></i><i></i><i></i><i></i></div><span>ILLUSTRATIVE FINANCIAL SNAPSHOT</span></div><div class="note">Less paperwork.<br><b>More possibility.</b></div></div></section>
<div class="strip"><div class="wrap"><span>01 <b>A dedicated person</b></span><span>02 <b>Clear, fixed fees</b></span><span>03 <b>Proactive planning</b></span><span>04 <b>Plain-English advice</b></span></div></div>
<section class="wrap section" id="services"><p class="eyebrow">WHAT WE DO</p><h2>Expertise for every<br>stage of your business.</h2><div class="grid">${services.map((s, i) => `<article class="card"><span class="service-number">0${i + 1} /</span><h3>${s}</h3><p>${descriptions[i]}</p><button data-service="${i}">Explore service →</button></article>`).join("")}</div><div id="service-detail" hidden role="status"></div></section>
<section class="about" id="about"><div class="wrap split section"><div><p class="eyebrow">A PARTNER, NOT JUST AN ACCOUNTANT</p><h2>Straightforward accounting.<br>Absolutely no jargon.</h2></div><div><p class="lead">Your questions deserve a clear answer. Your business deserves an accountant who looks ahead, not just at last year's figures.</p><p>Our concept service pairs a dedicated account manager with fixed monthly fees, proactive tax planning and a target response within one working day.</p><small>Fictional practice demonstration. Memberships, reviews and response guarantees are not independently verified.</small></div></div></section>
<section class="wrap section" id="pricing"><p class="eyebrow">FEES WITHOUT THE GUESSWORK</p><h2>Simple, fixed pricing.</h2><div class="grid">${[["Sole Trader", 89, "Accounts & self-assessment"], ["Limited Company", 149, "Accounts, corporation tax & payroll"], ["Growing Business", 249, "Management reports & planning"]].map(([n, p, f], i) => `<article class="price ${i === 1 ? "featured" : ""}"><small>${i === 1 ? "MOST POPULAR" : "MONTHLY SUPPORT"}</small><h3>${n}</h3><p>from <b>£${p}</b>/mo</p><p>${f}<br>Dedicated account manager<br>Clear monthly reporting</p><button data-book>Discuss this plan →</button></article>`).join("")}</div><p class="muted">Illustrative starting fees. Scope and VAT would be confirmed before engagement.</p></section>
<section class="wrap process"><h2>Getting started is easy.</h2>${["Free consultation", "Onboarding call", "We handle the details", "Monthly reports"].map((s, i) => `<div><b>0${i + 1}</b><h3>${s}</h3></div>`).join("")}</section>
<section class="wrap section" id="resources"><p class="eyebrow">COMMON QUESTIONS</p><h2>A little clarity, right here.</h2>${[["Do I need an accountant if I use accounting software?", "Software records transactions; an accountant helps interpret them, review compliance and plan ahead."], ["What is the difference between bookkeeping and accounting?", "Bookkeeping records daily transactions. Accounting uses those records to prepare accounts and understand performance."], ["When do I need to register for VAT?", "Registration depends on taxable turnover and current HMRC rules. Check official guidance or request advice for your circumstances."], ["How quickly can you take over?", "Timing depends on records and your current accountant. An introductory call helps define a sensible handover."]].map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
<section class="banner" id="contact"><div class="wrap split"><div><p class="eyebrow">LET'S TALK ABOUT WHAT'S NEXT</p><h2>Your next smart decision?<br>A conversation.</h2><p>Free 30-minute consultation. No commitment — just clarity.</p></div><div><button class="primary" data-book>Book your free consultation →</button><p>Concept practice · enquiries are not sent</p></div></div></section></main>
<footer><div class="wrap">Harlow & Co Accountants · A fictional UK practice concept. All fees are illustrative; this page is not financial advice.<br>© 2026 Harlow & Co · No verified ICAEW affiliation or client endorsements claimed.</div></footer>` + dialog("Let's talk numbers.", "Service", services),
`
:root
{
    --paper: #fff;
    --ink: #122443;
    --accent: #b97622;
    --muted: #647082;
    --line: #dde2e8;
}
.hero
{
    padding: 65px 0;
    min-height: 610px;
    gap: 32px;
}
h1
{
    font-size: clamp(42px, 4.7vw, 65px);
}
h1 em
{
    font-style: normal;
    color: var(--accent);
}
.trust
{
    font-size: 9px;
    letter-spacing: 1px;
}
.trust span
{
    margin-left: 24px;
}
.desk
{
    height: 420px;
    background: #e9e9df;
    position: relative;
    overflow: hidden;
    border-radius: 120px 0 0;
    border-bottom: 42px solid #c9ab82;
}
.window
{
    position: absolute;
    width: 190px;
    height: 270px;
    right: -25px;
    top: 0;
    border: 12px solid #f7f8f4;
    background: repeating-linear-gradient(90deg, #d5e0dc 0 72px, #f8faf5 73px 82px);
    transform: skewY(-12deg);
}
.report
{
    position: absolute;
    padding: 26px;
    width: 270px;
    background: white;
    box-shadow: 0 20px 40px #30352d16;
    left: 35px;
    top: 55px;
    transform: rotate(-6deg);
}
.report small, .report span
{
    font-size: 8px;
    letter-spacing: 1.2px;
}
.report h3
{
    font: 28px/1.2 Georgia, serif;
}
.chart
{
    display: flex;
    align-items: end;
    height: 95px;
    gap: 13px;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
}
.chart i
{
    background: #122443;
    width: 28px;
    height: 35%;
}
.chart i:nth-child(2)
{
    height: 50%;
}
.chart i:nth-child(3)
{
    height: 45%;
}
.chart i:nth-child(4)
{
    height: 70%;
}
.chart i:nth-child(5)
{
    height: 93%;
    background: #c28a44;
}
.note
{
    position: absolute;
    bottom: 10px;
    right: 15px;
    background: #e5ba79;
    padding: 18px 25px;
    transform: rotate(4deg);
    font: 18px/1.4 Georgia, serif;
}
.strip
{
    background: var(--ink);
    color: #d3a366;
    padding: 25px 0;
}
.strip .wrap
{
    display: flex;
    justify-content: space-between;
    font-size: 11px;
}
.strip b
{
    color: white;
    padding-left: 12px;
    font-weight: 400;
}
.service-number
{
    color: var(--accent);
    font: 22px Georgia, serif;
}
.card
{
    transition: border-color .2s;
}
.card:hover
{
    border-color: var(--accent);
}
#service-detail
{
    border-left: 3px solid var(--accent);
    background: #f3f5f8;
    padding: 24px;
    margin-top: 20px;
}
.about
{
    background: #f3f5f7;
}
.about small
{
    font-size: 10px;
    color: var(--muted);
}
.price
{
    padding: 30px;
    background: #f6f7f9;
    border-top: 3px solid #dfe3e9;
}
.price.featured
{
    border-color: var(--accent);
    background: var(--ink);
    color: white;
}
.price small
{
    color: var(--accent);
    font-size: 9px;
    letter-spacing: 1px;
}
.price b
{
    font-size: 40px;
}
.price button
{
    border-color: currentColor;
}
.process
{
    display: flex;
    flex-wrap: wrap;
    gap: 35px;
    border-top: 1px solid var(--line);
    padding-top: 35px;
}
.process h2
{
    width: 100%;
}
.process div
{
    flex: 1;
    min-width: 170px;
}
.process b
{
    font-size: 60px;
    color: #dfc7a6;
}
.process h3
{
    font-size: 15px;
}
@media (max-width: 760px)
{
    .desk
    {
        height: 380px;
    }
    .strip .wrap
    {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
}
`,
`
const serviceCopy = ${JSON.stringify(descriptions)};
document.querySelectorAll("[data-service]").forEach((button) => button.onclick = () =>
{
    $("#service-detail").hidden = false;
    $("#service-detail").textContent = serviceCopy[Number(button.dataset.service)] + " Discuss your circumstances in a free consultation; scope is agreed before work begins.";
    $("#service-detail").scrollIntoView({ block: "nearest" });
});
`,
`
    assert(await page.locator(".card").count() === 6, "Six accounting services");
    await page.locator('[data-service="2"]').click();
    assert((await page.locator("#service-detail").textContent()).includes("VAT"), "VAT service detail");
    await page.locator('[data-service="3"]').click();
    assert((await page.locator("#service-detail").textContent()).includes("paid"), "Payroll detail changes");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") !== null, "FAQ expands");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") === null, "FAQ collapses");
    assert((await page.locator(".price.featured").textContent()).includes("£149"), "Featured plan starting fee");
`, { tags: ["Accountancy", "Financial Services", "Navy Editorial"], features: "Six service disclosures, fixed-fee pricing, process, FAQ and validated consultation preview. Original desk/report CSS illustration.", limits: "Fictional practice; sample fees and unverified credentials are labeled. No advice, real appointment, client testimonials or message transmission. Vanilla static adaptation, system fonts, reduced-motion friendly." });
