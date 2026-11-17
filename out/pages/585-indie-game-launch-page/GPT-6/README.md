# Emberveil — GPT-6

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original: `data\prompts\585-indie-game-launch-page\585-indie-game-launch-page.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory. Independent public static export: `out\`.
- Public path: `/pages/indie-game-launch-page/GPT-6/index.html`.

## Experience

An invented hand-painted adventure launch page: original textured SVG key art, twelve ember motes, three illustrated parallax story beats, an explicitly inert trailer poster, keyboard-accessible world-map discoveries, season-only release copy, generic store anchors, device-local wishlist, and a validated local-only newsletter demonstration. All copy, image paths and links are in `content.js`.

The game and studio are fictional. There is no playable game, video, storefront, purchase, backend, mailing list, external API, analytics or environment variable. The original prompt requests a launch page, not gameplay. The wishlist saves only a boolean in localStorage; it falls back to the current visit when storage is blocked. Email is validated in memory, cleared after demonstration, and never sent or persisted.

## Adaptation and license

This authorized no-build implementation uses native HTML/CSS/ES modules, not the requested Vite 5 / React 18 / TypeScript / Tailwind 3.4 / Motion toolchain. CSS and requestAnimationFrame reproduce the specified reveal, reduced-motion and pointer/scroll parallax behavior. No framework packages were installed and no build was run. Cinzel and Alegreya are self-hosted under their included OFL licenses. Icons are drawn from installed Lucide (ISC; included license). All four paintings and the favicon are original code-drawn SVG artwork; they are not the private template's artwork or screenshots. Only the available public brief is implemented; no access to Pro-only sections is claimed.

Prompt: “Indie Game Launch Page,” VibeFather; sourced through [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/indie-game-launch-page/prompt.md). [Template by VibeFather](https://vibefather.ai/t/indie-game-launch-page). Prompt and adaptation: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), non-commercial only. Commercial use requires a separate license. Original repository license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`. See `LICENSE.txt` and `assets\*-OFL.txt`.

## Running and verification

From the repository root, run `node src\workflows\script\generate-preview.mjs out\pages\585-indie-game-launch-page\GPT-6\out` to render a real 1200×900 preview using the existing local-only static server and Chromium. For interaction verification, `node out\pages\585-indie-game-launch-page\GPT-6\.checks\qa.mjs` serves only this export at its final public subpath and closes its own browser/server in `finally`. No build or deployment is needed.

Private evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Final validation and visual-review results are recorded there and in the coordinator's private outcome report. Public preview: `out\preview.png`; input and static/preview digests remain private. Registration is disabled and undeployed; no collection build, publication or upload is part of this delivery.

Verification completed: 29 assertion groups passed in installed Playwright Chromium at 1200×900/DPR1 and 390×844/DPR1, including touch/keyboard navigation, three map discoveries, reduced motion, parallax, inert trailer, store anchors, persistent wishlist and blocked-storage fallback, invalid/valid local-only form, resource loading, and overflow checks before/after interactions. Both actual viewport PNGs and map-detail PNGs were opened and visually reviewed for hierarchy, spacing, contrast and mobile composition. The independently captured 1200×900 `out\preview.png` was also opened and reviewed. No browser, resource, HTTP or console errors occurred.
