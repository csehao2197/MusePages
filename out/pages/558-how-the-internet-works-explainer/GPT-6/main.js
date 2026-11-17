import { content as C } from "./content.js";
import { store, timeline } from "./state.js";
import createElement from "./icons/createElement.js";
import CornerDownLeft from "./icons/corner-down-left.js";
import Timer from "./icons/timer.js";
import Search from "./icons/search.js";
import Play from "./icons/play.js";
import RotateCcw from "./icons/rotate-ccw.js";
import ArrowUp from "./icons/arrow-up.js";

const U = C.ui;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const T = (x, y, value, attrs = "") => `<text x="${x}" y="${y}" ${attrs.replace(/font-size="(\d+)"/, 'style="font-size:$1px"')}>${esc(value)}</text>`;
const R = (x, y, width, height, fill = "var(--raised)", rx = 10, attrs = "") => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" ${attrs}/>`;
const P = (d, stroke = "var(--hairline)", attrs = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${attrs}/>`;
const SVG = (body, width = 640, height = 480) => `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(U.diagram)}">${body}</svg>`;
const brand = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="14" cy="18" r="3" fill="var(--signal)"/>${P("M13 8a10 10 0 1 0 11 11", "var(--signal)")}${P("M13 3a15 15 0 1 0 16 16", "var(--signal)")}</svg>`;
const iconNodes = { start: CornerDownLeft, timer: Timer, search: Search, play: Play, replay: RotateCcw, up: ArrowUp };
function icons(root = document)
{
    root.querySelectorAll("[data-icon]").forEach((placeholder) =>
    {
        const element = createElement(iconNodes[placeholder.dataset.icon]);
        element.setAttribute("class", "icon");
        element.setAttribute("width", "18");
        element.setAttribute("height", "18");
        element.setAttribute("stroke-width", "1.75");
        element.setAttribute("aria-hidden", "true");
        placeholder.replaceWith(element);
    });
}
function button(label, attrs = "", icon = "")
{
    return `<button type="button" ${attrs}>${icon ? `<i data-icon="${icon}"></i>` : ""}${esc(label)}</button>`;
}
function mapDots(width = 720, height = 560)
{
    let result = "";
    for (let x = 20; x < width - 15; x += 14)
    {
        for (let y = 55; y < height - 30; y += 14)
        {
            const a = ((x - width * .31) / (width * .31)) ** 2 + ((y - height * .47) / (height * .38)) ** 2;
            const b = ((x - width * .91) / (width * .2)) ** 2 + ((y - height * .47) / (height * .35)) ** 2;
            if (Math.min(a, b) < 1 + .13 * Math.sin(x / 32 + y / 41))
            {
                result += `<circle cx="${x}" cy="${y}" r="1.6" fill="var(--grid)"/>`;
            }
        }
    }
    return result;
}
function rack(x, y, scale = 1)
{
    return `<g transform="translate(${x} ${y}) scale(${scale})">${[0, 1, 2, 3].map((i) =>
        `${R(0, i * 44, 112, 36, "var(--raised)", 6, 'stroke="var(--hairline)"')}${P(`M14 ${i * 44 + 12}h47 M14 ${i * 44 + 19}h32`)}<circle cx="91" cy="${i * 44 + 17}" r="3" fill="${i === 1 ? "var(--signal)" : "var(--haze)"}"/>`).join("")}</g>`;
}
function laptop(x, y, scale = 1, recipe = false)
{
    return `<g transform="translate(${x} ${y}) scale(${scale})">
        ${R(0, 0, 300, 204, "var(--raised)", 13, 'stroke="var(--hairline)"')}
        ${R(11, 11, 278, 181, recipe ? "var(--paper)" : "var(--ink)", 6)}
        ${R(11, 11, 278, 27, "var(--raised)", 5)}
        ${R(20, 19, 8, 8, "var(--haze)", 1)}
        ${R(40, 17, 237, 13, "var(--ink)", 6)}
        ${T(49, 27, C.domain, 'font-size="8"')}
        ${recipe ? recipePage() : `${R(29, 59, 140, 7, "var(--haze)", 2)}${R(29, 77, 212, 4, "var(--grid)", 2)}${R(29, 90, 180, 4, "var(--grid)", 2)}${R(29, 112, 242, 59, "var(--grid)", 4)}`}
        <path d="M0 204h300l25 16H-25Z" fill="var(--raised)" stroke="var(--hairline)" stroke-width="1.5"/>
        ${P("M115 206h70", "var(--haze)")}
    </g>`;
}
function recipePage()
{
    const r = U.recipe;
    return `${T(26, 54, r.brand, 'class="papertext" style="font-family:Space" font-size="10"')}${T(26, 73, r.kicker, 'class="papertext" font-size="5"')}
        ${r.title.split("\n").map((line, i) => T(26, 91 + i * 15, line, 'class="papertext" style="font-family:Source" font-size="14"')).join("")}
        <ellipse cx="227" cy="123" rx="45" ry="12" fill="#DDD3C0"/><ellipse cx="228" cy="111" rx="37" ry="24" fill="var(--amber)" transform="rotate(-12 228 111)"/>
        ${P("M211 100l-4 17 M226 95l-5 19 M241 94l-5 18", "#966126")}
        ${r.ingredients.map((line, i) => T(26, 126 + i * 10, line, 'class="papertext" font-size="6"')).join("")}
        ${R(26, 168, 71, 13, "var(--signal)", 5)}${T(35, 177, r.button, 'class="papertext" font-size="6"')}`;
}
function lock(x, y, closed = true, scale = 1)
{
    return `<g transform="translate(${x} ${y}) scale(${scale})"><circle r="24" fill="var(--panel)" stroke="var(--amber)" stroke-width="1.5"/>
        ${P(closed ? "M-9-3v-8a9 9 0 0 1 18 0v8" : "M-9-3v-11a9 9 0 0 1 18-3", "var(--amber)")}
        ${R(-13, -3, 26, 20, "var(--amber)", 4)}<circle cy="5" r="2" fill="var(--ink)"/>${P("M0 6v5", "var(--ink)")}</g>`;
}
function heroDiagram()
{
    const nodes = [[357,304],[395,258],[448,246],[497,294],[550,321],[596,284]];
    return SVG(`${mapDots()}${laptop(42, 279, .98)}${rack(565, 92)}
        ${P("M300 328C400 320 365 220 450 246S520 352 595 295L612 222", "var(--signal)", 'class="trail"')}
        ${nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--panel)" stroke="var(--signal)" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="2" fill="var(--signal)"/>`).join("")}
        <g class="packet">${R(-6, -6, 12, 12, "var(--signal)", 3)}${R(-5, -2, 10, 3, "var(--ink)", 0)}</g>
        ${lock(533, 170, true, .8)}
        ${T(565, 70, C.hero.target, 'font-size="11"')}${T(557, 287, "203.0.113.42 :443", 'font-size="11"')}
        ${T(45, 535, C.hero.source, 'font-size="11"')}${T(45, 551, "192.0.2.10", 'font-size="10"')}
        ${T(399, 220, `${U.hop} 4 · +8 ms`, 'font-size="11"')}
        ${R(465, 403, 220, 130, "var(--raised)", 12, 'stroke="var(--hairline)"')}
        ${T(485, 431, U.roundTrip, 'font-size="10"')}${T(485, 477, "316 ms", 'class="display" style="font-size:38px"')}
        ${[24,76,76,94,46].map((v, i, a) => R(485 + a.slice(0, i).reduce((s, n) => s + n, 0) * .54, 496, v * .54 - 3, 7, [1,2].includes(i) ? "var(--amber)" : "var(--signal)", 2)).join("")}
        ${T(485, 521, "DNS / TCP / TLS / HTTP / PAINT", 'style="font-size:8px"')}`, 720, 580);
}
function controls(index)
{
    switch (index)
    {
        case 0:
            return `<div class="segments address" role="group" aria-label="${esc(C.scenes[0].control)}">${[U.scheme, U.host, U.path].map((label, i) => button(label, `data-part="${i}" aria-pressed="${i === 1}"`)).join("")}</div>`;
        case 1:
            return `<form class="dns-form" id="dns-form"><input id="domain" aria-label="${U.domainLabel}" autocomplete="off" spellcheck="false" maxlength="253" value="${C.domain}" placeholder="${U.domainLabel}"><button type="submit" class="primary"><i data-icon="search"></i>${U.lookup}</button></form>
                <div class="presets" role="group" aria-label="${esc(C.scenes[1].control)}">${U.presets.map((domain) => button(domain, `data-domain="${domain}"`)).join("")}</div>`;
        case 2:
            return `<div class="segments" role="group" aria-label="${esc(C.scenes[2].control)}">${Object.entries(C.routes).map(([key, route]) => button(route.label, `data-distance="${key}" aria-pressed="${key === "country"}"`)).join("")}</div>`;
        case 3:
            return button(U.handshakeButtons[0], 'id="handshake" class="primary"', "play");
        case 4:
            return `<div class="segments" role="group" aria-label="${esc(C.scenes[4].control)}">${U.tlsOptions.map((label, i) => button(label, `data-tls="${i}" aria-pressed="${i === 1}"`)).join("")}</div>`;
        case 5:
            return `<div class="range-row"><input type="range" id="loss" aria-label="${U.lossLabel}" min="0" max="20" step="5" value="0"><output id="loss-value" for="loss">0%</output></div><div class="ticks" aria-hidden="true">${[0,5,10,15,20].map((n) => `<span>${n}%</span>`).join("")}</div>`;
        case 6:
            return button(U.warmButton, 'id="warm" class="primary" aria-pressed="false"', "replay");
    }
}
$("#app").innerHTML = `
    <a class="skip" href="#scene-1">${U.skip}</a>
    <header>
        <div class="container header-inner">
            <a class="brand" href="#top">${brand}<span class="wordmark">${C.brand}</span></a>
            <nav class="rail" aria-label="${U.chapter}">${C.stages.map((label, i) => `<a href="#scene-${i + 1}" aria-label="Go to scene ${i + 1}: ${C.scenes[i].name}">${label}</a>`).join("")}</nav>
            <span class="mobile-stage">${U.stage} 0 ${U.of} 7</span>
            <div class="timer"><i data-icon="timer"></i><div><small>${U.roundTrip}</small><strong id="header-time">0 ms</strong></div></div>
        </div>
        <div class="header-progress"></div>
    </header>
    <main id="top">
        <section class="hero container">
            <div class="hero-grid">
                <div class="hero-copy">
                    <p class="kicker"><span class="live-dot"></span>${C.hero.kicker}</p>
                    <h1>${C.topic}</h1>
                    <p class="hero-deck">${C.hero.deck}</p>
                    <div class="actions"><a class="button primary" href="#scene-1"><i data-icon="start"></i>${C.hero.start}</a><a class="text-link" href="#glossary">${C.hero.glossary}</a></div>
                    <p class="hero-note">${C.hero.note}</p>
                </div>
                <div class="hero-visual dot-grid"><span class="plate mono">${C.hero.plate}</span>${heroDiagram()}</div>
            </div>
            <div class="hero-bottom"><span class="mono">${C.hero.reading}</span><div class="chapter-strip">${C.stages.map((label, i) => `<a href="#scene-${i + 1}"><b>0${i + 1}</b>${label}</a>`).join("")}</div></div>
        </section>
        <div class="container story">
            ${C.scenes.map((scene, i) => `<section class="scene" id="scene-${i + 1}" data-beat="0" aria-labelledby="heading-${i}">
                <div class="scene-intro"><p class="kicker"><span class="scene-number">0${i + 1}</span>${scene.name}</p><h2 id="heading-${i}">${scene.headline}</h2></div>
                <div class="diagram-panel dot-grid"><p class="figure-title mono">${scene.figure}</p><div class="diagram" id="diagram-${i}"></div>${i === 4 ? `<div class="inspector"><pre id="tls-bytes"></pre><small>${U.tlsNote}</small></div>` : ""}
                    <div class="control-bar"><span class="control-label">${scene.control}</span>${controls(i)}<p class="caption" id="caption-${i}" role="status" aria-live="polite"></p></div>
                </div>
                <div class="beats">${scene.beats.map((text, beat) => `<article class="beat${beat === 0 ? " active" : ""}" data-scene="${i}" data-index="${beat}"><span class="beat-index">0${i + 1} / 0${beat + 1}</span><p${i === 2 && beat === 1 ? ' id="route-beat"' : i === 3 && beat === 2 ? ' id="tcp-beat"' : ""}>${text.replace("{hops}", "7").replace("{oneWay}", "38").replace("{rtt}", "76")}</p>${beat === 2 ? `<pre>${esc(scene.callout)}</pre>` : ""}</article>`).join("")}</div>
            </section>`).join("")}
            <section id="recap" class="recap" aria-labelledby="recap-heading">
                <p class="kicker">${U.recapKicker}</p><h2 id="recap-heading">${U.recapTitle}</h2><p class="section-deck">${U.recapDeck}</p>
                <div class="recap-panel dot-grid"><div id="recap-diagram"></div><div class="stats">${U.stats.map((label, i) => `<div class="stat"><strong id="stat-${i}"></strong><span>${label}</span></div>`).join("")}</div></div>
                ${button(U.replay, 'id="replay"', "replay")}<p id="replay-status" class="recap-status mono" role="status"></p>
            </section>
            <section id="glossary" class="glossary" aria-labelledby="glossary-heading">
                <p class="kicker">${U.glossaryKicker}</p><h2 id="glossary-heading">${U.glossaryTitle}</h2>
                <div class="glossary-grid">${C.glossary.map(([term, definition, scene]) => `<article class="term"><div class="term-top"><h3>${term}</h3><a href="#scene-${scene}" aria-label="${term}: go to scene ${scene}">${U.glossaryScene} ${scene}</a></div><p>${definition}</p></article>`).join("")}</div>
            </section>
        </div>
    </main>
    <footer><div class="container"><div class="footer-grid"><div><div class="brand">${brand}<span class="wordmark">${C.brand}</span></div><p>${U.footer}</p><p class="mono">${U.credits}</p></div><p class="mono">${U.disclaimer}</p><nav class="footer-links"><a href="#top">${U.back} <i data-icon="up"></i></a><a href="#glossary">${C.hero.glossary}</a><span>${U.next}</span></nav></div><div class="footer-bottom mono"><span>© ${C.brand}</span><a href="${U.templateURL}">${U.template}</a></div></div></footer>`;
icons();

let part = 1;
function drawRequest()
{
    const parts = [U.scheme, U.host, U.path];
    const y = [107, 151, 195];
    const labels = U.addressParts;
    const body = `${R(35, 35, 570, 252, "var(--raised)", 16, 'stroke="var(--hairline)"')}
        ${R(52, 52, 536, 216, "var(--ink)", 9)}
        ${parts.map((value, i) => `${R(70, y[i] - 23, 500, 35, i === part ? "var(--raised)" : "transparent", 7)}${T(84, y[i], (i === 0 ? "" : i === 2 ? "/" : "") + value + (i === 0 ? "://" : ""), `style="font-size:${i === 0 ? 21 : 18}px;fill:${i === part ? "var(--signal)" : "var(--haze)"}"`)}${T(492, y[i] - 1, labels[i], 'style="font-size:10px"')}`).join("")}
        ${P("M320 288v33", "var(--amber)")}
        <g class="beat-late">${R(100, 328, 440, 117, "var(--panel)", 12, 'stroke="var(--hairline)"')}${C.scenes[0].callout.split("\n").map((line, i) => T(120, 361 + 26 * i, line, 'style="font-size:12px;fill:var(--fog)"')).join("")}</g>`;
    $("#diagram-0").innerHTML = SVG(body);
    $("#caption-0").textContent = U.addressCaptions[part];
}

let dnsResult = null;
let dnsProgress = -1;
let lookupDomain = C.domain;
let lookupIP = U.dnsDetail[4];
function drawDNS()
{
    const coordinates = [[80,235],[275,235],[515,90],[515,235],[515,380]];
    let body = "";
    const steps = [[0,1],[1,2],[1,3],[1,4],[1,0]];
    steps.forEach(([a, b], i) =>
    {
        const [x1, y1] = coordinates[a];
        const [x2, y2] = coordinates[b];
        body += P(`M${x1} ${y1}L${x2} ${y2}`, i <= dnsProgress ? (i === 4 ? "var(--amber)" : "var(--signal)") : "var(--hairline)", i <= dnsProgress ? 'class="trail"' : "");
        if (i < 4)
        {
            body += T((x1 + x2) / 2 - 20, (y1 + y2) / 2 - 18, `${i + 1} / ${C.numbers.dnsSteps[i]} ms`, 'style="font-size:10px"');
        }
    });
    coordinates.forEach(([x, y], i) =>
    {
        body += R(x - 31, y - 22, 62, 44, "var(--raised)", 8, `stroke="${dnsProgress >= i - 1 ? "var(--signal)" : "var(--hairline)"}"`);
        body += P(`M${x - 14} ${y - 5}h28M${x - 14} ${y + 3}h18`, "var(--haze)");
        const nodeLabel = i === 3 ? `.${lookupDomain.split(".").at(-1)} servers` : i === 4 ? `ns1.${lookupDomain}` : U.dnsNodes[i];
        body += T(x, y + 42, nodeLabel, `text-anchor="middle" style="font-size:${i === 4 ? 9 : 11}px"`);
        body += T(x, y + 59, i === 4 ? lookupIP : U.dnsDetail[i], 'text-anchor="middle" style="font-size:9px"');
    });
    body += R(50, 25, 260, 37, "var(--ink)", 8, 'stroke="var(--hairline)"');
    body += T(65, 49, dnsResult ? `${dnsResult.cached ? U.cache : U.fresh} · ${dnsResult.cached ? 0 : C.numbers.dns} ms` : U.unknown, 'class="amber" style="font-size:10px"');
    if (dnsResult)
    {
        body += R(40, 443, 560, 29, "var(--raised)", 8);
        body += T(55, 462, `${dnsResult.domain} → ${dnsResult.ip}`, 'class="signal" style="font-size:11px"');
    }
    $("#diagram-1").innerHTML = SVG(body);
}
function drawRoute()
{
    const s = store.get();
    const r = C.routes[s.distance];
    const t = timeline(s);
    const d = r.points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
    let body = mapDots(960, 540) + P(d, "var(--signal)", 'class="trail"');
    r.points.forEach(([x, y], i) =>
    {
        const ip = i === 0 ? "192.0.2.10" : i === r.points.length - 1 ? "203.0.113.42" : `198.51.100.${i}`;
        body += `<g tabindex="0" role="img" aria-label="${esc(r.nodes[i])}, ${ip}"><title>${esc(r.nodes[i])} · ${ip}</title><circle cx="${x}" cy="${y}" r="7" fill="var(--raised)" stroke="var(--signal)" stroke-width="1.5"/></g>`;
        const anchor = i < 2 ? "end" : i === r.points.length - 1 ? "start" : "middle";
        const dx = i < 2 ? -14 : i === r.points.length - 1 ? 14 : 0;
        const dy = i % 2 ? -22 : 29;
        body += T(x + dx, y + dy, r.nodes[i], `text-anchor="${anchor}" style="font-size:10px"`);
        if (i)
        {
            const [px, py] = r.points[i - 1];
            body += T((x + px) / 2 + 5, (y + py) / 2 - 7, `+${r.links[i - 1]}`, 'class="amber" style="font-size:9px"');
        }
    });
    body += T(36, 40, `${U.oneWay.toUpperCase()} ${t.oneWay} ms / ${t.hops} ${U.hops.toUpperCase()}`, 'class="signal" style="font-size:15px"');
    body += T(36, 63, "192.0.2.10 → 203.0.113.42", 'style="font-size:11px"');
    if (s.distance === "ocean")
    {
        body += T(602, 112, U.cable, 'class="amber" style="font-size:10px"');
    }
    body += `<g class="beat-last">${R(610, 415, 312, 85, "var(--raised)", 12, 'stroke="var(--hairline)"')}${C.scenes[2].callout.split("\n").map((line, i) => T(628, 439 + i * 20, line, 'style="font-size:10px"')).join("")}</g>`;
    $("#diagram-2").innerHTML = SVG(body, 960, 540);
    $("#caption-2").textContent = `${U.oneWay}: ${t.oneWay} ms · ${t.hops} ${U.hops}`;
    $("#route-beat").textContent = C.scenes[2].beats[1].replace("{hops}", t.hops).replace("{oneWay}", t.oneWay);
}
function sequence(tls = false)
{
    let body = "";
    const height = tls ? 315 : 480;
    [140, 500].forEach((x, i) =>
    {
        body += R(x - 99, 22, 198, 50, "var(--raised)", 9, 'stroke="var(--hairline)"');
        body += T(x, 44, U.endpoints[i], 'text-anchor="middle" class="display" style="font-size:13px"');
        body += T(x, 61, i ? "203.0.113.42:443" : "192.0.2.10:52814", 'text-anchor="middle" style="font-size:10px"');
        body += P(`M${x} 73V${height - 28}`);
    });
    body += T(25, 101, U.time, 'style="font-size:10px"');
    return body;
}
function drawTCP()
{
    const step = store.get().handshakeStep;
    const rtt = timeline().oneWay * 2;
    let body = sequence();
    U.handshakeLabels.forEach((label, i) =>
    {
        const y = 125 + i * 87;
        const from = i === 1 ? 500 : 140;
        const to = i === 1 ? 140 : 500;
        if (i < step)
        {
            body += P(`M${from} ${y}L${to} ${y + 57}`, "var(--amber)");
            body += P(`M${to + (i === 1 ? 11 : -11)} ${y + 45}L${to} ${y + 57}L${to + (i === 1 ? 14 : -14)} ${y + 60}`, "var(--amber)");
            body += R(189, y - 3, 263, 25, "var(--raised)", 7);
            body += T(320, y + 14, label, 'text-anchor="middle" class="amber" style="font-size:11px"');
        }
        body += `<circle cx="${294 + i * 26}" cy="440" r="4" fill="${i < step ? "var(--signal)" : "var(--grid)"}"/>`;
    });
    if (step === 3)
    {
        body += R(136, 391, 368, 29, "var(--signal)", 8) + T(320, 411, `${U.open} · ${rtt} ms`, 'text-anchor="middle" style="fill:var(--ink);font-size:12px"');
    }
    $("#diagram-3").innerHTML = SVG(body);
    const control = $("#handshake");
    control.innerHTML = `<i data-icon="${step === 3 ? "replay" : "play"}"></i>${U.handshakeButtons[step]}`;
    icons(control);
    $("#caption-3").textContent = U.handshakeCaptions[step];
    $("#tcp-beat").textContent = C.scenes[3].beats[2].replace("{rtt}", rtt);
}
let secure = true;
function seededBytes()
{
    let seed = 42;
    const random = () =>
    {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
    return Array.from({ length: 6 }, () => Array.from({ length: 16 }, () => Math.floor(random() * 256).toString(16).padStart(2, "0")).join(" ")).join("\n");
}
const encryptedBytes = seededBytes();
function drawTLS()
{
    if (matchMedia("(max-width: 620px)").matches)
    {
        let body = "";
        [70, 290].forEach((x, i) =>
        {
            body += T(x, 20, U.endpoints[i], 'text-anchor="middle" class="display" style="font-size:11px"');
            body += P(`M${x} 30V135`);
        });
        U.tlsMessages.forEach((label, i) =>
        {
            const y = 44 + i * 36;
            body += P(i === 1 ? `M290 ${y}L70 ${y + 22}` : `M70 ${y}L290 ${y + 22}`, "var(--amber)");
            body += R(76, y - 9, 208, 17, "var(--panel)", 4);
            body += T(180, y + 3, label, 'text-anchor="middle" class="amber" style="font-size:8.5px"');
        });
        body += R(12, 144, 336, 68, "var(--raised)", 8, 'stroke="var(--amber)"');
        body += C.scenes[4].callout.split("\n").map((line, i) => T(24, 160 + i * 13, line, 'style="font-size:8px"')).join("");
        body += lock(321, 177, secure, .58);
        $("#diagram-4").innerHTML = SVG(body, 360, 220);
    }
    else
    {
        let body = sequence(true);
        U.tlsMessages.forEach((label, i) =>
        {
            const y = 104 + i * 62;
            const from = i === 1 ? 500 : 140;
            const to = i === 1 ? 140 : 500;
            body += `<g class="beat-late">${P(`M${from} ${y}L${to} ${y + 34}`, "var(--amber)")}${R(168, y - 8, 304, 21, "var(--raised)", 5)}${T(320, y + 7, label, 'text-anchor="middle" class="amber" style="font-size:10px"')}</g>`;
        });
        body += lock(320, 284, secure, .8);
        body += R(110, 321, 420, 99, "var(--raised)", 10, 'stroke="var(--amber)"');
        body += C.scenes[4].callout.split("\n").map((line, i) => T(130, 343 + i * 21, line, 'style="font-size:11px"')).join("");
        $("#diagram-4").innerHTML = SVG(body, 640, 435);
    }
    $("#tls-bytes").textContent = secure ? `${U.tlsVisible}\n${encryptedBytes}` : U.http;
    $("#tls-bytes").classList.toggle("error", !secure);
    $("#caption-4").textContent = U.tlsCaptions[secure ? 1 : 0];
}
let responsePending = false;
let responseTimer;
function drawResponse()
{
    const t = timeline();
    const lostTiles = C.numbers.lossOrder.slice(0, t.lost);
    let body = `${rack(511, 87, .7)}${laptop(33, 292, .7)}
        ${[0,1,2].map((i) => P(`M520 ${181 + i * 18}C370 ${88 + i * 92} 300 ${230 + i * 43} 174 341`, "var(--grid)")).join("")}
        ${T(35, 35, `${U.packet} 12 · ${U.lost} ${t.lost} · ${U.resent} ${responsePending ? 0 : t.lost}`, 'class="signal" style="font-size:12px"')}
        ${C.scenes[5].callout.split("\n").map((line, i) => T(260, 65 + i * 18, line, 'style="font-size:10px"')).join("")}`;
    for (let i = 1; i <= C.numbers.packetCount; i++)
    {
        const x = 59 + ((i - 1) % 4) * 41;
        const y = 340 + Math.floor((i - 1) / 4) * 25;
        const missing = lostTiles.includes(i) && responsePending;
        const resent = lostTiles.includes(i) && !responsePending;
        body += `<g class="tile${resent ? " resent" : ""}" data-tile="${i}" data-missing="${missing}" style="animation-delay:${i * .035}s">
            ${R(x, y, 34, 20, missing ? "var(--ink)" : "var(--raised)", 4, `stroke="${missing ? "var(--loss)" : resent ? "var(--amber)" : "var(--signal)"}" ${missing ? 'stroke-dasharray="3 3"' : ""}`)}
            ${T(x + 17, y + 14, missing ? U.gap : i, `text-anchor="middle" style="font-size:9px;fill:${missing ? "var(--loss)" : "var(--fog)"}"`)}
        </g>`;
    }
    if (t.lost)
    {
        body += P("M232 330Q382 401 523 275", "var(--amber)", 'stroke-dasharray="4 5"') + T(343, 363, `${U.resend} × ${t.lost}`, 'class="amber"');
    }
    body += T(275, 448, responsePending ? `${U.lost}: ${t.lost} · ${U.resend}…` : U.reassembled, 'class="signal" style="font-size:12px"');
    $("#diagram-5").innerHTML = SVG(body);
    $("#caption-5").textContent = `${U.transfer}: ${t.transfer} ms${t.lost ? ` · ${t.lost} ${U.resent.toLowerCase()}` : ""}`;
}
function drawRender()
{
    const t = timeline();
    const warm = store.get().warmReload;
    const durations = warm ? t.warmDurations : t.durations;
    const total = warm ? t.warmTotal : t.total;
    let elapsed = 0;
    let body = laptop(78, 20, 1.6, true);
    body += T(45, 401, warm ? U.warmBadges : `${U.cold}: ${t.total} ms`, 'class="amber" style="font-size:11px"');
    durations.forEach((duration, i) =>
    {
        const width = duration / t.total * 410;
        const x = 184 + elapsed / t.total * 410;
        const y = 427 + i * 28;
        body += T(45, y + 11, `${U.waterfall[i]} ${duration}`, 'style="font-size:10px"');
        body += P(`M184 ${y + 6}H598`, "var(--grid)");
        if (duration)
        {
            body += R(x, y, Math.max(width, 2), 12, [1,2].includes(i) ? "var(--amber)" : "var(--signal)", 3);
        }
        elapsed += duration;
    });
    body += T(596, 589, `${total} ms`, 'text-anchor="end" class="signal" style="font-size:16px"');
    $("#diagram-6").innerHTML = SVG(body, 640, 610);
    $("#caption-6").textContent = warm ? `${U.warm}: ${total} ms · ${Math.round((1 - total / t.total) * 100)}% ${U.faster}` : `${U.cold}: ${total} ms`;
    $("#warm").innerHTML = `<i data-icon="replay"></i>${warm ? U.coldButton : U.warmButton}`;
    $("#warm").setAttribute("aria-pressed", String(warm));
    icons($("#warm"));
}
let replaying = false;
let replayFrame;
let replayStart;
let replayStage = 6;
let replayLocal = 1;
function drawRecap(progress = 1)
{
    const t = timeline();
    const r = C.routes[store.get().distance];
    let body = P("M130 240Q350 10 585 170T1060 230", "var(--signal)", 'class="trail"');
    for (let i = 0; i < r.hops; i++)
    {
        const x = 280 + i * (655 / (r.hops - 1));
        const y = 150 + Math.sin(i / r.hops * Math.PI * 2) * 35;
        body += `<circle cx="${x}" cy="${y}" r="6" fill="var(--raised)" stroke="var(--signal)" stroke-width="1.5"/>`;
    }
    body += laptop(40, 227, .48, progress >= 1) + rack(1060, 120, .73);
    body += R(196, 50, 90, 43, "var(--raised)", 8, 'stroke="var(--hairline)"') + T(241, 76, U.dnsNodes[1].split(" (")[0], 'text-anchor="middle" style="font-size:11px"');
    body += P("M118 229L241 94", "var(--amber)") + lock(1000, 158, progress > .55, .8);
    U.waterfall.forEach((label, i) =>
    {
        body += T(255 + i * 177, 337, `${label} ${t.durations[i]} ms`, 'text-anchor="middle" style="font-size:11px"');
    });
    if (progress < 1)
    {
        const outbound = replayStage !== 5;
        const x = replayStage === 1 ? 130 + Math.sin(replayLocal * Math.PI) * 112 : 140 + 910 * (outbound ? replayLocal : 1 - replayLocal);
        const y = replayStage === 1 ? 230 - Math.sin(replayLocal * Math.PI) * 150 : 170 - 70 * Math.sin(replayLocal * Math.PI);
        body += R(x, y, 14, 14, [3,4].includes(replayStage) ? "var(--amber)" : "var(--signal)", 3);
        body += T(600, 55, C.stages[replayStage], 'text-anchor="middle" class="signal" style="font-size:20px"');
        if ([3,4].includes(replayStage))
        {
            const labels = replayStage === 3 ? U.handshakeLabels : U.tlsMessages;
            labels.forEach((label, i) =>
            {
                if (replayLocal >= i / 3)
                {
                    body += T(600, 230 + i * 22, label, 'text-anchor="middle" class="amber" style="font-size:11px"');
                }
            });
        }
        if (replayStage === 5)
        {
            for (let i = 0; i < C.numbers.packetCount; i++)
            {
                const tx = 1040 - Math.max(0, Math.min(1, replayLocal * 1.8 - i * .06)) * 875;
                body += R(tx, 195 + i % 3 * 24, 21, 17, "var(--raised)", 3, 'stroke="var(--signal)"');
                body += T(tx + 10, 207 + i % 3 * 24, i + 1, 'text-anchor="middle" style="font-size:8px"');
            }
        }
    }
    $("#recap-diagram").innerHTML = SVG(body, 1200, 380);
    [t.total + " ms", t.hops, 2, C.numbers.packetCount].forEach((value, i) => { $(`#stat-${i}`).textContent = value; });
}
function updateHeader()
{
    const s = store.get();
    const index = Math.max(0, Math.min(6, s.activeStage));
    $("#header-time").textContent = `${s.activeStage < 0 ? 0 : timeline(s).milestones[index]} ms`;
    $(".mobile-stage").textContent = `${U.stage} ${s.activeStage < 0 ? 0 : index + 1} ${U.of} 7${s.activeStage < 0 ? "" : ` · ${C.stages[index]}`}`;
    $$(".rail a").forEach((link, i) =>
    {
        if (s.activeStage === i)
        {
            link.setAttribute("aria-current", "step");
        }
        else
        {
            link.removeAttribute("aria-current");
        }
        link.classList.toggle("passed", i < s.activeStage);
    });
}
drawRequest();
drawDNS();
drawRoute();
drawTCP();
drawTLS();
drawResponse();
drawRender();
drawRecap();
$("#caption-1").textContent = U.unknown;

let oldDistance = store.get().distance;
let oldLoss = store.get().lossPercent;
let oldWarm = store.get().warmReload;
let oldHandshake = store.get().handshakeStep;
store.subscribe((s) =>
{
    updateHeader();
    if (s.distance !== oldDistance || s.lossPercent !== oldLoss)
    {
        oldDistance = s.distance;
        oldLoss = s.lossPercent;
        drawRoute();
        drawTCP();
        drawResponse();
        drawRender();
        drawRecap();
    }
    if (s.warmReload !== oldWarm)
    {
        oldWarm = s.warmReload;
        drawRender();
    }
    if (s.handshakeStep !== oldHandshake)
    {
        oldHandshake = s.handshakeStep;
        drawTCP();
    }
});
$$("[data-part]").forEach((control) => control.addEventListener("click", () =>
{
    part = Number(control.dataset.part);
    $$("[data-part]").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
    drawRequest();
}));

let lookupVersion = 0;
async function lookup()
{
    const domain = $("#domain").value.trim().toLowerCase().replace(/\.$/, "");
    const validName = domain.length <= 253 && domain.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label));
    const allowed = /\.(example|test|invalid)$/.test(domain) || /(^|\.)example\.(com|net|org)$/.test(domain);
    const caption = $("#caption-1");
    const version = ++lookupVersion;
    if (!validName || !allowed)
    {
        caption.textContent = U.invalid;
        caption.classList.add("error");
        $("#domain").setAttribute("aria-invalid", "true");
        return;
    }
    $("#domain").removeAttribute("aria-invalid");
    caption.classList.remove("error");
    $("#domain").value = domain;
    lookupDomain = domain;
    const cached = store.get().dnsCache.has(domain);
    const ip = domain === C.domain ? "203.0.113.42" : `203.0.113.${20 + [...domain].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 200}`;
    lookupIP = ip;
    dnsResult = null;
    if (!cached)
    {
        for (let step = 0; step < U.dnsPhases.length; step++)
        {
            if (version !== lookupVersion) return;
            dnsProgress = step;
            caption.textContent = `${U.dnsPhases[step]} · ${C.numbers.dnsSteps[step]} ms`;
            drawDNS();
            if (!reduced.matches)
            {
                await new Promise((resolve) => setTimeout(resolve, 140));
            }
        }
    }
    if (version !== lookupVersion) return;
    dnsProgress = cached ? -1 : 4;
    dnsResult = { domain, ip, cached };
    const cache = new Set(store.get().dnsCache);
    cache.add(domain);
    store.set({ dnsCache: cache });
    drawDNS();
    caption.textContent = `${domain} → ${ip} · ${cached ? U.cache : U.fresh} · ${cached ? 0 : C.numbers.dns} ms`;
}
$("#dns-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    lookup();
});
$$("[data-domain]").forEach((control) => control.addEventListener("click", () =>
{
    $("#domain").value = control.dataset.domain;
    lookup();
}));
$$("[data-distance]").forEach((control) => control.addEventListener("click", () =>
{
    $$("[data-distance]").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
    store.set({ distance: control.dataset.distance });
}));
$("#handshake").addEventListener("click", () => store.set({ handshakeStep: (store.get().handshakeStep + 1) % 4 }));
$$("[data-tls]").forEach((control) => control.addEventListener("click", () =>
{
    secure = Boolean(Number(control.dataset.tls));
    $$("[data-tls]").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
    $("#scene-5").dataset.beat = "2";
    drawTLS();
}));
$("#loss").addEventListener("input", (event) =>
{
    const lossPercent = Number(event.target.value);
    $("#loss-value").textContent = `${lossPercent}%`;
    clearTimeout(responseTimer);
    responsePending = !reduced.matches && lossPercent > 0;
    store.set({ lossPercent });
    responseTimer = setTimeout(() =>
    {
        responsePending = false;
        drawResponse();
    }, reduced.matches ? 0 : 1500);
});
$("#warm").addEventListener("click", () => store.set({ warmReload: !store.get().warmReload }));

function replay()
{
    if (replaying || reduced.matches) return;
    replaying = true;
    $("#replay").disabled = true;
    $("#replay-status").textContent = U.replaying;
    replayStart = performance.now();
    const t = timeline();
    const weights = [0, C.numbers.dns, t.oneWay, t.oneWay, t.oneWay * 2, t.transfer, C.numbers.paint];
    const weightTotal = weights.reduce((sum, value) => sum + value, 0);
    const durations = weights.map((weight) => .4 + 1.2 * weight / weightTotal);
    const tick = (now) =>
    {
        const p = Math.min(1, (now - replayStart) / 4000);
        let elapsed = 0;
        replayStage = 6;
        for (let i = 0; i < durations.length; i++)
        {
            if (p * 4 <= elapsed + durations[i])
            {
                replayStage = i;
                replayLocal = (p * 4 - elapsed) / durations[i];
                break;
            }
            elapsed += durations[i];
        }
        store.set({ activeStage: replayStage });
        drawRecap(p);
        if (p < 1 && !reduced.matches)
        {
            replayFrame = requestAnimationFrame(tick);
        }
        else
        {
            replaying = false;
            $("#replay").disabled = false;
            $("#replay-status").textContent = U.recapDone;
            store.set({ activeStage: 6 });
        }
    };
    replayFrame = requestAnimationFrame(tick);
}
$("#replay").addEventListener("click", replay);
let autoReplayed = false;
const recapObserver = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting) && !autoReplayed)
    {
        autoReplayed = true;
        replay();
    }
}, { threshold: .5 });
recapObserver.observe($(".recap-panel"));
const beatsObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const section = $(`#scene-${Number(card.dataset.scene) + 1}`);
        section.dataset.beat = reduced.matches ? "2" : card.dataset.index;
        section.querySelectorAll(".beat").forEach((item) => item.classList.toggle("active", item === card));
    });
}, { rootMargin: "-30% 0px -30% 0px", threshold: 0 });
$$(".beat").forEach((beat) => beatsObserver.observe(beat));
let scrollQueued = false;
function scrollUpdate()
{
    scrollQueued = false;
    if (!replaying)
    {
        let activeStage = -1;
        $$(".scene").forEach((section, index) =>
        {
            if (section.getBoundingClientRect().top < innerHeight * .5) activeStage = index;
        });
        if (activeStage !== store.get().activeStage) store.set({ activeStage });
    }
    const start = $("#scene-1").offsetTop;
    const end = $("#recap").offsetTop + $("#recap").offsetHeight;
    const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
    $(".header-progress").style.width = `${progress * 100}%`;
}
addEventListener("scroll", () =>
{
    if (!scrollQueued)
    {
        scrollQueued = true;
        requestAnimationFrame(scrollUpdate);
    }
}, { passive: true });
reduced.addEventListener("change", () =>
{
    if (reduced.matches)
    {
        cancelAnimationFrame(replayFrame);
        replaying = false;
        $("#replay").disabled = false;
        $$(".scene").forEach((section) => { section.dataset.beat = "2"; });
        drawRecap();
    }
});
addEventListener("resize", drawTLS);
if (reduced.matches) $$(".scene").forEach((section) => { section.dataset.beat = "2"; });
scrollUpdate();
