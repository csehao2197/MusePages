# Vault Nine

- Original: `data\prompts\618-escape-room-website\618-escape-room-website.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: this directory. Static delivery: `out\`. Private browser evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
- A noir Portland venue with four room explorations, room-to-booking selection, sample weekday/time availability, party stepper and price calculation, persistent device-only holds, editable confirmation, mobile keyboard navigation, exclusive FAQ and reduced-motion dust/reveals.
- Authorized static adaptation: native HTML/CSS/ES modules replace the requested Vite/React/TypeScript/Tailwind/Motion stack. No framework build, backend, external API, analytics or deployment. Local Fontsource fonts and source Lucide SVGs retain their licenses.
- Days are a sample week, not dates. The late slot is unavailable Sunday–Thursday. The 2–8 party control follows the requested global range; room-specific recommended ranges are shown and Hall guidance is corrected to four. No payment, transmission, live availability or confirmed venue reservation. The sample phone/address/rooms/prices are invented. Local storage failure is reported; invalid stored holds are ignored.
- Serve only `out\` using `startPreviewServer` from `src\workflows\script\generate-preview.mjs`, then open its final `/pages/escape-room-website/GPT-6/index.html` URL. No installation or build is required.
- Browser verification and screenshot results are recorded after execution in `.checks\qa.json`; use the private `.checks\qa.mjs` with `node` from the repository root to repeat. Preview is produced by `StaticHomepage.ensurePreview`.
- Nothing is published or selected for publication; registration is disabled by default.

## Verified result

Seventeen browser/static assertion groups passed at 1200×900, 1440×900 and 390×844, DPR 1: HTTP/final subpath, six local photos and three font families, no horizontal overflow before/after use, keyboard room selection, dark hours and fallback, party boundaries and price math, exact local hold payload/reload/edit, exclusive FAQ, mobile menu focus/Escape/touch booking, amber focus, reduced motion, invalid saved data and denied storage. No HTTP, request, console or page errors occurred. Two initial test-harness case expectations were corrected for CSS uppercase rendering; the final run passed.

Both real full-page desktop/mobile PNGs and the fresh 1200×900 `out\preview.png` were opened for visual review. Noir photo grading, typographic hierarchy, amber focus, room-card spacing and mobile single-column booking were inspected. Browsers and preview servers were closed. Source and static files remain readable, unbundled browser modules with stable names rather than Vite-hashed/minified output; total public delivery remains below the requested 20 MB.

## Attribution and license

Adapted from **Escape Room Website**, prompt by VibeFather, <https://vibefather.ai/t/escape-room-website>, via liyupi/awesome-vibe-coding-websites at commit `85431a57f231fa59269dad62c757193d6a3fd0ff`.

Source: <https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/escape-room-website/prompt.md>.

CC BY-NC 4.0: <https://creativecommons.org/licenses/by-nc/4.0/>. Non-commercial adaptation; no additional rights granted. Commercial use requires appropriate VibeFather permission. Local photo credits and asset sources are in `ASSETS.md`. See `LICENSE`, `out\NOTICE`, and font/icon license files. Changes: static browser implementation, responsive layout and robust local hold handling. No original prompt or reference implementation was modified.
