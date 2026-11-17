import { config, words, markup } from "./content.mjs";
import { simulate, toReal, crossoverYear } from "./finance.mjs";

document.querySelector("#app").innerHTML = markup();

const state = { ...config.defaults };
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const money = new Intl.NumberFormat(config.locale, { style: "currency", currency: config.currency, maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat(config.locale, { style: "currency", currency: config.currency, notation: "compact", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat(config.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat(config.locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ratioFormat = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 2 });
const decimalRate = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 4 });
const precise = new Intl.NumberFormat(config.locale, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const write = (selector, text) => { $(selector).textContent = text; };
const formatMoney = (value) => money.format(Math.abs(value) < 0.00001 ? 0 : value);
const fmtPercent = (value) => percent.format(value / 100);
const animations = new WeakMap();
const amounts = new WeakMap();
let rows;
let activeStep = 0;
let exploredYear = null;
let age = config.retirement;
let playing = null;
let dragging = false;

function tween(element, target)
{
    const previous = amounts.get(element) ?? 0;
    amounts.set(element, target);
    cancelAnimationFrame(animations.get(element));
    if (reducedMotion.matches || dragging)
    {
        element.textContent = formatMoney(target);
        return;
    }
    const start = performance.now();
    function frame(now)
    {
        const progress = Math.min(1, (now - start) / 600);
        const value = previous + (target - previous) * (1 - (1 - progress) ** 4);
        element.textContent = formatMoney(value);
        if (progress < 1)
        {
            animations.set(element, requestAnimationFrame(frame));
        }
    }
    animations.set(element, requestAnimationFrame(frame));
}

function amount(selector, value)
{
    $$(selector).forEach((element) => tween(element, value));
}

function view(value, year)
{
    return state.inflationOn ? toReal(value, state.inflationPct, year) : value;
}

function viewedRow(row, year = row.year)
{
    return { ...row, deposits: view(row.deposits, year), interest: view(row.interest, year), balance: view(row.balance, year) };
}

function tail(parameters)
{
    return simulate({ ...state, ...parameters }).at(-1);
}

function pathFor(points)
{
    if (points.length < 2)
    {
        return points.length ? `M${points[0][0]},${points[0][1]}` : "";
    }
    const slopes = points.slice(1).map((p, i) => (p[1] - points[i][1]) / (p[0] - points[i][0]));
    const tangents = points.map((_, i) => i === 0 ? slopes[0] : i === points.length - 1 ? slopes.at(-1) : (slopes[i - 1] + slopes[i]) / 2);
    slopes.forEach((slope, i) =>
    {
        if (slope === 0)
        {
            tangents[i] = 0;
            tangents[i + 1] = 0;
        }
        else
        {
            const length = Math.hypot(tangents[i] / slope, tangents[i + 1] / slope);
            if (length > 3)
            {
                tangents[i] *= 3 / length;
                tangents[i + 1] *= 3 / length;
            }
        }
    });
    return points.slice(1).reduce((path, point, index) =>
    {
        const previous = points[index];
        const dx = (point[0] - previous[0]) / 3;
        return `${path} C${previous[0] + dx},${previous[1] + dx * tangents[index]} ${point[0] - dx},${point[1] - dx * tangents[index + 1]} ${point[0]},${point[1]}`;
    }, `M${points[0][0]},${points[0][1]}`);
}

function areaBetween(upper, lower)
{
    return `${pathFor(upper)} ${lower.slice().reverse().map(([x, y]) => `L${x},${y}`).join(" ")} Z`;
}

function chartFrame(svg, maxX, maxY, options = {})
{
    const width = Math.max(250, svg.clientWidth);
    const height = svg.clientHeight || 300;
    const pad = { left: width < 400 ? 43 : 54, right: 16, top: 35, bottom: 34, ...options };
    const x = (value) => pad.left + value / Math.max(1, maxX) * (width - pad.left - pad.right);
    const y = (value) => height - pad.bottom - value / Math.max(1, maxY) * (height - pad.top - pad.bottom);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const grid = Array.from({ length: 5 }, (_, i) =>
    {
        const value = maxY * i / 4;
        return `<line class="gridline" x1="${pad.left}" x2="${width - pad.right}" y1="${y(value)}" y2="${y(value)}"/><text x="${pad.left - 10}" y="${y(value) + 3}" text-anchor="end">${compact.format(value)}</text>`;
    }).join("");
    return { width, height, pad, x, y, grid };
}

function renderArea()
{
    const svg = $("#area-chart");
    const data = rows.map((row) => viewedRow(row));
    const maxY = Math.max(100, ...data.map((row) => row.balance)) * 1.12;
    const { width, height, pad, x, y, grid } = chartFrame(svg, state.years, maxY);
    const base = data.map((row) => [x(row.year), y(row.deposits)]);
    const top = data.map((row) => [x(row.year), y(row.balance)]);
    const floor = [[x(0), y(0)], [x(state.years), y(0)]];
    const ticks = Array.from(new Set([0, ...Array.from({ length: Math.floor(state.years / (state.years > 25 ? 10 : 5)) }, (_, i) => (i + 1) * (state.years > 25 ? 10 : 5)), state.years]));
    const crossover = crossoverYear(rows);
    svg.innerHTML = `${grid}<path d="${areaBetween(top, base)}" fill="var(--green)" opacity=".9"/><path d="${areaBetween(base, floor)}" fill="var(--slate)" opacity=".9"/><path d="${pathFor(top)}" fill="none" stroke="var(--deep)" stroke-width="2.2" stroke-linecap="round"/>${ticks.map((tick) => `<text x="${x(tick)}" y="${height - 13}" text-anchor="middle">${number.format(tick)}</text>`).join("")}
        <text x="${width - pad.right}" y="15" text-anchor="end" opacity=".8">${state.inflationOn ? words.real : words.nominal}</text>
        ${crossover === null ? "" : `<line x1="${x(crossover)}" x2="${x(crossover)}" y1="${y(data[crossover].balance) - 25}" y2="${y(data[crossover].balance)}" stroke="var(--amber)" stroke-width="1.5"/><circle cx="${x(crossover)}" cy="${y(data[crossover].balance)}" r="4" fill="var(--amber)" stroke="var(--card)" stroke-width="1.5"/>`}
        <g id="crosshair" hidden><line id="cross-line" y1="${pad.top}" y2="${height - pad.bottom}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/><circle id="cross-balance" r="4" fill="var(--green)" stroke="var(--card)" stroke-width="2"/><circle id="cross-deposits" r="4" fill="var(--slate)" stroke="var(--card)" stroke-width="2"/></g>`;
    write("#crossover-note", crossover === null ? words.noCrossover : words.crossover(number.format(crossover)));
    if (exploredYear !== null)
    {
        showPoint(exploredYear);
    }
}

function showPoint(year)
{
    exploredYear = Math.max(0, Math.min(state.years, year));
    const row = viewedRow(rows[exploredYear]);
    const svg = $("#area-chart");
    const width = Math.max(250, svg.clientWidth);
    const height = svg.clientHeight || 300;
    const left = width < 400 ? 43 : 54;
    const max = Math.max(100, ...rows.map((entry) => view(entry.balance, entry.year))) * 1.12;
    const x = left + row.year / state.years * (width - left - 16);
    const y = (value) => height - 34 - value / max * (height - 35 - 34);
    $("#crosshair").removeAttribute("hidden");
    $("#cross-line").setAttribute("x1", x);
    $("#cross-line").setAttribute("x2", x);
    for (const [id, value] of [["cross-balance", row.balance], ["cross-deposits", row.deposits]])
    {
        $(`#${id}`).setAttribute("cx", x);
        $(`#${id}`).setAttribute("cy", y(value));
    }
    const label = words.point(number.format(row.year), formatMoney(row.deposits), formatMoney(row.interest), formatMoney(row.balance));
    $("#chart-tooltip").hidden = false;
    $("#chart-tooltip").innerHTML = `<strong>Year ${number.format(row.year)}</strong><span class="num">${words.deposited} ${formatMoney(row.deposits)}<br>${words.interest} ${formatMoney(row.interest)}<br>${words.balance} ${formatMoney(row.balance)}</span>`;
    svg.setAttribute("aria-label", label);
}

function renderStory()
{
    const limit = activeStep === 0 ? 1 : activeStep === 1 ? Math.min(5, state.years) : state.years;
    const data = rows.slice(1, limit + 1).map((row) => viewedRow(row));
    const svg = $("#story-chart");
    const { height, x, y, grid } = chartFrame(svg, limit, Math.max(100, ...data.map((row) => row.balance)) * 1.15);
    const crossover = crossoverYear(rows);
    const barWidth = Math.min(60, (x(1) - x(0)) * .65);
    svg.innerHTML = `${grid}${data.map((row) =>
    {
        const highlighted = activeStep < 2 || (activeStep === 2 ? crossover === null || row.year >= crossover : row.year > state.years - 10);
        const bx = x(row.year - .5) - barWidth / 2;
        return `<g opacity="${highlighted ? 1 : .3}"><rect x="${bx}" y="${y(row.deposits)}" width="${barWidth}" height="${Math.max(0, y(0) - y(row.deposits))}" fill="var(--slate)"/><rect x="${bx}" y="${y(row.balance)}" width="${barWidth}" height="${Math.max(0, y(row.deposits) - y(row.balance))}" fill="var(--green)"/></g>`;
    }).join("")}<text x="${x(0)}" y="${height - 10}">0</text><text x="${x(limit)}" y="${height - 10}" text-anchor="end">${number.format(limit)} years</text>`;
    if (activeStep === 2 && crossover !== null)
    {
        svg.innerHTML += `<circle cx="${x(crossover - .5)}" cy="${y(viewedRow(rows[crossover]).balance) - 8}" r="4" fill="var(--amber)"/>`;
    }
    write("#story-title", words.storyLabels[activeStep]);
    write("#step-indicator", `${number.format(activeStep + 1)} / ${number.format(words.steps.length)}`);
    const growth = view(rows.at(-1).balance, state.years) - view(rows[Math.max(0, state.years - 10)].balance, Math.max(0, state.years - 10));
    write("#story-detail", activeStep === 3 ? words.lastGrowth(formatMoney(growth)) : state.inflationOn ? words.real : words.nominal);
}

function renderScenarios()
{
    const shorter = Math.floor(state.years / 2);
    const a = viewedRow(tail({ monthly: state.monthly * 2, years: shorter }));
    const b = viewedRow(rows.at(-1));
    const max = Math.max(1, a.balance, b.balance);
    write("#scenario-lede", words.scenarioLede(formatMoney(a.deposits), formatMoney(b.deposits)));
    for (const [id, row, monthly, years] of [["a", a, state.monthly * 2, shorter], ["b", b, state.monthly, state.years]])
    {
        write(`#scenario-${id}-period`, words.scenarioPeriod(formatMoney(monthly), number.format(years)));
        amount(`#scenario-${id}-value`, row.balance);
        write(`#scenario-${id}-deposits`, `${words.deposited} ${formatMoney(row.deposits)}`);
        $(`#scenario-${id}-bar`).setAttribute("viewBox", "0 0 300 24");
        $(`#scenario-${id}-bar`).innerHTML = `<rect width="300" height="20" y="2" rx="3" fill="var(--paper2)"/><rect width="${row.deposits / max * 300}" height="20" y="2" rx="2" fill="var(--slate)"/><rect x="${row.deposits / max * 300}" width="${row.interest / max * 300}" height="20" y="2" rx="2" fill="var(--green)"/>`;
    }
    write("#scenario-conclusion", words.scenarioConclusion(a.balance === 0 ? 0 : formatMoney(a.balance), formatMoney(b.balance), state.years % 2 === 0 && !state.inflationOn));
}

function saverRows()
{
    const early = simulate({ ...state, years: config.retirement - config.ages[0] });
    const late = simulate({ ...state, years: config.retirement - config.ages[1] });
    return { early, late };
}

function renderComparison()
{
    const { early, late } = saverRows();
    const data = early.map((row) =>
    {
        const yearsLate = Math.max(0, row.year - (config.ages[1] - config.ages[0]));
        return { age: config.ages[0] + row.year, a: view(row.balance, row.year), b: view(late[yearsLate].balance, row.year) };
    });
    const svg = $("#compare-chart");
    const max = Math.max(100, ...data.map((row) => row.a)) * 1.16;
    const { width, height, x, y, grid } = chartFrame(svg, config.retirement - config.ages[0], max, { right: svg.clientWidth < 500 ? 18 : 132 });
    const current = data.filter((row) => row.age <= age);
    const a = current.map((row) => [x(row.age - config.ages[0]), y(row.a)]);
    const b = current.map((row) => [x(row.age - config.ages[0]), y(row.b)]);
    const end = current.at(-1);
    const ex = x(age - config.ages[0]);
    const hasGap = Math.abs(end.a - end.b) > 1;
    svg.innerHTML = `${grid}
        <path d="${areaBetween(a, [[x(0), y(0)], [ex, y(0)]])}" fill="var(--green)" opacity=".06"/>
        <path d="${areaBetween(b, [[x(0), y(0)], [ex, y(0)]])}" fill="var(--slate)" opacity=".08"/>
        <path d="${pathFor(a)}" stroke="var(--green)" stroke-width="2.5" fill="none"/>
        <path d="${pathFor(b)}" stroke="var(--slate)" stroke-width="2.5" fill="none"/>
        <line x1="${ex}" x2="${ex}" y1="25" y2="${y(0)}" stroke="var(--ink)" opacity=".25" stroke-dasharray="3 4"/>
        <circle cx="${ex}" cy="${y(end.a)}" r="4" fill="var(--green)"/><circle cx="${ex}" cy="${y(end.b)}" r="4" fill="var(--slate)"/>
        ${[25, 35, 45, 55, 65].map((tick) => `<text x="${x(tick - config.ages[0])}" y="${height - 10}" text-anchor="middle">${number.format(tick)}</text>`).join("")}
        <text x="${width - 16}" y="16" text-anchor="end">${words.gap(formatMoney(end.a - end.b))}</text>
        <text x="${width < 500 ? ex - 5 : ex + 12}" y="${Math.max(30, y(end.a) - 10)}" text-anchor="${width < 500 ? "end" : "start"}" style="fill:var(--deep)">Maya ${formatMoney(end.a)}</text>
        <text x="${width < 500 ? ex - 5 : ex + 12}" y="${Math.min(height - 42, y(end.b) + (hasGap ? 18 : -30))}" text-anchor="${width < 500 ? "end" : "start"}">Theo ${formatMoney(end.b)}</text>
        ${age === config.retirement && hasGap ? `<path d="M${ex - 6} ${y(end.a)}h-7V${y(end.b)}h7" fill="none" stroke="var(--ink)" stroke-width="1"/>` : ""}`;
    write("#age-readout", words.ageReadout(number.format(age), formatMoney(end.a), formatMoney(end.b)));
    $("#age-scrubber").value = age;
    fillSlider($("#age-scrubber"));
    const horizon = config.retirement - config.ages[0];
    amount("#maya-deposits", view(early.at(-1).deposits, horizon));
    amount("#theo-deposits", view(late.at(-1).deposits, horizon));
    write("#extra-summary", words.extra(formatMoney(view(early.at(-1).deposits - late.at(-1).deposits, horizon)), formatMoney(view(early.at(-1).balance - late.at(-1).balance, horizon))));
}

function renderBasket()
{
    const purchasingPower = toReal(100, state.inflationPct, state.years);
    const filled = Math.round(purchasingPower / 10);
    $("#basket-chart").innerHTML = `<path d="m60 75 28 80h128l25-80M42 75h215M95 75l35-55M204 75l-35-55M98 97l12 40M142 97v40M187 97l-12 40" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${Array.from({ length: 10 }, (_, index) =>
    {
        const x = 70 + index % 5 * 33;
        const y = 31 + Math.floor(index / 5) * 28;
        return `<rect x="${x}" y="${y}" width="25" height="24" rx="7" fill="${index < filled ? ["var(--green)", "var(--slate)", "var(--coral)"][index % 3] : "var(--paper)"}" stroke="${index < filled ? "none" : "var(--rule)"}" stroke-width="2" stroke-dasharray="${index < filled ? "0" : "3 3"}"/>`;
    }).join("")}`;
    write("#basket-copy", words.basket(formatMoney(purchasingPower), number.format(state.years)));
    amount("#nominal-amount", rows.at(-1).balance);
    amount("#real-amount", toReal(rows.at(-1).balance, state.inflationPct, state.years));
}

function renderFormula()
{
    const i = Math.expm1(state.perYear / 12 * Math.log1p(state.ratePct / 100 / state.perYear));
    const rate = decimalRate.format(state.ratePct / 100);
    write("#rate-formula", `i = (1 + ${rate} / ${number.format(state.perYear)})^(${number.format(state.perYear)} / 12) − 1 = ${precise.format(i)}`);
    write("#balance-formula", i === 0 ? words.zeroFormula(number.format(state.monthly), number.format(state.years * 12), formatMoney(rows.at(-1).balance)) : `Balance = ${number.format(state.monthly)} × ((${precise.format(1 + i)})^${number.format(state.years * 12)} − 1) / ${precise.format(i)} = ${formatMoney(rows.at(-1).balance)}`);
    write("#formula-note", words.formulaNote(state.inflationOn));
    $("#frequency-rows").innerHTML = config.frequencies.map(([perYear, name]) =>
    {
        const row = tail({ perYear });
        return `<tr class="${state.perYear === perYear ? "selected" : ""}"><th scope="row">${name}</th><td class="num">${formatMoney(view(row.balance, state.years))}</td></tr>`;
    }).join("");
    write("#table-note", words.tableNote(state.inflationOn));
    $("#year-head").innerHTML = `<tr>${words.tableHead.map((title) => `<th scope="col">${title}</th>`).join("")}${state.inflationOn ? `<th scope="col">${words.nominalBalance}</th>` : ""}</tr>`;
    $("#year-rows").innerHTML = rows.slice(1).map((raw) =>
    {
        const row = viewedRow(raw);
        return `<tr><th scope="row" class="num">${number.format(row.year)}</th><td class="num">${formatMoney(row.deposits)}</td><td class="num">${formatMoney(row.interest)}</td><td class="num">${formatMoney(row.balance)}</td>${state.inflationOn ? `<td class="num">${formatMoney(raw.balance)}</td>` : ""}</tr>`;
    }).join("");
}

function fillSlider(slider)
{
    const fill = (Number(slider.value) - Number(slider.min)) / (Number(slider.max) - Number(slider.min)) * 100;
    slider.style.setProperty("--fill", `${fill}%`);
}

function renderCharts()
{
    renderArea();
    renderStory();
    renderComparison();
}

function update()
{
    rows = simulate(state);
    const last = viewedRow(rows.at(-1));
    amount('[data-number="monthly"]', state.monthly);
    amount('[data-number="balance"]', last.balance);
    amount('[data-number="deposits"]', last.deposits);
    amount('[data-number="interest"]', last.interest);
    write("#balance-label", words.after(number.format(state.years)));
    write("#interest-share", percent.format(last.balance === 0 ? 0 : last.interest / last.balance));
    $$(".mode-buttons button").forEach((button) => button.setAttribute("aria-pressed", String((button.dataset.mode === "true") === state.inflationOn)));
    $("#real-switch").checked = state.inflationOn;
    $("#hero-inflation").hidden = !state.inflationOn;
    $("#mode-badge").hidden = !state.inflationOn;
    write("#mode-badge", words.mode(fmtPercent(state.inflationPct)));
    $$("input[data-key]").forEach((slider) =>
    {
        slider.value = state[slider.dataset.key];
        fillSlider(slider);
    });
    $$("[data-output]").forEach((output) =>
    {
        const key = output.dataset.output;
        output.textContent = key === "monthly" ? formatMoney(state[key]) : key === "years" ? number.format(state[key]) : fmtPercent(state[key]);
    });
    const first = viewedRow(rows[1]);
    const second = viewedRow(tail({ years: 2 }));
    write("#step-copy-0", words.chapterOne(formatMoney(first.deposits), fmtPercent(state.ratePct), formatMoney(first.interest)));
    write("#step-copy-1", words.chapterTwo(formatMoney(first.interest), formatMoney(second.interest)));
    write("#step-copy-2", words.bend(crossoverYear(rows)));
    const backYear = Math.max(0, state.years - 10);
    const growth = last.balance - view(rows[backYear].balance, backYear);
    write("#step-copy-3", words.snowball(state.years, formatMoney(growth), ratioFormat.format(last.deposits ? growth / last.deposits : 0)));
    write("#compare-lede", words.compareLede(formatMoney(state.monthly), fmtPercent(state.ratePct)));
    $$("[data-frequency]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.frequency) === state.perYear)));
    renderCharts();
    renderScenarios();
    renderBasket();
    renderFormula();
}

function stopPlaying()
{
    cancelAnimationFrame(playing);
    playing = null;
    write("#play span", words.play);
    $("#play").setAttribute("aria-pressed", "false");
}

$$("input[data-key]").forEach((slider) =>
{
    slider.addEventListener("pointerdown", () => { dragging = true; });
    slider.addEventListener("input", () =>
    {
        state[slider.dataset.key] = Number(slider.value);
        stopPlaying();
        update();
    });
});
window.addEventListener("pointerup", () => { dragging = false; });
window.addEventListener("pointercancel", () => { dragging = false; });
$$("[data-mode]").forEach((button) => button.addEventListener("click", () =>
{
    state.inflationOn = button.dataset.mode === "true";
    update();
}));
$("#real-switch").addEventListener("change", (event) =>
{
    state.inflationOn = event.target.checked;
    update();
});
$$("[data-frequency]").forEach((button) => button.addEventListener("click", () =>
{
    state.perYear = Number(button.dataset.frequency);
    update();
}));

const areaChart = $("#area-chart");
areaChart.addEventListener("pointermove", (event) =>
{
    const rect = areaChart.getBoundingClientRect();
    const left = rect.width < 400 ? 43 : 54;
    showPoint(Math.round((event.clientX - rect.left - left) / (rect.width - left - 16) * state.years));
});
areaChart.addEventListener("pointerleave", () =>
{
    if (document.activeElement !== areaChart)
    {
        $("#chart-tooltip").hidden = true;
        $("#crosshair").setAttribute("hidden", "");
        exploredYear = null;
    }
});
areaChart.addEventListener("focus", () => showPoint(exploredYear ?? state.years));
areaChart.addEventListener("blur", () =>
{
    $("#chart-tooltip").hidden = true;
    $("#crosshair").setAttribute("hidden", "");
    exploredYear = null;
});
areaChart.addEventListener("keydown", (event) =>
{
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key))
    {
        return;
    }
    event.preventDefault();
    showPoint(event.key === "Home" ? 0 : event.key === "End" ? state.years : (exploredYear ?? state.years) + (event.key === "ArrowRight" ? 1 : -1));
});

$("#age-scrubber").addEventListener("input", (event) =>
{
    stopPlaying();
    age = Number(event.target.value);
    renderComparison();
});
$("#play").addEventListener("click", () =>
{
    if (playing !== null)
    {
        stopPlaying();
        return;
    }
    if (reducedMotion.matches)
    {
        age = config.retirement;
        renderComparison();
        return;
    }
    const start = performance.now();
    write("#play span", words.pause);
    $("#play").setAttribute("aria-pressed", "true");
    function frame(now)
    {
        age = Math.min(config.retirement, config.ages[0] + Math.floor((now - start) / 6000 * (config.retirement - config.ages[0])));
        renderComparison();
        if (age < config.retirement)
        {
            playing = requestAnimationFrame(frame);
        }
        else
        {
            stopPlaying();
        }
    }
    playing = requestAnimationFrame(frame);
});
reducedMotion.addEventListener("change", () =>
{
    stopPlaying();
    age = config.retirement;
    update();
});

$("#menu-button").addEventListener("click", () =>
{
    const open = $("#mobile-menu").hidden;
    $("#mobile-menu").hidden = !open;
    $("#menu-button").setAttribute("aria-expanded", String(open));
});
function closeMenu()
{
    $("#mobile-menu").hidden = true;
    $("#menu-button").setAttribute("aria-expanded", "false");
}
$$('#mobile-menu a').forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !$("#mobile-menu").hidden)
    {
        closeMenu();
        $("#menu-button").focus();
    }
});
window.addEventListener("scroll", () => $("header").classList.toggle("scrolled", scrollY > 8), { passive: true });
$$(".faq").forEach((item) => item.addEventListener("toggle", () =>
{
    if (item.open)
    {
        $$(".faq").filter((other) => other !== item).forEach((other) => { other.open = false; });
    }
}));

const observer = new IntersectionObserver((entries) =>
{
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible)
    {
        activeStep = Number(visible.target.dataset.step);
        $$(".story-step").forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === activeStep));
        renderStory();
    }
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
$$(".story-step").forEach((step) => observer.observe(step));
$(".story-step").classList.add("active");

update();
const resizeObserver = new ResizeObserver(() => requestAnimationFrame(renderCharts));
$$(".chart-wrap, .story-sticky, .comparison-card").forEach((element) => resizeObserver.observe(element));
window.addEventListener("pagehide", () =>
{
    stopPlaying();
    resizeObserver.disconnect();
    observer.disconnect();
});
