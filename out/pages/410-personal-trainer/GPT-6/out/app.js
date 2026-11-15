document.querySelectorAll(".compare input").forEach((range) =>
{
    range.addEventListener("input", () =>
    {
        range.closest(".compare").style.setProperty("--position", `${range.value}%`);
        range.setAttribute("aria-valuetext", `${range.value} percent comparison divider`);
    });
});
const program = document.querySelector("#program");
const notes =
{
    personal:"Personal sessions: Prague or online. Schedule and suitability need a direct conversation.",
    online:"Online coaching preview: custom plan and weekly check-ins described in the brief; no app or coaching service is connected.",
    nutrition:"General nutrition support preview only. No restrictive diet, medical nutrition therapy or individual meal prescription is generated."
};
function update()
{
    document.querySelector("#program-note").textContent = notes[program.value];
}
program.addEventListener("change", update);
update();
document.querySelectorAll("[data-program]").forEach((button) => button.addEventListener("click", () =>
{
    program.value = button.dataset.program;
    update();
    location.hash = "contact";
}));
const form = document.querySelector("#consultation");
const result = document.querySelector("#result");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = document.querySelector("#date").value;
    const email = document.querySelector("#email");
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    if (!date || date <= today)
    {
        result.textContent = "Choose a future preferred date; this does not check availability.";
        return;
    }
    if (!email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter a valid example email address.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Confirm the adult/local-preview acknowledgement.";
        return;
    }
    result.textContent = `Local request prepared: ${program.selectedOptions[0].textContent}, ${document.querySelector("#goal").value.toLowerCase()}, ${document.querySelector("#experience").value.toLowerCase()}, preferred ${date}.\nNothing sent, booked or saved. No results or health outcomes are guaranteed.`;
});
form.addEventListener("reset", () =>
{
    result.textContent = "";
    setTimeout(update, 0);
});
const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
function close()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", close);
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") close();
});
document.querySelectorAll(".socials button").forEach((button) => button.addEventListener("click", () => document.querySelector("#social-note").textContent = `${button.textContent}: a verified account was not supplied for this fictional coach.`));
