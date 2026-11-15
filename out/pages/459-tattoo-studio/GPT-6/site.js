const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.addEventListener("click", () =>
{
    navigation.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const categories = ["Black & Grey", "Fine Line", "Japanese", "Geometric"];
const names = ["Night garden", "Wild stem", "Dragon tide", "Sacred circle", "Shadow bloom", "Quiet fern", "Red crane", "Orbit", "Nocturne", "Serpent study", "Koi current", "Solstice"];
const gallery = document.querySelector("#gallery");
for (let index = 0; index < 12; index++)
{
    const button = document.createElement("button");
    button.className = "study";
    button.dataset.category = categories[index % 4];
    button.setAttribute("aria-label", `View ${names[index]}`);
    button.innerHTML = `<img src="art.svg" alt="${names[index]} original illustrative concept" style="filter:hue-rotate(${index * 19}deg);object-position:${index * 8}% center"><span>${categories[index % 4]} / ${names[index]}</span>`;
    button.addEventListener("click", () => openArt(names[index], ""));
    gallery.append(button);
}
function filter(style)
{
    for (const button of document.querySelectorAll("[data-filter]"))
    {
        const active = button.dataset.filter === style;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    }
    let count = 0;
    for (const study of gallery.children)
    {
        study.hidden = style !== "All" && study.dataset.category !== style;
        study.style.display = study.hidden ? "none" : "block";
        if (!study.hidden) count++;
    }
    document.querySelector("#gallery-status").textContent = `${count} studies`;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => filter(button.dataset.filter)));
const dialog = document.querySelector("#art-dialog");
let selectedArtist = "";
function openArt(title, artist)
{
    selectedArtist = artist;
    document.querySelector("#art-title").textContent = title;
    dialog.showModal();
}
document.querySelectorAll("[data-artist]").forEach((button) => button.addEventListener("click", () =>
{
    filter(button.dataset.style);
    document.querySelector("#style").value = button.dataset.style;
    openArt(button.dataset.artist, button.dataset.artist);
}));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("#choose-artist").addEventListener("click", () =>
{
    dialog.close();
    document.querySelector("#idea").value = selectedArtist ? `I'd like to discuss a piece with ${selectedArtist}. ` : `Inspired by ${document.querySelector("#art-title").textContent}. `;
    document.querySelector("#booking").scrollIntoView();
});
const reference = document.querySelector("#reference");
reference.addEventListener("change", () =>
{
    const file = reference.files[0];
    const invalid = file && (!["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024);
    reference.setCustomValidity(invalid ? "Choose a JPG or PNG up to 10 MB." : "");
    document.querySelector("#file-status").textContent = invalid ? "Choose a JPG or PNG up to 10 MB." : file ? `${file.name} — selected locally, not uploaded.` : "No file selected.";
});
document.querySelector("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const valid = document.querySelector("#idea").value.trim().length >= 10 && document.querySelector("#name").value.trim().length > 0;
    document.querySelector("#enquiry-status").textContent = valid ? "Enquiry preview ready. Nothing sent or stored; contact the studio directly to discuss availability." : "Please enter your name and at least 10 non-space characters describing your idea.";
});
