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
try
{
    if (!sessionStorage.getItem("lyric-curtain") && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        document.body.classList.add("opening");
        setTimeout(() => document.body.classList.remove("opening"), 1800);
    }
    sessionStorage.setItem("lyric-curtain", "seen");
}
catch
{
    document.body.classList.remove("opening");
}
const production = document.querySelector("#production");
const productions = { "The Glass Menagerie": "Until 31 October · Drama", "Company": "6 November – 10 January · Musical", "A Christmas Carol": "1–30 December · Family", "Funny Peculiar": "Sundays in November · Comedy" };
function updateProduction()
{
    document.querySelector("#ticket-info").textContent = `${production.value} — ${productions[production.value]}. Sample programme; dates and availability require box-office confirmation.`;
}
production.addEventListener("change", updateProduction);
document.querySelectorAll("[data-show]").forEach((link) => link.addEventListener("click", () =>
{
    production.value = link.dataset.show;
    updateProduction();
}));
const access = [
    { type: "captioned", show: "Company", date: "19 November · 7:30pm", label: "Captioned" },
    { type: "relaxed", show: "A Christmas Carol", date: "12 December · 2pm", label: "Relaxed" },
    { type: "audio", show: "The Glass Menagerie", date: "24 October · 2:30pm", label: "Audio-described" },
    { type: "bsl", show: "Funny Peculiar", date: "22 November · 6pm", label: "BSL-interpreted" }
];
function updateAccess()
{
    const type = document.querySelector("#access-type").value;
    const results = document.querySelector("#access-results");
    results.replaceChildren();
    for (const performance of access.filter((item) => type === "all" || item.type === type))
    {
        const article = document.createElement("article");
        article.innerHTML = `<h3>${performance.show}</h3><p>${performance.date} · ${performance.label}</p>`;
        results.append(article);
    }
}
document.querySelector("#access-type").addEventListener("change", updateAccess);
document.querySelector("#member-info").addEventListener("click", () =>
{
    document.querySelector("#member-status").textContent = "£60 annual membership — priority booking and two interval drinks per season. Information preview only; no membership purchased. Ask the box office to join.";
});
const teaser = document.querySelector("#teaser");
const captions = ["A room full of memories.", "A family held together by hope.", "The Glass Menagerie. An evening that stays with you."];
let frame = 0;
function showFrame()
{
    document.querySelector("#teaser-caption").textContent = captions[frame];
    document.querySelector("#frame-count").textContent = `Scene ${frame + 1} of 3`;
    teaser.querySelector("img").style.filter = `hue-rotate(${frame * 25}deg)`;
}
document.querySelector("#trailer").addEventListener("click", () =>
{
    frame = 0;
    showFrame();
    teaser.showModal();
});
document.querySelector("#next-frame").addEventListener("click", () =>
{
    frame = (frame + 1) % captions.length;
    showFrame();
});
document.querySelector("#close").addEventListener("click", () => teaser.close());
updateProduction();
updateAccess();
