const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
const destinations = [
    { name: "Morocco", image: "morocco", season: ["Spring", "Autumn"], type: "Culture", description: "Medinas, mountain kasbahs and desert skies.", days: ["Marrakech: craft and courtyard gardens", "Atlas foothills with a local guide", "A quiet camp beneath the stars"] },
    { name: "Japan", image: "japan", season: ["Spring", "Autumn"], type: "Culture", description: "Ancient rituals, mountain temples and extraordinary everyday details.", days: ["Tokyo neighbourhoods at your pace", "Kyoto artisans and quiet temple paths", "A mountain ryokan and a slower morning"] },
    { name: "Patagonia", image: "patagonia", season: ["Winter"], type: "Adventure", description: "Southern summer. Glacial lakes. Room to breathe.", days: ["Arrive among the Patagonian lakes", "Guided trails beneath the granite towers", "Glacier viewpoints and a fireside evening"] },
    { name: "Maldives", image: "maldives", season: ["Winter"], type: "Island", description: "Barefoot days, reef colours and private island stays.", days: ["Island arrival and time to settle", "A guided reef experience, conditions permitting", "A sunset sail and an unhurried day"] },
    { name: "Iceland", image: "iceland", season: ["Summer"], type: "Adventure", description: "Black-sand coastlines, volcanic landscapes and long summer light.", days: ["Reykjavík and the geothermal coast", "Waterfalls and the south shore", "A quiet highland route with a local guide"] },
    { name: "Tanzania", image: "tanzania", season: ["Summer"], type: "Wildlife", description: "Savanna horizons and encounters that ask you to slow down.", days: ["Arrival and conservation-led camp introduction", "Guide-led wildlife drives without sighting guarantees", "A local cultural visit and departure"] }
];
const grid = document.querySelector("#destination-grid");
const season = document.querySelector("#season");
const experience = document.querySelector("#experience");
let selected = destinations[0];
function render()
{
    const matches = destinations.filter((item) => (season.value === "all" || item.season.includes(season.value)) && (experience.value === "all" || item.type === experience.value));
    grid.replaceChildren();
    for (const item of matches)
    {
        const button = document.createElement("button");
        button.className = "destination";
        button.setAttribute("aria-label", `Explore ${item.name}`);
        button.innerHTML = `<img src="art.svg#${item.image}" alt="Original ${item.name} landscape illustration"><span><strong>${item.name}</strong><small>${item.season.join(" / ")} · UK seasons</small><b>Explore ↗</b></span>`;
        button.addEventListener("click", () => openDestination(item));
        grid.append(button);
    }
    document.querySelector("#results").textContent = `${matches.length} destinations`;
    document.querySelector("#empty").hidden = matches.length > 0;
}
season.addEventListener("change", render);
experience.addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    season.value = "all";
    experience.value = "all";
    render();
});
const dialog = document.querySelector("#destination-dialog");
function openDestination(item)
{
    selected = item;
    document.querySelector("#destination-title").textContent = item.name.toUpperCase();
    document.querySelector("#destination-art").src = `art.svg#${item.image}`;
    document.querySelector("#destination-description").textContent = item.description;
    document.querySelector("#itinerary").replaceChildren(...item.days.map((day) =>
    {
        const li = document.createElement("li");
        li.textContent = day;
        return li;
    }));
    dialog.showModal();
}
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#choose").addEventListener("click", () =>
{
    document.querySelector("#destination").value = selected.name;
    dialog.close();
    document.querySelector("#planning").scrollIntoView();
});
let brief = "";
const form = document.querySelector("#trip-form");
const download = document.querySelector("#download");
form.addEventListener("input", () =>
{
    brief = "";
    download.hidden = true;
    document.querySelector("#trip-status").textContent = "";
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const dream = document.querySelector("#dream").value.trim();
    if (dream.length < 15)
    {
        document.querySelector("#trip-status").textContent = "Describe your dream in at least 15 non-space characters.";
        return;
    }
    brief = `MERIDIAN LOCAL PLANNING BRIEF\nDestination: ${document.querySelector("#destination").value}\nTravellers: ${document.querySelector("#travellers").value}\nMonth: ${document.querySelector("#month").value}\nDream: ${dream}\nDemonstration only. No booking, quote or message sent.`;
    document.querySelector("#trip-status").textContent = `${document.querySelector("#destination").value} · ${document.querySelector("#travellers").value} travellers. Brief ready. Nothing sent or booked. Download your local copy below.`;
    download.hidden = false;
});
download.addEventListener("click", () =>
{
    if (!brief) return;
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "meridian-planning-brief.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
