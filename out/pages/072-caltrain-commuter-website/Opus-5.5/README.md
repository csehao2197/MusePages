# Next Train — Caltrain commuter dashboard (unofficial)

- **Original prompt**: `data/prompts/072-caltrain-commuter-website/072-caltrain-commuter-website.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (timetable generator, weather simulator, UI)
  - `assets/stations.js`: 32 stations with `id`, `name`, `code`, approximate `coordinates` and mileposts
  - `page.test.mjs`: browser checks
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/caltrain-commuter-website/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice (deviation from the PRD)

The PRD **requires Next.js** (App Router, `/api/trains`, `/api/weather`) with 511.org/GTFS and OpenWeatherMap keys. This collection entry is a static HTML build instead:

- installing, building and API keys aren't authorized in this run
- the collection publishes a standalone static homepage
- a Next.js source project was **not** generated

Live data is replaced by in-browser equivalents behind the same seams: a generated sample timetable and a simulated weather service with a 10-minute cache. A real build would swap these for the 511/GTFS and OpenWeatherMap API routes.

## Features

- **Station selection:** 32 stations (San Francisco to Gilroy) in origin/destination selectors (type-to-search), swap button, same-station validation, last selection remembered.
- **Next trains:** the next 5 departures with departure time, countdown, arrival time, trip duration, direction, train number and type (Local, Limited, Express).
  - the next departure is highlighted
  - on-time or delayed status with icon and text
  - "Tomorrow" after the last train; clear messaging when nothing runs
  - loading skeletons with `aria-busy`
- **Weather:** origin and destination side by side (stacked on mobile), each with temperature (°F), description, icon, wind and humidity. Shows a callout for differences ("7° warmer at Palo Alto…") and a 3-hour destination forecast.
- **Service alerts:** info, warning and critical styles with icon and level label. Info alerts can be dismissed (persisted). The sample delay alert matches the delayed trains, and the weekend alert explains the schedule. Alerts refresh with the data.
- **Saved routes:** up to 5 named routes in `localStorage`. Quick-load cards, edit (rename and optionally update stations), delete, and duplicate-name validation.
- **Auto-refresh and errors:** data refreshes every 60 s ("Updated h:mm"). A footer toggle simulates a weather outage, which shows an error with cached data and a retry, while train times keep working.
- **UI:** Caltrain red (`#E31837`) header, blue interactive elements, green and amber status colors, 44px+ targets, mobile-first layout.

## Mocks and limitations

- **Not official:** this is an unofficial demo, not affiliated with Caltrain, and uses no Caltrain logo.
- **Sample timetable:** the timetable is a generated sample built from station mileposts and typical service patterns (weekday locals every 30 min, peak Limited and Express trains, a few Gilroy trains; weekend hourly locals). It is **not** the real schedule.
- **Simulated weather and alerts:** weather is computed from station position, time of day and date. Alerts and delays are samples.
- **Approximate data:** station coordinates and mileposts are approximate.
- **Demo clock:** for demos and tests, `?at=HH:MM&dow=0-6` pins the clock. Without it the app uses the current Pacific time.

## Run and verify

From the repo root, `node out/pages/072-caltrain-commuter-website/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- stations and the 5-train list
- express faster than local, and delays tied to the alert
- swap, same-station validation and Gilroy service
- weather details, difference callout and forecast
- outage with cached fallback and retry
- saved routes CRUD, limit and persistence
- alert dismissal, weekend schedule and late-night "Tomorrow"
- 60-second auto-refresh (Playwright clock)
- mobile layout and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
