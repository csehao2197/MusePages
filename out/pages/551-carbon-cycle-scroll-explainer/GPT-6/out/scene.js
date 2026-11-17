import { content as c } from "./content.js";

const scenery = () => `
    <defs>
        <linearGradient id="sky" x2="0" y2="1"><stop stop-color="var(--indigo)"/><stop offset=".66" stop-color="var(--violet)"/><stop offset="1" stop-color="var(--ember)"/></linearGradient>
        <linearGradient id="depth" x2="0" y2="1"><stop stop-color="var(--teal)"/><stop offset="1" stop-color="var(--abyss)"/></linearGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter>
        <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <symbol id="landscape" viewBox="0 0 1600 1000">
            <rect width="1600" height="530" fill="url(#sky)"/>
            <circle cx="1190" cy="470" r="70" fill="var(--orange)" stroke="var(--ember)" stroke-width="10"/>
            <g fill="var(--cloud)"><path d="M100 140q45-40 100 0q50-20 90 10H90Z"/><path d="M870 90q55-45 120 0q70-15 100 15H840Z"/><path d="M1310 280q35-35 90 0q55-20 100 15h-215Z"/></g>
            <path d="M0 530L140 420 270 250 420 420 525 490 840 540V770H0Z" fill="var(--forest-dark)"/>
            <path d="M204 337L270 250 340 345 284 317 253 333 240 315Z" fill="var(--mist)"/>
            <path d="M0 510Q200 420 390 470T840 535V770H0Z" fill="var(--forest)"/>
            <path d="M0 590Q280 510 570 580T860 615V770H0Z" fill="var(--forest-dark)"/>
            <g>${Array.from({length: 18}, (_, i) =>
            {
                const x = 440 + (i % 9) * 37;
                const y = 462 + Math.floor(i / 9) * 61 + Math.sin(i * 2) * 12;
                const h = 40 + (i * 17) % 51;
                return `<g transform="translate(${x} ${y})"><rect x="-4" y="-12" width="8" height="32" fill="var(--forest)"/><path d="M0 ${-h}L-24 0H24Z" fill="var(--forest)"/><path d="M0 ${-h}L-15 ${-h + 32}H15Z" fill="var(--lime)"/></g>`;
            }).join("")}</g>
            <g fill="var(--umber)"><rect x="638" y="470" width="92" height="53"/><rect x="657" y="420" width="15" height="60"/><rect x="697" y="438" width="14" height="42"/><path d="M638 470L657 457 674 470 694 458 712 470Z"/></g>
            <g fill="var(--ember)"><rect x="649" y="491" width="12" height="14"/><rect x="676" y="491" width="12" height="14"/><rect x="704" y="491" width="12" height="14"/></g>
            <path d="M820 520H1600V790H860Q825 650 820 520Z" fill="url(#depth)"/>
            <path d="M820 520H1600V574H835Z" fill="var(--teal)"/>
            <g stroke="var(--cyan)" opacity=".3" fill="none" stroke-width="2">${[537, 549, 562, 575].map((y, i) => `<path d="M${850 + i * 35} ${y}Q1070 ${y - 6} 1210 ${y}T1580 ${y}"/>`).join("")}</g>
            <path d="M820 690Q1040 780 1600 745V810H820Z" fill="var(--rust)"/>
            <path d="M0 770Q400 750 800 780T1600 770V855H0Z" fill="var(--rust)"/>
            <path d="M0 845Q420 865 800 850T1600 850V935H0Z" fill="var(--umber)"/>
            <path d="M0 925Q450 915 850 940T1600 925V1000H0Z" fill="var(--coal)"/>
            <g fill="var(--coal)">${[100, 360, 710, 1110, 1450].map((x, i) => `<path d="M${x - 70} ${810 + (i % 2) * 60}q75-20 160 3q-60 20-160-3Z"/>`).join("")}<ellipse cx="420" cy="900" rx="65" ry="24"/></g>
        </symbol>
        <marker id="arrow-lime" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="var(--lime)"/></marker>
        <marker id="arrow-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="var(--cyan)"/></marker>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="var(--orange)"/></marker>
    </defs>`;

export function buildScene(target)
{
    target.innerHTML = `<svg id="scene-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="scene-title scene-desc"><title id="scene-title">${c.hero.sceneTitle}</title><desc id="scene-desc">${c.hero.sceneDescription}</desc>${scenery()}<use href="#landscape" width="1600" height="1000"/>
        <rect class="sky-imbalance" width="1600" height="520" fill="var(--violet)" opacity="0"/>
        <g class="flow-guides">${c.flows.map((f) => `<path id="path-${f.id}" data-flow="${f.id}" d="${f.path}" fill="none" stroke="var(--${f.color})" stroke-width="1.5" stroke-dasharray="2 6" opacity="${f.opacity || .25}" marker-end="url(#arrow-${f.color})"/>`).join("")}</g>
        <g id="particles" filter="url(#glow)"></g>
        <g id="reservoir-outlines" fill="none" stroke="var(--lime)" stroke-width="3" filter="url(#glow)">${c.reservoirs.map((r, i) => `<rect class="reservoir-outline" data-outline="${i}" x="${r.box[0]}" y="${r.box[1]}" width="${r.box[2]}" height="${r.box[3]}" rx="18" opacity="0"/>`).join("")}</g>
        <rect x="0" y="0" width="1600" height="1000" filter="url(#grain)" opacity=".09" style="mix-blend-mode:overlay;pointer-events:none"/>
    </svg>`;
}

export function buildHorizon(target)
{
    target.innerHTML = `<svg viewBox="0 260 1600 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${c.lab.horizon}"><use href="#landscape" width="1600" height="1000"/><rect class="heat-overlay" x="0" y="260" width="1600" height="500" fill="var(--pink)"/></svg>`;
}
