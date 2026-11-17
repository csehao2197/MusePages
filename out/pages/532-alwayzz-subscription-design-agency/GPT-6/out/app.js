const menu = document.querySelector("#menu");
const detail = document.querySelector("#detail");
const menuButton = document.querySelector("#menu-button");
let selectedPlan = "Essentials";
let returnFocus = menuButton;

for (const field of document.querySelectorAll(".line-field"))
{
    for (let i = 0; i < 20; i++)
    {
        const curve = document.createElement("span");
        curve.className = "curve";
        curve.style.setProperty("--line-width", `${60 + i * 10}px`);
        curve.style.setProperty("--delay", `${i * 0.25}s`);
        field.append(curve);
    }
}
const services = ["Brand Identity", "App Development", "Visual Design", "Creative Video", "Iconography"];
for (let i = 0; i < 4; i++)
{
    const group = document.createElement("div");
    group.className = "ticker-group";
    for (const name of services)
    {
        const span = document.createElement("span");
        span.textContent = name;
        group.append(span);
    }
    document.querySelector(".ticker-track").append(group);
}
const companies =
[
    ["Airbnb", "'Cedarville Cursive', cursive", "700"],
    ["Shopify", "system-ui", "800"],
    ["Notion", "Georgia, serif", "500"],
    ["Linear", "Inter, sans-serif", "600"],
    ["Webflow", "Inter, sans-serif", "700"],
    ["Figma", "system-ui", "600"],
    ["Slack", "Georgia, serif", "700"],
    ["Stripe", "system-ui", "800"],
    ["Vercel", "Inter, sans-serif", "600"],
    ["Framer", "'Source Serif 4', serif", "600"]
];
for (let i = 0; i < 2; i++)
{
    const group = document.createElement("div");
    group.className = "company-group";
    group.setAttribute("aria-hidden", "true");
    for (const [name, family, weight] of companies)
    {
        const span = document.createElement("span");
        span.textContent = name;
        span.style.setProperty("--family", family);
        span.style.setProperty("--weight", weight);
        group.append(span);
    }
    document.querySelector(".company-track").append(group);
}
function synchronizeScroll()
{
    document.body.style.overflow = menu.open || detail.open ? "hidden" : "";
    menuButton.setAttribute("aria-expanded", String(menu.open));
}
menuButton.addEventListener("click", () =>
{
    returnFocus = menuButton;
    menu.showModal();
    synchronizeScroll();
});
for (const dialog of [menu, detail])
{
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab")
        {
            return;
        }
        const controls = Array.from(dialog.querySelectorAll("button, a[href], input, summary, [tabindex]"))
            .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first.focus();
        }
    });
    dialog.addEventListener("close", () =>
    {
        synchronizeScroll();
        if (dialog === detail && !detail.open)
        {
            document.querySelector("#detail-content").replaceChildren();
        }
        if (!menu.open && !detail.open && returnFocus.isConnected)
        {
            returnFocus.focus();
        }
    });
}
function openPanel(name, opener)
{
    const template = document.querySelector(`#${name}-content`);
    if (!template)
    {
        return;
    }
    if (opener && !detail.contains(opener) && !menu.contains(opener))
    {
        returnFocus = opener;
    }
    if (menu.open)
    {
        menu.close();
    }
    document.querySelector("#detail-content").replaceChildren(template.content.cloneNode(true));
    if (!detail.open)
    {
        detail.showModal();
    }
    detail.scrollTop = 0;
    synchronizeScroll();
    detail.querySelector(".close-button").focus();
    if (name === "plans")
    {
        selectPlan(selectedPlan);
    }
    if (name === "contact")
    {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const input = document.querySelector("#booking-day");
        input.min = localDate;
        input.value = localDate;
        document.querySelector("#contact-intro").textContent = `A 15-minute introduction about ${selectedPlan}. No pitch deck required.`;
    }
}
function selectPlan(name)
{
    selectedPlan = name;
    for (const button of detail.querySelectorAll("[data-plan]"))
    {
        button.setAttribute("aria-pressed", String(button.dataset.plan === name));
    }
    detail.querySelector(".plan-summary").textContent = `${name} selected — let's talk about your next project.`;
    const contact = detail.querySelector(".plan-contact");
    contact.replaceChildren(document.createTextNode(`Discuss ${name} `));
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    contact.append(arrow);
}
const disciplineDescriptions =
{
    "Brand Identity": "From first impression to lasting recognition: strategy, wordmarks and cohesive visual systems.",
    "App Development": "Thoughtful interfaces, responsive experiences and a digital foundation designed around your users.",
    "Creative Video": "Bring your story to life through moving typography, considered pacing and a distinctive visual language."
};
document.addEventListener("click", (event) =>
{
    const close = event.target.closest("[data-close]");
    const panel = event.target.closest("[data-panel]");
    const plan = event.target.closest("[data-plan]");
    const discipline = event.target.closest("[data-discipline]");
    if (close)
    {
        document.getElementById(close.dataset.close).close();
    }
    else if (panel)
    {
        event.preventDefault();
        openPanel(panel.dataset.panel, panel);
    }
    else if (plan)
    {
        selectPlan(plan.dataset.plan);
    }
    else if (event.target.closest(".plan-contact"))
    {
        openPanel("contact");
    }
    else if (discipline)
    {
        for (const button of detail.querySelectorAll("[data-discipline]"))
        {
            button.setAttribute("aria-pressed", String(button === discipline));
        }
        detail.querySelector(".discipline-sample h3").textContent = discipline.dataset.discipline;
        detail.querySelector("#discipline-description").textContent = disciplineDescriptions[discipline.dataset.discipline];
    }
});
document.addEventListener("submit", (event) =>
{
    if (event.target.id !== "booking-form")
    {
        return;
    }
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    if (!String(data.get("name")).trim())
    {
        form.elements.name.setCustomValidity("Please enter your name.");
        form.elements.name.reportValidity();
        return;
    }
    const formattedDate = new Date(`${data.get("date")}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const result = detail.querySelector(".booking-result");
    result.textContent = `Booking preview for ${String(data.get("name")).trim()}: ${formattedDate}, ${data.get("time")} (your local time), to discuss ${selectedPlan}. Nothing has been booked or sent. Close this window to discard these details.`;
    result.hidden = false;
    result.scrollIntoView({ block: "nearest" });
});
document.addEventListener("input", (event) =>
{
    if (event.target.id === "booking-name")
    {
        event.target.setCustomValidity("");
    }
});
