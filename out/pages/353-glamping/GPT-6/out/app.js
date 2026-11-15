const stays =
{
    Larch: { sleeps: 4, dog: true, weekday: 135, weekend: 160, copy: "Our biggest bell tent, under the oldest trees. A double, two singles and a stove that warms it in ten minutes.", facts: "Sleeps 4 · Private fire pit · Dogs welcome" },
    Curlew: { sleeps: 2, dog: false, weekday: 165, weekend: 190, copy: "On the edge of the wood, the whole valley in front of the door. Booked again for the sunrise.", facts: "Sleeps 2 · Wood fired hot tub · Adults only" },
    Rede: { sleeps: 5, dog: true, weekday: 140, weekend: 170, copy: "Closest to the river, with a path to a shallow pool children love. Bunks behind a canvas wall.", facts: "Sleeps 5 · Private fire pit · Dogs welcome" },
    "The Hut": { sleeps: 2, dog: false, weekday: 150, weekend: 175, copy: "A shepherd's hut on iron wheels with a tiny kitchen and a window over the bed.", facts: "Sleeps 2 · Kitchenette · Wood stove" }
};
document.querySelector("#tent-rows").innerHTML = Object.entries(stays).map(([name, stay], i) => `<article class="tent-row"><figure><svg role="img" aria-label="${name}, original accommodation illustration" style="filter:${["none", "saturate(.7)", "hue-rotate(12deg)", "none"][i]}" viewBox="0 0 600 700">${i === 3 ? '<use href="#hut"/>' : `<path fill="${["#7b8b79", "#a3ad92", "#788f89"][i]}" d="M0 0h600v700H0z"/><g stroke="#495e47" stroke-width="22"><path d="M55 0v580M510 0v600M140 0v390"/></g><path fill="#64755b" d="m0 590 250-70 350 70v110H0z"/><use href="#tent" x="65" y="260" width="480" height="360"/>`}</svg></figure><div><h3>${name}</h3><p>${stay.copy}</p><p class="tent-facts">${stay.facts}</p><p class="tent-price">from £${stay.weekday} a night</p><button data-stay="${name}">Plan a stay in ${name}</button></div></article>`).join("");
const form = document.querySelector("#stay-form");
const result = document.querySelector("#stay-result");
const booking = document.querySelector("#booking-link");
function note()
{
    const name = form.elements.stay.value;
    document.querySelector("#stay-note").textContent = `${name}: ${stays[name].facts}. ${name === "The Hut" ? "The hut can be explored in winter." : "Canvas season runs March through October."}`;
    result.textContent = "Selection updated. Recalculate to see a fresh sample cost.";
    booking.hidden = true;
}
form.addEventListener("input", () =>
{
    booking.hidden = true;
    result.textContent = "Choices changed. Calculate again for a current estimate.";
});
form.elements.stay.addEventListener("change", note);
document.querySelectorAll("[data-stay]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.stay.value = button.dataset.stay;
    note();
    document.querySelector("#planner").scrollIntoView();
}));
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    booking.hidden = true;
    const name = form.elements.stay.value;
    const stay = stays[name];
    const dateText = form.elements.arrival.value.trim();
    const date = new Date(`${dateText}T12:00:00Z`);
    const nights = Number(form.elements.nights.value);
    const dog = form.elements.dog.checked;
    const fail = (message) => { result.textContent = message; };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateText)
    {
        fail("Enter a real arrival date as YYYY-MM-DD.");
        return;
    }
    if (dateText <= new Date().toISOString().slice(0, 10))
    {
        fail("Choose a future arrival date.");
        return;
    }
    if (Number(form.elements.guests.value) > stay.sleeps)
    {
        fail(`${name} sleeps at most ${stay.sleeps}. Choose a larger pitch or fewer guests.`);
        return;
    }
    if (dog && !stay.dog)
    {
        fail("Dogs are welcome in Larch and Rede only.");
        return;
    }
    if (name === "Curlew" && form.elements.children.checked)
    {
        fail("Curlew is adults only. Larch, Rede or The Hut may suit your party.");
        return;
    }
    if (form.elements.holiday.checked && nights < 3)
    {
        fail("Bank holiday stays have a three night minimum.");
        return;
    }
    let total = 0;
    for (let i = 0; i < nights; i++)
    {
        const night = new Date(date.getTime() + i * 86400000);
        if (name !== "The Hut" && (night.getUTCMonth() < 2 || night.getUTCMonth() > 9))
        {
            fail("Canvas tents are open March to October. Choose The Hut for winter.");
            return;
        }
        total += [5, 6].includes(night.getUTCDay()) ? stay.weekend : stay.weekday;
    }
    total += dog ? 15 : 0;
    total += form.elements.hamper.checked ? 18 : 0;
    result.textContent = `${nights} nights in ${name} from ${dateText}: £${total.toLocaleString("en-GB")} sample total${dog ? ", including dog" : ""}${form.elements.hamper.checked ? " and one hamper" : ""}. Not live availability; nothing reserved or charged.`;
    booking.href = `mailto:stay@ashgillcanvas.co.uk?subject=${encodeURIComponent(`Stay enquiry: ${name}`)}&body=${encodeURIComponent(result.textContent)}`;
    booking.hidden = false;
});
document.querySelector("#stars").innerHTML = Array.from({ length: 95 }, (_, i) => `<circle cx="${(i * 73 + 19) % 500}" cy="${(i * 47 + 11) % 420}" r="${i % 7 === 0 ? 2 : 1}" fill="#d2d7be" opacity="${i % 3 === 0 ? .8 : .4}"/>`).join("");
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.close()));
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const information =
{
    rules: ["House rules", "Illustrative stay rules: quiet after 22:00, dogs on leads, children supervised by the river. Stoves and fire pits require the host's on-site guidance. Full terms would be confirmed by a real operator."],
    access: ["Accessibility", "The concept includes a sloping woodland, farm track and shared barn showers. Step-free routes and accessible facilities have not been verified. Discuss individual needs with the operator before travelling."],
    gifts: ["Gift vouchers", "This showcase does not sell vouchers or take payments. A real operator would confirm voucher terms and availability directly."],
    social: ["A little more of the wood", "This fictional retreat has no verified Instagram account. The original illustrations on this page are the complete local gallery."]
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, copy] = information[button.dataset.info];
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-copy").textContent = copy;
    document.querySelector("#info").showModal();
}));
addEventListener("scroll", () => document.querySelector("#nav").classList.toggle("solid", scrollY > document.querySelector(".hero").offsetHeight), { passive: true });
