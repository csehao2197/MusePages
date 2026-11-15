const menu = document.querySelector("#menu");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    document.querySelector("nav").classList.toggle("open", expanded);
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    document.querySelector("nav").classList.remove("open");
}));
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelectorAll("[data-filter]").forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    let visible = 0;
    document.querySelectorAll(".project").forEach((project) =>
    {
        project.hidden = button.dataset.filter !== "all" && project.dataset.category !== button.dataset.filter;
        if (!project.hidden) visible++;
        if (project.hidden) project.querySelector("video")?.pause();
    });
    document.querySelector("#filter-status").textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}`;
}));
const reelDialog = document.querySelector("#reel-dialog");
const reel = document.querySelector("#reel");
const playReel = () =>
{
    reelDialog.showModal();
    if (!reel.getAttribute("src")) reel.src = reel.dataset.src;
    reel.currentTime = 0;
    reel.play().catch(() =>
    {
        reel.controls = true;
    });
};
document.querySelector("#play-reel").addEventListener("click", playReel);
reelDialog.addEventListener("close", () => reel.pause());
document.querySelectorAll("dialog .close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) =>
{
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
document.querySelectorAll(".project video").forEach((video) =>
{
    video.closest(".project").addEventListener("mouseenter", () =>
    {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        video.play().then(() => video.classList.add("playing")).catch(() => video.classList.remove("playing"));
    });
    video.closest(".project").addEventListener("mouseleave", () =>
    {
        video.pause();
        video.classList.remove("playing");
    });
});
const projects =
{
    kinetic: { title: "Kinetic Memory", category: "Motion Graphics", image: "hero", client: "2026 · Independent study", overview: "A meditation on connection: two metallic loops sharing a single orbit. The quiet movement gives a rigid material an unexpectedly soft character.", concept: "Linked sculpture, jewelry clasps and the slow rhythm of a mobile. Signed-distance torus shapes meet warm studio reflections." },
    milo: { title: "Milo, the wanderer", category: "Character Design", image: "character", client: "2026 · Personal character concept", overview: "A small companion with a big sense of curiosity. Rounded copper shapes and a simple illuminated visor make Milo feel approachable rather than mechanical.", concept: "Vintage space toys, soft industrial forms and the warmth of worn copper. A compact silhouette built from intersecting procedural volumes." },
    monolith: { title: "Quiet Monoliths", category: "Environment Art", image: "environment", client: "2026 · Independent spatial study", overview: "An architectural rhythm of staggered monoliths. The scene explores how a few repeated forms can imply scale, silence and a place worth discovering.", concept: "Basalt formations, minimalist sculpture and the changing height of a city skyline. Procedural boxes arranged along a measured sinusoidal rhythm." },
    forma: { title: "Forma — an object of calm", category: "Product Visualization", image: "product", client: "2026 · Fictional product concept", overview: "A tactile vessel rendered in quiet sage. The study considers how a familiar everyday object can feel deliberate through proportion and controlled highlights.", concept: "Apothecary bottles, soft stone and a warm daylight palette. Rounded cylindrical geometry contrasts with a precise square cap." },
    tension: { title: "A study in tension", category: "Personal Projects", image: "study", client: "2026 · Personal exploration", overview: "A second perspective on linked forms, finding moments where negative space feels as considered as the material around it.", concept: "A study in balance, weight and the expressive potential of a simple camera rotation." },
    soft: { title: "Soft / Solid", category: "Personal Projects", image: "motion", client: "2026 · Personal material study", overview: "A single, continuous surface that feels somewhere between polished metal and folded fabric. One primitive, many possible readings.", concept: "Inflated volumes, brushed brass and softbox reflections. A toroidal signed-distance field with a carefully composed orientation." }
};
const projectDialog = document.querySelector("#project-dialog");
const image = document.querySelector("#project-image");
const stageCaptions =
{
    final: "Final render — original ray-marched geometry, studio reflections and ambient shading.",
    clay: "Clay study — grayscale material visualization to inspect silhouette and volume.",
    structure: "Construction — reference grid overlay for proportion; not an exported polygon wireframe.",
    light: "Lighting test — high-contrast visualization of the reflection and shadow balance."
};
const setStage = (stage) =>
{
    document.querySelectorAll("[data-stage]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stage === stage)));
    image.style.filter = { final: "none", clay: "grayscale(1) brightness(1.4)", structure: "grayscale(1) contrast(.65)", light: "contrast(1.65) brightness(.8)" }[stage];
    document.querySelector("#construction-overlay").hidden = stage !== "structure";
    document.querySelector("#stage-caption").textContent = stageCaptions[stage];
};
document.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () =>
{
    const project = projects[button.dataset.project];
    document.querySelector("#project-title").textContent = project.title;
    document.querySelector("#project-category").textContent = project.category.toUpperCase();
    image.src = `assets/${project.image}.png`;
    image.alt = `${project.title} — original procedural render`;
    document.querySelector("#project-client").textContent = project.client;
    document.querySelector("#project-overview").textContent = project.overview;
    document.querySelector("#project-concept").textContent = project.concept;
    document.querySelector("#angle-caption").textContent = "Related form & camera studies";
    setStage("final");
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
}));
document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => setStage(button.dataset.stage)));
document.querySelectorAll("[data-angle]").forEach((button) => button.addEventListener("click", () =>
{
    image.src = `assets/${button.dataset.angle}.png`;
    image.alt = `Related ${button.dataset.angle} form and camera study`;
    document.querySelector("#angle-caption").textContent = `Viewing ${button.dataset.angle === "study" ? "second linked-form angle" : button.dataset.angle === "motion" ? "single torus material study" : "front linked-form angle"}`;
    setStage("final");
}));
document.querySelector("#project-reel").addEventListener("click", () =>
{
    projectDialog.close();
    playReel();
});
document.querySelector("#inquiry").addEventListener("click", () => document.querySelector("#contact-dialog").showModal());
document.querySelector("#inquiry-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    document.querySelector("#inquiry-status").textContent = `Preview ready: ${data.get("type")} inquiry from ${data.get("email")}. ${data.get("idea")} — Local demo only. Nothing has been sent or saved.`;
});
document.querySelector("#discord").addEventListener("click", () =>
{
    document.querySelector("#contact-dialog").showModal();
    document.querySelector("#inquiry-status").textContent = "This fictional portfolio has no live Discord community. Use this local inquiry preview to explore the contact flow.";
});
