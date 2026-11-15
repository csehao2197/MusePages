const form = document.querySelector("form");
const prices = { beginner: [35, 165, 320], intensive: 450, refresher: 120, theory: 35 };
const titles = { beginner: "Beginner lessons", intensive: "Intensive 5-day course", refresher: "Refresher lessons", theory: "Theory prep session" };
const date = form.elements.date;
date.min = new Date().toLocaleDateString("en-CA");
function update()
{
    const course = form.elements.course.value;
    form.elements.block.disabled = course !== "beginner";
    const price = course === "beginner" ? prices.beginner[["1", "5", "10"].indexOf(form.elements.block.value)] : prices[course];
    document.querySelector("#estimate").textContent = `${titles[course]} · £${price}${course === "refresher" ? " for 3 hours" : ""} · example estimate`;
}
form.addEventListener("change", update);
document.querySelectorAll("[data-course], [data-instructor]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        if (button.dataset.course) form.elements.course.value = button.dataset.course;
        if (button.dataset.instructor) form.elements.instructor.value = button.dataset.instructor;
        update();
        document.querySelector("#book").scrollIntoView();
    });
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const postcode = form.elements.postcode.value.trim().toUpperCase();
    const validArea = /^(M|SK|OL|BL)\d{1,2}$/.test(postcode);
    const fields = [...form.querySelectorAll("input")];
    const invalid = fields.filter((input) =>
    {
        const valid = input.checkValidity() && input.value.trim() && (input.name !== "postcode" || validArea);
        input.setAttribute("aria-invalid", String(!valid));
        return !valid;
    });
    const result = document.querySelector("#booking-result");
    if (invalid.length)
    {
        result.textContent = "Enter a name, valid email, future date and an M, SK, OL or BL outward postcode.";
        invalid[0].focus();
        return;
    }
    result.textContent = `Local request reviewed: ${titles[form.elements.course.value]}, ${form.elements.instructor.value}, ${date.value}, ${postcode}. No lesson is reserved and no request has been sent.`;
});
document.querySelectorAll("[data-answer]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#quiz-result").textContent = button.dataset.answer === "right" ? "Correct. Stop behind the stop line and wait for permission to proceed." : "Not quite. A red light means stop, even when the road looks clear.";
    });
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches)
{
    const start = performance.now();
    const tick = (now) =>
    {
        const progress = Math.min((now - start) / 2000, 1);
        document.querySelectorAll("[data-count]").forEach((node) =>
        {
            node.textContent = Math.round(Number(node.dataset.count) * (1 - (1 - progress) ** 3)).toLocaleString("en-GB");
        });
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}
function road()
{
    const section = document.querySelector("#journey").getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - section.top) / (innerHeight + section.height)));
    document.querySelector("#road-car").style.left = `${(reduced.matches ? 1 : progress) * 95}%`;
}
addEventListener("scroll", road, { passive: true });
road();
update();
