import { bodies } from "./content.js";
import { SolarScene } from "./scene.js";

const $ = selector => document.querySelector(selector);
const scene = new SolarScene($("#universe"), bodies);
const labels = [];
let selected = 3;
let days = 0;
let playing = false;
let touring = false;
let tourIndex = -1;
let previousTime = performance.now();

if (!scene.gl)
{
    $("#fallback").hidden = false;
}

function selectBody(index, focus = true)
{
    selected = index;
    const body = bodies[index];
    $("#body-kicker").textContent = body.kicker;
    $("#body-name").textContent = body.name;
    $("#body-symbol").textContent = body.symbol;
    $("#body-note").textContent = body.note;
    $("#facts").replaceChildren(...body.facts.map(([name, value]) =>
    {
        const div = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = name;
        dd.textContent = value;
        div.append(dt, dd);
        return div;
    }));
    document.querySelectorAll(".body-selector button").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    if (focus)
    {
        scene.focus = index;
        scene.zoom = 1;
    }
    $("#announcement").textContent = `${body.name}. ${body.note}`;
}

bodies.forEach((body, index) =>
{
    const button = document.createElement("button");
    button.innerHTML = `<span class="planet-dot" style="--planet:${body.color}"></span>${body.name}`;
    button.setAttribute("aria-label", `Explore ${body.name}`);
    button.setAttribute("aria-pressed", String(index === selected));
    button.addEventListener("click", () => selectBody(index));
    $("#body-selector").append(button);
    const label = document.createElement("span");
    label.className = "body-label";
    label.textContent = body.name.toUpperCase();
    $("#labels").append(label);
    labels.push(label);
    const section = document.createElement("article");
    section.className = "tour-stop";
    section.id = `stop-${body.id}`;
    section.innerHTML = `<div class="tour-copy"><span class="stop-number">${String(index + 1).padStart(2, "0")} / 09 — ${body.kind.toUpperCase()}</span><h2>${body.name}</h2><p>${body.caption}</p><p>${body.facts[0][1]} across</p>${index < 8 ? `<a href="#stop-${bodies[index + 1].id}">Next: ${bodies[index + 1].name} ↓</a>` : '<button id="tour-reveal">Show the true scale ↗</button><p><a href="#walk">Then walk it yourself ↓</a></p>'}</div>`;
    $("#tour-stops").append(section);
});

function setScale(truth)
{
    scene.targetScale = truth ? 1 : 0;
    scene.focus = null;
    scene.zoom = 1;
    $("#readable").setAttribute("aria-pressed", String(!truth));
    $("#true-scale").setAttribute("aria-pressed", String(truth));
    $("#scale-caption").textContent = truth ? "TRUE SCALE · ONE RULER FOR EVERYTHING" : "READABLE SCALE · NOT TO SCALE";
    $("#announcement").textContent = truth ? "True scale. Planet sizes and orbital distances now share the same scale." : "Readable scale. Sizes and distances are exaggerated.";
}

$("#readable").addEventListener("click", () => setScale(false));
$("#true-scale").addEventListener("click", () => setScale(true));
$("#overview").addEventListener("click", () =>
{
    scene.focus = null;
    scene.zoom = 1;
    scene.azimuth = .4;
    scene.elevation = .62;
});
scene.onSelect = index => selectBody(index);
$("#play").addEventListener("click", () =>
{
    playing = !playing;
    $("#play").textContent = playing ? "Ⅱ" : "▶";
    $("#play").setAttribute("aria-pressed", String(playing));
    $("#play").setAttribute("aria-label", playing ? "Pause orbital motion" : "Play orbital motion");
});
$("#time").addEventListener("input", event =>
{
    days = Number(event.target.value);
});

function setMode(tour)
{
    touring = tour;
    document.body.classList.toggle("touring", tour);
    $("#tour-stops").hidden = !tour;
    $("#explore").classList.toggle("active", !tour);
    $("#tour").classList.toggle("active", tour);
    $("#explore").setAttribute("aria-pressed", String(!tour));
    $("#tour").setAttribute("aria-pressed", String(tour));
    if (playing) $("#play").click();
    tourIndex = -1;
    setScale(false);
    scene.focus = null;
    window.scrollTo(0, 0);
    if (!tour) selectBody(selected, false);
}

$("#tour").addEventListener("click", () => setMode(true));
$("#explore").addEventListener("click", () => setMode(false));
$("#tour-reveal").addEventListener("click", () =>
{
    setScale(true);
    $("#tour-reveal").textContent = "One scale. Mostly empty space.";
});

function streetTable()
{
    const input = $("#sun-size");
    const inches = Number(input.value);
    if (!Number.isFinite(inches) || inches < 1 || inches > 100)
    {
        input.setCustomValidity("Use a Sun diameter between 1 and 100 inches.");
        $("#walk-summary").textContent = "Choose a diameter between 1 and 100 inches.";
        return;
    }
    input.setCustomValidity("");
    $("#street-table").replaceChildren(...bodies.map(body =>
    {
        const diameter = body.diameterKm / bodies[0].diameterKm * inches;
        const feet = body.distanceKm / bodies[0].diameterKm * inches / 12;
        const row = document.createElement("tr");
        const cells = [body.name, `${diameter.toFixed(diameter < .1 ? 3 : 2)} in`, feet > 5280 ? `${(feet / 5280).toFixed(2)} mi` : `${feet.toFixed(1)} ft`];
        cells.forEach(value =>
        {
            const td = document.createElement("td");
            td.textContent = value;
            row.append(td);
        });
        return row;
    }));
    const miles = bodies[8].distanceKm / bodies[0].diameterKm * inches / 12 / 5280;
    $("#walk-summary").textContent = `With a ${inches}-inch Sun, Neptune is ${miles.toFixed(2)} miles away. Earth is ${(bodies[3].diameterKm / bodies[0].diameterKm * inches).toFixed(3)} inches wide.`;
}

$("#sun-size").addEventListener("input", streetTable);
streetTable();
selectBody(3, false);

function frame(time)
{
    const dt = Math.min(.05, (time - previousTime) / 1000);
    previousTime = time;
    if (playing)
    {
        days = (days + Number($("#speed").value) * dt) % 3650;
        $("#time").value = String(Math.floor(days));
    }
    $("#day-count").textContent = `DAY ${String(Math.floor(days)).padStart(4, "0")}`;
    if (touring)
    {
        const stops = [...document.querySelectorAll(".tour-stop")];
        let index = 0;
        stops.forEach((stop, i) =>
        {
            if (stop.getBoundingClientRect().top < innerHeight * .55) index = i;
        });
        if (index !== tourIndex)
        {
            tourIndex = index;
            scene.focus = index;
            scene.zoom = 1;
            scene.azimuth = bodies[index].tourAngleDeg * Math.PI / 180;
            scene.elevation = .35;
            scene.targetScale = 0;
        }
    }
    const projected = scene.render(days, dt);
    projected.forEach((p, index) =>
    {
        const label = labels[index];
        const mobile = innerWidth < 761;
        const visible = !touring && scene.focus === null && p.depth > 0 && p.x > 25 && p.x < innerWidth - 25 && p.y > (mobile ? 300 : 180) && p.y < (mobile ? 490 : innerHeight - 190);
        label.hidden = !visible;
        label.style.left = `${p.x}px`;
        label.style.top = `${p.y + Math.max(2, p.radius)}px`;
        label.classList.toggle("selected", index === selected);
    });
    if (projected[3])
    {
        const pixels = Math.max(0, projected[3].radius * 2);
        $("#pixel").textContent = `${pixels < .01 ? pixels.toFixed(4) : pixels.toFixed(2)} px`;
        $("#pixel").dataset.value = String(pixels);
    }
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
