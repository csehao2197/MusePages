const video = document.querySelector("#backdrop");
let prevX;
let targetTime = 0;
let seeking = false;
const sensitivity = .8;
function seek()
{
    if (seeking || !Number.isFinite(video.duration) || Math.abs(video.currentTime - targetTime) < .025)
    {
        return;
    }
    seeking = true;
    video.currentTime = targetTime;
}
function scrub(x)
{
    if (prevX !== undefined && Number.isFinite(video.duration))
    {
        targetTime = Math.max(0, Math.min(video.duration, targetTime + ((x - prevX) / innerWidth) * sensitivity * video.duration));
        seek();
    }
    prevX = x;
}
window.addEventListener("mousemove", (event) => scrub(event.clientX));
document.querySelector("main").addEventListener("touchstart", (event) =>
{
    prevX = event.touches[0].clientX;
}, { passive: true });
document.querySelector("main").addEventListener("touchmove", (event) => scrub(event.touches[0].clientX), { passive: true });
video.addEventListener("seeked", () =>
{
    seeking = false;
    seek();
});
const greeting = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
const typed = document.querySelector("#typed");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function completeTyping()
{
    typed.textContent = greeting;
    document.querySelector(".cursor").hidden = true;
    typed.dataset.done = "true";
}
if (reducedMotion.matches)
{
    completeTyping();
}
else
{
    setTimeout(() =>
    {
        let position = 0;
        const interval = setInterval(() =>
        {
            typed.textContent = greeting.slice(0, ++position);
            if (position >= greeting.length)
            {
                clearInterval(interval);
                completeTyping();
            }
        }, 38);
    }, 600);
}
setTimeout(() => document.querySelector(".actions").classList.add("ready"), 400);
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-menu");
function setMenu(open, restoreFocus = true)
{
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    menu.inert = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open)
    {
        menu.querySelector("button").focus();
    }
    else if (restoreFocus)
    {
        menuToggle.focus();
    }
}
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
menu.querySelector("a").addEventListener("click", () => setMenu(false));
matchMedia("(min-width: 768px)").addEventListener("change", (event) =>
{
    if (event.matches)
    {
        setMenu(false, false);
    }
});
document.addEventListener("keydown", (event) =>
{
    if (menuToggle.getAttribute("aria-expanded") !== "true")
    {
        return;
    }
    if (event.key === "Escape")
    {
        setMenu(false);
    }
    if (event.key === "Tab")
    {
        const focusables = [menuToggle, ...menu.querySelectorAll("button, a")];
        const index = focusables.indexOf(document.activeElement);
        const next = (index + (event.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
        event.preventDefault();
        focusables[next].focus();
    }
});
const details =
{
    labs:
    {
        title: "Curiosity, in progress.",
        body: "<p>Our concept lab explores adaptive interfaces, identity in motion, and new ways to tell a story.</p><p>Try this one: move your pointer left and right, or swipe the background on your phone. You're controlling time, not playing a loop.</p><p>This is a portfolio concept, not a live agency service. A.R.I.A is a scripted interface, not an AI assistant.</p>"
    },
    studio:
    {
        title: "A little method.<br>A lot of possibility.",
        body: "<ol><li><strong>Find the real question.</strong><br>Start with people, context, and the thing worth changing.</li><li><strong>Make it tangible.</strong><br>Turn strategy into identity, interfaces, and prototypes.</li><li><strong>Build, test, repeat.</strong><br>Good taste meets useful feedback. Then we refine.</li></ol><p>Illustrative studio approach for this independent concept.</p>"
    },
    openings:
    {
        title: "Good minds welcome.",
        body: "<p>Designers. Developers. Strategists. People who ask better questions.</p><p>This concept site has no verified open roles and accepts no applications. If you're exploring a collaboration, prepare a short introduction instead.</p><button class=\"submit\" data-next=\"hello\">Introduce yourself</button>"
    },
    shop:
    {
        title: "Not everything needs<br>to be for sale.",
        body: "<p>The Mainframe shop is an editorial concept. There are no products, payments, or checkout on this site.</p><p>Have an idea for something worth making? We'd rather start with a conversation.</p><button class=\"submit\" data-next=\"pitch\">Share an idea</button>"
    }
};
const dialog = document.querySelector("dialog");
let returnFocus;
function showPanel(key, trigger)
{
    if (menuToggle.getAttribute("aria-expanded") === "true")
    {
        setMenu(false);
        trigger = menuToggle;
    }
    returnFocus = trigger || returnFocus;
    const contact = key === "pitch" || key === "hello";
    const title = contact ? (key === "pitch" ? "Let's build something." : "Start with a hello.") : details[key].title;
    document.querySelector("#detail-title").innerHTML = title;
    document.querySelector(".detail-body").innerHTML = contact ?
        `<p>Make the first move. This browser-only form prepares an email draft; nothing is sent or stored here.</p><form><label>Your name<input name="name" autocomplete="name" required maxlength="100"></label><label>Your email<input name="email" autocomplete="email" type="email" required maxlength="200"></label><label>${key === "pitch" ? "What are we building?" : "Your introduction"}<textarea name="message" required maxlength="3000"></textarea></label><button class="submit" type="submit">Prepare email draft</button><p class="draft-output" role="status"></p></form>` :
        details[key].body;
    if (!dialog.open)
    {
        dialog.showModal();
    }
    document.body.style.overflow = "hidden";
    const form = dialog.querySelector("form");
    form?.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const data = new FormData(form);
        const subject = key === "pitch" ? "An idea for Mainframe" : "Hello, Mainframe";
        const message = `${data.get("name")} (${data.get("email")})\n\n${data.get("message")}`;
        const output = form.querySelector(".draft-output");
        output.textContent = "Your draft is ready. It has not been sent. ";
        const link = document.createElement("a");
        link.href = `mailto:hello@mainframe.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        link.textContent = "Open in your email app";
        output.append(link);
    });
    dialog.querySelector("[data-next]")?.addEventListener("click", (event) => showPanel(event.currentTarget.dataset.next));
}
document.querySelectorAll("[data-panel]").forEach((button) =>
{
    button.addEventListener("click", () => showPanel(button.dataset.panel, button));
});
document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
{
    document.body.style.overflow = "";
    returnFocus?.focus({ preventScroll: true });
});
document.querySelector("#copy-email").addEventListener("click", async () =>
{
    const status = document.querySelector(".feedback");
    try
    {
        await navigator.clipboard.writeText("hello@mainframe.co");
        status.textContent = "Email copied. Say hello when you're ready.";
    }
    catch
    {
        status.textContent = "Copy unavailable. Select the address: hello@mainframe.co";
    }
});
