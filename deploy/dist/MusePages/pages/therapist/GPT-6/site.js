const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
document.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#topic").value = button.dataset.topic;
    document.querySelector("#support-status").textContent = `${button.dataset.topic} selected for your local enquiry preview. No health details are requested.`;
    document.querySelector("#contact").scrollIntoView();
}));
const sessions = document.querySelector("#sessions");
const type = document.querySelector("#fee-type");
function calculate()
{
    const count = Number(sessions.value);
    const valid = sessions.value !== "" && Number.isInteger(count) && count >= 1 && count <= 12;
    sessions.setCustomValidity(valid ? "" : "Enter a whole number from 1 to 12.");
    document.querySelector("#fee-total").textContent = valid ? `${type.value === "55" ? "From " : ""}£${count * Number(type.value)} for ${count} session${count === 1 ? "" : "s"} · planning estimate only.` : "Enter a whole number from 1 to 12.";
}
sessions.addEventListener("input", calculate);
type.addEventListener("change", calculate);
document.querySelector("#contact-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#contact-status").textContent = "Your free-call enquiry preview is ready. Nothing sent or stored; no session booked. This fictional practice is not a care service.";
});
const dialog = document.querySelector("#privacy-dialog");
document.querySelector("#privacy").addEventListener("click", () => dialog.showModal());
document.querySelector("#close").addEventListener("click", () => dialog.close());
calculate();
