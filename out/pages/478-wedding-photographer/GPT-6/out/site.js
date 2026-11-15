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
const items = [...document.querySelectorAll("[data-image]")];
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    items.forEach((item) => item.hidden = button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter);
    const count = items.filter((item) => !item.hidden).length;
    document.querySelector("#filter-status").textContent = `${count} illustrated ${count === 1 ? "story" : "stories"}`;
}));
const dialog = document.querySelector("#gallery-dialog");
let active = 0;
function showImage(index)
{
    const visible = items.filter((item) => !item.hidden);
    active = (index + visible.length) % visible.length;
    const item = visible[active];
    dialog.querySelector("img").src = `art.svg#${item.dataset.image}`;
    dialog.querySelector("img").alt = item.querySelector("img").alt;
    document.querySelector("#gallery-caption").textContent = `${item.dataset.caption} · ${active + 1} of ${visible.length}`;
}
items.forEach((item) => item.addEventListener("click", () =>
{
    showImage(items.filter((entry) => !entry.hidden).indexOf(item));
    dialog.showModal();
}));
document.querySelector("#next").addEventListener("click", () => showImage(active + 1));
document.querySelector("#previous").addEventListener("click", () => showImage(active - 1));
dialog.addEventListener("keydown", (event) =>
{
    if (event.key === "ArrowRight") showImage(active + 1);
    if (event.key === "ArrowLeft") showImage(active - 1);
});
document.querySelector("#close-gallery").addEventListener("click", () => dialog.close());
const packageSelect = document.querySelector("#package");
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    packageSelect.value = button.dataset.package;
    document.querySelector("#enquiry-status").hidden = true;
    document.querySelector("#contact").scrollIntoView();
    packageSelect.focus({ preventScroll: true });
}));
const form = document.querySelector("#enquiry-form");
const status = document.querySelector("#enquiry-status");
const date = document.querySelector("#date");
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
form.addEventListener("input", () => status.hidden = true);
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    status.hidden = false;
    if (document.querySelector("#names").value.trim().length < 2 || document.querySelector("#venue").value.trim().length < 2 || document.querySelector("#message").value.trim().length < 15)
    {
        status.textContent = "Add your names, a location and at least 15 non-space characters about your day.";
        return;
    }
    status.textContent = `${packageSelect.value} enquiry prepared for ${document.querySelector("#names").value.trim()} on ${date.value}. Nothing sent and no date held or consultation booked.`;
});
document.querySelectorAll("[data-social]").forEach((button) => button.addEventListener("click", () =>
{
    const status = document.querySelector("#social-status");
    status.hidden = false;
    status.textContent = `This fictional concept has no associated ${button.dataset.social} account.`;
}));
