const listings = [
    { address: "2847 Mulholland Drive", area: "Bel Air", price: "$6,850,000", spec: "5 beds · 6 baths · 6,200 sq ft", status: "FOR SALE" },
    { address: "412 N Roxbury Drive", area: "Beverly Hills", price: "$4,250,000", spec: "4 beds · 4.5 baths · 4,100 sq ft", status: "JUST LISTED" },
    { address: "1705 Amalfi Drive", area: "Pacific Palisades", price: "$8,100,000", spec: "6 beds · 7 baths · 7,800 sq ft", status: "FOR SALE" }
];
const dialog = document.querySelector("dialog");
function modal(html)
{
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
function render()
{
    const area = document.querySelector("#area-filter").value;
    const visible = listings.filter((property) => area === "All neighborhoods" || property.area === area);
    document.querySelector("#empty").hidden = visible.length > 0;
    document.querySelector(".listings").innerHTML = visible.map((property) => `<article class="property"><div class="property-art"><img src="estate.svg" alt="Illustrative architectural study, not a photograph of ${property.address}"><span>${property.status}</span></div><div class="property-body"><h3>${property.address}</h3><span class="area">${property.area.toUpperCase()}</span><p class="price">${property.price}</p><p class="spec">${property.spec}</p><button data-address="${property.address}">View Property →</button></div></article>`).join("");
    document.querySelectorAll("[data-address]").forEach((button) => button.addEventListener("click", () =>
    {
        const property = listings.find((item) => item.address === button.dataset.address);
        modal(`<p class="eyebrow">SAMPLE PROPERTY · ${property.area}</p><h2>${property.address}</h2><p class="price">${property.price}</p><p>${property.spec}</p><p>This listing and its availability are illustrative brief data. Artwork is an original architectural study, not a property photograph.</p><a class="button" href="#contact" id="property-enquiry">Discuss this property</a>`);
        document.querySelector("#property-enquiry").addEventListener("click", () =>
        {
            document.querySelector('[name="message"]').value = `I would like to discuss ${property.address}.`;
            dialog.close();
        });
    }));
}
document.querySelector("#area-filter").addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#area-filter").value = "All neighborhoods";
    render();
});
render();
const neighborhoods = [["Bel Air", "Residential Estates"], ["Beverly Hills", "City Prestige"], ["Pacific Palisades", "Coastal Living"], ["Holmby Hills", "Private Estates"], ["Malibu", "Beach & Canyon"], ["Hancock Park", "Historic Elegance"]];
document.querySelector(".neighborhoods").innerHTML = neighborhoods.map(([name, type]) => `<button data-neighborhood="${name}"><span>${name}</span><small>${type.toUpperCase()}</small></button>`).join("");
document.querySelectorAll("[data-neighborhood]").forEach((button) => button.addEventListener("click", () =>
{
    const [name, type] = neighborhoods.find(([name]) => name === button.dataset.neighborhood);
    modal(`<p class="eyebrow">LOCAL EXPERTISE</p><h2>${name}</h2><p>${type}. Discuss your priorities, preferred setting and timing with an advisor. This preview provides no live market statistics or investment advice.</p><a class="button" href="#contact" id="area-enquiry">Start a conversation</a>`);
    document.querySelector("#area-enquiry").addEventListener("click", () =>
    {
        document.querySelector('[name="message"]').value = `I am interested in ${name}.`;
        dialog.close();
    });
}));
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.target);
    document.querySelector("#form-status").textContent = `Message prepared for ${data.get("name")} (${data.get("intent")}). Not sent. Use the direct email link to contact the agency; no call or consultation has been booked.`;
});
document.querySelector("#privacy").addEventListener("click", () => modal("<h2>Your privacy</h2><p>This static preview keeps form drafts in memory only. Reloading clears them. There is no analytics, account service or message submission. Email and phone links leave the page for your chosen application.</p>"));
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
