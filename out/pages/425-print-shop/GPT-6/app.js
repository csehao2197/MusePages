const products = [
    ["Zines", "A5 or A6, stapled, up to 48 pages", "£2.10", "MAKE<br>A<br>SCENE"],
    ["Posters", "A3 or A2, up to four colours", "£1.40", "NOISE<br>IS<br>GOOD"],
    ["Art prints", "Heavyweight 300gsm stock, numbered editions", "£3.50", "FORM<br>+<br>COLOUR"],
    ["Flyers", "A6, double-sided, two colours", "£0.22", "SEE<br>YOU<br>THERE"],
    ["T-shirts", "Screen-printed, organic cotton, one to three colours", "£11", "CLUB<br>UNIFORM"],
    ["Tote bags", "Heavy canvas, one or two colours", "£6", "CARRY<br>AN<br>IDEA"]
];
document.querySelector(".products").innerHTML = products.map(([name, spec, price, art]) => `<article class="product"><div class="print-art" tabindex="0" role="button" aria-label="Toggle ${name} artwork colour">${art}</div><h3>${name}</h3><p>${spec}</p><strong>from ${price} each</strong></article>`).join("");
const clients = ["Mogwai tour poster", "Glasgow Zine Fest", "Wild Oat Bakery menus", "Siobhan Reid art print", "Barras Market tote", "The Hug & Pint gig series", "Leith Walk Cycling Club tees", "Spit & Sawdust zine #7"];
document.querySelector(".work-grid").innerHTML = clients.map((client, i) => `<figure><div class="print-art" role="img" aria-label="Original graphic print study">${["LOUD<br>BY<br>NATURE", "ZINE<br>TIME", "WILD<br>OAT", "SLOW<br>SHAPES", "BARRAS<br>LOCAL", "HUG<br>+ PINT", "LEITH<br>WALK", "SPIT &<br>SAW"][i]}</div><figcaption>${client}</figcaption></figure>`).join("");
const inks = [["Fluoro Pink", "#ff338e"], ["Medium Blue", "#006de6"], ["Yellow", "#ffe532"], ["Green", "#008d67"], ["Orange", "#ef7326"], ["Purple", "#7947a9"], ["Black", "#191d2e"], ["Metallic Gold", "#ad8840"]];
document.querySelector(".swatches").innerHTML = inks.map(([name, color]) => `<button class="swatch" aria-pressed="false" style="--swatch:${color}" data-ink="${name}"><i></i>${name}</button>`).join("");
let selected = [];
function renderInks()
{
    document.querySelectorAll(".swatch").forEach((button) => button.setAttribute("aria-pressed", selected.includes(button.dataset.ink)));
    document.querySelector("#ink-result").textContent = selected.length ? `Your sample: ${selected.join(" + ")}${selected.length === 2 ? ". Two inks, endless possibilities. Email us for a physical sample." : ". Choose one more."}` : "Your sample: choose your first ink.";
}
document.querySelectorAll(".swatch").forEach((button) => button.addEventListener("click", () =>
{
    const name = button.dataset.ink;
    selected = selected.includes(name) ? selected.filter((ink) => ink !== name) : [...selected.slice(-1), name];
    renderInks();
}));
document.querySelector("#clear-inks").addEventListener("click", () =>
{
    selected = [];
    renderInks();
});
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
document.querySelectorAll(".product .print-art").forEach((art) =>
{
    const toggle = () => art.classList.toggle("active");
    art.addEventListener("click", toggle);
    art.addEventListener("keydown", (event) =>
    {
        if (event.key === "Enter" || event.key === " ")
        {
            event.preventDefault();
            toggle();
        }
    });
});
const dialog = document.querySelector("dialog");
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#guide").addEventListener("click", () =>
{
    document.querySelector("#dialog-title").textContent = "File guide";
    document.querySelector("#dialog-body").innerHTML = "<p>Export a PDF with each ink colour on a separate greyscale layer. Add 3mm bleed and keep text 5mm inside the trim.</p><p>Send your size, quantity, stock and deadline by email. We will check the artwork with you before printing.</p><a href='mailto:hello@offsetclub.co.uk?subject=Artwork%20help'>Ask for artwork help ↗</a>";
    dialog.showModal();
});
document.querySelectorAll("[data-workshop]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#dialog-title").textContent = button.dataset.workshop;
    document.querySelector("#dialog-body").innerHTML = `<p>This is an illustrative workshop listing. Check availability and the current date with the studio. No place has been reserved.</p><a href="mailto:hello@offsetclub.co.uk?subject=${encodeURIComponent(button.dataset.workshop)}">Open workshop enquiry email ↗</a>`;
    dialog.showModal();
}));
