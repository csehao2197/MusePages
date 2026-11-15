const records = [
    ["Halcyon Tram", "Night Service", "Low Road LRR014", "LP · New", "£24.99"],
    ["The Marigold Unit", "Sun Machine", "Cassowary CAS7", "12 inch · New", "£13.50"],
    ["Ezra Fennimore Quartet", "Late Set at the Colston", "Blue Kettle BK2201", "LP · Used, VG+", "£18.00"],
    ["Pale Heron", "Geometry for Beginners", "Ferro 009", "LP · Reissue", "£27.00"],
    ["Dust Choir", "Interstate Hymns", "Wireline WL33", "2LP · Used, NM", "£32.00"]
];
const colors = ["#f06522", "#f4c13d", "#5b86f2", "#f29bb8", "#f1ece2"];
document.querySelector(".racks").innerHTML = records.map(([artist, title, label, format, price], i) => `<article class="rack"><div class="sleeve" role="img" aria-label="Original abstract sleeve for fictional ${title}" style="--sleeve:${colors[i]}"><span>${["NIGHT<br>SERVICE", "SUN<br>MACHINE", "LATE<br>SET", "GEO<br>METRY", "INTER<br>STATE"][i]}</span></div><div><h3>${artist}</h3><p>${title}</p></div><span class="mono">${label}</span><span class="mono">${format}</span><a class="price mono" href="https://www.discogs.com/search/?q=${encodeURIComponent(`${artist} ${title}`)}&type=release" target="_blank" rel="noreferrer" aria-label="Search Discogs for ${title}, sample price ${price}">${price}</a></article>`).join("");
const crates = [["SOUL AND FUNK", "1,840", "Start with the rhythm section. Soul, funk and the records that sit between."], ["JAZZ", "1,210", "From small combos to the freer corners. Ask for a listening copy."], ["DUB AND REGGAE", "960", "Heavy bass, deep cuts and room to breathe."], ["TECHNO AND HOUSE", "2,300", "Twelve inches built for a good system. Dig by label or by mood."], ["FOLK AND ODDITIES", "730", "Private press, strange stories and everything that defies a neat label."]];
document.querySelector(".crates").innerHTML = crates.map(([name, count], i) => `<button class="crate" style="--crate:${colors[i]}" data-crate="${i}" aria-pressed="false"><b>${name}</b><span class="mono">${count} records</span></button>`).join("");
document.querySelectorAll("[data-crate]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-crate]").forEach((item) => item.setAttribute("aria-pressed", item === button));
    const [name, count, text] = crates[Number(button.dataset.crate)];
    document.querySelector("#crate-info").textContent = `${name}: ${text} ${count} is an illustrative stock count, not live inventory.`;
}));
document.querySelector(".sleeve-wall").innerHTML = Array.from({ length: 12 }, (_, i) => `<div class="sleeve" role="img" aria-label="Original invented sleeve study ${i + 1}" style="--sleeve:${colors[i % 5]}"><span>${["AFTER<br>HOURS", "SLOW<br>HEAT", "SIDE<br>TWO", "DUB<br>ROOM", "NIGHT<br>BUS", "SOFT<br>GROUND", "LOW<br>CEILING", "PAPER<br>MOON", "COLD<br>WIRE", "DEEP<br>POCKET", "OTHER<br>PLACE", "LAST<br>LIGHT"][i]}</span></div>`).join("");
const dialog = document.querySelector("dialog");
function modal(html)
{
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#valuation").addEventListener("click", () =>
{
    modal('<h2>WHAT HAVE YOU GOT?</h2><p>A rough count and a description are a good start. This prepares an email enquiry, not a financial valuation.</p><form id="valuation-form"><label>Approximate number of records<input name="count" type="number" min="1" max="100000" required></label><label>Main style<select name="style"><option>Mixed collection</option><option>Jazz</option><option>Soul and funk</option><option>Dance records</option><option>Folk and oddities</option></select></label><button>Prepare enquiry</button><p id="valuation-status" role="status"></p><a id="email-valuation" hidden>Open email enquiry</a></form>');
    document.querySelector("#valuation-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.target);
        const count = Number(data.get("count"));
        document.querySelector("#valuation-status").textContent = `${count} records, ${data.get("style")}. ${count > 200 ? "Collection may be discussed under the sample service terms." : "Bring-in arrangements can be discussed."} Nothing has been appraised, sent or arranged.`;
        const link = document.querySelector("#email-valuation");
        link.href = `mailto:crates@runoutrecords.co.uk?subject=Record%20collection%20enquiry&body=${encodeURIComponent(`I have approximately ${count} records. Main style: ${data.get("style")}. Please advise about an appraisal.`)}`;
        link.hidden = false;
    });
});
document.querySelector("#newsletter").addEventListener("click", () => modal('<h2>NEW STOCK, NO NOISE.</h2><p>This static preview has no mailing list connection. Email the shop to ask about stock updates. No subscription has been created.</p><a class="button secondary" href="mailto:crates@runoutrecords.co.uk?subject=Stock%20newsletter%20enquiry">Ask about updates</a>'));
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
