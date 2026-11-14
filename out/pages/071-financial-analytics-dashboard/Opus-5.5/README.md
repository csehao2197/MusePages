# Quantleaf — FinTech intelligence platform

- **Original prompt**: `data/prompts/071-financial-analytics-dashboard/071-financial-analytics-dashboard.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/financial-analytics-dashboard/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD's reference stack (Dockerized Next.js, FastAPI, PostgreSQL, an OpenAI LLM) can't run in a static collection, and installing or building isn't authorized. Every module therefore runs client-side, with data shaped like the PRD entities:

- Transaction, Budget and PortfolioItem live in `localStorage` (`quantleaf-data`)
- Orders and Trades live in memory

The landing page and footer explain the reference architecture.

## Features

- **Landing (`#/`):** hero, the four modules, CV positioning and an educational disclaimer banner on every page.
- **Personal finance (`#/dashboard`):**
  - transaction CRUD with an income/expense filter
  - category auto-sum (bar chart), budgets with target vs actual as a meter list (amber at 90%, red with an "Over" icon and label above 100%), and budget editing
  - **health score 0–100**: savings rate 40 pts, fixed-cost ratio 30 pts, budget adherence 30 pts
- **Portfolio risk (`#/portfolio`):**
  - holdings with editable weights that must total 100% (an alert shows the unallocated or excess share)
  - add asset (unique ticker validation) and remove
  - asset-class allocation as a **tall segmented bar** (the dataviz replacement for a pie) with legend and table view
  - holdings as a meter list against a 25% guideline
  - correlation-aware volatility estimate, risk score 1–10, HHI and effective holdings, and concentration warnings
- **Assistant (`#/ai`):** chat with suggested prompts. Answers use an aggregated, anonymized context (viewable via "View context sent"). Guardrails refuse specific buy/sell/hold advice, and every answer carries a disclaimer.
- **Order book (`#/trading`):**
  - limit order entry with validation
  - **price-time priority matching engine** with partial fills, multi-level sweeps and resting remainders
  - depth view with spread and mid, your orders with cancel, trade history, and a last-price chart
  - optional simulated market makers and a book reset
- **Charts** follow the dataviz skill. Single-series charts use `#2a78d6`. Categorical asset classes use the validated palette slots in fixed order (the palette check passes; three slots are below 3:1 contrast, which is why the legend, in-block labels and a table view are provided). Bid/ask colors are validated slots 1–2 and always text-labeled.

## Mocks and limitations

- **Simulated AI:** the "AI" is a local rule-based engine, not an LLM. It shows how context and guardrails would work.
- **Simulated trading:** a single symbol (`DEMO`) with seeded liquidity and simulated market makers. Self-trades are allowed, and the book resets on reload.
- **Simplified risk:** volatilities and correlations are fixed class assumptions, not market data.
- **No auth or backend:** there are no accounts and no server; data stays in this browser. Seed transactions are dated in the current month.
- **Educational only:** not financial advice.

## Run and verify

From the repo root, `node out/pages/071-financial-analytics-dashboard/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- landing page
- finance KPIs, score, charts and CRUD flowing through every view, plus persistence
- portfolio validation, segmented bar, risk and warnings
- assistant answers, refusal, disclaimers and anonymized context
- order book validation, price-time priority (older order at the same price fills first), a sweep with an exact average price, cancel, history and market simulation
- mobile layout on every page and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
