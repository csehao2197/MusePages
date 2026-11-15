const menu = document.querySelector("#menu-button");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
    document.querySelector("nav").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
    document.querySelector("nav").classList.remove("open");
}));
document.querySelectorAll(".checklist").forEach((input) => input.addEventListener("change", () =>
{
    const checked = document.querySelectorAll(".checklist:checked").length;
    document.querySelector("#checklist-status").textContent = checked ? `${checked} item${checked > 1 ? "s" : ""} marked for your own reference. Nothing is saved or sent.` : "Your checklist is optional. There is no need to finish it now.";
}));
document.querySelector("#download").addEventListener("click", () =>
{
    const items = [...document.querySelectorAll(".checklist")].map((input) => `${input.checked ? "[x]" : "[ ]"} ${input.parentElement.textContent.trim()}`);
    const text = `A few things to gather, when you feel ready.\n\n${items.join("\n")}\n\nFictional website checklist. Not legal or medical advice.\nFor real assistance, contact the appropriate medical professional, local registrar or a verified funeral director.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "funeral-arrangements-checklist.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("[name='topic']").value = button.dataset.choice;
    document.querySelector("#contact").scrollIntoView();
    document.querySelector("[name='name']").focus({ preventScroll: true });
}));
const notices =
[
    ["Margaret Ellen Hurst", "1934–2026", "St Mark's Church, Lyncombe · Thursday 24 September 2026, 11am"],
    ["David John Pryce", "1951–2026", "Haycombe Crematorium · Friday 25 September 2026, 2pm"],
    ["Anne Lucas", "1940–2026", "Private family service. No public service details."],
    ["Robert Charles Fenwick", "1948–2026", "Bath Abbey Cemetery · Monday 28 September 2026, 10:30am"]
];
function renderNotices()
{
    const query = document.querySelector("#notice-search").value.toLowerCase().trim();
    const matches = notices.filter((notice) => notice[0].toLowerCase().includes(query));
    document.querySelector("#notice-list").innerHTML = matches.map(([name, dates, service]) => `<button class="notice" data-notice="${notices.findIndex((notice) => notice[0] === name)}"><strong>${name}</strong><span>${dates}</span><span>${service.startsWith("Private") ? "Private family service" : "View example service details"} ↗</span></button>`).join("");
    document.querySelector("#notice-empty").hidden = matches.length > 0;
}
document.querySelector("#notice-search").addEventListener("input", renderNotices);
document.querySelector("#all-notices").addEventListener("click", () =>
{
    document.querySelector("#notice-search").value = "";
    renderNotices();
});
document.querySelector("#notice-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-notice]");
    if (!button) return;
    const [name, dates, service] = notices[Number(button.dataset.notice)];
    document.querySelector("#notice-title").textContent = name;
    document.querySelector("#notice-dates").textContent = dates;
    document.querySelector("#notice-service").textContent = service;
    document.querySelector("dialog").showModal();
});
document.querySelector(".close").addEventListener("click", () => document.querySelector("dialog").close());
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const fields = event.currentTarget.elements;
    const result = document.querySelector("#contact-result");
    if (fields.name.value.trim().length < 2 || !fields.email.value || !fields.email.validity.valid)
    {
        result.textContent = "Please enter your name and a valid email address for this preview.";
        return;
    }
    if (!fields.consent.checked)
    {
        result.textContent = "Please acknowledge that this is a local preview only.";
        return;
    }
    result.textContent = `${fields.topic.value} enquiry preview ready. Nothing has been sent and no arrangement has been made. For real assistance, contact a verified local provider.`;
});
renderNotices();
