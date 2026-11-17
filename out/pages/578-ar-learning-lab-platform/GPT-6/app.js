"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const dialog = $("#learning-dialog");
const content = $("#dialog-content");
let stopScene = () => {};
let toastTimer;
let subject = "All";
let state = { completed: [], unlocked: false, lastDay: "", streak: 0 };
try
{
    const saved = JSON.parse(localStorage.getItem("orbit-learning-v1"));
    if (saved && Array.isArray(saved.completed))
    {
        state.completed = [...new Set(saved.completed.filter((id) => ["solar", "lab", "molecule", "plant", "earth", "water"].includes(id)))];
        state.unlocked = saved.unlocked === true;
        state.lastDay = typeof saved.lastDay === "string" ? saved.lastDay : "";
        state.streak = Number.isInteger(saved.streak) && saved.streak >= 0 ? saved.streak : 0;
    }
}
catch
{
    // Learning remains available when storage is disabled.
}

function icons(root = document)
{
    $$("[data-icon]", root).forEach((item) =>
    {
        item.innerHTML = `<svg class="icon" aria-hidden="true"><use href="icons.svg#${item.dataset.icon}"></use></svg>`;
    });
}

function save()
{
    try
    {
        localStorage.setItem("orbit-learning-v1", JSON.stringify(state));
    }
    catch
    {
        announce("Progress is available for this visit; browser storage is unavailable.");
    }
}

function announce(message)
{
    $("#announcement").textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#announcement").textContent = "", 4500);
}

function localDay(date = new Date())
{
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function complete(id, points)
{
    if (state.completed.includes(id))
    {
        announce("Already discovered! Your XP is safely recorded.");
        return;
    }
    state.completed.push(id);
    const today = localDay();
    if (state.lastDay !== today)
    {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        state.streak = state.lastDay === localDay(yesterday) ? state.streak + 1 : 1;
        state.lastDay = today;
    }
    save();
    updateProgress();
    renderLessons();
    announce(`Discovery complete. You earned ${points} XP!`);
}

function updateProgress()
{
    const xp = state.completed.reduce((total, id) => total + (id === "solar" ? 40 : id === "lab" ? 60 : 20), 0);
    $("#xp").textContent = `${xp} XP`;
    $("#level").textContent = xp >= 100 ? "Level 2 · Wonder seeker" : "Level 1 · Curious beginner";
    $("#xp-progress").style.width = `${Math.min(100, xp)}%`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    $("#streak").textContent = [localDay(), localDay(yesterday)].includes(state.lastDay) ? state.streak : 0;
    $("#quest-status").textContent = xp >= 100 ? "Wonder seeker unlocked. Keep asking big questions!" : `${xp} / 100 XP to your Wonder seeker badge`;
    $("#badge").hidden = xp < 100;
    $("#solar-check").textContent = state.completed.includes("solar") ? "✓" : "1";
    $("#lab-check").textContent = state.completed.includes("lab") ? "✓" : "2";
}

const art = {
    solar: `<rect width="320" height="180" fill="#dce4ee"/><g transform="translate(165 97) rotate(-23)"><ellipse rx="120" ry="38" fill="none" stroke="#adbdc9"/><circle r="49" fill="#d6af72"/><path d="M-47-10q47 20 94 0M-47 10q47 20 94 0M-35-32q35 13 70 0" fill="none" stroke="#ba8f56" stroke-width="8"/><ellipse rx="86" ry="19" fill="none" stroke="#e9dab3" stroke-width="13"/><path d="M-81 0a85 19 0 0 0 162 0" fill="none" stroke="#f8eccf" stroke-width="12"/></g><circle cx="59" cy="48" r="3" fill="#faf7e9"/><path d="M265 48v12m-6-6h12" stroke="#fff"/>`,
    molecule: `<rect width="320" height="180" fill="#e9e1d5"/><g stroke="#c3b39f" stroke-width="9"><path d="M130 105l-44-35m44 35l60-40m-60 40l76 30m-16-70l52 23"/></g><g stroke="#fff6e5" stroke-width="2"><circle cx="130" cy="105" r="29" fill="#6d8d78"/><circle cx="86" cy="70" r="22" fill="#cfa478"/><circle cx="190" cy="65" r="25" fill="#b57561"/><circle cx="206" cy="135" r="23" fill="#dfc9a5"/><circle cx="242" cy="88" r="15" fill="#d9b685"/></g>`,
    plant: `<rect width="320" height="180" fill="#e4e9d8"/><ellipse cx="160" cy="154" rx="72" ry="10" fill="#cad3bc"/><path d="M123 119h74l-10 42h-54" fill="#bb886a"/><path d="M160 121V56" stroke="#56794b" stroke-width="4"/><path d="M160 95q-60-2-45-49 48 2 45 49" fill="#6d8d59"/><path d="M161 72q-8-44 43-45 8 42-43 45" fill="#9aaa6d"/><path d="M160 105q37-42 65-19-20 38-65 19" fill="#80975c"/><path d="M161 124V56m0 40l-32-31m33 9l29-30" fill="none" stroke="#45653e" stroke-width="2"/>`,
    lab: `<rect width="320" height="180" fill="#e4dfeb"/><path d="M90 25h140M160 25v23" stroke="#796e91" stroke-width="5"/><path d="M160 48l58 87" stroke="#6b6280" stroke-width="3"/><circle cx="220" cy="137" r="23" fill="#bd9861"/><path d="M90 137a82 82 0 0 0 130 0" stroke="#9e90ad" stroke-dasharray="4 5" fill="none"/><circle cx="160" cy="48" r="5" fill="#736582"/>`,
    earth: `<rect width="320" height="180" fill="#dce8e7"/><g transform="translate(160 94)"><circle r="65" fill="#85a6a0"/><path d="M-18-60l29 3 8 20-20 10 5 20-23 23-22-9-5-26 13-27m48 48l28 3 9 20-14 8-7 24-19-14-6-26" fill="#c0cb9c"/><path d="M-49-33q49-31 99 0M-62 0H63M-49 36q49 26 99 0" fill="none" stroke="#dee8ce" opacity=".4"/><ellipse rx="32" ry="65" fill="none" stroke="#dee8ce" opacity=".4"/></g>`,
    water: `<rect width="320" height="180" fill="#e0e8ed"/><path d="M0 142q40-15 80 0t80 0 80 0 80 0v38H0" fill="#7fa7b2"/><path d="M190 143l55-70 55 70" fill="#a2b3a5"/><path d="M226 97l19-24 19 24-19-5" fill="#f3f5e9"/><path d="M77 72q-28-25-37 0-27-3-18 17h91q7-23-15-22-4-23-21 5" fill="#f9faf3"/><path d="M145 124V62m-8 9l8-10 8 10M69 103v22m-8-8l8 9 8-9" fill="none" stroke="#7d9eab" stroke-width="3"/><circle cx="170" cy="44" r="20" fill="#dcbf73"/>`
};
const lessons = [
    { id: "solar", title: "Meet your cosmic neighbors", subject: "Space", grade: "3–5", time: "8 min", text: "A hands-on journey around our solar system.", label: "FAN FAVORITE", mode: "3D exploration" },
    { id: "molecule", title: "Small things. Big connections.", subject: "Science", grade: "6–8", time: "6 min", text: "Discover the tiny building blocks of everything.", label: "SCIENCE, UP CLOSE", mode: "Book discovery" },
    { id: "plant", title: "How does your garden grow?", subject: "Nature", grade: "3–5", time: "5 min", text: "Follow a little leaf’s surprisingly big job.", label: "GROW YOUR CURIOSITY", mode: "Guided discovery" },
    { id: "lab", title: "The science of a swing", subject: "Science", grade: "6–8", time: "10 min", text: "Put gravity to the test in your own virtual lab.", label: "TRY AN EXPERIMENT", mode: "Physics simulation" },
    { id: "earth", title: "Our extraordinary blue dot", subject: "Space", grade: "6–8", time: "6 min", text: "Find out what makes our home so special.", label: "A NEW PERSPECTIVE", mode: "Guided discovery" },
    { id: "water", title: "A raindrop’s round trip", subject: "Nature", grade: "3–5", time: "5 min", text: "Follow water on its never-ending adventure.", label: "EVERYDAY WONDERS", mode: "Guided discovery" }
];

function renderLessons()
{
    const query = $("#search").value.trim().toLowerCase();
    const grade = $("#grade").value;
    const filtered = lessons.filter((lesson) => (subject === "All" || lesson.subject === subject) && (grade === "All" || lesson.grade === grade) && lesson.title.toLowerCase().includes(query));
    $("#lesson-count").textContent = filtered.length;
    $("#empty").hidden = filtered.length > 0;
    $("#lesson-grid").innerHTML = filtered.map((lesson) => `<article class="lesson-card"><div class="lesson-art"><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${lesson.title} illustration">${art[lesson.id]}</svg><span class="lesson-tag">${lesson.label}</span></div><div class="lesson-content"><div class="lesson-info"><span>${lesson.subject}</span><span>·</span><span>Grades ${lesson.grade}</span><span>·</span><span>${lesson.time}</span></div><h3>${lesson.title}</h3><p>${lesson.text}</p><div class="lesson-bottom"><span><i data-icon="${lesson.id === "molecule" && !state.unlocked ? "lock-keyhole" : "orbit"}"></i>${state.completed.includes(lesson.id) ? "Discovered" : lesson.mode}</span><button class="text-button" data-lesson="${lesson.id}">${lesson.id === "molecule" && !state.unlocked ? "Unlock with book" : "Let’s explore"}<i data-icon="arrow-up-right"></i></button></div></div></article>`).join("");
    icons($("#lesson-grid"));
}

const planets = [
    { name: "Mercury", color: "#b5b4a2", radius: 5, orbit: .28, period: .24, phase: 2.8, fact: "Mercury is closest to the Sun. One orbit takes about 88 Earth days." },
    { name: "Venus", color: "#ddc392", radius: 9, orbit: .43, period: .62, phase: 4.3, fact: "Venus has a thick atmosphere that traps heat. It is the hottest planet." },
    { name: "Earth", color: "#83b4ae", radius: 12, orbit: .60, period: 1, phase: 5.5, fact: "Earth takes about 365.25 days to orbit the Sun. It is our only known home for life." },
    { name: "Mars", color: "#cc8262", radius: 8, orbit: .76, period: 1.88, phase: .8, fact: "Mars is the red planet. An orbit takes about 687 Earth days." },
    { name: "Jupiter", color: "#c5a180", radius: 22, orbit: .94, period: 11.86, phase: 2.5, fact: "Jupiter is the largest planet. Its powerful gravity holds many moons in orbit." },
    { name: "Saturn", color: "#d8c59d", radius: 17, orbit: 1.14, period: 29.46, phase: 5.9, fact: "Saturn’s rings are mostly pieces of ice, with some rock and dust." }
];

function solarScene(canvas, settings = {})
{
    const ctx = canvas.getContext("2d");
    let frame;
    let start = performance.now();
    let last = start;
    let elapsed = 0;
    function draw(now)
    {
        if (!canvas.isConnected) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio || 1, 2);
        if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr))
        {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);
        const dt = Math.min((now - last) / 1000, .1);
        last = now;
        if (settings.playing !== false && (!reducedMotion || settings.interactive)) elapsed += dt * (settings.speed ?? .06);
        const tilt = settings.tilt ?? .43;
        const angle = -.37;
        const scale = Math.min(w * .43, h * .71);
        const cx = w * .49;
        const cy = h * .49;
        function project(theta, orbit)
        {
            const x = Math.cos(theta) * orbit * scale;
            const z = Math.sin(theta) * orbit * scale;
            const y = z * tilt;
            return { x: cx + x * Math.cos(angle) - y * Math.sin(angle), y: cy + x * Math.sin(angle) + y * Math.cos(angle), z };
        }
        for (let i = 0; i < 53; i++)
        {
            ctx.fillStyle = i % 4 === 0 ? "#c8d6b7" : "#6b8970";
            ctx.beginPath();
            ctx.arc(((i * 137 + 41) % 991) / 991 * w, ((i * 79 + 37) % 577) / 577 * h, i % 5 === 0 ? 1 : .55, 0, Math.PI * 2);
            ctx.fill();
        }
        planets.forEach((planet) =>
        {
            ctx.beginPath();
            for (let j = 0; j <= 100; j++)
            {
                const p = project(j / 100 * Math.PI * 2, planet.orbit);
                if (j === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.strokeStyle = planet.name === settings.selected ? "#b5c896" : "#718a684f";
            ctx.lineWidth = planet.name === settings.selected ? 1.3 : .8;
            ctx.stroke();
        });
        const bodies = planets.map((planet) => ({ ...planet, ...project(planet.phase + elapsed / planet.period, planet.orbit) }));
        bodies.push({ name: "Sun", x: cx, y: cy, z: 0, radius: 33, color: "#ecc56d" });
        bodies.sort((a, b) => a.z - b.z).forEach((body) =>
        {
            const r = body.radius * Math.min(1.25, w / 410) * (1 + body.z / 1700);
            if (body.name === "Sun")
            {
                const glow = ctx.createRadialGradient(body.x, body.y, r / 2, body.x, body.y, r * 2.7);
                glow.addColorStop(0, "#eac86d44");
                glow.addColorStop(1, "#eac86d00");
                ctx.fillStyle = glow;
                ctx.fillRect(body.x - r * 3, body.y - r * 3, r * 6, r * 6);
            }
            const shade = ctx.createRadialGradient(body.x - r * .35, body.y - r * .4, 0, body.x + r * .3, body.y + r * .1, r * 1.4);
            shade.addColorStop(0, body.color);
            shade.addColorStop(.55, body.color);
            shade.addColorStop(1, body.name === "Sun" ? "#b18332" : "#283e32");
            ctx.beginPath();
            ctx.arc(body.x, body.y, r, 0, Math.PI * 2);
            ctx.fillStyle = shade;
            ctx.fill();
            if (body.name === "Earth")
            {
                ctx.fillStyle = "#b8c88e";
                ctx.beginPath();
                ctx.ellipse(body.x - r * .25, body.y - r * .22, r * .37, r * .42, -.5, 0, Math.PI * 2);
                ctx.ellipse(body.x + r * .35, body.y + r * .35, r * .21, r * .36, -.3, 0, Math.PI * 2);
                ctx.fill();
            }
            if (body.name === "Saturn")
            {
                ctx.beginPath();
                ctx.ellipse(body.x, body.y, r * 1.9, r * .48, -.35, 0, Math.PI * 2);
                ctx.strokeStyle = "#cfc3a0";
                ctx.lineWidth = r * .22;
                ctx.stroke();
            }
            if (settings.selected === body.name)
            {
                ctx.fillStyle = "#eff1d2";
                ctx.font = "11px Segoe UI";
                ctx.textAlign = "center";
                ctx.fillText(body.name, body.x, body.y + r + 18);
            }
        });
        if (settings.interactive || !reducedMotion) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    const resize = () =>
    {
        if (reducedMotion && !settings.interactive) draw(performance.now());
    };
    window.addEventListener("resize", resize);
    return () =>
    {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
    };
}

function openDialog(kind)
{
    stopScene();
    stopScene = () => {};
    if (!dialog.open) dialog.showModal();
    if (kind === "solar") openSolar();
    else if (kind === "pendulum" || kind === "lab") openPendulum();
    else if (kind === "scan") openScan();
    else if (kind === "explorer") openExplorer();
    else if (kind === "privacy") openPrivacy();
    else if (kind === "about") openAbout();
    else openReading(kind);
    icons(content);
    dialog.scrollTop = 0;
    $("#close-dialog").focus();
}

function openSolar()
{
    content.innerHTML = `<h2 id="dialog-title">Meet your cosmic neighbors.</h2><p>Turn a flat diagram into a new perspective. Choose a planet, change your viewing angle, and watch its orbit.</p><canvas id="solar-canvas" class="simulation" aria-label="Interactive projected 3D solar system"></canvas><div class="planet-buttons" role="group" aria-label="Choose a planet">${planets.map((p) => `<button data-planet="${p.name}" aria-pressed="${p.name === "Earth"}">${p.name}</button>`).join("")}</div><div id="planet-fact" class="fact-panel" aria-live="polite">${planets[2].fact}</div><div class="controls"><label>Viewing angle <input id="tilt" type="range" min="15" max="90" value="43"></label><label>Orbit speed <input id="orbit-speed" type="range" min="0" max="200" value="50"></label><button class="button" id="pause-solar">Pause orbits</button></div><p class="micro">Browser 3D projection, not camera AR. Sizes and distances are compressed; relative orbital periods are approximate. Six planets shown.</p><h3>Cosmic challenge · +40 XP</h3><p>Which planet takes longer to orbit the Sun: Earth or Mars?</p><div id="solar-answers"><button class="answer" data-answer="Earth">Earth</button><button class="answer" data-answer="Mars">Mars</button></div><p id="solar-feedback" role="status"></p>`;
    const settings = { tilt: .43, speed: .5, selected: "Earth", interactive: true, playing: !reducedMotion };
    $("#pause-solar").textContent = settings.playing ? "Pause orbits" : "Play orbits";
    stopScene = solarScene($("#solar-canvas"), settings);
    $$("[data-planet]", content).forEach((button) => button.addEventListener("click", () =>
    {
        settings.selected = button.dataset.planet;
        $$("[data-planet]", content).forEach((p) => p.setAttribute("aria-pressed", p === button));
        $("#planet-fact").textContent = planets.find((p) => p.name === settings.selected).fact;
    }));
    $("#tilt").addEventListener("input", (event) => settings.tilt = Number(event.target.value) / 100);
    $("#orbit-speed").addEventListener("input", (event) => settings.speed = Number(event.target.value) / 100);
    $("#pause-solar").addEventListener("click", () =>
    {
        settings.playing = !settings.playing;
        $("#pause-solar").textContent = settings.playing ? "Pause orbits" : "Play orbits";
    });
    $$("[data-answer]", content).forEach((button) => button.addEventListener("click", () =>
    {
        if (button.dataset.answer === "Mars")
        {
            $("#solar-feedback").textContent = "Exactly! Mars takes about 687 Earth days; Earth takes about 365.25.";
            button.classList.add("correct");
            complete("solar", 40);
        }
        else $("#solar-feedback").textContent = "Take another look at each planet’s fact. A more distant orbit usually takes longer.";
    }));
}

function openPendulum()
{
    content.innerHTML = `<h2 id="dialog-title">What makes a pendulum tick?</h2><p>A longer string? A different planet? Change one variable at a time and see what happens.</p><div class="safety-note"><strong>Safety first:</strong> This is a virtual experiment. No physical equipment, chemicals, or camera needed. Never swing heavy objects around people.</div><details><summary>Materials &amp; method</summary><p>Virtual materials: one mass, a light string, a fixed support, and a clock.</p><ol><li>Keep the length at 1 metre and select Earth.</li><li>Run the simulation and record its period.</li><li>Change only gravity to the Moon. Run and record again.</li><li>Compare the time for one full swing.</li></ol></details><canvas id="pendulum-canvas" class="simulation light" aria-label="Simulated small-angle pendulum"></canvas><div class="controls"><label>String length: <output id="length-value">1.0 m</output><input id="length" type="range" min="50" max="200" step="10" value="100"></label><label>Gravity<select id="gravity"><option value="9.81">Earth · 9.81 m/s²</option><option value="1.62">Moon · 1.62 m/s²</option><option value="3.71">Mars · 3.71 m/s²</option></select></label><button id="run-lab" class="button dark">Run experiment</button></div><div class="readout"><span>Predicted period<strong id="period">2.01 s</strong></span><span>Elapsed time<strong id="elapsed">0.0 s</strong></span><span>Full swings<strong id="swings">0</strong></span></div><p class="micro">Small-angle, ideal pendulum: T = 2π√(L/g). Angle 12°, no friction or air resistance. A mathematical simulation, not a measured physical device.</p><button class="button" id="record" disabled>Record observation</button><p id="record-feedback" role="status">Run for one full swing to record a prediction.</p><div id="observations" class="fact-panel">Your observations will appear here.</div><h3>Think like a scientist · +60 XP</h3><p>With the same string length, which has a longer period?</p><button class="answer" data-lab-answer="earth">Earth</button><button class="answer" data-lab-answer="moon">The Moon</button><p id="lab-feedback" role="status">Record Earth and Moon at the same length, then answer.</p>`;
    const canvas = $("#pendulum-canvas");
    const ctx = canvas.getContext("2d");
    let length = 1;
    let gravity = 9.81;
    let elapsed = 0;
    let running = false;
    let previous = performance.now();
    let frame;
    const observations = new Map();
    const period = () => 2 * Math.PI * Math.sqrt(length / gravity);
    function reset()
    {
        elapsed = 0;
        running = false;
        $("#run-lab").textContent = "Run experiment";
        $("#record").disabled = true;
        $("#record-feedback").textContent = "Run for one full swing to record a prediction.";
        $("#period").textContent = `${period().toFixed(2)} s`;
    }
    $("#length").addEventListener("input", (event) =>
    {
        length = Number(event.target.value) / 100;
        $("#length-value").textContent = `${length.toFixed(1)} m`;
        reset();
    });
    $("#gravity").addEventListener("change", (event) =>
    {
        gravity = Number(event.target.value);
        reset();
    });
    $("#run-lab").addEventListener("click", () =>
    {
        running = !running;
        $("#run-lab").textContent = running ? "Pause experiment" : "Resume experiment";
    });
    $("#record").addEventListener("click", () =>
    {
        const name = gravity === 9.81 ? "Earth" : gravity === 1.62 ? "Moon" : "Mars";
        observations.set(`${name}-${length}`, { name, length, period: period() });
        $("#observations").textContent = [...observations.values()].map((o) => `${o.name} · ${o.length.toFixed(1)} m · ${o.period.toFixed(2)} s`).join(" | ");
        $("#record-feedback").textContent = "Observation recorded. Keep the same length and try another gravity.";
    });
    $$("[data-lab-answer]", content).forEach((button) => button.addEventListener("click", () =>
    {
        const comparable = [...observations.values()].some((o) => o.name === "Earth" && observations.has(`Moon-${o.length}`));
        if (!comparable)
        {
            $("#lab-feedback").textContent = "First record Earth and Moon with the same string length. Good science needs a fair comparison!";
            return;
        }
        if (button.dataset.labAnswer === "moon")
        {
            button.classList.add("correct");
            $("#lab-feedback").textContent = "You’ve got it! Weaker gravity on the Moon gives a longer period at the same length.";
            complete("lab", 60);
        }
        else $("#lab-feedback").textContent = "Compare your recorded periods. The bigger time means the slower swing.";
    }));
    function draw(now)
    {
        const dt = Math.min((now - previous) / 1000, .05);
        previous = now;
        if (running) elapsed += dt;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr))
        {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const pivot = { x: w / 2, y: 30 };
        const line = h * .64 * Math.sqrt(length / 2);
        const theta = .2094 * Math.cos(Math.sqrt(gravity / length) * elapsed);
        const x = pivot.x + line * Math.sin(theta);
        const y = pivot.y + line * Math.cos(theta);
        ctx.strokeStyle = "#c1ceb1";
        ctx.lineWidth = 1;
        for (let gx = 15; gx < w; gx += 25)
        {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, h);
            ctx.stroke();
        }
        ctx.strokeStyle = "#335a46";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 60, 25);
        ctx.lineTo(w / 2 + 60, 25);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pivot.x, pivot.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#c4974f";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pivot.x, pivot.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#335a46";
        ctx.fill();
        $("#elapsed").textContent = `${elapsed.toFixed(1)} s`;
        $("#swings").textContent = Math.floor(elapsed / period());
        $("#record").disabled = elapsed < period();
        frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    stopScene = () => cancelAnimationFrame(frame);
}

function openScan()
{
    content.innerHTML = `<h2 id="dialog-title">A book is just the beginning.</h2><p>Try a sample book scan to unlock a molecular discovery. This is a browser demonstration: no camera access or real image recognition.</p><label for="book">Choose a sample book</label><div class="controls"><select id="book"><option value="molecules">The Tiny World · Molecules</option><option value="space">Our Solar Neighborhood · Space</option></select></div><div class="scan-scene"><div class="sample-book" id="book-cover">The Tiny<br>World<small>ORBIT FIELD NOTES</small></div><div class="scanner-line"></div></div><button id="scan-sample" class="button dark">Simulate sample scan<i data-icon="scan-line"></i></button><div id="scan-result" class="fact-panel" role="status">A sample book is ready. No personal data is collected.</div>`;
    $("#book").addEventListener("change", (event) =>
    {
        $("#book-cover").innerHTML = event.target.value === "space" ? "Our Solar<br>Neighborhood<small>ORBIT FIELD NOTES</small>" : "The Tiny<br>World<small>ORBIT FIELD NOTES</small>";
        $("#scan-result").textContent = "Sample ready. Select Simulate sample scan to continue.";
    });
    $("#scan-sample").addEventListener("click", () =>
    {
        const space = $("#book").value === "space";
        if (!space)
        {
            state.unlocked = true;
            save();
            renderLessons();
        }
        $("#scan-result").innerHTML = `<strong>Sample matched. Lesson unlocked!</strong><p>${space ? "Meet your cosmic neighbors" : "Small things. Big connections."}</p><button class="button" id="open-unlocked">Open unlocked lesson<i data-icon="arrow-up-right"></i></button>`;
        icons($("#scan-result"));
        $("#open-unlocked").addEventListener("click", () => openDialog(space ? "solar" : "molecule"));
    });
}

const readings = {
    molecule: { title: "Small things. Big connections.", text: "Atoms are tiny building blocks of matter. When atoms bond, they can make molecules. A water molecule has two hydrogen atoms bonded to one oxygen atom: H₂O. The illustration is a conceptual model, not an exact molecule.", question: "How many atoms are in one water molecule?", answers: ["Two", "Three", "Four"], correct: "Three", explanation: "Two hydrogen atoms + one oxygen atom = three atoms in H₂O." },
    plant: { title: "How does your garden grow?", text: "Leaves use sunlight to help turn water and carbon dioxide into sugars. This process is called photosynthesis. Roots take up water and minerals; tiny openings in leaves let gases move in and out.", question: "What provides energy for photosynthesis?", answers: ["Sunlight", "Soil alone", "Moon rocks"], correct: "Sunlight", explanation: "Sunlight powers photosynthesis. Plants use the energy to make sugars." },
    earth: { title: "Our extraordinary blue dot.", text: "Earth is the third planet from the Sun. Its atmosphere and distance from the Sun help allow liquid water on its surface. Earth rotates about once a day and orbits the Sun about once a year.", question: "What causes day and night on Earth?", answers: ["Earth’s rotation", "Earth’s yearly orbit", "Clouds moving"], correct: "Earth’s rotation", explanation: "As Earth rotates, different places face toward the Sun and then away." },
    water: { title: "A raindrop’s round trip.", text: "Sunlight warms water, causing evaporation into water vapor. The vapor cools and condenses into tiny droplets that form clouds. Droplets can combine and fall as precipitation. Water collects and the cycle continues.", question: "What is water vapor cooling into droplets called?", answers: ["Evaporation", "Condensation", "Precipitation"], correct: "Condensation", explanation: "Condensation turns water vapor into liquid droplets. Evaporation goes the other way." }
};

function openReading(id)
{
    if (id === "molecule" && !state.unlocked)
    {
        openScan();
        return;
    }
    const reading = readings[id];
    if (!reading) return;
    content.innerHTML = `<h2 id="dialog-title">${reading.title}</h2><svg viewBox="0 0 320 180" style="width:100%;height:220px;border-radius:12px;background:#e6ecdc" role="img" aria-label="${reading.title} illustration">${art[id]}</svg><p>${reading.text}</p><h3>Little question. Big thinking. · +20 XP</h3><p>${reading.question}</p>${reading.answers.map((answer) => `<button class="answer" data-reading-answer="${answer}">${answer}</button>`).join("")}<p id="reading-feedback" role="status"></p><p class="micro">A guided browser lesson, not an AR object-recognition experience.</p>`;
    $$("[data-reading-answer]", content).forEach((button) => button.addEventListener("click", () =>
    {
        const correct = button.dataset.readingAnswer === reading.correct;
        $("#reading-feedback").textContent = correct ? reading.explanation : "Not quite. Read the discovery above and try once more.";
        if (correct)
        {
            button.classList.add("correct");
            complete(id, 20);
        }
    }));
}

function openExplorer()
{
    content.innerHTML = `<h2 id="dialog-title">Hello, ancient wonders.</h2><p>Destination 01 · Giza, Egypt. Explore a stylized landmark overlay, then choose a point to reveal its story.</p><div class="map"><svg viewBox="0 0 560 240" aria-label="Illustrated Giza landmark map"><path d="M0 20L560 170M0 100L480 240M90 0L560 230M220 0L0 190M440 0L100 240" stroke="#c9b68e" stroke-dasharray="5 6" fill="none"/><path d="M50 150l100-130 110 130" fill="#c29664"/><path d="M150 20v130h110" fill="#e7bc82"/><path d="M230 190l70-100 80 100" fill="#c29664"/><path d="M300 90v100h80" fill="#e7bc82"/><path d="M390 210l50-70 60 70" fill="#c29664"/></svg><button class="landmark" data-landmark="khufu">01 · Great Pyramid</button><button class="landmark" data-landmark="sphinx">02 · Great Sphinx</button><button class="landmark" data-landmark="plateau">03 · Giza Plateau</button></div><div id="landmark-fact" class="fact-panel" role="status">Choose a landmark above. Keyboard explorers can use Tab and Enter.</div><p class="micro">Illustrated educational overlay, not a geographic survey or a live AR camera view. No location access is requested.</p>`;
    const facts = {
        khufu: "The Great Pyramid was built for the pharaoh Khufu around 2600 BCE. Its original height was about 146.6 metres.",
        sphinx: "The Great Sphinx combines a lion’s body with a human head. It was carved from the limestone bedrock at Giza.",
        plateau: "The Giza Plateau sits on the west bank of the Nile near modern Cairo. Its monuments offer clues to ancient Egyptian engineering."
    };
    $$("[data-landmark]", content).forEach((button) => button.addEventListener("click", () => $("#landmark-fact").textContent = facts[button.dataset.landmark]));
}

function openPrivacy()
{
    content.innerHTML = `<h2 id="dialog-title">Little explorers. Clear boundaries.</h2><p>Orbit is a static learning demo. There are no accounts, chats, uploads, payments, ads, or external analytics. The “E” profile means Explorer, not a signed-in child.</p><div class="fact-panel"><strong>What stays here?</strong><p>Only completed lesson IDs, sample-book unlock status, and a date-based streak are stored in this browser. No name, age, voice, photo, location, or other personal information is requested.</p></div><p>Camera-based AR, educator tools, multiplayer, encrypted profiles, and parental consent services are not connected. This demo does not claim COPPA certification or production security.</p><button class="button" id="clear-progress">Clear local learning progress</button><p id="clear-feedback" role="status"></p>`;
    $("#clear-progress").addEventListener("click", () =>
    {
        state = { completed: [], unlocked: false, lastDay: "", streak: 0 };
        save();
        updateProgress();
        renderLessons();
        $("#clear-feedback").textContent = "Local learning progress cleared. A fresh adventure awaits.";
    });
}

function openAbout()
{
    content.innerHTML = `<h2 id="dialog-title">A world of wonder, in your browser.</h2><p>Orbit is an English-language, static homepage prototype for an AR education platform. Explore six lessons, a projected 3D solar system, an ideal pendulum physics lab, sample-book unlocking, a landmark overlay, and local quests.</p><p>All illustrations and simulations are original local artwork. The solar model compresses scale and shows six planets; the physics lab uses a small-angle ideal pendulum equation. Neither uses camera AR, hardware tracking, or object recognition.</p><p>Native AR adapters, auth, educator CMS, live multiplayer, translation, and the enhanced/advanced platform roadmap are not implemented. Offline installation and full accessibility certification are not provided. Once loaded, interactions need no server API.</p><p>Generated by GPT-6 (actual model: gpt-6.1-sol). Original platform prompt by KingLeoJr, MIT licensed. Icons by Lucide contributors, ISC licensed.</p><a class="text-button" href="LICENSE.txt">Read source and icon licenses<i data-icon="arrow-up-right"></i></a>`;
}

document.addEventListener("click", (event) =>
{
    const trigger = event.target.closest("[data-open], [data-lesson]");
    if (trigger) openDialog(trigger.dataset.open || trigger.dataset.lesson);
});
$("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
{
    stopScene();
    stopScene = () => {};
});
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    }
});
$$("[data-subject]").forEach((button) => button.addEventListener("click", () =>
{
    subject = button.dataset.subject;
    $$("[data-subject]").forEach((item) =>
    {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", item === button);
    });
    renderLessons();
}));
$("#search").addEventListener("input", renderLessons);
$("#grade").addEventListener("change", renderLessons);
$$("nav a").forEach((link) => link.addEventListener("click", () =>
{
    $$("nav a").forEach((item) => item.classList.toggle("active", item === link));
}));
icons();
renderLessons();
updateProgress();
const stopHero = solarScene($("#hero-space"));
window.addEventListener("pagehide", () =>
{
    stopHero();
    stopScene();
    clearTimeout(toastTimer);
});
