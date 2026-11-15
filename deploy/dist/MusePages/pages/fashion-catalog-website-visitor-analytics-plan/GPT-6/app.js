const $ = (id) => document.getElementById(id);
let days = [7, 30, 90].includes(Number(new URLSearchParams(location.search).get("range"))) ? Number(new URLSearchParams(location.search).get("range")) : 30;
let empty = false;
let metric = "views";
let summary;
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const paths = ["/", "/products", "/gallery", "/about", "/contact"];
const sources = ["Direct", "google.com", "instagram.com", "pinterest.com"];
const devices = ["Mobile", "Desktop", "Tablet"];
const countries = ["Indonesia", "Singapore", "United States", "Australia", "Other"];
const visits = [];
for (let offset = 0; offset < 90; offset++)
{
    const date = new Date(today.getTime() - offset * 86400000).toISOString().slice(0, 10);
    const count = offset % 13 === 5 ? 0 : 25 + (offset * 17 + 11) % 70;
    for (let index = 0; index < count; index++)
    {
        visits.push({ date, identity: `sample-${(offset * 13 + index * 7) % 401}`, path: paths[(index * 3 + offset) % 5], referrer: sources[(index + offset) % 4], device: devices[index % 7 < 4 ? 0 : index % 7 < 6 ? 1 : 2], country: countries[(index + offset) % 5] });
    }
}
function aggregate()
{
    const since = new Date(today.getTime() - (days - 1) * 86400000).toISOString().slice(0, 10);
    const data = empty ? [] : visits.filter((visit) => visit.date >= since);
    const trend = [];
    for (let index = days - 1; index >= 0; index--)
    {
        const date = new Date(today.getTime() - index * 86400000).toISOString().slice(0, 10);
        const daily = data.filter((visit) => visit.date === date);
        trend.push({ date, views: daily.length, visitors: new Set(daily.map((visit) => visit.identity)).size });
    }
    const breakdown = (key) =>
    {
        const groups = new Map();
        data.forEach((visit) => groups.set(visit[key], (groups.get(visit[key]) || 0) + 1));
        return [...groups].sort((a, b) => b[1] - a[1]);
    };
    return { views: data.length, visitors: new Set(data.map((visit) => visit.identity)).size, trend, pages: breakdown("path"), referrers: breakdown("referrer"), devices: breakdown("device"), countries: breakdown("country") };
}
function draw()
{
    const points = summary.trend;
    const max = Math.max(1, ...points.map((point) => point[metric]));
    const coordinates = points.map((point, index) => `${index * 800 / (points.length - 1)},${175 - point[metric] / max * 150}`);
    const grid = [25, 62.5, 100, 137.5, 175].map((y) => `<path d="M0 ${y}H800" stroke="var(--line)" stroke-dasharray="3 5"/>`).join("");
    $("trend-chart").innerHTML = `<defs><linearGradient id="analytics-trend-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="currentColor" stop-opacity=".16"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>${grid}<path d="M0 175 L${coordinates.join(" L")} L800 175Z" fill="url(#analytics-trend-fill)"/><polyline points="${coordinates.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
    $("trend-chart").setAttribute("aria-label", `${days} days of sample ${metric}; includes zero-activity days`);
    $("trend-chart").dataset.points = points.length;
    $("trend-chart").dataset.zeros = points.filter((point) => point.views === 0).length;
    $("first-date").textContent = points[0].date.slice(5);
    $("last-date").textContent = points.at(-1).date.slice(5);
    $("date-label").textContent = `${points[0].date} — ${points.at(-1).date}`;
}
function inspect()
{
    const point = summary.trend[Number($("day").value)];
    $("daily-summary").textContent = `${point.date}: ${point.views} views / ${point.visitors} visitors`;
}
function render()
{
    summary = aggregate();
    $("views").textContent = summary.views.toLocaleString("en-US");
    $("visitors").textContent = summary.visitors.toLocaleString("en-US");
    $("chart-region").hidden = empty;
    $("empty").hidden = !empty;
    $("empty-toggle").textContent = empty ? "Show sample data" : "Preview empty state";
    $("empty-toggle").setAttribute("aria-pressed", String(empty));
    document.querySelectorAll("[data-range]").forEach((button) =>
    {
        button.classList.toggle("active", Number(button.dataset.range) === days);
        button.setAttribute("aria-pressed", String(Number(button.dataset.range) === days));
    });
    for (const key of ["pages", "referrers", "devices", "countries"])
    {
        const rows = summary[key];
        const max = Math.max(1, ...rows.map((row) => row[1]));
        $(key).innerHTML = rows.length ? rows.map(([label, value]) => `<div class="bar-row"><div class="bar-label"><span>${label}</span><span>${key === "devices" ? (value / summary.views * 100).toFixed(1) + "%" : value.toLocaleString("en-US")}</span></div><div class="bar-track"><div class="bar-fill" style="width:${value / max * 100}%"></div></div></div>`).join("") : '<p class="no-data">No data yet.</p>';
    }
    $("day").max = days - 1;
    $("day").value = days - 1;
    draw();
    inspect();
}
document.querySelectorAll("[data-range]").forEach((button) => button.addEventListener("click", () =>
{
    days = Number(button.dataset.range);
    const url = new URL(location.href);
    url.searchParams.set("range", days);
    history.replaceState(null, "", url);
    render();
}));
document.querySelectorAll("[data-metric]").forEach((button) => button.addEventListener("click", () =>
{
    metric = button.dataset.metric;
    document.querySelectorAll("[data-metric]").forEach((tab) => tab.classList.toggle("active", tab === button));
    draw();
}));
$("day").addEventListener("input", inspect);
$("empty-toggle").addEventListener("click", () => { empty = !empty; render(); });
$("restore").addEventListener("click", () => { empty = false; render(); });
$("theme").addEventListener("click", () =>
{
    const dark = document.body.classList.toggle("dark");
    $("theme").setAttribute("aria-pressed", String(dark));
    $("theme").setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
});
$("privacy").addEventListener("click", () => $("privacy-dialog").showModal());
$("close").addEventListener("click", () => $("privacy-dialog").close());
$("export").addEventListener("click", () =>
{
    const rows = [["Sample aggregate analytics", ""], ["Range days", days], ["Page views", summary.views], ["Unique visitors", summary.visitors], ["Date", "Views", "Visitors"], ...summary.trend.map((point) => [point.date, point.views, point.visitors])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "maison-analytics-summary.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("status").textContent = "Sample aggregate summary exported. No individual visit records.";
});
render();
