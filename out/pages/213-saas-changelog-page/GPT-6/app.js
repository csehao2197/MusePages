const releases =
[
    { version: "2.4.0", date: "January 15, 2025", type: "Major Release", title: "Dashboard 2.0 & Advanced Analytics", description: "A clearer view of your work. A deeper understanding of your progress. Meet your new command center.", features: ["Completely redesigned dashboard with customizable widgets", "Advanced analytics with custom date ranges", "New Gantt chart view for project timelines", "Dark mode support"], improvements: ["50% faster page load times", "Improved search with filters", "Better mobile responsiveness"], fixes: ["Fixed notification delivery delays", "Resolved calendar sync issues"], breaking: [] },
    { version: "2.3.2", date: "January 8, 2025", type: "Patch", title: "Performance & Polish", description: "The little things that make every day a little smoother.", features: [], improvements: ["Faster loading for large project boards", "Clearer focus states for keyboard navigation"], fixes: ["Resolved duplicate task notifications", "Fixed date formatting in exported reports"], breaking: [] },
    { version: "2.3.0", date: "December 18, 2024", type: "Minor Update", title: "A more connected workspace", description: "Bring the right people and conversations closer to your work.", features: ["Threaded comments and team mentions", "New workspace activity digest"], improvements: ["Improved attachment previews"], fixes: [], breaking: [] },
    { version: "2.2.0", date: "November 27, 2024", type: "Major Release", title: "Built for your whole team", description: "More control for administrators. More clarity for everyone.", features: ["Role-based workspace permissions", "Guest collaboration spaces"], improvements: ["Redesigned member directory"], fixes: ["Fixed invitation expiration labels"], breaking: ["Legacy viewer role renamed to Guest; review custom role mappings before upgrading."] },
    { version: "2.1.1", date: "November 6, 2024", type: "Patch", title: "Small fixes. Better flow.", description: "A maintenance update with everyday reliability in mind.", features: [], improvements: [], fixes: ["Corrected timezone handling for all-day events", "Restored saved filters after a browser refresh"], breaking: [] }
];
let filter = "All";
let limit = 3;
let subscribed = false;
try
{
    subscribed = localStorage.getItem("relay-subscription") === "preview";
    if (localStorage.getItem("relay-theme") === "dark") document.body.classList.add("dark");
}
catch {}
document.querySelector("#theme").setAttribute("aria-pressed", document.body.classList.contains("dark"));
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const found = releases.filter((release) => (filter === "All" || release[filter.toLowerCase()].length) && JSON.stringify(release).toLowerCase().includes(query));
    const visible = found.slice(0, limit);
    document.querySelector("#result-count").textContent = `${visible.length} of ${found.length} ${filter === "All" ? "updates" : filter.toLowerCase() + " releases"}`;
    document.querySelector("#timeline").innerHTML = visible.map((release) =>
    {
        const index = releases.indexOf(release);
        const art = index === 0 ? '<div class="release-art" role="img" aria-label="Illustrated Dashboard 2.0 analytics preview"><div class="art-window"><p>WORKSPACE / OVERVIEW <span>THIS MONTH ↗</span></p><strong>A little more perspective.</strong><div class="art-stats"><div><small>Tasks completed</small><b>248</b></div><div><small>On-time delivery</small><b>96%</b></div><div><small>Team capacity</small><b>82%</b></div></div><div class="bars"><i style="--height:30%"></i><i style="--height:50%"></i><i style="--height:42%"></i><i style="--height:62%"></i><i style="--height:48%"></i><i style="--height:78%"></i><i style="--height:67%"></i><i style="--height:91%"></i><i style="--height:84%"></i><i style="--height:100%"></i></div></div></div>' : "";
        const groups = [["features", "+", "New features"], ["improvements", "↗", "Improvements"], ["fixes", "✓", "Bug fixes"], ["breaking", "!", "Breaking change"]];
        return `<article class="release" id="v${release.version.replaceAll(".", "-")}"><div class="release-date"><span class="version">v${release.version}</span><time>${release.date}</time></div><div class="release-body"><span class="type">${release.type}</span><h2>${release.title}</h2><p>${release.description}</p>${art}${groups.filter(([key]) => release[key].length).map(([key, icon, title]) => `<div class="change-group"><h3><span>${icon}</span>${title}</h3><ul>${release[key].map((change) => `<li>${change}</li>`).join("")}</ul></div>`).join("")}<button class="share-release" data-share="${index}">Copy release link ↗</button></div></article>`;
    }).join("") || '<p class="small">No updates found. Try a different keyword or choose All updates.</p>';
    document.querySelector("#load-more").hidden = visible.length >= found.length;
    document.querySelector("#end-note").hidden = !found.length || visible.length < found.length;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.onclick = () =>
{
    filter = button.dataset.filter;
    limit = 3;
    document.querySelectorAll("[data-filter]").forEach((other) => other.setAttribute("aria-pressed", other === button));
    render();
});
document.querySelector("#search").oninput = () =>
{
    limit = 3;
    render();
};
document.querySelector("#load-more").onclick = () =>
{
    limit += 3;
    render();
};
document.querySelectorAll(".jump").forEach((link) => link.onclick = () =>
{
    filter = "All";
    limit = releases.length;
    document.querySelector("#search").value = "";
    document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.filter === "All"));
    render();
});
function jumpToHash()
{
    if (!location.hash.startsWith("#v")) return;
    limit = releases.length;
    render();
    document.querySelector(location.hash)?.scrollIntoView();
}
window.addEventListener("hashchange", jumpToHash);
document.querySelector("#timeline").onclick = async (event) =>
{
    const button = event.target.closest("[data-share]");
    if (!button) return;
    const release = releases[Number(button.dataset.share)];
    const url = new URL(location.href);
    url.hash = `v${release.version.replaceAll(".", "-")}`;
    try
    {
        await navigator.clipboard.writeText(url.href);
        button.textContent = "Release link copied ✓";
    }
    catch
    {
        location.hash = url.hash;
        button.textContent = "Release permalink set in address bar ✓";
    }
};
document.querySelector("#subscribe").onsubmit = (event) =>
{
    event.preventDefault();
    subscribed = true;
    let stored = false;
    try
    {
        localStorage.setItem("relay-subscription", "preview");
        stored = true;
    }
    catch {}
    document.querySelector("#subscribe-status").textContent = `Update preference saved for this ${stored ? "browser" : "session"}. No email subscription was created.`;
    document.querySelector("#email").value = "";
};
document.querySelector("#theme").onclick = () =>
{
    const dark = document.body.classList.toggle("dark");
    document.querySelector("#theme").setAttribute("aria-pressed", dark);
    try
    {
        localStorage.setItem("relay-theme", dark ? "dark" : "light");
    }
    catch {}
};
function show(title, html)
{
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-content").innerHTML = html;
    document.querySelector("#dialog").showModal();
}
function feedback()
{
    show("What would make work better?", '<form id="feedback-form"><label>Your idea<textarea id="idea" required minlength="10" maxlength="1000" placeholder="Tell us what you have in mind."></textarea></label><button class="primary">Save local idea preview →</button></form><p id="feedback-status" role="status"></p><p class="small">Nothing is sent to a product team.</p>');
    document.querySelector("#feedback-form").onsubmit = (event) =>
    {
        event.preventDefault();
        document.querySelector("#feedback-status").textContent = "Idea captured in this session. Thank you for the thoughtful preview; nothing was submitted.";
    };
}
document.querySelector("#feedback").onclick = feedback;
document.querySelector("#suggest").onclick = feedback;
document.querySelector("#roadmap").onclick = () => show("A little further down the road.", "<p><b>Exploring:</b> workload planning and custom automation.</p><p><b>Next:</b> clearer project templates.</p><p class='small'>Illustrative roadmap, not a delivery commitment.</p>");
document.querySelector("#manage").onclick = () =>
{
    show("Your update preference.", `<p>${subscribed ? "A local preview preference is saved." : "No local update preference is saved."}</p><button class="primary" id="unsubscribe">Clear local preference</button><p id="manage-status" role="status"></p>`);
    document.querySelector("#unsubscribe").onclick = () =>
    {
        subscribed = false;
        try
        {
            localStorage.removeItem("relay-subscription");
        }
        catch {}
        document.querySelector("#manage-status").textContent = "Local preference cleared. No email subscription was affected.";
    };
};
document.querySelector(".close").onclick = () => document.querySelector("#dialog").close();
render();
jumpToHash();
