const canvases = [...document.querySelectorAll("canvas")];
const contexts = canvases.map((canvas) => canvas.getContext("2d"));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let paused = false;
let scene = 0;
let frame;
let last = 0;
function render(time)
{
    if (time - last < 33 && !reduced && !paused)
    {
        frame = requestAnimationFrame(render);
        return;
    }
    last = time;
    const phase = reduced || paused ? .8 : time * .00025;
    canvases.forEach((canvas, index) =>
    {
        const width = Math.min(innerWidth, 1200);
        const height = Math.round(width * innerHeight / innerWidth);
        if (canvas.width !== width || canvas.height !== height)
        {
            canvas.width = width;
            canvas.height = height;
        }
        const context = contexts[index];
        context.fillStyle = index === 0 ? "#0a0611" : "#030408";
        context.fillRect(0, 0, width, height);
        if (index === 0)
        {
            for (let band = 0; band < 80; band++)
            {
                context.beginPath();
                for (let x = -20; x <= width + 20; x += 8)
                {
                    const y = height * .37 + band * (height / 180) + Math.sin(x / width * 5 + phase + band * .023) * height * .15 + Math.cos(x / width * 10 + band * .055 + phase) * height * .06;
                    if (x === -20) context.moveTo(x, y);
                    else context.lineTo(x, y);
                }
                context.strokeStyle = `rgba(${180 + band}, ${75 + band}, ${170 + band}, ${.12 + Math.sin(band / 80 * Math.PI) * .6})`;
                context.lineWidth = Math.max(.8, width / 1000);
                context.stroke();
            }
        }
        else if (index === 1)
        {
            context.strokeStyle = "#b5d2e466";
            context.lineWidth = .7;
            for (let line = -15; line < 16; line++)
            {
                context.beginPath();
                for (let step = 0; step < 100; step++)
                {
                    const y = height * .25 + step / 100 * height;
                    const spread = Math.pow(step / 100, 1.5);
                    const x = width / 2 + line * width / 20 * spread + Math.sin(step * .08 + phase) * width * .09;
                    if (step === 0) context.moveTo(x, y);
                    else context.lineTo(x, y);
                }
                context.stroke();
            }
            for (let line = 0; line < 32; line++)
            {
                const y = height * .27 + Math.pow((line + phase % 1) / 32, 2) * height;
                context.beginPath();
                context.moveTo(0, y);
                context.quadraticCurveTo(width / 2, y - height * .12, width, y);
                context.stroke();
            }
        }
        else
        {
            context.save();
            context.translate(width * .55, height * .43);
            for (let ring = 1; ring < 32; ring++)
            {
                const radius = Math.pow((ring + phase % 1) / 32, 2) * Math.max(width, height);
                context.save();
                context.rotate(ring * .035 + phase * .12);
                context.strokeStyle = `rgba(226, 231, 238, ${ring / 45})`;
                context.lineWidth = 1 + ring / 8;
                context.strokeRect(-radius, -radius * .65, radius * 2, radius * 1.3);
                context.restore();
            }
            context.restore();
        }
    });
    if (!reduced && !paused && !document.hidden) frame = requestAnimationFrame(render);
}
render(100);
function select(index)
{
    scene = index;
    const names = ["WATER WAVE", "GRIDWAVE", "LIGHT TUNNEL"];
    document.documentElement.style.setProperty("--accent", index === 0 ? "#f598f2" : "#ffffff");
    canvases.forEach((canvas, i) => canvas.classList.toggle("active", i === index));
    document.querySelectorAll("[data-scene]").forEach((button, i) =>
    {
        button.classList.toggle("selected", i === index);
        button.setAttribute("aria-pressed", String(i === index));
    });
    document.querySelector("#study-name").textContent = `MOTION STUDY / ${names[scene]}`;
}
document.querySelectorAll("[data-scene]").forEach((button) => button.addEventListener("click", () => select(Number(button.dataset.scene))));
document.querySelector("#pause").addEventListener("click", (event) =>
{
    paused = !paused;
    event.currentTarget.textContent = paused ? "Resume motion ▷" : "Pause motion Ⅱ";
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    cancelAnimationFrame(frame);
    render(performance.now());
});
window.addEventListener("resize", () => { if (paused || reduced) render(performance.now()); });
document.addEventListener("visibilitychange", () =>
{
    cancelAnimationFrame(frame);
    if (!document.hidden) render(performance.now());
});
const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
function clock()
{
    const now = new Date();
    document.querySelector("#clock").textContent = `CUP ${formatter.format(now)}`;
    document.querySelector("#clock").dateTime = now.toISOString();
}
clock();
const clockId = setInterval(clock, 1000);
window.addEventListener("pagehide", () =>
{
    cancelAnimationFrame(frame);
    clearInterval(clockId);
});
const menu = document.querySelector("#mobile-menu");
const toggle = document.querySelector(".menu-toggle");
function closeMenu()
{
    menu.classList.remove("open");
    menu.inert = true;
    toggle.textContent = "Menu";
    toggle.setAttribute("aria-expanded", "false");
}
toggle.addEventListener("click", () =>
{
    if (menu.classList.contains("open")) closeMenu();
    else
    {
        menu.classList.add("open");
        menu.inert = false;
        toggle.textContent = "Close";
        toggle.setAttribute("aria-expanded", "true");
    }
});
const dialog = document.querySelector("#panel");
const panels =
{
    Works: "<p>Three original procedural studies explore rhythm, structure and light. Choose a study on the homepage to change the entire visual world.</p><ul><li>01 / Water wave <span>Fluid motion</span></li><li>02 / Gridwave <span>Digital landscapes</span></li><li>03 / Light tunnel <span>Spatial experiments</span></li></ul>",
    Services: "<p>From the first question to the final interaction.</p><ul><li>Brand strategy <span>Clarity & positioning</span></li><li>Visual identity <span>Systems with character</span></li><li>Web experiences <span>Purposeful & expressive</span></li><li>Creative direction <span>A wider perspective</span></li></ul>",
    About: "<p>I’m Viktor, an independent designer combining clear thinking with an experimental spirit. I work with ambitious people to create brands and digital experiences that feel distinctly their own.</p><p>This fictional portfolio uses original local Canvas artwork instead of the source’s externally hosted videos; Arial replaces Figtree. Prompt source © 2026 Nomaan Khan, MIT. No accounts, tracking or backend.</p>",
    Contact: "<p>Tell me a little about your next chapter. This browser-only project brief is a demonstration; it does not send an email.</p>"
};
document.querySelectorAll("[data-panel]").forEach((button) => button.addEventListener("click", () =>
{
    closeMenu();
    const name = button.dataset.panel;
    document.querySelector("#panel-title").textContent = name;
    document.querySelector("#panel-content").innerHTML = panels[name];
    document.querySelector("#contact-form").hidden = name !== "Contact";
    dialog.showModal();
}));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
document.querySelector("form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const message = document.querySelector("#message").value.trim();
    document.querySelector("#status").textContent = !name || message.length < 10 ? "Add your name and at least 10 meaningful message characters." : `Thanks, ${name}. Your local brief is ready. Nothing has been sent or saved.`;
});
