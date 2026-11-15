const params = new URLSearchParams(location.search);
let category = ["all","dogs","cats","small","birds"].includes(params.get("pet")) ? params.get("pet") : "all";
const search = document.querySelector("#search");
function filter()
{
    const term = search.value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll(".products article").forEach((article) =>
    {
        const visible = (category === "all" || article.dataset.category === category) && article.dataset.search.includes(term);
        article.hidden = !visible;
        if (visible) count++;
    });
    document.querySelectorAll("[data-filter]").forEach((link) => link.setAttribute("aria-current", String(link.dataset.filter === category)));
    document.querySelector("#count").textContent = `${count} product preview${count === 1 ? "" : "s"}`;
    document.querySelector("#empty").hidden = count !== 0;
}
document.querySelectorAll('a[href*="?pet="]').forEach((link) => link.addEventListener("click", (event) =>
{
    event.preventDefault();
    category = new URL(link.href).searchParams.get("pet");
    search.value = "";
    history.pushState(null, "", `?pet=${category}#shop`);
    filter();
    document.querySelector("#shop").scrollIntoView();
    closeMenu();
}));
search.addEventListener("input", filter);
document.querySelector("#reset-filters").addEventListener("click", () =>
{
    category = "all";
    search.value = "";
    history.replaceState(null, "", "?pet=all#shop");
    filter();
});
window.addEventListener("popstate", () =>
{
    category = new URLSearchParams(location.search).get("pet") || "all";
    filter();
});
filter();
const products =
{
    rope:["Tough Tug Rope","Recycled cotton, survives the terriers.","£9"],
    kibble:["Grain-Free Salmon Kibble","Made in Somerset, 2kg bag. This sample listing does not establish suitability for allergies or any pet's medical needs.","£18"],
    wand:["Feather Wand Teaser","The one cats actually chase.","£6"],
    lead:["Waxed Canvas Lead","Brass clip, lasts for years.","£24"]
};
const dialog = document.querySelector("#detail");
function show(title, label, copy, price = "")
{
    document.querySelector("#detail-title").textContent = title;
    document.querySelector("#detail-label").textContent = label;
    document.querySelector("#detail-copy").textContent = copy;
    document.querySelector("#detail-price").textContent = price;
    dialog.showModal();
}
function openProduct(key)
{
    if (!products[key]) return;
    const [name,copy,price] = products[key];
    show(name, "SHOP PREVIEW · NOT LIVE INVENTORY", copy, price);
}
document.querySelectorAll('a[href*="?product="]').forEach((link) => link.addEventListener("click", (event) =>
{
    event.preventDefault();
    const key = new URL(link.href).searchParams.get("product");
    history.pushState(null, "", `?product=${key}#shop`);
    openProduct(key);
}));
if (params.has("product")) openProduct(params.get("product"));
document.querySelector("#close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => history.replaceState(null, "", `?pet=${category}#shop`));
document.querySelector("#detail-visit").addEventListener("click", () =>
{
    dialog.close();
    document.querySelector("#visit").scrollIntoView();
});
const info =
{
    delivery:["Heavy bags? We'll do the lifting.","The fictional offer is free local delivery on orders over £30 within three miles of the shop. Smaller orders, delivery slots and address eligibility need direct confirmation. No delivery service is connected."],
    loyalty:["One stamp closer.","The brief describes a paper stamp card: your tenth bag of food is free. Eligible food lines, bag sizes and redemption terms require in-store confirmation. This demo issues no stamps, rewards or accounts."],
    instagram:["Find the real profile first.","A verified Instagram URL was not supplied for this fictional shop. No real social account is impersonated."]
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () => show(info[button.dataset.info][0], "GOOD TO KNOW · DEMONSTRATION", info[button.dataset.info][1])));
document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-size]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    const size = button.dataset.size;
    document.querySelector("#wash-note").textContent = `${size[0].toUpperCase()+size.slice(1)} dog wash · £${{ small:10,medium:13,large:16 }[size]}, illustrative in-store price. No appointment booked.`;
}));
document.querySelector("#copy-address").addEventListener("click", async () =>
{
    const address = "Good Boy Supply Co., 88 North Street, Bristol BS3 1HJ";
    document.querySelector("#copy-result").textContent = "Copying address…";
    try
    {
        await Promise.race([
            navigator.clipboard.writeText(address),
            new Promise((resolve, reject) => setTimeout(() => reject(new Error("Clipboard unavailable")), 1200))
        ]);
        document.querySelector("#copy-result").textContent = "Address copied. Fictional destination; verify before travel.";
    }
    catch
    {
        document.querySelector("#copy-result").textContent = `Copy manually: ${address}`;
    }
});
const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
});
nav.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
