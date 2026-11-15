let chosenSlot = null;
let plan = "intro";
const planCopy =
{
    intro: "Free intro / by appointment",
    drop: "Drop in / £20 per session",
    monthly: "Monthly / £89 per month, £1,068 over 12 months",
    annual: "Annual / £948 upfront, £79 monthly equivalent, saves £120 vs 12 monthly payments"
};
const rows =
[
    ["06:00", ["Available", "Available", "Full", "Available", "Available", "Open WOD"]],
    ["12:00", ["Available", "Full", "Available", "Available", "Full", "Open WOD"]],
    ["17:30", ["Full", "Available", "Available", "Full", "Available", "Open WOD"]]
];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const body = document.querySelector("#schedule-body");
for (const [time, states] of rows)
{
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = time;
    row.append(label);
    states.forEach((state, index) =>
    {
        const cell = document.createElement("td");
        const button = document.createElement("button");
        button.className = `slot${state === "Open WOD" ? " open" : ""}`;
        button.textContent = state;
        button.disabled = state === "Full";
        button.setAttribute("aria-label", `${days[index]} ${time}: ${state}`);
        button.addEventListener("click", () =>
        {
            chosenSlot = { day: index + 1, name: days[index], time, state };
            plan = "drop";
            document.querySelector("#visit-type").value = "class";
            document.querySelector("#selection").textContent = `Sample ${days[index]} ${time} / ${state === "Open WOD" ? "Open WOD" : "Coached class"} / £20 drop in.`;
            document.querySelector("#intro").scrollIntoView();
        });
        cell.append(button);
        row.append(cell);
    });
    body.append(row);
}
function workout(level)
{
    document.querySelectorAll("[data-level]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.level === level)));
    document.querySelector("#workout-title").textContent = level === "Scaled" ? "SCALED DOESN’T MEAN SECOND BEST." : "RX IS EARNED, NOT ASSUMED.";
    document.querySelector("#workout-copy").textContent = level === "Scaled" ? "Learn the movement, find your range and build consistency. A coached warm-up, technique block and adaptable conditioning finish. Loads and movements matched to you." : "The prescribed workout for athletes with the movement standards and experience. A coach checks technique and readiness before intensity. Quality reps always come first.";
}
document.querySelectorAll("[data-level]").forEach((button) => button.addEventListener("click", () => workout(button.dataset.level)));
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    plan = button.dataset.plan;
    document.querySelector("#selection").textContent = planCopy[plan];
    document.querySelector("#plan-status").textContent = `${planCopy[plan]}. Enquiry only; no charge or subscription created.`;
    document.querySelector("#visit-type").value = plan === "drop" ? "class" : "intro";
    document.querySelector("#intro").scrollIntoView();
}));
document.querySelector("#visit-type").addEventListener("change", () =>
{
    document.querySelector("#selection").textContent = document.querySelector("#visit-type").value === "intro" ? `${planCopy[plan]} / intro by appointment` : chosenSlot ? `Sample ${chosenSlot.name} ${chosenSlot.time} / £20 drop in` : "Select an available sample session from the schedule.";
});
document.querySelector("#intro-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const date = document.querySelector("#date").value;
    const type = document.querySelector("#visit-type").value;
    const status = document.querySelector("#status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add your name and a valid email address.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future preferred date.";
        return;
    }
    const weekday = new Date(`${date}T12:00:00`).getDay();
    if (weekday === 0)
    {
        status.textContent = "Sunday is a rest day. Choose Monday–Saturday.";
        return;
    }
    if (type === "class" && (!chosenSlot || chosenSlot.day !== weekday))
    {
        status.textContent = chosenSlot ? `Choose a ${chosenSlot.name} to match your selected sample session.` : "Select an available sample class from the schedule first.";
        return;
    }
    if (!document.querySelector("#experience").value || !document.querySelector("#acknowledge").checked)
    {
        status.textContent = "Choose your experience and acknowledge the coaching suitability discussion.";
        return;
    }
    status.textContent = `${name}: ${type === "class" ? `${chosenSlot.name} ${chosenSlot.time} class enquiry, £20` : `45-minute free intro enquiry. ${planCopy[plan]}`}, ${date}. Nothing booked, charged or sent. Contact a coach to confirm a suitable session.`;
});
const targets = [...document.querySelectorAll("[data-target]")];
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    targets.forEach((item) => item.textContent = `0${item.dataset.suffix || ""}`);
    const observer = new IntersectionObserver((entries) =>
    {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        function frame(now)
        {
            const progress = Math.min(1, (now - start) / 1800);
            targets.forEach((item) => item.textContent = `${Math.round(Number(item.dataset.target) * (1 - (1 - progress) ** 4))}${item.dataset.suffix || ""}`);
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    });
    observer.observe(document.querySelector("#stats"));
}
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
workout("Scaled");
