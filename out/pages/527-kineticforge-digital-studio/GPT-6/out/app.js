const videos = [document.querySelector("#hero-video"), document.querySelector("#studio-video")];
const motionButton = document.querySelector(".motion-toggle");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-menu");
const dialog = document.querySelector("#detail-dialog");
const dialogContent = document.querySelector(".dialog-content");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeVideo = 1;
let paused = reducedMotion.matches;
let previousOverflow = "";
let dialogOverflow = "";
let opener = null;

function updatePlayback()
{
    videos.forEach((video, index) =>
    {
        video.classList.toggle("active", activeVideo === index + 1);
        video.autoplay = !paused && activeVideo === index + 1;
        if (!video.getAttribute("src"))
        {
            return;
        }
        if (paused || activeVideo !== index + 1)
        {
            video.pause();
        }
        else
        {
            const playback = video.play();
            if (playback)
            {
                playback.catch((error) =>
                {
                    if (error.name === "AbortError")
                    {
                        return;
                    }
                    paused = true;
                    updatePlayback();
                });
            }
        }
    });
    motionButton.classList.toggle("paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.setAttribute("aria-label", paused ? "Play background videos" : "Pause background videos");
    document.body.dataset.activeVideo = String(activeVideo);
}

new IntersectionObserver(([entry]) =>
{
    const next = entry.isIntersecting ? 2 : 1;
    if (next !== activeVideo)
    {
        activeVideo = next;
        if (next === 2)
        {
            videos[1].currentTime = 0;
        }
        updatePlayback();
    }
}, { threshold: .15 }).observe(document.querySelector("#studio"));

motionButton.addEventListener("click", () =>
{
    paused = !paused;
    updatePlayback();
});

reducedMotion.addEventListener("change", (event) =>
{
    paused = event.matches;
    updatePlayback();
});

function setMenu(open, restoreFocus = true)
{
    if (open)
    {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
    }
    else if (menu.classList.contains("open"))
    {
        document.body.style.overflow = previousOverflow;
    }
    menu.classList.toggle("open", open);
    menu.inert = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.querySelector("main").inert = open;
    motionButton.inert = open;
    if (open)
    {
        menu.querySelector("a").focus();
    }
    else if (restoreFocus)
    {
        menuButton.focus();
    }
}

menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelector("a").addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (event) =>
{
    if (!menu.classList.contains("open"))
    {
        return;
    }
    if (event.key === "Escape")
    {
        setMenu(false);
    }
    if (event.key === "Tab")
    {
        const stops = [menuButton, ...menu.querySelectorAll("a, button")];
        const current = stops.indexOf(document.activeElement);
        event.preventDefault();
        stops[(current + (event.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
    }
});

window.matchMedia("(min-width: 768px)").addEventListener("change", (event) =>
{
    if (event.matches && menu.classList.contains("open"))
    {
        setMenu(false, false);
    }
});

const details =
{
    about: `<p class="eyebrow">Vancouver / Montreal / Berlin</p>
        <h2 id="dialog-title">Built on collaboration.</h2>
        <p>We bring strategy, design and development together to make digital experiences more useful, more intuitive and more human.</p>
        <ul class="detail-list"><li><strong>Discover</strong>Understand the people, the challenge and the opportunity.</li><li><strong>Make</strong>Prototype, design and develop as one connected team.</li><li><strong>Evolve</strong>Learn from real usage and keep improving the experience.</li></ul>
        <button type="button" class="outline-button" data-open="contact">Explore your next venture</button>`,
    expertise: `<p class="eyebrow">Our expertise</p>
        <h2 id="dialog-title">From idea to interaction.</h2>
        <ul class="detail-list"><li><strong>Product strategy</strong>Discovery, experience mapping and a focused roadmap.</li><li><strong>Interface design</strong>Accessible interfaces, design systems and interactive prototypes.</li><li><strong>Web products</strong>Responsive platforms and tools built around people's needs.</li></ul>
        <button type="button" class="outline-button" data-open="contact">Tell us what you're building</button>`,
    projects: `<p class="eyebrow">Project directions</p>
        <h2 id="dialog-title">Useful by design.</h2>
        <p>Illustrative concepts for this studio demo, not verified client case studies.</p>
        <ul class="detail-list"><li><strong>A clearer public service</strong>A guided, accessible service journey that makes the next step obvious.</li><li><strong>A connected team workspace</strong>A product interface for finding information and moving work forward.</li><li><strong>A more intuitive commerce experience</strong>A discovery-to-checkout journey shaped around customer needs.</li></ul>
        <button type="button" class="outline-button" data-open="contact">Discuss a similar challenge</button>`,
    contact: `<p class="eyebrow">Get in touch</p>
        <h2 id="dialog-title">Let's make something matter.</h2>
        <p>Prepare a project brief below. This browser-only demo does not send messages or store your information.</p>
        <form class="contact-form">
            <label>Your name<input name="name" autocomplete="name" required maxlength="100"></label>
            <label>Email address<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
            <label>What can we help with?<select name="service"><option>Web product</option><option>Interface design</option><option>Product strategy</option></select></label>
            <label>A little about your project<textarea name="project" required maxlength="2000"></textarea></label>
            <button class="outline-button" type="submit">Prepare my brief</button>
        </form><p class="brief-output" aria-live="polite" hidden></p>`
};

function openDetails(name, trigger)
{
    if (!details[name])
    {
        return;
    }
    if (menu.classList.contains("open"))
    {
        setMenu(false, false);
        opener = menuButton;
    }
    else if (!dialog.open)
    {
        opener = trigger;
    }
    dialogContent.innerHTML = details[name];
    if (!dialog.open)
    {
        dialogOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
    }
    dialog.querySelector(".dialog-close").focus();
}

document.addEventListener("click", (event) =>
{
    const trigger = event.target.closest("[data-open]");
    if (trigger)
    {
        openDetails(trigger.dataset.open, trigger);
    }
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) =>
{
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom))
    {
        dialog.close();
    }
});
dialog.addEventListener("close", () =>
{
    document.body.style.overflow = dialogOverflow;
    dialogContent.innerHTML = "";
    opener?.focus();
});
dialog.addEventListener("submit", (event) =>
{
    if (!event.target.matches(".contact-form"))
    {
        return;
    }
    event.preventDefault();
    const data = new FormData(event.target);
    const output = dialog.querySelector(".brief-output");
    output.textContent = `Your brief is ready — it has not been sent.\n\n${data.get("name")}\n${data.get("email")}\n${data.get("service")}\n\n${data.get("project")}\n\nYou can select and copy this summary. Nothing is saved after closing this panel.`;
    output.hidden = false;
    output.scrollIntoView({ block: "nearest", behavior: "smooth" });
});

// In-memory data URLs avoid the browser's speculative media range requests.
videos.forEach(async (video) =>
{
    try
    {
        const response = await fetch(video.dataset.source);
        if (!response.ok)
        {
            throw new Error(`Background video returned HTTP ${response.status}`);
        }
        const blob = await response.blob();
        const url = await new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), { once: true });
            reader.addEventListener("error", () => reject(reader.error), { once: true });
            reader.readAsDataURL(blob);
        });
        video.addEventListener("loadeddata", updatePlayback, { once: true });
        video.src = url;
    }
    catch (error)
    {
        console.error("Unable to load the specified background video:", error);
    }
});
updatePlayback();
