const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const service = document.querySelector("#service");
const prices = { "Express Wash": 12, "Signature Wash": 22, "Full Detail": 45 };
function update()
{
    const extras = [...document.querySelectorAll(".extras input:checked")].reduce((sum, item) => sum + Number(item.value), 0);
    document.querySelector("#selected").textContent = service.value;
    document.querySelector("#total").textContent = `£${prices[service.value] + extras}`;
    document.querySelector("#status").textContent = "";
}
document.querySelector("#booking").addEventListener("input", update);
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    service.value = button.dataset.package;
    update();
    document.querySelector("#book").scrollIntoView();
}));
document.querySelector("#compare").addEventListener("input", (event) =>
{
    document.querySelector("#dust").style.width = `${event.target.value}%`;
    document.querySelector("#compare-value").value = `${event.target.value}%`;
});
const date = document.querySelector("#date");
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
date.min = localToday;
document.querySelector("#booking").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    if (!date.value || date.value < localToday)
    {
        status.textContent = "Choose today or a future date.";
        return;
    }
    if (!document.querySelector("#name").value.trim())
    {
        status.textContent = "Add your name to the plan.";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value))
    {
        status.textContent = "Enter a valid email address.";
        return;
    }
    if (!document.querySelector("#accept").checked)
    {
        status.textContent = "Acknowledge this is a browser-only plan.";
        return;
    }
    status.textContent = `${service.value} plan for ${date.value}: ${document.querySelector("#total").textContent}. Nothing booked, charged or sent. Call the team to arrange your visit.`;
});
document.querySelectorAll("[data-member]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#member-status").textContent = `${button.dataset.member} selected for enquiry. No subscription created or payment taken. Call 01628 551 007 to discuss the illustrative plan.`;
}));
