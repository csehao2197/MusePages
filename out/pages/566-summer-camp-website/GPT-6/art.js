export function icon(name, size = 22)
{
    const paths =
    {
        arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

export function canoe()
{
    return '<svg viewBox="0 0 64 40" width="48" height="34" aria-hidden="true"><path d="m6 22 9 10h34l9-10Q32 33 6 22Z" fill="#FFC53D" stroke="#4A3728" stroke-width="2.5"/><path d="M18 5 42 27m-6-5 8 10 6-6-11-7" fill="#3F8DB4" stroke="#4A3728" stroke-width="2.5" stroke-linejoin="round"/><path d="M5 37q8-5 16 0t16 0 16 0" fill="none" stroke="#3F8DB4" stroke-width="2"/></svg>';
}

export function scene(label)
{
    return `<svg class="camp-scene" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <defs>
        <filter id="paper-shadow" x="-35%" y="-35%" width="180%" height="190%"><feDropShadow dx="3" dy="10" stdDeviation="7" flood-color="#273b43" flood-opacity=".2"/></filter>
        <g id="pine"><path d="M0 5v130" stroke="#4A3728" stroke-width="5"/><path d="m0 0-35 60h17l-31 45h28l-29 31h100l-29-31h28L18 60h17Z" fill="currentColor" stroke="#4A3728" stroke-opacity=".4" stroke-width="1.5"/><path d="M0 32v90" stroke="#fbf2dc" stroke-opacity=".22" stroke-width="2"/></g>
        <g id="boat"><path d="M0 0q45 18 98-3L78 18H20Z" fill="#d77b42" stroke="#4A3728" stroke-width="2"/><path d="m8 4 80-3M35 2v9m27-10v10" fill="none" stroke="#FFC53D" stroke-width="3"/><path d="m44-20 27 47m-6-11 12 18 6-4-12-18" fill="#FFC53D" stroke="#4A3728" stroke-width="2"/></g>
    </defs>
    <rect width="1440" height="680" fill="#f3e7c7"/>
    <g class="layer sun-layer" style="--drift:13s;--delay:-2s" filter="url(#paper-shadow)">
        <path d="m1093 32 15 34 31-23 2 39 38-4-17 34 34 17-34 18 17 34-38-4-2 39-31-23-15 35-18-35-31 23-2-39-38 4 18-34-35-18 35-17-18-34 38 4 2-39 31 23Z" fill="#FFC53D"/>
        <circle cx="1095" cy="128" r="56" fill="#f3b72c"/>
        <circle cx="1091" cy="122" r="55" fill="#FFC53D"/>
    </g>
    <g class="layer" style="--drift:12s;--delay:-3s" filter="url(#paper-shadow)"><path d="M-50 267Q145 103 342 222T730 212T1110 231T1490 193V680H-50Z" fill="#a5c4c5"/><path d="M-50 299Q180 152 411 288T819 255T1214 268T1490 238V680H-50Z" fill="#6ba6b7"/></g>
    <g class="layer" style="--drift:11s;--delay:-6s" filter="url(#paper-shadow)"><path d="M-20 349q206-112 426-22t406-12 648 23v349H-20Z" fill="#3F8DB4"/><path d="M165 381h222m376-21h139m170 35h214M38 443h153m582-21h193m-554-44h155" stroke="#c4dcda" stroke-width="3" opacity=".65"/></g>
    <g class="layer distant-trees" style="--drift:9s;--delay:-4s" color="#397887">
        <use href="#pine" transform="translate(50 200) scale(.8)"/><use href="#pine" transform="translate(105 173) scale(1)"/><use href="#pine" transform="translate(170 206) scale(.7)"/><use href="#pine" transform="translate(1210 211) scale(.9)"/><use href="#pine" transform="translate(1280 156) scale(1.3)"/><use href="#pine" transform="translate(1370 177) scale(1.2)"/>
    </g>
    <g class="layer" style="--drift:12s;--delay:-7s" filter="url(#paper-shadow)">
        <path d="M725 680q24-120 129-183t267-89 319 1v271Z" fill="#92a68a" stroke="#4A3728" stroke-opacity=".3" stroke-width="2"/>
        <path d="M850 680q-14-106 144-171t446 5v166Z" fill="#c6bd8b"/>
        <path d="m972 417 146-15-67 88-149 2Z" fill="#ab774d" stroke="#4A3728" stroke-width="2"/>
        <path d="m964 429 146-13m-158 27 148-13m-159 27 148-14m-157 26 148-13m-159 26 150-14" stroke="#6b4c37" stroke-width="2"/>
        <path d="m916 483-6 24m132-24-3 22" stroke="#4A3728" stroke-width="5"/>
        <g transform="translate(1050 247)">
            <path d="m-4 133 102-144 103 145Z" fill="#664b3b" stroke="#4A3728" stroke-width="3"/>
            <path d="m11 127 87-120 87 120Z" fill="#dba971"/>
            <path d="M54 128V84h38v44" fill="#5b5949" stroke="#4A3728" stroke-width="3"/>
            <path d="M108 74h28v29h-28Z" fill="#FFC53D" stroke="#4A3728" stroke-width="3"/>
            <path d="M122 75v27m-13-14h26M40 107h13m40 0h15m28 0h34" stroke="#4A3728" stroke-width="2"/>
            <path d="m-17 137 115-162 117 162" fill="none" stroke="#4A3728" stroke-width="11" stroke-linejoin="round"/>
            <path d="m-15 132 113-160 116 160" fill="none" stroke="#bb6d43" stroke-width="5" stroke-linejoin="round"/>
            <path d="M42 135h118v12H42Z" fill="#7d583d" stroke="#4A3728" stroke-width="2"/>
        </g>
        <g transform="translate(1285 437)"><path d="m-60 61 54-91 74 91Z" fill="#FFC53D" stroke="#4A3728" stroke-width="2.5"/><path d="m-60 61 54-91 4 91Z" fill="#f4d378"/><path d="m-24 61 19-43 19 43" fill="#4A3728"/><path d="m-77 66 17-5m128 0 20 5" stroke="#4A3728" stroke-width="2"/></g>
        <g transform="translate(1130 503) scale(.7)"><path d="m-60 61 54-91 74 91Z" fill="#e58d57" stroke="#4A3728" stroke-width="3"/><path d="m-60 61 54-91 4 91Z" fill="#edb375"/><path d="m-24 61 19-43 19 43" fill="#4A3728"/></g>
    </g>
    <g class="layer" style="--drift:13s;--delay:-5s"><use href="#boat" transform="translate(719 393) rotate(-8)"/><use href="#boat" transform="translate(889 345) scale(.65) rotate(5)"/><path d="M722 422h84m66-49h64" stroke="#d1e4dc" stroke-width="3" stroke-linecap="round"/></g>
    <g class="layer" style="--drift:9.5s;--delay:-2s" filter="url(#paper-shadow)" color="#315e64"><use href="#pine" transform="translate(992 280) scale(1.2)"/><use href="#pine" transform="translate(1379 301) scale(1.8)"/><use href="#pine" transform="translate(1453 248) scale(2.4)"/><use href="#pine" transform="translate(17 377) scale(1.9)"/></g>
    <g class="layer" style="--drift:11.5s;--delay:-5s" filter="url(#paper-shadow)">
        <path d="M-25 671q216-99 436-20t428-10 626-22v80H-25Z" fill="#365d58"/>
        <g transform="translate(1228 584)"><ellipse cy="21" rx="44" ry="15" fill="#a7a588"/><path d="m-29 20 54 7m-50 0 49-11" stroke="#4A3728" stroke-width="9" stroke-linecap="round"/><path d="M-19 15Q-27-5-3-24q-2 16 9 14 2-11 6-16Q42 3 19 18Z" fill="#e79149" stroke="#4A3728" stroke-width="2"/><path d="M-6 17q-11-12 6-24 0 10 7 11 8 7 0 15" fill="#FFC53D"/></g>
    </g>
    <g fill="#4A3728" opacity=".6"><path d="m660 123 9-4 9 4-9-9Zm41 29 7-3 7 3-7-7Zm-66 15 6-3 6 3-6-7Z"/></g>
    </svg>`;
}

export function disc(type)
{
    const drawing =
    {
        lily: '<ellipse cx="46" cy="63" rx="31" ry="10" fill="#3F8DB4"/><path d="M21 57q0-30 30-24l-4 19 19-4q12 25-45 9Z" fill="#70936d" stroke="#4A3728" stroke-width="2"/><path d="M49 32q-14-11-6-19 11 0 11 13 5-17 15-12 3 13-13 18" fill="#FFFDF6" stroke="#4A3728" stroke-width="2"/>',
        wing: '<path d="M17 61q8-18 18-20L29 21q16 4 24 17L76 23q-1 14-13 24L45 65Z" fill="#3F8DB4" stroke="#4A3728" stroke-width="2"/><path d="m45 46 7-8 12-5m-26 9-5-12m-5 24 17-8" fill="none" stroke="#FBF2DC" stroke-width="2"/>',
        compass: '<circle cx="48" cy="46" r="28" fill="#FFFDF6" stroke="#4A3728" stroke-width="2"/><path d="m48 20 10 26-10 27-9-27Z" fill="#3F8DB4" stroke="#4A3728" stroke-width="2"/><path d="m48 20 10 26H39Z" fill="#d7804b"/><circle cx="48" cy="46" r="4" fill="#FFC53D" stroke="#4A3728" stroke-width="2"/>'
    };
    return `<svg width="86" height="86" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="50" r="41" fill="#4A3728" opacity=".13"/><circle cx="46" cy="44" r="41" fill="#FFC53D"/>${drawing[type]}</svg>`;
}

export function cabin()
{
    return '<svg viewBox="0 0 100 90" width="84" height="76" aria-hidden="true"><path d="M10 73 50 12l40 61Z" fill="#d5a676" stroke="#4A3728" stroke-width="2"/><path d="m5 74 45-68 45 68" fill="none" stroke="#4A3728" stroke-width="7" stroke-linejoin="round"/><path d="M39 74V48h22v26" fill="#3F8DB4" stroke="#4A3728" stroke-width="2"/><path d="M24 65h12m28 0h12M30 55h7m27 0h7" stroke="#4A3728" stroke-width="2"/><path d="M17 77h66" stroke="#4A3728" stroke-width="4" stroke-linecap="round"/></svg>';
}

export function avatar(tone, style)
{
    let details = "";
    if (style === "beanie") details = '<path d="M27 41q-2-28 23-28 27 0 25 28" fill="#3F8DB4" stroke="#4A3728" stroke-width="2"/><rect x="24" y="33" width="54" height="13" rx="5" fill="#72a9bd" stroke="#4A3728" stroke-width="2"/><circle cx="50" cy="13" r="7" fill="#3F8DB4"/>';
    if (style === "glasses") details = '<path d="M27 38q-6-30 22-25 28-7 25 24L61 29l-21 2Z" fill="#70472f"/><g fill="none" stroke="#4A3728" stroke-width="3"><circle cx="39" cy="48" r="9"/><circle cx="62" cy="48" r="9"/><path d="M48 47h5"/></g>';
    if (style === "braids") details = '<path d="M26 50q-10-37 25-36 33 1 24 38L64 32Q50 44 31 34Z" fill="#3d2c24"/><path d="m29 41-4 41m48-41 5 41" stroke="#3d2c24" stroke-width="12" stroke-linecap="round"/><path d="m22 70 7 3m46-1 8-2" stroke="#3F8DB4" stroke-width="5"/>';
    if (style === "silver") details = '<path d="M25 42q-3-28 27-28 29 0 25 30L61 31 38 39Z" fill="#d7d1b9" stroke="#4A3728" stroke-width="2"/><path d="m33 26 9 6m5-12 5 10m8-9 2 9" stroke="#a2a691" stroke-width="2"/>';
    return `<svg width="112" height="112" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#FFC53D"/><path d="M14 96q3-28 36-28 33 0 37 28" fill="#3F8DB4" stroke="#4A3728" stroke-width="2"/><path d="M44 66v13q8 6 15-1V65" fill="${tone}" stroke="#4A3728" stroke-width="2"/><ellipse cx="50" cy="46" rx="24" ry="29" fill="${tone}" stroke="#4A3728" stroke-width="2"/><path d="M38 48h1m22 0h1" stroke="#4A3728" stroke-width="3" stroke-linecap="round"/><path d="m49 48-2 9h6m-11 5q8 8 17-1" fill="none" stroke="#4A3728" stroke-width="2" stroke-linecap="round"/>${details}</svg>`;
}
