import { LittleWorld, palette, starter } from "./world.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clone = (value) => JSON.parse(JSON.stringify(value));
const builder = $("#builder");
const info = $("#info");
const status = (text) =>
{
    $("#studio-status").textContent = text;
};
const maxPieces = 28;
const missions = {
    dream: "Build a place where something surprising could happen.",
    story: "Make a home for someone new. What story does their home tell?",
    habitat: "Build a habitat. Where will your creature find shelter, water, and a friend?",
    feeling: "Make a feeling into a place. How could color and shape tell us how it feels?",
    blank: "An empty island. A thousand possibilities. What will your first idea be?"
};
const ideas = [
    "Who lives here? What would make them feel at home?",
    "What if the smallest thing became the biggest? Try changing its size.",
    "Can your world tell a feeling? Try a new color or a different sky.",
    "What if a new visitor arrived? Make a place just for them.",
    "Try turning something around. What do you notice from another view?",
    "What might happen here at night? Tell the next part of your story.",
    "What is missing from this place? There is no single right answer."
];
let project = starter();
let studio;
let selected = -1;
let piece = null;
let playing = false;
let question = 0;
let history = [];
let future = [];
let drag = null;
let reactionTimer;
let lastOpener;

new LittleWorld($("#hero-world"), starter(), { background: false });
$$("[data-scene]").forEach((canvas) => new LittleWorld(canvas, starter(canvas.dataset.scene), { background: false }));

function snapshot()
{
    project.name = $("#world-name").value.trim() || "My little world";
    project.reflection = $("#reflection").value;
    return clone(project);
}

function remember()
{
    history.push(snapshot());
    if (history.length > 40)
    {
        history.shift();
    }
    future = [];
}

function refresh()
{
    studio.project = project;
    studio.selected = playing ? -1 : selected;
    studio.draw();
    const select = $("#selected-object");
    select.replaceChildren(new Option("Nothing selected", ""));
    const names = { house: "Cozy home", tree: "Funny tree", friend: "Little friend", star: "Wishing star" };
    project.objects.forEach((object, index) => select.add(new Option(`${index + 1}. ${names[object.type]}`, String(index))));
    select.value = selected < 0 ? "" : String(selected);
    $("#undo").disabled = !history.length || playing;
    $("#redo").disabled = !future.length || playing;
    $$(".transform-tools button, #piece-color").forEach((button) => { button.disabled = selected < 0 || playing; });
    if (selected >= 0)
    {
        $("#piece-color").value = project.objects[selected].color;
    }
    $$("[data-theme]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.theme === project.theme)));
    $$("[data-piece]").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(button.dataset.piece === piece));
        button.disabled = playing;
    });
    select.disabled = playing;
    $("#mode-label").textContent = playing ? "EXPLORING YOUR WORLD" : "BUILD MODE";
    $("#play-world").lastChild.textContent = playing ? " Back to building" : " Explore";
    $("#play-world use").setAttribute("href", `icons.svg#${playing ? "pencil" : "play"}`);
    $("#build-hint").textContent = playing ?
        "Tap a piece to discover its story. Use the turn buttons or arrow keys to look around." :
        piece ? `Tap the island to add a ${names[piece].toLowerCase()}. Or focus the world and press Enter.` :
            "Pick a piece, then tap the island. Drag a piece to move it. Arrow keys move a selected piece.";
}

function openWorld(kind = "dream", saved = null)
{
    lastOpener = document.activeElement;
    if (info.open)
    {
        info.close();
    }
    project = saved ? clone(saved) : starter(kind);
    history = [];
    future = [];
    selected = -1;
    piece = null;
    playing = false;
    question = 0;
    $("#world-name").value = project.name;
    $("#reflection").value = project.reflection || "";
    $("#mission").textContent = saved?.mission || missions[kind] || missions.dream;
    project.mission = $("#mission").textContent;
    $("#guide-question").textContent = ideas[0];
    builder.showModal();
    builder.scrollTop = 0;
    if (!studio)
    {
        studio = new LittleWorld($("#studio-world"), project);
    }
    studio.angle = -.48;
    studio.active = -1;
    refresh();
    status(saved ? "Your saved world is ready for its next chapter." : "Your ideas belong here. Pick a piece to get started.");
}

$$("[data-start]").forEach((button) => button.addEventListener("click", () => openWorld(button.dataset.start)));
$("#take-look").addEventListener("click", () =>
{
    openWorld();
    playing = true;
    refresh();
    status("Welcome inside. Tap a piece and imagine its story.");
});
$$("[data-close]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));
builder.addEventListener("close", () =>
{
    clearTimeout(reactionTimer);
    if (studio)
    {
        studio.active = -1;
    }
    if (lastOpener?.isConnected && !lastOpener.closest("dialog"))
    {
        lastOpener.focus();
    }
});

$$("[data-piece]").forEach((button) =>
{
    button.draggable = true;
    button.addEventListener("click", () =>
    {
        piece = piece === button.dataset.piece ? null : button.dataset.piece;
        selected = -1;
        refresh();
        status(piece ? "Tap an open space on the island, or focus the world and press Enter." : "Pick a piece in your world to change it.");
    });
    button.addEventListener("dragstart", (event) =>
    {
        if (playing)
        {
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData("application/x-little-world-piece", button.dataset.piece);
        event.dataTransfer.effectAllowed = "copy";
    });
});

function addPiece(location)
{
    if (project.objects.length >= maxPieces)
    {
        status("This little island has room for 28 pieces. Change or remove a piece to make room for a new idea.");
        return;
    }
    remember();
    project.objects.push({ type: piece, ...location, size: 1, rotation: 0, color: palette[project.objects.length % palette.length] });
    selected = project.objects.length - 1;
    piece = null;
    refresh();
    status("A new piece of your story! Try moving, turning, growing, or coloring it.");
}

function transform(action)
{
    if (selected < 0 || playing)
    {
        return;
    }
    remember();
    action(project.objects[selected]);
    refresh();
    status("Your idea is taking a new shape. What changed?");
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
$("#move-left").addEventListener("click", () => transform((object) => { object.x = clamp(object.x - .3, -2.6, 2.6); }));
$("#move-right").addEventListener("click", () => transform((object) => { object.x = clamp(object.x + .3, -2.6, 2.6); }));
$("#rotate-piece").addEventListener("click", () => transform((object) => { object.rotation += Math.PI / 4; }));
$("#grow-piece").addEventListener("click", () => transform((object) => { object.size = Math.min(1.7, object.size + .15); }));
$("#shrink-piece").addEventListener("click", () => transform((object) => { object.size = Math.max(.45, object.size - .15); }));
$("#piece-color").addEventListener("change", (event) => transform((object) => { object.color = event.target.value; }));
$("#delete-piece").addEventListener("click", () =>
{
    if (selected >= 0 && !playing)
    {
        remember();
        project.objects.splice(selected, 1);
        selected = -1;
        refresh();
        status("A little more space for a new possibility.");
    }
});
$("#selected-object").addEventListener("change", (event) =>
{
    selected = event.target.value === "" ? -1 : Number(event.target.value);
    piece = null;
    refresh();
});

function restore(from, to)
{
    if (!from.length || playing)
    {
        return;
    }
    to.push(snapshot());
    project = from.pop();
    $("#world-name").value = project.name;
    $("#reflection").value = project.reflection;
    selected = -1;
    piece = null;
    refresh();
    status("You can always try a different idea.");
}
$("#undo").addEventListener("click", () => restore(history, future));
$("#redo").addEventListener("click", () => restore(future, history));
$$("[data-theme]").forEach((button) => button.addEventListener("click", () =>
{
    remember();
    project.theme = button.dataset.theme;
    refresh();
    status(`Your world is now ${project.theme === "ocean" ? "beside the ocean" : `in ${project.theme} light`}. How does it feel different?`);
}));
$("#new-idea").addEventListener("click", () =>
{
    question = (question + 1) % ideas.length;
    $("#guide-question").textContent = ideas[question];
});
$("#orbit-left").addEventListener("click", () => { studio.angle -= .25; studio.draw(); });
$("#orbit-right").addEventListener("click", () => { studio.angle += .25; studio.draw(); });
$("#play-world").addEventListener("click", () =>
{
    playing = !playing;
    piece = null;
    refresh();
    status(playing ? "Welcome inside. Tap a piece and imagine its story." : "What would you like to change after exploring?");
});

const canvas = $("#studio-world");
canvas.addEventListener("dragover", (event) =>
{
    if (!playing && event.dataTransfer.types.includes("application/x-little-world-piece"))
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    }
});
canvas.addEventListener("drop", (event) =>
{
    const type = event.dataTransfer.getData("application/x-little-world-piece");
    if (!playing && ["house", "tree", "friend", "star"].includes(type))
    {
        event.preventDefault();
        piece = type;
        const p = position(event);
        addPiece(studio.ground(p.x, p.y));
    }
});
function position(event)
{
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function react(index)
{
    if (index < 0)
    {
        status("Look around your island. What story might happen in this open space?");
        return;
    }
    clearTimeout(reactionTimer);
    studio.active = index;
    studio.draw();
    const reactions = {
        house: "Knock, knock. A tiny voice asks, “What brings you to my world?” What do you say?",
        tree: "Rustle, rustle. This tree is keeping a secret. What might it be?",
        friend: "Your little friend waves hello! Where will you take them first?",
        star: "Your star rises with a wish. What would you wish for this world?"
    };
    status(reactions[project.objects[index].type]);
    reactionTimer = setTimeout(() => { studio.active = -1; studio.draw(); }, 900);
}

canvas.addEventListener("pointerdown", (event) =>
{
    if (event.button !== 0)
    {
        return;
    }
    const p = position(event);
    canvas.focus({ preventScroll: true });
    if (playing)
    {
        react(studio.hit(p.x, p.y));
        return;
    }
    if (piece)
    {
        addPiece(studio.ground(p.x, p.y));
        return;
    }
    selected = studio.hit(p.x, p.y);
    if (selected >= 0)
    {
        drag = { start: p, original: clone(project.objects[selected]), remembered: false };
        canvas.setPointerCapture(event.pointerId);
    }
    refresh();
});
canvas.addEventListener("pointermove", (event) =>
{
    if (!drag)
    {
        return;
    }
    const p = position(event);
    if (!drag.remembered && Math.hypot(p.x - drag.start.x, p.y - drag.start.y) < 4)
    {
        return;
    }
    if (!drag.remembered)
    {
        remember();
        drag.remembered = true;
    }
    const current = studio.ground(p.x, p.y);
    const start = studio.ground(drag.start.x, drag.start.y);
    project.objects[selected].x = clamp(drag.original.x + current.x - start.x, -2.6, 2.6);
    project.objects[selected].z = clamp(drag.original.z + current.z - start.z, -1.85, 1.85);
    studio.draw();
});
function finishDrag()
{
    if (drag?.remembered)
    {
        status("A new place. A new point of view. What could happen here?");
    }
    drag = null;
    refresh();
}
canvas.addEventListener("pointerup", finishDrag);
canvas.addEventListener("pointercancel", finishDrag);
canvas.addEventListener("keydown", (event) =>
{
    if (event.key === "Enter")
    {
        event.preventDefault();
        if (playing)
        {
            react(selected >= 0 ? selected : 0);
        }
        else if (piece)
        {
            addPiece({ x: 0, z: 1 });
        }
        return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key))
    {
        event.preventDefault();
        if (playing)
        {
            studio.angle += ["ArrowLeft", "ArrowUp"].includes(event.key) ? -.2 : .2;
            studio.draw();
        }
        else
        {
            transform((object) =>
            {
                object.x = clamp(object.x + (event.key === "ArrowLeft" ? -.25 : event.key === "ArrowRight" ? .25 : 0), -2.6, 2.6);
                object.z = clamp(object.z + (event.key === "ArrowUp" ? -.25 : event.key === "ArrowDown" ? .25 : 0), -1.85, 1.85);
            });
        }
    }
});

function savedWorlds()
{
    try
    {
        const saved = JSON.parse(localStorage.getItem("little-worlds-projects") || "[]");
        if (!Array.isArray(saved))
        {
            return [];
        }
        return saved.filter((world) => typeof world?.name === "string" && world.name.length <= 45 &&
            typeof world.id === "string" && world.id.length <= 64 &&
            ["day", "night", "ocean"].includes(world.theme) && typeof world.reflection === "string" &&
            world.reflection.length <= 500 && Array.isArray(world.objects) && world.objects.length <= maxPieces &&
            world.objects.every((object) => ["house", "tree", "friend", "star"].includes(object.type) &&
                /^#[0-9a-f]{6}$/i.test(object.color) && Number.isFinite(object.x) && Math.abs(object.x) <= 2.6 &&
                Number.isFinite(object.z) && Math.abs(object.z) <= 1.85 &&
                Number.isFinite(object.size) && object.size >= .45 && object.size <= 1.7 && Number.isFinite(object.rotation)))
            .slice(0, 12);
    }
    catch
    {
        return [];
    }
}
$("#save-world").addEventListener("click", () =>
{
    snapshot();
    project.id ||= crypto.randomUUID();
    try
    {
        const worlds = savedWorlds().filter((world) => world.id !== project.id);
        if (worlds.length >= 12)
        {
            status("Your shelf has 12 worlds. Remove one from Your worlds before saving a new one.");
            return;
        }
        worlds.unshift(clone(project));
        localStorage.setItem("little-worlds-projects", JSON.stringify(worlds));
        status("World and reflection saved in this browser. Find them in Your worlds.");
    }
    catch
    {
        status("This browser cannot save right now. Keep this studio open so your world stays here.");
    }
});

function showInfo(content)
{
    $("#info-content").innerHTML = content;
    info.showModal();
    info.scrollTop = 0;
}

function gallery()
{
    showInfo('<p class="eyebrow">YOUR LITTLE COLLECTION</p><h2 id="info-title">Worlds worth coming back to.</h2><p>Your creations are saved only in this browser. No one else can see them.</p><div class="saved-list"></div><h3 style="margin-top:24px">A little inspiration to remix</h3><p>These are original starter worlds, not other children’s work.</p><div class="starter-buttons"><button class="button outline small" data-remix="story">Story village</button><button class="button outline small" data-remix="habitat">Tiny habitat</button><button class="button outline small" data-remix="feeling">Feeling island</button></div>');
    const worlds = savedWorlds();
    const list = $(".saved-list");
    if (!worlds.length)
    {
        const empty = document.createElement("p");
        empty.textContent = "An empty shelf, for now. Build a world and press Save world to keep it here.";
        list.append(empty);
    }
    worlds.forEach((world) =>
    {
        const row = document.createElement("div");
        row.className = "saved-item";
        const load = document.createElement("button");
        load.type = "button";
        const title = document.createElement("strong");
        title.textContent = world.name;
        const detail = document.createElement("small");
        detail.textContent = `${world.objects.length} pieces · ${world.theme} · Open your world`;
        load.append(title, detail);
        load.addEventListener("click", () => openWorld("dream", world));
        const remove = document.createElement("button");
        remove.className = "icon-button";
        remove.type = "button";
        remove.setAttribute("aria-label", `Remove saved world ${world.name}`);
        remove.innerHTML = '<svg><use href="icons.svg#trash-2"></use></svg>';
        remove.addEventListener("click", () =>
        {
            try
            {
                localStorage.setItem("little-worlds-projects", JSON.stringify(savedWorlds().filter((entry) => entry.id !== world.id)));
                row.remove();
                if (!list.children.length)
                {
                    list.textContent = "Your shelf is empty. Make space for a brand new idea.";
                }
            }
            catch
            {
                remove.setAttribute("aria-label", "This browser cannot remove the world right now");
            }
        });
        row.append(load, remove);
        list.append(row);
    });
    $$("[data-remix]").forEach((button) => button.addEventListener("click", () => openWorld(button.dataset.remix)));
}

function grownups()
{
    showInfo('<p class="eyebrow">A NOTE FOR GROWN-UPS</p><h2 id="info-title">Creation is a way of thinking.</h2><p>For primary-school creators, especially below Grade 6. Invite a child to imagine, build, explore, change, and reflect — not to find a right answer.</p><ul><li>Storytelling: make a home for a character from a book.</li><li>Science: build a habitat with shelter and water.</li><li>Expression: use color and shape to show a feeling.</li></ul><p>This is a browser-only prototype. The guide uses prewritten, child-friendly questions, not live AI. There are no accounts, student monitoring, public galleries, or classroom data collection.</p><label for="teacher-prompt">Offer your own little challenge</label><textarea id="teacher-prompt" maxlength="220" rows="3" placeholder="Build a place where two very different creatures can be friends."></textarea><button type="button" class="button orange" id="assign-challenge">Try this challenge <svg><use href="icons.svg#arrow-right"></use></svg></button><p>Use this together on the same device. Do not enter children’s names or personal information.</p>');
    $("#assign-challenge").addEventListener("click", () =>
    {
        const text = $("#teacher-prompt").value.trim();
        openWorld("blank");
        project.mission = text || "Build a place where two very different creatures can be friends.";
        $("#mission").textContent = project.mission;
    });
}
$$("[data-action]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.dataset.action === "gallery")
    {
        gallery();
    }
    else if (button.dataset.action === "grownups")
    {
        grownups();
    }
    else
    {
        showInfo('<p class="eyebrow">A SAFE LITTLE SPACE</p><h2 id="info-title">Big imagination. Small footprint.</h2><p>No sign-in, tracking, advertising, camera, microphone, or live chat. This page makes no external network requests. Your worlds and reflections stay in local storage on this browser.</p><p>Anyone using this browser profile can see saved worlds. Avoid names, school details, or other personal information. Remove a world from Your worlds, or clear this site’s browser data, to delete it.</p><p>The imagination guide is an offline collection of prewritten prompts. Nothing is sent to an AI service. Online sharing and teacher monitoring are not part of this demo.</p>');
    }
}));
