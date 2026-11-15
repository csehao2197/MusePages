function updateClock()
{
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
    document.querySelectorAll(".london-clock").forEach((clock) => clock.textContent = `${time} in London`);
}
updateClock();
setInterval(updateClock, 1000);
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
function closeMenu()
{
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () =>
{
    menu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.querySelector("#menu-close").focus();
});
document.querySelector("#menu-close").addEventListener("click", closeMenu);
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
menu.addEventListener("click", (event) =>
{
    if (event.target === menu) closeMenu();
});
const panels =
{
    studio: ["A focused team. A shared ambition.", "<p>We connect research, brand thinking and digital craft. Our process moves from discovery and clear positioning to prototypes, purposeful interfaces and considered delivery.</p>"],
    journal: ["Notes from the studio.", "<p><strong>Clarity is a competitive advantage</strong><br>The strongest digital experiences make one clear promise, then fulfil it with every interaction.</p><hr><p><strong>Start with the difficult question</strong><br>Before designing the interface, agree on what success should feel like for the person using it.</p>"],
    contact: ["Let’s make your next move.", "<p>Share your ambition, scope and timing at <strong>hello@axion.example</strong>. This portfolio has no connected inbox or project submission backend.</p>"],
    partner: ["A concept, clearly labelled.", "<p>The Certified Partner and Featured badges reproduce content from the design brief. They are illustrative, not independently verified certifications or endorsements.</p>"],
    narrativ: ["Narrativ — a story in motion.", "<p><strong>Scope:</strong> Art direction, interaction design, creative development.</p><p>An original 3D-inspired editorial world turns a portfolio into an invitation to explore. The award statement is illustrative brief content rather than a verified award.</p>"],
    luminar: ["Luminar — clarity at every step.", "<p><strong>Scope:</strong> Brand strategy, UX architecture, interface design.</p><p>A focused content system and considered navigation transform a dated platform into a clear, confident brand experience. This is a concept case study.</p>"],
    call: ["A good place to start.", "<p>Choose a discussion focus to preview a strategy call. This is a local planning tool, not a calendar booking.</p><label>Discussion focus<select id='call-focus'><option>Brand strategy</option><option>Website redesign</option><option>New product launch</option></select></label><button class='button orange' id='plan-call'>Preview call agenda <span class='arrow'>→</span></button><p id='call-result' role='status'></p>"]
};
const dialog = document.querySelector("dialog");
document.querySelectorAll("[data-panel]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, content] = panels[button.dataset.panel];
    document.querySelector("#panel-title").textContent = title;
    document.querySelector("#panel-content").innerHTML = content;
    closeMenu();
    dialog.showModal();
    document.querySelector("#plan-call")?.addEventListener("click", () =>
    {
        const focus = document.querySelector("#call-focus").value;
        document.querySelector("#call-result").textContent = `${focus}: goals, audience, challenges and next steps. Suggested duration: 30 minutes. No booking has been made.`;
    });
}));
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape") closeMenu();
});
document.querySelector("#pause-art").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "Play flow ▷" : "Pause flow Ⅱ";
});
