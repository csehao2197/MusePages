const packages =
{
    Silver:
    {
        description: "A curated selection of our most loved treatments — perfect for a first visit or a regular wellness ritual.",
        features: ["Essential relaxation", "Choice of 2 treatments", "Refreshments included"],
        price: "$149.99"
    },
    Diamond:
    {
        description: "Our signature full-day experience. A complete wellness journey from arrival to departure, fully personalized.",
        features: ["Comprehensive wellness", "Luxury and exclusivity", "Access to exclusive amenities"],
        price: "$325.99"
    },
    Gold:
    {
        description: "The ultimate SEREN experience — every treatment, every amenity, every moment crafted around you.",
        features: ["All Diamond features", "Private suite access", "Personal therapist for the day"],
        price: "$580.00"
    }
};
let selected = "Diamond";
const tabs = [...document.querySelectorAll("[role='tab']")];
function selectPackage(tab)
{
    selected = tab.dataset.package;
    tabs.forEach((item) =>
    {
        item.setAttribute("aria-selected", String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
    });
    document.querySelector("#package").setAttribute("aria-labelledby", tab.id);
    document.querySelector("#package-name").textContent = `The ${selected} experience`;
    document.querySelector("#package-description").textContent = packages[selected].description;
    document.querySelector("#package-price").textContent = packages[selected].price;
    document.querySelector("#package-features").replaceChildren(...packages[selected].features.map((feature) =>
    {
        const li = document.createElement("li");
        li.textContent = feature;
        return li;
    }));
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => selectPackage(tab));
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        selectPackage(tabs[next]);
        tabs[next].focus();
    });
});
document.querySelector("#reserve").addEventListener("click", () =>
{
    document.querySelector("#selected-package").textContent = `${selected} · ${packages[selected].price} · illustrative price`;
    document.querySelector("#preference").reset();
    document.querySelector("#preference-status").textContent = "Nothing is sent or reserved. No medical information is requested.";
    document.querySelector("#reservation").showModal();
});
document.querySelector("#preference").addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!document.querySelector("#guest").value.trim())
    {
        document.querySelector("#preference-status").textContent = "Please enter a name containing letters, not only spaces.";
        return;
    }
    document.querySelector("#preference-status").textContent = `${selected} / ${document.querySelector("#time").value} preference previewed. No booking created and nothing sent.`;
});
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("[data-service]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const service = button.dataset.service;
        document.querySelector("#service-title").textContent = service;
        document.querySelector("#service-copy").textContent = ["IV Therapy", "Injectable Cosmetology", "Diagnostics"].includes(service) ? "Medical category from the supplied brief. This concept provides no treatment guidance or clinical booking. A licensed professional must establish suitability, risks and informed consent independently." : `${service} is part of the illustrated Seren service collection. Explore sample wellness packages; specific treatments and availability require direct confirmation.`;
        document.querySelector("#service-dialog").showModal();
    });
});
document.querySelector("#service-book").addEventListener("click", () => document.querySelector("#service-dialog").close());
for (const [id, direction] of [["team-prev", -1], ["team-next", 1]])
{
    document.getElementById(id).addEventListener("click", () => document.querySelector("#team-row").scrollBy({ left: 450 * direction, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
}
