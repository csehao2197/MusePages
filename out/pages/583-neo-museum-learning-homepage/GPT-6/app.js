const chapters =
[
    {
        title: "Age of Dinosaurs",
        period: "LATE CRETACEOUS / 68–66 MILLION YEARS AGO",
        heading: "A giant predator, pieced together.",
        description: "Tyrannosaurus rex lived in western North America. Its serrated teeth and powerful jaws were adapted to processing flesh and bone.",
        image: "specimen.svg",
        alt: "Illustrated Tyrannosaurus rex skeleton",
        caption: "TYRANNOSAURUS REX / RECONSTRUCTION",
        evidence: "Serrations on teeth help slice food. Bite marks and fossilized stomach contents provide evidence of diet. A skeleton’s shape offers clues, but no single feature tells the whole story.",
        question: "Which clue most directly tells us what an animal ate?",
        answers: ["The color of the rock around it", "Food preserved inside its body", "The number of bones in its tail"],
        correct: 1,
        explanation: "Preserved stomach contents are direct evidence of a meal. Teeth and bite marks add other, complementary clues."
    },
    {
        title: "Fossils of Ancient Life",
        period: "DEEP TIME / THE PROCESS OF FOSSILIZATION",
        heading: "A fossil is more than a bone.",
        description: "Burial, pressure, and mineral-rich water can preserve traces of life. Some fossils are body remains; others record behavior, like a footprint or a burrow.",
        image: "ammonite.svg",
        alt: "Illustrated coiled ammonite shell with chamber divisions",
        caption: "AMMONOIDEA / SHELL STUDY",
        evidence: "In permineralization, dissolved minerals fill pores in buried remains. Replacement is different: minerals replace original material. Most organisms leave no fossil, making the record incomplete.",
        question: "Which example is a trace fossil?",
        answers: ["A dinosaur footprint", "A mineral-filled tooth", "A preserved shell"],
        correct: 0,
        explanation: "A footprint records an animal’s activity rather than part of its body. Burrows and trackways are trace fossils too."
    },
    {
        title: "Reptiles of the Mesozoic",
        period: "MESOZOIC / 252–66 MILLION YEARS AGO",
        heading: "Not every ancient reptile was a dinosaur.",
        description: "Pterosaurs were flying reptiles, not dinosaurs. An elongated fourth finger supported each wing membrane: an adaptation written in bone.",
        image: "pterosaur.svg",
        alt: "Illustrated pterosaur showing long wing fingers",
        caption: "PTEROSAURIA / RECONSTRUCTION",
        evidence: "A pterosaur’s wing was a membrane supported mainly by one greatly elongated finger. A bird’s flight feathers attach along the arm and hand. These are different solutions to powered flight.",
        question: "What supported most of a pterosaur’s wing membrane?",
        answers: ["A row of long feathers", "An elongated fourth finger", "Its rib cage"],
        correct: 1,
        explanation: "The elongated fourth finger supported the outer wing membrane. Pterosaurs were a distinct group of flying reptiles."
    },
    {
        title: "Marine Fossil Gallery",
        period: "ANCIENT OCEANS / AMMONITE ECOLOGY",
        heading: "An ocean, held inside a stone.",
        description: "Ammonites were marine cephalopods, relatives of living squid and octopuses. Their coiled shells contained chambers that helped regulate buoyancy.",
        image: "ammonite.svg",
        alt: "Ammonite shell illustration with curved chamber partitions",
        caption: "AMMONOIDEA / CHAMBERED SHELL",
        evidence: "As an ammonite grew, it added new chambers and lived in the outermost one. Septa separated the chambers. Distinctive species help geologists compare the relative ages of rock layers.",
        question: "What did the shell’s chambers help the animal control?",
        answers: ["Its body temperature", "The strength of ocean tides", "Its buoyancy"],
        correct: 2,
        explanation: "The chamber system helped regulate buoyancy, allowing the animal to maintain its position in the water."
    },
    {
        title: "Prehistoric Giants",
        period: "LATE JURASSIC / ABOUT 150 MILLION YEARS AGO",
        heading: "Big questions. Even bigger bodies.",
        description: "Sauropod dinosaurs included the largest land animals known. Long necks expanded their feeding reach, while column-like limbs supported immense bodies.",
        image: "sauropod.svg",
        alt: "Illustrated long-necked sauropod body and skeleton study",
        caption: "SAUROPODA / PROPORTION STUDY",
        evidence: "Air spaces in many sauropod vertebrae reduced skeletal weight. Trackways reveal how these animals moved. Mass estimates remain uncertain because soft tissue is rarely preserved.",
        question: "Why are estimates of a dinosaur’s mass uncertain?",
        answers: ["Soft tissues are rarely preserved", "All fossils shrink to half their size", "Dinosaurs had no skeletons"],
        correct: 0,
        explanation: "Bones survive more often than muscles, fat, and organs. Reconstructing the missing tissues introduces uncertainty."
    }
];
let activeChapter = 2;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let playing = !reducedMotion;
let notes = [];
try
{
    const saved = JSON.parse(localStorage.getItem("nhm-field-notes") || "[]");
    if (Array.isArray(saved))
    {
        notes = [...new Set(saved.filter((value) => Number.isInteger(value) && value >= 0 && value < chapters.length))];
    }
}
catch
{
    notes = [];
}
const $ = (selector) => document.querySelector(selector);
const tabs = [...document.querySelectorAll("[data-chapter]")];
const dialog = $("#exhibit-dialog");
let returnFocus;
function updateNotes()
{
    $("#trail-status").textContent = `YOUR FIELD NOTES: ${notes.length} / 5 CHAPTERS`;
}
function setPlaying(value)
{
    playing = value;
    $("#autoplay").setAttribute("aria-pressed", String(value));
    $("#autoplay-label").textContent = value ? "Pause tour" : "Play tour";
    $("#autoplay [data-icon]").innerHTML = value ? icons.pause : icons.play;
}
function selectChapter(index, manual = true)
{
    activeChapter = index;
    if (manual) setPlaying(false);
    const chapter = chapters[index];
    tabs.forEach((tab, position) =>
    {
        tab.setAttribute("aria-selected", String(position === index));
        tab.tabIndex = position === index ? 0 : -1;
    });
    const image = $("#chapter-image");
    image.src = chapter.image;
    image.alt = chapter.alt;
    image.classList.remove("changing");
    void image.offsetWidth;
    image.classList.add("changing");
    $("#specimen-caption").textContent = chapter.caption;
    $("#chapter-counter").textContent = `0${index + 1} / 05`;
    $("#period").textContent = chapter.period;
    $("#learn-title").textContent = chapter.heading;
    $("#learn-description").textContent = chapter.description;
    $("#chapter-content").setAttribute("aria-labelledby", `tab-${index}`);
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => selectChapter(index));
    tab.addEventListener("keydown", (event) =>
    {
        let next;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined)
        {
            event.preventDefault();
            selectChapter(next);
            tabs[next].focus();
        }
    });
});
$("#autoplay").addEventListener("click", () => setPlaying(!playing));
$(".chapters").addEventListener("focusin", () => setPlaying(false));
setInterval(() =>
{
    if (playing && !document.hidden && !dialog.open && !$(".collection").matches(":hover"))
    {
        selectChapter((activeChapter + 1) % chapters.length, false);
    }
}, 3500);
function openDialog(title, body, eyebrow = "FIELD GUIDE")
{
    returnFocus = document.activeElement;
    $("#dialog-title").textContent = title;
    $("#dialog-eyebrow").textContent = eyebrow;
    $("#dialog-body").innerHTML = body;
    setPlaying(false);
    dialog.showModal();
}
$(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => returnFocus?.focus());
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
});
function investigate(index)
{
    const chapter = chapters[index];
    openDialog(chapter.title, `<p>${chapter.description}</p><h3>Read the evidence</h3><p>${chapter.evidence}</p><h3>${chapter.question}</h3><div class="answers">${chapter.answers.map((answer, answerIndex) => `<button type="button" aria-pressed="false" data-answer="${answerIndex}">${answer}</button>`).join("")}</div><p class="feedback" role="status">Choose an answer to test your observation.</p><button class="primary" id="save-note" disabled>Answer correctly to save a field note</button>`, `CHAPTER 0${index + 1} / EVIDENCE LAB`);
    const save = $("#save-note");
    save.style.opacity = ".5";
    document.querySelectorAll("[data-answer]").forEach((button) =>
    {
        button.addEventListener("click", () =>
        {
            document.querySelectorAll("[data-answer]").forEach((answer) => answer.setAttribute("aria-pressed", String(answer === button)));
            const correct = Number(button.dataset.answer) === chapter.correct;
            $(".feedback").textContent = correct ? `Correct. ${chapter.explanation}` : "Look again. Return to the evidence above, then try another answer.";
            save.disabled = !correct;
            save.style.opacity = correct ? "1" : ".5";
            save.textContent = correct ? notes.includes(index) ? "Field note already saved" : "Save to my field notes" : "Answer correctly to save a field note";
        });
    });
    save.addEventListener("click", () =>
    {
        if (!notes.includes(index)) notes.push(index);
        let persisted = true;
        try
        {
            localStorage.setItem("nhm-field-notes", JSON.stringify(notes));
        }
        catch
        {
            persisted = false;
        }
        updateNotes();
        save.textContent = persisted ? "Saved on this device" : "Saved for this session only";
        save.disabled = true;
        $(".feedback").textContent = `${chapter.explanation} ${notes.length} of 5 chapters added to your field notes.`;
    });
}
$("#investigate").addEventListener("click", () => investigate(activeChapter));
$("#rex-details").addEventListener("click", () => investigate(0));
function openGuide()
{
    openDialog("A field guide to curiosity.", `<p>This is an illustrative digital exhibit, not a physical museum booking service. Every specimen image is original interpretive artwork, not a photograph or a measured scientific reconstruction.</p><ol><li>Select one of five chapters in the Ancient Collection.</li><li>Read the specimen’s story, then investigate the evidence.</li><li>Answer a question and save a field note on this device.</li></ol><p>Use arrow keys to move between chapter tabs. Pause the automatic tour whenever you like. Your notes need no account and are never sent to a server.</p><button class="primary" id="begin-guide">Explore the collection</button>`);
    $("#begin-guide").addEventListener("click", () =>
    {
        dialog.close();
        $("#collection").scrollIntoView();
        tabs[activeChapter].focus({ preventScroll: true });
    });
}
document.querySelectorAll("[data-guide]").forEach((button) => button.addEventListener("click", () =>
{
    closeMenu();
    openGuide();
}));
document.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.textContent.includes("Minerals"))
    {
        openDialog("From water to stone.", `<p>Minerals help turn a fleeting life into a lasting fossil. Groundwater carries dissolved minerals into the pores of buried wood or bone. Over time, these minerals crystallize.</p><h3>Mineral does not mean fossil</h3><p>A quartz crystal can form without life. A fossil preserves evidence of past life. Mineralization is one way that evidence survives.</p><button class="primary" id="mineral-chapter">Explore fossilization</button>`, "MINERALS / A CLOSER LOOK");
        $("#mineral-chapter").addEventListener("click", () =>
        {
            dialog.close();
            selectChapter(1);
            $("#collection").scrollIntoView();
            tabs[1].focus({ preventScroll: true });
        });
        return;
    }
    selectChapter(Number(button.dataset.topic));
    $("#collection").scrollIntoView();
    tabs[activeChapter].focus({ preventScroll: true });
}));
const menuButton = $(".menu-button");
function closeMenu()
{
    $("#mobile-menu").hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
}
menuButton.addEventListener("click", () =>
{
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    $("#mobile-menu").hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
$("#mobile-menu").addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menuButton.focus();
    }
});
$("#reset-notes").addEventListener("click", () =>
{
    notes = [];
    try
    {
        localStorage.removeItem("nhm-field-notes");
        $("#reset-status").textContent = "Your field notes have been cleared.";
    }
    catch
    {
        $("#reset-status").textContent = "Session notes cleared. Browser storage is unavailable.";
    }
    updateNotes();
});
const icons = {};
document.querySelectorAll("[data-icon]").forEach((element) =>
{
    icons[element.dataset.icon] = element.innerHTML;
});
icons.play = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';
updateNotes();
setPlaying(playing);
selectChapter(activeChapter, false);
