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
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const route = document.querySelector("#route-map");
const line = document.querySelector("#route-line");
const mileage = document.querySelector("#mileage");
const markers = [...document.querySelectorAll(".marker")];
if (!reduced)
{
    line.style.strokeDashoffset = "1";
    mileage.textContent = "0";
    markers.forEach((marker) => marker.style.opacity = "0");
    const observer = new IntersectionObserver((entries) =>
    {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        function frame(time)
        {
            const progress = Math.min(1, (time - start) / 1800);
            line.style.strokeDashoffset = String(1 - progress);
            mileage.textContent = String(Math.round(212 * progress));
            markers.forEach((marker, index) => marker.style.opacity = progress >= index / 3 ? "1" : "0");
            if (progress < 1) requestAnimationFrame(frame);
            else route.dataset.complete = "true";
        }
        requestAnimationFrame(frame);
    }, { threshold: .35 });
    observer.observe(route);
}
else
{
    route.dataset.complete = "true";
}
const form = document.querySelector("#load-form");
const status = document.querySelector("#load-status");
const download = document.querySelector("#download");
let notes = "";
function postcode(value)
{
    return value.trim().toUpperCase().replace(/\s+/g, " ");
}
function validatePostcode(input)
{
    const valid = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(postcode(input.value));
    input.setCustomValidity(valid ? "" : "Enter a UK postcode, for example B78 3HL.");
}
for (const input of document.querySelectorAll("#collection, #delivery"))
{
    input.addEventListener("input", () => validatePostcode(input));
}
form.addEventListener("input", () =>
{
    notes = "";
    download.hidden = true;
    status.textContent = "";
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const cargo = document.querySelector("#cargo").value.trim();
    if (cargo.length < 10)
    {
        status.textContent = "Describe the goods in at least 10 non-space characters.";
        return;
    }
    const collection = postcode(document.querySelector("#collection").value);
    const delivery = postcode(document.querySelector("#delivery").value);
    notes = `HALLORAN CALL NOTES\nCollection: ${collection}\nDelivery: ${delivery}\nGoods: ${cargo}\nWeight: ${document.querySelector("#weight").value} kg\nDemonstration only. No quote, booking or transport request sent.\nConfirm dimensions, access, loading and legal suitability with a real operator.`;
    status.textContent = `${collection} to ${delivery}. Call notes ready. Nothing sent or booked. No price calculated.`;
    download.hidden = false;
});
download.addEventListener("click", () =>
{
    if (!notes) return;
    const url = URL.createObjectURL(new Blob([notes], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "halloran-call-notes.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
