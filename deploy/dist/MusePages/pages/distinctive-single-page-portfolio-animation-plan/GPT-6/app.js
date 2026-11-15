const $ = (id) => document.getElementById(id);
let motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
let angle = 0;
function motionState()
{
    document.body.classList.toggle("motion-off", !motion);
    $("motion").setAttribute("aria-pressed", String(motion));
    $("motion").textContent = `MOTION: ${motion ? "ON" : "OFF"}`;
}
$("motion").addEventListener("click", () => { motion = !motion; motionState(); });
$("rotate").addEventListener("click", () =>
{
    angle = (angle + 90) % 360;
    $("cube").style.setProperty("--angle", `${angle}deg`);
    $("rotate").textContent = `[ ROTATE +90° / ${angle}° ]`;
});
const projects = [
    { title: "THE CONTROL ROOM", stack: "Next.js / TypeScript / Data", description: "An original interface study in operational clarity. Sample project, not a live client deployment.", color: "#2f42c8", kind: "control" },
    { title: "SIGNAL MARKET", stack: "React / Node.js / Commerce", description: "A conceptual marketplace for useful digital goods. Original mock interface and illustrative project details.", color: "#433e30", kind: "market" },
    { title: "HUMAN INDEX", stack: "CSS / Interaction / Design", description: "A small experiment in organising a very messy internet. Original concept, no external integration.", color: "#9b4838", kind: "index" }
];
function artwork(project)
{
    return `<svg viewBox="0 0 400 240" role="img" aria-label="${project.title} original interface illustration"><rect x="10" y="12" width="380" height="214" fill="#efeee7" stroke="#171714" stroke-width="3"/><path d="M10 44H390M88 44V226" stroke="#171714" stroke-width="2"/><circle cx="26" cy="29" r="4" fill="${project.color}"/><path d="M24 64H70M24 80H62M24 96H72" stroke="#171714" stroke-width="3"/><rect x="110" y="64" width="255" height="35" fill="${project.color}"/><path d="M110 119H365M110 139H220M110 156H220M110 174H220M110 193H220" stroke="#aaa89d" stroke-width="5"/><rect x="240" y="132" width="125" height="69" fill="#e1e834" stroke="#171714" stroke-width="2"/><path d="m250 185 20-20 19 5 20-23 23 10 20-14" stroke="${project.color}" stroke-width="4" fill="none"/></svg>`;
}
$("project-grid").innerHTML = projects.map((project, index) => `<button class="window realm" data-project="${index}"><div class="titlebar">REALM_0${index + 1}.exe <span>[ OPEN ]</span></div><div class="realm-art">${artwork(project)}</div><h3>${project.title}</h3><p>[ ${project.stack} ]</p></button>`).join("");
let active = 0;
function show()
{
    $("preview").innerHTML = artwork(projects[active]);
    $("project-label").textContent = `${active + 1} / ${projects.length} — ${projects[active].title}`;
    $("project-description").textContent = projects[active].description;
}
document.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () =>
{
    active = Number(button.dataset.project);
    show();
    $("viewer").showModal();
}));
$("previous").addEventListener("click", () => { active = (active + 2) % 3; show(); });
$("next").addEventListener("click", () => { active = (active + 1) % 3; show(); });
$("close").addEventListener("click", () => $("viewer").close());
document.addEventListener("keydown", (event) =>
{
    if (!$("viewer").open) return;
    if (event.key === "ArrowRight") { event.preventDefault(); active = (active + 1) % 3; show(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); active = (active + 2) % 3; show(); }
});
$("transmission").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value.trim()) && $("message").value.trim().length >= 10;
    $("send-status").textContent = valid ? "TRANSMISSION STAGED LOCALLY. NO MESSAGE WAS SENT. HUMAN REVIEW REQUIRED." : "INPUT ERROR: VALID RETURN ADDRESS + 10 CHARACTER BRIEF REQUIRED.";
    if (valid && motion)
    {
        event.submitter.animate([{ transform: "translateY(3px) rotate(2deg)" }, { transform: "translateY(-2px)" }, { transform: "none" }], { duration: 220, easing: "steps(4)" });
    }
});
const thoughts = ["“Make it work. Then make it weird.”", "“Good systems leave room for humans.”", "“Clarity is a feature, not a phase.”"];
let thought = 0;
$("quote").addEventListener("click", () =>
{
    thought = (thought + 1) % thoughts.length;
    $("thought").textContent = thoughts[thought];
});
motionState();
