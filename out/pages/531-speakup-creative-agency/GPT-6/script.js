const menu = document.querySelector("#mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const details = document.querySelector("#details");
const title = document.querySelector("#detail-title");
const content = document.querySelector("#detail-content");
const video = document.querySelector("video");
const motion = document.querySelector(".motion-control");
const sections =
{
    "Projects": ["Bold ideas, made tangible.", "Explore how an improbable idea can become a digital experience: define the challenge, prototype a direction, and shape the details. This homepage demo does not include a client portfolio."],
    "The Team": ["Different minds. One shared ambition.", "A venture brings strategy, design and engineering into the same conversation. Tell us what you have in mind and which disciplines your project needs. No team directory is included in this homepage demo."],
    "Products": ["From what if to what next.", "Give a new product a clear purpose, a distinctive identity and an experience people want to use. This is a homepage concept, not a product store."],
    "Our Story": ["Because it cannot be done is where we begin.", "Speakup is the creative agency concept in this collection. Its starting point is simple: bring bold digital visions to reality. This demonstration makes no claims about an operating agency."]
};
menuToggle.addEventListener("click", () =>
{
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
});
document.querySelector(".close-menu").addEventListener("click", () => menu.close());
menu.addEventListener("close", () => menuToggle.setAttribute("aria-expanded", "false"));
document.querySelector(".close-details").addEventListener("click", () => details.close());
details.addEventListener("close", () =>
{
    content.replaceChildren();
});
function openDetails(heading)
{
    if (menu.open) menu.close();
    title.textContent = heading;
    details.showModal();
}
document.querySelectorAll("[data-section]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const section = button.dataset.section;
        content.innerHTML = `<p><strong>${sections[section][0]}</strong></p><p>${sections[section][1]}</p><button class="pill" id="section-venture">Begin a venture</button>`;
        openDetails(section);
        document.querySelector("#section-venture").addEventListener("click", showVenture);
    });
});
function showVenture()
{
    content.innerHTML = `
        <p>Every improbable idea starts with a conversation.</p>
        <p class="demo-note">Demo brief builder. Nothing is sent or stored. Do not enter confidential information.</p>
        <form>
            <label>Your name<input name="name" autocomplete="name" required maxlength="80"></label>
            <label>Email address<input name="email" type="email" autocomplete="email" required maxlength="120"></label>
            <label>What are you exploring?<select name="type"><option>A new digital product</option><option>A website experience</option><option>A brand identity</option><option>Something improbable</option></select></label>
            <label>Your bold idea<textarea name="idea" required maxlength="1000"></textarea></label>
            <button class="pill" type="submit">Create my brief</button>
        </form>`;
    if (details.open)
    {
        title.textContent = "Begin a venture";
    }
    else
    {
        openDetails("Begin a venture");
    }
    content.querySelector("form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!String(data.get("name")).trim() || !String(data.get("idea")).trim())
        {
            const field = !String(data.get("name")).trim() ? "name" : "idea";
            const input = event.currentTarget.elements[field];
            input.setCustomValidity("Please enter more than spaces.");
            input.reportValidity();
            input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
            return;
        }
        content.innerHTML = `<p role="status"><strong>Your brief is ready — not submitted.</strong></p><p id="brief-name"></p><p id="brief-type"></p><p id="brief-idea"></p><p class="demo-note">This browser-only preview has no delivery service. Your information disappears when you close or restart the form.</p><button class="pill" id="restart">Start another brief</button>`;
        document.querySelector("#brief-name").textContent = `${data.get("name")} · ${data.get("email")}`;
        document.querySelector("#brief-type").textContent = data.get("type");
        document.querySelector("#brief-idea").textContent = data.get("idea");
        document.querySelector("#restart").addEventListener("click", showVenture);
    });
}
document.querySelectorAll("[data-venture]").forEach((button) => button.addEventListener("click", showVenture));
function updateMotion()
{
    motion.innerHTML = video.paused ? 'Play motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
    motion.setAttribute("aria-label", video.paused ? "Play background video" : "Pause background video");
}
video.addEventListener("play", updateMotion);
video.addEventListener("pause", updateMotion);
motion.addEventListener("click", () =>
{
    if (video.paused) video.play().catch(() => updateMotion());
    else video.pause();
});
if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
