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
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
document.querySelectorAll("[data-plan]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#plan").value = button.dataset.plan;
        document.querySelector("#enquiry-status").textContent = `${button.dataset.plan} selected. Complete the local draft; no call is booked.`;
        document.querySelector("#contact").scrollIntoView();
    });
});
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#enquiry-status").textContent = `${document.querySelector("#plan").value} / ${document.querySelector("#sport").value} enquiry previewed. No call booked, nothing sent or saved.`;
});
