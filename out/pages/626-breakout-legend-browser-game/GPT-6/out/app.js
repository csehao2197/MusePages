import { createGame, step, movePaddle } from "./engine.js";
import { render } from "./renderer.js";
import { levelNames } from "./levels.js";
import { formatTime, readEntries, submitEntry } from "./leaderboard.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const screen = document.querySelector("#screen");
const pauseButton = document.querySelector("#pause-button");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const keys = new Set();
let game = createGame();
let last = performance.now();
let animation;
let uiPhase;
let uiLevel = 1;
let sound = false;
let audio;
let boardToken = 0;
let returnPhase = "idle";
let lastFocus;
const emblem = '<div class="emblem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 4h7v4H3zm11 0h7v4h-7zM7 11h10v4H7zm1 9h8"/><circle cx="18" cy="19" r="1.5"/></svg></div>';

function announce(message)
{
    document.querySelector("#announcement").textContent = message;
}

function beep(type)
{
    if (!sound) return;
    audio ||= new AudioContext();
    if (audio.state === "suspended") void audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = type === "S" ? 880 : type === "paddle" ? 220 : 440;
    gain.gain.setValueAtTime(.035, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .07);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + .08);
}

function setScreen(content)
{
    screen.hidden = !content;
    screen.innerHTML = content ? `<section class="glass-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">${content}</section>` : "";
    if (content)
    {
        lastFocus = document.activeElement;
        screen.querySelector("button, input")?.focus({ preventScroll: true });
    }
    else canvas.focus({ preventScroll: true });
}

function button(text, action, primary = false)
{
    return `<button class="${primary ? "primary" : "secondary"}" data-action="${action}">${text}</button>`;
}

function syncUI()
{
    document.querySelector("#level-value").textContent = String(game.level).padStart(2, "0");
    document.querySelector("#timer-value").textContent = formatTime(game.elapsed);
    const balls = document.querySelector("#balls-value");
    balls.innerHTML = `●<small> × ${game.balls.length}</small>`;
    balls.setAttribute("aria-label", `${game.balls.length} balls in play`);
    pauseButton.disabled = !["playing", "paused"].includes(game.phase);
    pauseButton.setAttribute("aria-label", game.phase === "paused" ? "Resume game" : "Pause game");
    document.querySelector("#machine-status").textContent = game.phase === "playing" ? levelNames[game.level - 1].toUpperCase() :
        game.phase === "paused" ? "FLIGHT ON HOLD" : game.phase === "gameover" ? "SIGNAL LOST" :
        game.phase === "victory" ? "MISSION COMPLETE" : "READY TO LAUNCH";
    document.querySelector("#field-caption").textContent = game.phase === "playing" ? "KEEP A BALL ALIVE_" : "AWAITING PLAYER INPUT_";
    if (game.level !== uiLevel)
    {
        uiLevel = game.level;
        announce(`Level ${game.level}: ${levelNames[game.level - 1]}`);
    }
    if (uiPhase === game.phase) return;
    uiPhase = game.phase;
    if (game.phase === "playing") setScreen("");
    if (game.phase === "idle")
    {
        setScreen(`${emblem}<div class="card-kicker">THE NEXT LEGEND IS YOU</div><h2 id="dialog-title">READY, PLAYER ONE?</h2><p>10 Levels · No Lives · Pure Survival<br>Keep your ball. Break their defenses.</p>${button('START GAME <span>→</span>', "start", true)}${button("VIEW LEADERBOARD", "board")}<span class="screen-note">PRESS ENTER TO BEGIN &nbsp; / &nbsp; DRAG OR USE ← →</span>`);
    }
    if (game.phase === "paused")
    {
        setScreen(`${emblem}<div class="card-kicker">TAKE A BREATHER</div><h2 id="dialog-title">FLIGHT ON HOLD</h2><p>Level ${game.level} / 10 &nbsp; · &nbsp; ${formatTime(game.elapsed)}</p>${button("RESUME GAME", "resume", true)}${button("RESTART · R", "start")}${button("QUIT TO MENU", "menu")}`);
        announce("Game paused.");
    }
    if (game.phase === "gameover")
    {
        setScreen(`${emblem}<div class="card-kicker">ONE RUN. ANOTHER LESSON.</div><h2 id="dialog-title">ALL BALLS LOST</h2><p>Level ${game.level} reached &nbsp; · &nbsp; ${formatTime(game.elapsed)}<br>The next run could be the one.</p>${button("TRY AGAIN · R", "start", true)}${button("BACK TO MENU", "menu")}`);
        announce("All balls lost. Game over.");
    }
    if (game.phase === "victory")
    {
        setScreen(`${emblem}<div class="card-kicker">TEN SECTORS. ONE LEGEND.</div><h2 id="dialog-title">BREAKOUT COMPLETE</h2><p>All 10 levels cleared in ${formatTime(game.elapsed)}.<br>Save this run to your local leaderboard.</p><form id="victory-form"><label for="player-name">Enter your name for the leaderboard</label><input id="player-name" name="name" maxlength="20" required autocomplete="nickname" placeholder="Your arcade name"><p id="form-error" class="error" role="alert"></p><button class="primary" type="submit">SAVE MY RUN</button></form>${button("SKIP & RETURN TO MENU", "menu")}`);
        announce("Breakout complete! All ten levels cleared.");
    }
}

function start()
{
    game = createGame();
    game.phase = "playing";
    keys.clear();
    last = performance.now();
    syncUI();
    announce("Level one. First contact. Game started.");
}

function menu()
{
    boardToken++;
    keys.clear();
    game = createGame();
    syncUI();
}

function pause()
{
    if (game.phase === "playing")
    {
        game.phase = "paused";
        keys.clear();
    }
    else if (game.phase === "paused")
    {
        game.phase = "playing";
        last = performance.now();
    }
    syncUI();
}

async function showBoard(player)
{
    returnPhase = player ? "idle" : game.phase === "playing" ? "paused" : game.phase;
    game.phase = "leaderboard";
    keys.clear();
    syncUI();
    const token = ++boardToken;
    setScreen(`${emblem}<div class="card-kicker">THE HALL OF LEGENDS</div><h2 id="dialog-title">TOP 10 SURVIVORS</h2><p>This browser only. Fastest completed runs first.</p><div id="board-content" role="status">Loading local runs…</div>${button("CLOSE", "close-board")}`);
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (token !== boardToken || game.phase !== "leaderboard") return;
    const container = document.querySelector("#board-content");
    try
    {
        const entries = readEntries().slice(0, 10);
        if (!entries.length)
        {
            container.innerHTML = "<p>No legends yet. Clear all ten levels<br>and put your name on the board.</p>";
            return;
        }
        const table = document.createElement("table");
        table.className = "board-table";
        table.innerHTML = "<thead><tr><th scope=\"col\">#</th><th scope=\"col\">NAME</th><th scope=\"col\">TIME</th></tr></thead>";
        const body = table.createTBody();
        entries.forEach((entry, index) =>
        {
            const row = body.insertRow();
            if (entry.id === player?.entry.id) row.className = "current";
            for (const value of [String(index + 1).padStart(2, "0"), entry.name, formatTime(entry.time)])
            {
                row.insertCell().textContent = value;
            }
        });
        container.replaceChildren(table);
        if (player)
        {
            const result = document.createElement("p");
            result.textContent = player.rank ? `Run saved. Your local rank: #${player.rank}.` : "Run saved; outside the top 50.";
            container.append(result);
        }
    }
    catch
    {
        container.innerHTML = '<p class="error">Local storage is unavailable or contains invalid data.<br>Your game still works; runs cannot be loaded here.</p>';
    }
}

screen.addEventListener("click", (event) =>
{
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "start") start();
    if (action === "resume") pause();
    if (action === "menu") menu();
    if (action === "board") void showBoard();
    if (action === "close-board")
    {
        boardToken++;
        if (returnPhase === "idle") menu();
        else
        {
            game.phase = returnPhase;
            syncUI();
        }
        if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    }
});
screen.addEventListener("submit", (event) =>
{
    event.preventDefault();
    try
    {
        const player = submitEntry(new FormData(event.target).get("name"), Math.max(1, Math.ceil(game.elapsed)));
        void showBoard(player);
    }
    catch (error)
    {
        document.querySelector("#form-error").textContent = `${error.message} Your run is still here.`;
    }
});
pauseButton.addEventListener("click", pause);
document.querySelector("#leaderboard-button").addEventListener("click", () =>
{
    if (game.phase !== "leaderboard") void showBoard();
});
document.querySelector("#sound-button").addEventListener("click", (event) =>
{
    sound = !sound;
    event.currentTarget.setAttribute("aria-pressed", String(sound));
    event.currentTarget.setAttribute("aria-label", sound ? "Mute sound" : "Enable sound");
    event.currentTarget.style.color = sound ? "#c4b5fd" : "";
    beep("S");
});
function pointer(event)
{
    if (game.phase !== "playing") return;
    const bounds = canvas.getBoundingClientRect();
    movePaddle(game, (event.clientX - bounds.left) * 800 / bounds.width);
}
canvas.addEventListener("pointerdown", (event) =>
{
    if (game.phase !== "playing") return;
    canvas.setPointerCapture(event.pointerId);
    pointer(event);
    canvas.focus({ preventScroll: true });
});
canvas.addEventListener("pointermove", (event) =>
{
    if (event.pointerType === "mouse" || event.buttons) pointer(event);
});
function keydown(event)
{
    if (event.key === "Tab" && !screen.hidden)
    {
        const items = [...screen.querySelectorAll("button, input")];
        const first = items[0];
        const end = items.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            end?.focus();
        }
        else if (!event.shiftKey && document.activeElement === end)
        {
            event.preventDefault();
            first?.focus();
        }
    }
    if (event.key === "Escape")
    {
        menu();
        return;
    }
    if (event.target instanceof HTMLInputElement) return;
    if (["ArrowLeft", "ArrowRight"].includes(event.key) && game.phase === "playing")
    {
        event.preventDefault();
        keys.add(event.key);
    }
    if (event.repeat) return;
    if (event.key.toLowerCase() === "p") pause();
    if (event.key.toLowerCase() === "r" && ["paused", "gameover"].includes(game.phase)) start();
    if (event.key === "Enter" && event.target === canvas && game.phase === "idle") start();
}
function keyup(event)
{
    keys.delete(event.key);
}
function blur()
{
    keys.clear();
    if (game.phase === "playing") pause();
}
function visibility()
{
    if (document.hidden) blur();
}
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
window.addEventListener("blur", blur);
document.addEventListener("visibilitychange", visibility);
function frame(now)
{
    step(game, (now - last) / 1000, Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft")), beep);
    last = now;
    syncUI();
    render(context, game, now, reducedMotion);
    animation = requestAnimationFrame(frame);
}
syncUI();
animation = requestAnimationFrame(frame);
window.addEventListener("pagehide", () =>
{
    cancelAnimationFrame(animation);
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
    window.removeEventListener("blur", blur);
    document.removeEventListener("visibilitychange", visibility);
    if (audio) void audio.close();
}, { once: true });
