const services = [["Cut & Style", 65, "Precision cutting tailored to your face shape, lifestyle and texture. Every cut starts with a conversation."], ["Colour", 120, "Balayage, highlights, full colour and glossing, bringing depth and dimension to every shade."], ["Treatments", 55, "Conditioning, smoothing, scalp care and bond repair options, selected after a suitability consultation."], ["Bridal", 200, "Trials, morning-of styling and bridal party coordination, planned thoughtfully around your day."]];
document.querySelector("#service-grid").innerHTML = services.map(([name, price, copy], i) => `<article class="service"><svg role="img" aria-label="${name}, original hair study" style="--back:${["#c9b79e", "#c5a587", "#b8bca9", "#d4c4ae"][i]};--hair:${["#5b402c", "#805b3b", "#42372c", "#927149"][i]}"><use href="#hair-study"/></svg><h3>${name}</h3><p>${copy}</p><p class="price">From £${price}</p><button data-service="${name}">Book now ↗</button></article>`).join("");
const studies = [["Honey balayage", "#5a3825", "#b58a54", "#d6b57c"], ["Sleek blowout", "#382a24", "#694c36", "#9d8061"], ["Textured dimension", "#30241e", "#5e4532", "#b28c65"], ["Bridal softness", "#725337", "#b49664", "#e0c895"], ["Platinum framing", "#8b8068", "#c8bb91", "#f0e1b4"], ["Brunette gloss", "#2f241d", "#55402e", "#a48d6e"], ["Auburn correction", "#643523", "#a85d36", "#d79460"], ["Lived-in highlights", "#695338", "#ab8b5a", "#dcc493"]];
const studyArt = (index) => `<svg role="img" aria-label="${studies[index][0]}, original colour illustration" style="--hair:${studies[index][1]};--light:${studies[index][2]};--strand:${studies[index][3]}"><use href="#hair-study"/></svg>`;
document.querySelector("#gallery-track").innerHTML = [false, true].map((clone) => studies.map((study, index) => `<button class="work ${clone ? "clone" : ""}" data-look="${index}" ${clone ? 'aria-hidden="true" tabindex="-1"' : ""}>${studyArt(index)}<span>${study[0]} ↗</span></button>`).join("")).join("");
let current = 0;
function showStudy(index)
{
    current = (index + studies.length) % studies.length;
    document.querySelector("#gallery-image").innerHTML = studyArt(current);
    document.querySelector("#gallery-title").textContent = studies[current][0];
    document.querySelector("#gallery-number").textContent = `Study ${current + 1} of ${studies.length}`;
}
document.querySelectorAll("[data-look]").forEach((button) => button.addEventListener("click", () =>
{
    showStudy(Number(button.dataset.look));
    document.querySelector("#gallery-dialog").showModal();
}));
document.querySelector("#previous-look").addEventListener("click", () => showStudy(current - 1));
document.querySelector("#next-look").addEventListener("click", () => showStudy(current + 1));
document.querySelector("#compare-range").addEventListener("input", (event) =>
{
    document.querySelector("#comparison").style.setProperty("--position", `${event.target.value}%`);
    document.querySelector("#compare-value").textContent = `${event.target.value}%`;
});
document.querySelector("#motion-toggle").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.target.setAttribute("aria-pressed", String(paused));
    event.target.textContent = paused ? "Resume gallery & marquee" : "Pause gallery & marquee";
});
const form = document.querySelector("#request-form");
const emailDraft = document.querySelector("#email-draft");
function updateService()
{
    const name = form.elements.service.value;
    const service = services.find((item) => item[0] === name);
    document.querySelector("#request-note").textContent = `${name} from £${service[1]}. ${name === "Colour" ? "Colour suitability and any patch-test requirements need operator confirmation. " : name === "Bridal" ? "Bridal timing, trial and party size need a personal consultation. " : ""}Consultation shapes the final price.`;
    emailDraft.hidden = true;
    document.querySelector("#request-result").textContent = "Selection updated. No request or appointment created.";
}
form.elements.service.addEventListener("change", updateService);
form.addEventListener("input", () =>
{
    emailDraft.hidden = true;
    document.querySelector("#request-result").textContent = "Details changed. Preview again before opening an email draft.";
});
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.service.value = button.dataset.service;
    updateService();
    document.querySelector("#booking").scrollIntoView();
}));
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#request-result");
    emailDraft.hidden = true;
    if (form.elements.name.value.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter your full name and a valid email address.";
        return;
    }
    if (!form.elements.date.value || form.elements.date.value <= new Date().toISOString().slice(0, 10))
    {
        result.textContent = "Choose a future preferred date.";
        return;
    }
    const service = services.find((item) => item[0] === form.elements.service.value);
    result.textContent = `${service[0]} enquiry preview for ${form.elements.name.value.trim()}, preferred ${form.elements.date.value}, from £${service[1]}. No request sent, appointment confirmed or payment taken.`;
    const body = `${result.textContent}\nReply email: ${form.elements.email.value.trim()}\n${form.elements.message.value.trim()}`;
    emailDraft.href = `mailto:hello@atelierblanche.com?subject=${encodeURIComponent(`${service[0]} appointment enquiry`)}&body=${encodeURIComponent(body)}`;
    emailDraft.hidden = false;
});
const info =
{
    social: ["A note on social", "The handles in this fictional brief are not verified accounts. Explore the eight original studies here; no account or external tracking service is opened."],
    press: ["Press enquiries", "This is a fictional editorial brand showcase. For a real press pack, contact the studio operator; no awards or media endorsements have been independently verified."],
    gift: ["A thoughtful gift", "Gift cards are not sold in this static concept. A real operator would provide value, expiry and redemption terms before any payment."],
    careers: ["Join the atelier", "No live vacancies are advertised here. This fictional team introduces the types of craft a working studio might offer."],
    privacy: ["Your privacy", "Forms run in browser memory. This page sends no personal data, sets no analytics cookies and stores no form details. An email draft is handed to your own email app only when you choose the link."],
    terms: ["Concept terms", "Prices, biographies, testimonials, story figures and contact details are illustrative. No appointment, treatment result or response time is guaranteed. Original art is not evidence of real client work."]
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, copy] = info[button.dataset.info];
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-copy").textContent = copy;
    document.querySelector("#info-dialog").showModal();
}));
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
}));
addEventListener("scroll", () => document.querySelector("#nav").classList.toggle("solid", scrollY > 60), { passive: true });
