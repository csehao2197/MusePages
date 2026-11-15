const paths =
[
    ["Figma", "M9 3H6a3 3 0 0 0 0 6h3m0-6h3a3 3 0 0 1 0 6H9m0-6v15a3 3 0 1 1-3-3h3m0-6H6a3 3 0 0 0 0 6h3m3-6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"],
    ["Framer", "M5 3h14v6h-7l7 6h-7v6l-7-6V9h7Z"],
    ["Palette", "M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-4c-2-1 0-3 2-3h1a4 4 0 0 0 3-4c0-4-4-7-9-7ZM7 9h.01M10 6h.01M15 7h.01M6 13h.01"],
    ["Pen tool", "m12 3 8 8-7 9-9-9Zm0 0v9m-3 3 6-6"],
    ["Layers", "m12 3 10 5-10 5L2 8Zm-10 10 10 5 10-5M2 18l10 5 10-5"],
    ["Typography", "M3 5h18M12 5v15M8 20h8M3 5v4m18-4v4"],
    ["Aperture", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM6 5l10 17M3 15h19M7 22 17 4"],
    ["Chrome", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 8h8M8 12 4 5m10 11-4 5"],
    ["Camera", "M3 7h4l2-3h6l2 3h4v14H3Zm13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"],
    ["Brush", "m8 14 9-11 4 4-11 9m-2-2c-4-1-2 5-6 6 8 3 10-3 6-6Z"],
    ["Box", "m12 2 10 5v10l-10 5-10-5V7Zm0 10 10-5M2 7l10 5v10"],
    ["Wand", "m4 20 13-13 3 3L7 23Zm9-9 3 3M5 2v6M2 5h6M19 1v4m-2-2h4"]
];
function renderTools(selector, tools)
{
    const row = document.querySelector(selector);
    [...tools, ...tools].forEach(([name, d], index) =>
    {
        const button = document.createElement("button");
        button.className = "liquid-glass";
        button.type = "button";
        button.setAttribute("aria-label", `About ${name}`);
        if (index >= tools.length) button.tabIndex = -1;
        button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
        button.addEventListener("click", () =>
        {
            document.querySelector("#copy-status").textContent = `${name} — part of my everyday visual design toolkit.`;
        });
        row.append(button);
    });
}
renderTools(".first-row", paths.slice(0, 8));
renderTools(".second-row", [paths[8], paths[9], paths[10], paths[11], paths[0], paths[1], paths[5], paths[4]]);
const dialog = document.querySelector("dialog");
document.querySelectorAll("[data-contact]").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    document.querySelector("#draft").textContent = `Draft for ${data.get("name")}: ${data.get("idea")} — Ready to discuss at hi@maxreed.com. Nothing has been sent or stored.`;
});
document.querySelector("#copy-email").addEventListener("click", async () =>
{
    try
    {
        await navigator.clipboard.writeText("hi@maxreed.com");
        document.querySelector("#copy-status").textContent = "Email copied: hi@maxreed.com";
    }
    catch
    {
        document.querySelector("#copy-status").textContent = "Copy manually: hi@maxreed.com";
    }
});
document.querySelector("#pause-tools").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Play tools ▷" : "Pause tools Ⅱ";
});
