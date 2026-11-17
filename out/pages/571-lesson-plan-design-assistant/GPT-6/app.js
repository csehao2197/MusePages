/* Icons: Lucide, ISC license; generated icon markup is included locally. */
"use strict";

const $ = (selector) => document.querySelector(selector);
const form = $("#lesson-form");
const storageKey = `forma.lesson-studio.v1:${location.pathname}`;
const names = { teacher: "Teacher plan", handout: "Student handout", practice: "Home practice" };
let state = { documents: {}, settings: null, active: "teacher", edited: false };
let editing = false;
let toastTimer;

const examples =
{
    fractions:
    {
        title: "Understanding equivalent fractions", grade: "Grade 4", subject: "Mathematics",
        prior: "Recognise numerator and denominator; identify halves and quarters of equal-sized wholes.",
        obstacle: "A larger denominator can look like a larger quantity. Always compare equal-sized wholes.",
        scaffold: "Fold equal paper strips into halves, quarters and eighths. Align the strips before writing symbols.",
        concepts: "Equivalent fractions name the same amount. Multiply or divide numerator and denominator by the same nonzero number.",
        example: "1/2 = 2/4 = 4/8. Four of eight equal pieces cover the same length as one of two equal pieces.",
        second: "3/4 = 6/8 because 3 × 2 = 6 and 4 × 2 = 8. Multiplying only the denominator changes the amount.",
        launch: "Show one half-strip and two quarter-strips. Ask: Is one piece always less than two pieces?",
        model: "Fold and align paper strips. Label 1/2, 2/4 and 4/8. Model multiplying both parts by 2, then ask pupils to explain why the covered length stays constant.",
        basic: "Draw and label two models showing 1/2 = 2/4. Use equal-sized wholes.",
        improve: "Find the missing numerator: 3/5 = ?/10. Explain the scale factor with a diagram.",
        challenge: "Compare 2/3 and 4/6 using two representations. Explain why 2/3 does not equal 2/6.",
        transfer: "A recipe uses 3/4 cup of milk. Which eighth-cup measure gives the same amount? Justify.",
        exit: "Complete 2/3 = ?/6 and explain the operation on both parts.",
        answer: "4/6; multiply numerator and denominator by 2. Equal-sized wholes are essential.",
        board: "SAME WHOLE → SAME AMOUNT → DIFFERENT NAMES\n1/2 = 2/4 = 4/8\nMultiply or divide BOTH parts by the same nonzero number.",
        materials: "Equal-length paper strips, coloured pencils, fraction grids and a teacher-prepared number line.",
        questions: ["Complete 1/2 = ?/4.", "Complete 2/3 = ?/6.", "Complete 3/5 = ?/10.", "Simplify 2/4.", "Simplify 4/8.", "Is 3/4 = 6/8? Explain.", "Show 2/5 = 4/10 with a diagram.", "Explain the error: 1/3 = 1/6.", "Find two fractions equivalent to 3/4.", "Explain why multiplying both parts by 3 preserves a fraction's value."],
        answers: ["2/4; both parts ×2.", "4/6; both parts ×2.", "6/10; both parts ×2.", "1/2; both parts ÷2.", "1/2; both parts ÷4.", "Yes; both parts ×2.", "Shade 2 of 5 equal sections, then split each into 2; 4 of 10 are shaded.", "The denominator doubled without doubling the numerator; 1/6 is half of 1/3.", "6/8 and 9/12; scale both parts equally.", "Each original piece is split into 3 equal pieces, so the total and selected piece counts both triple without changing the amount."]
    },
    water:
    {
        title: "Exploring the water cycle", grade: "Grade 5", subject: "Science",
        prior: "Identify liquid water, ice and water vapour; describe warming and cooling.",
        obstacle: "Water vapour is invisible. The visible mist near a cold surface consists of tiny liquid droplets.",
        scaffold: "Use a labelled cycle diagram and a covered container demonstration; distinguish observations from explanations.",
        concepts: "Evaporation changes liquid water to water vapour. Cooling can cause condensation. Precipitation returns water to Earth's surface; water then collects or flows.",
        example: "Drops on the outside of a cold cup form when water vapour in the surrounding air cools and condenses.",
        second: "A puddle can shrink without boiling: evaporation occurs at the surface below boiling temperature.",
        launch: "Show a cold cup with droplets outside. Ask: Where did these drops come from?",
        model: "Observe a room-temperature cup beside a cold cup. Record differences. Draw evaporation, condensation, precipitation and collection, and use arrows to show movement. Keep hot water out of student handling.",
        basic: "Label evaporation, condensation, precipitation and collection on a cycle diagram.",
        improve: "Explain why a puddle may shrink faster on a warm, windy day. Identify what you would keep constant in a comparison.",
        challenge: "Predict how a dry week affects local surface water. Explain what your simple cycle diagram leaves out.",
        transfer: "Explain how water from a lake might eventually fall as rain elsewhere.",
        exit: "Explain the source of droplets outside a cold cup without saying that water passes through the cup.",
        answer: "Water vapour from the air cools near the cup and condenses into liquid droplets.",
        board: "SUN / ENERGY → EVAPORATION → CONDENSATION → PRECIPITATION\nCollection, runoff and infiltration connect the pathways.\nObservation ≠ explanation.",
        materials: "Cold and room-temperature cups, trays, water-cycle diagram, towels and observation sheets. No pupil-handled hot water.",
        questions: ["Name the change from liquid water to vapour.", "Name the change from vapour to liquid.", "Give one example of precipitation.", "What provides energy for much evaporation on Earth?", "Name one place water collects.", "Is water vapour visible?", "Explain droplets outside a cold cup.", "Describe a fair test of how warmth affects evaporation.", "Explain a lake-to-rain pathway.", "Critique a diagram showing the water cycle as a single fixed route."],
        answers: ["Evaporation.", "Condensation.", "Rain, snow, sleet or hail.", "The Sun.", "Lakes, rivers, oceans or groundwater.", "No; visible mist is tiny liquid droplets.", "Vapour in the air cools and condenses on the cup.", "Use equal water volumes and identical containers, vary warmth only, and compare loss over the same time.", "Evaporation → transport in air → condensation in clouds → precipitation.", "Water can follow multiple routes, be stored for different times, infiltrate soil or enter living things; a simple circle omits these."]
    },
    writing:
    {
        title: "Writing to persuade", grade: "Grade 6", subject: "English",
        prior: "Identify an opinion, a supporting reason and a complete paragraph.",
        obstacle: "A strong opinion is not evidence; distinguish a claim from a reason and a verifiable example.",
        scaffold: "Colour-code claim, reason, evidence and explanation in a short teacher-written model.",
        concepts: "Persuasive writing connects a clear claim with relevant reasons, accurate evidence and explanations suited to the audience.",
        example: "Claim: Our class should read quietly for ten minutes daily. Reason: It creates protected reading time. Evidence to gather: a class reading log. Explanation: the log can show whether time spent reading increases.",
        second: "Counterargument: Quiet reading reduces discussion time. Response: reserve ten minutes for reading and follow with a short partner discussion.",
        launch: "Ask: Should our class have a daily reading break? Compare a bare opinion with a reasoned claim.",
        model: "Annotate the teacher-written reading-break example. Separate proposed evidence from evidence actually collected. Co-write a paragraph without inventing statistics.",
        basic: "Write a clear claim about a classroom improvement and give one relevant reason.",
        improve: "Add a specific example and explain how it supports your claim. Mark any evidence that still needs checking.",
        challenge: "State the strongest reasonable counterargument and answer it fairly without exaggeration.",
        transfer: "Adapt your paragraph for a headteacher rather than a classmate; explain two changes.",
        exit: "Underline a claim, circle a reason and identify one piece of evidence that needs verification.",
        answer: "Accept a clear claim, a logically relevant reason and a correctly flagged unverified detail. Do not reward invented statistics.",
        board: "CLAIM → REASON → EVIDENCE → EXPLANATION\nAudience + purpose guide tone.\nAcknowledge a fair counterargument. Verify facts.",
        materials: "Teacher-written model paragraph, coloured pencils, planning frame and peer-feedback checklist.",
        questions: ["Write a classroom-related claim.", "Give a reason supporting your claim.", "Name your intended audience.", "Suggest evidence you could actually collect.", "Explain why invented statistics are unreliable.", "Write a concluding sentence.", "Revise an opinion into a reasoned argument.", "Explain how one detail supports your claim.", "Write a fair counterargument and response.", "Adapt your paragraph to a different audience and justify your choices."],
        answers: ["A clear arguable position, e.g. We should have a daily reading break.", "A relevant reason, e.g. It protects time for reading.", "A specific audience, e.g. classmates or the headteacher.", "A real class survey or reading log; do not present proposed data as collected.", "They cannot be verified and can mislead readers.", "Restate the position with a clear, proportionate call to action.", "Include a claim and a logically linked reason; wording varies.", "Explain the logical connection rather than merely repeating the detail.", "Accurately represent an opposing view and offer a respectful, reasoned reply.", "Accept justified changes in tone, vocabulary and evidence appropriate to the new audience."]
    }
};

function getSettings()
{
    return {
        grade: $("#grade").value, subject: $("#subject").value,
        curriculum: $("#curriculum").value.trim(), topic: $("#topic").value.trim(),
        level: form.elements.level.value, focus: $("#focus").value,
        handout: $("#handout").checked, practice: $("#practice").checked
    };
}

function applySettings(settings)
{
    for (const key of ["grade", "subject", "curriculum", "topic", "focus"])
    {
        $(`#${key}`).value = settings[key];
    }
    const level = [...form.elements.level].find((item) => item.value === settings.level);
    if (level) level.checked = true;
    $("#handout").checked = settings.handout;
    $("#practice").checked = settings.practice;
    updateDuration();
}

function updateDuration()
{
    $("#duration").value = `${form.elements.level.value === "Advanced" ? 3 : 2} × 60 minutes`;
}

function announce(message)
{
    $("#toast").textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $("#toast").textContent = ""; }, 4500);
}

function save()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
        $("#save-status").textContent = "Saved on this device";
    }
    catch
    {
        $("#save-status").textContent = "Storage unavailable · export to save";
    }
}

function resolveExample(settings)
{
    return Object.values(examples).find((example) => example.title.toLowerCase() === settings.topic.toLowerCase() && example.subject === settings.subject);
}

function genericExample(settings)
{
    const topic = settings.topic;
    return {
        prior: `Use a three-question diagnostic to establish the prerequisite vocabulary and concepts for ${topic}. Record what pupils demonstrate; do not assume mastery.`,
        obstacle: "Ask pupils to explain one example aloud. Identify a misconception from their explanations before selecting the main teaching example.",
        scaffold: "Provide a teacher-verified worked example, an annotated vocabulary bank and a partially completed response frame. Remove support after a successful independent attempt.",
        concepts: `Teacher preparation required: enter two accurate, curriculum-aligned key ideas about ${topic} here before teaching. This generic scaffold does not infer subject facts.`,
        example: `Teacher preparation required: add a verified worked example about ${topic}, including each reasoning step and one common error.`,
        second: "Add a contrasting example and explain what changes and what stays the same.",
        launch: `Present a teacher-selected real-world example of ${topic}. Ask pupils what they notice, what they wonder and what evidence they would need.`,
        model: "Model the verified worked example in small steps. Think aloud, check a response from every pupil, then invite pairs to complete a similar example.",
        basic: `Complete a scaffolded example about ${topic}; label each step and use the vocabulary bank.`,
        improve: "Solve a changed example independently and justify the choice of method with evidence.",
        challenge: "Compare two approaches, identify an assumption and design a new example that tests it.",
        transfer: `Apply ${topic} to a teacher-verified unfamiliar situation. Explain which knowledge transfers and why.`,
        exit: "Complete one independent example and explain one decision. Teacher must insert a subject-specific question and verified answer before use.",
        answer: "Teacher review required: use an accurate worked solution; award credit for correctness and justified reasoning. No factual answer was inferred.",
        board: `${topic}\nKey vocabulary → verified example → reasoning → common error → transfer`,
        materials: "Teacher-verified source material, a worked example, mini-whiteboards and a response checklist.",
        questions: Array.from({ length: 10 }, (_, index) => `Teacher adaptation required: insert ${index < 6 ? "a foundational recall or worked-example" : index < 9 ? "an independent application" : "a transfer and justification"} question about ${topic} (item ${index + 1}).`),
        answers: Array.from({ length: 10 }, () => "Teacher adaptation required: provide a verified subject answer, a reasoning step and a likely misconception before distributing.")
    };
}

function createDocuments(settings)
{
    const curated = resolveExample(settings);
    const ex = curated || genericExample(settings);
    const sessions = settings.level === "Advanced" ? 3 : 2;
    const details = `${settings.grade} · ${settings.subject} · ${settings.level}\nCurriculum: ${settings.curriculum}\n${sessions} sessions × 60 minutes · Focus: ${settings.focus}`;
    const disclosure = curated ? "Curated, deterministic teaching template. Adapt to your class and verify local curriculum alignment." : "Generic deterministic scaffold — subject-specific examples and answers require teacher completion. No AI inference or curriculum verification.";
    const support = settings.level === "Foundation" ? "Use concrete models, repeat one worked example and check each step before reducing support." : settings.level === "Advanced" ? "Require multiple representations, critique assumptions and add an independent cross-context investigation." : "Move from a worked example to independent reasoning; ask pupils to compare methods and justify choices.";
    const focus = settings.focus === "Knowledge mastery" ? "Accurately explain both key ideas and score at least 4 out of 5 on a teacher-verified knowledge check." : settings.focus === "Whole-child learning" ? "Apply the core ideas to a practical situation, give one reasoned explanation and contribute one respectful peer-feedback comment." : "Complete at least 4 out of 5 independent applications accurately and justify one solution using evidence.";
    let teacher = `LESSON DESIGN · ${curated ? "CURATED STARTING POINT" : "GENERIC SCAFFOLD"}\n# ${settings.topic}\n${details}\n\n${disclosure}\n\n## 01 / Know your learners\n### Prior knowledge\n${ex.prior}\n### Likely learning barrier\n${ex.obstacle}\n### A bridge to understanding\n${ex.scaffold}\n${support}\n\n## 02 / Learning with intention\n### Knowledge & skills\n- ${focus}\n- Identify and correct one common misconception using a worked example.\n### Process & method\n- Compare two approaches and explain one choice to a partner.\n- Use an exit response to identify a specific next step.\n### Attitudes & values\n- Listen respectfully and give one constructive comment on a peer's reasoning.\n\n## 03 / Teaching priorities & preparation\nKey learning: ${ex.concepts}\nChallenge: ${ex.obstacle}\nTeacher preparation: ${ex.materials}\nStudent preparation: bring a notebook and recall one relevant idea; no paid materials required.\nTeaching approach: guided inquiry, paired discussion and gradual release.\n`;
    const phases = ["Discover & understand", "Deepen & practise", "Investigate & transfer"];
    for (let i = 0; i < sessions; i++)
    {
        teacher += `\n## ${String(i + 4).padStart(2, "0")} / Session ${i + 1}: ${phases[i]}\n60 minutes · ${settings.level} group\n### Connect / 5 minutes\nPurpose: ${i === 0 ? "activate prior knowledge and surface a misconception" : "retrieve learning and respond to the previous exit check"}.\nActivity: ${i === 0 ? ex.launch : `Revisit yesterday's exit question. In pairs, correct one anonymous misconception before attempting a changed example.`}\nExpected response: pupils share a prediction; listen for the barrier described above.\nTeacher says: “What makes you think that? Show me your evidence.”\n### Explore / 22 minutes\nPurpose: ${i === 0 ? "build a shared model" : i === 1 ? "connect representations and increase independence" : "transfer learning to a new context"}.\nActivity: ${i === 0 ? ex.model : i === 1 ? `${ex.second} Ask pairs to explain, compare and refine their reasoning.` : `${ex.transfer} Teams plan, test and critique a solution; each pupil records an individual justification.`}\nExpected response: pupils explain a step, not just an answer; pause if fewer than four out of five sampled responses are secure.\nTeacher says: “Which part changes? Which idea still holds? Explain it to your partner.”\n### Practise / 18 minutes\nPurpose: gather individual evidence and offer appropriate challenge.\n- Foundation / everyone: ${ex.basic}\n- Improve / optional: ${ex.improve}\n- Extend / challenge: ${ex.challenge}\nTeacher says: “Start where you can explain your thinking, then stretch one step further.”\nSupport: ${support}\nExpected response: an annotated model or written justification. Re-model for the support group; extend pupils who demonstrate secure understanding.\n### Transfer / 10 minutes\nPurpose: test understanding beyond the modelled example.\nActivity: ${ex.transfer}\nExpected response: pupils connect the new situation to a key idea and justify their approach.\nTeacher says: “How do you know your explanation works in this new situation?”\n### Reflect & next steps / 5 minutes\nPurpose: check the learning goal and set an appropriate follow-up.\nExit ticket: ${ex.exit}\nReference / criteria: ${ex.answer}\nTeacher says: “What can you now explain that you could not explain at the start?”\nRequired homework: complete the six foundation practice items and correct one error.\nOptional homework: attempt an improve or challenge item and explain your method.\n`;
    }
    teacher += `\n## Board design\n${ex.board}\nKeep a side column for pupil questions and misconceptions.\n\n## Reflection & classroom management\n- Compare exit responses with the diagnostic; record who needs re-teaching and one successful pupil explanation.\n- If fewer than 80% meet the goal, revisit the concrete model before increasing difficulty.\n- Give pairs speaker/checker roles; rotate roles and use a visible timer. Offer quiet individual thinking before discussion.\n- Foundation: more rehearsal. Developing: independent explanation. Advanced: critique and transfer.\n\n## Family communication\nToday we explored ${settings.topic.toLowerCase()}.\nAsk your child to explain one example in their own words; praise reasoning, not speed.\nIf the explanation is uncertain, share a note with the teacher rather than teaching an unverified shortcut.\n\n## Resource suggestions\nUse your verified ${settings.curriculum} chapter, the materials above and a teacher-made recap slide.\nExtension reading: an age-appropriate school-library source on this topic, checked by the teacher.\nMultimedia: a teacher-recorded worked example with captions. No external resources have been fetched or verified.\n`;
    const handout = `STUDENT HANDOUT\n# ${settings.topic}\n${details}\n\n${disclosure}\n\n## What I am learning\n- ${focus}\n- Explain one method clearly and check my own work.\n\n## Two ideas to keep\n${ex.concepts}\n\n## Worked example 1\n${ex.example}\n\n## Worked example 2\n${ex.second}\n\n## My thinking space\nWhat I notice: ______________________________\nA diagram or example: _______________________\nMy explanation: ____________________________\nA question I still have: _____________________\n\n## Try it together\n${ex.basic}\n\n## Stretch my thinking\n${ex.improve}\n\n## A helpful habit\nExplain a step before checking the answer. Compare with a partner, correct one error and write why you changed it.\n\n## Before I leave\n${ex.exit}\nConfidence: not yet / getting there / ready to explain.\n`;
    let practice = `HOME PRACTICE\n# ${settings.topic}\n${details}\n\n${disclosure}\n\n10 items · 6 foundation (60%) / 3 improve (30%) / 1 challenge (10%). Suggested time: 20–30 minutes, not part of the 60-minute sessions.\n`;
    for (let i = 0; i < 10; i++)
    {
        if (i === 0) practice += "\n## Foundation / required\n";
        if (i === 6) practice += "\n## Improve / optional\n";
        if (i === 9) practice += "\n## Challenge / optional\n";
        practice += `${i + 1}. ${ex.questions[i]}\n`;
    }
    practice += "\n## Reference answers & reasoning\nCheck after attempting the questions. Open-ended answers may vary; reasoning must be accurate.\n";
    ex.answers.forEach((answer, i) => { practice += `${i + 1}. ${answer}\n`; });
    return { teacher, ...(settings.handout ? { handout } : {}), ...(settings.practice ? { practice } : {}) };
}

function renderDocument(text)
{
    const target = $("#document-view");
    target.replaceChildren();
    let list;
    for (const line of text.split("\n"))
    {
        if (!line.trim())
        {
            list = null;
            continue;
        }
        let tag = "p";
        let value = line;
        if (line.startsWith("### ")) { tag = "h4"; value = line.slice(4); }
        else if (line.startsWith("## ")) { tag = "h3"; value = line.slice(3); }
        else if (line.startsWith("# ")) { tag = "h2"; value = line.slice(2); }
        else if (line.startsWith("- "))
        {
            if (!list)
            {
                list = document.createElement("ul");
                target.append(list);
            }
            const item = document.createElement("li");
            item.textContent = line.slice(2);
            list.append(item);
            continue;
        }
        list = null;
        const element = document.createElement(tag);
        element.textContent = value;
        target.append(element);
    }
}

function displayDocument(key)
{
    state.active = key;
    editing = false;
    $("#editor-label").hidden = true;
    $("#document-view").hidden = false;
    $("#edit").lastChild.textContent = "Edit";
    for (const tab of document.querySelectorAll("[data-doc]"))
    {
        tab.disabled = !Object.hasOwn(state.documents, tab.dataset.doc);
        tab.setAttribute("aria-selected", String(tab.dataset.doc === key));
        tab.tabIndex = tab.dataset.doc === key ? 0 : -1;
    }
    $("#document-panel").setAttribute("aria-labelledby", `tab-${key}`);
    $("#document-panel").scrollTop = 0;
    renderDocument(state.documents[key]);
    const count = state.settings.level === "Advanced" ? 3 : 2;
    $("#document-meta").textContent = `${count} sessions · ${count * 60} minutes`;
    $("#draft-badge").textContent = state.edited ? "YOUR EDITED DRAFT" : "READY TO SHAPE";
}

function download(text, suffix)
{
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const slug = state.settings.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 65) || "lesson";
    link.href = url;
    link.download = `${slug}-${suffix}.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Markdown exported. Your local draft is unchanged.");
}

form.addEventListener("change", updateDuration);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!$("#topic").value.trim() || !$("#curriculum").value.trim())
    {
        announce("Please enter a topic and curriculum, not only spaces.");
        (!$("#topic").value.trim() ? $("#topic") : $("#curriculum")).focus();
        return;
    }
    if (state.edited && !window.confirm("Creating a new plan replaces your edited local draft. Export it first if you need a copy. Continue?")) return;
    state.settings = getSettings();
    state.documents = createDocuments(state.settings);
    state.edited = false;
    displayDocument("teacher");
    save();
    announce(resolveExample(state.settings) ? "Your lesson pack is ready to review and edit." : "Generic scaffold created. Complete subject facts and answers before teaching.");
    if (window.innerWidth < 641) $(".result").scrollIntoView({ behavior: "auto", block: "start" });
});

for (const tab of document.querySelectorAll("[data-doc]"))
{
    tab.addEventListener("click", () => { displayDocument(tab.dataset.doc); save(); });
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const tabs = [...document.querySelectorAll("[data-doc]:not(:disabled)")];
        const current = tabs.indexOf(event.currentTarget);
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        tabs[next].click();
    });
}

$("#edit").addEventListener("click", () =>
{
    editing = !editing;
    $("#editor-label").hidden = !editing;
    $("#document-view").hidden = editing;
    $("#edit").lastChild.textContent = editing ? "Done" : "Edit";
    if (editing)
    {
        $("#editor").value = state.documents[state.active];
        $("#editor").focus();
    }
    else renderDocument(state.documents[state.active]);
});
$("#editor").addEventListener("input", () =>
{
    state.documents[state.active] = $("#editor").value;
    state.edited = true;
    $("#draft-badge").textContent = "YOUR EDITED DRAFT";
    save();
});
$("#export").addEventListener("click", () => download(state.documents[state.active], state.active));
$("#export-all").addEventListener("click", () => download(Object.entries(state.documents).map(([key, text]) => `<!-- ${names[key]} -->\n${text}`).join("\n\n---\n\n"), "lesson-pack"));
for (const button of document.querySelectorAll("[data-template]"))
{
    button.addEventListener("click", () =>
    {
        const example = examples[button.dataset.template];
        $("#topic").value = example.title;
        $("#grade").value = example.grade;
        $("#subject").value = example.subject;
        $("#curriculum").value = "School curriculum · review required";
        $("#workspace").scrollIntoView({ behavior: "auto" });
        $("#topic").focus();
        announce("Starting point loaded. Create a plan when you're ready.");
    });
}
$("#guide-open").addEventListener("click", () => $("#guide").showModal());
$("#guide-close").addEventListener("click", () => $("#guide").close());

try
{
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.settings && saved.documents && typeof saved.documents.teacher === "string" && Object.keys(saved.documents).every((key) => Object.hasOwn(names, key) && typeof saved.documents[key] === "string"))
    {
        state = saved;
        if (!Object.hasOwn(state.documents, state.active)) state.active = "teacher";
        applySettings(state.settings);
    }
}
catch
{
    $("#save-status").textContent = "Storage unavailable · export to save";
}
if (!state.settings)
{
    state.settings = getSettings();
    state.documents = createDocuments(state.settings);
}
displayDocument(state.active);
save();
