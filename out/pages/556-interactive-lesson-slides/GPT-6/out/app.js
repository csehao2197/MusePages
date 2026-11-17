import { lesson, ui, slides, outline, starterCode, steps, checks, swatches, seededMarks } from "./lesson.js";
import { icons } from "./icons.js";
import { basicSetup } from "./vendor/e0a93a06682a2ec7.js";
import { EditorView, keymap } from "./vendor/814a432695193340.js";
import { HighlightStyle, syntaxHighlighting } from "./vendor/30f5b6351d828249.js";
import { javascript } from "./vendor/ec6e3fb68faf506d.js";
import { tags } from "./vendor/111aff7b145ff29f.js";

const root = document.querySelector("#app");
const storageKey = `${lesson.brand}-${lesson.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const mobile = () => matchMedia("(max-width: 767px)").matches;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const emptyState = () => ({ answers: {}, code: starterCode, marks: {}, sidebarCollapsed: false });
let state = emptyState();
try
{
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object")
    {
        state =
        {
            answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
            code: typeof saved.code === "string" ? saved.code : starterCode,
            marks: saved.marks && typeof saved.marks === "object" ? saved.marks : {},
            sidebarCollapsed: saved.sidebarCollapsed === true
        };
        for (const n of checks)
        {
            const a = state.answers[n];
            if (a && (typeof a.correct !== "boolean" || !Number.isInteger(a.attempts) || a.attempts < 1 ||
                n === 5 && (!Array.isArray(a.selection) || a.selection.length !== 5 || new Set(a.selection).size !== 5 || !a.selection.every(v => Number.isInteger(v) && v >= 0 && v <= 4)) ||
                n === 8 && (!Array.isArray(a.selection) || a.selection.length !== 2 || !a.selection.every(v => typeof v === "string") || !Array.isArray(a.valid) || a.valid.length !== 2) ||
                [3, 6, 10].includes(n) && (!Number.isInteger(a.selection) || a.selection < 0 || a.selection > 3)))
            {
                delete state.answers[n];
            }
        }
        for (const n of Object.keys(state.marks))
        {
            if (!Array.isArray(state.marks[n]) || !state.marks[n].every(s => s && ["pen", "highlighter"].includes(s.tool) &&
                swatches.includes(s.color) && Array.isArray(s.points) &&
                s.points.every(p => Array.isArray(p) && p.length === 2 && p.every(v => Number.isFinite(v) && v >= 0 && v <= 1))))
            {
                delete state.marks[n];
            }
        }
    }
}
catch
{
    state = emptyState();
}

let current = 1;
let drawer = false;
let drawMode = false;
let tool = "pen";
let color = swatches[0];
let stepIndex = 0;
let playTimer;
let editor;
let observer;
let runner;
let runnerTimer;
let runStart;
let codeRan = state.answers[7]?.ran === true;
let codeStatus = ui.notRun;
let codeLines = [];
let runFailed = false;
let reorder = state.answers[5]?.selection?.slice?.() || [0, 1, 2, 3, 4];
let fill = state.answers[8]?.selection?.slice?.() || ["", ""];
let undoHistory = {};
let retryAttempts = state.answers._attempts && typeof state.answers._attempts === "object" ? state.answers._attempts : {};
let present = false;
let copiedTimer;
let dialogReturn;
let dragFrom = null;
let resizeFrame;

const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = name => icons[name] || "";
const score = () => checks.filter(n => state.answers[n]?.correct).length;
const image = (name, className = "") => `<img class="${className}" src="${lesson.images[name].src}" alt="${escape(lesson.images[name].alt)}">`;
const button = (action, label, name, className = "", extra = "") => `<button type="button" class="${className}" data-action="${action}" ${extra}>${name ? icon(name) : ""}<span>${escape(label)}</span></button>`;
const iconButton = (action, label, name, extra = "") => `<button type="button" class="icon-button" data-action="${action}" aria-label="${escape(label)}" title="${escape(label)}" ${extra}>${icon(name)}</button>`;

function save()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }
    catch
    {
        // Storage is optional, including in private browsing.
    }
}

function navigate(n)
{
    const target = Math.max(1, Math.min(12, n));
    location.hash = `/slide/${target}`;
}

function readRoute()
{
    const match = location.hash.match(/^#\/slide\/(-?\d+)$/);
    const requested = match ? Number(match[1]) : 1;
    const n = Math.min(12, Math.max(1, requested));
    if (location.hash !== `#/slide/${n}`)
    {
        location.replace(`${location.pathname}${location.search}#/slide/${n}`);
    }
    if (current !== n)
    {
        clearInterval(playTimer);
        playTimer = undefined;
        drawMode = false;
    }
    current = n;
    drawer = false;
    render();
}

function sidebar()
{
    const types = { title: "Presentation", concept: "Shapes", quiz: "CircleHelp", reorder: "CircleHelp", fill: "CircleHelp", code: "Code", recap: "Flag" };
    return `<aside class="sidebar" aria-label="${escape(ui.menu)}">
        <header class="sidebar-header">
            <div class="brand"><div class="brand-mark">${lesson.brand.charAt(0)}</div><strong>${lesson.brand}</strong></div>
            <p class="course">${lesson.course}</p><h2>${lesson.title}</h2>
            <div class="score-row"><span>${ui.checks}</span><b class="score-pill">${score()}/5</b></div>
            <div class="score-segments">${checks.map(n => `<span class="${state.answers[n] ? state.answers[n].correct ? "correct" : "incorrect" : ""}"></span>`).join("")}</div>
        </header>
        <nav class="outline">${outline.map(group => `<section><h3>${group.title}</h3>${group.slides.map(([n, title]) =>
        {
            const a = state.answers[n];
            return `<a href="#/slide/${n}" class="outline-row ${n === current ? "current" : ""}" ${n === current ? 'aria-current="step"' : ""} title="${escape(title)}">
                <span class="slide-index">${String(n).padStart(2, "0")}</span><span class="type-icon">${icon(types[slides[n - 1].kind])}</span>
                <span class="outline-title">${title}</span><span class="row-status ${a?.correct ? "correct" : a ? "incorrect" : ""}">${a ? icon(a.correct ? "Check" : "X") : n === 7 && codeRan ? icon("Play") : state.marks[n]?.length ? icon("Pen") : ""}</span></a>`;
        }).join("")}</section>`).join("")}</nav>
        <footer class="sidebar-footer">
            <div class="instructor-small">${image("instructor")}<div><strong>${lesson.instructor}</strong>${button("help", ui.shortcutsHint, null, "text-button")}</div></div>
            <div class="footer-bottom"><a href="${lesson.credit.url}" target="_blank" rel="noreferrer">${lesson.credit.label}</a>${iconButton("outline", ui.outline, state.sidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose")}</div>
        </footer>
        <div class="rail-expand">${iconButton("outline", ui.outline, "PanelLeftOpen")}</div>
    </aside>`;
}

function bars(values, sortedUpTo = -1, active = null, className = "")
{
    const width = 1120;
    const gap = width / values.length;
    const max = Math.max(...values, 8);
    return `<svg class="book-bars ${className}" viewBox="0 0 1152 310" role="img" aria-label="${ui.barsLabel}: ${values.join(", ")}">
        <defs><filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2"/></filter></defs>
        <path class="baseline" d="M8 286 Q560 283 1144 286"/>
        ${values.map((v, i) =>
        {
            const height = 35 + (v / max) * 195;
            const x = 20 + i * gap;
            return `<g class="book ${v === active ? "active" : i <= sortedUpTo ? "sorted" : ""}" style="transform:translateX(${x}px)">
                <rect x="0" y="${285 - height}" width="${gap * .68}" height="${height}" rx="3"/>
                <path d="M14 ${296 - height} V270" class="book-spine"/>
                <text x="${gap * .34}" y="${265 - height}" text-anchor="middle">${v}</text></g>`;
        }).join("")}
    </svg>`;
}

function heading(slide, tag = "h1")
{
    return `<p class="kicker">${slide.kicker}</p><${tag}>${slide.title}</${tag}>`;
}

function titleSlide(slide)
{
    return `<div class="title-layout">
        <div class="title-copy"><p class="kicker">${slide.kicker}</p>
        <h1>${slide.title.split(" ").slice(0, -1).join(" ")}<br><span class="underlined">${slide.title.split(" ").at(-1)}<svg viewBox="0 0 320 24" aria-hidden="true"><path d="M5 17 Q160 -2 310 12 M20 22 Q170 8 299 17"/></svg></span></h1>
        <p class="title-subhead">${slide.body}</p>
        <div class="teacher">${image("instructor")}<div><strong>${lesson.instructor}</strong><span>${lesson.audience}<br>${ui.location}</span></div></div>
        <div class="title-buttons">${button("goto:2", ui.start, "ArrowRight", "primary")}${button("goto:7", ui.jump, null, "board-text")}</div></div>
        <div class="title-art"><figure class="photo taped">${image("desk")}</figure><div class="lesson-chip">${icon("Presentation")}${ui.chip}</div>
        <div class="mini-shelf">${bars([5, 2, 8, 3, 7, 1, 6, 4], -1, 8)}</div></div>
    </div>`;
}

function conceptSlide(slide)
{
    if (slide.variant === "photo")
    {
        return `<div class="concept-photo"><div>${heading(slide)}<p>${slide.body}</p><div class="stats"><div><strong>1,000</strong><span>${ui.stats[0]}</span></div><div><strong>10</strong><span>${ui.stats[1]}</span></div></div><p class="footnote">${ui.footnote}</p></div><figure class="photo taped">${image("shelf")}</figure></div>`;
    }
    if (slide.variant === "stepper")
    {
        const step = steps[stepIndex];
        return `<div class="stepper-slide">${heading(slide)}<div class="step-label">${ui.step(stepIndex + 1, steps.length)}</div><div id="step-diagram">${bars(step.values, step.sortedUpTo, step.active)}</div>
            <div class="step-bottom"><p id="step-caption">${step.caption}</p><div><div class="step-controls">
            ${iconButton("stepBack", ui.back, "ChevronLeft", stepIndex === 0 ? "disabled" : "")}
            ${button("stepPlay", playTimer ? ui.pause : ui.play, playTimer ? "Pause" : "Play", "primary", reduced.matches ? `disabled title="${ui.reduced}"` : "")}
            ${iconButton("stepNext", ui.stepNext, "ChevronRight", stepIndex === 7 ? "disabled" : "")}</div>
            <div class="step-dots">${steps.map((_, i) => `<button aria-label="${ui.step(i + 1, 8)}" data-action="step:${i}" class="${stepIndex === i ? "active" : ""}"></button>`).join("")}</div><span class="shift-counter">${ui.shiftCount(step.shifts)}</span></div></div>
            <div class="legend"><span><i class="sorted-key"></i>${ui.sorted}</span><span><i class="active-key"></i>${ui.active}</span><span><i></i>${ui.unsorted}</span></div></div>`;
    }
    if (slide.variant === "bars")
    {
        return `${heading(slide)}<div class="work-layout"><div class="work-bars">${[0, 15, 28].map((n, i) => `<div><p>${ui.barLabels[i]}</p><div class="work-track"><span style="width:${Math.max(1, n / 28 * 88)}%"></span><b>${n}</b></div></div>`).join("")}</div><aside class="callout"><strong>499,500</strong><span>${ui.bigShifts}</span></aside></div><p class="work-conclusion">${ui.conclusion}</p>`;
    }
    return `<div class="board-layout"><div>${heading(slide)}<p>${slide.body}</p>${button("startDraw", ui.markStart, "Pencil", "primary")}<p class="signature">${lesson.instructor}</p></div><div>${bars([2, 4, 7, 9, 5], 3, 5)}</div></div>`;
}

function feedback(slide, correctLabel = ui.first, wrongLabel = ui.wrong)
{
    const answer = state.answers[current];
    if (!answer) return "";
    return `<div class="feedback ${answer.correct ? "is-correct" : "is-wrong"}" role="status"><strong>${icon(answer.correct ? "Check" : "X")}${answer.correct ? correctLabel : wrongLabel}</strong><p>${slide.explanation}</p><div>${button("retry", ui.again, "RotateCcw", "board-text")}${button(`goto:${current + 1}`, ui.nextSlide, "ArrowRight", "primary")}</div></div>`;
}

function quizSlide(slide)
{
    const answer = state.answers[current];
    return `<div class="quiz-layout"><div class="question">${heading(slide)}${current === 6 ? bars([2, 3, 5, 8, 4], 3, 4) : ""}</div><div class="answers"><div class="option-list">${slide.options.map((option, i) => `<button data-action="answer:${i}" class="option ${current === 10 ? "mono" : ""} ${answer && i === answer.selection ? answer.correct ? "chosen correct" : "chosen incorrect" : ""} ${answer && i === slide.correct ? "correct-answer" : ""}" ${answer ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${option}</span>${answer && i === answer.selection ? icon(answer.correct ? "Check" : "X") : ""}</button>`).join("")}</div>${feedback(slide)}</div></div>`;
}

function reorderSlide(slide)
{
    const answer = state.answers[current];
    return `<div class="reorder-layout"><div>${heading(slide)}</div><div class="reorder-content"><div class="reorder-list">${reorder.map((item, i) => `<div class="reorder-row ${answer ? item === slide.correct[i] ? "correct" : "incorrect" : ""}" data-index="${i}"><button type="button" class="grip icon-button" data-drag="${i}" aria-label="${ui.grip}" ${answer ? "disabled" : ""}>${icon("GripVertical")}</button><span class="position">${i + 1}</span><span class="reorder-text">${slide.items[item]}</span><div class="reorder-arrows">${iconButton(`move:${i}:-1`, ui.up, "ChevronUp", i === 0 || answer ? "disabled" : "")}${iconButton(`move:${i}:1`, ui.down, "ChevronDown", i === 4 || answer ? "disabled" : "")}</div>${answer ? icon(item === slide.correct[i] ? "Check" : "X") : ""}</div>`).join("")}</div>${answer ? feedback(slide, ui.reorderRight, ui.reorderWrong) : button("checkOrder", ui.checkOrder, "Check", "primary check-button")}</div></div>`;
}

function fillSlide(slide)
{
    const answer = state.answers[8];
    return `<div class="fill-layout">${heading(slide)}<form id="fill-form"><p class="fill-sentence">${ui.fillStart}
        <span class="input-wrap"><input name="comparisons" aria-label="${ui.comparisons}" autocomplete="off" value="${escape(fill[0])}" ${answer ? "disabled" : ""} class="${answer ? answer.valid[0] ? "correct" : "incorrect" : ""}">${answer ? icon(answer.valid[0] ? "Check" : "X") : ""}</span> ${ui.compare}
        <span class="input-wrap"><input name="shifts" aria-label="${ui.shifts}" autocomplete="off" value="${escape(fill[1])}" ${answer ? "disabled" : ""} class="${answer ? answer.valid[1] ? "correct" : "incorrect" : ""}">${answer ? icon(answer.valid[1] ? "Check" : "X") : ""}</span> ${ui.shiftSentence}</p>
        ${answer ? "" : `<button class="primary" type="submit">${icon("Check")}${ui.checkAnswers}</button>`}</form>${feedback(slide, ui.fillRight, ui.fillWrong)}</div>`;
}

function codeSlide(slide)
{
    return `<div class="code-slide">${heading(slide)}<p class="code-task">${slide.body}</p><div class="code-panes"><div class="editor-pane"><div class="pane-toolbar"><span>${ui.file}</span><div>${button("run", ui.run, "Play", "primary", 'title="Ctrl / ⌘ + Enter"')}${iconButton("resetCode", ui.reset, "RotateCcw")}</div></div><div id="editor" aria-label="${ui.editorLabel}"></div></div><div class="console-pane"><div class="pane-toolbar"><span>${ui.console}</span><span id="code-status">${escape(codeStatus)}</span></div><div id="console-log" aria-live="polite"></div></div></div><p class="sandbox-note">${ui.sandbox}</p></div>`;
}

function recapSlide(slide)
{
    const first = checks.filter(n => state.answers[n]?.correct && state.answers[n]?.attempts === 1).length;
    return `${heading(slide)}<div class="recap-layout"><div><div class="recap-score">${ui.score(score())}</div><p>${checks.some(n => state.answers[n]) ? ui.firstTry(first) : ui.waiting}</p><div class="check-chips">${checks.map((n, i) => `<a href="#/slide/${n}" class="${state.answers[n] ? state.answers[n].correct ? "correct" : "incorrect" : ""}">${state.answers[n] ? icon(state.answers[n].correct ? "Check" : "X") : ""}${ui.check(i + 1)}</a>`).join("")}</div>${score() < 5 ? button("retryMissed", ui.retry, "ArrowRight", "primary") : ""}${button("resetProgress", ui.resetProgress, null, "board-text")}<div id="reset-confirm"></div></div><div class="takeaways"><p class="kicker">${ui.takeawaysTitle}</p>${ui.takeaways.map((text, i) => `<div><span>0${i + 1}</span><p>${text}</p></div>`).join("")}</div><div class="homework">${image("cards")}<div><p class="kicker">${ui.homeworkLabel}</p><p>${ui.homework}</p><p class="next-lesson">${ui.nextLesson}</p><div class="office">${image("instructor")}<p><b>${lesson.instructor}</b><br>${ui.office}<br>${lesson.brand}</p></div></div></div></div>`;
}

function controlBar()
{
    return `<footer class="control-bar">${iconButton("previous", ui.previous, "ChevronLeft", current === 1 ? "disabled" : "")}${iconButton("next", ui.next, "ChevronRight", current === 12 ? "disabled" : "")}
        <div class="progress" role="slider" aria-label="${ui.progress}" tabindex="0" aria-valuemin="1" aria-valuemax="12" aria-valuenow="${current}" id="progress"><span style="width:${current / 12 * 100}%"></span></div>
        <span class="page-counter">${current} <i>/</i> 12</span>${button("draw", ui.draw, "Pencil", drawMode ? "draw-button active" : "draw-button")}
        ${button("copy", ui.copy, "Link2", "copy-button")}<div class="desktop-controls">${iconButton("help", ui.shortcuts, "Keyboard")}${iconButton("present", ui.present, "Maximize")}</div></footer>`;
}

function drawToolbar()
{
    return `<div class="draw-toolbar" role="toolbar" aria-label="${ui.draw}">
        ${[["pen", "Pen"], ["highlighter", "Highlighter"], ["eraser", "Eraser"]].map(([value, name]) => `<button class="icon-button ${tool === value ? "active" : ""}" data-action="tool:${value}" aria-label="${ui[value]}" aria-pressed="${tool === value}">${icon(name)}</button>`).join("")}
        <span class="tool-divider"></span>${swatches.map((c, i) => `<button class="swatch ${color === c ? "selected" : ""}" style="--swatch:${c}" data-action="color:${i}" aria-label="${ui.colors[i]}" aria-pressed="${color === c}"></button>`).join("")}
        <span class="tool-divider"></span>${iconButton("undo", ui.undo, "Undo2")}${iconButton("clear", ui.clear, "Trash2")}${button("draw", ui.done, "X", "done-button")}</div>`;
}

function render()
{
    editor?.destroy();
    editor = undefined;
    observer?.disconnect();
    cancelRunner();
    cancelAnimationFrame(resizeFrame);
    const slide = slides[current - 1];
    const renderers = { title: titleSlide, concept: conceptSlide, quiz: quizSlide, reorder: reorderSlide, fill: fillSlide, code: codeSlide, recap: recapSlide };
    root.className = `${state.sidebarCollapsed ? "collapsed" : ""} ${drawer ? "drawer-open" : ""} ${present ? "presenting" : ""}`;
    root.innerHTML = `${drawer ? `<button class="drawer-scrim" data-action="closeDrawer" aria-label="${ui.drawerClose}"></button>` : ""}${sidebar()}
        <div class="mobile-top">${iconButton("menu", ui.menu, "Menu")}<strong>${lesson.title}</strong><b class="score-pill">${score()}/5</b></div>
        <main class="main"><div class="stage-area"><div class="stage-eyebrow"><span>${ui.ready}</span><span>04 / 02</span></div><div class="canvas-size"><section class="slide-surface ${slide.kind} ${drawMode ? "drawing" : ""}" aria-label="${escape(slide.title)}"><div class="slide-content" ${drawMode ? "inert" : ""}>${renderers[slide.kind](slide)}</div><canvas id="marks" aria-label="${ui.draw}"></canvas></section><div class="ledge"></div></div><div class="stage-note">${ui.warmup}</div>${drawMode ? drawToolbar() : ""}</div>${controlBar()}</main><div class="sr-only" id="announcement" aria-live="polite"></div>`;
    if (current === 11 && !Object.hasOwn(state.marks, 11))
    {
        state.marks[11] = seededMarks(mobile());
        save();
    }
    observer = new ResizeObserver(() =>
    {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(sizeStage);
    });
    observer.observe(document.querySelector(".stage-area"));
    observer.observe(document.querySelector(".slide-content"));
    sizeStage();
    setupCanvas();
    setupReordering();
    if (slide.kind === "code")
    {
        setupEditor();
        renderConsole();
    }
    document.querySelector(`.outline-row.current`)?.scrollIntoView({ block: "nearest" });
}

function sizeStage()
{
    const area = document.querySelector(".stage-area");
    const box = document.querySelector(".canvas-size");
    const surface = document.querySelector(".slide-surface");
    if (!surface) return;
    if (!mobile())
    {
        const scale = Math.min((area.clientWidth - 48) / 1280, (area.clientHeight - 100) / 726, 1.4);
        box.style.width = `${1280 * scale}px`;
        box.style.height = `${726 * scale}px`;
        surface.style.transform = `scale(${scale})`;
        surface.style.transformOrigin = "top left";
        document.querySelector(".ledge").style.top = `${720 * scale}px`;
    }
    else
    {
        box.style.width = "";
        box.style.height = "";
        surface.style.transform = "";
        document.querySelector(".ledge").style.top = "";
    }
    resizeCanvas();
}

const editorTheme = EditorView.theme(
{
    "&": { color: "#F3F0E3", backgroundColor: "#173A2F", fontSize: "18px", height: "100%" },
    ".cm-content": { fontFamily: "'JetBrains Mono', monospace", caretColor: "#F5CF3A", padding: "16px 0" },
    ".cm-scroller": { overflow: "auto", fontFamily: "'JetBrains Mono', monospace" },
    ".cm-gutters": { backgroundColor: "#173A2F", color: "#B9C9B8", border: "none" },
    ".cm-activeLineGutter": { backgroundColor: "rgba(243,240,227,0.05)" },
    ".cm-activeLine": { backgroundColor: "rgba(243,240,227,0.05)" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "rgba(245,207,58,0.25)" },
    ".cm-cursor": { borderLeftColor: "#F5CF3A" },
    ".cm-tooltip": { color: "#25302A", backgroundColor: "#FFFBF1", border: "1px solid #DDD2BA" }
}, { dark: true });

function setupEditor()
{
    editor = new EditorView(
    {
        parent: document.querySelector("#editor"),
        doc: state.code,
        extensions:
        [
            keymap.of([{ key: "Mod-Enter", run: () => { runCode(); return true; } }]),
            basicSetup, javascript(), editorTheme,
            syntaxHighlighting(HighlightStyle.define(
            [
                { tag: tags.keyword, color: "#F5CF3A" }, { tag: tags.string, color: "#8FD3A8" },
                { tag: tags.number, color: "#E58E73" }, { tag: tags.comment, color: "#B9C9B8" },
                { tag: tags.function(tags.variableName), color: "#F3F0E3", fontWeight: "600" }
            ])),
            EditorView.contentAttributes.of({ "aria-label": ui.editorLabel }),
            EditorView.updateListener.of(update =>
            {
                if (update.docChanged)
                {
                    state.code = update.state.doc.toString();
                    save();
                }
            })
        ]
    });
}

function cancelRunner()
{
    clearTimeout(runnerTimer);
    runner?.remove();
    runner = undefined;
}

function runCode()
{
    cancelRunner();
    codeRan = true;
    state.answers[7] = { ran: true };
    save();
    codeLines = [];
    runFailed = false;
    codeStatus = ui.running;
    renderConsole();
    document.querySelector('.outline-row[href="#/slide/7"] .row-status').innerHTML = icon("Play");
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("title", ui.sandbox);
    const code = state.code.replace(/<\/script/gi, "<\\/script");
    const harness = `const send=(kind,data)=>parent.postMessage({lessonRunner:true,kind,...data},"*");
const format=value=>{try{return typeof value==="string"?value:JSON.stringify(value)??String(value)}catch{return String(value)}};
for(const level of ["log","info","warn","error"])console[level]=(...args)=>send("log",{text:args.map(format).join(" "),level});
window.onerror=(message,source,line)=>{send("error",{message:String(message),line:Math.max(1,line-10)});return true};
window.onunhandledrejection=event=>{event.preventDefault();send("error",{message:String(event.reason),line:1})};`;
    // Keep learner code on line 11, so reported syntax/runtime lines are relative to the editor.
    iframe.srcdoc = `<!doctype html>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'">
<script>
${harness}
</script>
<script>
${code}
</script>
<script>parent.postMessage({lessonRunner:true,kind:"done"},"*")</script>`;
    runStart = performance.now();
    runner = iframe;
    document.body.append(iframe);
    runnerTimer = setTimeout(() =>
    {
        cancelRunner();
        codeLines.push({ text: ui.timeout, error: true });
        codeStatus = ui.timeout;
        renderConsole();
    }, 3000);
}

window.addEventListener("message", event =>
{
    if (!runner || event.source !== runner.contentWindow || !event.data?.lessonRunner) return;
    const message = event.data;
    if (message.kind === "log" && typeof message.text === "string")
    {
        if (codeLines.length < 500) codeLines.push({ text: message.text.slice(0, 10000), error: message.level === "error" });
    }
    else if (message.kind === "error")
    {
        runFailed = true;
        const line = Number.isFinite(message.line) ? Math.max(1, message.line) : 1;
        codeStatus = ui.errorLine(line);
        codeLines.push({ text: `${ui.errorLine(line)}: ${String(message.message).slice(0, 2000)}`, error: true });
    }
    else if (message.kind === "done")
    {
        if (!runFailed) codeStatus = ui.ran(Math.round(performance.now() - runStart));
        clearTimeout(runnerTimer);
        // Retain the sandbox through this task's microtasks so rejected promises are captured.
        const completed = runner;
        setTimeout(() =>
        {
            if (runner === completed)
            {
                completed.remove();
                runner = undefined;
            }
        }, 80);
    }
    renderConsole();
});

function renderConsole()
{
    const output = document.querySelector("#console-log");
    if (!output) return;
    document.querySelector("#code-status").textContent = codeStatus;
    output.innerHTML = codeLines.length ? codeLines.map(line => `<div class="log-line ${line.error ? "error" : ""}">${line.error ? icon("X") : ""}<span>${escape(line.text)}</span></div>`).join("") : `<p class="console-empty">${ui.emptyConsole}</p>`;
    output.scrollTop = output.scrollHeight;
}

function record(selection, correct, extra = {})
{
    const old = state.answers[current];
    state.answers[current] = { selection, correct, attempts: (old?.attempts || retryAttempts[current] || 0) + 1, ...extra };
    delete retryAttempts[current];
    state.answers._attempts = { ...retryAttempts };
    save();
    render();
}

function retry()
{
    const old = state.answers[current];
    if (!old) return;
    retryAttempts[current] = old.attempts;
    state.answers._attempts = { ...retryAttempts };
    if (current === 8)
    {
        fill = fill.map((value, i) => old.valid[i] ? value : "");
    }
    delete state.answers[current];
    save();
    render();
}

function moveRow(from, delta)
{
    const to = from + delta;
    if (to < 0 || to > 4 || state.answers[5]) return;
    const [item] = reorder.splice(from, 1);
    reorder.splice(to, 0, item);
    render();
    document.querySelector(`.reorder-row[data-index="${to}"] button[data-action^="move:"]:not(:disabled)`)?.focus();
}

function setupReordering()
{
    document.querySelectorAll("[data-drag]").forEach(handle =>
    {
        handle.addEventListener("pointerdown", event =>
        {
            if (state.answers[5]) return;
            event.preventDefault();
            dragFrom = Number(handle.dataset.drag);
            handle.setPointerCapture(event.pointerId);
            handle.closest(".reorder-row").classList.add("dragging");
        });
        handle.addEventListener("pointermove", event =>
        {
            if (dragFrom === null) return;
            const rows = [...document.querySelectorAll(".reorder-row")];
            for (const row of rows)
            {
                const r = row.getBoundingClientRect();
                row.classList.toggle("drop-target", event.clientY >= r.top && event.clientY <= r.bottom);
            }
        });
        handle.addEventListener("pointerup", event =>
        {
            if (dragFrom === null) return;
            const target = [...document.querySelectorAll(".reorder-row")].find(row =>
            {
                const r = row.getBoundingClientRect();
                return event.clientY >= r.top && event.clientY <= r.bottom;
            });
            const from = dragFrom;
            dragFrom = null;
            if (target) moveRow(from, Number(target.dataset.index) - from);
            else render();
        });
        handle.addEventListener("pointercancel", () => { dragFrom = null; render(); });
    });
}

function setStep(n)
{
    stepIndex = Math.max(0, Math.min(7, n));
    if (stepIndex === 7)
    {
        clearInterval(playTimer);
        playTimer = undefined;
    }
    render();
}

function toggleDraw()
{
    drawMode = !drawMode;
    render();
}

async function copyLink()
{
    let success = false;
    try
    {
        await navigator.clipboard.writeText(location.href);
        success = true;
    }
    catch
    {
        const input = document.createElement("textarea");
        input.value = location.href;
        input.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0";
        document.body.append(input);
        input.select();
        try { success = document.execCommand("copy"); } catch { success = false; }
        input.remove();
    }
    const message = success ? ui.copied(current) : ui.copyFailed;
    document.querySelector("#announcement").textContent = message;
    const label = document.querySelector(".copy-button span");
    if (label)
    {
        label.textContent = message;
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => { if (label.isConnected) label.textContent = ui.copy; }, 1600);
    }
}

async function togglePresent()
{
    present = !present;
    if (present)
    {
        try { await document.documentElement.requestFullscreen(); } catch { /* Presentation layout also works without fullscreen permission. */ }
    }
    else if (document.fullscreenElement)
    {
        try { await document.exitFullscreen(); } catch { /* Keep layout usable if exiting fullscreen is denied. */ }
    }
    render();
}

document.addEventListener("fullscreenchange", () =>
{
    if (!document.fullscreenElement && present)
    {
        present = false;
        render();
    }
});

function openHelp()
{
    if (document.querySelector("dialog")) return;
    dialogReturn = document.activeElement;
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `<div class="dialog-heading"><h2>${ui.shortcuts}</h2>${iconButton("closeHelp", ui.close, "X")}</div><div class="shortcut-grid">${ui.helpRows.map(([key, text]) => `<div><kbd>${key}</kbd><span>${text}</span></div>`).join("")}</div>`;
    dialog.setAttribute("aria-label", ui.shortcuts);
    dialog.addEventListener("close", () => { dialog.remove(); dialogReturn?.focus(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) closeHelp(); });
    document.body.append(dialog);
    dialog.showModal();
    dialog.querySelector("button").focus();
}

function closeHelp()
{
    document.querySelector("dialog")?.close();
}

document.addEventListener("click", event =>
{
    const target = event.target.closest("[data-action]");
    if (!target || target.disabled) return;
    const [action, a, b] = target.dataset.action.split(":");
    if (action === "goto") navigate(Number(a));
    else if (action === "previous") navigate(current - 1);
    else if (action === "next") navigate(current + 1);
    else if (action === "menu") { drawer = !drawer; render(); }
    else if (action === "closeDrawer") { drawer = false; render(); }
    else if (action === "outline") { state.sidebarCollapsed = !state.sidebarCollapsed; save(); render(); }
    else if (action === "answer" && slides[current - 1].kind === "quiz" && !state.answers[current]) record(Number(a), Number(a) === slides[current - 1].correct);
    else if (action === "retry") retry();
    else if (action === "move") moveRow(Number(a), Number(b));
    else if (action === "checkOrder") record([...reorder], reorder.every((n, i) => n === slides[4].correct[i]));
    else if (action === "step") { clearInterval(playTimer); playTimer = undefined; setStep(Number(a)); }
    else if (action === "stepBack") setStep(stepIndex - 1);
    else if (action === "stepNext") setStep(stepIndex + 1);
    else if (action === "stepPlay")
    {
        if (playTimer) { clearInterval(playTimer); playTimer = undefined; render(); }
        else if (!reduced.matches)
        {
            if (stepIndex === 7) stepIndex = 0;
            playTimer = setInterval(() => setStep(stepIndex + 1), 1200);
            render();
        }
    }
    else if (action === "run") runCode();
    else if (action === "resetCode")
    {
        cancelRunner();
        state.code = starterCode;
        codeLines = [];
        codeStatus = ui.notRun;
        save();
        render();
    }
    else if (action === "draw") toggleDraw();
    else if (action === "startDraw") { tool = "pen"; drawMode = true; render(); }
    else if (action === "tool") { tool = a; render(); }
    else if (action === "color") { color = swatches[Number(a)]; render(); }
    else if (action === "undo") undo();
    else if (action === "clear") { snapshot(); state.marks[current] = []; save(); render(); }
    else if (action === "copy") copyLink();
    else if (action === "help") openHelp();
    else if (action === "closeHelp") closeHelp();
    else if (action === "present") togglePresent();
    else if (action === "retryMissed") navigate(checks.find(n => !state.answers[n]?.correct) || 12);
    else if (action === "resetProgress")
    {
        document.querySelector("#reset-confirm").innerHTML = `<p>${ui.confirmReset}</p>${button("confirmReset", ui.confirm, null, "primary")}${button("cancelReset", ui.cancel, null, "board-text")}`;
    }
    else if (action === "cancelReset") document.querySelector("#reset-confirm").innerHTML = "";
    else if (action === "confirmReset")
    {
        state = emptyState();
        codeLines = [];
        codeStatus = ui.notRun;
        codeRan = false;
        retryAttempts = {};
        undoHistory = {};
        reorder = [0, 1, 2, 3, 4];
        fill = ["", ""];
        save();
        navigate(1);
    }
});

root.addEventListener("click", event =>
{
    const progress = event.target.closest("#progress");
    if (progress)
    {
        const r = progress.getBoundingClientRect();
        navigate(Math.max(1, Math.ceil((event.clientX - r.left) / r.width * 12)));
    }
});

root.addEventListener("input", event =>
{
    if (event.target.name === "comparisons") fill[0] = event.target.value;
    if (event.target.name === "shifts") fill[1] = event.target.value;
});

root.addEventListener("submit", event =>
{
    if (event.target.id !== "fill-form") return;
    event.preventDefault();
    if (state.answers[8]) return;
    const valid = [new Set(["7", "seven"]).has(fill[0].trim().toLowerCase()), new Set(["0", "zero", "none"]).has(fill[1].trim().toLowerCase())];
    record([...fill], valid.every(Boolean), { valid });
});

document.addEventListener("keydown", event =>
{
    if (document.querySelector("dialog")) return;
    if (event.target.closest("input, textarea, .cm-editor, [contenteditable=true]")) return;
    if (event.altKey || event.metaKey && event.key.toLowerCase() !== "z" || event.ctrlKey && event.key.toLowerCase() !== "z") return;
    const key = event.key.toLowerCase();
    if (key === "escape")
    {
        if (drawer) { drawer = false; render(); }
        else if (drawMode) toggleDraw();
        else if (present) togglePresent();
        return;
    }
    if (key === " " && event.target.closest("button")) return;
    const actions =
    {
        arrowleft: () => navigate(current - 1), pageup: () => navigate(current - 1),
        arrowright: () => navigate(current + 1), pagedown: () => navigate(current + 1),
        " ": () => navigate(current + 1), home: () => navigate(1), end: () => navigate(12),
        o: () => { if (mobile()) drawer = !drawer; else state.sidebarCollapsed = !state.sidebarCollapsed; save(); render(); },
        d: toggleDraw, p: () => { tool = "pen"; if (drawMode) render(); },
        h: () => { tool = "highlighter"; if (drawMode) render(); },
        e: () => { tool = "eraser"; if (drawMode) render(); },
        z: undo, c: copyLink, f: togglePresent, "?": openHelp
    };
    if (actions[key])
    {
        event.preventDefault();
        actions[key]();
    }
    else if (/^[1-4]$/.test(key) && slides[current - 1].kind === "quiz" && !state.answers[current] && !drawMode)
    {
        event.preventDefault();
        record(Number(key) - 1, Number(key) - 1 === slides[current - 1].correct);
    }
});

function snapshot()
{
    const history = undoHistory[current] ||= [];
    history.push(JSON.stringify(state.marks[current] || []));
    if (history.length > 30) history.shift();
}

function undo()
{
    const history = undoHistory[current];
    if (!history?.length) return;
    state.marks[current] = JSON.parse(history.pop());
    save();
    render();
}

function resizeCanvas()
{
    const canvas = document.querySelector("#marks");
    const surface = document.querySelector(".slide-surface");
    if (!canvas || !surface) return;
    const width = mobile() ? surface.clientWidth : 1280;
    const height = mobile() ? Math.max(surface.scrollHeight, surface.clientHeight) : 720;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    paintMarks();
}

function paintMarks()
{
    const canvas = document.querySelector("#marks");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const width = canvas.width / devicePixelRatio;
    const height = canvas.height / devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    for (const stroke of state.marks[current] || [])
    {
        if (!stroke.points?.length) continue;
        context.beginPath();
        context.strokeStyle = stroke.color;
        context.globalAlpha = stroke.tool === "highlighter" ? .4 : 1;
        context.lineWidth = (stroke.tool === "highlighter" ? 22 : 4) * (mobile() ? .55 : 1);
        context.lineCap = stroke.tool === "highlighter" ? "square" : "round";
        context.lineJoin = "round";
        const points = stroke.points.map(([x, y]) => [x * width, y * height]);
        context.moveTo(...points[0]);
        for (let i = 1; i < points.length - 1; i++)
        {
            const [x, y] = points[i];
            const [nx, ny] = points[i + 1];
            context.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
        }
        context.lineTo(...points.at(-1));
        if (points.length === 1) context.lineTo(points[0][0] + .1, points[0][1] + .1);
        context.stroke();
    }
    context.globalAlpha = 1;
}

function setupCanvas()
{
    const canvas = document.querySelector("#marks");
    let activeStroke;
    let pointer;
    let savedOverflow;
    const position = event =>
    {
        const r = canvas.getBoundingClientRect();
        return [Math.max(0, Math.min(1, (event.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (event.clientY - r.top) / r.height))];
    };
    const eraseAt = point =>
    {
        const r = canvas.getBoundingClientRect();
        state.marks[current] = (state.marks[current] || []).filter(stroke =>
        {
            for (let i = 0; i < stroke.points.length; i++)
            {
                const a = stroke.points[i];
                const b = stroke.points[Math.max(0, i - 1)];
                const dx = (a[0] - b[0]) * r.width;
                const dy = (a[1] - b[1]) * r.height;
                const px = (point[0] - b[0]) * r.width;
                const py = (point[1] - b[1]) * r.height;
                const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
                if (Math.hypot(px - t * dx, py - t * dy) < 14) return false;
            }
            return true;
        });
    };
    canvas.addEventListener("pointerdown", event =>
    {
        if (!drawMode) return;
        event.preventDefault();
        pointer = event.pointerId;
        canvas.setPointerCapture(pointer);
        savedOverflow = document.querySelector(".slide-surface").style.overflowY;
        if (mobile()) document.querySelector(".slide-surface").style.overflowY = "hidden";
        snapshot();
        state.marks[current] ||= [];
        if (tool === "eraser") eraseAt(position(event));
        else
        {
            activeStroke = { tool, color, points: [position(event)] };
            state.marks[current].push(activeStroke);
        }
        paintMarks();
    });
    canvas.addEventListener("pointermove", event =>
    {
        if (pointer !== event.pointerId) return;
        const events = event.getCoalescedEvents?.() || [event];
        for (const e of events.length ? events : [event])
        {
            if (tool === "eraser") eraseAt(position(e));
            else activeStroke?.points.push(position(e));
        }
        paintMarks();
    });
    const finish = event =>
    {
        if (pointer !== event.pointerId) return;
        pointer = undefined;
        activeStroke = undefined;
        document.querySelector(".slide-surface").style.overflowY = savedOverflow;
        save();
    };
    canvas.addEventListener("pointerup", finish);
    canvas.addEventListener("pointercancel", finish);
    resizeCanvas();
}

reduced.addEventListener("change", () =>
{
    if (reduced.matches)
    {
        clearInterval(playTimer);
        playTimer = undefined;
        render();
    }
});
window.addEventListener("hashchange", readRoute);
window.addEventListener("resize", sizeStage);
window.addEventListener("pagehide", () => { cancelRunner(); clearInterval(playTimer); observer?.disconnect(); });
readRoute();
