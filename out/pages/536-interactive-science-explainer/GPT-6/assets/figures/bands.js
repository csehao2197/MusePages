import { content } from "../content.js";

export function bandsSvg()
{
    const c = content.limits;
    const ticks = [0, 10, 20, 30].map((tick) =>
    {
        const y = 270 - tick * 7;
        return `<path d="M42 ${y}H770" stroke="#CDCBC0" stroke-width="1"/><text x="12" y="${y + 4}">${tick}</text>`;
    }).join("");
    const bars = c.bands.map((band, index) =>
    {
        const x = 86 + index * 139;
        return `<g data-band="${index}" data-active="true">
            <rect x="${x}" y="${270 - band.active * 7}" width="34" height="${band.active * 7}" fill="#1F7A7A"/>
            <rect x="${x + 39}" y="${270 - band.passive * 7}" width="34" height="${band.passive * 7}" fill="#E0654A"/>
            <text x="${x + 10}" y="296">${band.hz.toLocaleString("en-US")}</text>
        </g>`;
    }).join("");
    return `<svg class="bands-svg" viewBox="0 0 800 340" role="img" aria-label="${c.label}" data-state="hidden">
        <text x="42" y="25">${c.axis}</text>${ticks}${bars}<text x="335" y="333">${c.frequency}</text>
    </svg>`;
}

export function mountBands(section)
{
    const svg = section.querySelector(".bands-svg");
    const observer = new IntersectionObserver((entries) =>
    {
        if (entries[0].isIntersecting)
        {
            svg.dataset.state = "visible";
            observer.disconnect();
        }
    });
    observer.observe(svg);
    const buttons = [...section.querySelectorAll("[data-select-band]")];
    const bars = [...svg.querySelectorAll("[data-band]")];
    function select(index)
    {
        const band = content.limits.bands[index];
        section.dataset.band = String(index);
        buttons.forEach((button, n) =>
        {
            button.dataset.active = String(n === index);
            button.setAttribute("aria-pressed", String(n === index));
        });
        bars.forEach((bar, n) => bar.dataset.active = String(n === index));
        section.querySelector("#band-explanation").textContent = band.text;
        section.querySelector("#band-stats").textContent = `${content.limits.legend[0]}: ${band.active} ${content.limits.db} · ${content.limits.legend[1]}: ${band.passive} ${content.limits.db}`;
    }
    buttons.forEach((button, index) => button.addEventListener("click", () => select(index)));
    select(0);
    return () => observer.disconnect();
}
