const $ = (s) => document.querySelector(s);
const products = [
    ["Bothy", "Peat smoke · birch tar · oakmoss", "Woods", 34, "A sheltered room after a long, wet walk. Smoky, grounded and quietly resinous."],
    ["Fig Terrace", "Fig leaf · warm stone · white tea", "Florals", 34, "Green fig leaves soften into warm stone and a delicate white-tea finish."],
    ["Library", "Old paper · cedarwood · tonka", "Woods", 34, "A well-read room. Dry cedar, warm paper and the rounded comfort of tonka."],
    ["Leith Harbour", "Sea salt · driftwood · sage", "Woods", 34, "Salt air meets weathered wood with a clean, herbal lift."],
    ["Glasshouse", "Tomato vine · basil · wet earth", "Kitchen", 34, "The greenest hour of the day. Crushed tomato leaf, fresh basil and rain-wet soil."],
    ["Midwinter", "Pine needle · clove · blood orange", "Seasonal", 36, "A bright winter branch. Fresh pine, warming spice and a bitter-sweet orange peel."]
];
let family = "all";
function render()
{
    const filtered = products.map((p, i) => ({ p, i })).filter(({ p }) => family === "all" || p[2] === family);
    $("#products").innerHTML = filtered.map(({ p, i }) => `<a class="product" href="#scent-detail" data-product="${i}"><div class="product-image"><img src="candle.svg" alt="Illustrated amber jar for ${p[0]}; shared product-form artwork"></div><h3>${p[0]} <span>£${p[3]}</span></h3><p>${p[1]}</p><small>55 HOURS / EXPLORE SCENT ↗</small></a>`).join("");
    $("#filter-status").textContent = family === "all" ? "Six bestsellers from the wider collection." : `${filtered.length} ${family.toLowerCase()} bestseller${filtered.length === 1 ? "" : "s"} shown from the full collection.`;
    document.querySelectorAll("[data-family]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.family === family));
}
document.querySelectorAll("[data-family]").forEach((button) => button.addEventListener("click", () =>
{
    family = button.dataset.family;
    render();
    $("#candles").scrollIntoView();
}));
$("#all").addEventListener("click", () =>
{
    family = "all";
    render();
});
$("#products").addEventListener("click", (event) =>
{
    const link = event.target.closest("[data-product]");
    if (!link) return;
    const p = products[Number(link.dataset.product)];
    $("#scent-detail").hidden = false;
    $("#detail-family").textContent = p[2];
    $("#detail-name").textContent = p[0];
    $("#detail-notes").textContent = p[1];
    $("#detail-copy").textContent = p[4];
    $("#detail-price").textContent = `£${p[3]}`;
    $("#product-link").href = `mailto:hello@emberandwick.example?subject=${encodeURIComponent(`${p[0]} candle enquiry`)}`;
});
const trio = new Set();
$("#trio-choices").innerHTML = products.map((p, i) => `<button data-trio="${i}" aria-pressed="false">${p[0]}</button>`).join("");
$("#trio-choices").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-trio]");
    if (!button) return;
    const index = Number(button.dataset.trio);
    if (trio.has(index)) trio.delete(index);
    else if (trio.size === 3)
    {
        $("#trio-status").textContent = "Three scents selected. Remove one before choosing another.";
        return;
    }
    else trio.add(index);
    document.querySelectorAll("[data-trio]").forEach((item) => item.setAttribute("aria-pressed", trio.has(Number(item.dataset.trio))));
    const names = [...trio].map((i) => products[i][0]);
    $("#trio-status").textContent = `${trio.size} of 3 chosen${names.length ? `: ${names.join(", ")}` : ""}.`;
    $("#trio-link").textContent = trio.size === 3 ? "Ask about your Trio ↗" : "Choose three scents above ↗";
    $("#trio-link").href = trio.size === 3 ? `mailto:hello@emberandwick.example?subject=Trio%20enquiry&body=${encodeURIComponent(`My chosen scents: ${names.join(", ")}. Please confirm availability and delivery. Nothing purchased on the demo website.`)}` : "#trio-choices";
});
$("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    $("#newsletter-status").textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim()) ? "Email format looks good. Demo only: no subscription created and nothing stored or sent." : "Please enter a valid email address.";
});
$("#email").addEventListener("input", () => $("#newsletter-status").textContent = "Demo only. No subscription will be stored or sent.");
if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    let x = innerWidth * .65, y = 300, targetX = x, targetY = y;
    addEventListener("pointermove", (event) =>
    {
        targetX = event.clientX;
        targetY = event.clientY;
    });
    function glow()
    {
        x += (targetX - x) * .09;
        y += (targetY - y) * .09;
        $("#candlelight").style.setProperty("--x", `${x}px`);
        $("#candlelight").style.setProperty("--y", `${y}px`);
        requestAnimationFrame(glow);
    }
    glow();
}
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
render();
