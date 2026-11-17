import { runner, duck, drawSprite } from "./sprites.js";
import { content } from "../content.js";

export async function createRunner(onGameOver)
{
    await document.fonts.load('8px "Press Start 2P"');
    const canvas = document.querySelector("#game");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const overlay = document.querySelector("#game-overlay");
    const pauseButton = document.querySelector("#pause-game");
    const copy = content.gameCopy;
    const floor = 148;
    let state = "attract";
    let y = floor;
    let velocity = 0;
    let ducking = false;
    let distance = 0;
    let seconds = 0;
    let obstacles = [];
    let spawnIn = 1.8;
    let spawned = 0;
    let frame = 0;
    let previous = 0;
    let score = 0;
    let canSave = false;
    let speed = 82;
    const motionReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function sync()
    {
        canvas.dataset.state = state;
        canvas.dataset.score = String(score);
        canvas.dataset.duck = String(ducking);
        canvas.dataset.y = String(Math.round(y));
        canvas.dataset.speed = String(Math.round(speed));
        pauseButton.disabled = state === "attract" || state === "game-over";
        pauseButton.textContent = state === "paused" ? content.messages.resume : content.messages.pause;
    }
    function showOverlay(title, note, action, save = false)
    {
        overlay.hidden = false;
        overlay.innerHTML = `<span class="pixel-small">${state === "game-over" ? `${score} ${copy.scoreUnit}` : copy.ready}</span><h2 class="state-heading">${title}</h2><p>${note}</p><button data-action="start">${action}</button>${save ? `<button data-action="save">${copy.save}</button>` : ""}`;
    }
    function start()
    {
        if (state === "paused")
        {
            state = "playing";
        }
        else
        {
            state = "playing";
            y = floor;
            velocity = 0;
            ducking = false;
            distance = 0;
            seconds = 0;
            score = 0;
            spawned = 0;
            obstacles = [];
            spawnIn = 1.8;
            speed = 82;
            canSave = false;
        }
        overlay.hidden = true;
        canvas.focus({ preventScroll: true });
        sync();
    }
    function jump()
    {
        if (state !== "playing")
        {
            start();
            return;
        }
        if (y >= floor - .5)
        {
            ducking = false;
            velocity = -241;
        }
    }
    function setDuck(value)
    {
        ducking = value;
        if (value && state === "playing" && y < floor) velocity = Math.max(velocity, 220);
        sync();
    }
    function pause()
    {
        if (state === "playing")
        {
            state = "paused";
            ducking = false;
            showOverlay(copy.paused, copy.pausedNote, copy.resume);
        }
        else if (state === "paused") start();
        sync();
    }
    function gameOver()
    {
        state = "game-over";
        ducking = false;
        canSave = onGameOver(score, false);
        showOverlay(copy.over, canSave ? copy.best : copy.overNote, copy.retry, canSave);
        sync();
    }
    function backdrop()
    {
        ctx.fillStyle = "#0e152b";
        ctx.fillRect(0, 0, 320, 180);
        for (let i = 0; i < 32; i++)
        {
            ctx.fillStyle = i % 4 ? "#747d99" : "#cdd6bd";
            ctx.fillRect((i * 47 + 13) % 320, (i * 29 + 20) % 96, 1, 1);
        }
        ctx.fillStyle = "#edc583";
        ctx.fillRect(251, 28, 17, 17);
        ctx.fillRect(248, 32, 23, 10);
        ctx.fillStyle = "#0e152b";
        ctx.fillRect(259, 24, 15, 17);
        for (let layer = 0; layer < 2; layer++)
        {
            const shift = (distance * (layer ? .3 : .12)) % 42;
            for (let i = -1; i < 10; i++)
            {
                const bx = Math.floor(i * 42 - shift);
                const bh = 30 + ((i + 12) * 17) % 40 + layer * 9;
                const top = floor - bh;
                ctx.fillStyle = layer ? "#27304b" : "#1b2440";
                ctx.fillRect(bx, top, 36, bh);
                ctx.fillRect(bx + 5, top - 4, 26, 4);
                if ((i + 12) % 3 === 0)
                {
                    ctx.fillRect(bx + 15, top - 23, 6, 24);
                    ctx.fillRect(bx + 17, top - 31, 2, 10);
                }
                for (let n = 0; n < 3; n++)
                {
                    ctx.fillStyle = layer && (n + i) % 2 ? "#b18455" : "#4d5270";
                    ctx.fillRect(bx + 7 + n * 9, top + 13, 3, 5);
                    ctx.fillRect(bx + 7 + n * 9, top + 29, 3, 5);
                }
            }
        }
        ctx.fillStyle = "#c17e8e";
        ctx.fillRect(0, floor, 320, 3);
        ctx.fillStyle = "#292334";
        ctx.fillRect(0, floor + 3, 320, 29);
        ctx.fillStyle = "#514153";
        for (let i = -1; i < 18; i++)
        {
            const x = Math.floor(i * 22 - distance % 22);
            ctx.fillRect(x, floor + 6, 16, 1);
            ctx.fillRect(x + 7, floor + 15, 15, 1);
        }
        ctx.fillStyle = "#11131f";
        ctx.fillRect(0, 174, 320, 6);
    }
    function draw()
    {
        backdrop();
        for (const obstacle of obstacles)
        {
            if (obstacle.type === "chimney")
            {
                ctx.fillStyle = "#b45672";
                ctx.fillRect(Math.floor(obstacle.x), obstacle.y, obstacle.w, obstacle.h);
                ctx.fillStyle = "#dc8b8b";
                ctx.fillRect(Math.floor(obstacle.x) - 2, obstacle.y, obstacle.w + 4, 4);
                ctx.fillStyle = "#733c59";
                ctx.fillRect(Math.floor(obstacle.x) + 2, obstacle.y + 9, 5, 2);
            }
            else
            {
                ctx.fillStyle = "#53425a";
                ctx.fillRect(Math.floor(obstacle.x) + 7, 0, 1, obstacle.y);
                ctx.fillStyle = "#b3744e";
                ctx.fillRect(Math.floor(obstacle.x), obstacle.y, obstacle.w, obstacle.h);
                ctx.fillStyle = "#ffca71";
                ctx.fillRect(Math.floor(obstacle.x) + 3, obstacle.y + 3, obstacle.w - 6, obstacle.h - 6);
                ctx.fillStyle = "#fcf0c4";
                ctx.fillRect(Math.floor(obstacle.x) + 6, obstacle.y + 5, 2, 9);
            }
        }
        const sprite = ducking && y >= floor ? duck : runner;
        const bounce = state === "playing" && y >= floor && !ducking ? Math.floor(seconds * 10) % 2 : 0;
        drawSprite(ctx, sprite, 48, y - sprite.length * 1.5 - bounce, 1.5);
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = "#b7ee99";
        ctx.fillText(`${copy.hudScore} ${String(score).padStart(5, "0")}`, 10, 13);
        ctx.fillStyle = "#eac992";
        ctx.fillText(`${copy.hudSpeed} ${(speed / 82).toFixed(1)}x`, 231, 13);
        canvas.dataset.obstacles = JSON.stringify(obstacles.map(({ x, type }) => ({ x: Math.round(x), type })));
    }
    function tick(timestamp)
    {
        const dt = Math.min((timestamp - (previous || timestamp)) / 1000, .04);
        previous = timestamp;
        if (state === "playing")
        {
            seconds += dt;
            speed = Math.min(196, 82 + seconds * 1.7);
            distance += speed * dt;
            score = Math.floor(seconds * 10);
            velocity += 650 * dt;
            y = Math.min(floor, y + velocity * dt);
            if (y === floor) velocity = 0;
            spawnIn -= dt;
            if (spawnIn <= 0)
            {
                const isLow = spawned++ % 2 === 1;
                obstacles.push({ type: isLow ? "lantern" : "chimney", x: 329, y: isLow ? 114 : 129, w: isLow ? 16 : 12, h: isLow ? 20 : 19 });
                spawnIn = 1.65 + Math.random() * .5;
            }
            obstacles.forEach((obstacle) => obstacle.x -= speed * dt);
            obstacles = obstacles.filter((obstacle) => obstacle.x > -24);
            const height = ducking && y === floor ? 9 : 19;
            for (const obstacle of obstacles)
            {
                if (52 < obstacle.x + obstacle.w - 1 && 63 > obstacle.x + 1 &&
                    y - height < obstacle.y + obstacle.h - 1 && y - 1 > obstacle.y + 1)
                {
                    gameOver();
                    break;
                }
            }
            sync();
        }
        if (state === "playing" || !motionReduced || !frame) draw();
        frame++;
        requestAnimationFrame(tick);
    }
    overlay.addEventListener("click", (event) =>
    {
        if (event.target.closest('[data-action="save"]') && canSave)
        {
            onGameOver(score, true);
        }
        else if (event.target.closest("button")) start();
    });
    document.addEventListener("visibilitychange", () =>
    {
        if (document.hidden && state === "playing") pause();
    });
    sync();
    requestAnimationFrame(tick);
    return { start, jump, setDuck, pause, canvas };
}
