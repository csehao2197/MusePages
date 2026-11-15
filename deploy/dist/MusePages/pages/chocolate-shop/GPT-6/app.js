const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const origins =
[
    ["Madagascar, Sambirano", "Sharp. Raspberry, lemon peel, almost no bitterness.", "72% / 2026 HARVEST"],
    ["Peru, Piura", "Soft and nutty. Cashew, brown sugar, a long finish.", "70% / 2025 HARVEST"],
    ["Tanzania, Kokoa Kamili", "Plum, red wine, a little tannin. Fruity and surprising.", "75% / 2026 HARVEST"],
    ["Vietnam, Ben Tre", "Dark and spiced. Dried fig, tobacco notes and a touch of smoke.", "73% / 2025 HARVEST"],
    ["Dominican Republic, Oko Caribe", "Banana and honey. A friendly introduction to dark chocolate.", "68% / 2026 HARVEST"]
];
const selected = new Set();
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const matches = origins.map((origin, index) => ({ origin, index })).filter(({ origin }) => origin.join(" ").toLowerCase().includes(query));
    document.querySelector("#origin-list").innerHTML = matches.map(({ origin: o, index }) => `<article class="origin"><h3>${o[0]}</h3><p>${o[1]}</p><p class="meta">${o[2]}</p><button data-origin="${index}" aria-pressed="${selected.has(index)}">${selected.has(index) ? "Remove from tasting list" : "Add to tasting list"} ${selected.has(index) ? "−" : "+"}</button></article>`).join("");
    document.querySelector("#empty").hidden = matches.length > 0;
    document.querySelector("#count").textContent = `${selected.size} of 3 origins selected`;
    const list = [...selected].map((index) => origins[index][0]).join("; ");
    document.querySelector("#origin-email").href = `mailto:hello@foldandtemper.co.uk?subject=${encodeURIComponent("Three bar set enquiry")}&body=${encodeURIComponent(`I would like to ask about: ${list || "a three bar tasting set"}. Please confirm stock, ingredients, allergens and ordering details.`)}`;
}
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    render();
});
document.querySelector("#origin-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-origin]");
    if (!button) return;
    const index = Number(button.dataset.origin);
    const status = document.querySelector("#selection-status");
    if (selected.has(index))
    {
        selected.delete(index);
        status.textContent = "Removed. Your enquiry list is updated.";
    }
    else if (selected.size === 3)
    {
        status.textContent = "Choose up to three origins. Remove one to try another.";
        return;
    }
    else
    {
        selected.add(index);
        status.textContent = "Added to your enquiry list. Nothing ordered.";
    }
    render();
});
const snap = document.querySelector("#snap");
document.querySelector(".bar-left").innerHTML = "<i></i>".repeat(18);
document.querySelector(".bar-right").innerHTML = "<i></i>".repeat(6);
if (matchMedia("(prefers-reduced-motion: reduce)").matches) snap.classList.add("snapped");
else
{
    const observer = new IntersectionObserver((entries) =>
    {
        if (entries.some((entry) => entry.isIntersecting))
        {
            snap.classList.add("snapped");
            observer.disconnect();
        }
    }, { threshold: .6 });
    observer.observe(snap);
}
function posting()
{
    const month = Number(document.querySelector("#month").value);
    const open = month <= 3 || month >= 9;
    document.querySelector("#posting").textContent = open ? "Within the sample UK posting season. Email to confirm stock, weather and delivery options." : "Outside the sample posting season. Visit the shop or ask about autumn posting.";
    document.querySelector("#post-email").href = `mailto:hello@foldandtemper.co.uk?subject=${encodeURIComponent(`Posting enquiry: ${document.querySelector("#month").selectedOptions[0].textContent}`)}`;
}
document.querySelector("#month").value = new Date().getMonth();
document.querySelector("#month").addEventListener("change", posting);
posting();
render();
