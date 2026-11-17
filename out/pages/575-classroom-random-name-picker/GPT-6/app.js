"use strict";

(() =>
{
    const icons =
    {
        shuffle: '<path d="m18 3 3 3-3 3M3 18l6-6 6-6h6M18 15l3 3-3 3M3 6l6 6 6 6h6"/>',
        sparkles: '<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM20 2v4M18 4h4"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
        history: '<path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7M12 7v5l3 2"/>',
        lightbulb: '<path d="M9 18h6M9 21h6M9 15a6 6 0 1 1 6 0v3H9v-3Z"/>',
        shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
        "volume-off": '<path d="m11 5-6 4H2v6h3l6 4V5ZM17 9l5 6M22 9l-5 6"/>',
        volume: '<path d="m11 5-6 4H2v6h3l6 4V5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
        maximize: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
        pencil: '<path d="m15 5 4 4M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15l-1 5Z"/>',
        star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
        "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
        "arrow-right": '<path d="M4 12h16m-6-6 6 6-6 6"/>',
        square: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
        rotate: '<path d="M3 11a9 9 0 1 1 2.5 7M3 4v7h7"/>',
        trophy: '<path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4M16 5h4v3a4 4 0 0 1-4 4M12 13v6M8 21h8M9 19h6"/>',
        sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 10h6M9 12h6M17 16h6"/>',
        graduation: '<path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v8"/>',
        lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
        heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
        x: '<path d="m6 6 12 12M18 6 6 18"/>',
        upload: '<path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/>',
        download: '<path d="M12 3v13m-5-5 5 5 5-5M3 16v5h18v-5"/>'
    };
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];
    const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.star}</svg>`;
    const paintIcons = (root = document) =>
    {
        root.querySelectorAll("[data-icon]").forEach((node) => node.innerHTML = icon(node.dataset.icon));
    };
    paintIcons();

    const storageKey = "classroom-shuffle-v1";
    const demoNames = ["Amelia Brooks", "Oliver Chen", "Sofia Davis", "Noah Edwards", "Isabella Foster", "Liam Garcia", "Mia Harris", "Ethan Jackson", "Charlotte Kim", "Lucas Lee", "Harper Mitchell", "Mason Nguyen", "Evelyn Parker", "James Reed", "Aria Robinson", "Benjamin Scott", "Ella Taylor", "Henry Walker", "Grace Wilson", "Leo Wright", "Chloe Young", "Jack Rivera", "Ava Morgan", "Finn Patel"];
    const normalizeName = (value) => String(value).trim().replace(/\s+/g, " ").slice(0, 80);
    const keyOf = (value) => value.toLocaleLowerCase("en-US");
    const makeStudent = (name) => ({ id: crypto.randomUUID(), name, paused: false });
    let state = { event: "A little classroom magic", roster: demoNames.map(makeStudent), drawn: [], winners: [], records: [], sequence: 0 };
    let storageAvailable = true;
    try
    {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && Array.isArray(saved.roster))
        {
            const names = new Set();
            const ids = new Set();
            state.roster = saved.roster.filter((student) =>
            {
                if (!student || typeof student.id !== "string" || typeof student.name !== "string") return false;
                const name = normalizeName(student.name);
                if (!name || names.has(keyOf(name)) || ids.has(student.id)) return false;
                names.add(keyOf(name));
                ids.add(student.id);
                student.name = name;
                student.paused = student.paused === true;
                return true;
            }).slice(0, 500);
            state.event = normalizeName(saved.event || state.event) || state.event;
            const validIds = new Set(state.roster.map((student) => student.id));
            state.drawn = [...new Set((Array.isArray(saved.drawn) ? saved.drawn : []).filter((id) => validIds.has(id)))];
            state.winners = (Array.isArray(saved.winners) ? saved.winners : []).filter((winner) => validIds.has(winner.id) && state.drawn.includes(winner.id) && Number.isInteger(winner.order) && winner.order > 0);
            state.sequence = Math.max(Number.isInteger(saved.sequence) ? saved.sequence : 0, state.drawn.length, ...state.winners.map((winner) => winner.order));
            state.records = (Array.isArray(saved.records) ? saved.records : []).filter((record) => record && typeof record.event === "string" && Array.isArray(record.names) && record.names.every((name) => typeof name === "string") && Number.isFinite(Date.parse(record.time))).slice(0, 200);
        }
    }
    catch
    {
        storageAvailable = false;
    }
    let phase = "idle";
    let speed = "medium";
    let timer;
    let soundEnabled = false;
    let audio;
    let confirmAction;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.dataset.time = new Date().getHours() >= 18 || new Date().getHours() < 7 ? "night" : "day";
    const announce = (message) => $("#announcement").textContent = message;
    const eligible = () => state.roster.filter((student) => !student.paused && !state.drawn.includes(student.id));
    const save = () =>
    {
        try
        {
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
        catch
        {
            storageAvailable = false;
            announce("Browser storage is unavailable or full. This session still works, but changes may not survive a refresh.");
        }
        $(".roster-footer").innerHTML = `${icon("lock")}${storageAvailable ? "Autosaved on this device" : "Session only · storage unavailable"}`;
    };

    // Rejection sampling avoids modulo bias, including for non-power-of-two roster sizes.
    const randomIndex = (length) =>
    {
        const bound = Math.floor(4294967296 / length) * length;
        const value = new Uint32Array(1);
        do
        {
            crypto.getRandomValues(value);
        }
        while (value[0] >= bound);
        return value[0] % length;
    };
    const setName = (name) =>
    {
        $("#name-display").textContent = name;
        $("#name-display").classList.toggle("long-name", name.length > 23);
    };
    const studentRow = (student, index, full) =>
    {
        const row = document.createElement("div");
        row.className = "roster-row";
        const avatar = document.createElement("span");
        avatar.className = `student-avatar tone-${index % 4}`;
        avatar.textContent = student.name.split(" ").map((word) => [...word][0]).slice(0, 2).join("").toUpperCase();
        const name = document.createElement("span");
        name.className = "student-name";
        name.textContent = student.name;
        row.append(avatar, name);
        const drawn = state.drawn.includes(student.id);
        if (full)
        {
            const status = document.createElement("span");
            status.className = "status-label";
            status.textContent = drawn ? "Picked" : student.paused ? "Paused" : "Ready";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = !student.paused;
            checkbox.setAttribute("aria-label", `Include ${student.name}`);
            checkbox.addEventListener("change", () =>
            {
                student.paused = !checkbox.checked;
                save();
                render();
            });
            const remove = document.createElement("button");
            remove.className = "icon-button";
            remove.setAttribute("aria-label", `Remove ${student.name} from roster`);
            remove.innerHTML = icon("x");
            remove.addEventListener("click", () =>
            {
                state.roster = state.roster.filter((entry) => entry.id !== student.id);
                state.winners = state.winners.filter((entry) => entry.id !== student.id);
                state.drawn = state.drawn.filter((id) => id !== student.id);
                save();
                render();
                $("#roster-message").textContent = `${student.name} removed from the roster. Previous history is unchanged.`;
            });
            row.append(status, checkbox, remove);
        }
        else
        {
            const status = document.createElement("span");
            status.className = drawn || student.paused ? "status-label" : "status-check";
            if (drawn || student.paused) status.textContent = drawn ? "Picked" : "Paused";
            else status.innerHTML = icon("check-circle");
            row.append(status);
        }
        return row;
    };
    const renderHistory = () =>
    {
        const filter = $("#history-filter").value.trim().toLowerCase();
        const records = state.records.filter((record) => record.event.toLowerCase().includes(filter));
        const list = $("#history-list");
        list.replaceChildren();
        if (!records.length)
        {
            const empty = document.createElement("p");
            empty.className = "helper-text";
            empty.textContent = filter ? "No activities match this search." : "Your first draw is still ahead. Its story will appear here.";
            list.append(empty);
        }
        records.forEach((record) =>
        {
            const entry = document.createElement("article");
            entry.className = "history-record";
            const title = document.createElement("strong");
            title.textContent = record.event;
            const time = document.createElement("time");
            time.dateTime = record.time;
            time.textContent = new Date(record.time).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
            const names = document.createElement("p");
            names.textContent = record.names.join(" · ");
            entry.append(title, time, names);
            list.append(entry);
        });
        $("#clear-history").disabled = !state.records.length;
    };
    const renderWinners = () =>
    {
        const list = $("#winner-list");
        list.replaceChildren();
        if (!state.winners.length)
        {
            list.innerHTML = `<div class="empty-winners">${icon("star")}<div><strong>The next bright moment starts here.</strong><p>Your picked students will appear in this space.</p></div></div>`;
        }
        state.winners.forEach((winner) =>
        {
            const student = state.roster.find((entry) => entry.id === winner.id);
            if (!student) return;
            const card = document.createElement("article");
            card.className = "winner-card";
            const ordinal = document.createElement("span");
            ordinal.className = "ordinal";
            ordinal.textContent = String(winner.order).padStart(2, "0");
            const info = document.createElement("div");
            info.className = "winner-info";
            const name = document.createElement("strong");
            name.textContent = student.name;
            const label = document.createElement("small");
            label.textContent = `Pick #${winner.order} · a moment to shine`;
            info.append(name, label);
            const remove = document.createElement("button");
            remove.className = "icon-button";
            remove.setAttribute("aria-label", `Hide winner ${student.name}`);
            remove.disabled = phase !== "idle";
            remove.innerHTML = icon("x");
            remove.addEventListener("click", () =>
            {
                state.winners = state.winners.filter((entry) => entry.id !== winner.id);
                save();
                renderWinners();
                announce(`${student.name} hidden. They remain excluded until the round is reset.`);
            });
            card.append(ordinal, info, remove);
            list.append(card);
        });
        $("#winner-total").textContent = state.winners.length;
        $("#winner-note").hidden = !state.drawn.length;
    };
    const render = () =>
    {
        const pool = eligible();
        $("#event-title").textContent = state.event;
        ["#nav-count", "#roster-total", "#manage-count"].forEach((selector) => $(selector).textContent = state.roster.length);
        ["#eligible-count", "#remaining-stat"].forEach((selector) => $(selector).textContent = pool.length);
        $("#drawn-stat").textContent = state.drawn.length;
        $("#paused-stat").textContent = state.roster.filter((student) => student.paused).length;
        $("#roster-caption").textContent = `${state.roster.length} students · ${pool.length} ready to shine`;
        $("#manage-summary").textContent = `${state.roster.length} of 500 places filled`;
        $("#roster-preview").replaceChildren(...state.roster.slice(0, 6).map((student, index) => studentRow(student, index, false)));
        $("#roster-list").replaceChildren(...state.roster.map((student, index) => studentRow(student, index, true)));
        $("#start").disabled = phase !== "idle" || !pool.length;
        $("#reset").disabled = phase !== "idle";
        $("#draw-count").disabled = phase !== "idle";
        $$("[data-speed], [data-open='roster-dialog'], #edit-event").forEach((button) => button.disabled = phase !== "idle");
        renderWinners();
        renderHistory();
        if (phase === "idle" && !pool.length)
        {
            setName(state.roster.length ? "Everyone had a turn!" : "Room for your class");
            $("#stage-description").textContent = state.roster.length ? "Reset the round or unpause students to keep the magic going." : "Add a few names in your class roster to get started.";
        }
        else if (phase === "idle" && !state.drawn.length)
        {
            setName("Who will it be?");
            $("#stage-description").textContent = "A fresh possibility with every shuffle.";
        }
    };
    const tone = (frequency, duration = .05, gain = .018) =>
    {
        if (!soundEnabled || !audio) return;
        const oscillator = audio.createOscillator();
        const envelope = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        envelope.gain.setValueAtTime(gain, audio.currentTime);
        envelope.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
        oscillator.connect(envelope);
        envelope.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + duration);
    };
    const celebrate = () =>
    {
        const stage = $("#stage");
        stage.classList.add("celebrating");
        if (!reducedMotion)
        {
            for (let index = 0; index < 30; index++)
            {
                const piece = document.createElement("i");
                piece.className = "confetti";
                piece.style.left = `${randomIndex(100)}%`;
                piece.style.background = ["#f6d575", "#eadffb", "#9fd8cb", "#ffb0ac"][index % 4];
                piece.style.animationDelay = `${index * .018}s`;
                stage.append(piece);
                setTimeout(() => piece.remove(), 2400);
            }
        }
        [523, 659, 784, 1047].forEach((frequency, index) => setTimeout(() => tone(frequency, .22, .025), index * 100));
        setTimeout(() => stage.classList.remove("celebrating"), 2000);
    };
    const roll = () =>
    {
        const pool = eligible();
        if (!pool.length) return;
        setName(pool[randomIndex(pool.length)].name);
        tone(170 + randomIndex(180));
    };
    const start = () =>
    {
        if (phase !== "idle" || !eligible().length || $("dialog[open]")) return;
        phase = "rolling";
        $("#start").hidden = true;
        $("#stop").hidden = false;
        $("#stop").disabled = false;
        $("#stage").classList.add("rolling");
        $("#name-display").setAttribute("aria-live", "off");
        $("#stage-pill").textContent = "A LITTLE DRUMROLL, PLEASE";
        $("#stage-description").textContent = "Every name. An equal chance.";
        roll();
        timer = setInterval(roll, { slow: 240, medium: 110, fast: 55 }[speed]);
        render();
        $("#stop").focus({ preventScroll: true });
        announce("Shuffling. Press Space or Stop and reveal to pick.");
    };
    const finish = () =>
    {
        const pool = eligible();
        const count = Math.min(Number($("#draw-count").value), pool.length);
        const winners = [];
        // The reveal is cosmetic. Selection is a fresh, unbiased sample without replacement.
        for (let index = 0; index < count; index++)
        {
            const [student] = pool.splice(randomIndex(pool.length), 1);
            state.drawn.push(student.id);
            state.sequence++;
            state.winners.push({ id: student.id, order: state.sequence });
            winners.push(student.name);
        }
        if (winners.length)
        {
            state.records.unshift({ event: state.event, time: new Date().toISOString(), names: winners });
            state.records = state.records.slice(0, 200);
        }
        phase = "idle";
        $("#stage").classList.remove("rolling");
        $("#start").hidden = false;
        $("#stop").hidden = true;
        $("#name-display").setAttribute("aria-live", "polite");
        save();
        render();
        setName(winners.length === 1 ? winners[0] : `${winners.length} bright stars!`);
        $("#stage-pill").textContent = "YOUR MOMENT TO SHINE";
        $("#stage-description").textContent = `${winners.length === 1 ? "A little applause for our next student." : "Meet your picks in the spotlight below."}${eligible().length ? "" : " Round complete — reset to go again."}`;
        announce(`Picked: ${winners.join(", ")}. ${eligible().length} students remaining.`);
        celebrate();
        if (!$("#start").disabled) $("#start").focus({ preventScroll: true });
        else $("#reset").focus({ preventScroll: true });
    };
    const stop = () =>
    {
        if (phase !== "rolling") return;
        phase = "settling";
        clearInterval(timer);
        $("#stop").disabled = true;
        $("#stage-pill").textContent = "AND THE SPOTLIGHT GOES TO…";
        let tick = 0;
        const slowDown = () =>
        {
            roll();
            tick++;
            if (tick < 4) timer = setTimeout(slowDown, 90 + tick * 50);
            else finish();
        };
        timer = setTimeout(slowDown, 80);
    };
    const confirm = (title, description, accept, action) =>
    {
        $("#confirm-title").textContent = title;
        $("#confirm-description").textContent = description;
        $("#confirm-accept").textContent = accept;
        confirmAction = action;
        $("#confirm-dialog").showModal();
        $("#confirm-cancel").focus();
    };
    $("#confirm-cancel").addEventListener("click", () => $("#confirm-dialog").close());
    $("#confirm-accept").addEventListener("click", () =>
    {
        $("#confirm-dialog").close();
        confirmAction?.();
        confirmAction = null;
    });
    $("#start").addEventListener("click", start);
    $("#stop").addEventListener("click", stop);
    $("#reset").addEventListener("click", () =>
    {
        confirm("Start a fresh round?", "Picked students become eligible again. Your roster, pauses, and history stay saved.", "Reset round", () =>
        {
            state.drawn = [];
            state.winners = [];
            state.sequence = 0;
            $("#stage-pill").innerHTML = "<i></i>THE SPOTLIGHT IS WAITING";
            save();
            render();
            announce("Fresh round ready. Manually paused students remain paused.");
        });
    });
    $$("[data-speed]").forEach((button) => button.addEventListener("click", () =>
    {
        speed = button.dataset.speed;
        $$("[data-speed]").forEach((option) =>
        {
            option.classList.toggle("selected", option === button);
            option.setAttribute("aria-pressed", String(option === button));
        });
    }));
    $$("[data-open]").forEach((button) => button.addEventListener("click", () =>
    {
        if (button.dataset.open === "roster-dialog") $("#roster-message").textContent = "";
        renderHistory();
        $(`#${button.dataset.open}`).showModal();
    }));
    const addNames = (text) =>
    {
        const input = text.split(/\r?\n/).map(normalizeName).filter(Boolean);
        const existing = new Set(state.roster.map((student) => keyOf(student.name)));
        let added = 0;
        let duplicates = 0;
        let overflow = 0;
        input.forEach((name) =>
        {
            if (existing.has(keyOf(name))) duplicates++;
            else if (state.roster.length >= 500) overflow++;
            else
            {
                state.roster.push(makeStudent(name));
                existing.add(keyOf(name));
                added++;
            }
        });
        save();
        render();
        $("#roster-message").textContent = input.length ? `${added} added. ${duplicates} duplicate names skipped.${overflow ? ` ${overflow} not added: the 500-student limit is full.` : ""}` : "Enter at least one name.";
    };
    $("#add-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        addNames($("#new-name").value);
        $("#new-name").value = "";
        $("#new-name").focus();
    });
    $("#paste-add").addEventListener("click", () =>
    {
        addNames($("#paste-names").value);
        $("#paste-names").value = "";
    });
    $("#import-button").addEventListener("click", () => $("#file-import").click());
    $("#file-import").addEventListener("change", async (event) =>
    {
        const file = event.target.files[0];
        if (!file) return;
        try
        {
            if (file.size > 200000) throw Error("Choose a TXT file smaller than 200 KB.");
            if (!/\.txt$/i.test(file.name)) throw Error("Choose a plain-text .txt file.");
            addNames(await file.text());
        }
        catch (error)
        {
            $("#roster-message").textContent = error.message || "That file could not be read.";
        }
        event.target.value = "";
    });
    $("#export").addEventListener("click", () =>
    {
        const url = URL.createObjectURL(new Blob([state.roster.map((student) => student.name).join("\n")], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "classroom-roster.txt";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        $("#roster-message").textContent = "Roster exported as classroom-roster.txt.";
    });
    $("#edit-event").addEventListener("click", () =>
    {
        $("#event-input").value = state.event;
        $("#event-dialog").showModal();
        $("#event-input").select();
    });
    $("#cancel-event").addEventListener("click", () => $("#event-dialog").close());
    $("#event-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const name = normalizeName($("#event-input").value);
        if (!name) return;
        state.event = name;
        save();
        render();
        $("#event-dialog").close();
    });
    $("#history-filter").addEventListener("input", renderHistory);
    $("#clear-history").addEventListener("click", () =>
    {
        confirm("Clear local history?", "This permanently removes the records saved in this browser. Your current round and roster are unchanged.", "Clear history", () =>
        {
            state.records = [];
            save();
            renderHistory();
        });
    });
    $("#sound").addEventListener("click", async () =>
    {
        try
        {
            if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
            await audio.resume();
            soundEnabled = !soundEnabled;
            $("#sound").setAttribute("aria-pressed", String(soundEnabled));
            $("#sound").setAttribute("aria-label", soundEnabled ? "Disable sound" : "Enable sound");
            $("#sound").innerHTML = icon(soundEnabled ? "volume" : "volume-off");
            tone(659, .12);
        }
        catch
        {
            announce("Sound is unavailable in this browser.");
        }
    });
    const fullscreen = async () =>
    {
        try
        {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
            else announce("Fullscreen is unavailable. Use your browser’s fullscreen control.");
        }
        catch
        {
            announce("Fullscreen could not open. Use your browser’s fullscreen control.");
        }
    };
    $("#fullscreen").addEventListener("click", fullscreen);
    document.addEventListener("keydown", (event) =>
    {
        if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || $("dialog[open]") || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
        if (event.code === "Space")
        {
            event.preventDefault();
            if (phase === "idle") start();
            else if (phase === "rolling") stop();
        }
        if (event.key.toLowerCase() === "f")
        {
            event.preventDefault();
            fullscreen();
        }
    });
    document.addEventListener("click", (event) =>
    {
        if (reducedMotion || !event.clientX && !event.clientY) return;
        const star = document.createElement("span");
        star.className = "click-star";
        star.innerHTML = icon("star");
        star.style.left = `${event.clientX - 6}px`;
        star.style.top = `${event.clientY - 6}px`;
        document.body.append(star);
        setTimeout(() => star.remove(), 650);
    });
    save();
    render();
})();
