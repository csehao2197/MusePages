const checks = [...document.querySelectorAll('input[type="checkbox"]')];
const simulate = document.querySelector("#simulate");
const result = document.querySelector("#result");
let mode = "existing";
function update()
{
    const ready = checks.filter((check) => check.checked).length;
    document.querySelector("#progress").textContent = `${ready} of 3 ready`;
    simulate.disabled = ready !== 3;
    result.textContent = ready === 3 ? "Ready for a safe local simulation." : "Complete the three safety checks to continue.";
}
checks.forEach((check) => check.addEventListener("change", update));
document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () =>
{
    mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((tab) =>
    {
        tab.classList.toggle("active", tab === button);
        tab.setAttribute("aria-pressed", String(tab === button));
    });
    document.querySelector("#strategy").textContent = mode === "existing" ? "Keep what you’ve built." : "Start with a clean slate.";
    document.querySelector("#description").textContent = mode === "existing" ? "Mark a one-time baseline as applied. Existing tables and records stay untouched." : "Generate the initial schema, then apply it to an empty sample database.";
    document.querySelector("#commands").textContent = mode === "existing" ? "baseline: mark as applied\n+ preserve all existing tables\n+ future migrations enabled" : "pnpm db:drizzle:generate --name init\npnpm db:drizzle:migrate";
    document.querySelector("#notice").textContent = mode === "existing" ? "Existing production: baseline first, migrate later." : "Fresh mode is only for a confirmed empty database.";
    update();
}));
document.querySelector("#inspect").addEventListener("click", () =>
{
    const schema = document.querySelector("#schema");
    schema.hidden = !schema.hidden;
});
simulate.addEventListener("click", () =>
{
    if (checks.every((check) => check.checked))
    {
        result.textContent = mode === "existing" ? "Simulation complete: baseline marked. 0 records changed." : "Simulation complete: initial schema applied to empty sample.";
    }
});
