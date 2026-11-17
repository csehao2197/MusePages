# Larkspur

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\622-daily-word-puzzle-game\622-daily-word-puzzle-game.md`, with `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory's `index.html`, `style.css`, `content.mjs`, `game.mjs`, `app.mjs`, `fonts\`, and `favicon.svg`. Static delivery: `out\`.
- Public subpath: `/pages/daily-word-puzzle-game/GPT-6/index.html`. No collection assembly or deployment was performed.

## Play

Forty sample puzzles rotate after completed rounds, without dates or daily lockout, as the original explicitly requires. There are exactly 120 accepted words: the forty specified answers and eighty hand-curated common extras. Physical and touch keyboards share real validation and duplicate-aware two-pass scoring. Invalid words do not spend a guess. Tile reveals, keyboard precedence, six-guess loss, win statistics, reset confirmation, recent-round history, and original box-character clipboard results are functional.

Round progress, in-progress typing, statistics, help visibility, and history persist in browser localStorage at `larkspur:stats`. Reloading a finished round does not count it twice. Storage failures are disclosed; no data leaves the browser. Clipboard denial provides selectable result text. No simulated players, fake statistics, API, backend, account, analytics, or environment variables.

## Static adaptation and limits

The authorized build-free HTML/CSS/ES-module adaptation replaces the requested Vite 5 / React 18 / TypeScript / Tailwind / Motion stack. There is no package installation or build step. CSS implements the requested staggered flips, typing, shakes, bounce, and reduced-motion behavior; native HTML dialog plus an explicit Tab loop supplies modal focus containment. Lucide paths are inline SVG. Fonts are locally reused, licensed Bricolage Grotesque 600 and Inter, rather than newly installed Fontsource-variable packages. All visible editorial copy and word lists are in `content.mjs`; structural accessibility labels remain in HTML/JavaScript.

The dictionary is intentionally limited, not a comprehensive English dictionary. Rotation is predictable, the client-side answer is inspectable, and browser-local history is not synchronized or an anti-cheat system. The first-visit help dialog is intentionally visible in the fresh-browser generated gallery preview.

## Run and verify

From the repository root, serve only this model's `out` directory with `startPreviewServer` in `src\workflows\script\generate-preview.mjs`; open the returned final-subpath URL. No framework server is needed.

Private tests: `.checks\verify.mjs`; run `node out\pages\622-daily-word-puzzle-game\GPT-6\.checks\verify.mjs` from the repository root. Actual results: `.checks\qa.json`; desktop and mobile captures: `.checks\desktop.png`, `.checks\mobile.png`. Source/static, game logic, storage, actual browser interaction, overflow, network, console, accessibility interactions, and image visual review are recorded there. `out\preview.png` and `.generation-preview.sha256` are maintained through `StaticHomepage.ensurePreview`.

Verification completed: 16 focused groups passed in real Chromium, including 1200×900 desktop, 390×844 touch/reduced-motion mobile, 1440×900, and 320×700. Desktop and mobile PNGs were opened and visually reviewed; header-to-board hierarchy, tile/key contrast, typography, spacing, and first-screen fit were checked. Browser HTTP/resource/request/console/page errors: zero. QA exposed and fixed the modal Tab loop and physical Enter after closing help; Windows clipboard line endings are normalized only in the comparison test. No production build or deployment was run.

## Attribution and license

Original prompt by **VibeFather**, [Daily Word Puzzle Game](https://vibefather.ai/t/daily-word-puzzle-game), mirrored by [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/daily-word-puzzle-game/prompt.md). Prompt and adapted design: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), non-commercial; commercial use requires the source author's license. Source license retained in `LICENSE.txt`. Removal: https://vibefather.ai/takedown.

The forty answer words are retained from the prompt; eighty accepted extras were curated for this implementation, not scraped. Code-drawn assets and third-party font/icon notices are listed in `ASSETS.md`. Font and icon licenses accompany the static assets.
