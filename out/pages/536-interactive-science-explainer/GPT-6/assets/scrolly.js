export function mountScrolly(section, onStep)
{
    const figure = section.querySelector("[data-step]");
    const steps = [...section.querySelectorAll(".step")];
    const buttons = [...section.querySelectorAll("[data-select-step]")];
    function activate(index)
    {
        figure.dataset.step = String(index);
        steps.forEach((step, n) => step.dataset.active = String(n === index));
        buttons.forEach((button, n) =>
        {
            button.dataset.active = String(n === index);
            button.setAttribute("aria-pressed", String(n === index));
        });
        onStep(index);
    }
    const observer = new IntersectionObserver((entries) =>
    {
        const entered = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (entered.length) activate(steps.indexOf(entered[0].target));
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    steps.forEach((step) => observer.observe(step));
    buttons.forEach((button, index) => button.addEventListener("click", () => activate(index)));
    activate(0);
    return () => observer.disconnect();
}
