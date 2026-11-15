const header = document.querySelector("#header");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
function closeMenu()
{
    navigation.classList.remove("open");
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
}
menuButton.addEventListener("click", () =>
{
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("open", open);
    header.classList.toggle("menu-active", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Close" : "Menu";
    if (open) navigation.querySelector("a").focus();
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && navigation.classList.contains("open"))
    {
        closeMenu();
        menuButton.focus();
    }
    if (event.key === "Tab" && navigation.classList.contains("open"))
    {
        const links = [...navigation.querySelectorAll("a")];
        if (!event.shiftKey && document.activeElement === links.at(-1))
        {
            event.preventDefault();
            menuButton.focus();
        }
        else if (event.shiftKey && document.activeElement === menuButton)
        {
            event.preventDefault();
            links.at(-1).focus();
        }
    }
});
const updateHeader = () => header.classList.toggle("scrolled", document.querySelector(".hero").getBoundingClientRect().bottom <= header.offsetHeight);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal, .timeline").forEach((element) => observer.observe(element));

let chosenLevel = "";
let instructor = "";
const levelButtons = document.querySelectorAll("[data-level]");
const levelStatus = document.querySelector("#level-status");
function chooseLevel(level)
{
    chosenLevel = level;
    levelButtons.forEach((button) =>
    {
        const selected = button.dataset.level === level;
        button.setAttribute("aria-pressed", String(selected));
        button.querySelector(".level-mark").textContent = selected ? "✓" : "+";
    });
    levelStatus.textContent = level ? `Starting point: ${level}. This will be added to your sample enquiry.` : "No level selected. It is fine to be unsure.";
}
levelButtons.forEach((button) => button.addEventListener("click", () => chooseLevel(button.dataset.level)));
document.querySelector("#reset-level").addEventListener("click", () => chooseLevel(""));
const booking = document.querySelector("#booking");
const planner = document.querySelector("#planner");
const fields = planner.elements;
const summary = document.querySelector("#summary");
const status = document.querySelector("#planner-status");
const plans =
{
    adult: { name: "Adult groups", price: 310, max: 6, length: "Five mornings, 9:15 to 12:15", hint: "Up to six in a group." },
    kids: { name: "Kids club", price: 280, max: 6, length: "Five mornings, 9:30 to 12:00", hint: "Ages 5 to 12, grouped by age and ability." },
    private: { name: "Private lessons", price: 180, max: 4, length: "Two hours, time to confirm", hint: "One to four people. Instructor preference is not a reservation." },
    taster: { name: "First timer taster", price: 75, max: 6, length: "One morning, time to confirm", hint: "For first timers. Up to six in a sample group." }
};
function clearSummary()
{
    summary.hidden = true;
    status.textContent = "";
}
function updateLesson()
{
    const plan = plans[fields.lesson.value];
    fields.people.max = plan.max;
    document.querySelector("#age-field").hidden = fields.lesson.value !== "kids";
    fields.age.required = fields.lesson.value === "kids";
    fields.age.disabled = fields.lesson.value !== "kids";
    document.querySelector("#planner-hint").textContent = `${plan.length}. ${plan.hint}`;
    clearSummary();
}
function openPlanner(lesson, name = "")
{
    closeMenu();
    instructor = name;
    planner.reset();
    fields.lesson.value = lesson;
    fields.level.value = chosenLevel;
    document.querySelector("#instructor-choice").textContent = name ? `Instructor preference: ${name}. Fictional profile, not verified availability.` : "No instructor preference.";
    updateLesson();
    booking.showModal();
}
document.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => openPlanner(button.dataset.book)));
document.querySelectorAll("[data-instructor]").forEach((button) => button.addEventListener("click", () => openPlanner("private", button.dataset.instructor)));
fields.lesson.addEventListener("change", updateLesson);
planner.addEventListener("input", clearSummary);
planner.addEventListener("change", clearSummary);
planner.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const plan = plans[fields.lesson.value];
    const count = Number(fields.people.value);
    if (!Number.isInteger(count) || count < 1 || count > plan.max)
    {
        status.textContent = `Choose between 1 and ${plan.max} people for this lesson.`;
        return;
    }
    if (fields.lesson.value === "kids" && (!Number.isInteger(Number(fields.age.value)) || Number(fields.age.value) < 5 || Number(fields.age.value) > 12))
    {
        status.textContent = "Kids club is for ages 5 to 12. Confirm every child’s age with a real provider.";
        return;
    }
    const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
    const lines = [
        `${plan.name} · ${plan.length}`,
        `${count} ${count === 1 ? "person" : "people"} · ${fields.level.value || "Level to discuss"}`,
        `${money.format(plan.price)} per person · ${money.format(plan.price * count)} illustrative total`,
        fields.lesson.value === "kids" ? `Sample child age: ${fields.age.value}. Other ages need provider confirmation.` : "",
        instructor ? `Instructor preference: ${instructor}` : "",
        "No availability checked. No booking made. Lift passes and hire are extra."
    ].filter(Boolean);
    document.querySelector("#summary-copy").textContent = lines.join("\n");
    summary.hidden = false;
    status.textContent = "Sample enquiry ready on this device only. Nothing has been sent.";
});
document.querySelector("#download-plan").addEventListener("click", () =>
{
    const text = `COL BLEU · FICTIONAL LESSON ENQUIRY\n\n${document.querySelector("#summary-copy").textContent}\n\nThis sample is not a ticket, quote or reservation. No real booking destination is configured.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "col-bleu-sample-enquiry.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.querySelectorAll("dialog").forEach((dialog) =>
{
    dialog.querySelector(".close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) =>
    {
        if (event.target === dialog)
        {
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        }
    });
});
const info =
{
    instagram: ["A little Alpine inspiration.", "There is no verified Col Bleu social account. The people and school on this page are fictional. Explore the mountain photography credits instead."],
    terms: ["Concept terms.", "All lessons, prices, qualifications, equipment offers, guarantees, instructor profiles, contact and company details come from a fictional brief. No contract, ticket or reservation is created. A real provider must confirm conditions, safety, pricing and availability. Off piste travel needs qualified guidance and local assessment."],
    privacy: ["Your plans stay here.", "The planner uses page memory only. There are no accounts, cookies, analytics, payments, network submissions or contact details collected. Reloading clears your selections. A downloaded summary stays in your own downloads until you delete it. External visitor information and license links have their own policies."],
    credits: ["A view worth sharing.", "Piste scenery: Rastkogel ski slope by Petr Novák, Wikipedia, CC BY SA 2.5. Lesson practice: Ski practicing by Tiia Monto, CC BY SA 3.0. Both depict Austrian locations, not Méribel or fictional Col Bleu staff. Photographs are embedded locally in SVG wrappers and cropped by the page. These derivatives retain their original licenses. Full source and license links are in the footer. The three instructor portraits are original illustrations."]
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, body] = info[button.dataset.info];
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-body").textContent = body;
    document.querySelector("#information").showModal();
}));
