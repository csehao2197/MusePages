const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
let knotTimer;
function tieKnot()
{
    const knot = document.querySelector("#knot");
    clearTimeout(knotTimer);
    knot.classList.remove("tying");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        document.querySelector("#knot-status").textContent = "Bowline illustration complete.";
        return;
    }
    requestAnimationFrame(() =>
    {
        requestAnimationFrame(() => knot.classList.add("tying"));
    });
    document.querySelector("#knot-status").textContent = "Drawing the bowline illustration.";
    knotTimer = setTimeout(() => document.querySelector("#knot-status").textContent = "Bowline illustration complete.", 2800);
}
document.querySelector("#replay").addEventListener("click", tieKnot);
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        tieKnot();
        observer.disconnect();
    }
}, { threshold: .35 });
observer.observe(document.querySelector("#knot"));
document.querySelector("#age").addEventListener("change", (event) =>
{
    const age = event.target.value;
    let count = 0;
    document.querySelectorAll(".session-table article").forEach((row) =>
    {
        row.hidden = age !== "all" && (Number(age) < Number(row.dataset.min) || Number(age) > Number(row.dataset.max));
        if (!row.hidden) count++;
    });
    document.querySelector("#session-status").textContent = count ? `${count} sample sessions shown. Confirm actual eligibility and capacity directly.` : "No sessions in this sample for that age. The camp serves ages 8 to 15.";
});
const boxes = [...document.querySelectorAll("#packing input")];
function updatePacking()
{
    document.querySelector("#packing-count").textContent = `${boxes.filter((box) => box.checked).length} of 6 packed.`;
}
boxes.forEach((box) => box.addEventListener("change", updatePacking));
document.querySelector("#reset-packing").addEventListener("click", () =>
{
    boxes.forEach((box) => box.checked = false);
    updatePacking();
});
document.querySelector("#session").addEventListener("change", () =>
{
    document.querySelector("#email-draft").hidden = true;
    document.querySelector("#hold-status").textContent = "Selection updated. Prepare an email; no place can be held in this demo.";
});
document.querySelector("#draft").addEventListener("click", () =>
{
    const session = document.querySelector("#session").value;
    const status = document.querySelector("#hold-status");
    const link = document.querySelector("#email-draft");
    link.hidden = true;
    if (!session)
    {
        status.textContent = "Choose a session first.";
        return;
    }
    if (session === "Three")
    {
        status.textContent = "Session Three is full in the sample. Ask the camp about a waiting list; no place is held.";
        return;
    }
    link.href = `mailto:camp@pinehollow.org?subject=${encodeURIComponent(`Session ${session} enquiry`)}&body=${encodeURIComponent(`Hello, please confirm current dates, fees and availability for Session ${session}. This enquiry is not an enrolment.`)}`;
    link.hidden = false;
    status.textContent = `Session ${session} enquiry draft prepared. Nothing sent and no place held.`;
});
