"use strict";

const groupData =
{
    steady: { name: "The Steady Four", detail: "A gentler hour with time to sniff. £16 per walk, up to four compatible dogs. A meeting comes first." },
    long: { name: "The Long Ones", detail: "Ninety minutes for dogs comfortable with a longer outing. £22 per walk, up to four dogs. We discuss fitness and suitability first." },
    solo: { name: "Solo", detail: "Forty five minutes at your dog's own pace. £24 for one dog. Recovery needs should be discussed with your vet before a walk." }
};
let selectedGroup = "steady";
let postcodeArea = "";
const meetEmail = document.querySelector("#meet-email");

function updateEmail()
{
    const body = `Hello Long Lead,\n\nI'd like to ask about ${groupData[selectedGroup].name}.${postcodeArea ? ` My outward postcode is ${postcodeArea}.` : ""}\n\nCould we discuss suitability and arrange a first meeting?\n\nMy dog's name and needs:\n`;
    meetEmail.href = `mailto:hello@longlead.dog?subject=${encodeURIComponent(`A first meeting · ${groupData[selectedGroup].name}`)}&body=${encodeURIComponent(body)}`;
}

function chooseGroup(key)
{
    selectedGroup = key;
    document.querySelectorAll("[data-group]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.group === key)));
    document.querySelectorAll("[data-group]").forEach((button) => button.classList.toggle("active", button.dataset.group === key));
    document.querySelector("#group-detail").textContent = groupData[key].detail;
    document.querySelector("#meet-context").textContent = `Interested in ${groupData[key].name}? Start with a chat and a short walk. Suitability and availability are agreed together.`;
    updateEmail();
}
document.querySelectorAll("[data-group]").forEach((button) => button.addEventListener("click", () => chooseGroup(button.dataset.group)));
chooseGroup("steady");

const dogs =
[
    { name: "Mabel", breed: "lurcher", pace: "long", color: "#b9a68c", ears: "fold", note: "A long legged explorer who likes a good sniff after a stretch." },
    { name: "Otto", breed: "cocker spaniel", pace: "long", color: "#8f6039", ears: "long", note: "Always interested in the next woodland scent. A lively walking companion." },
    { name: "Sid", breed: "staffie cross", pace: "steady", color: "#8b8b7b", ears: "fold", note: "An easy going wanderer who enjoys taking the scenic route." },
    { name: "Winnie", breed: "border terrier", pace: "steady", color: "#ab8e61", ears: "fold", note: "Small paws and plenty to investigate. Gentle company suits her." },
    { name: "Bruno", breed: "labrador", pace: "steady", color: "#d0ad60", ears: "long", note: "A companion for a steady woodland hour, with plenty of pauses." },
    { name: "Peg", breed: "whippet", pace: "long", color: "#d5c9b0", ears: "point", note: "Long legs, a curious nose and a fondness for an open path." }
];

function portrait(dog, index)
{
    const ear = dog.ears === "long" ? '<ellipse cx="57" cy="131" rx="22" ry="53"/><ellipse cx="142" cy="131" rx="22" ry="53"/>' : dog.ears === "point" ? '<path d="M61 95L65 32L92 92M113 91L140 32L145 100"/>' : '<path d="M58 90L38 75L49 130L79 106M121 105L152 130L161 75L141 90"/>';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${["#b9bfaa", "#c5c6b1", "#b4bba6"][index % 3]}"/><path d="M0 130Q60 90 114 130T200 115V200H0" fill="#879371"/><path d="M15 0L28 126M175 0L166 125M28 37L60 15M166 55L145 20" fill="none" stroke="#6b795f" stroke-width="8"/><path d="M60 200L72 144H128L145 200" fill="${dog.color}"/><g fill="${dog.color}">${ear}<ellipse cx="100" cy="117" rx="${dog.breed === "whippet" ? 31 : 42}" ry="47"/></g><ellipse cx="100" cy="137" rx="25" ry="20" fill="#e2d5b9"/><circle cx="84" cy="109" r="3" fill="#23301f"/><circle cx="116" cy="109" r="3" fill="#23301f"/><path d="M93 130Q100 124 107 130L100 138Z" fill="#23301f"/><path d="M100 138v9m0 0q-8 6-13 0m13 0q8 6 13 0" fill="none" stroke="#23301f" stroke-width="2"/><path d="M70 163Q100 174 130 163" fill="none" stroke="#a9512b" stroke-width="8"/><circle cx="101" cy="175" r="6" fill="#d4b568"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
dogs.forEach((dog, index) => dog.image = portrait(dog, index));
const packGrid = document.querySelector("#pack-grid");
const dialog = document.querySelector("#dog-dialog");
let opener;

function openDog(dog, button)
{
    opener = button;
    document.querySelector("#dog-name").textContent = dog.name;
    document.querySelector("#dog-detail").textContent = `${dog.breed}. ${dog.note} An illustrated fictional companion, not a client record.`;
    document.querySelector("#dog-image").src = dog.image;
    document.querySelector("#dog-image").alt = `Original outdoor illustration of ${dog.name}, ${dog.breed}`;
    document.querySelector("#dog-walk").onclick = () =>
    {
        chooseGroup(dog.pace);
        dialog.close();
    };
    dialog.showModal();
}

function renderPack(filter)
{
    packGrid.replaceChildren();
    dogs.filter((dog) => filter === "all" || dog.pace === filter).forEach((dog) =>
    {
        const button = document.createElement("button");
        button.className = "dog";
        button.setAttribute("aria-label", `Meet ${dog.name}, ${dog.breed}`);
        const image = document.createElement("img");
        image.src = dog.image;
        image.alt = `Illustrated ${dog.breed} outdoors`;
        image.width = 200;
        image.height = 200;
        const label = document.createElement("span");
        label.className = "meta";
        label.textContent = dog.name.toUpperCase();
        const breed = document.createElement("span");
        breed.className = "breed meta";
        breed.textContent = dog.breed.toUpperCase();
        button.append(image, label, breed);
        button.addEventListener("click", () => openDog(dog, button));
        packGrid.append(button);
    });
    document.querySelector("#pack-count").textContent = `${packGrid.children.length} ILLUSTRATED COMPANIONS`;
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderPack(button.dataset.filter);
}));
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
dialog.addEventListener("click", (event) =>
{
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
renderPack("all");

const routes =
{
    woods: ["An hour in the woods.", "Plenty of sniffing, one squirrel to watch and a towel down before home.", "60 MIN · 3.8 KM · SAMPLE ROUTE"],
    moor: ["Out on the moor edge.", "A longer stretch with a water pause and a slower finish on the way back.", "90 MIN · 6.4 KM · SAMPLE ROUTE"],
    river: ["The river, at their pace.", "A gentle loop, lots of stops and a quiet path back. No swimming today.", "60 MIN · 3.1 KM · SAMPLE ROUTE"]
};
function chooseRoute(key)
{
    const [title, note, distance] = routes[key];
    document.querySelector("#route-title").textContent = title;
    document.querySelector("#route-note").textContent = note;
    document.querySelector("#route-distance").textContent = distance;
    document.querySelectorAll("[data-route]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.route === key)));
    document.querySelector(".route").style.transform = key === "moor" ? "translate(12px, -4px) scale(.93)" : key === "river" ? "translate(10px, 12px) scale(.85)" : "none";
}
document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => chooseRoute(button.dataset.route)));
chooseRoute("woods");

document.querySelector("#coverage-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = document.querySelector("#postcode");
    const value = input.value.toUpperCase().replace(/\s+/g, "");
    const match = /^(S(?:[1-9]\d?))(?:\d[ABD-HJLNP-UW-Z]{2})?$/.exec(value);
    const output = document.querySelector("#coverage-result");
    postcodeArea = "";
    if (!match)
    {
        input.setAttribute("aria-invalid", "true");
        output.textContent = "Enter a Sheffield postcode or outward code, such as S7 or S7 1AA.";
        input.focus();
    }
    else
    {
        input.removeAttribute("aria-invalid");
        const area = match[1];
        if (["S7", "S8", "S11", "S17"].includes(area))
        {
            postcodeArea = area;
            output.textContent = `${area} is in the example area. The four mile pickup limit and space in a suitable group still need confirming.`;
        }
        else
        {
            output.textContent = `${area} is outside the listed area. Email to discuss your location; this does not confirm coverage.`;
        }
    }
    updateEmail();
});

const lead = document.querySelector("#lead-path");
const length = lead.getTotalLength();
lead.style.strokeDasharray = String(length);
function drawLead()
{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = reduced ? 1 : Math.max(.035, Math.min(1, window.scrollY / Math.max(1, total)));
    lead.style.strokeDashoffset = String(length * (1 - progress));
}
window.addEventListener("scroll", drawLead, { passive: true });
window.addEventListener("resize", drawLead);
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", drawLead);
drawLead();
