const drawer = document.querySelector("#drawer");
const content = document.querySelector("#drawer-content");
const label = document.querySelector("#drawer-label");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let trigger;
let fieldEnergy = 40;
const intro = '<p class="drawer-kicker">EATHAN / INDEPENDENT BY DESIGN</p>';
const pages =
{
    menu: `${intro}<h2>A point of view.<br>Not just a portfolio.</h2><div class="menu-list"><button data-view="projects">PROJECTS <span>01 ↗</span></button><button data-view="blog">BLOG <span>02 ↗</span></button><button data-view="about">ABOUT <span>03 ↗</span></button><button data-view="resume">RESUME <span>04 ↗</span></button><button data-view="contact">LET'S WORK <span>05 ↗</span></button></div><p class="small-note">An illustrated portfolio concept. Project stories and professional details are fictional demonstrations.</p>`,
    projects: `${intro}<h2>Selected work.<br>Deliberate impact.</h2><p class="drawer-copy">Two concept projects. Different voices. The same obsession with getting the details right.</p><button class="project" data-view="form" aria-label="Open FORM project"><div class="project-art form-art">FORM.</div><div class="project-caption"><span>FORM / BRAND & DIGITAL</span><span>2026 ↗</span></div></button><button class="project" data-view="noise" aria-label="Open NOISE project"><div class="project-art noise-art">NOISE / 01</div><div class="project-caption"><span>NOISE / ART DIRECTION</span><span>2025 ↗</span></div></button><p class="small-note">Original fictional case studies, not real client commissions.</p>`,
    form: `${intro}<div class="project-art form-art">FORM.</div><h2>A quieter kind of bold.</h2><p class="drawer-copy">Concept / Independent furniture studio<br>Role / Identity, UX strategy, digital direction</p><div class="step"><h3>The challenge</h3><p class="drawer-copy">Let craftsmanship lead without making the buying journey feel precious or complicated.</p></div><div class="step"><h3>The direction</h3><p class="drawer-copy">A disciplined grid, generous white space, and product-first navigation turn a catalog into a calm editorial experience.</p></div><p class="small-note">Fictional design study. No client results or performance metrics are claimed.</p>`,
    noise: `${intro}<div class="project-art noise-art">NOISE / 01</div><h2>Impossible to ignore.</h2><p class="drawer-copy">Concept / Independent music festival<br>Role / Art direction, visual identity, interaction</p><div class="step"><h3>The challenge</h3><p class="drawer-copy">Give an emerging festival a voice as unfiltered as the artists on its stages.</p></div><div class="step"><h3>The direction</h3><p class="drawer-copy">Acid color, compressed typography, and rhythmic motion meet clear schedules and an accessible ticket journey.</p></div><p class="small-note">Fictional design study. No ticket sales or client affiliation is claimed.</p>`,
    process: `${intro}<h2>Less guesswork.<br>More intention.</h2><div class="step"><small>01 / DISCOVER</small><h3>Find the right question.</h3><p class="drawer-copy">Start with your audience, the problem, and what success should feel like. Clarity before pixels.</p></div><div class="step"><small>02 / DEFINE</small><h3>Choose a point of view.</h3><p class="drawer-copy">Translate the strategy into a visual direction. Test the strongest idea, not every possible idea.</p></div><div class="step"><small>03 / MAKE</small><h3>Build the feeling.</h3><p class="drawer-copy">Design, prototype, and refine the details together. Make the experience intuitive at every size.</p></div><button class="acid-button" data-view="contact">LET'S TALK ABOUT YOUR PROJECT ↗</button>`,
    about: `${intro}<h2>Independent<br>by choice.</h2><p class="drawer-copy">I'm Eathan — a freelance UI/UX designer crafting bold, high-contrast digital experiences that are intuitive, impactful, and built to stand out.</p><h3>Strategy with a pulse.</h3><p class="drawer-copy">I work at the intersection of creative direction and digital design. The goal is simple: help good ideas become unmistakable experiences.</p><div class="step"><p class="drawer-kicker">FOCUS</p><p class="drawer-copy">Creative direction / Brand systems<br>Interface design / Digital experiences</p></div><p class="small-note">This is a fictional portfolio adaptation. The original illustrated character is not an exact likeness of Eathan.</p><button class="acid-button" data-view="contact">LET'S WORK TOGETHER ↗</button>`,
    blog: `${intro}<h2>Notes from<br>the practice.</h2><div class="step"><small>DESIGN NOTES / 4 MIN READ</small><h3>Contrast is more than color.</h3><p class="drawer-copy">Contrast creates hierarchy. A quiet paragraph beside a loud headline can do more than another accent color. Decide what matters, then give everything else permission to step back.</p></div><div class="step"><small>PROCESS NOTES / 3 MIN READ</small><h3>Motion should mean something.</h3><p class="drawer-copy">Animation is a sentence, not confetti. Use it to orient, reveal, and connect. When someone asks for less motion, the experience should remain complete.</p></div>`,
    resume: `${intro}<h2>Direction.<br>Design. Detail.</h2><p class="drawer-copy">Eathan Roy / Independent UI/UX designer</p><div class="step"><small>2020 — PRESENT / CONCEPT PROFILE</small><h3>Independent practice</h3><p class="drawer-copy">Brand strategy, art direction, interface design, rapid prototyping, and accessible digital systems.</p></div><div class="step"><small>TOOLKIT</small><p class="drawer-copy">Research / Wireframing / Design systems<br>Interaction design / Creative development</p></div><a class="acid-button" download="eathan-concept-resume.txt" href="data:text/plain;charset=utf-8,Eathan%20Roy%20%E2%80%94%20Fictional%20portfolio%20concept%0AIndependent%20UI%2FUX%20designer%0ACreative%20direction%2C%20brand%20systems%2C%20interface%20design.%0ANot%20a%20verified%20professional%20resume.">Download resume</a><p class="small-note">Download contains a clearly labeled fictional concept profile, not verified employment history.</p>`,
    labs: `${intro}<h2>Play is part<br>of the process.</h2><p class="drawer-copy">The energy field behind this page is a live canvas experiment. Move your pointer to push its particles, or change the intensity here.</p><label>Field energy <input id="energy" type="range" min="0" max="100" value="40"></label><p id="energy-value" class="drawer-kicker">40%</p><p class="small-note">15,000 points / 530 energy traces. A lightweight 2D interpretation, not the blueprint's Three.js scene. Reduced-motion mode freezes the field.</p>`,
    contact: `${intro}<h2>Good things<br>start with a hello.</h2><p class="drawer-copy">Tell me what you have in mind.</p><form id="contact-form"><label>Your name<input name="name" required maxlength="100" autocomplete="name" placeholder="Alex Morgan"></label><label>Email address<input name="email" required type="email" autocomplete="email" placeholder="alex@studio.com"></label><label>Project type<select name="type" required><option value="">Select a project type</option><option>Brand & website</option><option>UI/UX design</option><option>Creative direction</option><option>Something else</option></select></label><label>Tell me about your project<textarea name="details" rows="3" required minlength="15" maxlength="4000" placeholder="The idea, the ambition, the timeline…"></textarea></label><button class="acid-button" type="submit">Prepare inquiry ↗</button><p class="small-note">Local demo only. Nothing is sent, uploaded, or stored. Prepare and download your inquiry to keep a copy.</p></form><div id="confirmation" hidden role="status"><h3>Your inquiry is ready.</h3><p class="drawer-copy">Nothing has been sent. Download your draft below.</p><a id="inquiry-download" class="acid-button" download="project-inquiry.txt">Download inquiry</a></div>`
};

function show(view)
{
    content.innerHTML = pages[view] || pages.menu;
    label.textContent = view === "contact" ? "LET'S WORK" : view.toUpperCase();
    drawer.scrollTop = 0;
    if (!drawer.open)
    {
        trigger = document.activeElement;
        drawer.showModal();
        document.body.style.overflow = "hidden";
    }
    document.querySelector("#back").focus();
    const range = document.querySelector("#energy");
    if (range)
    {
        range.value = fieldEnergy;
        document.querySelector("#energy-value").textContent = `${fieldEnergy}%`;
        range.addEventListener("input", () =>
        {
            fieldEnergy = Number(range.value);
            document.querySelector("#energy-value").textContent = `${fieldEnergy}%`;
        });
    }
    const form = document.querySelector("#contact-form");
    form?.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const values = new FormData(form);
        const text = `PROJECT INQUIRY — LOCAL DRAFT, NOT SENT\n\nName: ${values.get("name")}\nEmail: ${values.get("email")}\nType: ${values.get("type")}\n\n${values.get("details")}`;
        document.querySelector("#inquiry-download").href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
        document.querySelector("#confirmation").hidden = false;
        document.querySelector("#confirmation").scrollIntoView({ block: "nearest" });
    });
}
document.addEventListener("click", (event) =>
{
    const action = event.target.closest("[data-view]");
    if (action) show(action.dataset.view);
});
document.querySelector(".logo").addEventListener("click", () => show("about"));
document.querySelector("#back").addEventListener("click", () => show("menu"));
document.querySelector("#close").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (event) =>
{
    if (event.target === drawer)
    {
        const rect = drawer.getBoundingClientRect();
        if (event.clientX < rect.left) drawer.close();
    }
});
drawer.addEventListener("close", () =>
{
    document.body.style.overflow = "";
    trigger?.focus();
});
const words = ["PURPOSE", "IMPACT", "INTENT"];
let index = 0;
let scramble;
if (!reduced)
{
    setInterval(() =>
    {
        index = (index + 1) % words.length;
        let frame = 0;
        clearInterval(scramble);
        scramble = setInterval(() =>
        {
            document.querySelector("#hero-word").textContent = words[index].split("").map((letter, i) => i < frame / 2 ? letter : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");
            if (++frame > words[index].length * 2) clearInterval(scramble);
        }, 35);
        document.querySelector(".word-index").textContent = `0${index + 1} / 03 — MAKE IT MEAN SOMETHING`;
    }, 4000);
    setInterval(() =>
    {
        const bio = document.querySelector("#bio");
        bio.classList.remove("reveal");
        void bio.offsetWidth;
        bio.classList.add("reveal");
    }, 7000);
}
const canvas = document.querySelector("#field");
const context = canvas.getContext("2d");
const points = Array.from({ length: 15000 }, () => ({ x: Math.random(), y: Math.random(), speed: Math.random() + .2 }));
const lines = Array.from({ length: 530 }, () => ({ x: Math.random(), y: Math.random(), length: Math.random() * 70 + 5 }));
const pointer = { x: -1000, y: -1000 };
let width;
let height;
let tick = 0;
let animation;
function resize()
{
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    paint();
}
function paint()
{
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#45619d";
    context.globalAlpha = .25;
    for (const point of points)
    {
        let x = point.x * width;
        let y = ((point.y * height + tick * point.speed * .08) % height);
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 90 && !reduced)
        {
            const force = (90 - distance) * fieldEnergy / 100;
            x += dx / Math.max(distance, 1) * force;
            y += dy / Math.max(distance, 1) * force;
            context.fillStyle = "#ccff00";
        }
        context.fillRect(x, y, .8, .8);
        context.fillStyle = "#45619d";
    }
    context.strokeStyle = "#88aaff";
    context.globalAlpha = .13;
    context.lineWidth = .5;
    context.beginPath();
    for (const line of lines)
    {
        const x = line.x * width;
        const y = (line.y * height + tick * .12) % height;
        context.moveTo(x, y);
        context.lineTo(x + (x - width / 2) * .018, y + line.length * fieldEnergy / 100);
    }
    context.stroke();
    context.globalAlpha = 1;
}
function animate()
{
    tick++;
    if (!document.hidden) paint();
    animation = requestAnimationFrame(animate);
}
window.addEventListener("pointermove", (event) =>
{
    pointer.x = event.clientX;
    pointer.y = event.clientY;
});
window.addEventListener("resize", resize);
window.addEventListener("pagehide", () => cancelAnimationFrame(animation));
resize();
if (!reduced) animate();
