const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    document.querySelector("#nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("#nav").classList.remove("open");
}));
const sermons =
[
    ["When Waiting Is the Work", "Dana Whitfield · Feb 2 · Sample reflection", "Waiting can feel like empty time. The Psalms make room for a different question: what can attention, honesty and the company of others make possible while the answer is still unclear?"],
    ["The Honest Complaint", "Dana Whitfield · Jan 26 · Sample reflection", "Lament is not a polished performance. It gives grief a language and gives a community a reason to listen before it offers an answer."],
    ["Nobody Prays in a Straight Line", "Marcus Ibe · Jan 19 · Sample reflection", "Some days prayer is a sentence. Some days it is silence. A life of faith can hold both, without pretending that one day is more worthy than another."],
    ["What the Psalms Do With Anger", "Dana Whitfield · Jan 12 · Sample reflection", "Anger can be named without making it a command. An honest community can listen, make room for hurt and still choose care over harm."],
    ["Beginning in the Middle", "Dana Whitfield · Jan 5 · Sample reflection", "We rarely begin with a clean page. We arrive carrying a story. Grace invites us to start here, with the people and questions already in the room."]
];
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const matches = sermons.filter((sermon) => sermon.join(" ").toLowerCase().includes(query));
    document.querySelector("#sermon-list").innerHTML = matches.map(([title, meta, text]) => `<details class="sermon"><summary>${title}<small>${meta}</small></summary><p>${text}</p></details>`).join("");
    document.querySelector("#empty").hidden = matches.length > 0;
}
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    render();
});
document.querySelector("#group-filter").addEventListener("change", (event) =>
{
    let count = 0;
    document.querySelectorAll("[data-day]").forEach((group) =>
    {
        group.hidden = event.target.value !== "All gatherings" && event.target.value !== group.dataset.day;
        if (!group.hidden) count++;
    });
    document.querySelector("#group-count").textContent = `${count} gathering${count === 1 ? "" : "s"} shown`;
});
const giving = document.querySelector("#giving");
document.querySelector("#give").addEventListener("click", () => giving.showModal());
document.querySelector("#give-nav").addEventListener("click", () => giving.showModal());
document.querySelector("#close").addEventListener("click", () => giving.close());
document.querySelector("#visit-form").addEventListener("input", () => document.querySelector("#status").textContent = "");
document.querySelector("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const people = Number(document.querySelector("#people").value);
    const status = document.querySelector("#status");
    if (!Number.isInteger(people) || people < 1 || people > 12)
    {
        status.textContent = "Choose 1–12 people for this personal plan. Contact the team about larger groups.";
        return;
    }
    const service = document.querySelector("#service").value;
    const coffee = document.querySelector("#coffee").checked;
    const arrival = coffee ? (service === "9:00 AM" ? "8:30 AM" : "10:30 AM") : service;
    status.textContent = `Your personal plan: ${people} ${people === 1 ? "person" : "people"}, ${service} service. Arrive around ${arrival}${coffee ? " for coffee" : ""}. ${document.querySelector("#family").value}. Use the west lot and glass entrance. Nothing sent or reserved; no sign-up is needed.`;
});
render();
