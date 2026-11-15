const menu = [
    ["Starters", [["Ham hock terrine, piccalilli, toast", "8.50"], ["Soup of the day, warm bread", "6.95"], ["Potted shrimps, brown butter, sourdough", "9.50"]]],
    ["Mains", [["Beer battered haddock, chips, minted peas", "17.50"], ["Steak and ale pie, mash, greens", "18.00"], ["Wild mushroom risotto, aged Parmesan", "15.50"], ["Sunday roast, beef or pork, all the trimmings", "21.00"]]],
    ["Puddings", [["Sticky toffee pudding, clotted cream", "7.50"], ["Apple and blackberry crumble, custard", "7.00"], ["Local cheeses, oatcakes, chutney", "10.50"]]]
];
document.querySelector(".dishes").innerHTML = menu.map(([name, dishes]) => `<div class="dish-group" data-group="${name}"><h3>${name}</h3>${dishes.map(([dish, price]) => `<div class="dish"><span>${dish}</span><b>£${price}</b></div>`).join("")}</div>`).join("");
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", item === button));
    document.querySelectorAll("[data-group]").forEach((group) => group.hidden = button.dataset.filter !== "All" && group.dataset.group !== button.dataset.filter);
}));
const ales = [["Lantern Bitter", "Stroud Brewery · 3.8%", "Our house ale. Biscuity and easy."], ["Cotswold Gold", "Cotswold Brew Co · 4.2%", "Golden, citrus, dangerously drinkable."], ["Old Fox Porter", "Wye Valley · 5.0%", "Dark chocolate and coffee. Winter in a glass."], ["Hook Norton Old Hooky", "Hook Norton · 4.6%", "Fruity, full and a local favourite."], ["Orchard Dry", "Westons · 5.5%", "Crisp, still cider from Herefordshire."], ["Guest ale", "Changes weekly", "Ask what is on today."]];
document.querySelector(".ales").innerHTML = ales.map(([name, maker, text]) => `<article><h3>${name}</h3><small>${maker}</small><p>${text}</p></article>`).join("");
const events = [["Tuesday", "Quiz night", "20:00"], ["Wednesday", "Pie and a pint £16", "All day"], ["Thursday", "Folk session, bring an instrument", "20:30"], ["Friday", "Fish supper night", "From 17:00"], ["Sunday", "Roast and live acoustic music", "13:00"]];
document.querySelector(".events").innerHTML = events.map((row) => `<article>${row.map((text) => `<span>${text}</span>`).join("")}</article>`).join("");
document.querySelector("#print-menu").addEventListener("click", () => window.print());
const dialog = document.querySelector("dialog");
document.querySelector("#room-details").addEventListener("click", () => dialog.showModal());
document.querySelector(".close").addEventListener("click", () => dialog.close());
const toggle = document.querySelector(".menu");
toggle.addEventListener("click", () =>
{
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    toggle.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
