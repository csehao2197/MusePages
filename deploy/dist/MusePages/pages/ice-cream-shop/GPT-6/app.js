const flavours =
[
    ["Strawberry Balsamic", "#e7a1af", false, "Bright strawberries with a whisper of aged balsamic.", "Dairy · egg-free recipe"],
    ["Matcha & White Chocolate", "#a9bd84", true, "Grassy matcha with pools of white chocolate.", "Dairy recipe · vegan variant"],
    ["Burnt Honey & Lavender", "#e3b67c", false, "Wildflower honey at the edge of caramel.", "Dairy"],
    ["Roasted Pistachio & Sea Salt", "#c5cf93", false, "Roasted Sicilian pistachios and Atlantic sea salt.", "Dairy · nuts"],
    ["Yuzu & Ginger Sorbet", "#efdc7a", true, "Japanese citrus meets crystallised ginger.", "Vegan recipe"],
    ["Dark Chocolate & Espresso", "#805b4d", false, "Deep cocoa and a bright shot of espresso.", "Dairy"],
    ["Peach & Champagne Sorbet", "#efb393", true, "White peach with a splash of champagne.", "Vegan recipe · contains alcohol"],
    ["Blueberry & Cheesecake", "#b0a0c8", false, "Tangy cream cheese with a blueberry ripple.", "Dairy"],
    ["Chilli Chocolate", "#9d7261", true, "Dark chocolate with a slowly building warmth.", "Vegan variant"]
];
let cup = [];
const money = (value) => `£${value}`;
function renderMenu()
{
    const query = document.querySelector("#search").value.toLowerCase();
    const vegan = document.querySelector("#diet").value === "vegan";
    const visible = flavours.map((flavour, id) => ({ flavour, id })).filter(({ flavour }) => flavour[0].toLowerCase().includes(query) && (!vegan || flavour[2]));
    document.querySelector("#flavour-grid").innerHTML = visible.map(({ flavour: f, id }) => `<article class="flavour"><div class="scoop" style="background:${f[1]}"></div><h3>${f[0]}</h3><p>${f[3]}</p><p class="note">${f[4]}</p><button data-add="${id}">Add to my cup →</button></article>`).join("");
    document.querySelector("#empty").hidden = visible.length > 0;
}
function renderCup()
{
    document.querySelector("#cup").replaceChildren(...cup.map((id) =>
    {
        const row = document.createElement("p");
        row.textContent = flavours[id][0];
        const button = document.createElement("button");
        button.textContent = "×";
        button.setAttribute("aria-label", `Remove ${flavours[id][0]}`);
        button.onclick = () => toggle(id);
        row.append(button);
        return row;
    }));
    document.querySelectorAll("[data-add]").forEach((el) => el.setAttribute("aria-pressed", String(cup.includes(Number(el.dataset.add)))));
    document.querySelector("#cup-status").textContent = cup.length ? `${cup.length} of 3 scoops chosen. Example cup: ${money(3 + cup.length * 1.5)}.` : "Your cup is waiting for its first scoop.";
}
function toggle(id)
{
    if (cup.includes(id)) cup = cup.filter((entry) => entry !== id);
    else if (cup.length < 3) cup.push(id);
    else
    {
        document.querySelector("#cup-status").textContent = "Three is the limit! Remove a scoop before adding another.";
        return;
    }
    renderCup();
}
const wheel = document.querySelector("#wheel");
const point = (r, angle) => [300 + r * Math.cos(angle * Math.PI / 180), 300 + r * Math.sin(angle * Math.PI / 180)];
wheel.innerHTML = flavours.slice(0, 8).map((f, id) =>
{
    const [a, b, c, d] = [point(275, id * 45), point(275, id * 45 + 43), point(122, id * 45 + 43), point(122, id * 45)];
    const label = point(198, id * 45 + 21.5);
    return `<g role="button" tabindex="0" aria-label="Add ${f[0]}" data-add="${id}"><path fill="${f[1]}" d="M${a}A275 275 0 0 1 ${b}L${c}A122 122 0 0 0 ${d}Z"/><text x="${label[0]}" y="${label[1]}" text-anchor="middle" fill="${id === 5 ? "#fff" : "#292a21"}" font-size="24">${id + 1}</text><title>${f[0]}</title></g>`;
}).join("") + '<text x="300" y="295" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="28">a world of</text><text x="300" y="330" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="34">flavour.</text>';
document.querySelector("#choices").innerHTML = flavours.slice(0, 8).map((f, id) => `<button data-add="${id}" aria-pressed="false">${id + 1}. ${f[0]}</button>`).join("");
document.addEventListener("click", (event) =>
{
    const add = event.target.closest("[data-add]");
    if (add) toggle(Number(add.dataset.add));
    const gift = event.target.closest("[data-gift]");
    if (gift) document.querySelector("#gift-result").textContent = `${money(gift.dataset.gift)} gift preview selected. No payment taken; no redeemable card issued.`;
    const enquire = event.target.closest("[data-enquire]");
    if (enquire)
    {
        document.querySelector("[name='kind']").value = enquire.dataset.enquire;
        document.querySelector("#enquiry").showModal();
    }
});
wheel.addEventListener("keydown", (event) =>
{
    if (["Enter", " "].includes(event.key) && event.target.matches("[data-add]"))
    {
        event.preventDefault();
        toggle(Number(event.target.dataset.add));
    }
});
document.querySelector("#clear").onclick = () =>
{
    cup = [];
    renderCup();
};
document.querySelector("#prepare").onclick = () =>
{
    document.querySelector("#cup-status").textContent = cup.length ? `Your mix: ${cup.map((id) => flavours[id][0]).join(" + ")}. Saved in this view only; no order placed.` : "Pick at least one scoop first.";
};
document.querySelector("#search").oninput = renderMenu;
document.querySelector("#diet").onchange = renderMenu;
let daily = 0;
document.querySelector("#daily").onclick = () =>
{
    daily = (daily + 1) % 3;
    document.querySelector("#daily-name").textContent = [flavours[2][0], flavours[3][0], flavours[0][0]][daily];
};
document.querySelector("#close").onclick = () => document.querySelector("#enquiry").close();
document.querySelector("#event-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const n = Number(f.guests.value);
    const limit = f.kind.value === "Private tasting" ? 20 : 100;
    document.querySelector("#event-result").textContent = !Number.isInteger(n) || n < 1 || n > limit || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value) ? `Enter a valid email and 1–${limit} guests for this package.` : `${f.kind.value}: ${n} guests. Example from ${money(f.kind.value === "Private tasting" ? n * 65 : 450)}. Local preview only; nothing sent or reserved.`;
};
renderMenu();
renderCup();
