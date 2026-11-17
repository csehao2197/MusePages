"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name, id = "") => `<svg class="icon" ${id ? `id="${id}"` : ""} aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
$$("[data-icon]").forEach((element) =>
{
    element.outerHTML = icon(element.dataset.icon, element.id);
});

// Coordinates use a fixed 6 × 6 grid: x grows right, y grows down.
const missions =
{
    drone:
    [
        { name: "A little lift-off.", short: "Lift-off", topic: "FLIGHT BASICS", start: [0, 5], goal: [5, 0], stars: [[1, 4], [3, 2], [4, 0]], blocks: [[2, 4], [2, 3], [4, 3], [4, 4]], lesson: "Every great pilot starts with a small step. Navigate the training zone and bring your drone home." },
        { name: "Find your flow.", short: "Find your flow", topic: "ROUTE PLANNING", start: [0, 5], goal: [5, 0], stars: [[0, 2], [3, 3], [5, 2]], blocks: [[1, 4], [1, 3], [2, 1], [3, 1], [4, 4]], lesson: "Pause before you fly. Trace a route that connects every star without crossing an obstacle." },
        { name: "The long way home.", short: "Detour", topic: "PROBLEM SOLVING", start: [0, 5], goal: [5, 0], stars: [[0, 0], [3, 4], [5, 3]], blocks: [[2, 0], [2, 1], [2, 2], [2, 3], [4, 1], [4, 2]], lesson: "A wall is not the end of the road. Look for an opening and try a different path." },
        { name: "Thread the needle.", short: "Narrow passage", topic: "PRECISION", start: [0, 5], goal: [5, 0], stars: [[1, 3], [3, 1], [4, 4]], blocks: [[0, 3], [2, 3], [3, 3], [5, 3], [2, 1], [4, 1]], lesson: "Small gaps need careful thinking. Find the safe passages between both sides of the zone." },
        { name: "All points connected.", short: "Star circuit", topic: "SEQUENCING", start: [0, 5], goal: [5, 0], stars: [[0, 0], [5, 5], [2, 2]], blocks: [[1, 1], [1, 2], [3, 4], [4, 4], [3, 1]], lesson: "Choose the order of your waypoints. A good route visits every star before the finish." },
        { name: "Ready for orbit.", short: "Final approach", topic: "FLIGHT CHALLENGE", start: [0, 5], goal: [5, 0], stars: [[1, 1], [4, 5], [5, 2]], blocks: [[2, 2], [2, 3], [2, 4], [4, 1], [4, 2], [0, 3]], lesson: "Put your navigation skills together. Explore, collect, and land to finish your flight path." }
    ],
    robot:
    [
        { name: "One command at a time.", short: "First steps", topic: "FORWARD & TURN", start: [0, 5], goal: [3, 2], stars: [[0, 3], [2, 2]], blocks: [[2, 4], [4, 3]], lesson: "Your robot starts facing north. Program a route using Forward, Left, and Right. Turns rotate in place." },
        { name: "A new perspective.", short: "Turn a corner", topic: "DIRECTION", start: [0, 5], goal: [4, 1], stars: [[2, 5], [4, 3]], blocks: [[0, 3], [1, 3], [2, 3], [3, 2]], lesson: "Left is relative to the robot, not the screen. Watch the small direction arrow as your program runs." },
        { name: "Think around the block.", short: "Around the block", topic: "DEBUGGING", start: [0, 5], goal: [4, 1], stars: [[1, 3], [3, 2]], blocks: [[2, 3], [2, 4], [3, 4], [4, 4]], lesson: "A collision stops the program. Read the feedback, edit your commands, and run again from the start." },
        { name: "Make every move count.", short: "Pathfinder", topic: "PLANNING", start: [1, 5], goal: [5, 1], stars: [[1, 2], [4, 2]], blocks: [[2, 2], [3, 2], [3, 3], [3, 4]], lesson: "Plan the whole route before you press Run. You have room for up to 24 commands." },
        { name: "The scenic route.", short: "Logic loop", topic: "SEQUENCE DESIGN", start: [0, 5], goal: [5, 0], stars: [[0, 1], [4, 1], [4, 4]], blocks: [[2, 2], [2, 3], [2, 4], [3, 3]], lesson: "A star off the direct route needs a detour. Keep track of your position and facing direction." },
        { name: "Supplies before take-off.", short: "Supply run", topic: "ORDER MATTERS", start: [0, 5], goal: [3, 5], stars: [[0, 3], [4, 3]], blocks: [[2, 3], [2, 4]], supply: [4, 5], lesson: "Your final mission has a dependency: collect the cyan supply crate before entering the landing pad. Order matters." }
    ]
};
let mode = "drone";
let level = 0;
let position;
let facing;
let collected;
let hasSupply;
let moves;
let completed;
let running = false;
let execution = 0;
let commands = [];
let progress = {};
let storageAvailable = true;
try
{
    const stored = JSON.parse(localStorage.getItem("orbit-academy-progress") || "{}");
    if (stored && typeof stored === "object" && !Array.isArray(stored))
    {
        for (const key of Object.keys(stored))
        {
            if (/^(drone|robot)-[0-5]$/.test(key) && stored[key] === true)
            {
                progress[key] = true;
            }
        }
    }
}
catch
{
    storageAvailable = false;
}
const keyOf = ([x, y]) => `${x},${y}`;
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const mission = () => missions[mode][level];

function message(text, type = "")
{
    $("#feedback").textContent = text;
    $("#feedback").className = `feedback ${type}`;
}

function renderGrid()
{
    const current = mission();
    const cells = [];
    for (let y = 0; y < 6; y++)
    {
        for (let x = 0; x < 6; x++)
        {
            const point = [x, y];
            const blocked = current.blocks.some((entry) => same(entry, point));
            const star = current.stars.some((entry) => same(entry, point)) && !collected.has(keyOf(point));
            const goal = same(current.goal, point);
            const supply = current.supply && same(current.supply, point) && !hasSupply;
            const player = same(position, point);
            const descriptions = [`Column ${x + 1}, row ${y + 1}`];
            if (blocked) descriptions.push("obstacle");
            if (star) descriptions.push("star");
            if (goal) descriptions.push("landing pad");
            if (supply) descriptions.push("supply crate");
            if (player) descriptions.push(mode === "robot" ? `robot facing ${["north", "east", "south", "west"][facing]}` : "drone");
            cells.push(`<div class="cell${blocked ? " obstacle" : ""}${star ? " star" : ""}${goal ? " goal" : ""}${supply ? " supply" : ""}" aria-label="${descriptions.join(", ")}">${star ? icon("star") : goal ? icon("flag") : supply ? icon("package") : ""}${player ? `<span class="player ${mode} ${$("#craft").value === "vector" ? "vector" : ""}"><img src="assets/${mode}.svg" alt="">${mode === "robot" ? `<span class="facing" style="transform:rotate(${facing * 90}deg)">▲</span>` : ""}</span>` : ""}</div>`);
        }
    }
    $("#arena").innerHTML = cells.join("");
    $("#position").textContent = `${String(position[0] + 1).padStart(2, "0")} : ${String(position[1] + 1).padStart(2, "0")}`;
    $("#star-count").textContent = `${collected.size} / ${current.stars.length}`;
    $("#moves").textContent = String(moves).padStart(2, "0");
    $("#stars-done").style.color = collected.size === current.stars.length ? "#b6e895" : "";
    $("#finish-done").style.color = completed ? "#b6e895" : "";
    if (mode === "robot" && current.supply)
    {
        $("#obstacle-objective").textContent = hasSupply ? "Supply crate collected" : "Collect the supply crate first";
    }
}

function renderLibrary()
{
    $("#mission-cards").innerHTML = missions[mode].map((item, index) =>
    {
        const done = progress[`${mode}-${index}`] === true;
        return `<button class="mission-card ${done ? "complete" : ""}" data-level="${index}" aria-pressed="${level === index}" aria-label="Mission ${index + 1}: ${item.short}${done ? ", completed" : ""}"><span class="mission-number">${String(index + 1).padStart(2, "0")}</span>${icon(done ? "circle-check" : index === level ? "arrow-up-right" : "circle")}<strong>${item.short}</strong><small>${done ? "Completed" : index === level ? "In progress" : "Ready to explore"}</small></button>`;
    }).join("");
    $("#progress-count").textContent = `${missions[mode].filter((_, index) => progress[`${mode}-${index}`]).length} of 6 completed`;
}

function resetPosition()
{
    execution++;
    running = false;
    position = [...mission().start];
    facing = 0;
    collected = new Set();
    hasSupply = false;
    moves = 0;
    completed = false;
    updateProgram();
    renderGrid();
}

function loadMission(index = 0)
{
    level = index;
    commands = [];
    resetPosition();
    const current = mission();
    $("#mission-title").textContent = current.name;
    $("#mission-kicker").textContent = `MISSION ${String(level + 1).padStart(2, "0")} / ${current.topic}`;
    $("#level-number").textContent = String(level + 1).padStart(2, "0");
    $("#brief").textContent = current.lesson;
    $("#goal-stars").textContent = `${current.stars.length} stars`;
    $("#obstacle-objective").textContent = current.supply ? "Collect the supply crate first" : "Navigate around obstacles";
    message(mode === "drone" ? `Ready, pilot? Collect all ${current.stars.length} stars, then reach the landing pad.` : current.supply ? "Collect both stars and the supply crate before finishing." : "Build your program, then press Run. Your robot starts facing north.");
    renderLibrary();
}

function switchMode(nextMode, focus = false)
{
    mode = nextMode;
    $$(".lab-tabs button").forEach((button) =>
    {
        button.setAttribute("aria-selected", String(button.dataset.mode === mode));
        button.tabIndex = button.dataset.mode === mode ? 0 : -1;
    });
    $("#simulator").setAttribute("aria-labelledby", `${mode}-tab`);
    $("#flight-controls").hidden = mode !== "drone";
    $("#robot-controls").hidden = mode !== "robot";
    $("#controls-title").textContent = mode === "drone" ? "Take the controls" : "Build your program";
    $("#tip-text").textContent = mode === "drone" ? "Think one move ahead. The shortest route isn't always the safest." : "A turn is not a step. Forward always follows the robot's arrow.";
    $("#path-heading").textContent = ` / ${mode === "drone" ? "Drone" : "Robot"}`;
    $("#arena").setAttribute("aria-label", mode === "drone" ? "Flight grid. Use arrow keys to move." : "Robot grid. Facing arrow shows direction. Use the programming controls.");
    $("#craft").innerHTML = mode === "drone" ? '<option value="scout">Scout S1</option><option value="vector">Vector X2</option>' : '<option value="atlas">Atlas H1</option><option value="vector">Neo H2</option>';
    $("#switch-path").innerHTML = `${mode === "drone" ? "Explore robot coding" : "Explore drone flight"} ${icon("arrow-up-right")}`;
    $(".next-step h3").textContent = mode === "drone" ? "From flying to thinking in code." : "Take your ideas to the skies.";
    $(".next-step p").textContent = mode === "drone" ? "Meet your robot. Give it a plan. See your logic come to life." : "Trade commands for direct control in the drone training zone.";
    loadMission();
    if (focus)
    {
        $(`#${mode}-tab`).focus();
    }
}

function finish()
{
    completed = true;
    progress[`${mode}-${level}`] = true;
    try
    {
        localStorage.setItem("orbit-academy-progress", JSON.stringify(progress));
    }
    catch
    {
        storageAvailable = false;
        $("#save-label").textContent = "Progress available this session only";
    }
    message("Mission complete! Great thinking. Choose another mission below to keep exploring.", "success");
    renderLibrary();
}

function move(dx, dy)
{
    if (completed) return false;
    const next = [position[0] + dx, position[1] + dy];
    if (next.some((value) => value < 0 || value > 5))
    {
        message("Boundary reached. Stay inside the training zone.", "warning");
        return false;
    }
    if (mission().blocks.some((point) => same(point, next)))
    {
        message("Obstacle ahead. Try another route.", "warning");
        return false;
    }
    position = next;
    moves++;
    if (mission().stars.some((point) => same(point, position)))
    {
        collected.add(keyOf(position));
    }
    if (mission().supply && same(mission().supply, position))
    {
        hasSupply = true;
    }
    if (same(position, mission().goal))
    {
        if (collected.size !== mission().stars.length)
        {
            message("Not quite yet. Collect every star before finishing.", "warning");
        }
        else if (mission().supply && !hasSupply)
        {
            message("The supply crate comes first. Pick it up before finishing.", "warning");
        }
        else
        {
            finish();
        }
    }
    else
    {
        message(`${mode === "drone" ? "Looking good, pilot." : "Following your plan."} ${collected.size} of ${mission().stars.length} stars collected.${hasSupply ? " Supplies secured." : ""}`);
    }
    renderGrid();
    return true;
}

function updateProgram(active = -1)
{
    const names = { F: "Forward", L: "Turn left", R: "Turn right" };
    $("#program").innerHTML = commands.map((command, index) => `<li class="${index === active ? "executing" : ""}" aria-label="Step ${index + 1}: ${names[command]}">${index + 1} ${command === "F" ? "↑" : command === "L" ? "↰" : "↱"}</li>`).join("");
    $("#command-count").textContent = `${commands.length} / 24`;
    $$("[data-command], #undo, #clear, #run").forEach((button) => button.disabled = running);
    $("#undo").disabled = running || commands.length === 0;
    $("#clear").disabled = running || commands.length === 0;
    $("#run").disabled = running || commands.length === 0;
    $$("[data-command]").forEach((button) => button.disabled = running || commands.length >= 24);
}

async function runProgram()
{
    if (running || commands.length === 0) return;
    resetPosition();
    running = true;
    const token = execution;
    const program = [...commands];
    updateProgram();
    for (let index = 0; index < program.length; index++)
    {
        if (token !== execution) return;
        updateProgram(index);
        await new Promise((resolve) => setTimeout(resolve, 220));
        if (token !== execution) return;
        const command = program[index];
        if (command === "F")
        {
            const [dx, dy] = [[0, -1], [1, 0], [0, 1], [-1, 0]][facing];
            if (!move(dx, dy))
            {
                message(`Program stopped at step ${index + 1}: blocked movement. Edit the route and run again.`, "warning");
                break;
            }
        }
        else
        {
            facing = (facing + (command === "L" ? 3 : 1)) % 4;
            renderGrid();
        }
        if (completed) break;
    }
    if (token !== execution) return;
    running = false;
    updateProgram();
    if (!completed && !$("#feedback").classList.contains("warning"))
    {
        message("Program finished. Not at the goal yet. Edit your route and run again.");
    }
}

$$("[data-mode]").forEach((button) => button.addEventListener("click", () => switchMode(button.dataset.mode)));
$$(".lab-tabs button").forEach((button) => button.addEventListener("keydown", (event) =>
{
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    {
        event.preventDefault();
        const next = event.key === "Home" ? "drone" : event.key === "End" ? "robot" : mode === "drone" ? "robot" : "drone";
        switchMode(next, true);
    }
}));
$("#switch-path").addEventListener("click", () =>
{
    switchMode(mode === "drone" ? "robot" : "drone", true);
    $("#lab").scrollIntoView({ block: "start" });
});
$("#mission-cards").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-level]");
    if (!button) return;
    loadMission(Number(button.dataset.level));
    $("#lab").scrollIntoView({ block: "start" });
    $("#arena").focus({ preventScroll: true });
});
const directions = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
$$("[data-move]").forEach((button) => button.addEventListener("click", () =>
{
    if (mode === "drone") move(...directions[button.dataset.move]);
}));
$("#arena").addEventListener("keydown", (event) =>
{
    const direction = event.key.replace("Arrow", "").toLowerCase();
    if (mode === "drone" && directions[direction])
    {
        event.preventDefault();
        move(...directions[direction]);
    }
});
$$("[data-command]").forEach((button) => button.addEventListener("click", () =>
{
    if (running || commands.length >= 24) return;
    commands.push(button.dataset.command);
    updateProgram();
}));
$("#undo").addEventListener("click", () =>
{
    commands.pop();
    updateProgram();
});
$("#clear").addEventListener("click", () =>
{
    commands = [];
    updateProgram();
});
$("#run").addEventListener("click", runProgram);
$("#reset").addEventListener("click", () =>
{
    resetPosition();
    message("Mission reset. Your route is ready for another try.");
});
$("#craft").addEventListener("change", renderGrid);
$$(".guide-open").forEach((button) => button.addEventListener("click", () => $("#guide").showModal()));
$("#close-guide").addEventListener("click", () => $("#guide").close());
$("#start-learning").addEventListener("click", () =>
{
    $("#guide").close();
    $("#arena").focus();
});
if (!storageAvailable)
{
    $("#save-label").textContent = "Progress available this session only";
}
const controlsPanel = $(".controls");
const mobileLayout = window.matchMedia("(max-width: 600px)");
function positionControls()
{
    if (mobileLayout.matches)
    {
        $("#mobile-controls").append(controlsPanel);
    }
    else
    {
        $(".control-column").insertBefore(controlsPanel, $(".tip"));
    }
}
mobileLayout.addEventListener("change", positionControls);
positionControls();
switchMode("drone");
