document.querySelectorAll("[data-treatment]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        document.querySelector(`#${button.getAttribute("aria-controls")}`).hidden = !open;
    });
});
const dialog = document.querySelector("#enquiry");
const form = document.querySelector("form");
function suitability()
{
    document.querySelector("#suitability").textContent = form.elements.treatment.value === "Resurfacing" ? "Resurfacing requires professional suitability assessment. No treatment or outcome is promised." : "Your preferences and suitability would be discussed before any real treatment.";
    document.querySelector("#result").textContent = "";
}
document.querySelectorAll("[data-book]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        form.elements.treatment.value = button.dataset.book;
        document.querySelector("#enquiry-note").textContent = "Local enquiry preview only. Nothing is sent and no appointment is held.";
        suitability();
        dialog.showModal();
    });
});
document.querySelector("#gift-info").addEventListener("click", () =>
{
    document.querySelector("#enquiry-note").textContent = "Gift vouchers would require direct contact with the studio. This demo sells and issues no voucher. You can preview a question below.";
    suitability();
    dialog.showModal();
});
form.elements.treatment.addEventListener("change", suitability);
document.querySelector("#close").addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const valid = form.checkValidity() && form.elements.name.value.trim() && form.elements.message.value.trim().length >= 10;
    document.querySelector("#result").textContent = valid ? `${form.elements.treatment.value}: enquiry preview complete. No appointment is held and no message has been sent.` : "Please enter a name, valid email and a question of at least 10 characters.";
});
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date().getDay();
days.forEach((day, i) =>
{
    const li = document.createElement("li");
    li.textContent = `${day}: ${i === 0 || i === 1 ? "closed" : i === 6 ? "9:30 to 14:00" : "9:30 to 18:00"}${i === today ? " · today" : ""}`;
    if (i === today) li.className = "today";
    document.querySelector("#hours").append(li);
});
const face = document.querySelector("#face");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) face.classList.add("drawn");
else
{
    const observer = new IntersectionObserver((entries) =>
    {
        if (entries.some((entry) => entry.isIntersecting))
        {
            face.classList.add("drawn");
            observer.disconnect();
        }
    }, { threshold: .3 });
    observer.observe(face);
}
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
