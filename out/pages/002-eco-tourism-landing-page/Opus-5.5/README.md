# Verdant Journeys eco-tourism landing page

- **Original prompt**: `data/prompts/002-eco-tourism-landing-page/002-eco-tourism-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/eco-tourism-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

Transparent-to-solid fixed header with mobile menu. Full-height misty rainforest hero with leaves that drift on scroll, side-by-side CTAs (stacked on mobile) and a trust bar (scrolls horizontally on mobile). A sticky dark impact banner with counters that count up when scrolled into view (2×2 on mobile). Six eco-trip cards with "Eco Certified" badges, tags, highlights and ratings; on hover a card lifts and reveals "View Trip". A four-step dotted timeline (vertical on mobile). A snap-scrolling eco-lodge rail with arrows and dot indicators. A carbon calculator with departure autocomplete (keyboard and mouse), destination select, a 1–8 traveler stepper and validation. A testimonial carousel that rotates every 6 s, with dots, a pause button, swipe and arrow keys. Partner wordmarks that go from grayscale to color on hover. A newsletter card over an aerial coastline. A footer, and a sticky mobile "Explore Trips" bar.

## Mocks and limitations

- Photography is replaced by generated SVG illustrations with a grain filter (no licensed photos are bundled).
- Partner "logos" are generic text wordmarks with icons, not the organizations' official marks.
- Calculator estimates use great-circle distance × 0.15 kg CO₂/passenger-km round trip plus 45 kg/person/day on the ground. The figures are illustrative.
- Newsletter signup and "View All 24 Trips" are local demos; nothing is sent.
- Fonts (Fraunces, DM Sans) load from Google Fonts, with serif/sans fallbacks.
- With reduced motion, leaves are hidden, counters jump to their final values, and auto-rotation starts paused.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844: no console, page or resource errors, no horizontal overflow. Counters, calculator validation/autocomplete/stepper/result, testimonial dots and auto-rotation, newsletter validation, the lodge rail and dots, hover reveal and the mobile menu all work. Desktop and mobile screenshots were reviewed visually.
