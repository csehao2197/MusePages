export const config =
{
    brand: "Tallypine",
    locale: "en-US",
    currency: "USD",
    defaults: { monthly: 200, ratePct: 6, years: 40, perYear: 12, inflationOn: false, inflationPct: 2.5 },
    ranges: { monthly: [0, 2000, 25], ratePct: [0, 12, 0.1], years: [1, 50, 1], inflationPct: [0, 6, 0.1] },
    ages: [25, 35],
    retirement: 65,
    frequencies: [[1, "Yearly"], [4, "Quarterly"], [12, "Monthly"], [365, "Daily"]]
};

export const words =
{
    nominal: "Nominal",
    real: "Today's money",
    deposited: "Deposited",
    interest: "Interest earned",
    balance: "Balance",
    years: "Years",
    monthly: "Monthly deposit",
    ratePct: "Annual rate · hypothetical",
    inflationPct: "Inflation · hypothetical",
    noCrossover: "Interest does not overtake deposits in this range.",
    mode: (pct) => `In today's money · ${pct} inflation`,
    after: (years) => `Balance after ${years} years`,
    crossover: (year) => `Year ${year}: interest passes deposits`,
    share: (share) => `${share} interest share`,
    chartHelp: "Hover or drag to explore. Keyboard: focus the chart and use the arrow keys.",
    point: (year, deposits, interest, balance) => `Year ${year} · Deposited ${deposits} · Interest ${interest} · Balance ${balance}`,
    chapterOne: (deposit, rate, interest) => `Over twelve months, deposits add up to ${deposit}. At a hypothetical ${rate}, they earn ${interest} in interest. The slate layer does most of the work.`,
    chapterTwo: (first, second) => `In year two, the first year's ${first} of interest starts earning too. Total interest reaches ${second}: new deposits and past interest both contribute.`,
    bend: (year) => year === null ? "The green layer stays smaller than deposits over this range. A curve can compound without reaching a crossover." : `By year ${year}, total interest is greater than all deposits combined. That is a cumulative milestone, not the year annual interest first exceeds annual deposits.`,
    snowball: (years, amount, ratio) => `Over the last ${Math.min(10, years)} years, the balance grows by ${amount}. That is ${ratio} times the deposits made across the full ${years}-year period.`,
    scenarioLede: (totalA, totalB) => `One example doubles the monthly deposit for half as long; the other lets time run. Total deposits: ${totalA} and ${totalB}, respectively.`,
    scenarioPeriod: (monthly, years) => `${monthly} a month for ${years} years`,
    scenarioConclusion: (a, b, same) => a === 0 ? "With no deposits, both examples stay at zero. Time needs something to work with." : `${same ? "Same money in." : "Different horizons; compare the deposits too."} The longer example ends with ${b} versus ${a}. The rate and time determine the difference.`,
    compareLede: (monthly, rate) => `Maya starts putting ${monthly} a month away at 25. Theo starts at 35. Both stop at 65, with the same hypothetical ${rate}. These are two invented savers.`,
    ageReadout: (age, a, b) => `Age ${age}: Maya ${a} · Theo ${b}`,
    gap: (value) => `Gap ${value}`,
    extra: (deposit, gap) => `Maya puts in ${deposit} more and ends with ${gap} more.`,
    inflationLede: "A balance decades away is measured in future prices. Adjusting for hypothetical inflation puts it on today's scale. Both views describe the same example.",
    basket: (real, years) => `The purchasing power of $100 received in year ${years} is ${real} in today's money.`,
    frequencyNote: "Frequency moves the result a little. Time can move it much more.",
    formulaNote: (real) => real ? "The formula gives the nominal balance. Today's-money values divide each year's result by that year's inflation factor." : "Deposits arrive at the end of each month. The quoted annual rate is nominal, compounded at the selected frequency.",
    zeroFormula: (monthly, months, total) => `When i = 0: Balance = ${monthly} × ${months} = ${total}`,
    showTable: "Show the year-by-year table",
    hideTable: "Hide the year-by-year table",
    tableNote: (real) => real ? "Today's-money view: each row is discounted by its own year. Deposits and interest are discounted together for a consistent stack." : "Nominal values. Deposits are added at the end of every month. Figures are rounded only for display.",
    tableHead: ["Year", "Deposited", "Interest", "Balance"],
    realBalance: "Balance in today's money",
    nominalBalance: "Nominal balance",
    play: "Play the decades",
    pause: "Pause",
    steps: ["Year one", "Interest on interest", "The bend", "The snowball"],
    storyLabels: ["A small beginning", "The first five years", "When interest takes the lead", "The last decade"],
    lastGrowth: (value) => `Growth in the highlighted years: ${value}`,
    faq:
    [
        ["Is 6% a realistic rate?", "It is a round, hypothetical number chosen to make the shape of the curve easy to see. Real returns vary year to year, can be negative, and are never guaranteed. Try 3% or 9% with the slider to see how much the rate changes the outcome."],
        ["Why the same deposit every month?", "To isolate one idea: what time and compounding do on their own. Real life has raises, gaps and withdrawals, which this explainer leaves out on purpose."],
        ["What about taxes and fees?", "They are not included. A lower rate can illustrate their effect approximately; actual taxes and fees depend on their timing and structure."],
        ["Does this tell me what to invest in?", "No. Tallypine explains how the math works. It does not recommend any account, product or strategy, and it does not know your situation."],
        ["Why switch to today's money?", "Because a balance decades away is measured in future prices. Adjusting for a hypothetical inflation rate makes it easier to compare with what money buys now."]
    ],
    images:
    [
        ["compounding-seedling", "A small green seedling growing out of a glass jar half filled with plain coins, painted in gouache on cream paper.", "A little growth. Then growth on that growth."],
        ["time-hourglass", "An hourglass whose falling sand turns into green leaves gathering in the lower bulb.", "Time does the heavy lifting."],
        ["two-paths", "Two winding paths of different lengths climbing a gentle hill toward the same large tree at the top.", "Two starting points. One destination."],
        ["inflation-basket", "A woven market basket holding a loaf of bread and a few apples beside a short stack of plain coins.", "The same basket, a different price."]
    ],
    nav: [["tool", "The tool"], ["time", "Why time wins"], ["compare", "Start at 25 vs 35"], ["inflation", "Inflation"], ["formula", "The formula"]]
};

export function icon(name)
{
    const paths =
    {
        sprout: '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4M5 21h14"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
        menu: '<path d="M4 5h16M4 12h16M4 19h16"/>',
        play: '<path d="m9 5 12 7-12 7z"/>',
        arrow: '<path d="M7 7h10v10M7 17 17 7"/>',
        down: '<path d="M12 5v14m-7-7 7 7 7-7"/>',
        plus: '<path d="M12 5v14M5 12h14"/>'
    };
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function picture(index)
{
    const [file, alt, caption] = words.images[index];
    return `<figure><img src="./images/${file}.webp" alt="${alt}" loading="lazy" width="800" height="600"><figcaption>${caption}</figcaption></figure>`;
}

function modeButtons()
{
    return `<div class="segmented mode-buttons" role="group" aria-label="Money display"><button data-mode="false" aria-pressed="true">${words.nominal}</button><button data-mode="true" aria-pressed="false">${words.real}</button></div>`;
}

function slider(key, id = key)
{
    const [min, max, step] = config.ranges[key];
    return `<div class="slider-row"><div class="slider-label"><label for="${id}">${words[key]}</label><output class="num" for="${id}" data-output="${key}"></output></div><input id="${id}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${config.defaults[key]}"></div>`;
}

export function markup()
{
    const links = words.nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("");
    return `
    <a class="skip" href="#tool">Skip to calculator</a>
    <header><div class="header-inner"><a class="brand" href="./index.html"><span class="brand-mark">${icon("sprout")}</span>${config.brand}</a><nav aria-label="Chapters">${links}</nav><div class="header-tools">${modeButtons()}<button id="menu-button" class="icon-button" aria-label="Open chapter menu" aria-expanded="false" aria-controls="mobile-menu">${icon("menu")}</button></div></div><nav id="mobile-menu" aria-label="Mobile chapters" hidden>${links}</nav></header>
    <div class="disclaimer"><div class="container">${icon("info")}<p><strong>Illustrative only.</strong> Every rate is hypothetical, not a forecast. This is not financial advice, and returns are not guaranteed.</p></div></div>
    <main>
        <section id="tool" class="hero container">
            <div class="hero-intro"><p class="eyebrow"><span class="tiny-line"></span>An interactive explainer from Tallypine</p><h1>Watch <span data-number="monthly"></span> a month quietly become <em data-number="balance"></em><span class="period">.</span></h1><p class="lede">Drag the sliders. The slate layer is money you put in; the green layer is interest, and interest on that interest.</p></div>
            <div class="controls card"><div class="control-title"><span>A little every month</span>${icon("sprout")}</div>${slider("monthly")}${slider("ratePct")}${slider("years")}<div class="control-bottom"><label class="switch-label"><input id="real-switch" type="checkbox"><span class="switch" aria-hidden="true"></span>Show in today's money</label><div id="hero-inflation" hidden>${slider("inflationPct")}</div></div></div>
            <div class="hero-chart card">
                <div class="chart-top"><span id="balance-label" class="eyebrow"></span><span class="hypo-label">Hypothetical example</span></div>
                <p id="mode-badge" class="mode-badge" hidden></p><div id="final-balance" class="big-number num" data-number="balance"></div>
                <div class="stats"><div><span class="dot slate"></span>Deposited<strong class="num" data-number="deposits"></strong></div><div><span class="dot green"></span>Interest earned<strong class="num" data-number="interest"></strong></div><div><span class="dot hollow"></span>Interest share<strong class="num" id="interest-share"></strong></div></div>
                <div class="chart-wrap"><svg id="area-chart" class="area-chart" role="img" aria-label="Hypothetical balance by year. Arrow keys explore values." tabindex="0"></svg><div id="chart-tooltip" class="chart-tooltip" hidden></div></div>
                <p id="crossover-note" class="crossover-note"></p><div class="chart-bottom"><div class="legend"><span><i class="slate"></i>Your deposits</span><span><i class="green"></i>Interest</span></div><a href="#compound">See how it works ${icon("down")}</a></div>
            </div>
            <div class="hero-foot"><span>Small amounts. Long horizons. A different shape.</span><span>01 — The compounding effect</span></div>
        </section>
        <section id="compound" class="section story-section">
            <div class="container"><p class="eyebrow">Chapter 1 · The idea</p><h2>Interest that earns<br><em>its own</em> interest.</h2><p class="section-lede">At first, most of the balance is what went in. Then the interest begins to earn interest of its own.</p>
            <div class="story-layout"><div class="story-copy">${picture(0)}${words.steps.map((title, i) => `<article class="story-step" data-step="${i}"><span class="step-number num">0${i + 1}</span><h3>${title}</h3><p id="step-copy-${i}"></p></article>`).join("")}</div><div class="story-sticky card"><div class="chart-top"><span class="eyebrow">The same example, year by year</span><span class="num" id="step-indicator"></span></div><h3 id="story-title"></h3><svg id="story-chart" role="img" aria-label="Yearly deposits and accumulated interest"></svg><p id="story-detail"></p><div class="legend"><span><i class="slate"></i>Deposits</span><span><i class="green"></i>Interest</span></div></div></div></div>
        </section>
        <section id="time" class="section container"><p class="eyebrow">Chapter 2 · The quiet advantage</p><h2>Double the time,<br>not <em>the deposit.</em></h2><p class="section-lede" id="scenario-lede"></p><div class="time-layout"><div><div class="scenario-grid"><article class="scenario card"><span class="eyebrow">A · Double the deposit</span><p id="scenario-a-period"></p><strong class="scenario-value num" id="scenario-a-value"></strong><svg id="scenario-a-bar" role="img" aria-label="Double deposit scenario, deposits and interest"></svg><p class="small" id="scenario-a-deposits"></p></article><article class="scenario card preferred"><span class="eyebrow">B · Double the years</span><p id="scenario-b-period"></p><strong class="scenario-value num" id="scenario-b-value"></strong><svg id="scenario-b-bar" role="img" aria-label="Longer time scenario, deposits and interest"></svg><p class="small" id="scenario-b-deposits"></p></article></div><p id="scenario-conclusion" class="pullquote"></p><p class="small">The shorter horizon is rounded down to whole years. An odd year count means the deposits differ.</p></div>${picture(1)}</div></section>
        <section id="compare" class="section comparison-section"><div class="container"><p class="eyebrow">Chapter 3 · A head start</p><div class="section-title-row"><h2>Same deposit.<br><em>Ten years</em> apart.</h2><p class="section-lede" id="compare-lede"></p></div><div class="card comparison-card"><div class="chart-top"><div class="legend"><span><i class="green"></i>Maya · starts at 25</span><span><i class="slate"></i>Theo · starts at 35</span></div><button id="play" class="primary-button">${icon("play")}<span>${words.play}</span></button></div><svg id="compare-chart" role="img" aria-label="Hypothetical balances of two invented savers, ages 25 through 65"></svg><label class="sr-only" for="age-scrubber">Explore savers' age</label><input id="age-scrubber" type="range" min="25" max="65" step="1" value="65"><p id="age-readout" class="num" aria-live="polite"></p></div><div class="comparison-stats"><div><span>Maya deposited</span><strong id="maya-deposits" class="num"></strong></div><div><span>Theo deposited</span><strong id="theo-deposits" class="num"></strong></div><p id="extra-summary"></p></div><div class="closing-row">${picture(2)}<p>The ten years Theo missed were not just ten years of deposits. They were the first ten years of compounding, the ones every later dollar would have been built on.</p></div></div></section>
        <section id="inflation" class="section container"><p class="eyebrow">Chapter 4 · Another way to see it</p><h2>A big number is not <em>the same</em><br>as big buying power.</h2><p class="section-lede">${words.inflationLede}</p><div class="inflation-layout"><div><div class="card inflation-controls"><span class="eyebrow">Change the lens, not the example</span>${modeButtons()}${slider("inflationPct", "inflation-secondary")}</div><div class="basket-row"><svg id="basket-chart" viewBox="0 0 300 180" role="img" aria-label="Illustration of remaining purchasing power"></svg><p id="basket-copy"></p></div><div class="inflation-values"><div><span>Nominal balance</span><strong id="nominal-amount" class="num"></strong></div><span class="coral-arrow">→</span><div><span>In today's money</span><strong id="real-amount" class="num"></strong></div></div></div>${picture(3)}</div></section>
        <section id="formula" class="section formula-section"><div class="container"><p class="eyebrow">Under the hood</p><div class="formula-layout"><div><h2>The math,<br><em>with your numbers.</em></h2><p>Each month the balance grows by a small rate, then the deposit is added. Repeat for every month. The formula does all of those months at once.</p><dl class="formula-key"><div><dt>PMT</dt><dd>Monthly deposit</dd></div><div><dt>r</dt><dd>Annual rate as a decimal</dd></div><div><dt>n</dt><dd>Compounding periods per year</dd></div><div><dt>t</dt><dd>Number of years</dd></div></dl></div><div><div class="card formula-card"><div class="formula-num">i = (1 + r / n)<sup>n / 12</sup> − 1</div><p class="num live-formula" id="rate-formula"></p><hr><div class="formula-num">Balance = PMT ×<br>((1 + i)<sup>12 × t</sup> − 1) / i</div><p class="num live-formula" id="balance-formula"></p><p class="small" id="formula-note"></p></div><fieldset class="frequency-field"><legend class="eyebrow">Compounding frequency</legend><div class="segmented frequency-buttons">${config.frequencies.map(([n, name]) => `<button data-frequency="${n}" aria-pressed="${n === 12}">${name}</button>`).join("")}</div></fieldset><h3 class="frequency-title">How much frequency matters</h3><table class="frequency-table"><caption class="sr-only">Balances at different compounding frequencies</caption><thead><tr><th scope="col">Frequency</th><th scope="col">Final balance</th></tr></thead><tbody id="frequency-rows"></tbody></table><p class="small">${words.frequencyNote}</p></div></div><details id="year-details" class="year-details"><summary>${words.showTable}<span aria-hidden="true">+</span></summary><p class="small" id="table-note"></p><div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable year-by-year results"><table class="year-table"><thead id="year-head"></thead><tbody id="year-rows"></tbody></table></div></details></div></section>
        <section class="section questions container"><p class="eyebrow">A few things worth asking</p><h2>Fair questions.</h2><div class="faq-list">${words.faq.map(([q, a]) => `<details class="faq"><summary>${q}${icon("plus")}</summary><p>${a}</p></details>`).join("")}</div></section>
    </main>
    <footer><div class="container"><div class="footer-disclaimer">${icon("info")}<p>All figures are illustrative and based on hypothetical rates. Nothing on this page is financial advice, and past or projected returns are not guaranteed.</p></div><div class="footer-grid"><div><a class="brand" href="./index.html"><span class="brand-mark">${icon("sprout")}</span>Tallypine</a><p>A free weekly letter about money basics for people in their twenties opening their first savings account.</p></div><div><h3>About the numbers</h3><p>Deposits are added at the end of each month. Interest compounds at the frequency selected. Inflation adjusts each year's balance back to today's prices.</p></div><nav aria-label="Footer chapters">${links}</nav></div><div class="footer-bottom"><span>© Tallypine · An interactive explainer</span><a href="https://vibefather.ai/t/compound-interest-interactive-explainer" target="_blank" rel="noopener noreferrer">Template by VibeFather ${icon("arrow")}</a></div></div></footer>`;
}
