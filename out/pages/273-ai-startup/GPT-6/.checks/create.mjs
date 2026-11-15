import { writePage, nav, dialog } from "../../../270-invitation-based-vpn-account-portal-test-plan/GPT-6/.checks/ui.mjs";
const tickets = [["Priya Shah", "Refund for a double charge", "09:42", "Could you check whether I was charged twice?", "Thanks Priya. An agent needs to check your payment record before confirming a refund. This question needs human review."], ["Tom Okafor", "Can I change my delivery day?", "09:38", "Hi, I am away next Thursday. Can I move my box to Saturday instead?", "Hi Tom, yes. You can move this week's delivery to Saturday from Account, then Deliveries, up to 23:59 on Tuesday [1]. Saturday slots are 08:00 to 13:00 in your area [2]. Want me to move it for you now?"], ["Lena Hart", "Export to CSV missing", "09:31", "Where can I export our records?", "Hi Lena. Open Reports, choose the date range, then select Export CSV. An agent should confirm your permissions before sending."], ["Marcus Bell", "Invoice address wrong", "09:20", "Can you update the address on my invoice?", "Hi Marcus. Please confirm the billing address through your account settings. An agent will check whether an invoice can be reissued."], ["Aiko Mori", "Team seats", "09:02", "Can we add another person?", "Hi Aiko. Team includes up to 10 agent seats. An agent can help review your current plan before making changes."]];
await writePage("273-ai-startup", "Kestrel: Answers with their sources",
nav("▪ kestrel", "SUPPORT INTELLIGENCE", [["Product", "product"], ["How it works", "how"], ["Security", "security"], ["Pricing", "pricing"]], "Book a demo") +
`<main><section class="wrap hero"><p class="eyebrow">AI DRAFTS FOR SUPPORT TEAMS</p><h1>Every ticket answered from<br>what your team <em>already</em> knows.</h1><p class="lead">Kestrel reads your help centre, macros and past replies, then drafts answers with their sources attached. Your agents approve, edit or bin it.</p><div class="actions"><button class="primary" data-book>Book a demo</button><a class="button secondary" href="#product">See a live inbox →</a></div></section>
<section class="wrap product" id="product"><div class="product-bar">INBOX · <span id="open-count">14</span> OPEN <span>LOCAL PRODUCT DEMO</span></div><div class="inbox"><div class="tickets">${tickets.map(([n, s, t], i) => `<button data-ticket="${i}" aria-pressed="${i === 1}"><b>${n}</b><time>${t}</time><span>${s}</span></button>`).join("")}</div><div class="ticket"><button id="back" class="secondary">← Inbox</button><p class="meta" id="sender"></p><h3 id="subject"></h3><p id="question"></p><div class="draft"><p class="eyebrow">KESTREL DRAFT</p><p id="reply"></p><label id="editor-label" hidden>Edit draft<textarea id="editor" rows="5"></textarea></label><div class="sources"><button data-source="0">[1] Changing your delivery day</button><button data-source="1">[2] Weekend delivery areas</button></div><p id="source" role="status" hidden></p></div><div class="draft-footer"><span id="confidence">CONFIDENCE: HIGH · SAMPLE</span><button id="edit">Edit</button><button id="send">Approve and send</button></div><p id="send-result" role="status"></p></div></div></section>
<section class="wrap section split answer"><div><p class="eyebrow">AN ILLUSTRATIVE ANSWER</p><h2>It says where it<br>got the answer.</h2></div><div><h3>Does the annual plan include the API, or is that extra?</h3><p>The API is included on the annual Business plan with 50,000 calls a month. On the monthly plan it is an add on at £20 a month.</p><p class="meta">Pricing page, section 3<br>Macro: API on annual plans<br>Reply by Hannah, 4 March · fictional sample</p></div></section>
<section class="wrap section" id="how"><p class="eyebrow">HOW IT WORKS</p>${[["Connect your help desk", "Read only access to tickets, macros and your help centre."], ["Kestrel learns your voice", "It studies how your best agents write, so drafts sound like you."], ["Agents stay in charge", "Your team reviews each draft. In this demo, nothing is sent."]].map(([n, d], i) => `<div class="step"><span>0${i + 1}</span><h2>${n}</h2><p>${d}</p></div>`).join("")}</section>
<section class="wrap guard" id="security"><h2>Human judgement.<br>Built into the loop.</h2><ul><li>Review sources before approving a draft.</li><li>Hand over when the documents do not cover the question.</li><li>Keep edits and final decisions with your team.</li><li>Discuss production data handling before connecting a help desk.</li></ul></section>
<section class="wrap section" id="pricing"><p class="eyebrow">PRICING</p><h2>Room for your team.</h2><div class="plans">${[["Team", "290", ["Up to 10 agents", "3,000 drafts a month", "1 help desk connection", "Manual approval", "Email support"]], ["Scale", "990", ["Up to 50 agents", "15,000 drafts a month", "Unlimited connections", "SSO and audit log", "Named engineer"]]].map(([n, p, f]) => `<article><h3>${n}</h3><p class="price">£${p}<small> a month</small></p>${f.map((s) => `<p class="feature">${s}</p>`).join("")}<button class="primary" data-book>${n === "Team" ? "Start a trial" : "Book a demo"}</button></article>`).join("")}</div><p class="meta">Fourteen day trial on Team. Illustrative prices exclude VAT. No trial account is created here.</p></section>
<section class="letter wrap section"><p class="eyebrow">A NOTE FROM THE FOUNDERS</p><h2>The answer was usually<br>already written down.</h2><p>We spent six years answering support tickets before we wrote a line of Kestrel. The answers were almost always already written down somewhere, in a doc, a macro or a reply from last spring. Kestrel finds them, shows its working and lets your team decide.</p><p>We would rather it said nothing than said something wrong.</p><p class="meta">Ruth Adeyemi, CEO · Jonas Kraft, CTO<br>Fictional founders' note from the concept brief</p></section></main><footer><div class="wrap">kestrel · © 2026 Kestrel Labs Ltd, London · Product concept. All tickets, sources and replies are local samples.</div></footer>` + dialog("See Kestrel in your workflow.", "Team size", ["Up to 10 agents", "11 to 50 agents", "More than 50 agents"]),
`:root {--paper:#0a0b0d;--ink:#ededea;--accent:#d4ff3a;--muted:#a3a5ab;--line:#303238;} body {font-size:18px;} .logo small {display:none;} .logo {font-size:27px;} .primary {background:transparent;color:var(--accent);border-color:var(--accent);border-radius:6px;}.primary:hover {background:var(--accent);color:var(--paper);} nav, .eyebrow, small, .meta, .card p, label {font-size:14px;} .eyebrow,.meta {font-family:Consolas,monospace;font-weight:400;} .hero {padding:100px 0 70px;text-align:center;} h1 {font-weight:500;font-size:clamp(44px,5.5vw,76px);letter-spacing:-3px;} h1 em {color:var(--accent);font-style:normal;} .hero .lead {max-width:740px;margin:30px auto;} .hero .actions {justify-content:center;} .secondary {border:0;} .product {background:#141519;border:1px solid var(--line);border-radius:10px;overflow:hidden;} .product-bar {display:flex;gap:8px;align-items:center;padding:17px 23px;font:14px Consolas,monospace;border-bottom:1px solid var(--line);}.product-bar span:last-child {margin-left:auto;color:var(--muted);} .inbox {display:grid;grid-template-columns:300px 1fr;} .tickets {border-right:1px solid var(--line);background:#1c1e23;}.tickets button {display:block;text-align:left;width:100%;border:0;border-bottom:1px solid var(--line);border-left:2px solid transparent;padding:22px 18px;font-size:14px;}.tickets button[aria-pressed=true] {border-left-color:var(--accent);background:#141519;}.tickets time {float:right;color:var(--muted);font:14px Consolas,monospace;}.tickets span {display:block;margin-top:8px;color:var(--muted);}.ticket {padding:25px 28px;font-size:16px;}.ticket h3 {font-size:22px;font-weight:500;}.meta {color:var(--muted);}.draft {border-top:1px solid var(--line);margin-top:25px;padding-top:15px;} #reply {min-height:120px;} .sources {display:flex;flex-direction:column;align-items:flex-start;gap:5px;} .sources button {font:14px Consolas,monospace;color:var(--accent);border:0;padding:5px 0;text-align:left;} .draft-footer {border-top:1px solid var(--line);padding-top:20px;margin-top:20px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;} .draft-footer span {font:14px Consolas,monospace;color:var(--muted);margin-right:auto;}.draft-footer button {font-size:14px;padding:8px 13px;} #send {border-color:var(--accent);color:var(--accent);} #back {display:none;} .answer h3 {font-weight:400;font-size:28px;}.step {display:grid;grid-template-columns:50px 1fr 1fr;gap:30px;border-top:1px solid var(--line);padding:30px 0;align-items:start;}.step h2 {font-size:30px;margin:0;}.step span {font:14px Consolas,monospace;color:var(--muted);} .step p {margin:0;color:var(--muted);} .guard {background:#141519;padding:45px;display:grid;grid-template-columns:1fr 1fr;gap:40px;border-radius:10px;}.guard ul {list-style-type:square;}.guard li {padding:12px 0;color:var(--ink);}.guard li::marker {color:var(--accent);} .plans {display:grid;grid-template-columns:1fr 1fr;gap:40px;}.plans article {padding:25px 0;border-top:1px solid var(--line);}.price {font:40px Consolas,monospace;}.feature {border-top:1px solid var(--line);padding-top:18px;}.letter {max-width:680px;}.letter p:not(.eyebrow):not(.meta) {font-size:20px;} footer {font-size:14px;} @media(max-width:760px) {.hero {padding-top:65px;} h1 {font-size:44px;letter-spacing:-1.6px;} .inbox {display:block;}.tickets {display:none;}.tickets.show {display:block;}.ticket {padding:20px;} #back {display:block;font:14px Consolas,monospace;padding-left:0;} .product-bar span:last-child {display:none;} .plans,.guard,.step {grid-template-columns:1fr;gap:20px;}.guard {padding:25px;}.guard ul {padding-left:20px;}.hero .actions>* {width:100%;}.product {width:calc(100% - 24px);} .sources button {font-size:14px;} }`,
`
const tickets = ${JSON.stringify(tickets)};
let selected = 1;
const sent = new Set();
function show()
{
    const t = tickets[selected];
    $("#sender").textContent = t[0] + " · " + t[2];
    $("#subject").textContent = t[1];
    $("#question").textContent = t[3];
    $("#reply").textContent = t[4];
    $("#editor").value = t[4];
    $("#editor-label").hidden = true;
    $("#reply").hidden = false;
    $("#edit").textContent = "Edit";
    $("#source").hidden = true;
    $(".sources").hidden = selected !== 1;
    $("#confidence").textContent = selected === 1 ? "CONFIDENCE: HIGH · SAMPLE" : "HUMAN REVIEW REQUIRED";
    $("#send").disabled = sent.has(selected);
    $("#send-result").textContent = sent.has(selected) ? "Marked approved locally. Nothing was sent." : "";
    document.querySelectorAll("[data-ticket]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.ticket) === selected)));
}
document.querySelectorAll("[data-ticket]").forEach((b) => b.onclick = () =>
{
    selected = Number(b.dataset.ticket);
    $(".tickets").classList.remove("show");
    show();
});
$("#back").onclick = () => $(".tickets").classList.toggle("show");
$("#edit").onclick = () =>
{
    if ($("#editor-label").hidden)
    {
        $("#editor-label").hidden = false;
        $("#reply").hidden = true;
        $("#edit").textContent = "Save edit";
        $("#editor").focus();
    }
    else if ($("#editor").value.trim())
    {
        tickets[selected][4] = $("#editor").value.trim();
        show();
    }
};
$("#send").onclick = () =>
{
    if (!$("#editor-label").hidden)
    {
        $("#send-result").textContent = "Save your edit before approving.";
        return;
    }
    sent.add(selected);
    $("#open-count").textContent = 14 - sent.size;
    show();
};
document.querySelectorAll("[data-source]").forEach((b) => b.onclick = () =>
{
    $("#source").hidden = false;
    $("#source").textContent = Number(b.dataset.source) === 0 ? "Sample source: Delivery changes close at 23:59 on Tuesday in Account > Deliveries." : "Sample source: Saturday delivery slots run from 08:00 to 13:00 in the sample area.";
});
show();
`,
`
    assert((await page.locator("#subject").textContent()).includes("delivery"), "Default delivery ticket");
    await page.locator('[data-source="0"]').click();
    assert((await page.locator("#source").textContent()).includes("Tuesday"), "Source disclosure");
    await page.locator("#edit").click();
    await page.locator("#editor").fill("A reviewed reply.");
    await page.locator("#send").click();
    assert((await page.locator("#send-result").textContent()).includes("Save"), "Unsaved edit blocks approval");
    await page.locator("#edit").click();
    assert(await page.locator("#reply").textContent() === "A reviewed reply.", "Edit retained");
    await page.locator("#send").click();
    assert(await page.locator("#open-count").textContent() === "13", "Approval decrements local count");
    assert(await page.locator("#send").isDisabled(), "Duplicate send blocked");
    if (width < 760) await page.locator("#back").click();
    await page.locator('[data-ticket="0"]').click();
    assert((await page.locator("#question").textContent()).includes("charged"), "Ticket selection");
    assert((await page.locator("#confidence").textContent()).includes("HUMAN"), "Unknown answer requires review");
`, { tags: ["AI Support", "Interactive Inbox", "Dark Precision"], features: "Five-ticket product inbox, editable replies, approval gate, idempotent local approval count, source disclosures, responsive inbox navigation and demo enquiry.", limits: "No AI inference, help desk integration, authentication, actual sending or trial signup. All source documents, pricing and founder statements are illustrative. No live-customer permission or production data guarantees asserted. Static system-font adaptation." });
