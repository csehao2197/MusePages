const menu = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("open", expanded);
});
navigation.addEventListener("click", (event) =>
{
    if (event.target.closest("a"))
    {
        menu.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
    }
});
const slides = [...document.querySelectorAll(".slides img")];
const dots = [...document.querySelectorAll(".dots button")];
const captions = ["THE HOUSE", "THE SITTING ROOM", "THE TERRACE", "THE BEDROOM", "THE GROUNDS"];
let activeIndex = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pause = document.querySelector("#pause");
pause.textContent = paused ? "Play slideshow" : "Pause slideshow";
function showSlide(index)
{
    activeIndex = index;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === index)));
    document.querySelector("#slide-label").textContent = `0${index + 1} / ${captions[index]}`;
}
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
setInterval(() =>
{
    if (!paused && !document.hidden)
    {
        showSlide((activeIndex + 1) % slides.length);
    }
}, 4000);
pause.addEventListener("click", () =>
{
    paused = !paused;
    pause.textContent = paused ? "Play slideshow" : "Pause slideshow";
});
const availability = document.querySelector("#availability");
const availabilityStatus = document.querySelector("#availability-status");
const arrival = document.querySelector("#arrival");
const departure = document.querySelector("#departure");
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
arrival.min = localToday;
departure.min = localToday;
function datesValid(start, end)
{
    return start.value >= localToday && end.value > start.value;
}
availability.addEventListener("submit", (event) =>
{
    event.preventDefault();
    availabilityStatus.hidden = false;
    if (!datesValid(arrival, departure))
    {
        availabilityStatus.textContent = "Choose a departure after arrival, with arrival today or later.";
        return;
    }
    const nights = Math.round((Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000);
    availabilityStatus.textContent = `${nights} nights · ${document.querySelector("#guests").value}. Demo only: live availability is not checked and nothing is booked.`;
    document.querySelector("#enquiry-arrival").value = arrival.value;
    document.querySelector("#enquiry-departure").value = departure.value;
});
availability.addEventListener("input", () => availabilityStatus.hidden = true);
const enquiry = document.querySelector("#enquiry-form");
const enquiryStatus = document.querySelector("#enquiry-status");
enquiry.addEventListener("input", () => enquiryStatus.hidden = true);
enquiry.addEventListener("submit", (event) =>
{
    event.preventDefault();
    enquiryStatus.hidden = false;
    if (document.querySelector("#name").value.trim().length < 2)
    {
        enquiryStatus.textContent = "Please enter a name with at least two non-space characters.";
        return;
    }
    if (!datesValid(document.querySelector("#enquiry-arrival"), document.querySelector("#enquiry-departure")))
    {
        enquiryStatus.textContent = "Choose a departure after arrival, with arrival today or later.";
        return;
    }
    enquiryStatus.textContent = `Enquiry prepared for ${document.querySelector("#name").value.trim()}. Nothing sent or booked. This fictional property has no live host connection.`;
});
const lightbox = document.querySelector("#lightbox");
document.querySelectorAll("[data-scene]").forEach((button) => button.addEventListener("click", () =>
{
    lightbox.querySelector("img").src = `art.svg#${button.dataset.scene}`;
    lightbox.querySelector("img").alt = button.querySelector("img").alt;
    document.querySelector("#lightbox-caption").textContent = button.querySelector("span").textContent;
    lightbox.showModal();
}));
document.querySelector("#close-lightbox").addEventListener("click", () => lightbox.close());
