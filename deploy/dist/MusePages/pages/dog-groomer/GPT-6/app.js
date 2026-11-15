const services = [
    ["The Bath & Dry", 35, "Shampoo, conditioning and a considered blow-dry.", "⌁"],
    ["Full Groom", 55, "Bath, dry and a practical breed-inspired style.", "✂"],
    ["Puppy's First Groom", 30, "A gentle introduction to the sights and sounds.", "◡"],
    ["De-Shedding Treatment", 45, "Coat-appropriate washing and a thorough brush-out.", "≋"],
    ["Nail Trim", 12, "Clipping and filing, subject to handling suitability.", "∩"],
    ["Teeth Brushing", 10, "Cosmetic brushing with pet-safe products; not veterinary dental care.", "✧"]
];
document.querySelector("#services-list").innerHTML = services.map((service, i) => `<article class="service"><span aria-hidden="true">${service[3]}</span><h3>${service[0]}</h3><p>${service[2]}</p><div class="service-bottom"><strong>FROM £${service[1]}</strong><button data-service="${i}">Choose care ↗</button></div></article>`).join("");
document.querySelector("#service").insertAdjacentHTML("beforeend", services.map((service, i) => `<option value="${i}">${service[0]}</option>`).join(""));
function estimate()
{
    const service = document.querySelector("#service").value;
    const size = document.querySelector("#size").value;
    const tangled = document.querySelector("#condition").value === "tangled";
    document.querySelector("#coat-warning").hidden = !tangled;
    let text = "Choose a service & size";
    if (tangled) text = "Individual assessment";
    else if (service !== "" && size)
    {
        const index = Number(service);
        const extra = index < 4 ? { small: 0, medium: 10, large: 20 }[size] : 0;
        text = `From £${services[index][1] + extra}`;
    }
    document.querySelector("#estimate").textContent = text;
    document.querySelector("#status").textContent = "";
}
document.querySelectorAll("#service, #size, #condition").forEach((field) => field.addEventListener("change", estimate));
document.querySelector("#services-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-service]");
    if (!button) return;
    document.querySelector("#service").value = button.dataset.service;
    estimate();
    document.querySelector("#booking").scrollIntoView();
});
const coats = {
    short: "Short-coated / Labs, Beagles, Boxers. A suitable wash and brush can help with loose hair. Ask about individual skin sensitivities and shedding needs.",
    long: "Long-coated / Cockers, Spaniels, Setters. Discuss brushing, ear-area maintenance and a manageable everyday style. Coat condition is assessed before grooming.",
    doodle: "Doodles / Goldendoodles, Labradoodles, Cockapoos. Curl care and regular brushing matter. Tangles may need a comfort-first plan rather than a particular style."
};
document.querySelector("#coat-info").textContent = coats.short;
document.querySelectorAll("[data-coat]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-coat]").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    document.querySelector("#coat-info").textContent = coats[button.dataset.coat];
}));
const dogs = [
    ["Milo", "Golden / a tidy brush-out", "#d9ad67", "#ac763b", "#eee1c6", "Gentle coat-appropriate brushing can remove loose hair. Ask the groomer how to maintain the coat between visits."],
    ["Cloud", "Bichon / a soft silhouette", "#ede9df", "#cfc8ba", "#e0e9df", "A fluffy finish starts with a coat assessment. Regular brushing helps prevent uncomfortable tangles."],
    ["Pip", "Doodle / curl care", "#b4865f", "#936445", "#e9d8c6", "Doodle curls need a manageable brushing routine. A comfort-first cut may be best where matting is present."],
    ["Maple", "Spaniel / feathering care", "#b87346", "#77442e", "#dbe6e0", "Long ears and feathering need careful handling. Discuss any ear discomfort with a vet before grooming."],
    ["Otis", "Terrier / a practical trim", "#c4b393", "#7d776d", "#e5ddc8", "Talk about your dog's coat texture, lifestyle and the difference between grooming techniques."]
];
function dogSvg(dog, index)
{
    const ears = index === 4 ? '<path d="M65 90L58 29l54 45m76 0 54-45-7 61" fill="var(--ear)"/>' : '<ellipse cx="65" cy="126" rx="35" ry="64" fill="var(--ear)"/><ellipse cx="235" cy="126" rx="35" ry="64" fill="var(--ear)"/>';
    return `<svg class="dog-portrait" style="--tile:${dog[4]};--ear:${dog[3]}" viewBox="0 0 300 340" role="img" aria-label="Original ${dog[0]} dog illustration"><path d="M35 340q0-110 115-110t115 110" fill="${dog[2]}"/>${ears}<rect x="72" y="58" width="156" height="196" rx="${index === 2 ? 65 : 75}" fill="${dog[2]}"/><ellipse cx="150" cy="198" rx="62" ry="43" fill="#f3e4c9"/><circle cx="113" cy="146" r="9" fill="#302b25"/><circle cx="187" cy="146" r="9" fill="#302b25"/><path d="M133 185q17-12 34 0-1 22-17 20-16 2-17-20" fill="#37302a"/><path d="M125 215q25 29 50 0" fill="none" stroke="#6d4937" stroke-width="4"/><path d="M98 258l52 24 52-24-52 62z" fill="#33878a"/>${index === 2 ? '<path d="M91 82q10-25 23-5 15-27 28-4 18-25 31-4 17-22 30 0" fill="none" stroke="#8c5a3e" stroke-width="10"/>' : ""}</svg>`;
}
document.querySelector("#gallery-list").innerHTML = dogs.map((dog, index) => `<button data-dog="${index}">${dogSvg(dog, index)}<h3>${dog[0]} ↗</h3><small>${dog[1]}</small></button>`).join("");
const dialog = document.querySelector("#gallery-dialog");
document.querySelector("#gallery-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-dog]");
    if (!button) return;
    const index = Number(button.dataset.dog);
    const dog = dogs[index];
    document.querySelector("#gallery-title").textContent = dog[0];
    document.querySelector("#gallery-copy").textContent = dog[5];
    document.querySelector("#gallery-image").innerHTML = dogSvg(dog, index);
    dialog.showModal();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#groom-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const email = document.querySelector("#email");
    if (document.querySelector("#name").value.trim().length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Enter your name and a valid email address.";
        return;
    }
    const dog = document.querySelector("#dog").value.trim();
    const service = document.querySelector("#service").value;
    if (!dog || !document.querySelector("#size").value || service === "")
    {
        status.textContent = "Add your dog's name, size and service.";
        return;
    }
    const date = document.querySelector("#date").value;
    if (!date || date <= new Date().toLocaleDateString("en-CA") || new Date(`${date}T12:00:00`).getDay() === 0)
    {
        status.textContent = "Choose a future Monday–Saturday date.";
        return;
    }
    status.textContent = `${dog}: ${services[Number(service)][0]} / ${document.querySelector("#estimate").textContent} / ${date}. Sample enquiry only. Nothing booked or sent.`;
});
document.querySelectorAll("form input").forEach((input) => input.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
