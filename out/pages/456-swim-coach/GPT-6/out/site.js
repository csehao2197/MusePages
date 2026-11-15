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
const descriptions = Object.fromEntries([...document.querySelectorAll(".program-list article")].map((row) => [row.querySelector("button").dataset.program, row.querySelector("p").textContent]));
function updateProgram()
{
    const value = document.querySelector("#program").value;
    document.querySelector("#program-note").textContent = descriptions[value] || "Choose a program to review its focus.";
    document.querySelector("#trial-status").textContent = "Selection updated. No session is reserved.";
}
document.querySelector("#program").addEventListener("change", updateProgram);
document.querySelectorAll("[data-program]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#program").value = button.dataset.program;
        updateProgram();
        document.querySelector("#contact").scrollIntoView();
    });
});
document.querySelectorAll("[data-rate]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#rate").value = button.dataset.rate;
        document.querySelector("#trial-status").textContent = `${button.dataset.rate} format selected. This is an enquiry draft, not a purchase.`;
        document.querySelector("#contact").scrollIntoView();
    });
});
document.querySelector("#trial").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#trial-status").textContent = `${document.querySelector("#program").value} / ${document.querySelector("#rate").value} enquiry previewed. No booking created; nothing sent or stored.`;
});
