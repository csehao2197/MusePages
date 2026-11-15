const dialog = document.querySelector("#ticket-dialog");
let selection = "";
let price = 0;
const quantity = document.querySelector("#quantity");
const day = document.querySelector("#ticket-day");
document.querySelectorAll("[data-day]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelectorAll("[data-day]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        document.querySelectorAll("[data-lineup]").forEach((article) =>
        {
            article.hidden = button.dataset.day !== "all" && article.dataset.lineup !== button.dataset.day;
        });
    });
});
document.querySelectorAll("[data-ticket]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        selection = button.dataset.ticket;
        price = Number(button.dataset.price);
        quantity.value = "1";
        document.querySelector("#acknowledge").checked = false;
        document.querySelector("#ticket-title").textContent = selection;
        day.disabled = selection !== "Day ticket";
        day.value = day.disabled ? "Both days" : "Saturday";
        document.querySelector("#total").textContent = `£${price}`;
        document.querySelector("#ticket-result").textContent = "No tickets reserved. No payment taken.";
        dialog.showModal();
    });
});
quantity.addEventListener("input", () =>
{
    const value = Number(quantity.value);
    document.querySelector("#total").textContent = Number.isInteger(value) && value >= 1 && value <= 8 ? `£${value * price}` : "Choose 1 to 8 tickets";
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const value = Number(quantity.value);
    const result = document.querySelector("#ticket-result");
    if (!Number.isInteger(value) || value < 1 || value > 8)
    {
        result.textContent = "Choose a whole number from 1 to 8.";
        return;
    }
    if (!document.querySelector("#acknowledge").checked)
    {
        result.textContent = "Please acknowledge this is a local planner.";
        return;
    }
    result.textContent = `${value} × ${selection}, ${day.value}: £${value * price}. Local selection reviewed. No tickets reserved or payment taken.`;
});
