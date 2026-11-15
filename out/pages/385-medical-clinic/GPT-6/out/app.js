const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
    }
});
const slots = { standard: "Standard consultation · 30 minutes · £110 · in person", extended: "Extended consultation · 45 minutes · £150 · in person", assessment: "Full health assessment · 90 minutes · £395 · in person" };
document.querySelectorAll("[data-slot]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-slot]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelector("#slot-detail").textContent = slots[button.dataset.slot];
    document.querySelector("#appointment").value = button.dataset.slot;
}));
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll("[data-kind]").forEach((item) => { item.hidden = button.dataset.filter !== "all" && item.dataset.kind !== button.dataset.filter; });
}));
const profile = document.querySelector("#profile");
document.querySelectorAll("[data-doctor]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#profile-name").textContent = button.dataset.doctor;
    profile.showModal();
}));
document.querySelector("#close-profile").addEventListener("click", () => profile.close());
document.querySelector("#choose-doctor").addEventListener("click", () =>
{
    document.querySelector("#doctor").value = document.querySelector("#profile-name").textContent;
    profile.close();
    document.querySelector("#planner").scrollIntoView();
});
document.querySelector("#panel").addEventListener("change", (event) =>
{
    const days = event.target.value === "5" ? "3–5" : event.target.value;
    document.querySelector("#panel-result").textContent = `Example: around ${days} working day${days === "1" ? "" : "s"} after the sample reaches the laboratory. Not a result delivery promise.`;
});
const form = document.querySelector("#plan");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    const result = document.querySelector("#result");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email")))
    {
        result.textContent = "Enter a valid example email. No patient information is needed.";
    }
    else if (!data.get("ack"))
    {
        result.textContent = "Confirm the local-only acknowledgement.";
    }
    else
    {
        result.textContent = `Local plan: ${document.querySelector("#appointment").selectedOptions[0].textContent}; ${data.get("doctor")}. No appointment booked, medical advice provided or enquiry sent.`;
    }
});
form.addEventListener("reset", () => { document.querySelector("#result").textContent = ""; });
