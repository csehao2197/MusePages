# Ledgerly — savings calculator landing page

- **Original prompt**: `data/prompts/060-interactive-calculator-landing-page/060-interactive-calculator-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (savings model, wizard, charts, gate, in-browser PDF writer); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/interactive-calculator-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

The brief's "[Product Name]" and "[task]" are filled in as **Ledgerly**, a fictional accounts-payable automation tool, and **invoice processing**.

- **Hero:** headline, trust ("Used by 10,000+ companies") and time ("Takes less than 2 minutes") indicators.
- **Wizard:** three steps with a progress bar.
  1. Company: size slider 1–10 to 500+, industry, current solution.
  2. Current costs: large inputs with tooltips, a team stepper and range validation.
  3. Goals: optional checkbox cards.
- **Live preview:** a sticky card with animated savings, hours and ROI that updates as you type. On mobile, a sticky savings bar appears once the card scrolls away.
- **Results:**
  - summary (annual savings, hours, ROI, payback) and cost breakdown
  - SVG before/after bars, a current-cost donut and a 12-month timeline with the break-even point
  - recommended plan by size, top three features by goal, and a matching customer story
- **Lead gate:** the line items show blurred until a work email is entered (free-mail domains are rejected). That unlocks:
  - an industry comparison (you, industry average, top performers, you with Ledgerly)
  - the expandable line-item breakdown
  - a real PDF report generated in the browser
- **Next steps:** Start Free Trial and Schedule a Demo (slot picker), Download PDF, and Share Results (copyable link plus mailto). Shared links rebuild the same results.
- **Saving:** "Save my results" stores inputs in `localStorage` and restores them on return.
- **Supporting sections:** methodology with assumptions and case-study dialogs, a "results may vary" disclaimer, FAQ, and an ROI Guide email capture.
- **Exit intent:** shows once, only after you've used the calculator, never after you convert, and offers to email the results.

## Model

- **Current cost:** hours/week × 52 × rate + tools × 12.
- **Savings:**
  - automated labor share: 70% for spreadsheets or no tool, 55% for an ERP add-on, 45% for legacy AP software
  - 60% of tool spend consolidated
  - errors and rework at 4% of labor
- **Plan cost by size:** Starter $3,600, Growth $9,600, Scale $19,200, Enterprise $36,000 a year.
- **Derived figures:** net = savings − plan; projected = current − net; ROI = net ÷ plan; payback = plan ÷ monthly gross savings.

## Mocks and limitations

- **Fictional content:** Ledgerly, customers, case studies, benchmarks and plan prices are fictional. Results are estimates computed in the browser from the inputs.
- **Example figures:** the brief's sample figures ($47,500, 520 hours, 340%) are not hard-coded. The defaults (40 hrs/wk, $45/hr, $800/mo, 4 people, 51–200 employees) produce $65,424, 1,456 hours and 682%.
- **Line items:** the brief's "Time savings value" line is folded into labor savings to avoid double counting. The subscription is shown as its own negative line.
- **Demo actions:** reports, trials, demos and guide sign-ups send nothing. The PDF is text-only.

## Run and verify

From the repo root, `node out/pages/060-interactive-calculator-landing-page/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- hero
- wizard, tooltips, validation and live-preview math
- results math, charts and recommendations
- gate, unlock, comparison, line items and PDF structure
- next steps, share-link round trip, methodology, FAQ, guide and save
- exit intent (once, after engagement)
- mobile layout, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
