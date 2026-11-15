const packages = [
    { name: "The Tidy", price: 35, time: "1 hour", rule: "Small breeds", items: ["Bath & blowdry", "Brush-out", "Nail trim", "Ear-area tidy", "Spritz & finish"] },
    { name: "The Full Groom", price: 55, time: "1.5 hours", rule: "All breeds", items: ["Full scissor cut", "Bath & blowdry", "Brush-out", "Nail trim & file", "Ear-area tidy", "Spritz & bandana"] },
    { name: "The Pamper", price: 75, time: "2 hours", rule: "All breeds", items: ["Full groom", "Cosmetic teeth brushing", "Blueberry facial", "Conditioning mask", "Nail care", "Paw balm", "Bandana or bow"] },
    { name: "The Puppy First", price: 30, time: "45 minutes", rule: "Under 12 months", items: ["Introductory bath", "Gentle brush", "Nail trim", "Reward-based introduction", "Sample completion note"] }
];
document.querySelector("#package-list").innerHTML = packages.map((pkg, index) => `<article class="package"><div class="package-head"><h3>${pkg.name}</h3><span class="price">£${pkg.price}</span></div><p class="duration">${pkg.time} / ${pkg.rule}</p><ul>${pkg.items.map((item) => `<li>${item}</li>`).join("")}</ul><button data-package="${index}">Choose ${pkg.name.toLowerCase()} →</button></article>`).join("");
document.querySelector("#package").insertAdjacentHTML("beforeend", packages.map((pkg, index) => `<option value="${index}">${pkg.name}</option>`).join(""));
function summary()
{
    const value = document.querySelector("#package").value;
    const assessment = document.querySelector("#assessment").checked;
    document.querySelector("#summary").textContent = value === "" ? "Choose a package to begin." : `${packages[Number(value)].name} / ${assessment ? "Individual assessment" : `from £${packages[Number(value)].price}`}`;
    document.querySelector("#duration").textContent = value === "" ? "Illustrative pricing and duration." : `${packages[Number(value)].time} indicative / ${packages[Number(value)].rule}. Final quote and suitability to confirm.`;
    document.querySelector("#status").textContent = "";
}
document.querySelector("#package-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-package]");
    if (!button) return;
    document.querySelector("#package").value = button.dataset.package;
    summary();
    document.querySelector("#booking").scrollIntoView();
});
document.querySelector("#package").addEventListener("change", summary);
document.querySelector("#assessment").addEventListener("change", summary);
const dogs = [
    ["Bichon Frise", "curly", "#e7ddc9", "#f7f1e3", "#baa98c"],
    ["Cockapoo", "curly", "#e5d1b6", "#c79d6d", "#8d6343"],
    ["Miniature Schnauzer", "silky", "#dedbd1", "#9d9b8c", "#666a61"],
    ["Samoyed", "double", "#d9e3d5", "#f5f0e2", "#b9bca9"],
    ["Labradoodle", "curly", "#e7d6c6", "#946b4f", "#644c3b"],
    ["Cavalier Spaniel", "silky", "#dfd8c6", "#ece0c7", "#99613e"]
];
let currentDog = 0;
function portrait(index)
{
    const dog = dogs[index];
    const ears = index === 2 || index === 3 ? `<path d="M83 106l-5-69 56 48m32 0 56-48-5 69" fill="${dog[4]}"/>` : `<ellipse cx="79" cy="145" rx="33" ry="66" fill="${dog[4]}"/><ellipse cx="221" cy="145" rx="33" ry="66" fill="${dog[4]}"/>`;
    return `<svg viewBox="0 0 300 300" role="img" aria-label="Original ${dog[0]} coat illustration"><rect width="300" height="300" fill="${dog[2]}"/><path d="M42 300q5-91 108-91t108 91" fill="${dog[3]}" stroke="${dog[4]}" stroke-width="2"/>${ears}<path d="M86 89q64-63 128 0l11 91q-5 67-75 72-70-5-75-72z" fill="${dog[3]}" stroke="${dog[4]}" stroke-width="2"/><ellipse cx="150" cy="191" rx="52" ry="35" fill="#f6edd9"/><circle cx="118" cy="146" r="6" fill="#393328"/><circle cx="182" cy="146" r="6" fill="#393328"/><path d="M139 176q11-6 22 0-1 16-11 15-10 1-11-15" fill="#544333"/><path d="M134 207q16 12 32 0" fill="none" stroke="#8d6546" stroke-width="2"/><path d="M99 100q10-14 20-2m13-10q10-13 20-1m14 4q10-13 20 0m-93 83 11 8m93-8 11 8" fill="none" stroke="${dog[4]}" stroke-width="2"/><path d="M126 246l24 12-24 17-28-14zM153 258l24-12 28 15-28 15z" fill="#b46c4c"/><circle cx="150" cy="260" r="8" fill="#d09b76"/></svg>`;
}
function renderGallery(filter = "all")
{
    document.querySelector("#gallery-grid").innerHTML = dogs.map((dog, index) => ({ dog, index })).filter(({ dog }) => filter === "all" || dog[1] === filter).map(({ dog, index }) => `<button data-dog="${index}">${portrait(index)}<span>${dog[0]} ↗</span></button>`).join("");
}
renderGallery();
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderGallery(button.dataset.filter);
}));
const dialog = document.querySelector("#gallery-dialog");
function showDog(index)
{
    currentDog = index;
    document.querySelector("#gallery-image").innerHTML = portrait(index);
    document.querySelector("#gallery-title").textContent = dogs[index][0];
    document.querySelector("#gallery-copy").textContent = `${dogs[index][1][0].toUpperCase() + dogs[index][1].slice(1)} coat study. Discuss brushing, handling, skin sensitivities and a practical style with a qualified groomer. Original illustration, not a grooming result.`;
}
document.querySelector("#gallery-grid").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-dog]");
    if (!button) return;
    showDog(Number(button.dataset.dog));
    dialog.showModal();
});
document.querySelector("#gallery-next").addEventListener("click", () => showDog((currentDog + 1) % dogs.length));
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#care-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const email = document.querySelector("#email");
    if (document.querySelector("#name").value.trim().length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add your name and a valid email address.";
        return;
    }
    const value = document.querySelector("#package").value;
    const size = document.querySelector("#size").value;
    const age = Number(document.querySelector("#age").value);
    if (!document.querySelector("#dog").value.trim() || !size || value === "" || !Number.isInteger(age) || age < 2 || age > 300)
    {
        status.textContent = "Add your dog's name, size, whole age in months (2–300) and package.";
        return;
    }
    if (value === "0" && size !== "small")
    {
        status.textContent = "The Tidy is for small breeds. Choose The Full Groom or The Pamper.";
        return;
    }
    if (value === "3" && age >= 12)
    {
        status.textContent = "The Puppy First is for dogs under 12 months. Choose an adult package.";
        return;
    }
    const date = document.querySelector("#date").value;
    if (!date || date <= new Date().toLocaleDateString("en-CA") || new Date(`${date}T12:00:00`).getDay() === 0 || !document.querySelector("#time").value)
    {
        status.textContent = "Choose a future Monday–Saturday date and a time preference.";
        return;
    }
    status.textContent = `${document.querySelector("#dog").value.trim()}: ${document.querySelector("#summary").textContent} / ${date} / ${document.querySelector("#time").value}. Sample care note. Nothing sent or reserved.`;
});
document.querySelectorAll("#care-form input, #care-form select").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
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
