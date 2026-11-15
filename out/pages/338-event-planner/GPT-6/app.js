const form = document.querySelector("form");
form.elements.date.min = new Date().toLocaleDateString("en-CA");
const filters = document.querySelectorAll("[data-filter]");
let category = "all";
function filter()
{
    const term = document.querySelector("#search").value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll(".event").forEach((event) =>
    {
        event.hidden = !(category === "all" || event.dataset.category === category) || !`${event.dataset.title} ${event.dataset.description}`.toLowerCase().includes(term);
        if (!event.hidden) count++;
    });
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    document.querySelector("#count").textContent = `${count} CONCEPT${count === 1 ? "" : "S"} SHOWN`;
    document.querySelector("#empty").hidden = count > 0;
}
filters.forEach((button) => button.addEventListener("click", () =>
{
    category = button.dataset.filter;
    filter();
}));
document.querySelector("#search").addEventListener("input", filter);
document.querySelector("#reset-filters").addEventListener("click", () =>
{
    category = "all";
    document.querySelector("#search").value = "";
    filter();
});
document.querySelectorAll(".signature [data-category]").forEach((link) => link.addEventListener("click", () =>
{
    category = link.dataset.category;
    document.querySelector("#search").value = "";
    filter();
}));
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.type.value = button.dataset.service;
    document.querySelector("#result").textContent = "";
    document.querySelector("#contact").scrollIntoView();
}));
const dialog = document.querySelector("#event-dialog");
let selected = null;
document.querySelectorAll(".event").forEach((button) => button.addEventListener("click", () =>
{
    selected = button;
    document.querySelector("#event-title").textContent = button.dataset.title;
    document.querySelector("#event-description").textContent = button.dataset.description;
    dialog.showModal();
}));
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#plan-similar").addEventListener("click", () =>
{
    form.elements.type.value = { private: "Private celebration", corporate: "Corporate event", wedding: "Wedding" }[selected.dataset.category];
    form.elements.message.value = `Inspired by the ${selected.dataset.title} concept. `;
    document.querySelector("#result").textContent = "";
    dialog.close();
    document.querySelector("#contact").scrollIntoView();
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const invalid = [...form.querySelectorAll("input, textarea")].filter((input) =>
    {
        const valid = input.checkValidity() && input.value.trim().length >= (input.name === "message" ? 15 : 1);
        input.setAttribute("aria-invalid", String(!valid));
        return !valid;
    });
    const result = document.querySelector("#result");
    if (invalid.length)
    {
        result.textContent = "Please enter a future date, 2 to 2,000 guests, name, valid email and at least 15 characters about your occasion.";
        invalid[0].focus();
        return;
    }
    result.textContent = `${form.elements.type.value} · ${form.elements.guests.value} guests · ${form.elements.date.value} · ${form.elements.budget.value}. Local enquiry preview complete. No date held, message sent or payment taken.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
filter();
