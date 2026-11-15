const services =
[
    {
        key:"wardrobe", name:"Wardrobe Edit", price:"£250", duration:"3 hours · in your home",
        description:"The most transformative place to start. We go through everything you own — pulling out what works, identifying gaps, and letting go of what no longer serves you. You leave with a clear, functional wardrobe and a targeted shopping list. Most clients are amazed by what they already have.",
        includes:["Comprehensive closet audit","Colour analysis and seasonal palette","Occasion mapping (work, social, travel)","Shopping list PDF — gaps identified, budget-matched"],
        note:"London only. Zone 1–3 included. Zone 4–6: £20 supplement."
    },
    {
        key:"capsule", name:"Capsule Build", price:"£450", duration:"Full-day personal shopping",
        description:"A full-day personal shopping experience in London. We visit the stores that are actually right for you — not just the obvious high-street names. Budget-agnostic: I work to your numbers and find the best possible options within them. Everything we buy works with everything else.",
        includes:["Pre-shopping consultation call (45 min)","Personal shopping day (up to 6 hours)","Alteration and tailoring referrals","Illustrated outfit guide document post-session"],
        note:"Transport between stores not included. Minimum budget recommendation: £400."
    },
    {
        key:"executive", name:"Executive Styling", price:"£180", duration:"/ month · retainer service",
        description:"For professionals who need to look consistently excellent without spending mental energy on it. A monthly wardrobe check-in, travel packing curation, event dressing advice, and on-call styling support via WhatsApp. This is what makes the difference when your role demands it.",
        includes:["Monthly 2-hour in-home session","Event and occasion dressing advice","WhatsApp on-call styling support","Seasonal shopping shortlists"],
        note:"3-month minimum. 4–6 week current wait time for new Executive clients."
    },
    {
        key:"online", name:"Online Styling", price:"£95", duration:"90-minute video consultation",
        description:"If you're not in London. Send photos of your current wardrobe, complete a detailed style questionnaire, and we'll spend 90 minutes on Zoom building your direction, identifying the gaps, and creating a clear action plan with specific shopping recommendations at your price point.",
        includes:["Detailed style questionnaire sent in advance","90-minute Zoom session","Post-session written summary with recommendations","Shopping list with links at your budget"],
        note:"Available worldwide. Sessions recorded with consent for future reference."
    }
];
const grid = document.querySelector("#service-grid");
services.forEach((service) =>
{
    const article = document.createElement("article");
    article.innerHTML = `<div class="service-title"><h3>${service.name}</h3><b>${service.price}</b></div><p class="duration">${service.duration}</p><p>${service.description}</p><ul>${service.includes.map((item) => `<li>${item}</li>`).join("")}</ul><small>${service.note}</small><button data-service="${service.key}">Discuss ${service.name} ↗</button>`;
    grid.append(article);
});
const prices =
[
    ["Wardrobe Edit","3 hours · in your home (London, Zone 1–3)","£250"],
    ["Capsule Build","Personal shopping day · London stores (transport not included)","£450"],
    ["Executive Styling","Monthly retainer · 3-month minimum commitment","£180 / month"],
    ["Online Styling","90-minute Zoom consultation","£95"],
    ["Gift Vouchers","Any value from £50, redeemable against any service","From £50"]
];
document.querySelector("#price-list").innerHTML = prices.map(([name,detail,price]) => `<div class="price-row"><div><h3>${name}</h3><p>${detail}</p></div><b>${price}</b></div>`).join("");
const faqs =
[
    ["I'm not interested in trends — will that be a problem?","Not at all — in fact, that's usually where we start. My approach is explicitly anti-trend: we build a wardrobe based on who you actually are, what occasions you need to dress for, and what flatters your specific colouring and shape. Trends are discussed only when they happen to be relevant to your goals. Otherwise, we ignore them entirely."],
    ["My budget is quite limited. Is it still worth it?","Yes. The first thing we do in any session is maximise what you already own — most clients discover they already have the basis of a really good wardrobe and just need help seeing it clearly. When we do shop, the recommendations I provide are always specific to your price points. I work with clients at every budget."],
    ["Do you work with men?","At the moment, my client base is primarily professional women. For male clients seeking personal styling, I'm very happy to make a referral to a colleague who specialises in menswear — just get in touch and I'll point you in the right direction."],
    ["How far in advance should I book?","For the Wardrobe Edit and Capsule Build, currently 2–3 weeks. The Executive Styling Retainer has a waiting list of 4–6 weeks for new clients. Online consultations are available within 1 week. If you need something sooner, please still get in touch — cancellations do occur. These are brief-supplied examples, not live availability."],
    ["What should I do before my wardrobe session?","Nothing! Please resist the urge to tidy up or edit anything before I arrive. The more authentic the current state of your wardrobe, the better picture I get of what's actually happening. A neatly sorted wardrobe hides the exact information I need to do my best work."]
];
document.querySelector("#faqs").innerHTML = faqs.map(([question,answer]) => `<details name="faq"><summary>${question}</summary><p>${answer}</p></details>`).join("");
const reveal = document.querySelector("#reveal");
reveal.addEventListener("input", () =>
{
    document.querySelector("#after").style.clipPath = `inset(0 ${100 - Number(reveal.value)}% 0 0)`;
    document.querySelector("#divider").style.left = `${reveal.value}%`;
    reveal.setAttribute("aria-valuetext", `${reveal.value} percent curated wardrobe`);
});
const service = document.querySelector("#service");
const locationField = document.querySelector("#location");
const voucher = document.querySelector("#voucher");
function estimate()
{
    const key = service.value;
    document.querySelector("#voucher-label").hidden = key !== "gift";
    locationField.disabled = key === "online" || key === "gift";
    let message;
    if (key === "gift") message = Number(voucher.value) >= 50 && Number.isInteger(Number(voucher.value)) ? `Illustrative voucher: £${voucher.value}. No purchase or voucher is issued.` : "Choose a whole gift value of at least £50.";
    else if (key === "online") message = "£95 · 90 minutes online, worldwide. No travel supplement.";
    else if (locationField.value === "outside") message = "Travel outside London needs an individual quote; no total is implied.";
    else
    {
        const extra = locationField.value === "outer" ? 20 : 0;
        const base = { wardrobe:250, capsule:450, executive:180 }[key];
        message = key === "executive" ? `£${base + extra}/month including ${extra ? "£20 monthly travel" : "Zone 1–3 travel"}; 3-month minimum £${3 * (base + extra)}. Illustrative 4–6 week wait.` : `Illustrative service fee £${base + extra}${extra ? " (including £20 travel)" : ""}. ${key === "capsule" ? "Clothing budget and store transport separate; £400 clothing budget recommended." : "VAT included."}`;
    }
    document.querySelector("#estimate").textContent = message;
}
[service, locationField, voucher].forEach((field) => field.addEventListener("input", estimate));
estimate();
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    service.value = button.dataset.service;
    estimate();
    window.location.hash = "book";
}));
const form = document.querySelector("#request");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    if (service.value === "gift" && (!Number.isInteger(Number(voucher.value)) || Number(voucher.value) < 50))
    {
        result.textContent = "Choose a whole gift value of at least £50.";
        return;
    }
    if (!name || !email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter your name and a valid example email.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Acknowledge this local request preview.";
        return;
    }
    result.textContent = `Local request prepared for ${name}.\n${service.selectedOptions[0].textContent} · Free 20-minute discovery conversation requested.\nNothing sent, scheduled, charged or saved. The service estimate above is illustrative.`;
});
form.addEventListener("reset", () =>
{
    result.textContent = "";
    setTimeout(estimate, 0);
});
const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () => document.querySelector("#social-note").textContent = `${button.dataset.social}: a verified profile was not supplied for this fictional studio.`));
