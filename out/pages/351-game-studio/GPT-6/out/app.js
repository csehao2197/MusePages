const games =
{
    bridge: ["ROPE", "A climbing game with no combat and one very long bridge.", "PC, SWITCH, PS5. MARCH 2025."],
    tide: ["TIDEHOLD", "Maintaining an underwater station while it slowly floods.", "PC, XBOX. NOVEMBER 2023."],
    snow: ["LAST BUS TO VELKA", "A snowbound village, one night, eleven conversations.", "PC. JUNE 2022."]
};
let selected = "bridge";
function selectGame(key)
{
    selected = key;
    document.querySelectorAll("[data-game]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.game === key)));
    document.querySelector("#game-art use").setAttribute("href", `#${key}`);
    document.querySelector("#game-art").setAttribute("aria-label", `${games[key][0]} key art`);
    document.querySelector("#game-meta").textContent = games[key][2];
    document.querySelector("#game-details").textContent = `Explore ${games[key][0]} ↗`;
}
document.querySelectorAll("[data-game]").forEach((button) =>
{
    ["mouseenter", "focus", "click"].forEach((event) => button.addEventListener(event, () => selectGame(button.dataset.game)));
});
document.querySelector("#game-details").addEventListener("click", () =>
{
    const game = games[selected];
    document.querySelector("#detail-title").textContent = game[0];
    document.querySelector("#detail-copy").textContent = game[1];
    document.querySelector("#detail-platforms").textContent = game[2];
    document.querySelector("#store-link").href = `https://store.steampowered.com/search/?term=${encodeURIComponent(game[0])}`;
    document.querySelector("#game-dialog").showModal();
});
const team = [["MAUD FERRIS", "Creative director"], ["TOBY ANAND", "Studio lead"], ["SOFIA KLEIN", "Lead engineer"], ["JONAH PRICE", "Engine and tools"], ["AMARA OBI", "Gameplay engineer"], ["RUAIRI DOYLE", "Art director"], ["ELSA BERG", "Environment art"], ["KIT NAKAMURA", "Character art"], ["PAVEL RUZICKA", "Animation"], ["NORA HALL", "Audio and music"], ["DANIEL OKE", "Production"]];
document.querySelector("#credits").innerHTML = team.map(([name, role]) => `<div class="credit">${name}<span>${role.toUpperCase()}</span></div>`).join("");
const portrait = document.querySelector("#portrait");
document.querySelectorAll(".credit").forEach((row) =>
{
    row.addEventListener("pointermove", (event) =>
    {
        portrait.classList.add("visible");
        portrait.style.left = `${Math.min(innerWidth - 120, event.clientX + 18)}px`;
        portrait.style.top = `${Math.min(innerHeight - 160, event.clientY + 10)}px`;
    });
    row.addEventListener("pointerleave", () => portrait.classList.remove("visible"));
});
const principles = [["Eleven people, and that is the ceiling.", "Every person we add makes the game slower before it makes it better."], ["One game at a time.", "No side projects, no contract work, no ports handled in house."], ["No crunch, and we mean the boring version.", "Thirty five hour weeks, tracked. Two people are part time and always will be."], ["We publish ourselves.", "Slower, smaller, and nobody asks us to add a battle pass."]];
document.querySelector("#principles").innerHTML = principles.map(([title, copy], i) => `<article><h3><span class="meta">${String(i + 1).padStart(2, "0")} / </span>${title}</h3><p>${copy}</p></article>`).join("");
const press = [["Eurogamer", "A game that trusts you to be bored for ten minutes.", "2025"], ["Edge", "8 out of 10.", "2025"], ["BAFTA Games", "Nominated, Original Property.", "2024"], ["IGF", "Honourable mention, Excellence in Narrative.", "2023"], ["Rock Paper Shotgun", "The best thing we played all November.", "2023"], ["Develop:Brighton", "Indie Studio of the Year, shortlist.", "2023"]];
document.querySelector("#press-list").innerHTML = press.map(([name, quote, year]) => `<div class="press-row"><strong>${name}</strong><span>${quote}</span><small class="meta">${year}</small></div>`).join("");
document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.open).showModal()));
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelector("#ask-role").addEventListener("click", () =>
{
    document.querySelector("#jobs-dialog").close();
    document.querySelector("#question-dialog").showModal();
});
document.querySelector("#download").addEventListener("click", () =>
{
    const url = URL.createObjectURL(new Blob(["NINEFOLD\nFictional studio concept\nEleven people. Bristol. One game at a time.\nROPE / TIDEHOLD / LAST BUS TO VELKA\nOriginal illustration and browser-only demonstration. Press claims and jobs are illustrative."], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ninefold-fact-sheet.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#download-status").textContent = "Fact sheet prepared locally. No external files requested.";
});
document.querySelector("#question").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector("#question-result");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter a valid email address.";
        return;
    }
    if (form.elements.message.value.trim().length < 10)
    {
        result.textContent = "Please write a question of at least 10 characters.";
        return;
    }
    result.textContent = `Preview ready for ${form.elements.email.value.trim()}. Your question is ${form.elements.message.value.trim().length} characters. Nothing sent or saved.`;
});
addEventListener("scroll", () => document.querySelector("#nav").classList.toggle("solid", scrollY > 80), { passive: true });
