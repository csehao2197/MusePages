# StreetBite Fest homepage

- **Original prompt**: `data/prompts/016-food-truck-festival/016-food-truck-festival.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/food-truck-festival/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav:** sticky white bar with a taco icon over the "B", a date badge and Get Tickets. On mobile, a full-screen yellow overlay.
- **Hero:** illustrated dusk waterfront with food trucks and string lights, floating confetti (off under reduced motion), a festival countdown line and a wavy divider.
- **Lineup:** eight truck cards with cuisine chips (horizontal scroll on mobile) and badges.
- **Interactive map:** clickable, keyboard-focusable zones that filter the lineup, combined with the cuisine filter. Stage, garden, service and gate markers, a legend with zone buttons, a list-view toggle, a horizontally scrollable map on mobile, and a PDF map generated in the browser.
- **Schedule:** three-day tabs (click, arrow keys, swipe) with alternating rows and color-coded location badges.
- **Tickets:** tiers open a checkout with quantity steppers and a day picker for Day Pass. CREW20 applies 20% off only for 8+ tickets, with an email check and a confirmation. Best Value is listed first on mobile.
- **Soundtrack:** dark section with string lights and three artist cards. The 30-second preview players animate one at a time (horizontal scroll on mobile).
- **Sponsors, FAQ and newsletter:** typographic sponsor marks (grayscale, color on hover); an eight-question FAQ accordion; a gradient newsletter block with a final CTA and trust line.
- **Footer and mobile bar:** four-column footer, and a sticky mobile "Get Tickets" bar that hides over the tickets section.

## Mocks and limitations

- Food, truck and artist photography is replaced by original SVG illustrations. Sponsor names are typographic marks, not official logos.
- The prompt asks for Spotify embeds. These are visual mock players with no audio, so the page makes no third-party embed requests.
- Ticketing and newsletter are local demos; nothing is sent or charged. The countdown follows the current date (after the 2026 event it shows a "next summer" message).
- Map positions are illustrative. Prompt emoji are rendered as Lucide-style icons; TikTok and X/Twitter use simple custom glyphs.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/food-truck-festival/Opus-5.5/`). From the repo root, `node out/pages/016-food-truck-festival/Opus-5.5/page.test.mjs` runs 11 Playwright checks at 1440×900 and 390×844 (touch):

- cuisine and zone filters (map and legend)
- list view
- PDF validity
- schedule tabs
- ticket quantities and CREW20 rules
- single-player previews
- FAQ
- newsletter
- mobile overlay, sticky bar, two-column trucks, scrollable map, tier order and music scroll
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
