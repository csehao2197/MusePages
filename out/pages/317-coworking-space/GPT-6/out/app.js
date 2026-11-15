const desks = document.querySelector("#desks");
for (let index = 0; index < 42; index++)
{
    const desk = document.createElement("div");
    desk.className = "desk";
    desk.setAttribute("aria-hidden", "true");
    desks.append(desk);
}
function setFloor(count, minutes)
{
    [...desks.children].forEach((desk, index) => desk.classList.toggle("filled", index < count));
    document.querySelector("#occupied").textContent = count;
    document.querySelector("#free").textContent = 42 - count;
    document.querySelector("#clock").textContent = `${String(8 + Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
if (matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    setFloor(31, 180);
}
else
{
    const observer = new IntersectionObserver((entries) =>
    {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        function frame(now)
        {
            const progress = Math.min(1, (now - start) / 2000);
            setFloor(Math.floor(progress * 31), Math.floor(progress * 180));
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }, { threshold: .2 });
    observer.observe(desks);
}
function roomEstimate()
{
    const room = document.querySelector("#room").value;
    const member = document.querySelector("#member").value === "yes";
    const hours = Number(document.querySelector("#hours").value);
    const allowance = Number(document.querySelector("#allowance").value);
    const status = document.querySelector("#room-total");
    document.querySelector("#allowance").disabled = !member || room === "booth";
    if (!Number.isInteger(hours) || hours < 1 || hours > 8 || (member && room !== "booth" && (!Number.isInteger(allowance) || allowance < 0 || allowance > 2)))
    {
        status.textContent = "Choose 1 to 8 hours and 0 to 2 free hours.";
        return;
    }
    if (room === "booth")
    {
        status.textContent = member ? "Booths are free for members, subject to availability." : "Booths are for members only.";
        return;
    }
    const price = room === "press" ? (member ? 18 : 32) : (member ? 12 : 22);
    const billable = member ? Math.max(0, hours - allowance) : hours;
    status.textContent = `Estimate: £${billable * price} for ${hours} hours. ${member ? Math.min(hours, allowance) : 0} free hours applied. Nothing booked.`;
}
document.querySelector("#room-form").addEventListener("input", roomEstimate);
document.querySelector("#room-form").addEventListener("change", roomEstimate);
document.querySelector("#room-form").addEventListener("submit", (event) => event.preventDefault());
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#plan").value = button.dataset.plan;
    document.querySelector("#visit").scrollIntoView();
}));
document.querySelector("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const email = document.querySelector("#email");
    const date = document.querySelector("#date").value;
    const status = document.querySelector("#visit-status");
    if (!email.value || !email.validity.valid)
    {
        status.textContent = "Enter a valid email address.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future visit date.";
        return;
    }
    const day = new Date(`${date}T12:00:00`).getDay();
    if (day === 0 || day === 6)
    {
        status.textContent = "First visits take place Monday to Friday. Choose a weekday.";
        return;
    }
    const plan = document.querySelector("#plan");
    const prices = { trial: "Free trial day", part: "£180 a month", full: "£295 a month", fixed: "£395 a month" };
    status.textContent = `Visit plan: ${plan.selectedOptions[0].textContent}, ${date}, 08:00 to 19:00. ${prices[plan.value]}. Nothing booked or sent. Contact the space to confirm.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
roomEstimate();
