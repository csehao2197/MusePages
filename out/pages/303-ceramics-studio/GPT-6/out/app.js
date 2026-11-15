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
const sessions =
[
    ["15 Jan 2027", "Wheel Throwing", 4, 75],
    ["18 Jan 2027", "Hand Building", 6, 65],
    ["22 Jan 2027", "Wheel Throwing", 2, 75],
    ["25 Jan 2027", "Glazing & Firing", 3, 45],
    ["29 Jan 2027", "Wheel Throwing", 0, 75],
    ["1 Feb 2027", "Hand Building", 5, 65],
    ["5 Feb 2027", "Wheel Throwing", 6, 75],
    ["8 Feb 2027", "Glazing & Firing", 0, 45]
];
let selected = null;
const filter = document.querySelector("#filter");
const dialog = document.querySelector("#booking");
function render()
{
    const matches = sessions.map((session, index) => ({ session, index })).filter(({ session }) => (filter.value === "All workshops" || filter.value === session[1]) && (!document.querySelector("#available").checked || session[2] > 0));
    document.querySelector("#sessions").innerHTML = matches.map(({ session: s, index }) => `<article class="session"><time>${s[0]}</time><h3>${s[1]}</h3><span>${s[2] ? `${s[2]} sample spaces` : "Sample session full"}</span><button data-session="${index}" ${s[2] ? "" : "disabled"}>${s[2] ? "Plan visit ↗" : "Full"}</button></article>`).join("");
    document.querySelector("#empty").hidden = matches.length > 0;
}
filter.addEventListener("change", render);
document.querySelector("#available").addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    filter.value = "All workshops";
    document.querySelector("#available").checked = false;
    render();
});
document.querySelectorAll("[data-class]").forEach((button) => button.addEventListener("click", () =>
{
    filter.value = button.dataset.class;
    render();
    document.querySelector("#schedule").scrollIntoView();
}));
document.querySelector("#sessions").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-session]");
    if (!button) return;
    selected = sessions[Number(button.dataset.session)];
    if (!selected[2]) return;
    document.querySelector("#form").reset();
    document.querySelector("#class-name").textContent = selected[1];
    document.querySelector("#session-date").textContent = `${selected[0]} · ${selected[2]} sample spaces`;
    document.querySelector("#people").max = selected[2];
    document.querySelector("#status").textContent = "";
    update();
    dialog.showModal();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
function update()
{
    const count = Number(document.querySelector("#people").value);
    document.querySelector("#total").textContent = `${Number.isInteger(count) && count > 0 ? `£${count * selected[3]}` : "Choose people"} · plan estimate`;
}
document.querySelector("#people").addEventListener("input", update);
document.querySelector("#form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const say = (text) => document.querySelector("#status").textContent = text;
    const count = Number(document.querySelector("#people").value);
    if (!Number.isInteger(count) || count < 1 || count > selected[2]) return say(`Choose 1–${selected[2]} people for this sample session.`);
    if (!document.querySelector("#name").value.trim()) return say("Please add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value)) return say("Enter a valid email address.");
    if (!document.querySelector("#accept").checked) return say("Acknowledge this is a sample plan.");
    say(`${selected[1]}, ${selected[0]}, ${count} people: £${count * selected[3]}. Nothing reserved, charged or sent. Email the studio to confirm a real date.`);
});
document.querySelector("#commission-type").addEventListener("change", (event) =>
{
    document.querySelector("#commission-link").href = `mailto:hello@clayandform.co.uk?subject=${encodeURIComponent(`Commission: ${event.target.value}`)}`;
});
render();
