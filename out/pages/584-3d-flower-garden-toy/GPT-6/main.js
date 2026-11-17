import "./fonts.js";
import { content } from "./content.js";
import { UI } from "./ui.js";
import { Garden } from "./garden/Garden.js";

document.title = `${content.brand} — an interactive flower garden`;
export const state =
{
    selectedFlower: 0,
    wind: 35,
    clumps: [],
    camera: null,
    helpOpen: false,
    resetOpen: false,
    toast: ""
};
export const ui = new UI(document.querySelector("#app"), state);
export let garden;
try
{
    garden = new Garden(document.querySelector("#stage"), state, ui);
    ui.garden = garden;
}
catch (error)
{
    const fallback = document.createElement("p");
    fallback.className = "fallback";
    fallback.textContent = content.labels.fallback;
    document.querySelector("#stage").append(fallback);
    for (const control of document.querySelectorAll(".dock button, .dock input, #reset-open"))
    {
        control.disabled = true;
    }
    console.error(error);
}
