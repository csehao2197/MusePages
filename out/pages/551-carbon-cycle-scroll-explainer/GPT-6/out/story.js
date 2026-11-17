import { content as c } from "./content.js";

export function startStory(flows, motionQuery)
{
    const steps = [...document.querySelectorAll("[data-step]")];
    const svg = document.querySelector("#scene-svg");
    const gauge = document.querySelector("#gauge");
    const mobile = matchMedia("(max-width: 767px)");
    const camera = [...c.cameras[0]];
    let target = [...camera];
    let cameraFrame = 0;
    let scheduled = false;
    const clamp = (v) => Math.max(0, Math.min(1, v));

    function cameraTick()
    {
        let unsettled = false;
        camera.forEach((v, i) =>
        {
            camera[i] += (target[i] - v) * .11;
            if (Math.abs(camera[i] - target[i]) > .25) unsettled = true;
        });
        svg.setAttribute("viewBox", camera.map((v) => v.toFixed(2)).join(" "));
        if (unsettled) cameraFrame = requestAnimationFrame(cameraTick);
        else cameraFrame = 0;
    }
    function update()
    {
        scheduled = false;
        const vh = innerHeight;
        const threshold = vh * (mobile.matches ? .68 : .6);
        const boxes = steps.map((step) => step.getBoundingClientRect());
        let active = boxes.findIndex((box) => box.top <= threshold && box.bottom > threshold);
        if (active < 0) active = boxes[0].top > threshold ? 0 : 6;
        svg.dataset.activeStep = String(active);
        steps.forEach((step, i) => step.classList.toggle("active", i === active));
        gauge.hidden = active === 0;
        const reservoir = active ? c.steps[active - 1].reservoir : -1;
        document.querySelectorAll(".gauge-row").forEach((row, i) => row.classList.toggle("active", i === reservoir));
        document.querySelectorAll(".reservoir-outline").forEach((outline, i) => outline.setAttribute("opacity", String(i === reservoir ? .65 : 0)));
        if (motionQuery.matches || mobile.matches)
        {
            target = [...c.cameras[active]];
            cancelAnimationFrame(cameraFrame);
            cameraFrame = 0;
            svg.setAttribute("viewBox", target.join(" "));
            camera.splice(0, 4, ...target);
        }
        else
        {
            const fraction = clamp((threshold - boxes[active].top) / boxes[active].height);
            const previousCamera = c.cameras[Math.max(0, active - 1)];
            target = c.cameras[active].map((v, i) => previousCamera[i] + (v - previousCamera[i]) * Math.min(1, fraction * 2));
            if (!cameraFrame) cameraFrame = requestAnimationFrame(cameraTick);
        }
        const industry = motionQuery.matches ? 1 : clamp((threshold - boxes[5].top) / (boxes[5].height * .72));
        const imbalance = motionQuery.matches ? 1 : clamp((threshold - boxes[6].top) / (boxes[6].height * .72));
        flows.setIndustry(industry);
        document.querySelector("#counter-5").textContent = String(Math.round(c.steps[4].from + industry * (c.steps[4].to - c.steps[4].from)));
        document.querySelector("#counter-6").textContent = String(Math.round(c.steps[5].from + imbalance * (c.steps[5].to - c.steps[5].from)));
        document.querySelector(".sky-imbalance").setAttribute("opacity", String(imbalance * .2));
        document.querySelector("#header").classList.toggle("scrolled", scrollY > 80);
    }
    function schedule()
    {
        if (!scheduled)
        {
            scheduled = true;
            requestAnimationFrame(update);
        }
    }
    addEventListener("scroll", schedule, {passive: true});
    addEventListener("resize", schedule);
    motionQuery.addEventListener("change", schedule);
    mobile.addEventListener("change", schedule);
    new IntersectionObserver(([entry], observer) =>
    {
        if (entry.isIntersecting)
        {
            document.querySelector("#ledger").classList.add("seen");
            observer.disconnect();
        }
    }, {threshold: .12}).observe(document.querySelector("#ledger"));
    update();
}
