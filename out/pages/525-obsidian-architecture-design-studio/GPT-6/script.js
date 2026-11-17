const menu = document.querySelector("#navigation-menu");
const detail = document.querySelector("#detail-panel");
const toggle = document.querySelector("#menu-toggle");
const body = document.querySelector("#panel-body");
const film = document.querySelector(".film");
const filmButton = document.querySelector(".film-toggle");
let opener;

const panels =
{
    work: `<h2 id="panel-title">Selected perspectives.</h2><p>Two studies in material, light, and the spaces between. Explore the ideas behind the forms.</p><div class="work-list"><button data-panel="craft">CRAFT<small>Spaces shaped with intention.</small></button><button data-panel="arcvault">ARCVAULT<small>Form in Stone</small></button></div><p class="note">An architectural concept showcase. Project notes are illustrative, not claims of commissioned work.</p>`,
    craft: `<h2 id="panel-title">Spaces shaped with intention.</h2><p>CRAFT explores the relationship between monumental concrete and human scale. A quiet sequence of thresholds turns mass into shelter, and daylight into a material of its own.</p><dl class="project-facts"><div><dt>Study</dt><dd>Concrete &amp; daylight</dd></div><div><dt>Approach</dt><dd>Purposeful thresholds</dd></div></dl><button class="projects-button" data-panel="work">Back to projects</button><p class="note">Illustrative concept notes for the supplied visual.</p>`,
    arcvault: `<h2 id="panel-title">Form in Stone.</h2><p>ARCVAULT is a study of the arch: its weight, its rhythm, and the stillness it creates. Solid forms frame a generous void, allowing light to reveal the texture of stone.</p><dl class="project-facts"><div><dt>Study</dt><dd>Stone &amp; structure</dd></div><div><dt>Approach</dt><dd>Sculpted negative space</dd></div></dl><button class="projects-button" data-panel="work">Back to projects</button><p class="note">Illustrative concept notes for the supplied visual.</p>`,
    studio: `<h2 id="panel-title">Built around intention.</h2><p>Obsidian is an architectural studio concept devoted to bold forms and enduring spaces. Our design language begins with material honesty, thoughtful proportions, and the movement of light.</p><dl class="project-facts"><div><dt>01 / Material</dt><dd>Let texture speak.</dd></div><div><dt>02 / Purpose</dt><dd>Give every form a reason.</dd></div></dl><button class="projects-button" data-panel="connect">Start a conversation</button><p class="note">Independent studio landing-page demonstration. No real consultancy or commission is represented.</p><p class="note">Typeface: <a href="https://www.onlinewebfonts.com/fonts" target="_blank" rel="noopener noreferrer">Web Fonts</a>, attributed by the font provider under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Prompt: © 2026 Nomaan Khan, MIT.</p>`,
    connect: `<h2 id="panel-title">A space starts with an idea.</h2><p>Write a short brief to explore your next space. This demo prepares text locally; nothing is sent or saved.</p><form id="brief-form"><label>Your name<input name="name" autocomplete="name" required maxlength="80"></label><label>Your idea<textarea name="idea" required maxlength="1000" placeholder="A place, a purpose, a possibility…"></textarea></label><button class="projects-button" type="submit">Prepare brief</button><p class="note" id="brief-status" role="status"></p></form>`,
    enter: `<h2 id="panel-title">The studio, open.</h2><p>This static showcase has no client portal, sign-in, or private project storage. Explore the public project studies or prepare a local brief instead.</p><div class="work-list"><button data-panel="work">Explore work<small>Two architectural studies</small></button><button data-panel="connect">Prepare a brief<small>No account needed</small></button></div>`
};

function closeMenu()
{
    menu.close();
    toggle.setAttribute("aria-expanded", "false");
}

function openPanel(name)
{
    if (!Object.hasOwn(panels, name))
    {
        return;
    }
    if (!detail.open)
    {
        opener = document.activeElement;
    }
    if (menu.open)
    {
        closeMenu();
        opener = toggle;
    }
    body.innerHTML = panels[name];
    if (!detail.open)
    {
        detail.showModal();
    }
    detail.querySelector("[data-close]").focus();
}

toggle.addEventListener("click", () =>
{
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
    menu.querySelector("[data-close]").focus();
});

menu.addEventListener("close", () =>
{
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
});

detail.addEventListener("close", () =>
{
    if (opener?.isConnected)
    {
        opener.focus();
    }
});

document.addEventListener("click", (event) =>
{
    const panel = event.target.closest("[data-panel]");
    if (panel)
    {
        openPanel(panel.dataset.panel);
    }
    const close = event.target.closest("[data-close]");
    if (close?.dataset.close === "menu")
    {
        closeMenu();
    }
    if (close?.dataset.close === "detail")
    {
        detail.close();
    }
});

document.addEventListener("submit", (event) =>
{
    if (event.target.id !== "brief-form")
    {
        return;
    }
    event.preventDefault();
    const values = new FormData(event.target);
    const status = document.querySelector("#brief-status");
    status.textContent = `Brief prepared for ${values.get("name").trim()}: ${values.get("idea").trim()} — local preview only; not sent or stored.`;
});

document.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab")
    {
        return;
    }
    const activeDialog = detail.open ? detail : menu.open ? menu : null;
    if (!activeDialog)
    {
        return;
    }
    const focusable = [...activeDialog.querySelectorAll("button, a[href], input, textarea")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first)
    {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
        event.preventDefault();
        first.focus();
    }
});

function updateFilmControl()
{
    const paused = film.paused;
    filmButton.setAttribute("aria-label", paused ? "Play background film" : "Pause background film");
    filmButton.innerHTML = `${paused ? "▷" : "Ⅱ"} <span>${paused ? "Play film" : "Pause film"}</span>`;
}

film.addEventListener("play", updateFilmControl);
film.addEventListener("pause", updateFilmControl);
filmButton.addEventListener("click", async () =>
{
    if (film.paused)
    {
        await film.play();
    }
    else
    {
        film.pause();
    }
    updateFilmControl();
});

if (matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    film.autoplay = false;
    film.pause();
    updateFilmControl();
    film.addEventListener("loadeddata", () =>
    {
        film.pause();
        updateFilmControl();
    }, { once: true });
}
