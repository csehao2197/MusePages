import { content } from "./content.js";

export function createUI(state, follow, interact)
{
    const $ = id => document.getElementById(id);
    const abort = new AbortController();
    let toastTimer;
    const on = (id, event, fn) => $(id).addEventListener(event, fn, { signal: abort.signal });
    $("quests").innerHTML = content.shrines.map(s => `<div class="quest" data-shrine="${s.id}"><span class="stamp ${s.id}" id="stamp-${s.id}"><img src="./assets/${s.icon}.svg" alt=""></span><div><h3>${s.name}</h3><p id="note-${s.id}">${s.note}</p><button class="trail" id="trail-${s.id}">Follow trail <span>↗</span></button></div></div>`).join("");
    content.shrines.forEach(s => on(`trail-${s.id}`, "click", () => follow(s.id)));
    on("temple-trail", "click", () => follow("temple"));
    on("interact", "click", interact);
    for (const id of ["help", "field-guide"]) on(id, "click", () => $("guide-dialog").showModal());
    document.querySelectorAll(".close, .close-guide").forEach(button => button.addEventListener("click", () => $("guide-dialog").close(), { signal: abort.signal }));
    on("reset", "click", () => $("reset-dialog").showModal());
    on("cancel-reset", "click", () => $("reset-dialog").close());
    function update(nearby, following)
    {
        $("count").textContent = `${state.stamps.size} / 3`;
        $("progress").style.width = `${state.stamps.size / 3 * 100}%`;
        content.shrines.forEach(s =>
        {
            const collected = state.stamps.has(s.id);
            $(`stamp-${s.id}`).classList.toggle("collected", collected);
            $(`note-${s.id}`).textContent = collected ? "Stamped. A memory for the road." : s.note;
            $(`trail-${s.id}`).setAttribute("aria-label", `Follow trail to ${s.name}`);
        });
        const open = state.stamps.size === 3;
        $("gate-note").textContent = state.completed ? "Special delivery complete." : open ? "The gate is open. Your letter awaits." : "Three stamps open the gate.";
        $("gate-icon").src = open ? "./assets/door-open.svg" : "./assets/lock-keyhole.svg";
        $("satchel").textContent = state.completed ? "A well-earned empty satchel" : state.carrying ? "One letter for the North Temple" : "Room for one special letter";
        $("save-note").textContent = state.storageAvailable ? "Stamps saved on this device" : "Storage unavailable · progress lasts this visit";
        $("sound").setAttribute("aria-pressed", String(state.sound));
        $("sound").setAttribute("aria-label", state.sound ? "Mute gentle sound" : "Enable gentle sound");
        $("sound").querySelector("img").src = state.sound ? "./assets/volume-2.svg" : "./assets/volume-x.svg";
        let label = content.action.walk;
        let disabled = true;
        let place = "Island footpath";
        if (nearby?.id === "post")
        {
            place = "Post House";
            label = state.completed ? content.action.done : state.carrying ? "Letter safely in your satchel" : content.action.pickup;
            disabled = state.carrying || state.completed;
        }
        else if (nearby?.id === "temple")
        {
            place = "North Temple";
            label = state.completed ? content.action.done : open ? content.action.deliver : content.action.gate;
            disabled = true;
        }
        else if (nearby)
        {
            place = nearby.name;
            label = state.stamps.has(nearby.id) ? content.action.collected : content.action.stamp;
            disabled = state.stamps.has(nearby.id) || !state.carrying;
            if (!state.carrying && !state.completed) label = "Pick up your letter first";
        }
        $("place").textContent = place;
        $("action-label").textContent = label;
        $("interact").disabled = disabled;
        $("travel-state").textContent = following ? "Following the trail · move to wander" : state.completed ? "Delivery complete. Stay a little longer." : !state.carrying ? "Your first letter is waiting." : "A good day to get a little lost.";
    }
    function toast(message)
    {
        clearTimeout(toastTimer);
        $("toast").textContent = message;
        $("toast").classList.add("visible");
        toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 4000);
    }
    return {
        $, on, update, toast,
        dispose()
        {
            abort.abort();
            clearTimeout(toastTimer);
        }
    };
}
