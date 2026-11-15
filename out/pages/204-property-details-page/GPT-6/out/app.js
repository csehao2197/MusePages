const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat("en-US",{ style:"currency",currency:"USD",maximumFractionDigits:0 }).format(value);
const images = ["exterior.svg","living.svg","garden.svg"];
const names = ["Exterior & pool","Living room","Garden & terrace"];
let photo = 0;
const dialog = $("dialog");
function renderPhoto()
{
    $("#modal-image").src = images[photo];
    $("#modal-image").alt = `Original architectural illustration: ${names[photo]}`;
    $("#modal-title").textContent = names[photo];
    $("#photo-count").textContent = `${photo+1} / ${images.length}`;
    $("#modal-note").textContent = "Original concept artwork, not a photograph or measured room plan. Arrow keys and swipe navigate the illustrations.";
}
function openGallery(index)
{
    photo = index;
    $("#modal-image").hidden = false;
    $("#walkthrough").hidden = true;
    $("#gallery-controls").hidden = false;
    $("#share-controls").hidden = true;
    renderPhoto();
    dialog.showModal();
}
document.querySelectorAll("[data-photo]").forEach(button => button.addEventListener("click", () => openGallery(Number(button.dataset.photo))));
$("#tour").addEventListener("click", () => openGallery(1));
const move = step =>
{
    photo = (photo + step + images.length) % images.length;
    renderPhoto();
};
$("#previous").addEventListener("click", () => move(-1));
$("#next").addEventListener("click", () => move(1));
dialog.addEventListener("keydown", event =>
{
    if ($("#gallery-controls").hidden) return;
    if (event.key === "ArrowRight") move(1);
    if (event.key === "ArrowLeft") move(-1);
});
let touch;
$("#modal-image").addEventListener("touchstart", event => touch = event.changedTouches[0].clientX, { passive:true });
$("#modal-image").addEventListener("touchend", event =>
{
    const difference = event.changedTouches[0].clientX-touch;
    if (Math.abs(difference) > 40) move(difference > 0 ? -1 : 1);
}, { passive:true });
$("#video").addEventListener("click", () =>
{
    $("#modal-title").textContent = "Illustrated walkthrough / original motion concept";
    $("#modal-image").hidden = true;
    $("#walkthrough").hidden = false;
    $("#gallery-controls").hidden = true;
    $("#share-controls").hidden = true;
    $("#modal-note").textContent = "An original animated montage of the three illustrations, not recorded property footage or a 360° tour.";
    dialog.showModal();
});
dialog.addEventListener("close", () => $("#walkthrough").pause());
$("#close").addEventListener("click", () => dialog.close());
let saved = false;
try
{
    saved = localStorage.getItem("oak-acre-saved") === "yes";
}
catch {}
function showSaved()
{
    $("#save").textContent = saved ? "♥ Saved on this browser" : "♡ Save";
    $("#save").setAttribute("aria-pressed", String(saved));
}
showSaved();
$("#save").addEventListener("click", () =>
{
    saved = !saved;
    try
    {
        localStorage.setItem("oak-acre-saved", saved ? "yes" : "no");
    }
    catch {}
    showSaved();
});
$("#share").addEventListener("click", () =>
{
    $("#modal-title").textContent = "Share this illustrative property";
    $("#modal-image").hidden = true;
    $("#walkthrough").hidden = true;
    $("#gallery-controls").hidden = true;
    $("#share-controls").hidden = false;
    $("#modal-note").textContent = "Share a link to this page. No agent or social account is contacted.";
    $("#share-link").value = location.href.split("#")[0];
    $("#email-link").href = `mailto:?subject=${encodeURIComponent("123 Oak Avenue / sample listing")}&body=${encodeURIComponent($("#share-link").value)}`;
    $("#copy-result").textContent = "";
    dialog.showModal();
});
$("#copy").addEventListener("click", async () =>
{
    try
    {
        await navigator.clipboard.writeText($("#share-link").value);
        $("#copy-result").textContent = "Link copied.";
    }
    catch
    {
        $("#share-link").select();
        $("#copy-result").textContent = "Select and copy the link above using your keyboard.";
    }
});
$("#print").addEventListener("click", () => window.print());
document.querySelectorAll("[data-place]").forEach(button => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-place]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    $("#place-result").textContent = button.dataset.place === "Schools" ? "School names, ratings, attendance zones and distances await verified location data. No school quality claims are made." : `${button.dataset.place} information and distances await a verified property location. This map is an illustrative layout, not navigation data.`;
}));
$("#map-pin").addEventListener("click", () => $("#place-result").textContent = "123 Oak Avenue is a sample address. A real location, street view and directions have not been configured.");
$("#commute").addEventListener("click", () =>
{
    const distance = Number($("#distance").value);
    const speed = Number($("#speed").value);
    $("#commute-result").textContent = $("#distance").value !== "" && $("#speed").value !== "" && distance >= 0 && distance <= 1000 && speed > 0 && speed <= 100 ? `${Math.round(distance/speed*60)} minutes at your assumed speed. Not a route or live traffic estimate.` : "Enter a distance from 0–1,000 miles and a speed from 1–100 mph.";
});
function mortgage()
{
    const down = Number($("#down").value);
    const rate = Number($("#rate").value);
    $("#down-value").textContent = `${down}%`;
    if ($("#rate").value === "" || !Number.isFinite(rate) || rate < 0 || rate > 25)
    {
        $("#monthly").textContent = "Enter a rate from 0–25%";
        $("#payment-detail").textContent = "";
        return;
    }
    const principal = 1250000 * (1-down/100);
    const monthlyRate = rate/1200;
    const payment = monthlyRate ? principal*monthlyRate/(1-(1+monthlyRate)**-360) : principal/360;
    const pmi = down < 20 ? principal*.005/12 : 0;
    $("#monthly").textContent = money(payment+1250+200+pmi);
    $("#payment-detail").textContent = `P&I ${money(payment)} / tax $1,250 / insurance $200 / HOA $0 / PMI ${money(pmi)}. Loan ${money(principal)}.`;
}
$("#down").addEventListener("input", mortgage);
$("#rate").addEventListener("input", mortgage);
mortgage();
const today = new Date();
const localDate = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
$("[name=date]").min = localDate;
$("#schedule-tour").addEventListener("click", () => setTimeout(() => $("[name=date]").focus(),100));
$("#request-info").addEventListener("click", () => setTimeout(() => $("[name=email]").focus(),100));
$(".agent form").addEventListener("submit", event =>
{
    event.preventDefault();
    $("#form-result").textContent = "Demo showing request checked locally. Nothing sent or stored; no showing scheduled.";
});
document.querySelectorAll("[data-contact]").forEach(button => button.addEventListener("click", () => $("#contact-result").textContent = `${button.dataset.contact} is a demo action: verified phone/email not supplied, nothing initiated.`));
const comparables = [["18 Willow Terrace","$1,180,000","4 beds · 3 baths"],["6 Garden Mews","$1,325,000","4 beds · 4 baths"],["41 Birch Lane","$1,095,000","3 beds · 3 baths"],["9 Linden Court","$1,390,000","5 beds · 4 baths"]];
let comparable = 0;
function renderSimilar()
{
    $("#similar-grid").replaceChildren();
    comparables.slice(comparable,comparable+2).forEach((row,index) =>
    {
        const button = document.createElement("button");
        button.className = "similar-card";
        button.innerHTML = `<img src="${images[index ? 2 : 0]}" width="1400" height="850" loading="lazy" alt="Original sample architectural illustration"><p><b>${row[1]}</b><br>${row[0]}<br><span class="notice">${row[2]} · illustrative property</span></p>`;
        button.addEventListener("click", () =>
        {
            openGallery(index ? 2 : 0);
            $("#modal-title").textContent = `${row[0]} / sample comparable`;
            $("#modal-note").textContent = "Illustrative comparable, not verified market data. No actual listing or enquiry service.";
        });
        $("#similar-grid").append(button);
    });
}
$("#next-similar").addEventListener("click", () =>
{
    comparable = comparable ? 0 : 2;
    renderSimilar();
});
renderSimilar();
const menu = $("[data-menu]");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    $("nav").classList.toggle("open", open);
});
