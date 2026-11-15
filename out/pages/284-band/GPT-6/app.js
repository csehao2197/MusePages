const $ = (selector) => document.querySelector(selector);
const tracks = [["Harbour Lights", "4:08"], ["Open Water", "5:44"], ["Continental Shelf", "3:57"], ["Below the Thermocline", "6:22"], ["Wreck", "4:15"], ["Salt & Signal", "3:38"], ["The Long Coast", "7:01"], ["Lighthouse", "4:49"], ["Shore (Reprise)", "2:10"]];
const shows = [["MAY 14", "Electric Picnic Stage", "Stradbally, Ireland", "19:00 / 21:00", false], ["JUN 03", "Roundhouse", "London, UK", "20:00 / 21:30", true], ["JUL 19", "Berghain / Kantine", "Berlin, DE", "21:00 / 23:00", false], ["AUG 08", "Zenith", "Paris, FR", "19:30 / 21:00", false], ["SEP 12", "Primavera Sound", "Barcelona, ES", "18:00 / 22:30", false]];
const products = [["Open Water — Black Tee", 32, "tee"], ["Open Water — Heavyweight Hoodie", 68, "hoodie"], ["Open Water — Vinyl (180g)", 28, "vinyl"], ["Logo Cap — Black", 36, "cap"]];
const bag = [];
function open(html)
{
    $("#dialog-copy").innerHTML = html;
    if (!$("#details").open) $("#details").showModal();
}
function platforms()
{
    return `<div class="platforms"><a class="outline" target="_blank" rel="noopener" href="https://open.spotify.com/">Spotify ↗</a><a class="outline" target="_blank" rel="noopener" href="https://music.apple.com/">Apple Music ↗</a><a class="outline" target="_blank" rel="noopener" href="https://bandcamp.com/">Bandcamp ↗</a></div><p class="note">Platform homepages only. Fictional album, no band recordings or actual artist links supplied.</p>`;
}
function tour(available = false)
{
    const filtered = shows.map((show, index) => ({ show, index })).filter(({ show }) => !available || !show[4]);
    $("#shows").innerHTML = filtered.map(({ show: [date, venue, city, time, sold], index }) => `<article class="show"><div><strong>${date}</strong><small>2025</small></div><div>${venue}<small>${city}</small></div><span class="time">Doors / Show<br>${time}</span><button class="${sold ? "outline" : "solid"}" data-show="${index}" ${sold ? "disabled" : ""}>${sold ? "Sold out" : "Details"}</button></article>`).join("");
    $("#show-count").textContent = `${filtered.length} archived dates shown`;
}
$("#tour-filter").onclick = () =>
{
    const active = $("#tour-filter").getAttribute("aria-pressed") !== "true";
    $("#tour-filter").setAttribute("aria-pressed", active);
    $("#tour-filter").textContent = active ? "Show all archive dates ↗" : "Show available dates ↗";
    tour(active);
};
$("#stream").onclick = () => open(`<p class="label">3rd studio album / 2025</p><h2>OPEN WATER</h2><p>Nine tracks from the edge of the Atlantic.</p>${platforms()}`);
$("#tracks").innerHTML = tracks.map(([title, duration], index) => `<button class="track" data-track="${index}"><span>${String(index + 1).padStart(2, "0")}</span><span>${title}</span><span>${duration}</span></button>`).join("");
let waves = "";
for (let n = 0; n < 65; n++)
{
    waves += `<path d="M0 ${100 + n * 6} Q80 ${75 + n * 6 + Math.sin(n) * 10} 160 ${100 + n * 6} T320 ${104 + n * 6} T500 ${98 + n * 6}" fill="none" stroke="${n % 4 === 0 ? "#666" : "#333"}" stroke-width="${n % 5 === 0 ? 2 : 1}"/>`;
}
$("#album-art").innerHTML = `<svg viewBox="0 0 500 500" role="img" aria-label="Original ink study of waves in darkness"><rect width="500" height="500" fill="#111"/>${waves}<path d="M0 115Q180 80 500 112" fill="none" stroke="#aaa" stroke-width="1"/></svg>`;
function productArt(type)
{
    const art = type === "tee" ? `<path d="m80 80 50-25 40 12 40-12 50 25 35 70-50 24-17-32v129H110V142l-17 32-49-24Z" fill="#252525" stroke="#555"/><text x="169" y="126" text-anchor="middle" fill="#ddd" font-size="12" font-family="Arial">OPEN WATER</text>` : type === "hoodie" ? `<path d="M130 94Q104 28 170 29Q235 30 211 95l44 30 24 153h-54l-14-86v92h-87v-92l-13 86H58l27-153Z" fill="#252525" stroke="#555"/><path d="M128 95q40 35 82 0m-64-41 22 45 21-45m-46 171h55" fill="none" stroke="#777"/>` : type === "vinyl" ? `<rect x="28" y="66" width="207" height="207" fill="#292929" stroke="#555"/><path d="M40 190q70-80 185 0m-185 15q70-80 185 0m-185 15q70-80 185 0" fill="none" stroke="#888"/><circle cx="238" cy="165" r="87" fill="#080808" stroke="#555"/><circle cx="238" cy="165" r="62" fill="none" stroke="#333"/><circle cx="238" cy="165" r="22" fill="#999"/><circle cx="238" cy="165" r="3" fill="black"/>` : `<path d="M70 213Q56 90 170 90Q277 99 263 209L204 235 108 231Z" fill="#242424" stroke="#666"/><path d="M73 205q112-15 198 7 52 16 15 37-102 21-205-15Z" fill="#1b1b1b" stroke="#666"/><path d="M164 95 158 213" stroke="#555"/><text x="175" y="177" fill="#ccc" text-anchor="middle" font-size="14">IC</text>`;
    return `<svg viewBox="0 0 340 340" role="img" aria-label="Original ${type} merchandise mockup"><rect width="340" height="340" fill="#101010"/>${art}</svg>`;
}
$("#products").innerHTML = products.map(([name, price, type], index) => `<button class="product" data-product="${index}">${productArt(type)}<strong>${name}</strong><span>$${price}</span></button>`).join("");
function renderBag()
{
    open(`<h2>YOUR BAG</h2>${bag.length ? bag.map((item, index) => `<div class="bag-row"><span>${products[item.product][0]} / ${item.size}</span><button class="text" data-remove="${index}">Remove</button></div>`).join("") : "<p>Your bag is empty.</p>"}<h3>Demo total: $${bag.reduce((sum, item) => sum + products[item.product][1], 0)}</h3><p class="note">No checkout, payment or merchandise reservation. Contact booking@ironcoast.com for concept enquiries.</p>`);
}
$("#bag").onclick = renderBag;
document.addEventListener("click", (event) =>
{
    const track = event.target.closest("[data-track]");
    const show = event.target.closest("[data-show]");
    const product = event.target.closest("[data-product]");
    const add = event.target.closest("[data-add]");
    const remove = event.target.closest("[data-remove]");
    if (track)
    {
        const index = Number(track.dataset.track);
        open(`<p class="label">Track ${String(index + 1).padStart(2, "0")} / Liner notes</p><h2>${tracks[index][0]}</h2><p>${tracks[index][1]} · Open Water · 2025</p><p>An imagined movement in the record's journey from harbour to open sea. Track metadata is supplied by the brief; this note is original concept copy.</p>${platforms()}`);
    }
    if (show)
    {
        const [date, venue, city, time] = shows[Number(show.dataset.show)];
        open(`<p class="label">${date} / 2025 archive</p><h2>${venue}</h2><p>${city}</p><p>Doors / Show: ${time}</p><p>This fictional archive date has passed. No tickets are issued.</p>`);
    }
    if (product)
    {
        const index = Number(product.dataset.product);
        const clothing = ["tee", "hoodie"].includes(products[index][2]);
        open(`<p class="label">Concept merchandise</p><h2>${products[index][0]}</h2><p>$${products[index][1]}</p><label>Choose ${clothing ? "size" : "edition"}<select id="size">${(clothing ? ["Select a size", "S", "M", "L", "XL"] : ["Standard edition"]).map((size, n) => `<option value="${clothing && n === 0 ? "" : size}">${size}</option>`).join("")}</select></label><button class="solid" data-add="${index}">Add to demo bag</button><p id="product-status" role="status">Local selection only.</p>`);
    }
    if (add)
    {
        if (!$("#size").value) $("#product-status").textContent = "Choose a size first.";
        else
        {
            bag.push({ product: Number(add.dataset.add), size: $("#size").value });
            $("#bag-count").textContent = bag.length;
            $("#product-status").textContent = "Added to demo bag. Nothing purchased.";
        }
    }
    if (remove)
    {
        bag.splice(Number(remove.dataset.remove), 1);
        $("#bag-count").textContent = bag.length;
        renderBag();
    }
});
$("#close").onclick = () => $("#details").close();
$("#newsletter").onsubmit = (event) =>
{
    event.preventDefault();
    $("#status").textContent = $("#email").value && $("#email").validity.valid ? "You're on the local demo list only. No subscription was created." : "Enter a valid email address.";
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
tour();
