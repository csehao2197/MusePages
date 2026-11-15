const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
function closeNav()
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
function scrollAudit()
{
    closeNav();
    document.querySelector("#audit").scrollIntoView();
}
document.querySelectorAll("[data-audit]").forEach((button) => button.addEventListener("click", scrollAudit));
const points = [4100, 4450, 5200, 6100, 7900, 9400, 11400, 14800, 19200, 23100, 27400, 32000, 37800, 42500, 46900, 51400, 55700, 61400];
function renderChart(period)
{
    const shown = points.slice(0, period);
    const coordinates = shown.map((value, index) => `${45 + index * 930 / (period - 1)},${280 - value / 65000 * 245}`);
    const line = `M${coordinates.join(" L")}`;
    document.querySelector("#line").setAttribute("d", line);
    document.querySelector("#area").setAttribute("d", `${line} L975,280 L45,280 Z`);
    const end = shown.at(-1).toLocaleString("en-GB");
    document.querySelector("#traffic-total").textContent = end;
    document.querySelector("#axis-mid").textContent = `MONTH ${Math.ceil(period / 2)}`;
    document.querySelector("#axis-end").textContent = `MONTH ${period}`;
    document.querySelector("#chart-title").textContent = `Illustrative organic sessions from 4,100 to ${end} across ${period} months`;
    document.querySelector("#chart-caption").textContent = `Organic sessions, B2B SaaS concept client. 4,100 to ${end} monthly sessions over ${period} months.`;
}
document.querySelectorAll("[data-period]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-period]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderChart(Number(button.dataset.period));
}));
renderChart(18);
const keywords = [
    ["procurement software", 34, 3], ["vendor management platform", 61, 7],
    ["spend analysis tool", 88, 4], ["supplier onboarding software", 27, 2],
    ["contract lifecycle management", 45, 9], ["purchase order software", 19, 1],
    ["sourcing platform comparison", 72, 6], ["procurement automation", 51, 5]
];
function renderKeywords()
{
    const query = document.querySelector("#keyword-search").value.trim().toLowerCase();
    const visible = keywords.filter((item) => item[0].includes(query));
    document.querySelector("#keyword-list").innerHTML = visible.map(([term, before, after]) => `<div class="keyword"><span>${term}</span><div class="improvement" aria-hidden="true"><span style="--improvement:${(before - after) / before * 100}%"></span></div><span class="positions">${before} → <b>${after}</b></span></div>`).join("");
    document.querySelector("#keyword-empty").hidden = visible.length > 0;
}
document.querySelector("#keyword-search").addEventListener("input", renderKeywords);
document.querySelector("#reset-keywords").addEventListener("click", () =>
{
    document.querySelector("#keyword-search").value = "";
    renderKeywords();
});
renderKeywords();
const form = document.querySelector("#audit-form");
document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#selected-plan").textContent = `${button.dataset.plan} interest selected. Illustrative pricing only; no engagement created.`;
    scrollAudit();
}));
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const url = new URL(form.elements.website.value);
    if (!["http:", "https:"].includes(url.protocol))
    {
        document.querySelector("#audit-status").textContent = "Use an http or https website address. No URL has been fetched.";
        return;
    }
    if (form.elements.goal.value.trim().length < 15 || form.elements.name.value.trim().length < 2 || form.elements.company.value.trim().length < 2)
    {
        document.querySelector("#audit-status").textContent = "Use visible aliases and at least 15 characters describing the goal.";
        return;
    }
    document.querySelector("#audit-status").textContent = `Local checklist for ${url.hostname}: review indexation, site structure and relevant content; define a conversion measure. Website not inspected. No audit requested, message sent or SEO result guaranteed.`;
});
const dialog = document.querySelector("dialog");
const stories = [
    ["Procurement: a broader audience.", "Starting point: 4,100 sessions, 90% branded. The brief describes removing 340 thin pages, rebuilding architecture and creating eight clusters. Concept outcome: 61,400 sessions at 18 months, 71% non-branded. No real client, attribution evidence or future result is verified."],
    ["Outdoor equipment: less crawl waste.", "Starting point: 1.2 million indexable URLs from faceted navigation. The proposed work controls facets, consolidates categories and fixes product schema. Concept outcome: organic revenue 2.8× in 11 months. This is not a measured result or revenue forecast."],
    ["Fourteen locations: genuinely local.", "Starting point: duplicate city pages. The concept rebuilds local information and business profiles. Brief outcome: visibility +340%, enquiries +190%. These figures are illustrative, not verified and not promised."]
];
document.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () =>
{
    const story = stories[Number(button.dataset.case)];
    document.querySelector("#modal-title").textContent = story[0];
    document.querySelector("#modal-body").textContent = story[1];
    dialog.showModal();
}));
document.querySelector("#privacy").addEventListener("click", () =>
{
    document.querySelector("#modal-title").textContent = "A local preview, not a live audit.";
    document.querySelector("#modal-body").textContent = "No cookies, analytics credentials or form transmission. Form selections stay in memory until reload. Website addresses are parsed locally, never crawled. All traffic and keyword examples are illustrative, and no search or AI visibility outcome is guaranteed.";
    dialog.showModal();
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
