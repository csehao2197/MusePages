const namedTutors = { Piano: ["Emma Clarke"], Guitar: ["Tom Bradley"], Vocals: ["Aiko Tanaka"], Violin: [], Drums: [], "Music Theory": ["Emma Clarke"] };
const instrument = document.querySelector("#instrument");
const tutor = document.querySelector("#tutor");
function updateTutors()
{
    const names = namedTutors[instrument.value];
    tutor.replaceChildren();
    const option = document.createElement("option");
    option.textContent = names.length ? "No preference" : "Unassigned tutor (sample)";
    tutor.append(option);
    names.forEach((name) =>
    {
        const item = document.createElement("option");
        item.textContent = name;
        tutor.append(item);
    });
}
instrument.addEventListener("change", updateTutors);
updateTutors();
document.querySelectorAll("[data-instrument]").forEach((button) => button.addEventListener("click", () =>
{
    instrument.value = button.dataset.instrument;
    updateTutors();
    document.querySelector("#trial").scrollIntoView();
}));
document.querySelectorAll("[data-tutor]").forEach((button) => button.addEventListener("click", () =>
{
    const name = button.dataset.tutor;
    instrument.value = name === "Emma Clarke" ? "Piano" : name === "Tom Bradley" ? "Guitar" : "Vocals";
    updateTutors();
    tutor.value = name;
    document.querySelector("#trial").scrollIntoView();
}));
const age = document.querySelector("#age");
function updateAge()
{
    document.querySelector("#guardian-label").hidden = !age.value || age.value === "Adult Learners";
    document.querySelector("[name=guardian]").checked = false;
}
age.addEventListener("change", updateAge);
const paths = {
    "Young Musicians": "A playful sample path: listen and copy, find a steady pulse, explore a first melody, then share a favourite piece. Real teaching should adapt to the child, instrument and access needs.",
    "Teen Learners": "A creative sample path: build technique, explore songs you love, try arranging or songwriting, and consider ensembles or exam preparation if desired. Progress is individual.",
    "Adult Learners": "A flexible sample path: choose a personal goal, build comfortable habits, work on a favourite song, and make room for regular practice. Exams are optional; no pace or result is promised."
};
const dialog = document.querySelector("#curriculum");
document.querySelectorAll("[data-age]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#curriculum-title").textContent = button.dataset.age;
    document.querySelector("#curriculum-copy").textContent = paths[button.dataset.age];
    dialog.showModal();
}));
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#choose-age").addEventListener("click", () =>
{
    age.value = document.querySelector("#curriculum-title").textContent;
    updateAge();
    dialog.close();
    document.querySelector("#trial").scrollIntoView();
});
document.querySelector("#practice-button").addEventListener("click", () =>
{
    const minutes = Number(document.querySelector("#minutes").value);
    const days = Number(document.querySelector("#days").value);
    const skill = Math.round(minutes * .3);
    const settle = Math.round(minutes * .2);
    document.querySelector("#practice-result").textContent = `${minutes} minutes × ${days} days = ${minutes * days} minutes a week. Try ${settle} minutes settling in, ${skill} on one skill, and ${minutes - skill - settle} playing something you enjoy. Adapt with your teacher.`;
});
const form = document.querySelector("#trial-form");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    let text;
    if (!age.value) text = "Choose an age group. Lessons are for ages 5 and above.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email"))) text = "Enter a valid adult example email.";
    else if (age.value !== "Adult Learners" && !data.get("guardian")) text = "An adult must confirm they are planning for the younger learner.";
    else if (!data.get("ack")) text = "Confirm the local-only acknowledgement.";
    else text = `Local 30-minute trial plan: ${instrument.value} / ${age.value} / ${tutor.value} / ${document.querySelector("#format").value}. No enquiry sent, teacher assigned or lesson reserved.`;
    document.querySelector("#result").textContent = text;
});
form.addEventListener("reset", () => setTimeout(() =>
{
    updateTutors();
    updateAge();
    document.querySelector("#result").textContent = "";
}, 0));
const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
