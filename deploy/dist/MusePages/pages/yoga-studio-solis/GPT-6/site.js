const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
}));
const sessions =
[
    { day: "Monday", time: "07:00", name: "Hatha", teacher: "Sarah", style: "Hatha", formats: ["studio"], spots: 8, detail: "A steady, foundational class. In-studio in Bristol, with room to adapt each posture." },
    { day: "Tuesday", time: "18:30", name: "Vinyasa Flow", teacher: "James", style: "Vinyasa Flow", formats: ["studio", "online"], spots: 3, detail: "A breath-led flow, available in-studio or online. Actual online access is arranged after a real confirmation." },
    { day: "Wednesday", time: "12:00", name: "Yin", teacher: "Elena", style: "Yin", formats: ["studio"], spots: 0, detail: "A slower practice with longer holds. The sample session is full; a preview does not create a real waitlist entry." },
    { day: "Thursday", time: "19:00", name: "Meditation", teacher: "Sarah", style: "Meditation", formats: ["online"], spots: 6, detail: "A guided seated practice, online. No live stream, meeting link or credentials are provided in this demonstration." },
    { day: "Saturday", time: "09:00", name: "Weekend Flow", teacher: "James", style: "Vinyasa Flow", formats: ["studio"], spots: 5, detail: "An unhurried weekend flow in the Bristol studio. Move within your own comfortable range." }
];
let style = "all";
let expanded = false;
const booking = document.querySelector("#booking");
const chosenClass = document.querySelector("#chosen-class");
const chosenPlan = document.querySelector("#chosen-plan");
sessions.forEach((session, index) => chosenClass.add(new Option(`${session.day} ${session.time} · ${session.name}`, String(index))));
function updateBooking()
{
    const session = sessions[Number(chosenClass.value)];
    document.querySelector("#class-description").textContent = `${session.teacher} · ${session.formats.map((value) => value === "studio" ? "In-studio" : "Online").join(" / ")} · ${session.spots ? `${session.spots} sample spots` : "Sample session full; waitlist preview only"}`;
    document.querySelector("#booking-title").textContent = session.spots ? "Plan your practice." : "A place for patience.";
    document.querySelector("#create-preview").textContent = session.spots ? "Create visit preview ↗" : "Create waitlist preview ↗";
    const descriptions =
    {
        free: "First-class sample offer: £0. Eligibility and a real place require studio confirmation.",
        dropin: "Single-class interest: £18. Nothing is charged.",
        monthly: "Monthly interest: £89 / month. No membership or recurring charge is created.",
        annual: "Annual interest: £799 / year. £269 less than 12 monthly payments. No membership is created."
    };
    document.querySelector("#plan-description").textContent = descriptions[chosenPlan.value];
    document.querySelector("#booking-result").textContent = "Local preview only. Nothing is sent, booked or charged.";
}
function openBooking(plan, index = 0)
{
    document.querySelector("#booking-form").reset();
    chosenClass.value = String(index);
    chosenPlan.value = plan;
    updateBooking();
    booking.showModal();
}
document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => openBooking(button.dataset.open)));
[chosenClass, chosenPlan].forEach((input) => input.addEventListener("change", updateBooking));
document.querySelector("#close-booking").addEventListener("click", () => booking.close());
function render()
{
    const format = document.querySelector("#format").value;
    const list = document.querySelector("#class-list");
    list.replaceChildren();
    let count = 0;
    sessions.forEach((session, index) =>
    {
        if ((style !== "all" && session.style !== style) || (format !== "all" && !session.formats.includes(format))) return;
        count++;
        const row = document.createElement("article");
        row.className = "class-row";
        const timing = document.createElement("p");
        timing.textContent = `${session.day} · ${session.time}`;
        const name = document.createElement("h3");
        name.textContent = session.name;
        const teacher = document.createElement("p");
        teacher.textContent = session.teacher;
        const small = document.createElement("small");
        small.textContent = `${session.spots ? `${session.spots} sample spots` : "Sample class full"} · ${session.formats.map((item) => item === "studio" ? "Studio" : "Online").join(" / ")}`;
        teacher.append(small);
        const button = document.createElement("button");
        button.className = "text-button book-row";
        button.textContent = session.spots ? "Book →" : "Waitlist →";
        button.addEventListener("click", () => openBooking("dropin", index));
        const detail = document.createElement("p");
        detail.className = "row-details";
        detail.hidden = !expanded;
        detail.textContent = session.detail;
        row.append(timing, name, teacher, button, detail);
        list.append(row);
    });
    document.querySelector("#no-classes").hidden = count !== 0;
    document.querySelector("#class-count").textContent = `${count} class${count === 1 ? "" : "es"} shown`;
}
document.querySelectorAll("[data-style]").forEach((button) => button.addEventListener("click", () =>
{
    style = button.dataset.style;
    document.querySelectorAll("[data-style]").forEach((chip) => chip.setAttribute("aria-pressed", String(chip === button)));
    render();
    document.querySelector("#classes").scrollIntoView({ behavior: "smooth" });
}));
document.querySelector("#format").addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    style = "all";
    document.querySelector("#format").value = "all";
    document.querySelectorAll("[data-style]").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.style === "all")));
    render();
});
document.querySelector("#full-timetable").addEventListener("click", (event) =>
{
    expanded = !expanded;
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
    event.currentTarget.textContent = expanded ? "Hide timetable details ↑" : "View full timetable details ↓";
    render();
});
document.querySelector("#booking-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#booking-result");
    const name = document.querySelector("#name").value.trim();
    if (!event.currentTarget.checkValidity() || name.length < 2)
    {
        result.textContent = "Please enter your name, a valid email and acknowledge the preview notice.";
        return;
    }
    const session = sessions[Number(chosenClass.value)];
    result.textContent = `${name}, your ${session.spots ? "visit" : "waitlist"} preview for ${session.name} on ${session.day} at ${session.time} is ready. Nothing has been sent, booked or charged.`;
});
const gallery = document.querySelector("#gallery-dialog");
const scenes = [...document.querySelectorAll("[data-image]")];
let sceneIndex = 0;
function showScene()
{
    const scene = scenes[sceneIndex];
    document.querySelector("#scene-image").src = scene.dataset.image;
    document.querySelector("#scene-image").alt = scene.querySelector("img").alt;
    document.querySelector("#scene-caption").textContent = scene.dataset.caption;
    document.querySelector("#scene-count").textContent = `${sceneIndex + 1} of ${scenes.length}`;
}
scenes.forEach((button, index) => button.addEventListener("click", () =>
{
    sceneIndex = index;
    showScene();
    gallery.showModal();
}));
document.querySelector("#previous").addEventListener("click", () =>
{
    sceneIndex = (sceneIndex + scenes.length - 1) % scenes.length;
    showScene();
});
document.querySelector("#next").addEventListener("click", () =>
{
    sceneIndex = (sceneIndex + 1) % scenes.length;
    showScene();
});
document.querySelector("#close-gallery").addEventListener("click", () => gallery.close());
[booking, gallery].forEach((dialog) => dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog) dialog.close();
}));
render();
