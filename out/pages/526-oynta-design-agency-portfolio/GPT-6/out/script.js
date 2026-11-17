const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const canvas = document.querySelector("#liquid");
const menu = document.querySelector("#mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const contactDialog = document.querySelector("#contact-dialog");
const caseDialog = document.querySelector("#case-dialog");
const socialDialog = document.querySelector("#social-dialog");
const dialogs = [menu, contactDialog, caseDialog, socialDialog];
let lastFocus;

function openDialog(dialog, trigger)
{
    const origin = trigger || document.activeElement;
    if (!origin.closest("dialog"))
    {
        lastFocus = origin;
    }
    dialogs.filter((item) => item.open).forEach((item) => item.close());
    dialog.showModal();
    document.body.classList.add("modal-open");
    menuToggle.setAttribute("aria-expanded", String(dialog === menu));
}

function closeDialog(dialog)
{
    dialog.close();
}

dialogs.forEach((dialog) =>
{
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab")
        {
            return;
        }
        const controls = [...dialog.querySelectorAll("button, a[href], input, select, textarea, [tabindex='0']")]
            .filter((control) => !control.disabled && control.getClientRects().length);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first?.focus();
        }
    });
    dialog.addEventListener("close", () =>
    {
        if (!dialogs.some((item) => item.open))
        {
            document.body.classList.remove("modal-open");
            menuToggle.setAttribute("aria-expanded", "false");
            lastFocus?.focus({ preventScroll: true });
        }
    });
    dialog.addEventListener("click", (event) =>
    {
        if (event.target !== dialog || dialog === menu)
        {
            return;
        }
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)
        {
            closeDialog(dialog);
        }
    });
    dialog.querySelectorAll(".dialog-close, .dialog-dismiss, .menu-close").forEach((button) =>
    {
        button.addEventListener("click", () => closeDialog(dialog));
    });
});
menuToggle.addEventListener("click", () => openDialog(menu, menuToggle));
menu.querySelectorAll('a[href^="#"]').forEach((link) =>
{
    link.addEventListener("click", () => closeDialog(menu));
});
document.querySelectorAll("[data-contact]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector('#project-form select[name="plan"]').value = button.dataset.plan || "Not sure yet";
        document.querySelector("#project-form").hidden = false;
        document.querySelector("#brief-result").hidden = true;
        openDialog(contactDialog, button);
    });
});
document.querySelectorAll("[data-social]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#social-title").textContent = `A little more on ${button.dataset.social}.`;
        openDialog(socialDialog, button);
    });
});

const projectForm = document.querySelector("#project-form");
let brief = "";
projectForm.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!projectForm.reportValidity())
    {
        return;
    }
    const fields = new FormData(projectForm);
    brief = [
        "OYNTA — YOUR PROJECT BRIEF",
        "",
        `Name: ${fields.get("name").trim()}`,
        `Email: ${fields.get("email").trim()}`,
        `Starting point: ${fields.get("plan")}`,
        "",
        "The idea:",
        fields.get("idea").trim(),
        "",
        "Created in a browser-only portfolio demo. Not submitted or stored."
    ].join("\n");
    document.querySelector("#brief-summary").textContent = `${fields.get("name").trim()}, your ${fields.get("plan")} brief is ready to download.`;
    projectForm.hidden = true;
    const result = document.querySelector("#brief-result");
    result.hidden = false;
    document.querySelector("#download-brief").focus();
});
document.querySelector("#edit-brief").addEventListener("click", () =>
{
    document.querySelector("#brief-result").hidden = true;
    projectForm.hidden = false;
    projectForm.elements.name.focus();
});
document.querySelector("#download-brief").addEventListener("click", () =>
{
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "oynta-project-brief.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const projects =
[
    {
        title: "Axion — A clearer view of tomorrow.",
        meta: "2026 · Tech · Web platform",
        image: "images/data.jpg",
        alt: "Analytics dashboard concept",
        challenge: "Help a complex analytics product communicate its value without overwhelming its users. Bring a fragmented visual identity and product experience into one clear language.",
        approach: "A discovery-led identity, an accessible information hierarchy, and a modular dashboard design system. We explored a deep-blue palette and confident typography to make the data the hero."
    },
    {
        title: "Forma — Not another ordinary thing.",
        meta: "2026 · Culture · Brand & digital",
        image: "images/abstract.jpg",
        alt: "Expressive sculptural forms",
        challenge: "Give an emerging creative platform a distinctive identity that can flex across culture, editorial, and digital experiences.",
        approach: "An expressive wordmark, sculptural art direction, and an immersive web concept. A flexible visual system gives every creative story room to breathe."
    },
    {
        title: "Nextfield — Built for what's next.",
        meta: "2026 · Innovation · Digital product",
        image: "images/workspace.jpg",
        alt: "A creative development workspace",
        challenge: "Make a new workspace tool feel immediately useful to ambitious makers, with a clear path from first visit to first idea.",
        approach: "A simplified onboarding journey, reusable product components, and a focused marketing experience. We balanced practical utility with a warm, human visual language."
    }
];
document.querySelectorAll("[data-case]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const project = projects[Number(button.dataset.case)];
        document.querySelector("#case-title").textContent = project.title;
        document.querySelector("#case-meta").textContent = project.meta;
        document.querySelector("#case-image").src = project.image;
        document.querySelector("#case-image").alt = project.alt;
        document.querySelector("#case-challenge").textContent = project.challenge;
        document.querySelector("#case-approach").textContent = project.approach;
        openDialog(caseDialog, button);
    });
});

const stack = document.querySelector(".project-stack");
const cards = [...document.querySelectorAll(".project-card")];
let currentProject = 0;
let pointerStart = null;
let pointerCard;
let dragged = false;

function renderProjects()
{
    cards.forEach((card, index) =>
    {
        const depth = (index - currentProject + cards.length) % cards.length;
        card.style.transform = `translateY(${-30 * depth}px) scale(${1 - depth * .05})`;
        card.style.zIndex = String(30 - depth);
        card.classList.toggle("front", depth === 0);
        card.setAttribute("aria-label", `${index + 1} of 3: ${projects[index].title}${depth ? ". Click exposed edge to bring to front." : ""}`);
        card.querySelector(".case-button").tabIndex = depth ? -1 : 0;
        card.querySelector(".case-button").setAttribute("aria-hidden", String(depth !== 0));
    });
    document.querySelector("#project-count").textContent = `${String(currentProject + 1).padStart(2, "0")} / 03`;
}

function cycleProjects(delta)
{
    currentProject = (currentProject + delta + cards.length) % cards.length;
    renderProjects();
}
document.querySelector("#next-project").addEventListener("click", () => cycleProjects(1));
document.querySelector("#previous-project").addEventListener("click", () => cycleProjects(-1));
stack.addEventListener("keydown", (event) =>
{
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
    {
        event.preventDefault();
        cycleProjects(event.key === "ArrowRight" ? 1 : -1);
    }
});
cards.forEach((card, index) =>
{
    card.addEventListener("click", (event) =>
    {
        if (dragged)
        {
            event.preventDefault();
            event.stopPropagation();
            dragged = false;
            return;
        }
        if (currentProject !== index)
        {
            currentProject = index;
            renderProjects();
        }
    }, true);
});
stack.addEventListener("pointerdown", (event) =>
{
    if (event.target.closest("button") || !event.target.closest(".front") || event.button !== 0)
    {
        return;
    }
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    pointerCard = cards[currentProject];
    dragged = false;
    stack.setPointerCapture(event.pointerId);
});
stack.addEventListener("pointermove", (event) =>
{
    if (!pointerStart)
    {
        return;
    }
    const delta = event.clientX - pointerStart.x;
    if (Math.abs(delta) > 8 && Math.abs(delta) > Math.abs(event.clientY - pointerStart.y))
    {
        dragged = true;
        pointerCard.classList.add("dragging");
        pointerCard.style.transform = `translateX(${delta * .65}px) rotate(${delta * .018}deg)`;
    }
});
function releasePointer(event)
{
    if (!pointerStart)
    {
        return;
    }
    const delta = event.clientX - pointerStart.x;
    const moved = dragged;
    pointerCard.classList.remove("dragging");
    if (event.type !== "pointercancel" && moved && Math.abs(delta) > 55)
    {
        cycleProjects(delta < 0 ? 1 : -1);
    }
    else
    {
        renderProjects();
    }
    if (stack.hasPointerCapture(pointerStart.id))
    {
        stack.releasePointerCapture(pointerStart.id);
    }
    pointerStart = null;
    setTimeout(() => dragged = false, 0);
}
stack.addEventListener("pointerup", releasePointer);
stack.addEventListener("pointercancel", releasePointer);
renderProjects();

document.querySelectorAll(".accordion details").forEach((details) =>
{
    details.addEventListener("toggle", () =>
    {
        if (details.open)
        {
            document.querySelectorAll(".accordion details").forEach((other) =>
            {
                if (other !== details)
                {
                    other.open = false;
                }
            });
        }
    });
});

function smoothTo(top)
{
    window.scrollTo({ top, behavior: reducedMotion.matches ? "instant" : "smooth" });
}
document.querySelector("#back-top").addEventListener("click", () => smoothTo(0));

const revealObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.documentElement.classList.add("js-motion");
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

let scrollFrame;
let interpolatedScroll = window.scrollY;
const masonry = document.querySelector(".masonry");
const footer = document.querySelector("footer");
function applyParallax()
{
    interpolatedScroll += (window.scrollY - interpolatedScroll) * .1;
    const scroll = reducedMotion.matches ? window.scrollY : interpolatedScroll;
    document.querySelector(".hero-content").style.transform = reducedMotion.matches ? "" : `translateY(${Math.min(scroll * .4, 400)}px)`;
    const box = masonry.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
    masonry.querySelectorAll("figure").forEach((figure, index) =>
    {
        figure.style.transform = reducedMotion.matches ? "" : `translateY(${progress * [15, -10, 20][index]}%)`;
    });
    const footerBox = footer.getBoundingClientRect();
    const footerProgress = Math.max(0, Math.min(1, (innerHeight - footerBox.top) / Math.min(footerBox.height, innerHeight)));
    document.querySelector(".footer-inner").style.transform = reducedMotion.matches ? "" : `translateY(${-30 * (1 - footerProgress)}%)`;
    scrollFrame = undefined;
    if (Math.abs(window.scrollY - interpolatedScroll) > .5 && !reducedMotion.matches)
    {
        scrollFrame = requestAnimationFrame(applyParallax);
    }
}
function scheduleParallax()
{
    if (!scrollFrame)
    {
        scrollFrame = requestAnimationFrame(applyParallax);
    }
}
window.addEventListener("scroll", scheduleParallax, { passive: true });
window.addEventListener("resize", scheduleParallax);
reducedMotion.addEventListener("change", scheduleParallax);
scheduleParallax();

// A self-contained shader keeps the static page independent of framework runtimes.
const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
if (gl)
{
    const vertexSource = `
        attribute vec2 position;
        void main()
        {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    const fragmentSource = `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;
        float hash(vec2 p)
        {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p)
        {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p)
        {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++)
            {
                value += amplitude * noise(p);
                p = p * 2.03 + 17.1;
                amplitude *= 0.5;
            }
            return value;
        }
        void main()
        {
            vec2 uv = gl_FragCoord.xy / resolution;
            vec2 p = uv * vec2(resolution.x / resolution.y, 1.0);
            float t = time * 0.065;
            vec2 q = vec2(fbm(p * 1.9 + t), fbm(p * 1.9 + vec2(4.1, 2.3) - t));
            vec2 r = vec2(fbm(p * 2.2 + q * 2.3 + vec2(1.7, 9.2) + t),
                fbm(p * 2.2 + q * 2.3 + vec2(8.3, 2.8) - t * 0.7));
            float warp = fbm(p * 2.0 + r * 2.6);
            float diagonal = p.x * 1.8 + p.y * 2.0 + warp * 2.1 + t;
            float streak = pow(0.5 + 0.5 * sin(diagonal * 9.0), 8.0);
            float ribbon = smoothstep(0.3, 0.85, warp + streak * 0.28);
            vec3 base = mix(vec3(0.04, 0.04, 0.06), vec3(0.12, 0.15, 0.22), warp * 1.25);
            vec3 color = mix(base, vec3(0.35, 0.35, 0.4), streak * ribbon * 0.78);
            float vignette = 1.0 - 0.32 * length(uv - vec2(0.5));
            gl_FragColor = vec4(color * vignette, 1.0);
        }
    `;
    function shader(type, source)
    {
        const compiled = gl.createShader(type);
        gl.shaderSource(compiled, source);
        gl.compileShader(compiled);
        if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS))
        {
            gl.deleteShader(compiled);
            return null;
        }
        return compiled;
    }
    const vertex = shader(gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
    if (vertex && fragment)
    {
        const program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            gl.useProgram(program);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
            const position = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            const resolution = gl.getUniformLocation(program, "resolution");
            const time = gl.getUniformLocation(program, "time");
            let visible = true;
            let animationFrame;
            function resizeShader()
            {
                const dpr = Math.min(devicePixelRatio || 1, 2);
                canvas.width = Math.round(hero.clientWidth * dpr);
                canvas.height = Math.round(hero.clientHeight * dpr);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            function draw(now = 0)
            {
                animationFrame = undefined;
                gl.uniform2f(resolution, canvas.width, canvas.height);
                gl.uniform1f(time, reducedMotion.matches ? 0 : now / 1000);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                if (visible && !document.hidden && !reducedMotion.matches)
                {
                    animationFrame = requestAnimationFrame(draw);
                }
            }
            function updateRendering()
            {
                if (animationFrame)
                {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = undefined;
                }
                if (visible && !document.hidden)
                {
                    draw(performance.now());
                }
                canvas.dataset.paused = String(!visible || document.hidden || reducedMotion.matches);
            }
            resizeShader();
            canvas.dataset.renderer = "webgl-domain-warp";
            const heroObserver = new IntersectionObserver(([entry]) =>
            {
                visible = entry.isIntersecting;
                updateRendering();
            });
            heroObserver.observe(hero);
            window.addEventListener("resize", () =>
            {
                resizeShader();
                updateRendering();
            });
            document.addEventListener("visibilitychange", updateRendering);
            reducedMotion.addEventListener("change", updateRendering);
            updateRendering();
        }
    }
}
else
{
    canvas.dataset.renderer = "css-fallback";
}
