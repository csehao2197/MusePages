const form = document.querySelector("form");
const descriptions = {
    panel: "Panel upgrades · Example starting price $850. An on-site assessment is essential.",
    lighting: "Lighting installation · Example starting price $149. Fixture count and access affect scope.",
    ev: "EV charger install · Example starting price $599. Capacity, charger and permits need assessment.",
    wiring: "Outlets & wiring · Example starting price $95. Circuit condition and scope need assessment.",
    smart: "Smart home wiring · Example starting price $299. Cabling and device compatibility need assessment."
};
const urgent = document.querySelector("#urgent-dialog");
["#urgent", "#urgent-strip"].forEach((selector) => document.querySelector(selector).addEventListener("click", () => urgent.showModal()));
document.querySelector("#close-urgent").addEventListener("click", () => urgent.close());
function update()
{
    document.querySelector("#service-detail").textContent = descriptions[form.elements.service.value];
    document.querySelector("#result").textContent = "";
}
document.querySelectorAll("[data-service]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        if (button.dataset.service === "emergency")
        {
            urgent.showModal();
            return;
        }
        form.elements.service.value = button.dataset.service;
        update();
        document.querySelector("#quote").scrollIntoView();
    });
});
form.addEventListener("change", update);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const invalid = [...form.querySelectorAll("input[required], textarea")].filter((input) =>
    {
        const valid = input.checkValidity() && (input.type === "checkbox" || input.value.trim().length >= (input.name === "details" ? 15 : 1));
        input.setAttribute("aria-invalid", String(!valid));
        return !valid;
    });
    const result = document.querySelector("#result");
    if (invalid.length)
    {
        result.textContent = "Enter a name, valid email and at least 15 characters of project detail; confirm the local-preview notice.";
        invalid[0].focus();
        return;
    }
    const title = form.elements.service.selectedOptions[0].textContent;
    result.textContent = `Enquiry preview: ${title} · ${form.elements.property.value}. Nothing has been sent, booked or charged. Professional assessment and credentials must be confirmed.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const start = performance.now();
            const tick = (time) =>
            {
                const progress = Math.min(1, (time - start) / 1600);
                entry.target.textContent = Math.floor(Number(entry.target.dataset.target) * (1 - (1 - progress) ** 3)).toLocaleString("en-US");
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    });
    document.querySelectorAll("[data-target]").forEach((node) => observer.observe(node));
}
