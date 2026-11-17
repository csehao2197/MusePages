# Lantern Row Night Market

- Generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\596-night-market-food-festival\596-night-market-food-festival.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\596-night-market-food-festival\GPT-6`; static export: its `out` directory. Final subpath: `/pages/night-market-food-festival/GPT-6/index.html`.
- Original prompt: [VibeFather](https://vibefather.ai/t/night-market-food-festival), mirrored by [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/night-market-food-festival/prompt.md). Prompt and adaptation: CC BY-NC 4.0, non-commercial; see `LICENSE.txt`. Commercial use needs a VibeFather Pro license. Original credits and font/icon notices retained.

## Features

Lantern-lit photography, eighteen keyboard-operable SVG vendor pins, eight cuisine filters, two stages, all eleven sample performances, four-photo strip, three pass tiers, local token-cost estimator, validated browser-local vendor application, and five accessible FAQ disclosures. The mobile map scrolls inside its own plate to preserve pin target size; the vendor card becomes a modal bottom sheet with focus management and Escape dismissal. A textual vendor directory provides an alternative to the map.

## Static adaptation and limits

This authorized no-build adaptation uses semantic HTML, CSS, ES modules, and native controls rather than the requested Vite/React/TypeScript/Tailwind/Motion stack. Copy and records are centralized in `content.js`; SVG map geometry is generated in `app.js`. CSS respects reduced motion. Fonts are self-hosted Fontsource files; icons are serialized Lucide artwork, with no third-party runtime.

The market, city, venue, acts, vendors, prices, and timetable are fictional. No calendar dates, tickets, reservations, payments, email, APIs, analytics, backend, or deployment. Pass selection only calculates an illustrative local estimate. Applications persist only in localStorage under `lantern-row-night-market-vendor-application`; corrupted records are ignored, and unavailable storage reports failure rather than pretending to save. Start over removes the saved application.

The six exact template photos were downloaded to `public\images` and retained unchanged as source assets under the prompt's redistribution permission. Display copies in `images` crop out non-English signage and visible faces; only these six display copies are exported. They are generated scenes, not documentary evidence. No alternate stock imagery or generated replacement photography is used. See `ASSETS.md` for exact crop geometry and credits.

## Run and validate

From the repository root, serve the export with the existing isolated preview helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\596-night-market-food-festival\GPT-6\out
```

This renders and captures a preview without a build. For an interactive visit, import `startPreviewServer` from that helper, pass the same static directory, use its returned `url`, and close it afterward. The helper serves only this export at the final public subpath.

Private evidence lives in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`, and additional interaction screenshots; none are public assets. The private QA runner records actual desktop/mobile, keyboard, storage, requests, errors, overflow, and reduced-motion assertions. `out\preview.png` is the standard 1200×900 first-screen capture, with static/image digests in `.generation-preview.sha256`. Actual verification and visual-review results are recorded after execution, not assumed from source generation. Registration remains disabled and undeployed.

Run the existing-dependency browser checks from the repository root with `node out\pages\596-night-market-food-festival\GPT-6\.checks\qa.mjs`. It starts the isolated preview server and closes its own browsers and server in `finally`; it does not build, deploy, install, or modify other pages.

## Verified result

The final Chromium run passed **79 assertions** at 1200×900, 390×844, and 1440×900, including reduced motion. It checked the eighteen pins, eight-cuisine filtering, keyboard and mobile dialogs, both stage schedules, pass/token estimates, inline form errors, save/restore/reset, malformed records, blocked storage writes/deletions, FAQ keyboard controls, all six local photos, no external/submission requests, and actual viewport overflow before and after interaction. Page, console, resource, and request error lists were empty. Owned browsers and preview servers closed successfully.

The actual desktop and mobile PNGs were opened and visually reviewed, as were the map sheet, ticket, schedule, photo-strip, and application layouts. A mobile viewport inflation discovered during visual review was corrected and the stricter viewport/panning checks passed. The standard fresh 1200×900 `out\preview.png` was also opened. Metadata and the private outcome report record the final checked digests and disabled registration; nothing was built, assembled, published, or uploaded.
