const menus =
{
    tasting: ["Seasonal Tasting", "Seven courses, from £120 per person; paired wines available.", "Pea velouté · roasted seasonal main · chocolate and berries", "Pea velouté without dairy · roasted market vegetables · berry sorbet"],
    british: ["Classic British", "Three courses, from £65 per person; Sunday celebration style.", "Heritage beetroot · slow-roasted seasonal main · apple tart", "Beetroot with seeds · mushroom and root vegetable roast · poached apple"],
    sharing: ["Mezze & Sharing", "An abundant sharing feast, from £55 per person.", "Hummus and flatbreads · charred aubergine · citrus and pistachio", "Hummus · roasted aubergine · citrus and herb salad"]
};
const dialog = document.querySelector("#menu-dialog");
let selected = "tasting";
function updateMenu()
{
    document.querySelector("#menu-dishes").textContent = menus[selected][document.querySelector("#preference").value === "plant" ? 3 : 2];
}
document.querySelectorAll("[data-menu]").forEach((button) => button.addEventListener("click", () =>
{
    selected = button.dataset.menu;
    document.querySelector("#menu-title").textContent = menus[selected][0];
    document.querySelector("#menu-copy").textContent = menus[selected][1];
    document.querySelector("#preference").value = "standard";
    updateMenu();
    dialog.showModal();
}));
document.querySelector("#preference").addEventListener("change", updateMenu);
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#choose").addEventListener("click", () =>
{
    document.querySelector("#menu-choice").value = selected;
    dialog.close();
    location.hash = "enquiry";
});
document.querySelectorAll("[data-event]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#occasion").value = button.dataset.event;
    location.hash = "enquiry";
}));
const form = document.querySelector("#enquiry-form");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = document.querySelector("#date").value;
    const guests = Number(document.querySelector("#guests").value);
    const email = document.querySelector("#email");
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (!date || date <= localToday)
    {
        result.textContent = "Choose a future date to prepare an enquiry.";
        return;
    }
    if (!Number.isInteger(guests) || guests < 2 || guests > 200)
    {
        result.textContent = "Enter a whole guest count from 2 to 200.";
        return;
    }
    if (!email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter a valid example email address.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Acknowledge the local-only planning preview.";
        return;
    }
    const menu = document.querySelector("#menu-choice").value;
    const notes = document.querySelector("#diet").value.trim();
    result.textContent = `Local enquiry draft: ${guests} guests on ${date}.\n${menus[menu][0]} — illustrative food starting point £${guests * ({ tasting:120, british:65, sharing:55 }[menu])}; staffing, travel and final scope need confirmation.\nDietary note: ${notes || "Not specified; discuss with the chef."}\nNothing sent or booked. Allergens and availability have not been confirmed.`;
});
form.addEventListener("reset", () => result.textContent = "");
document.querySelector("#instagram").addEventListener("click", () => document.querySelector("#social-note").textContent = "A verified Instagram profile was not supplied for this fictional chef.");
