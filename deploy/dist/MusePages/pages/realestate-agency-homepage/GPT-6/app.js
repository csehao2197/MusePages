const homes =
[
    { address: "742 Coast Boulevard", city: "La Jolla", price: 4250000, type: "House", category: "Waterfront", badge: "New", beds: 4, baths: 4, area: "3,850", agent: "Olivia Bennett" },
    { address: "1820 Ocean Front", city: "Del Mar", price: 5800000, type: "House", category: "Open House", badge: "Open house", beds: 5, baths: 5, area: "4,620", agent: "James Carter" },
    { address: "910 Orange Avenue", city: "Coronado", price: 1850000, type: "Condo", category: "Price Reduced", badge: "Price reduced", beds: 2, baths: 2, area: "1,780", agent: "Sophia Reed" },
    { address: "1260 Torrey Pines", city: "La Jolla", price: 3200000, type: "Townhouse", category: "New Construction", badge: "New", beds: 3, baths: 3, area: "2,900", agent: "Daniel Hayes" },
    { address: "290 Seaview Lane", city: "Del Mar", price: 2750000, type: "House", category: "Waterfront", badge: "New", beds: 3, baths: 3, area: "2,650", agent: "Olivia Bennett" },
    { address: "51 Bayview Drive", city: "Coronado", price: 1400000, type: "Land", category: "Open House", badge: "Open house", beds: 0, baths: 0, area: "7,200", agent: "James Carter" }
];
let mode = "Buy";
let filter = "All";
let saved;
try
{
    saved = new Set(JSON.parse(localStorage.getItem("prestige-saved") || "[]"));
}
catch
{
    saved = new Set();
}
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const dialog = document.querySelector("#detail");
function show(content)
{
    document.querySelector("#detail-content").innerHTML = content;
    dialog.showModal();
}
document.querySelector(".close").onclick = () => dialog.close();
function render()
{
    const location = document.querySelector("#location").value.toLowerCase();
    const type = document.querySelector("#type").value;
    const max = Number(document.querySelector("#price").value);
    const found = homes.filter((home) => (!location || `${home.address} ${home.city}`.toLowerCase().includes(location)) && (type === "All properties" || home.type === type) && home.price <= max && (filter === "All" || filter === "Luxury" || home.category === filter));
    document.querySelector("#results").textContent = `${found.length} exceptional ${mode === "Buy" ? "properties" : "rental previews"}${mode === "Rent" ? " · illustrative monthly rates" : ""}`;
    document.querySelector("#listings").innerHTML = found.map((home) =>
    {
        const index = homes.indexOf(home);
        return `<article class="property"><div class="photo"><span class="badge">${home.badge}</span><button class="save" aria-label="Save ${home.address}" aria-pressed="${saved.has(index)}" data-save="${index}">${saved.has(index) ? "♥" : "♡"}</button><button class="carousel" aria-label="Next view of ${home.address}" data-carousel="${index}">● ○ ○</button></div><h3>${money(mode === "Buy" ? home.price : Math.round(home.price / 250))}${mode === "Rent" ? " / mo" : ""}</h3><p>${home.address}, ${home.city}</p><small>${home.beds} beds &nbsp;·&nbsp; ${home.baths} baths &nbsp;·&nbsp; ${home.area} sq ft</small><p>◌ ${home.agent}</p><button class="view" data-home="${index}">View property ↗</button></article>`;
    }).join("") || "<p>No homes match. Try another location or a higher budget.</p>";
}
document.querySelectorAll("[data-mode]").forEach((button) => button.onclick = () =>
{
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((other) =>
    {
        other.classList.toggle("active", other === button);
        other.setAttribute("aria-pressed", other === button);
    });
    render();
});
document.querySelectorAll("[data-filter]").forEach((button) => button.onclick = () =>
{
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((other) => other.classList.toggle("active", other === button));
    render();
});
document.querySelector("#search").onsubmit = (event) =>
{
    event.preventDefault();
    render();
    document.querySelector("#collection").scrollIntoView();
};
document.querySelector("#price").oninput = (event) => document.querySelector("#price-label").textContent = money(event.target.value);
document.querySelector("#listings").onclick = (event) =>
{
    const save = event.target.closest("[data-save]");
    if (save)
    {
        const index = Number(save.dataset.save);
        saved.has(index) ? saved.delete(index) : saved.add(index);
        try
        {
            localStorage.setItem("prestige-saved", JSON.stringify([...saved]));
        }
        catch {}
        render();
    }
    const carousel = event.target.closest("[data-carousel]");
    if (carousel)
    {
        const next = (Number(carousel.dataset.slide || 0) + 1) % 3;
        carousel.dataset.slide = next;
        carousel.textContent = ["● ○ ○", "○ ● ○", "○ ○ ●"][next];
        carousel.parentElement.style.backgroundPosition = ["center", "left", "right"][next];
    }
    const view = event.target.closest("[data-home]");
    if (view)
    {
        const home = homes[view.dataset.home];
        show(`<p class="eyebrow">THE PRESTIGE COLLECTION</p><h2>${home.address}</h2><p>${home.city} · ${home.type}</p><h3>${money(home.price)}</h3><p>${home.beds} beds · ${home.baths} baths · ${home.area} sq ft</p><p>Arrange a private viewing with ${home.agent}.</p><a href="mailto:viewings@example.com">Email your viewing request ↗</a><p>Demonstration listing, not a live offer.</p>`);
    }
};
document.querySelectorAll("[data-place]").forEach((button) => button.onclick = () =>
{
    document.querySelector("#location").value = button.dataset.place;
    filter = "All";
    document.querySelector('[data-filter="All"]').click();
    document.querySelector("#collection").scrollIntoView();
});
const agents = ["Olivia Bennett", "James Carter", "Sophia Reed", "Daniel Hayes"];
document.querySelector(".agents").innerHTML = agents.map((name, index) => `<article><div class="agent-portrait" aria-label="Illustrated monogram portrait of ${name}">${name.split(" ").map((part) => part[0]).join("")}</div><h3>${name}</h3><p>Senior advisor · ${["Coastal estates", "Village homes", "Island living", "New developments"][index]}<br>${42 + index * 7} transactions</p><a href="mailto:${name.split(" ")[0].toLowerCase()}@example.com">Contact advisor ↗</a><br><button class="view outline" data-agent="${index}">View profile</button></article>`).join("");
document.querySelectorAll("[data-agent]").forEach((button) => button.onclick = () => show(`<h2>${agents[button.dataset.agent]}</h2><p>Senior property advisor with deep roots in San Diego. Private appointments available Monday–Saturday.</p><a href="tel:+18585550140">Call 858.555.0140 ↗</a><p>Illustrative agent profile.</p>`));
document.querySelector("#all-agents").onclick = () => show(`<h2>Meet your local team</h2><p>${agents.join(" · ")}</p><p>Tell us the neighborhood you love and we will pair you with a local specialist.</p><a href="mailto:hello@example.com">Contact our team ↗</a>`);
const quotes =
[
    ["They didn't just find us a house.<br>They understood our idea of home.", "Sarah & James · La Jolla house · Closed in 21 days"],
    ["A thoughtful team, from our first viewing<br>to our very first sunset.", "Amelia R. · Del Mar townhouse · Negotiated $85,000 below asking"],
    ["We felt at home long before<br>we picked up the keys.", "Michael & Alex · Coronado condo · Sold and moved in 30 days"]
];
document.querySelectorAll("[data-quote]").forEach((button) => button.onclick = () =>
{
    const quote = quotes[button.dataset.quote];
    document.querySelector(".testimonial h2").innerHTML = `“${quote[0]}”`;
    document.querySelector("#quote-credit").textContent = quote[1];
});
document.querySelector("#report").onclick = () => show("<p class='eyebrow'>OCTOBER 2026 · DEMONSTRATION REPORT</p><h2>The coastal market, considered.</h2><p>Median home price: $1.24M, up 3.2% month over month.</p><p>Average days on market: 24, down 4 days. Inventory: 2.8 months.</p><p>These are illustrative figures, not financial advice or current MLS data.</p>");
document.querySelector("#valuation").onsubmit = (event) =>
{
    event.preventDefault();
    document.querySelector("#valuation-result").textContent = `Your valuation preview for ${document.querySelector("#address").value}: $1.1M–$1.4M. Illustrative only; contact an advisor for a personal assessment. No request was sent.`;
};
render();
