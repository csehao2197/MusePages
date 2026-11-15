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
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
const motion = document.querySelector("#motion");
motion.addEventListener("click", () =>
{
    const paused = motion.getAttribute("aria-pressed") !== "true";
    motion.setAttribute("aria-pressed", String(paused));
    motion.textContent = paused ? "Resume motion" : "Pause motion";
    document.body.classList.toggle("paused", paused);
});
const designs =
[
    ["fern", "Fern study", "Fine Line", "Marcus Kane"],
    ["rose", "Old school rose", "Traditional", "Jade Rivers"],
    ["geometry", "Sixfold geometry", "Blackwork", "Sol Mercer"],
    ["face", "Profile study", "Realism", "Marcus Kane"],
    ["stars", "Constellation", "Fine Line", "Marcus Kane"],
    ["koi", "Koi study", "Traditional", "Jade Rivers"],
    ["fox", "Geometric fox", "Blackwork", "Sol Mercer"],
    ["moth", "Night moth", "Realism", "Marcus Kane"],
    ["dagger", "Dagger and rose", "Traditional", "Jade Rivers"],
    ["script", "Gesture script", "Fine Line", "Marcus Kane"],
    ["city", "City in ink", "Blackwork", "Sol Mercer"],
    ["wolf", "Wolf study", "Realism", "Marcus Kane"],
    ["floral", "Floral portrait", "Fine Line", "Marcus Kane"],
    ["peony", "Peony study", "Traditional", "Jade Rivers"],
    ["circles", "Intersecting circles", "Blackwork", "Sol Mercer"],
    ["eagle", "Eagle study", "Realism", "Marcus Kane"]
];
let current;
const graphic = (id, title) =>
{
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 240 300");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `Original ${title} illustration`);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `art.svg#${id}`);
    svg.append(use);
    return svg;
};
function openDesign(design)
{
    current = design;
    document.querySelector("#dialog-art").replaceChildren(graphic(design[0], design[1]));
    document.querySelector("#flash-title").textContent = design[1];
    document.querySelector("#flash-description").textContent = `${design[2]} / ${design[3]}. Original concept flash, not a finished tattoo or an artist's existing portfolio. A real design requires consultation and consent.`;
    document.querySelector("#flash-dialog").showModal();
}
function renderPortfolio()
{
    const artist = document.querySelector("#artist-filter").value;
    const style = document.querySelector("#style-filter").value;
    const filtered = artist !== "all" || style !== "all";
    const visible = designs.filter((design) => (artist === "all" || design[3] === artist) && (style === "all" || design[2] === style));
    document.querySelector("#portfolio").classList.toggle("filtered", filtered);
    for (const [index, id] of ["row-one", "row-two"].entries())
    {
        const row = document.getElementById(id);
        row.replaceChildren();
        const subset = visible.filter((_, position) => position % 2 === index);
        for (const design of subset)
        {
            const button = document.createElement("button");
            button.className = "flash";
            button.setAttribute("aria-label", `View ${design[1]}`);
            button.append(graphic(design[0], design[1]));
            const label = document.createElement("span");
            label.textContent = `${design[1]} / ${design[2]}`;
            button.append(label);
            button.addEventListener("click", () => openDesign(design));
            row.append(button);
        }
        if (!filtered && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        {
            for (const button of [...row.children])
            {
                const clone = button.cloneNode(true);
                clone.dataset.clone = "true";
                clone.setAttribute("aria-hidden", "true");
                clone.inert = true;
                row.append(clone);
            }
        }
    }
    document.querySelector("#portfolio-status").textContent = `${visible.length} original ${visible.length === 1 ? "study" : "studies"} shown.`;
    document.querySelector("#portfolio-empty").hidden = visible.length !== 0;
}
document.querySelector("#artist-filter").addEventListener("change", renderPortfolio);
document.querySelector("#style-filter").addEventListener("change", renderPortfolio);
document.querySelector("#reset-filters").addEventListener("click", () =>
{
    document.querySelector("#artist-filter").value = "all";
    document.querySelector("#style-filter").value = "all";
    renderPortfolio();
});
document.querySelectorAll("[data-artist]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#artist-filter").value = button.dataset.artist;
    document.querySelector("#style-filter").value = "all";
    renderPortfolio();
    document.querySelector("#portfolio").scrollIntoView();
}));
document.querySelectorAll("[data-style]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#style-filter").value = button.dataset.style;
    document.querySelector("#artist-filter").value = "all";
    renderPortfolio();
    document.querySelector("#portfolio").scrollIntoView();
}));
document.querySelector("#close").addEventListener("click", () => document.querySelector("#flash-dialog").close());
document.querySelector("#use-design").addEventListener("click", () =>
{
    document.querySelector("#artist").value = current[3];
    document.querySelector("#idea").value = `Starting idea: ${current[1]}. I would like to discuss size and placement.`;
    document.querySelector("#flash-dialog").close();
    document.querySelector("#book").scrollIntoView();
});
document.querySelector("#consultation").addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (document.querySelector("#idea").value.trim().length < 10)
    {
        document.querySelector("#consultation-status").textContent = "Please describe your idea in at least 10 non-space characters.";
        return;
    }
    document.querySelector("#consultation-status").textContent = `Consultation draft for ${document.querySelector("#artist").value}. Nothing sent or stored; no booking or deposit created.`;
});
function downloadAftercare()
{
    const text = "INKWELL STUDIO — GENERAL CONCEPT AFTERCARE NOTES\n\nThis is a fictional studio demonstration, not individualized clinical advice or an official studio protocol.\n\nFollow the written instructions of your treating artist and the dressing manufacturer's guidance. Wash hands before touching the area. Avoid picking or scratching and discuss washing, dressings, swimming, sun and exercise timing with your artist.\n\nIncreasing pain, spreading redness, fever, discharge or other concerning symptoms need prompt medical assessment. Seek emergency help for severe symptoms. Do not rely on this page to diagnose or treat a problem.\n\nNo actual tattoo, booking or aftercare support service is provided by this website.\n";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inkwell-aftercare-notes.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector("#aftercare").addEventListener("click", downloadAftercare);
document.querySelector(".footer-download").addEventListener("click", downloadAftercare);
renderPortfolio();
