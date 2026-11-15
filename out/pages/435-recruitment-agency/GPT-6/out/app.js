const roles = [
    { title: "Head of Product", sector: "Technology & Product", location: "London · Hybrid", remote: false, level: "Leadership", text: "Shape product strategy and lead a cross-functional team. Sample permanent role." },
    { title: "Senior Software Engineer", sector: "Technology & Product", location: "UK · Remote", remote: true, level: "Senior", text: "Build reliable services and mentor a growing engineering team. Sample permanent role." },
    { title: "Finance Director", sector: "Finance & Operations", location: "London · Hybrid", remote: false, level: "Leadership", text: "Own financial planning and partner with the leadership team. Sample permanent role." },
    { title: "Operations Lead", sector: "Finance & Operations", location: "UK · Remote", remote: true, level: "Senior", text: "Improve the systems and operations that help a business scale. Sample permanent role." },
    { title: "Creative Director", sector: "Creative & Marketing", location: "London · Studio", remote: false, level: "Leadership", text: "Set a thoughtful creative direction across brand and campaigns. Sample permanent role." },
    { title: "Brand Strategist", sector: "Creative & Marketing", location: "UK · Remote", remote: true, level: "Mid-level", text: "Turn research into a clear brand story. Sample permanent role." }
];
const dialog = document.querySelector("dialog");
function modal(html)
{
    document.querySelector("#modal-body").innerHTML = html;
    dialog.showModal();
}
document.querySelector(".close").addEventListener("click", () => dialog.close());
function preferences(role)
{
    modal(`<p class="eyebrow">FOR CANDIDATES · LOCAL DEMO</p><h2>Your next chapter.</h2><p>Prepare your role preferences. No account is created, no recruiter is notified and no CV is collected.</p><form id="candidate-form"><label>Preferred role<input name="role" required></label><label>Sector<select name="sector"><option>Technology & Product</option><option>Finance & Operations</option><option>Creative & Marketing</option></select></label><label>Working preference<select name="work"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label><label class="consent"><input type="checkbox" required>I understand this is a local preference draft.</label><button class="button">Prepare preferences →</button><p id="candidate-status" role="status"></p></form>`);
    if (role)
    {
        document.querySelector('[name="role"]').value = role.title;
        document.querySelector('#candidate-form [name="sector"]').value = role.sector;
    }
    document.querySelector("#candidate-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.target);
        document.querySelector("#candidate-status").textContent = `Preferences prepared: ${data.get("role")} · ${data.get("sector")} · ${data.get("work")}. You have not been registered or applied for a job. This draft clears when the dialog is reopened.`;
    });
}
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const sector = document.querySelector("#sector").value;
    const remote = document.querySelector("#remote").checked;
    const visible = roles.filter((role) => (!query || `${role.title} ${role.text}`.toLowerCase().includes(query)) && (sector === "All sectors" || role.sector === sector) && (!remote || role.remote));
    document.querySelector("#role-count").textContent = `${visible.length} sample role${visible.length === 1 ? "" : "s"}`;
    document.querySelector("#empty").hidden = visible.length > 0;
    document.querySelector(".roles").innerHTML = visible.map((role) => `<article class="role"><div><h3>${role.title}</h3><p>${role.location} · ${role.level}</p></div><span class="type">${role.sector}</span><button data-role="${roles.indexOf(role)}">View role ↗</button></article>`).join("");
    document.querySelectorAll("[data-role]").forEach((button) => button.addEventListener("click", () =>
    {
        const role = roles[Number(button.dataset.role)];
        modal(`<p class="eyebrow">SAMPLE ROLE · NOT AN ACTUAL VACANCY</p><h2>${role.title}</h2><p>${role.location} · ${role.level}</p><p>${role.text}</p><p>Salary, employer and start date are not provided. This example does not accept applications.</p><button class="button" id="interest">Prepare role preferences →</button>`);
        document.querySelector("#interest").addEventListener("click", () =>
        {
            dialog.close();
            preferences(role);
        });
    }));
}
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#sector").addEventListener("change", render);
document.querySelector("#remote").addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    document.querySelector("#sector").value = "All sectors";
    document.querySelector("#remote").checked = false;
    render();
});
document.querySelectorAll("[data-sector]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    document.querySelector("#sector").value = button.dataset.sector;
    document.querySelector("#remote").checked = false;
    render();
    document.querySelector("#roles").scrollIntoView();
}));
render();
document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.dataset.open === "candidate") return preferences();
    modal('<p class="eyebrow">FOR COMPANIES · LOCAL DEMO</p><h2>Start with the brief.</h2><p>Prepare a search brief. No recruitment search or service guarantee is activated.</p><form id="company-form"><label>Role to hire<input name="role" required></label><label>Sector<select name="sector"><option>Technology & Product</option><option>Finance & Operations</option><option>Creative & Marketing</option></select></label><label>Hiring priorities<textarea name="priorities" required minlength="10" rows="3" placeholder="Team, goals and experience needed"></textarea></label><button class="button">Prepare hiring brief →</button><p id="company-status" role="status"></p></form>');
    document.querySelector("#company-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.target);
        document.querySelector("#company-status").textContent = `Brief prepared for ${data.get("role")} in ${data.get("sector")}. Priorities: ${data.get("priorities")}. Local preview only, not sent. No search, placement or fee agreement exists.`;
    });
}));
document.querySelector("#contact").addEventListener("click", () => modal('<h2>Contact options</h2><p>This illustrative agency has no verified email or office contact supplied. Use the company or candidate local planner to organise your brief. No data leaves this page.</p>'));
const menu = document.querySelector(".menu");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", open);
    document.querySelector("header nav").classList.toggle("open", open);
});
document.querySelectorAll("header nav a, header nav button").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("header nav").classList.remove("open");
}));
