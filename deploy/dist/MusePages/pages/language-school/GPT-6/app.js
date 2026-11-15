const languages =
[
    ["Spanish", "ES", ["A1", "A2", "B1", "B2", "C1", "C2"]],
    ["French", "FR", ["A1", "A2", "B1", "B2", "C1", "C2"]],
    ["German", "DE", ["A1", "A2", "B1", "B2", "C1"]],
    ["Italian", "IT", ["A1", "A2", "B1", "B2"]],
    ["Portuguese", "PT", ["A1", "A2", "B1", "B2"]],
    ["Japanese", "JP", ["Beginner", "Intermediate"]],
    ["Arabic", "AR", ["A1", "A2"]]
];
const tutors =
[
    ["Elena Martínez", "Spanish", "Conversational practice, professional scenarios and exam preparation."],
    ["Julien Fontaine", "French / Italian", "Everyday French, academic discussion and beginner Italian practice."],
    ["Yuki Tanaka", "Japanese", "A structured introduction to writing systems and practical conversation."]
];
let tutor = 0;
let suggestion = "";
const language = document.querySelector("#language");
const level = document.querySelector("#level");
language.innerHTML = languages.map(([name]) => `<option>${name}</option>`).join("");
document.querySelector("#language-grid").innerHTML = languages.map(([name, code, levels]) => `<button class="language-card" data-language="${name}" aria-pressed="${name === "Spanish"}"><span class="code">${code}</span><strong>${name} ↗</strong><small>${levels[0]}–${levels.at(-1)}</small></button>`).join("");
function groupAvailable()
{
    return ["Spanish", "French", "Italian"].includes(language.value) && ["A1", "A2", "B1", "B2"].includes(level.value);
}
function updateTrial()
{
    const format = document.querySelector("#format").value;
    const plan = document.querySelector("#plan").value;
    document.querySelector("#trial-result").textContent = "";
    document.querySelector("#trial-price").textContent = plan === "Monthly subscriber" ? "Example £99/month for four one-hour individual sessions. No subscription created." : format === "Group" ? groupAvailable() ? "Example group trial: free first session. No place reserved." : "Group unavailable for this language/level. Choose Individual or another language." : format === "Business" ? "Example business programme from £55/hour; a real team quote requires discussion." : "Example individual trial: £15 for 45 minutes. No payment or reservation.";
}
function update()
{
    document.querySelectorAll("[data-language]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.language === language.value)));
    document.querySelector("#path-title").textContent = `${language.value} / ${level.value}`;
    document.querySelector("#path-copy").textContent = `${document.querySelector("#goal").value}: begin with an agreed goal, practise regularly, and review progress with a teacher.`;
    const available = groupAvailable();
    const courses =
    [
        ["Individual", "Individual 1-on-1 tuition", "Personalised pace, practical goals and focused feedback.", "£35 / hour from", true],
        ["Group", "Small group classes", "Up to six learners with a shared starting point. Spanish, French and Italian, A1–B2.", "£15 / lesson from", available],
        ["Business", "Business language programme", "Professional vocabulary and communication scenarios for individuals and teams.", "£55 / hour from", true]
    ];
    document.querySelector("#course-list").innerHTML = courses.map(([format, title, copy, price, valid]) => `<article class="course ${valid ? "" : "unavailable"}"><div><h3>${title}</h3><p>${copy}</p><p>${valid ? `${language.value} / ${level.value} · example format available` : "Not offered for this language/level in the sample programme."}</p></div><div><p class="cost">${price}</p><button class="button" data-format="${format}" ${valid ? "" : "disabled"}>Explore ${format.toLowerCase()} ↗</button></div></article>`).join("");
    const visible = tutors.map((t, id) => ({ t, id })).filter(({ t }) => t[1].split(" / ").includes(language.value));
    document.querySelector("#teacher-grid").innerHTML = visible.map(({ t, id }) => `<article class="teacher"><div class="initial">${t[0].split(" ").map((word) => word[0]).join("")}</div><p class="eyebrow">FICTIONAL PROFILE / ${t[1]}</p><h3>${t[0]}</h3><p>${t[2]}</p><button class="outline" data-tutor="${id}">Read example profile ↗</button></article>`).join("");
    document.querySelector("#teacher-count").textContent = `${visible.length} sample profile${visible.length === 1 ? "" : "s"} for ${language.value}`;
    document.querySelector("#teacher-empty").hidden = visible.length > 0;
    document.querySelector("#trial-result").textContent = "";
    updateTrial();
}
function changeLanguage(name)
{
    language.value = name;
    const list = languages.find(([entry]) => entry === name)[2];
    level.innerHTML = list.map((name) => `<option>${name}</option>`).join("");
    update();
}
document.addEventListener("click", (event) =>
{
    const card = event.target.closest("[data-language]");
    if (card)
    {
        changeLanguage(card.dataset.language);
        document.querySelector("#planner").scrollIntoView();
    }
    const format = event.target.closest("[data-format]");
    if (format && !format.disabled)
    {
        document.querySelector("#format").value = format.dataset.format;
        document.querySelector("#plan").value = format.dataset.format === "Business" ? "Business brief" : "Trial exploration";
        updateTrial();
        document.querySelector("#enrol").scrollIntoView();
    }
    const plan = event.target.closest("[data-plan]");
    if (plan)
    {
        document.querySelector("#format").value = "Individual";
        document.querySelector("#plan").value = plan.dataset.plan;
        updateTrial();
        document.querySelector("#enrol").scrollIntoView();
    }
    const teacher = event.target.closest("[data-tutor]");
    if (teacher)
    {
        tutor = Number(teacher.dataset.tutor);
        document.querySelector("#profile-name").textContent = tutors[tutor][0];
        document.querySelector("#profile-copy").textContent = `${tutors[tutor][2]} This fictional profile demonstrates a teaching focus, not an available or credentialed real person.`;
        document.querySelector("#profile").showModal();
    }
});
language.onchange = () => changeLanguage(language.value);
level.onchange = update;
document.querySelector("#goal").onchange = update;
document.querySelector("#format").onchange = () =>
{
    if (document.querySelector("#format").value !== "Individual" && document.querySelector("#plan").value === "Monthly subscriber") document.querySelector("#plan").value = "Trial exploration";
    if (document.querySelector("#format").value !== "Business" && document.querySelector("#plan").value === "Business brief") document.querySelector("#plan").value = "Trial exploration";
    updateTrial();
};
document.querySelector("#plan").onchange = () =>
{
    if (document.querySelector("#plan").value === "Monthly subscriber") document.querySelector("#format").value = "Individual";
    if (document.querySelector("#plan").value === "Business brief") document.querySelector("#format").value = "Business";
    updateTrial();
};
document.querySelector("#profile-close").onclick = () => document.querySelector("#profile").close();
document.querySelector("#profile-choose").onclick = () =>
{
    changeLanguage(tutors[tutor][1].split(" / ").includes(language.value) ? language.value : tutors[tutor][1].split(" / ")[0]);
    document.querySelector("#format").value = "Individual";
    document.querySelector("#plan").value = "Trial exploration";
    updateTrial();
    document.querySelector("#profile").close();
    document.querySelector("#enrol").scrollIntoView();
};
document.querySelector("#self-check").onclick = () =>
{
    suggestion = "";
    document.querySelector("#use-level").hidden = true;
    document.querySelector("#check-result").textContent = "";
    document.querySelector("#check-form").reset();
    document.querySelector("#check-dialog").showModal();
};
document.querySelector("#check-close").onclick = () => document.querySelector("#check-dialog").close();
document.querySelector("#check-form").onsubmit = (event) =>
{
    event.preventDefault();
    const value = new FormData(event.target).get("confidence");
    if (value === null)
    {
        document.querySelector("#check-result").textContent = "Choose the statement closest to your experience.";
        return;
    }
    const list = languages.find(([name]) => name === language.value)[2];
    suggestion = list[Math.min(Number(value), list.length - 1)];
    document.querySelector("#check-result").textContent = `Consider ${suggestion} as a discussion starting point for ${language.value}. Self-reflection only, not a CEFR assessment.`;
    document.querySelector("#use-level").hidden = false;
};
document.querySelector("#use-level").onclick = () =>
{
    if (!suggestion) return;
    level.value = suggestion;
    update();
    document.querySelector("#check-dialog").close();
};
document.querySelector("#trial-form").onsubmit = (event) =>
{
    event.preventDefault();
    const f = event.target.elements;
    const result = document.querySelector("#trial-result");
    if (f.format.value === "Group" && !groupAvailable())
    {
        result.textContent = "Group unavailable for this language/level. Choose an eligible format.";
        return;
    }
    if (!f.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value))
    {
        result.textContent = "Enter your name and a valid email address.";
        return;
    }
    if (!f.ack.checked)
    {
        result.textContent = "Confirm that you understand this local learning preview.";
        return;
    }
    result.textContent = `${language.value} / ${level.value}, ${f.format.value}, ${f.plan.value}, ${f.time.value}: learning brief prepared for ${f.name.value.trim()}. No request sent, payment taken or lesson booked.`;
};
document.querySelector("#menu").onclick = (event) => event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
document.querySelectorAll("nav a").forEach((link) => link.onclick = () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
});
changeLanguage("Spanish");
