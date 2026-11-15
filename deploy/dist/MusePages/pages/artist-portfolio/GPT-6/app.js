const works =
[
    ["Dissolution I", "Oil on linen", "200 × 160 cm", 2025, "#cec4a6", "#a24f30", "#353c37"],
    ["Meridian Blue", "Oil and wax on canvas", "180 × 140 cm", 2024, "#a8b5b5", "#415764", "#bd9052"],
    ["The Threshold", "Oil on linen", "160 × 120 cm", 2024, "#d2c9b9", "#6f7067", "#a47853"],
    ["Night Archive", "Oil on canvas", "240 × 180 cm", 2024, "#312e32", "#713f43", "#b9a89a"],
    ["Hakodate (Winter)", "Oil on linen", "200 × 140 cm", 2023, "#d9d9cc", "#a1afac", "#c4b799"],
    ["Evidence I", "Oil on panel", "60 × 50 cm", 2023, "#d1b785", "#996d3e", "#c9c1ae"],
    ["Interruption", "Acrylic on canvas", "160 × 120 cm", 2023, "#b34e34", "#246c6d", "#d0b77d"],
    ["Correspondence (I & II)", "Oil on linen", "2 × 100 × 80 cm", 2022, "#b2beb9", "#847853", "#a96541"],
    ["Stratum", "Oil and cold wax", "180 × 180 cm", 2022, "#b5ac8e", "#6c7661", "#c1a175"],
    ["Interior Grid", "Mixed media on canvas", "140 × 110 cm", 2022, "#bcb8a8", "#58675c", "#9a573d"],
    ["Study (Hands)", "Oil on panel", "40 × 30 cm", 2021, "#9fa8a3", "#ba957d", "#746b57"],
    ["Weight", "Oil on linen", "220 × 170 cm", 2021, "#333a36", "#4b5148", "#6c6551"],
    ["Dissolution IV", "Oil on linen", "240 × 180 cm", 2025, "#b9b19a", "#8d4a30", "#4b5543"]
];
let hero = 0;
let active = 0;
let medium = "All";
let expanded = false;
let paused = false;
const $ = (selector) => document.querySelector(selector);
function art(index)
{
    const w = works[index];
    const seed = index + 3;
    let marks = "";
    for (let n = 0; n < 21; n++)
    {
        const x = (n * 67 + seed * 31) % 760;
        const y = (n * 113 + seed * 61) % 530;
        const color = [w[5], w[6], "#e1d6b8", "#645e48"][n % 4];
        marks += `<path d="M${x} ${y} q${-110 + n * 9} ${80 - n * 5} ${80 + n * 4} ${30 - n * 5} t150 50" fill="none" stroke="${color}" stroke-width="${12 + (n % 5) * 13}" opacity="${.2 + n % 4 * .13}"/>`;
    }
    return `<svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${w[0]} — original digital painting"><defs><filter id="grain${index}"><feTurbulence type="fractalNoise" baseFrequency=".48" numOctaves="3" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><rect width="800" height="560" fill="${w[4]}"/><g>${marks}<path d="M210 530 Q320 100 380 160 T620 310 L510 480Z" fill="${w[5]}" opacity=".58"/><path d="M460 40 L310 380 610 430" fill="none" stroke="${w[6]}" stroke-width="32" opacity=".7"/><path d="M50 450 Q260 320 740 390" fill="none" stroke="#ded5bd" stroke-width="16" opacity=".7"/></g><rect width="800" height="560" fill="${w[4]}" filter="url(#grain${index})" opacity=".16"/></svg>`;
}
function showHero()
{
    $("#hero-art").innerHTML = art(hero);
    $("#hero-title").textContent = works[hero][0];
    $("#hero-medium").textContent = `${works[hero][1]} · ${works[hero][2]} · ${works[hero][3]}`;
    $("#counter").textContent = `${hero + 1} / 6`;
    $("#dots").innerHTML = works.slice(0, 6).map((w, index) => `<button aria-label="Feature ${w[0]}" aria-pressed="${index === hero}" data-slide="${index}"></button>`).join("");
}
function gallery()
{
    const filtered = works.slice(0, 12).map((w, index) => ({ w, index })).filter(({ w }) => medium === "All" || w[1].startsWith(medium));
    const visible = expanded ? filtered : filtered.slice(0, 6);
    $("#gallery").innerHTML = visible.map(({ w, index }) => `<button class="painting" data-work="${index}">${art(index)}<strong>${w[0]}</strong><small>${w[1]} · ${w[3]}</small></button>`).join("");
    $("#work-count").textContent = `${visible.length} of ${filtered.length} paintings · ${medium}`;
    $("#load").hidden = visible.length === filtered.length;
    $("#load").style.display = visible.length === filtered.length ? "none" : "block";
}
function lightbox(index)
{
    active = (index + works.length) % works.length;
    $("#lightbox-art").innerHTML = art(active);
    $("#lightbox-title").textContent = works[active][0];
    $("#lightbox-medium").textContent = `${works[active][1]} · ${works[active][2]} · ${works[active][3]}`;
    if (!$("#lightbox").open) $("#lightbox").showModal();
}
$("#next").onclick = () => { hero = (hero + 1) % 6; showHero(); };
$("#previous").onclick = () => { hero = (hero + 5) % 6; showHero(); };
$("#dots").onclick = (event) =>
{
    if (event.target.dataset.slide) { hero = Number(event.target.dataset.slide); showHero(); }
};
$(".hero").onmouseenter = () => { paused = true; };
$(".hero").onmouseleave = () => { paused = false; };
setInterval(() =>
{
    if (!paused && !$("#lightbox").open && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        hero = (hero + 1) % 6;
        showHero();
    }
}, 6000);
$("#hero-art").onclick = () => lightbox(hero);
$("#filters").onclick = (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    medium = button.dataset.medium;
    expanded = false;
    $("#filters").querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", item === button));
    gallery();
};
$("#load").onclick = () => { expanded = true; gallery(); };
document.addEventListener("click", (event) =>
{
    const work = event.target.closest("[data-work]");
    if (work) lightbox(Number(work.dataset.work));
});
$("#close").onclick = () => $("#lightbox").close();
$("#lightbox-prev").onclick = () => lightbox(active - 1);
$("#lightbox-next").onclick = () => lightbox(active + 1);
$("#lightbox").addEventListener("click", (event) =>
{
    if (event.target === $("#lightbox")) $("#lightbox").close();
});
document.addEventListener("keydown", (event) =>
{
    if ($("#lightbox").open && event.key === "ArrowRight") lightbox(active + 1);
    if ($("#lightbox").open && event.key === "ArrowLeft") lightbox(active - 1);
});
const series =
[
    ["Dissolution", "2024–2025 · 8 paintings", "An ongoing inquiry into the point at which a form stops being recognisable. Where does the figure end and the field begin?", [0, 1, 2, 12]],
    ["Night Archive", "2023–2024 · 6 paintings", "Works made after midnight. The studio at night has a different quality of silence.", [3, 11, 8, 4]],
    ["Evidence", "2021–2023 · 9 paintings", "Small-format works made as a kind of note-taking. Seen, half-seen, or remembered differently each time.", [5, 10, 4, 9]]
];
$("#series-list").innerHTML = series.map(([title, years, description, indexes]) => `<article class="series-row"><div><h3>${title}</h3><span class="eyebrow">${years}</span><p>${description}</p><button data-work="${indexes[0]}">Explore selected work ↗</button></div><div class="thumbnails">${indexes.map((index) => `<button data-work="${index}" aria-label="View ${works[index][0]}">${art(index)}</button>`).join("")}</div></article>`).join("");
$("#focus-art").innerHTML = art(12);
$("#focus-art").onclick = $("#focus-open").onclick = () => lightbox(12);
const exhibitions =
[
    [2025, "Dissolution", "Sprüth Magers", "Berlin", "Solo"],
    [2025, "The Body Electric", "Tate Modern", "London", "Group"],
    [2024, "The Edge of Documents", "Foam Museum", "Amsterdam", "Solo"],
    [2024, "New Painting Now", "ICA", "London", "Group"],
    [2024, "Night Archive", "Sadie Coles HQ", "London", "Solo"],
    [2023, "Deutsche Börse Prize Exhibition", "The Photographers’ Gallery", "London", "Group"],
    [2023, "Evidence", "STANDARD (OSLO)", "Oslo", "Solo"],
    [2022, "Stratum", "Galerie Chantal Crousel", "Paris", "Solo"],
    [2022, "Young Artists Now", "Serpentine", "London", "Group"],
    [2021, "Weight", "Fondazione Prada", "Milan", "Group"],
    [2020, "Weight", "Oslo Kunsthall", "Oslo", "Solo"],
    [2019, "Early Works", "Studio Voltaire", "London", "Group"]
];
function exhibitionList(type)
{
    $("#exhibition-list").innerHTML = exhibitions.filter((entry) => type === "All" || entry[4] === type).map(([year, title, venue, city, kind]) => `<div class="exhibition"><span>${year}</span><strong>${title}</strong><span class="venue">${venue}</span><span class="city">${city}</span><span>${kind}</span></div>`).join("");
}
$("#exhibition-tabs").onclick = (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    $("#exhibition-tabs").querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", item === button));
    exhibitionList(button.dataset.type);
};
$("#cv").onclick = () => $("#cv-dialog").showModal();
$("#cv-close").onclick = () => $("#cv-dialog").close();
$("#menu").onclick = () =>
{
    const open = $("#navigation").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#navigation").onclick = () => { $("#navigation").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
$("#enquiry").onsubmit = (event) =>
{
    event.preventDefault();
    const form = event.target;
    if (!form.elements.namedItem("name").value.trim() || !form.email.validity.valid || !form.email.value || !form.message.value.trim())
    {
        $("#form-status").textContent = "Please enter your name, a valid email and a message.";
        return;
    }
    $("#form-status").textContent = `Draft ready for ${form.type.value.toLowerCase()}. Nothing was sent; contact the studio through your email client.`;
};
showHero();
gallery();
exhibitionList("All");
