import { talk, ui } from "./content.js";
import { icons } from "./icons.js";

const $ = (tag, className, text) =>
{
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

const icon = (name) =>
{
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries(
        { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.75", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }))
    {
        svg.setAttribute(key, value);
    }
    for (const [tag, attrs] of icons[name])
    {
        const child = document.createElementNS(svg.namespaceURI, tag);
        for (const [key, value] of Object.entries(attrs))
        {
            if (key !== "key") child.setAttribute(key, value);
        }
        svg.append(child);
    }
    return svg;
};

const key = (text) => $("kbd", "", text);
const pad = (index) => String(index + 1).padStart(2, "0");
const state = { index: 0, selection: 0, overviewOpen: false, notesOpen: false, line: 0 };
const app = document.querySelector("#app");
let returnFocus;

function button(label, iconName, hint, action, className = "")
{
    const node = $("button", `ghost ${className}`);
    node.type = "button";
    node.setAttribute("aria-label", hint ? `${label} (${hint})` : label);
    node.title = hint ? `${label} · ${hint}` : label;
    if (iconName) node.append(icon(iconName));
    if (!className.includes("icon-button")) node.append($("span", "control-text", label));
    if (hint) node.append(key(hint));
    node.addEventListener("click", action);
    return node;
}

function tokenize(line)
{
    const fragment = document.createDocumentFragment();
    const pattern = /(\/\/.*$)|('[^']*'|"[^"]*")|\b(type|number|boolean|function|const|if|return)\b|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()/g;
    let cursor = 0;
    for (const match of line.matchAll(pattern))
    {
        fragment.append(document.createTextNode(line.slice(cursor, match.index)));
        const kind = match[1] ? "comment" : match[2] ? "string" : match[3] ? "keyword" : match[4] ? "number" : "function";
        fragment.append($("span", `token-${kind}`, match[0]));
        cursor = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(line.slice(cursor)));
    return fragment;
}

function renderSlide(slide, index)
{
    const inner = $("div", "slide-inner");
    inner.append($("p", "eyebrow", slide.section));
    if (slide.type === "title")
    {
        const heading = $("h1");
        slide.lines.forEach((line, i) => heading.append($("span", i === 1 ? "warm" : "", line)));
        inner.append(heading, $("p", "title-topic", talk.topic));
        const speaker = $("div", "speaker");
        const name = $("div");
        name.append($("p", "speaker-name", talk.speaker), $("small", "", talk.duration));
        speaker.append(name, $("span", "speaker-rule"), $("p", "speaker-venue", talk.venue));
        inner.append(speaker);
    }
    else if (slide.type === "statement")
    {
        const heading = $("h2", "statement-title");
        slide.lines.forEach((line, i) => heading.append($("span", i === slide.accent ? "warm" : "", line)));
        inner.append(heading);
    }
    else if (slide.type === "closing")
    {
        const link = $("a", "closing-link", slide.link);
        link.href = talk.closingLink;
        const credit = $("a", "credit", talk.credit);
        credit.href = talk.creditUrl;
        credit.rel = "noopener noreferrer";
        credit.target = "_blank";
        inner.append($("span", "thanks-dot"), $("h2", "closing-title", slide.title),
            $("p", "closing-speaker", talk.speaker), link, $("p", "aside", slide.aside), $("br"), credit);
    }
    else
    {
        inner.append($("h2", "slide-title", slide.title));
        if (slide.type === "agenda" || slide.type === "bullets")
        {
            const list = $("ol", slide.type === "agenda" ? "agenda" : "bullet-list");
            slide.items.forEach(([lead, sub], i) =>
            {
                const row = $("li", slide.type === "agenda" ? "" : "bullet");
                row.style.setProperty("--row", i);
                const text = $("div");
                text.append($("h3", "", lead), $("p", "", sub));
                row.append($("span", slide.type === "agenda" ? "agenda-number" : "bullet-number", pad(i)), text);
                list.append(row);
            });
            inner.append(list);
            if (slide.aside) inner.append($("p", "aside", slide.aside));
        }
        else if (slide.type === "code")
        {
            const layout = $("div", "code-layout");
            const panel = $("div", "code-panel");
            const header = $("div", "code-header");
            header.append($("span", "", slide.filename), $("span", "", slide.language));
            const lines = $("div", "code-lines");
            lines.setAttribute("role", "group");
            lines.setAttribute("aria-label", slide.filename);
            slide.code.forEach((text, i) =>
            {
                const line = $("div", `code-line${i === 0 ? " focused" : ""}`);
                line.dataset.line = i;
                const number = $("span", "line-number", String(i + 1));
                number.setAttribute("aria-hidden", "true");
                const code = $("code");
                code.append(tokenize(text || " "));
                line.append(number, code);
                lines.append(line);
            });
            panel.append(header, lines);
            const point = $("div");
            point.append($("h3", "code-point", slide.point), $("p", "code-detail", slide.detail), $("span", "focus-hint", slide.focusHint));
            layout.append(panel, point);
            inner.append(layout);
        }
        else if (slide.type === "two-col")
        {
            const layout = $("div", "two-col-layout");
            const narrative = $("div", "narrative");
            slide.paragraphs.forEach((text) => narrative.append($("p", "", text)));
            const panel = $("aside", "postmortem");
            panel.append($("h3", "", slide.panelTitle));
            slide.outcomes.forEach(([number, text]) =>
            {
                const row = $("p");
                row.append($("b", "", number), $("span", "", text));
                panel.append(row);
            });
            layout.append(narrative, panel);
            inner.append(layout);
        }
    }
    inner.dataset.slide = index + 1;
    return inner;
}

const progress = $("div", "progress");
progress.setAttribute("role", "progressbar");
progress.setAttribute("aria-label", ui.progress);
progress.setAttribute("aria-live", "polite");
progress.setAttribute("aria-valuemin", "1");
progress.setAttribute("aria-valuemax", "9");
const fill = $("span", "progress-fill");
progress.append(fill);
const masthead = $("header", "masthead");
masthead.append($("span", "masthead-mark", talk.label), $("span", "mono masthead-duration", talk.duration));
const stage = $("main", "stage");
stage.tabIndex = -1;
stage.setAttribute("aria-label", ui.deck);
const frames = talk.slides.map((slide, i) =>
{
    const frame = $("section", `slide ${slide.type}`);
    frame.setAttribute("aria-label", `${ui.slide} ${i + 1}: ${slide.title}`);
    frame.setAttribute("role", "region");
    frame.append(renderSlide(slide, i));
    frame.hidden = true;
    stage.append(frame);
    return frame;
});

const chrome = $("footer", "chrome");
const chromeTop = $("div", "chrome-top");
const counterGroup = $("div", "chrome-group");
const counter = $("div", "counter");
counter.setAttribute("aria-live", "polite");
counter.setAttribute("aria-atomic", "true");
const previous = button(ui.previous, null, "←", () => navigate(state.index - 1), "icon-button");
const next = button(ui.next, null, "→", () => navigate(state.index + 1), "icon-button");
previous.title = `${ui.previous} · ←`;
next.title = `${ui.next} · →`;
const print = button(ui.print, "Printer", "", () => window.print(), "print-button");
counterGroup.append(counter, previous, next, print);
const shortcuts = $("div", "chrome-group");
const moveHint = $("span", "keyboard-hint");
moveHint.append(key("←"), key("→"), $("span", "", ui.move));
const gridButton = button(ui.grid, "Grid3x3", "G", () => toggleOverview());
const notesButton = button(ui.notesShort, "NotebookPen", "S", () => toggleNotes());
gridButton.setAttribute("aria-haspopup", "dialog");
notesButton.setAttribute("aria-haspopup", "dialog");
shortcuts.append(moveHint, gridButton, notesButton);
chromeTop.append(counterGroup, shortcuts);
const chromeBottom = $("div", "chrome-bottom");
const bottomHint = $("span");
bottomHint.append($("span", "desktop-hint", ui.keyboard), $("span", "touch-hint", ui.tap));
chromeBottom.append($("span", "", `${talk.speaker} / ${ui.sample}`), bottomHint);
chrome.append(chromeTop, chromeBottom);

function dialogHeader(title, caption, closeAction)
{
    const header = $("div", "overlay-header");
    const heading = $("div");
    heading.append($("h2", "overlay-title", title), $("p", "overlay-caption", caption));
    const close = button(ui.close, "X", ui.escape, closeAction);
    header.append(heading, close);
    return header;
}

const overview = $("dialog", "overlay");
overview.setAttribute("aria-label", ui.overview);
overview.append(dialogHeader(ui.overview, ui.overviewHint, () => toggleOverview(false)));
const grid = $("div", "overview-grid");
const tiles = frames.map((frame, i) =>
{
    const tile = $("button", "mini");
    tile.type = "button";
    tile.style.setProperty("--row", i);
    tile.setAttribute("aria-label", `${ui.slide} ${i + 1}: ${talk.slides[i].title}`);
    const preview = $("div", "mini-preview");
    preview.setAttribute("aria-hidden", "true");
    preview.inert = true;
    const canvas = $("div", "mini-canvas");
    canvas.append(frame.firstElementChild.cloneNode(true));
    preview.append(canvas);
    const label = $("span", "mini-label");
    label.append($("span", "mono", pad(i)), $("span", "", talk.slides[i].title));
    tile.append(preview, label);
    tile.addEventListener("click", () =>
    {
        navigate(i);
        toggleOverview(false);
    });
    tile.addEventListener("focus", () =>
    {
        state.selection = i;
        updateSelection(false);
    });
    grid.append(tile);
    return tile;
});
overview.append(grid);
const notes = $("dialog", "overlay notes-drawer");
notes.setAttribute("aria-label", ui.notes);
const notesHeader = dialogHeader(ui.notes, ui.notesCaption, () => toggleNotes(false));
const notesNav = $("div", "notes-title-line");
const notesPrevious = button(ui.previous, "ArrowLeft", "←", () => navigate(state.index - 1), "notes-arrow");
const notesNext = button(ui.next, "ArrowRight", "→", () => navigate(state.index + 1), "notes-arrow");
const notesCounter = $("span", "mono muted");
notesNav.append(notesPrevious, notesCounter, notesNext);
const noteText = $("p", "notes-content");
noteText.setAttribute("aria-live", "polite");
notes.append(notesHeader, notesNav, noteText);
notesNav.style.marginBottom = "15px";
const lineStatus = $("span", "sr-only");
lineStatus.setAttribute("aria-live", "polite");
app.append(progress, masthead, stage, chrome, overview, notes, lineStatus);

function updateSelection(focus = true)
{
    tiles.forEach((tile, i) =>
    {
        tile.classList.toggle("selected", i === state.selection);
        tile.tabIndex = i === state.selection ? 0 : -1;
        tile.setAttribute("aria-current", i === state.index ? "step" : "false");
    });
    if (focus) tiles[state.selection].focus();
}

function sizeMiniatures()
{
    tiles.forEach((tile) =>
    {
        const preview = tile.querySelector(".mini-preview");
        const canvas = tile.querySelector(".mini-canvas");
        const height = Math.min(200, Math.max(58, preview.clientWidth / 1.65));
        const scale = Math.min(preview.clientWidth / 1100, height / 800);
        canvas.style.transform = `scale(${scale})`;
        canvas.style.left = `${(preview.clientWidth - 1100 * scale) / 2}px`;
        preview.style.height = `${height}px`;
    });
}

function closeDialog(dialog)
{
    dialog.close();
    if (returnFocus?.isConnected && !returnFocus.disabled) returnFocus.focus({ preventScroll: true });
    else stage.focus({ preventScroll: true });
}

function toggleOverview(open = !state.overviewOpen)
{
    if (open)
    {
        if (state.notesOpen) toggleNotes(false);
        returnFocus = document.activeElement;
        state.overviewOpen = true;
        state.selection = state.index;
        overview.showModal();
        sizeMiniatures();
        updateSelection();
    }
    else if (state.overviewOpen)
    {
        state.overviewOpen = false;
        closeDialog(overview);
    }
    gridButton.setAttribute("aria-expanded", String(state.overviewOpen));
}

function toggleNotes(open = !state.notesOpen)
{
    if (open)
    {
        if (state.overviewOpen) toggleOverview(false);
        returnFocus = document.activeElement;
        state.notesOpen = true;
        notes.showModal();
        renderNote();
    }
    else if (state.notesOpen)
    {
        state.notesOpen = false;
        closeDialog(notes);
    }
    notesButton.setAttribute("aria-expanded", String(state.notesOpen));
}

function renderNote()
{
    noteText.textContent = talk.slides[state.index].note;
    notesCounter.textContent = `${state.index + 1} / ${talk.slides.length}`;
    notesPrevious.disabled = state.index === 0;
    notesNext.disabled = state.index === talk.slides.length - 1;
}

function navigate(index, syncHash = true)
{
    state.index = Math.min(talk.slides.length - 1, Math.max(0, index));
    frames.forEach((frame, i) =>
    {
        frame.hidden = i !== state.index;
        frame.classList.remove("is-entering");
    });
    void frames[state.index].offsetWidth;
    frames[state.index].classList.add("is-entering");
    fill.style.width = `${(state.index + 1) / talk.slides.length * 100}%`;
    progress.setAttribute("aria-valuenow", state.index + 1);
    progress.setAttribute("aria-valuetext", `${ui.slide} ${state.index + 1} ${ui.of} ${talk.slides.length}`);
    counter.replaceChildren(document.createTextNode(String(state.index + 1)), $("span", "", ` / ${talk.slides.length}`));
    previous.disabled = state.index === 0;
    next.disabled = state.index === talk.slides.length - 1;
    if (syncHash) history.replaceState(null, "", `#/` + (state.index + 1));
    if (state.notesOpen) renderNote();
    chromeBottom.querySelector(".desktop-hint").textContent = state.index === 0 ? ui.keyboard : `${talk.slides[state.index].section} · ${pad(state.index)}`;
}

function fromHash()
{
    const match = location.hash.match(/^#\/([1-9])$/);
    navigate(match ? Number(match[1]) - 1 : 0);
}

function focusLine(direction)
{
    const lines = frames[state.index].querySelectorAll(".code-line");
    state.line = Math.min(lines.length - 1, Math.max(0, state.line + direction));
    lines.forEach((line, i) => line.classList.toggle("focused", i === state.line));
    lineStatus.textContent = `${ui.line} ${state.line + 1}`;
}

window.addEventListener("keydown", (event) =>
{
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    const letter = event.key.toLowerCase();
    if (event.target.closest("input, textarea, select, [contenteditable=true]")) return;
    if (event.key === "Escape")
    {
        if (state.overviewOpen) toggleOverview(false);
        if (state.notesOpen) toggleNotes(false);
        event.preventDefault();
        return;
    }
    if (letter === "g" || letter === "s")
    {
        event.preventDefault();
        if (letter === "g") toggleOverview();
        else toggleNotes();
        return;
    }
    if (state.overviewOpen)
    {
        const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 };
        if (Object.hasOwn(moves, event.key))
        {
            event.preventDefault();
            state.selection = Math.min(8, Math.max(0, state.selection + moves[event.key]));
            updateSelection();
        }
        else if (event.key === "Enter")
        {
            // Let close buttons retain their native Enter action.
            if (!tiles.includes(document.activeElement)) return;
            event.preventDefault();
            navigate(state.selection);
            toggleOverview(false);
        }
        else if (event.key === " " || event.key === "Backspace") event.preventDefault();
        return;
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && talk.slides[state.index].type === "code" && !state.notesOpen)
    {
        event.preventDefault();
        focusLine(event.key === "ArrowUp" ? -1 : 1);
        return;
    }
    // A focused control keeps native Space activation; the bare stage uses it to advance.
    if (event.key === " " && event.target.closest("button")) return;
    const moves = { ArrowRight: 1, ArrowLeft: -1, " ": 1, Backspace: -1 };
    if (Object.hasOwn(moves, event.key))
    {
        event.preventDefault();
        navigate(state.index + moves[event.key]);
    }
    else if (event.key === "Home" || event.key === "End" || /^[1-9]$/.test(event.key))
    {
        event.preventDefault();
        navigate(event.key === "Home" ? 0 : event.key === "End" ? 8 : Number(event.key) - 1);
    }
});

overview.addEventListener("cancel", (event) =>
{
    event.preventDefault();
    toggleOverview(false);
});
notes.addEventListener("cancel", (event) =>
{
    event.preventDefault();
    toggleNotes(false);
});
window.addEventListener("hashchange", fromHash);
window.addEventListener("resize", () =>
{
    if (state.overviewOpen) sizeMiniatures();
});
let pointerStart;
stage.addEventListener("pointerdown", (event) =>
{
    pointerStart = { x: event.clientX, y: event.clientY };
});
stage.addEventListener("pointerup", (event) =>
{
    if (event.pointerType === "mouse" || event.target.closest("a, button") || !pointerStart) return;
    if (Math.abs(event.clientX - pointerStart.x) + Math.abs(event.clientY - pointerStart.y) > 15) return;
    navigate(state.index + (event.clientX > window.innerWidth / 2 ? 1 : -1));
});
fromHash();
