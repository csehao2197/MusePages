import { content as c, icon } from "./content.js";

export function createUI(state, seasons, audio, ripples)
{
    const root = document.querySelector("#interface");
    const labels = c.labels;
    root.innerHTML = `
        <header class="intro"><h1>${c.brand}</h1><p class="tagline">${c.tagline}</p></header>
        <div class="wordmark" aria-hidden="true">${c.brand}</div>
        <div class="hints">${c.gestures.map((g) => `<span class="hint" data-gesture="${g.id}">${icon(g.icon)}<span>${g.text}</span></span>`).join("")}</div>
        <nav class="dock" aria-label="${labels.dock}">
            <div class="seasons"><span class="season-thumb" aria-hidden="true"></span>${c.seasons.map((s, i) => `<button class="season-button" data-season="${i}" aria-label="${s.name}" title="${s.name} · ${i + 1}" aria-pressed="${state.season === i}">${icon(s.icon)}<span class="label">${s.name}</span></button>`).join("")}</div>
            <span class="divider"></span>
            ${["night", "rain", "sound"].map((key) => `<button class="toggle ${key === "sound" ? "invitation" : ""}" data-toggle="${key}" aria-label="${labels[key]}" aria-pressed="${key === "night" ? state.night > 0.5 : key === "rain" ? state.rain > 0.5 : false}">${icon({ night: "moon", rain: "cloud-rain", sound: "volume-x" }[key])}<span class="tooltip">${labels[key]}</span></button>`).join("")}
            <button class="focus-button" aria-label="${labels.focus} ${c.focusMinutes}:00" aria-pressed="false">${icon("timer")}<span class="label">${labels.focus} </span><span class="focus-value">${c.focusMinutes}<span class="label">:00</span></span></button>
        </nav>
        <a class="credit" href="${c.credit.href}" target="_blank" rel="noopener noreferrer">${c.credit.text}</a>
        <div class="season-card" aria-hidden="true"><h2></h2><p></p></div>
        <div class="focus-hud">
            <div class="time-left" role="timer" aria-label="${labels.focus}">25:00</div>
            <div class="progress" role="progressbar" aria-label="${labels.focus}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
            <div class="focus-controls" role="group" aria-label="${labels.focusControls}">
                <button data-action="pause" aria-label="${labels.pause}" aria-pressed="false">${icon("pause")}<span>${labels.pause}</span></button>
                <button data-action="exit" aria-label="${labels.exit}" aria-pressed="false">${icon("x")}<span>${labels.exit}</span></button>
            </div>
        </div>
        <section class="complete" role="dialog" aria-modal="true" aria-labelledby="complete-title" hidden>
            <h2 id="complete-title">${labels.complete}</h2><p>${labels.sessionLine}</p>
            <button class="primary" data-action="another">${labels.another}</button>
            <button data-action="back">${labels.back}</button>
        </section>
        <div class="sr-only" aria-live="polite" id="announcement"></div>`;
    const dock = root.querySelector(".dock");
    const seasonButtons = [...root.querySelectorAll("[data-season]")];
    const thumb = root.querySelector(".season-thumb");
    const card = root.querySelector(".season-card");
    const hud = root.querySelector(".focus-hud");
    const complete = root.querySelector(".complete");
    const focusButton = root.querySelector(".focus-button");
    const pauseButton = root.querySelector('[data-action="pause"]');
    let touched = false;
    let lastInput = performance.now();
    let hintTimer;
    let pillTimer;
    let wakeLock = null;
    let completionTimer;
    let audioPending = false;
    const gestures = new Set();
    const focus = { active: false, paused: false, remaining: c.focusMinutes * 60000, deadline: 0, completed: false };
    const toggles = { night: state.night > 0.5, rain: state.rain > 0.5, sound: false };
    function announce(text)
    {
        root.querySelector("#announcement").textContent = text;
    }
    function resize()
    {
        const button = seasonButtons[state.season];
        thumb.style.width = `${button.offsetWidth}px`;
        thumb.style.transform = `translateX(${button.offsetLeft}px)`;
    }
    function syncURL()
    {
        const url = new URL(location.href);
        url.searchParams.set("season", c.seasons[state.season].id);
        url.searchParams.set("night", toggles.night ? "1" : "0");
        url.searchParams.set("rain", toggles.rain ? "1" : "0");
        history.replaceState(null, "", url);
    }
    function selectSeason(index)
    {
        wake();
        stopInvitation();
        if (state.season === index) return;
        seasons.select(index);
        for (let i = 0; i < 4; i++) seasonButtons[i].setAttribute("aria-pressed", String(i === index));
        resize();
        card.querySelector("h2").textContent = c.seasons[index].name;
        card.querySelector("p").textContent = c.seasons[index].line;
        card.classList.remove("reveal");
        void card.offsetWidth;
        card.classList.add("reveal");
        const rain = root.querySelector('[data-toggle="rain"]');
        const rainText = index === 3 ? labels.snow : labels.rain;
        rain.setAttribute("aria-label", rainText);
        rain.querySelector(".tooltip").textContent = rainText;
        audio.season();
        syncURL();
        announce(`${c.seasons[index].name}. ${c.seasons[index].line}.`);
    }
    async function toggle(key)
    {
        wake();
        stopInvitation();
        if (key === "sound")
        {
            if (audioPending) return;
            audioPending = true;
            toggles.sound = await audio.toggle(!toggles.sound);
            audioPending = false;
        }
        else
        {
            toggles[key] = !toggles[key];
            seasons[key](toggles[key]);
        }
        const button = root.querySelector(`[data-toggle="${key}"]`);
        button.setAttribute("aria-pressed", String(toggles[key]));
        if (key === "sound")
        {
            button.innerHTML = `${icon(toggles.sound ? "volume-2" : "volume-x")}<span class="tooltip">${labels.sound}</span>`;
        }
        syncURL();
    }
    function stopInvitation()
    {
        root.querySelector('[data-toggle="sound"]').classList.remove("invitation");
    }
    function wake()
    {
        lastInput = performance.now();
        document.body.classList.remove("idle");
        dock.inert = focus.active || focus.completed;
        if (focus.active)
        {
            hud.classList.add("awake");
            clearTimeout(pillTimer);
            pillTimer = setTimeout(() =>
            {
                if (!hud.contains(document.activeElement)) hud.classList.remove("awake");
            }, 3000);
        }
    }
    async function acquireWakeLock()
    {
        if (!focus.active || focus.paused || document.hidden || !navigator.wakeLock) return;
        try { wakeLock = await navigator.wakeLock.request("screen"); }
        catch { /* Screen wake lock is optional. */ }
    }
    function releaseWakeLock()
    {
        if (wakeLock) wakeLock.release().catch(() => {});
        wakeLock = null;
    }
    function updateClock()
    {
        if (!focus.active) return;
        if (!focus.paused) focus.remaining = Math.max(0, focus.deadline - Date.now());
        const seconds = Math.ceil(focus.remaining / 1000);
        root.querySelector(".time-left").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
        const progress = 1 - focus.remaining / (c.focusMinutes * 60000);
        root.querySelector(".progress span").style.transform = `scaleX(${progress})`;
        root.querySelector(".progress").setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        if (focus.remaining <= 0) finish();
    }
    function startFocus()
    {
        clearTimeout(completionTimer);
        stopInvitation();
        audio.unlock();
        complete.hidden = true;
        focus.active = true;
        focus.completed = false;
        focus.paused = false;
        focus.remaining = c.focusMinutes * 60000;
        focus.deadline = Date.now() + focus.remaining;
        focusButton.setAttribute("aria-pressed", "true");
        pauseButton.innerHTML = `${icon("pause")}<span>${labels.pause}</span>`;
        pauseButton.setAttribute("aria-label", labels.pause);
        pauseButton.setAttribute("aria-pressed", "false");
        document.body.classList.add("focusing");
        dock.inert = true;
        document.querySelector("#surface").focus({ preventScroll: true });
        updateClock();
        acquireWakeLock();
        wake();
    }
    function pause()
    {
        if (!focus.active) return;
        updateClock();
        if (!focus.active) return;
        focus.paused = !focus.paused;
        if (!focus.paused)
        {
            focus.deadline = Date.now() + focus.remaining;
            acquireWakeLock();
        }
        else releaseWakeLock();
        pauseButton.innerHTML = `${icon(focus.paused ? "play" : "pause")}<span>${focus.paused ? labels.resume : labels.pause}</span>`;
        pauseButton.setAttribute("aria-label", focus.paused ? labels.resume : labels.pause);
        pauseButton.setAttribute("aria-pressed", String(focus.paused));
        wake();
    }
    function exit()
    {
        clearTimeout(completionTimer);
        focus.active = false;
        focus.completed = false;
        complete.hidden = true;
        releaseWakeLock();
        document.body.classList.remove("focusing");
        focusButton.setAttribute("aria-pressed", "false");
        dock.inert = false;
        wake();
        focusButton.focus({ preventScroll: true });
    }
    function finish()
    {
        focus.active = false;
        focus.completed = true;
        releaseWakeLock();
        audio.chime();
        ripples.ring(state.w / 2, state.h / 2, 0, false, 1, true);
        hud.classList.remove("awake");
        completionTimer = setTimeout(() =>
        {
            complete.hidden = false;
            complete.querySelector("button").focus({ preventScroll: true });
            announce(labels.complete);
        }, 1000);
    }
    for (const button of seasonButtons) button.addEventListener("click", () => selectSeason(Number(button.dataset.season)));
    for (const button of root.querySelectorAll("[data-toggle]")) button.addEventListener("click", () => toggle(button.dataset.toggle));
    focusButton.addEventListener("click", startFocus);
    pauseButton.addEventListener("click", pause);
    root.querySelector('[data-action="exit"]').addEventListener("click", exit);
    root.querySelector('[data-action="another"]').addEventListener("click", startFocus);
    root.querySelector('[data-action="back"]').addEventListener("click", exit);
    for (const button of root.querySelectorAll("button"))
    {
        let touch = null;
        let activatedAt = -1000;
        button.addEventListener("pointerdown", (event) =>
        {
            if (event.pointerType === "touch") touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
        });
        button.addEventListener("pointercancel", () => { touch = null; });
        button.addEventListener("pointerup", (event) =>
        {
            if (!touch || event.pointerId !== touch.id) return;
            const bounds = button.getBoundingClientRect();
            const moved = Math.hypot(event.clientX - touch.x, event.clientY - touch.y);
            touch = null;
            if (moved > 12 || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return;
            // A preceding water drag can suppress the browser's compatibility click.
            activatedAt = performance.now();
            event.preventDefault();
            button.click();
        });
        button.addEventListener("click", (event) =>
        {
            if (event.isTrusted && performance.now() - activatedAt < 700)
            {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, true);
    }
    const keyHandler = (event) =>
    {
        if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
        const key = event.key.toLowerCase();
        if (key === "escape" && (focus.active || focus.completed))
        {
            event.preventDefault();
            exit();
        }
        else if (key === " " && focus.active)
        {
            event.preventDefault();
            pause();
        }
        else if (!focus.active && !focus.completed)
        {
            if (/^[1-4]$/.test(key)) selectSeason(Number(key) - 1);
            if (key === "n") toggle("night");
            if (key === "r") toggle("rain");
            if (key === "m") toggle("sound");
            if (key === "f")
            {
                event.preventDefault();
                startFocus();
            }
        }
        if (key === "tab" && !complete.hidden)
        {
            const buttons = [...complete.querySelectorAll("button")];
            if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[1].focus(); }
            else if (!event.shiftKey && document.activeElement === buttons[1]) { event.preventDefault(); buttons[0].focus(); }
        }
    };
    document.addEventListener("keydown", keyHandler);
    for (const type of ["pointermove", "pointerdown", "keydown"]) document.addEventListener(type, wake, { passive: true });
    document.addEventListener("visibilitychange", () =>
    {
        if (!document.hidden)
        {
            updateClock();
            acquireWakeLock();
        }
    });
    const timer = setInterval(() =>
    {
        updateClock();
        if (touched && !focus.active && !focus.completed && performance.now() - lastInput > 6000 && !dock.matches(":hover") && !dock.contains(document.activeElement))
        {
            document.body.classList.add("idle");
            dock.inert = true;
        }
    }, 250);
    setTimeout(stopInvitation, 8000);
    requestAnimationFrame(resize);
    if (state.season === 3)
    {
        const rain = root.querySelector('[data-toggle="rain"]');
        rain.setAttribute("aria-label", labels.snow);
        rain.querySelector(".tooltip").textContent = labels.snow;
    }
    return {
        focus, toggles, resize, wake,
        gesture(id)
        {
            wake();
            if (!touched)
            {
                touched = true;
                document.body.classList.add("touched");
                hintTimer = setTimeout(() => root.querySelector(".hints").classList.add("dismissed"), 20000);
            }
            if (gestures.has(id)) return;
            gestures.add(id);
            const hint = root.querySelector(`[data-gesture="${id}"]`);
            hint.classList.add("done");
            hint.querySelector("svg").outerHTML = icon("check");
            if (gestures.size === 3)
            {
                clearTimeout(hintTimer);
                hintTimer = setTimeout(() => root.querySelector(".hints").classList.add("dismissed"), 2000);
            }
        },
        close()
        {
            clearInterval(timer);
            clearTimeout(hintTimer);
            clearTimeout(pillTimer);
            clearTimeout(completionTimer);
            releaseWakeLock();
        }
    };
}
