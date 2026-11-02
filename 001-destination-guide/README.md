# Wanderly · Tokyo destination guide

A standalone, Tokyo-specific Next.js App Router + TypeScript local demo. All source is directly alongside the original `001-destination-guide.md`; there is no nested project.

## Run

From this folder in PowerShell, using the collection's already-installed ancestor dependencies:

```powershell
npm run dev
# http://localhost:3000

npm run typecheck
npm run build
npm run start

# Requires the production build above and installed Chromium:
npm test
```

Do not reinstall dependencies or change collection-level manifests/locks. `build` uses webpack and two build workers and exports the site to `out/`. Deploy the entire `out/` directory at the root of any static HTTP host; no Node.js runtime is required in deployment. Browser-side filtering, saved places, planning, and PDF downloads remain interactive.

`npm run start` previews the export at `http://127.0.0.1:3000` using the static handler bundled with the pinned Next.js dependency. This preview helper uses an internal Next.js module, so recheck it when upgrading Next.js. Do not use `next start` or open `index.html` directly. Subpath hosting requires additional configuration.

The Playwright suite owns an isolated static preview server at `http://127.0.0.1:3101`, refuses to reuse an existing server, and automatically terminates it. No helper needs to remain running after tests.

## Implemented

- Sticky compass-brand navigation, breadcrumbs, 70vh dusk/Fuji illustrated hero, section anchors, and mobile trip CTA.
- Editorial overview with illustrated collage, six highlights, sticky desktop practical sidebar, and initially collapsed mobile accordion.
- Six attraction cards with all brief-specific descriptions, neighborhoods, durations, sample costs, and ratings. Category/search filters combine with a saved shortlist, persisted in localStorage. Empty/reset and storage-unavailable states are included.
- Distinct three-, five-, and seven-day itineraries with timelines, time estimates, original scenes, meals, day trips, and keyboard-operable tabs.
- Shinjuku, Shibuya, and Asakusa neighborhood cards with sample nightly ranges, best-for tags, transit details, and functioning neighborhood-selection controls.
- Eight local tips, scrollable temperature/rainfall chart, interactive monthly advice, seasonal event callouts, and three clearly fictional traveler reviews.
- Package preview and custom trip modal with dates, traveler count, duration, pace, interests, and neighborhood. Native required/email/date validation, additional name/interest validation, pending state, editable confirmation, focus trapping/restoration, and Escape/close controls.
- A genuinely downloadable, locally generated PDF pocket guide reflecting the chosen duration and saved places. Longer itineraries use a compact day-title outline to fit one page.
- Route loading/error fallback, labeled controls, live status messages, visible keyboard focus, reduced-motion handling, and responsive carousels/stacked layouts.

## Mock boundaries and deliberate factual adjustments

Wanderly is fictional. No booking, payment, email, hotel inventory, maps, reviews API, or travel service is connected. Form information remains in component memory and is never transmitted or persisted; only saved attraction IDs use localStorage. Creating a trip produces a local preview, not a real inquiry. Sample prices, ratings, weather averages, and testimonials are not live data or endorsements.

The original brief has been preserved, but the displayed guide corrects two misleading facts: TeamLab Borderless is in **Azabudai Hills**, not its former Odaiba location; the 38,000+ temple/shrine highlight is labeled **across Japan**, not Tokyo alone. Visa eligibility, current admission prices, tournament schedules, garden openings, auction access, bloom dates, and forecasts require independent verification. The brief's sample ¥3,800 ticket is explicitly labeled illustrative.

Navigation stays within this single Tokyo guide. Social icons link to platform homepages, not invented Wanderly accounts. Accommodation controls select neighborhoods and sample prices rather than pretending to show bookable hotel inventory.

## Imagery and typography provenance

All destination scenes, traveler avatars, and the compass asset are original SVG artwork created for this demo (`components/scene.tsx`, `components/destination-guide.tsx`, `public/compass.svg`). They intentionally replace photography with an editorial illustrated visual direction; they are not documentary photos. No third-party destination imagery or unlicensed assets were downloaded.

The requested **DM Serif Display** and **Inter** are vendored locally in `public/fonts/`, unmodified from the official Google Fonts repository:

- [DM Serif Display font and license](https://github.com/google/fonts/tree/main/ofl/dmserifdisplay)
- [Inter font and license](https://github.com/google/fonts/tree/main/ofl/inter)

Both use SIL Open Font License 1.1; corresponding copyright/license files are included alongside the fonts. Builds/runtime make no external font requests. Georgia and system sans-serif provide fallbacks.

## Original brief provenance

Read in full before implementation; `001-destination-guide.md` remains byte-for-byte unchanged.

SHA-256:
`28B08CD7F5F7D71D528B9A91320C5B6200AB68F63D535697C090ECEF6EEFEB61`

## Validation

Validated locally on 2026-10-31 with Node 26.13.0, Next.js 16.4.3, and shared Chromium:

- `npm run typecheck`: passed.
- `npm run build`: passed; optimized static `/` generated with two workers.
- `npm test`: 12 passed (six focused interaction tests each on desktop and mobile Chromium).
- Suite covers filtering/search/shortlist persistence, actual itinerary day counts and keyboard tabs, weather advice, PDF content, inquiry validation and tailored confirmation, hotel/package preferences, mobile navigation, viewport overflow, and client errors.
- Desktop/mobile full-page captures were inspected. Test-owned port 3101 was verified no longer listening after the suite.
- Original brief SHA-256 was rechecked and matches.

Playwright artifacts are ignored under `test-results/`; failed runs must not be described as passing. There is no deployment, real service provisioning, or production travel-advice certification. Automated coverage is focused rather than a comprehensive accessibility audit.
