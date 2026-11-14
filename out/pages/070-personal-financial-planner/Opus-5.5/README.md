# Planwise — personal financial planner

- **Original prompt**: `data/prompts/070-personal-financial-planner/070-personal-financial-planner.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/personal-financial-planner/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD suggests Next.js, React, TypeScript and Tailwind. Installing and building aren't authorized here, so the same feature set runs as one dependency-free page. A single plan object (balance, income, expenses, goals) is the state, saved automatically to `localStorage` (`planwise-plan`).

## Features (PRD §4)

- **Dashboard:**
  - editable current balance, total monthly income, total recurring expenses and net
  - 12-month forecast chart and goal progress
  - top 3 suggestions for next month
- **Income:** add, edit and delete with frequency (weekly, every 2 weeks, twice a month, monthly, quarterly, annually) converted to a monthly equivalent.
- **Expenses:** recurring (category and due day) or one-time (category and date). Includes add/edit/delete, a filter, and a "recurring by category" bar chart.
- **Goals:** target, target date and saved amount. Shows the required monthly saving, status (active, reached, past date) and progress meters. "Add savings" can take the amount from the current balance.
- **Forecast:** 12 months from next month: previous balance + income − recurring − one-time − goal contributions. Includes KPIs (end balance, lowest point, saved to goals, one-time total), a line chart with crosshair tooltip (mouse, tap and arrow keys), one-time-expense markers and a reconciling table view.
- **Suggestions:** rule-based and recomputed live. They cover:
  - goal shortfalls, with specific category cuts or a new goal date
  - categories above common income benchmarks
  - negative or thin balances in the forecast
  - emergency-fund prompts and savings rate below 20% (income ideas)
  - surplus allocation and reminders for upcoming one-time expenses
- **Save and load:** save the plan as `.json`, load it back (schema-validated, with a confirmation before replacing), export CSV, and reset to the sample or an empty plan.
- **Charts** follow the dataviz method:
  - single series in `#0D9488` (passes the palette validator; `#0F766E` was rejected for low chroma)
  - 2px line, 10% area wash, end-value label, a zero baseline when needed
  - bars capped at 20px with 4px rounded ends and values at the tips
  - accessible labels, plus a table view for the forecast

## Mocks and limitations

- **Sample plan:** the starting plan is fictional sample data dated relative to today. "Reset… → Start empty" clears it.
- **Local only:** data stays in this browser unless you save a file. Nothing is uploaded and there are no bank integrations (a PRD future item).
- **Single currency:** USD only, with no tax module (a PRD future item).
- **Guidance only:** suggestions use simple rules of thumb and aren't financial advice. The forecast assumes steady monthly income and recurring expenses.

## Run and verify

From the repo root, `node out/pages/070-personal-financial-planner/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- dashboard KPIs, and balance edits flowing into the forecast
- income CRUD and frequency math
- expenses (recurring and one-time, validation, filter, bars)
- goals (required savings, contributions, validation)
- forecast rows reconciling month by month, plus keyboard tooltip and table
- suggestions reacting to plan changes
- JSON save/load round-trip, invalid-file rejection, CSV export and persistence
- mobile layout on every tab, tap tooltip and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
