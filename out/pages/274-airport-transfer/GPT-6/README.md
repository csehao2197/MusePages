# Meridian Cars: A calmer arrival

Original: `data\prompts\274-airport-transfer\274-airport-transfer.md`, used in full with `src\workflows\AI Agent\DESIGN.md`.

Standalone HTML/CSS/JavaScript by actual model **gpt-6.1-sol**, public label **GPT-6**. Source: this directory; static export: `out\`. Original airport/car SVG, reduced-motion-aware split flap board, airport route filter and exact fixed-fare selection, fleet capacities, real tel/mail links and local pickup enquiry preview.

Browser-only demonstration: Fictional operator/contact details and illustrative fares. No live flight data, availability, dispatch, booking engine or verified licensing. Form never sends. Static system-font adaptation. No environment variables or backend. Original CSS/inline SVG artwork; system fonts. Source rights remain with their authors.

Verification: `node out\pages\274-airport-transfer\GPT-6\verify.mjs` (existing Playwright, temporary loopback HTTP). 39 executed assertions including desktop/mobile interactions, static subpath/resources, overflow, disabled registration and preservation. Evidence/captures: `.checks\`. Actual desktop/mobile image-view inspection: Viewed both full-page images: clear night-blue/amber arrival identity, original terminal car artwork, orderly fare rows and mobile stacked routes. Mobile call bar is intentionally fixed; remaining content scrolls normally.

Public path: `pages\airport-transfer\GPT-6\index.html`. Preview is a current 1200×900 browser capture with matching digest. Registered disabled/undeployed. No builds, installs, dist or publication performed.

Final boundary audit: removed an unreferenced copied test script from `out\`; public export now contains only index.html, style.css, app.js and preview.png. Visible source bytes are unchanged from image-view QA. Refreshed real preview/digest and passed 37 further desktop/mobile browser assertions. All helpers stopped.
