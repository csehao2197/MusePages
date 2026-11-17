import { content, pageMarkup } from "./content.js";
import { scene } from "./pixelart.js";
import { createScores } from "./scores.js";
import { createRunner } from "./game/runner.js";
import { wireInput } from "./game/input.js";

document.body.innerHTML = pageMarkup;
const scores = createScores();
const scoreDialog = document.querySelector("#score-dialog");
let pendingScore = 0;
const game = await createRunner((score, show) =>
{
    if (show)
    {
        pendingScore = score;
        document.querySelector("#final-score").textContent = `${String(score).padStart(5, "0")} ${content.messages.finalScore}`;
        document.querySelector("#initials").value = "";
        scoreDialog.showModal();
        document.querySelector("#initials").focus();
    }
    return scores.qualifies(score);
});
wireInput(game);

document.querySelector("#initials").addEventListener("input", (event) =>
{
    event.target.value = event.target.value.replace(/[^a-z]/gi, "").toUpperCase();
});
document.querySelector("#score-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (scores.add(document.querySelector("#initials").value.toUpperCase(), pendingScore))
    {
        pendingScore = 0;
        scoreDialog.close();
        document.querySelector('[data-action="save"]').hidden = true;
    }
});
document.querySelector("#skip-score").addEventListener("click", () => scoreDialog.close());
const confirmReset = document.querySelector("#reset-confirm");
document.querySelector("#reset-scores").addEventListener("click", () =>
{
    if (game.canvas.dataset.state === "playing") game.pause();
    confirmReset.hidden = false;
});
document.querySelector("#cancel-reset").addEventListener("click", () => confirmReset.hidden = true);
document.querySelector("#confirm-reset").addEventListener("click", () =>
{
    scores.reset();
    confirmReset.hidden = true;
});

document.querySelector("#ticker").innerHTML = [...content.ticker, ...content.ticker].map((title, index) => `<span${index >= content.ticker.length ? ' aria-hidden="true"' : ""}>${title}</span>`).join("");
document.querySelector("#studio-art").innerHTML = scene("studio");
const cards = document.querySelector("#game-cards");
const detail = document.querySelector("#game-detail");
for (const cartridge of content.games)
{
    const button = document.createElement("button");
    button.className = "cartridge";
    button.dataset.game = cartridge.id;
    button.setAttribute("aria-label", `${content.messages.explore} ${cartridge.name}`);
    button.innerHTML = `<span class="cartridge-art">${scene(cartridge.theme)}<b>${cartridge.name.replace(" ", "<br>")}</b></span><span class="cartridge-meta"><span><strong>${cartridge.category}</strong><small>${cartridge.status}</small></span><span>↗</span></span>`;
    button.addEventListener("click", () =>
    {
        if (game.canvas.dataset.state === "playing") game.pause();
        const box = document.querySelector("#detail-content");
        box.innerHTML = `<p class="eyebrow">${cartridge.category}</p><h2>${cartridge.name}</h2><p>${cartridge.description}</p><p>${cartridge.note}</p>`;
        if (cartridge.id === "dash")
        {
            const play = document.createElement("button");
            play.className = "button amber";
            play.textContent = content.messages.playCartridge;
            play.addEventListener("click", () =>
            {
                detail.close();
                document.querySelector("#arcade").scrollIntoView({ block: "center" });
                game.start();
            });
            box.append(play);
        }
        detail.showModal();
    });
    cards.append(button);
}
document.querySelector(".close-dialog").addEventListener("click", () => detail.close());
document.querySelector("#newsletter-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#newsletter-status").textContent = content.messages.subscribed;
    document.querySelector("#newsletter-form").reset();
});
