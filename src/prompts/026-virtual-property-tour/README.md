# 026 — Fieldnote / Virtual Property Tour

A standalone, tour-first Next.js demo built directly beside `026-virtual-property-tour.md`. Warm architectural vector studies, a quiet editorial shell, and dark viewer controls give this fictional garden home its own visual identity. No shared application/template code or sibling project dependencies.

## Run and validate

The supplied ancestor `node_modules` is used directly. No dependency installation, root manifest edits, or lockfile changes are needed. From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\026-virtual-property-tour'
$env:NEXT_TELEMETRY_DISABLED='1'
..\node_modules\.bin\tsc.cmd --noEmit
..\node_modules\.bin\next.cmd build --webpack
..\node_modules\.bin\playwright.cmd test
```

For manual production use after building:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
..\node_modules\.bin\next.cmd start -H 127.0.0.1 -p 3126
# Open http://127.0.0.1:3126 ; stop with Ctrl+C.
```

Equivalent package scripts: `npm run typecheck`, `npm run build`, `npm test`, `npm start`; `npm run dev` also uses port 3126. Set the telemetry variable before those commands.

## Implemented journeys

- Four typed, individually illustrated spaces: living room, kitchen, primary bedroom, garden terrace. Thumbnails, arrow hotspots, room information, floor plan, mini map, shared room links, and guided narration track the same selected-room state. Changing rooms resets the view.
- Drag/arrow-button/keyboard panning; scroll, pinch, button, and keyboard zoom from 100–180%; reset; bounded auto-pan; responsive full-view overlay. Pan limits adapt to zoom and viewer size so the artwork never pans beyond its edges.
- Information, navigation, illustrated-sequence, and local neighborhood-guide hotspots; background dismissal and Escape/focus return.
- Guided playback (10 seconds per room), pause/previous/next, optional browser-generated narration, transcript, and tour-complete state. All audio starts off; optional ambient sound is a locally synthesized tone.
- Schematic two-point measurement with keyboard presets; couch-width fit estimates, native numeric bounds, furniture visualization, clear/reset behavior.
- Staged/empty slider and side-by-side room comparison; four-image gallery with room selection and a playable illustrated sequence.
- Fictional property details, host contact, viewing request and inquiry forms, date/time selection, native required/email/date validation, explicit demo consent, deterministic simulated-failure/retry controls, confirmation and reset.
- Browser-local saved-home toggle, room-specific link and embed copy with clipboard-denied fallback, validated local email draft and reset. No sending.
- Mobile navigation, bottom action bar, touch swipe/pinch, portrait/landscape layouts; native dialogs with focus trapping/restoration; keyboard help, high contrast, system/manual reduced motion, and text alternatives.
- Exit-to-overview and return-to-tour flow. No dead purchase, account, or booking links.

## Honest adaptations and fictional data

**This is an original interactive illustration, not real 360° photography, a 3D scan, or a filmed walkthrough.** Dragging pans a bounded drawing, not an unseen perspective. Full view expands the interface, not the browser/OS fullscreen API.

The brief supplied no property identity, photography, panoramas, video, drone footage, survey, or licensed visual assets. Fieldnote, 18 Juniper Lane, Mosswood, Avery Morgan, the $1,250,000 price, room dimensions, materials, 2023 HVAC, and all property specifications are fictional. There is no brokerage, real availability, award/review/certification, provider endorsement, or market claim. Tax and HOA details are deliberately not estimated; the school district is explicitly fictional. Four rooms are modeled, not every room of a purported 4-bedroom home.

Original SVG illustrations replace professional photos and 3D assets. A clearly labeled four-scene slideshow/transcript replaces video, drone, and neighborhood footage. The local neighborhood concept is not a map. Comparison is staged versus empty in this single fictional property, not an invented second listing or financial comparison.

All floor plans combine selected spaces into a **navigation schematic**, not actual surveyed floor connections. Dimensions and measurements are conceptual; not construction documents, a surveying service, access-clearance assessment, or furniture-fit guarantee.

Device orientation is permission-gated where required and falls back to manual controls when unsupported, denied, or no sensor data arrives. **No VR mode or headset compatibility is claimed.** Actual sensor hardware and installed narration voices cannot be verified in desktop Chromium emulation. Audio depends on browser/device support.

Local SVGs render immediately with a screen-reader room-loaded announcement; there are no panorama downloads, fabricated loading percentages, bandwidth measurements, or network media loaders. There are no external APIs, fonts, maps, payments, credentials, accounts, emails, or real bookings. Forms stay in component memory and are discarded on close/reset; only the saved-home preference uses local storage. Use fictional form data.

Clipboard text and embed snippets point at the local running app, not a deployed listing. QR sharing is intentionally omitted: loopback links are not accessible on another device. Email sharing creates only a local copyable draft.

## Assets and licenses

- `components/Scene.tsx`: four original vector architectural illustrations authored for this demo. All room studies, garden shapes, furnishings, floor-plan UI, neighborhood concept, CSS treatment, and `public/icon.svg` are original; no downloaded photography, stock artwork, maps, 3D models, or copied brand assets.
- Icons: installed `lucide-react` 1.61.0, ISC with applicable Feather-derived icons under MIT. The exact upstream license is retained at `public/licenses/lucide.txt`.
- Typography: system Georgia / Times New Roman and Arial / Helvetica fallbacks. No font files downloaded, embedded, or redistributed; no external-font build dependency.
- Sound: original sine-wave tone from Web Audio; narration uses optional browser Speech Synthesis. No audio recordings or licensed music files.

## Observed validation

- Strict TypeScript: **passed** (`tsc --noEmit`).
- Next.js **16.4.3 production webpack build passed**, two static-generation workers; `/` prerendered successfully.
- Playwright: **32 passed, 0 skipped**, 16 source-specific cases in each of desktop Chromium (1440×1000) and Chromium iPhone 13 emulation (390×844, touch). One worker, zero retries; production server only.
- Tests cover synchronized rooms/floor plan/hotspots, pan/zoom bounds and reset, full view/focus, guided timing and transcript, gallery/sequence, schematic measurement and fit, staged/split comparison, viewing and inquiry validation/failure/recovery/reset, local save/share/email draft, reduced motion/high contrast/dialog containment, orientation fallback, mini map, auto-pan, exit/return, desktop drag/wheel, actual emulated touch swipe/pinch, mobile navigation, landscape and horizontal overflow.
- First-render checks observed no page errors or external requests. Desktop/mobile screenshots are produced at `test-results/desktop-tour.png` and `test-results/mobile-tour.png` and were visually inspected.
- `playwright.config.ts` starts an isolated production server at `http://127.0.0.1:3126`, refuses reuse of an existing listener, allows 90 seconds to start, bounds each test to 35 seconds, and automatically stops its server. The port was checked clear after testing.
- No real sensor/VR hardware, Safari/WebKit, real email delivery, or deployed access is tested or claimed.

## Source integrity

`026-virtual-property-tour.md` was read in full and not modified. Original and final SHA-256:

```text
048FA48A797F394A2E141F2E2ED7707A2A249E4225CAF630FF94A8557B57547B
```

Implementation, documentation, assets, build output, and test artifacts are confined to this project folder. This validation makes no claim about any other project.
