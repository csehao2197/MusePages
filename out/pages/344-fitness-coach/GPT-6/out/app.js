document.querySelector("#format").addEventListener("change", (event) =>
{
    const format = event.target.value;
    document.querySelectorAll("[data-format]").forEach((card) => card.hidden = format !== "all" && card.dataset.format !== format);
    document.querySelector("#finder-result").textContent = format === "all" ? "Three ways to show up." : "One format matched. Explore its details below.";
});
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("[name='plan']").value = button.dataset.plan;
    document.querySelector("#start").scrollIntoView();
    document.querySelector("[name='name']").focus({ preventScroll: true });
}));
const samples =
{
    lift: [8, 8, 9, 10, 10, 11, 12, 12],
    walk: [15, 15, 18, 20, 20, 23, 25, 30],
    habit: [1, 1, 2, 2, 2, 2, 3, 3]
};
Object.entries(samples).forEach(([id, values]) =>
{
    const input = document.querySelector(`#${id}`);
    const update = () =>
    {
        const index = Number(input.value) - 1;
        document.querySelector(`#${id}-value`).textContent = values[index];
        document.querySelector(`#${id}-week`).textContent = input.value;
        document.querySelector(`#${id}-bar`).style.width = `${values[index] / values.at(-1) * 100}%`;
    };
    input.addEventListener("input", update);
    update();
});
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = event.currentTarget.elements;
    const result = document.querySelector("#call-result");
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid || fields.goal.value.trim().length < 10)
    {
        result.textContent = "Enter your name, a valid email and at least 10 characters about your goals.";
        return;
    }
    if (!fields.consent.checked)
    {
        result.textContent = "Please acknowledge that this is a local preview.";
        return;
    }
    result.textContent = `${fields.plan.value} enquiry preview ready. No message sent and no call booked.`;
});
