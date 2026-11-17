const panel = document.querySelector("#panel");
const title = document.querySelector("#panel-title");
const content = document.querySelector("#panel-content");
const video = document.querySelector("video");
let trigger;
const caseStudies = [
    ["Frame Blox", "A clearer point of view.", "An architectural identity built around a simple framing device. Strategy, wordmark, and an adaptable visual system.", "Architecture / Identity"],
    ["Supa Blox", "Everyday, with extra energy.", "A bold concept for a new generation of everyday essentials. A rhythmic symbol and confident voice make the ordinary memorable.", "Lifestyle / Brand strategy"],
    ["Hype Blox", "Made to stand out.", "A directional identity for an independent culture platform. Sharp shapes and a stripped-back palette put the story first.", "Culture / Art direction"],
    ["Hype Blox", "Many voices. One signal.", "An alternative brand exploration: a modular cross becomes a shared visual language across community touchpoints.", "Community / Visual system"],
    ["Ultra Blox", "Less noise. More meaning.", "A circular mark anchors a considered wellness identity. Clear positioning and a quiet visual system bring clarity to the category.", "Wellness / Positioning"],
    ["Ship Blox", "Ideas, moving forward.", "A forward-facing concept for a logistics studio. A nimble mark and practical guidelines keep every touchpoint on course.", "Logistics / Guidelines"]
];
const panels = {
    about: ["GOOD BRANDS START WITH GOOD QUESTIONS.", "<p>Brandly is an independent design studio combining thoughtful strategy with expressive design. We work closely with ambitious founders to find what makes their business matter.</p><p>Small teams. Direct conversations. A shared commitment to doing the right work.</p><button class='panel-action' data-panel='brief'>Tell us your story</button>"],
    features: ["FROM FIRST SPARK TO FINAL REVEAL.", "<ol><li><strong>Discover:</strong> audience, ambition, and a clear brand position.</li><li><strong>Define:</strong> naming, voice, and the story only you can tell.</li><li><strong>Design:</strong> identity, typography, color, and art direction.</li><li><strong>Launch:</strong> practical guidelines and ready-to-use brand assets.</li></ol><button class='panel-action' data-panel='brief'>Explore your project</button>"],
    pricing: ["A SCOPE THAT FITS YOUR AMBITION.", "<p>Illustrative studio packages, not binding offers:</p><p><strong>Identity essentials — from $3,000</strong><br>Wordmark, palette, typography, and a starter guide. Typically 3–4 weeks.</p><p><strong>Complete brand — from $6,000</strong><br>Strategy, full identity, voice, and launch toolkit. Typically 6–8 weeks.</p><button class='panel-action' data-panel='brief'>Build a project brief</button>"],
    faq: ["A FEW GOOD QUESTIONS.", "<details><summary>Can you help with a brand refresh?</summary><p>Yes. We start by identifying what already works, then evolve your positioning and identity with intention.</p></details><details><summary>What do I need to get started?</summary><p>A short description of your business, your goals, and a rough timeline. Our project planner can help you organize these.</p></details><details><summary>How do we work together?</summary><p>Discovery, shared creative direction, considered feedback, and clear handover. This homepage is a static studio concept, not an active client service.</p></details>"],
    help: ["LET'S FIND YOUR NEXT STEP.", "<p>For a new identity or a refresh, use our project planner. For scope and timing, explore the package guide or FAQ.</p><button class='panel-action' data-panel='brief'>Open project planner</button><button class='service' data-panel='faq'>Read FAQ</button><p>This is a browser-only demonstration. No inquiries are transmitted.</p>"],
    signup: ["GOOD TO MEET YOU.", "<p>Client registration is disabled in this static showcase. We do not collect personal information or create accounts.</p><p>You can explore a project without registering.</p><button class='panel-action' data-panel='brief'>Plan a project instead</button>"],
    login: ["YOUR WORK, IN ONE PLACE.", "<p>The client portal is not connected in this static showcase. Sign-in is disabled; do not enter passwords or credentials.</p><button class='panel-action' data-panel='features'>Explore the studio process</button>"],
    facebook: ["THE BRANDLY COMMUNITY.", "<p>Our Facebook channel concept is a place for studio news, new launches, and conversations about brands that matter.</p><p>No verified social account is supplied by the brief, so this demo does not link to an unrelated profile.</p>"],
    instagram: ["A LOOK INSIDE THE STUDIO.", "<p>Our Instagram channel concept brings together visual experiments, identity details, and the thinking behind the work.</p><p>No verified social account is supplied by the brief. Explore a local brand concept instead.</p><button class='panel-action' data-brand='0'>Explore Frame Blox</button>"],
    youtube: ["THE THINKING BEHIND THE WORK.", "<p>Our YouTube channel concept covers discovery, creative direction, and turning a brand idea into a visual system.</p><p>No verified video channel is supplied by the brief.</p><button class='panel-action' data-panel='features'>Explore our process</button>"]
};
function openPanel(key, origin)
{
    if (!panel.open)
    {
        trigger = origin;
    }
    if (key === "brief")
    {
        title.textContent = "LET'S BUILD SOMETHING THAT MATTERS.";
        content.innerHTML = "<p>Build an illustrative project plan. Everything stays in this panel; no data is saved or sent.</p><form id='brief-form'><label>Choose your scope</label><div><button class='service' type='button' data-scope='identity' aria-pressed='true'>Identity essentials</button><button class='service' type='button' data-scope='complete' aria-pressed='false'>Complete brand</button></div><p class='estimate' aria-live='polite'>From $3,000 · 3–4 weeks · Identity toolkit</p><label for='project'>Describe your brand in a sentence</label><input id='project' required maxlength='160' placeholder='An independent coffee brand with a fresh point of view'><label for='timing'>Your launch timeline</label><select id='timing'><option>Within 3 months</option><option>Within 6 months</option><option>Just exploring</option></select><p><button class='panel-action' type='submit'>Create my project plan</button></p><div id='plan-result' role='status'></div></form>";
        let scope = "identity";
        content.querySelectorAll("[data-scope]").forEach((button) =>
        {
            button.addEventListener("click", () =>
            {
                scope = button.dataset.scope;
                content.querySelectorAll("[data-scope]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
                content.querySelector(".estimate").textContent = scope === "identity" ? "From $3,000 · 3–4 weeks · Identity toolkit" : "From $6,000 · 6–8 weeks · Strategy + identity + launch toolkit";
                content.querySelector("#plan-result").replaceChildren();
            });
        });
        content.querySelector("form").addEventListener("submit", (event) =>
        {
            event.preventDefault();
            const project = content.querySelector("#project").value.trim();
            if (!project)
            {
                content.querySelector("#project").setCustomValidity("Please describe your brand.");
                content.querySelector("#project").reportValidity();
                return;
            }
            const result = content.querySelector("#plan-result");
            result.className = "result";
            result.textContent = `Your plan: ${project} — ${scope === "identity" ? "Identity essentials, from $3,000 (3–4 weeks)" : "Complete brand, from $6,000 (6–8 weeks)"}. Timeline: ${content.querySelector("#timing").value}. Next step: clarify your audience and three brand goals. Demo only: this plan has not been submitted.`;
        });
        content.querySelector("#project").addEventListener("input", (event) => event.target.setCustomValidity(""));
    }
    else if (key === "menu")
    {
        title.textContent = "EXPLORE BRANDLY.";
        content.innerHTML = "<div class='menu-links'>" + ["About", "Features", "Pricing", "FAQ", "Help"].map((item) => `<button data-panel='${item.toLowerCase()}'>${item}</button>`).join("") + "</div>";
    }
    else
    {
        const value = panels[key];
        title.textContent = value[0];
        content.innerHTML = value[1];
    }
    if (!panel.open)
    {
        panel.showModal();
    }
    content.scrollTop = 0;
    document.querySelector("#close-panel").focus();
}
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-panel], [data-brand]");
    if (!button)
    {
        return;
    }
    if (button.dataset.brand !== undefined)
    {
        const study = caseStudies[Number(button.dataset.brand)];
        panels.case = [study[0], `<p class='eyebrow'>${study[3]}</p><p><strong>${study[1]}</strong></p><p>${study[2]}</p><p>Illustrative portfolio concept, not a verified client engagement.</p><button class='panel-action' data-panel='brief'>Build a brand like this</button>`];
        openPanel("case", button);
    }
    else
    {
        openPanel(button.dataset.panel, button);
    }
});
document.querySelector("#close-panel").addEventListener("click", () => panel.close());
panel.addEventListener("close", () => trigger?.focus());
panel.addEventListener("click", (event) =>
{
    if (event.target === panel)
    {
        const bounds = panel.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        {
            panel.close();
        }
    }
});
const motion = document.querySelector("#motion");
function motionLabel()
{
    motion.querySelector("span").textContent = video.paused ? "Play background" : "Pause background";
    motion.setAttribute("aria-pressed", String(video.paused));
}
motion.addEventListener("click", async () =>
{
    if (video.paused)
    {
        await video.play().catch(() => {});
    }
    else
    {
        video.pause();
    }
    motionLabel();
});
video.addEventListener("play", motionLabel);
video.addEventListener("pause", motionLabel);
if (matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    video.autoplay = false;
    video.pause();
    motionLabel();
}
