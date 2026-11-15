const properties = [
    { name: "The Kensington Residence", area: "Kensington", beds: 4, price: "£3,200,000" },
    { name: "Chelsea Mews House", area: "Chelsea", beds: 3, price: "£2,850,000" },
    { name: "Mayfair Penthouse", area: "Mayfair", beds: 2, price: "£4,500,000" }
];
const saved = new Set();
const dialog = document.querySelector("dialog");
function modal(html)
{
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
function render()
{
    document.querySelector(".listing-grid").innerHTML = properties.map((property, i) => `<article class="listing"><div class="interior" role="img" aria-label="Original interior illustration for sample property"></div><div class="listing-body"><h3>${property.name}</h3><span class="area">${property.area.toUpperCase()}</span><p>${property.beds} bedrooms · Details on enquiry</p><p class="price">${property.price}</p><div><button data-details="${i}">View details →</button><button data-save="${i}" aria-pressed="${saved.has(i)}">${saved.has(i) ? "Saved ✓" : "Shortlist +"}</button></div></div></article>`).join("");
    document.querySelector(".shortlist-count span").textContent = saved.size;
    document.querySelectorAll("[data-save]").forEach((button) => button.addEventListener("click", () =>
    {
        const index = Number(button.dataset.save);
        saved.has(index) ? saved.delete(index) : saved.add(index);
        render();
    }));
    document.querySelectorAll("[data-details]").forEach((button) => button.addEventListener("click", () =>
    {
        const property = properties[Number(button.dataset.details)];
        modal(`<p class="eyebrow">SAMPLE LISTING · ${property.area}</p><h2>${property.name}</h2><p class="price">${property.price}</p><p>${property.beds} bedrooms. Bath count, floor area, tenure and service charges have not been supplied.</p><p>Illustrative brief listing. No live availability is connected.</p><a class="button" href="#contact" id="discuss">Discuss this home →</a>`);
        document.querySelector("#discuss").addEventListener("click", () =>
        {
            document.querySelector('[name="area"]').value = property.area;
            document.querySelector('[name="message"]').value = `Please tell me more about ${property.name}.`;
            dialog.close();
        });
    }));
}
render();
document.querySelector("#show-shortlist").addEventListener("click", () => modal(`<h2>Your shortlist</h2>${saved.size ? `<ul>${[...saved].map((i) => `<li>${properties[i].name} · ${properties[i].price}</li>`).join("")}</ul><p>Saved in this page only. Reloading clears your shortlist.</p>` : "<p>Your shortlist is empty. Add a home using Shortlist +.</p>"}`));
document.querySelector("#all-listings").addEventListener("click", () => document.querySelector("#inventory").textContent = "You are viewing all 3 sample listings. Live inventory is not connected.");
document.querySelector("#valuation-open").addEventListener("click", () =>
{
    document.querySelector('[name="intent"]').value = "Arrange a valuation";
    document.querySelector('[name="message"]').value = "I would like to discuss a market appraisal for my property.";
    document.querySelector("#contact").scrollIntoView();
    document.querySelector('[name="name"]').focus({ preventScroll: true });
});
let downloadUrl;
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.target);
    const text = `Property enquiry\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nIntent: ${data.get("intent")}\nArea: ${data.get("area")}\nMessage: ${data.get("message")}\n\nPrepared locally; not sent.`;
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.querySelector("#download");
    link.href = downloadUrl;
    link.hidden = false;
    document.querySelector("#form-status").textContent = "Enquiry prepared locally. Save it to share with your advisor. No message, booking or valuation has been made.";
});
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
