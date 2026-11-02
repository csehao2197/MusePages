# 029 — KVOLT / Made for the feeling

A bespoke, dark Atlanta producer portfolio built directly beside its source Markdown. This project alone is implemented; no collection-wide completion is implied.

## Run locally

The supplied ancestor workspace already provides `node_modules`. No install, parent manifest change, or lockfile change is needed. From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\029-music-producer-portfolio'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm test
```

`build` runs `next build --webpack` with two build workers. `test` starts an isolated **production** server at `http://127.0.0.1:3129`, refuses server reuse, runs one test worker with bounded startup/action/test timeouts, then terminates its owned server. Chromium must already be installed, as it is in the supplied environment.

For manual use, after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
# Visit http://127.0.0.1:3129; Ctrl+C when finished.
```

Alternatively, `npm run dev` uses port 3129. Do not leave a manual server running before `npm test`.

To deterministically regenerate the included audio using Node's built-in modules:

```powershell
node scripts\synthesize.mjs
```

## Implemented source journeys

- Transparent-to-solid navigation, fullscreen mobile menu, cinematic illustrated studio hero, purple/cyan equalizer, licensing and studio entry points.
- Six typed tracks, unique abstract covers, combined title/genre search, empty-state reset, details dialog, and a single coherent playback queue.
- Native audio playback with explicit user initiation, card/player pause, previous/next with wraparound, end-of-preview advance, seek, elapsed/duration display, volume, failed-file retry, and stop/release. Filtering never silently changes the queue.
- Three licensing tiers prefill local inquiries. Horizontal fictional credits open role/details notes. About, fictional collaborators/reviews, and four services preserve the music-first narrative.
- Services, selected track/tier, and booking entry points feed one form. Native required/email/URL/budget/date/minimum-description validation; date appears for studio sessions. A preferred date is not a reservation.
- A 350 ms local delivery simulation supports disabled pending fields, confirmation, clear selection, clean reset, deliberate error/preserved-field recovery, and cancellation of stale pending results when changing service.
- Local newsletter feedback, meaningful legal/social/contact dialogs instead of dead or deceptive external links.
- Semantic controls, visible keyboard focus, native modal focus containment/Escape/restore, skip link, reduced-motion handling, mobile layout and contained horizontal discography.

## Mocks and deliberate adaptations

Everything is fictional: KVOLT/Kevin Volt, tracks, clients, artists, credits, reviews, statistics, awards, equipment, studio, availability, pricing, turnaround, and contact details. Fiction notices appear in the relevant sections. Real artists/labels, Grammy/Berklee claims, actual studio affiliations, and Spotify/Apple destination links from the brief are deliberately replaced with clearly fictional equivalents or explanatory dialogs. No provider endorsement is implied. Studio imagery is an original illustration, not a purported photo of a real producer.

There are no accounts, payment collection, card fields, live APIs, mailing lists, analytics, booking integrations, or email delivery. Inquiry/reference URLs are neither fetched nor transmitted. Form state lives only in memory and clears on reload. Use fictional information. Displayed license terms create no rights transfer, exclusivity promise, purchase, or contract.

The included previews are **14-second mono, 22.05 kHz, 16-bit PCM WAV sketches**, not full beats, commercial masters, stems, or client recordings. Each is generated from deterministic oscillators, envelopes, and seeded percussion noise at its listed tempo/key. The visualizer is playback-time-driven decorative animation, not an FFT analysis of the recording; reduced motion makes it static. Playback continues until paused/closed, the queue changes at preview end, and media is released on close/unmount. Short files are fetched only after a playback choice; browser/device audio policies still apply. The accessible player is taller than the brief's 64 px desktop concept to accommodate usable controls; mobile retains seek/volume as well as essential transport/license controls.

System Arial/Helvetica and Georgia replace Space Grotesk/Inter to avoid external font downloads, network dependencies, and redistribution assumptions. Social icons use generic camera/video/audio/radio glyphs instead of provider logos.

## Assets and provenance

- `public/studio.svg`: original, locally authored vector studio scene.
- `components/portfolio.tsx` + `app/globals.css`: original procedural CSS cover art, faux wordmarks, initials avatars, equalizer, and layout. The inline SVG noise filter is also locally authored.
- `public/audio/*.wav`: six original procedural compositions generated solely by the included `scripts/synthesize.mjs`. No sampled or downloaded recordings, reference-track scraping, third-party loops, or external image-generation service.
- The original visual/audio demo assets authored for this implementation are provided under **CC0-1.0** (https://creativecommons.org/publicdomain/zero/1.0/). This does not relicense the supplied source Markdown or third-party packages.
- UI icons are from installed `lucide-react` (ISC); the package retains its own license. No third-party artist/label artwork or logo is redistributed.
- Fonts are operating-system font references, not bundled font files. Their respective owners retain all rights.
- Next.js, React, TypeScript, Playwright, and their dependencies retain their respective package licenses.

## Observed validation

Validated locally on the supplied Node 26.13 / npm 11.20 environment:

- Strict `npm run typecheck`: passed.
- `npm run build`: passed; static production route `/`, webpack, two workers.
- Focused Playwright suite: **26 passed** — 13 cases on desktop Chromium (1440×1000) and 13 on mobile Chromium with the iPhone 13 profile (390×664 CSS viewport).
- Coverage includes actual native playback/time/pause/seek/volume, queue/wrap/end advance, failed audio retry, genre/search/empty recovery, details/focus, license/service selection, native invalid fields/past date/budget, pending timer cancellation, failure/confirmation/reset, legal/credits/newsletter, mobile keyboard navigation, reduced motion, and page overflow through all main sections.
- Production desktop/mobile hero, beat library, active player, contact/form and full-page renders captured under ignored `test-results` and visually inspected. Screenshots are evidence, not pixel-golden regression assertions.
- Test server cleanup checked: **no listener on port 3129** after the suite.

The tests use Chromium emulation, not physical iOS/Safari/Firefox devices. No live integrations, commercial licensing fulfillment, or human listening/mastering quality review is claimed.

## Source preservation

`029-music-producer-portfolio.md` was read in full and not modified.

Original and verified final SHA-256:

```text
287059260D8B0FAA76A59182089FF67A09B449C222F3DD207DA89C011AA56AB3
```
