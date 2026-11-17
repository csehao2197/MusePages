import { content } from "../content.js";

export function earcupSvg()
{
    const c = content.earcup;
    return `<svg class="earcup-svg" viewBox="0 0 500 365" role="img" aria-label="${c.label}">
        <defs>
            <marker id="noise-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#1F7A7A"/></marker>
            <marker id="anti-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#E0654A"/></marker>
        </defs>
        <g stroke="#1B1E23" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M190 65C65 45 38 115 45 211C49 274 117 311 194 288" fill="#DADFD5"/>
            <path d="M177 77C82 65 51 121 58 213C61 265 112 292 186 279" stroke="#9CABA0"/>
            <path d="M368 106C410 95 414 124 410 147C435 153 423 179 414 183C420 208 404 229 390 242C381 260 360 248 365 231" stroke-width="2.2"/>
            <path d="M386 133C369 138 367 165 381 174C402 170 397 186 386 197C379 208 392 215 397 207"/>
        </g>
        <text x="368" y="279">${c.labels[4]}</text>
        <g data-part="0" stroke="#1B1E23" stroke-width="2" fill="none">
            <ellipse cx="207" cy="180" rx="66" ry="132" fill="#E9D8C5"/>
            <ellipse cx="214" cy="180" rx="44" ry="101" fill="#F6F2EA"/>
            <path d="M194 55C250 47 280 112 279 183C281 250 250 303 209 310" stroke="#8D8272" stroke-width="1"/>
            <path d="M238 71L295 36H329"/>
            <circle cx="339" cy="36" r="12" fill="#F6F2EA"/>
            <text x="335" y="40" stroke="none">1</text>
            <text x="295" y="16" stroke="none">${c.labels[0]}</text>
        </g>
        <g data-part="1" stroke="#1B1E23" fill="none" stroke-width="1.8">
            <rect x="78" y="89" width="30" height="20" rx="7" fill="#1F7A7A"/>
            <circle cx="93" cy="99" r="4" fill="#F6F2EA"/>
            <path d="M85 87L54 46H27"/>
            <circle cx="16" cy="46" r="12" fill="#F6F2EA"/>
            <text x="12" y="50" stroke="none">2</text>
            <text x="23" y="24" stroke="none">${c.labels[1]}</text>
            <path d="M8 133C18 119 28 146 39 130M8 162C20 148 27 175 40 160M8 190C20 176 28 202 40 188" stroke="#1F7A7A"/>
            <path d="M10 220H50" stroke="#1F7A7A" marker-end="url(#noise-arrow)"/>
            <text x="2" y="246" stroke="none">${c.labels[5]}</text>
        </g>
        <g data-part="2" stroke="#1B1E23" fill="none" stroke-width="1.8">
            <rect x="98" y="156" width="48" height="42" rx="2" fill="#F6F2EA"/>
            <rect x="109" y="165" width="25" height="24" fill="#1F7A7A"/>
            <path d="M94 99L122 115V154M103 161H91M103 171H91M103 182H91M103 192H91M145 161H157M145 172H157M145 183H157M145 193H157"/>
            <path d="M113 199V320H73"/>
            <circle cx="62" cy="320" r="12" fill="#F6F2EA"/>
            <text x="58" y="324" stroke="none">3</text>
            <text x="80" y="344" stroke="none">${c.labels[2]}</text>
        </g>
        <g data-part="3" stroke="#1B1E23" fill="none" stroke-width="1.8">
            <path d="M158 137L196 120V236L158 219Z" fill="#D6D9CD"/>
            <path d="M170 139L187 131V224L170 216Z" fill="#E0654A"/>
            <path d="M145 177H157M192 243L283 318H309"/>
            <circle cx="321" cy="318" r="12" fill="#F6F2EA"/>
            <text x="317" y="322" stroke="none">4</text>
            <text x="277" y="344" stroke="none">${c.labels[3]}</text>
            <path d="M221 162C242 145 252 180 274 162S307 179 326 162M221 194C242 177 252 212 274 194S307 211 326 194" stroke="#E0654A"/>
            <path d="M249 229H324" stroke="#E0654A" marker-end="url(#anti-arrow)"/>
            <text x="266" y="252" stroke="none">${c.labels[6]}</text>
        </g>
    </svg>`;
}

export function updateEarcup(section, index)
{
    section.querySelectorAll("[data-part]").forEach((part) =>
    {
        const n = Number(part.dataset.part);
        part.dataset.active = String(n <= index);
        part.dataset.current = String(n === index);
    });
}
