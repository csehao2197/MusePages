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
const works = {
    reduction: { title: "Crown reduction", price: "£450–£900", description: "Reducing canopy size while keeping the tree's natural shape. An option for a healthy tree outgrowing its space. Extent of pruning needs species-specific professional assessment.", path: "M200 65C145 45 90 100 110 145C70 195 125 233 165 212C200 235 242 222 260 208C315 227 342 168 300 139C315 85 250 40 200 65Z" },
    lift: { title: "Crown lift", price: "£280–£550", description: "Removing selected lower branches for clearance over paths or drives. The upper canopy stays intact. The suitable clearance and extent depend on the tree.", path: "M200 25C110 0 50 80 75 140C80 170 125 177 165 160C190 180 230 170 260 160C315 180 360 160 328 130C350 55 265-5 200 25Z" },
    thin: { title: "Crown thinning", price: "£380–£750", description: "Selective internal branch removal to let more light and air through without changing the overall outline. Suitability varies by species and condition.", path: "M200 25C110 0 50 80 75 140C20 200 95 270 160 235C200 270 260 250 270 232C350 260 390 170 328 130C350 55 265-5 200 25Z" },
    pollard: { title: "Pollarding", price: "£350–£700", description: "Maintaining an established pollard on its existing cycle. Starting severe cutting on a mature, previously unpollarded tree can be damaging and requires expert advice.", path: "M145 125C125 125 125 100 145 100C165 100 165 125 145 125M240 118C222 118 222 93 240 93C260 93 260 118 240 118M198 171C180 171 180 146 198 146C216 146 216 171 198 171Z" },
    fell: { title: "Felling", price: "£600–£1,800", description: "For dead, dangerous trees or where no suitable alternative exists. Size, access, timber handling and permissions all affect the plan. Tree removal is professional work, not a DIY recommendation.", path: "M176 246H226V275H176Z" }
};
const tabs = [...document.querySelectorAll("[data-work]")];
let current = "reduction";
function chooseWork(id)
{
    current = id;
    const work = works[id];
    tabs.forEach((tab) =>
    {
        const active = tab.dataset.work === id;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
    });
    document.querySelector("#work-panel").setAttribute("aria-labelledby", `tab-${id}`);
    document.querySelector("#canopy").setAttribute("d", work.path);
    document.querySelector("#trunk").setAttribute("visibility", id === "fell" ? "hidden" : "visible");
    document.querySelector("#thin-lines").setAttribute("visibility", id === "thin" ? "visible" : "hidden");
    document.querySelector("#diagram-title").textContent = `${work.title} illustration`;
    document.querySelector("#work-title").textContent = work.title;
    document.querySelector("#work-price").textContent = work.price;
    document.querySelector("#work-description").textContent = work.description;
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => chooseWork(tab.dataset.work));
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        chooseWork(tabs[next].dataset.work);
        tabs[next].focus();
    });
});
document.querySelector("#discuss").addEventListener("click", () =>
{
    document.querySelector("#concern").value = `I'd like an assessment for ${works[current].title.toLowerCase()}. `;
    document.querySelector("#quote").scrollIntoView();
});
const protection = document.querySelector("#protection");
const protectionNotes = {
    unknown: "Check with your local planning authority before arranging work. Ask about TPOs, conservation areas and any other restrictions.",
    tpo: "Written council consent is generally needed before work on a TPO tree. Confirm the scope, conditions and any exceptions with the authority.",
    conservation: "Six weeks' written notice is normally needed for qualifying work in a conservation area. The council may make a TPO. Check exceptions and requirements first.",
    none: "No known designation is not confirmation of permission. Check with the council and consider wildlife, ownership and other restrictions before work."
};
function updateProtection()
{
    document.querySelector("#protection-result").textContent = protectionNotes[protection.value];
}
protection.addEventListener("change", updateProtection);
document.querySelectorAll("[data-material]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#concern").value = `I'd like to ask about ${button.dataset.material.toLowerCase()} availability and local delivery.`;
    document.querySelector("#quote").scrollIntoView();
}));
const photos = document.querySelector("#photos");
photos.addEventListener("change", () =>
{
    const files = [...photos.files];
    const invalid = files.length > 3 || files.some((file) => !["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024);
    photos.setCustomValidity(invalid ? "Choose up to 3 JPG or PNG images, 10 MB each." : "");
    document.querySelector("#photo-status").textContent = invalid ? "Choose up to 3 JPG or PNG images, 10 MB each." : `${files.length} photo${files.length === 1 ? "" : "s"} selected locally. Nothing uploaded.`;
});
document.querySelector("#quote-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const address = document.querySelector("#address").value.trim();
    const concern = document.querySelector("#concern").value.trim();
    document.querySelector("#quote-status").textContent = !name || address.length < 3 || concern.length < 15 ? "Enter your name, a meaningful address and at least 15 non-space characters about the concern." : "Request preview ready. Nothing sent or stored; no visit or work booked.";
});
chooseWork("reduction");
updateProtection();
