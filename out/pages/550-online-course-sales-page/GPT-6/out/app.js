import { content } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const safeStorage =
{
    get(key)
    {
        try
        {
            return localStorage.getItem(`${content.courseSlug}:${key}`);
        }
        catch
        {
            return null;
        }
    },
    set(key, value)
    {
        try
        {
            localStorage.setItem(`${content.courseSlug}:${key}`, value);
        }
        catch
        {
            // The page remains usable when browser storage is unavailable.
        }
    }
};

function element(tag, className, text)
{
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

content.modules.forEach((module, index) =>
{
    const details = element("details");
    if (index === 0) details.open = true;
    const summary = element("summary");
    summary.append(
        element("span", "module-number", String(index + 1).padStart(2, "0")),
        element("span", "module-title", module.title),
        element("span", "module-time", `4 lessons · ${module.duration} min`),
        element("span", "expand-icon", "+")
    );
    summary.lastChild.setAttribute("aria-hidden", "true");
    const body = element("div", "module-body");
    body.append(element("p", "", module.description));
    const lessons = element("ul", "lesson-list");
    module.lessons.forEach(([title, duration]) =>
    {
        const lesson = element("li");
        lesson.append(element("span", "", title), element("span", "", `${duration} min`));
        lessons.append(lesson);
    });
    body.append(lessons, element("p", "module-outcome", module.outcome));
    details.append(summary, body);
    $("#modules").append(details);
});

content.results.forEach((result) =>
{
    const article = element("article", "result-card");
    const art = element("div", "result-art");
    const image = element("img");
    image.src = result.image;
    image.alt = result.alt;
    image.width = 650;
    image.height = 420;
    image.loading = "lazy";
    art.append(image);
    article.append(
        art,
        element("span", "result-label", result.label),
        element("h3", "", result.title),
        element("p", "", result.description),
        element("span", "result-skill", result.skill)
    );
    $("#results-grid").append(article);
});

const checkIcon = '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
content.inclusions.forEach((inclusion) =>
{
    const item = element("li");
    item.innerHTML = checkIcon;
    item.append(element("span", "", inclusion));
    $("#included-list").append(item);
});

content.faqs.forEach(([question, answer]) =>
{
    const details = element("details");
    const summary = element("summary", "", question);
    const icon = element("span", "expand-icon", "+");
    icon.setAttribute("aria-hidden", "true");
    summary.append(icon);
    const body = element("div", "faq-answer");
    body.append(element("p", "", answer));
    details.append(summary, body);
    $("#faq-list").append(details);
});

let plan = safeStorage.get("plan") === "three" ? "three" : "full";
function renderPlan()
{
    const selected = content.plans[plan];
    $$("[data-plan]").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(button.dataset.plan === plan));
    });
    $("#price-label").textContent = selected.label;
    $("#plan-price").replaceChildren(document.createTextNode(`$${selected.amount} `), element("span", "", plan === "three" ? "USD × 3" : "USD"));
    $("#plan-detail").textContent = selected.detail;
    $$("[data-plan-cta]").forEach((cta) =>
    {
        const arrow = element("span", "", "↗");
        arrow.setAttribute("aria-hidden", "true");
        cta.replaceChildren(document.createTextNode(`${selected.cta} `), arrow);
    });
    $("#enroll-plan").textContent = selected.summary;
}
$$("[data-plan]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        plan = button.dataset.plan;
        safeStorage.set("plan", plan);
        renderPlan();
    });
});
renderPlan();

const intro = $("#intro-modal");
const enrollment = $("#enroll-modal");
$("#watch-intro").addEventListener("click", () => intro.showModal());
$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$$("dialog").forEach((dialog) =>
{
    dialog.addEventListener("click", (event) =>
    {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom))
        {
            dialog.close();
        }
    });
});
$("#intro-to-sample").addEventListener("click", () =>
{
    intro.close();
    $("#game-start").scrollIntoView({ block: "center", behavior: "instant" });
    $("#game-start").focus({ preventScroll: true });
});
$$("[data-enroll]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        $("#demo-consent").checked = false;
        $("#confirm-enroll").disabled = true;
        $("#enroll-status").textContent = "";
        renderPlan();
        enrollment.showModal();
    });
});
$("#demo-consent").addEventListener("change", (event) =>
{
    $("#confirm-enroll").disabled = !event.target.checked;
});
$("#confirm-enroll").addEventListener("click", () =>
{
    if (!$("#demo-consent").checked) return;
    $("#enroll-status").textContent = "Preview complete. You selected " + content.plans[plan].summary + ". Nothing was charged or submitted.";
    $("#confirm-enroll").disabled = true;
});

const canvas = $("#sample-game");
const context = canvas.getContext("2d");
const grid =
{
    columns: 14,
    rows: 7,
    cell: 40
};
const starPositions = [[3, 1], [10, 1], [6, 3], [2, 5], [11, 5]];
let player = { x: 1, y: 3 };
let stars = starPositions.map(([x, y]) => ({ x, y, collected: false }));
let playing = false;
let won = false;

function drawGame()
{
    context.fillStyle = "#C7D7AD";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < grid.rows; y++)
    {
        for (let x = 0; x < grid.columns; x++)
        {
            context.fillStyle = (x + y) % 2 ? "#CDDCB6" : "#C7D7AD";
            context.fillRect(x * grid.cell, y * grid.cell, grid.cell, grid.cell);
            if ((x * 3 + y * 5) % 9 === 0)
            {
                context.fillStyle = "#9FB986";
                context.fillRect(x * 40 + 10, y * 40 + 27, 4, 7);
                context.fillRect(x * 40 + 15, y * 40 + 25, 4, 9);
            }
        }
    }
    stars.filter((star) => !star.collected).forEach((star) =>
    {
        const x = star.x * 40 + 20;
        const y = star.y * 40 + 20;
        context.fillStyle = "#B58A26";
        context.fillRect(x - 7, y - 7, 14, 14);
        context.fillStyle = "#F6D371";
        context.fillRect(x - 5, y - 10, 10, 20);
        context.fillRect(x - 10, y - 5, 20, 10);
        context.fillStyle = "#FFF0B8";
        context.fillRect(x - 3, y - 3, 6, 6);
    });
    const px = player.x * 40;
    const py = player.y * 40;
    context.fillStyle = "#809A66";
    context.fillRect(px + 6, py + 32, 29, 4);
    context.fillStyle = "#3F5944";
    context.fillRect(px + 8, py + 19, 23, 13);
    context.fillRect(px + 11, py + 30, 6, 7);
    context.fillRect(px + 24, py + 30, 6, 7);
    context.fillStyle = "#E9BD82";
    context.fillRect(px + 11, py + 8, 18, 14);
    context.fillStyle = "#E8B54D";
    context.fillRect(px + 8, py + 5, 24, 6);
    context.fillRect(px + 5, py + 10, 29, 4);
    context.fillStyle = "#334332";
    context.fillRect(px + 15, py + 15, 3, 3);
    context.fillRect(px + 25, py + 15, 3, 3);
    context.fillStyle = "#C87C45";
    context.fillRect(px + 5, py + 21, 8, 9);
    if (!playing && !won)
    {
        context.fillStyle = "#334332D9";
        context.fillRect(120, 103, 320, 74);
        context.fillStyle = "#FAF6EE";
        context.textAlign = "center";
        context.font = "bold 18px sans-serif";
        context.fillText("One small quest. Five stars.", 280, 135);
        context.font = "12px sans-serif";
        context.fillText("Start below. You already know enough.", 280, 157);
    }
}

function move(direction)
{
    if (!playing) return;
    const deltas =
    {
        left: [-1, 0],
        right: [1, 0],
        up: [0, -1],
        down: [0, 1]
    };
    const [dx, dy] = deltas[direction];
    player.x = Math.max(0, Math.min(grid.columns - 1, player.x + dx));
    player.y = Math.max(0, Math.min(grid.rows - 1, player.y + dy));
    stars.forEach((star) =>
    {
        if (star.x === player.x && star.y === player.y) star.collected = true;
    });
    const collected = stars.filter((star) => star.collected).length;
    $("#game-score").textContent = content.game.score(collected);
    if (collected === 5)
    {
        playing = false;
        won = true;
        $("#game-message").textContent = content.game.won;
        $("#game-start").textContent = content.game.restart;
    }
    drawGame();
}

$("#game-start").addEventListener("click", () =>
{
    player = { x: 1, y: 3 };
    stars = starPositions.map(([x, y]) => ({ x, y, collected: false }));
    playing = true;
    won = false;
    $("#game-score").textContent = content.game.score(0);
    $("#game-message").textContent = content.game.active;
    $("#game-start").textContent = content.game.restart;
    drawGame();
    canvas.focus({ preventScroll: true });
});
canvas.addEventListener("keydown", (event) =>
{
    const keys =
    {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down"
    };
    const direction = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
    if (direction)
    {
        event.preventDefault();
        move(direction);
    }
});
$$("[data-move]").forEach((button) =>
{
    button.addEventListener("click", () => move(button.dataset.move));
});
drawGame();
