# Cedar & Verb — Language School Website

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Input: `data\prompts\548-language-school-website\548-language-school-website.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Original prompt by VibeFather: https://vibefather.ai/t/language-school-website. Repository provenance: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/language-school-website/prompt.md.
- Source: this directory's HTML, CSS and browser JavaScript. Static output: `out\`. QA: `.checks\qa.json`, desktop/mobile PNGs. Public subpath: `/pages/language-school-website/GPT-6/index.html`.

## Features

Six eight-week courses, language/level filters, expandable lesson themes, three ten-question quiz banks, advisory scoring with A1/A2/B1/B2 thresholds, local latest-result persistence, recurring in-person/online schedules, transparent prices, fictional teacher profiles, teaching-method photography, demo quotes, enrollment preselection, browser validation, locally saved requests, edit/reset, accessible mobile navigation, keyboard controls, FAQ and reduced motion.

## Static adaptation and limitations

The authorized no-build scope uses semantic HTML, CSS and JavaScript modules instead of the requested Vite 5 / React 18 / TypeScript / Tailwind / Motion build. Editable content and banks live in `content.js`; rendering functions in `templates.js`; interactions in `app.js`. CSS provides responsive layouts and nonessential transitions; native details provide progressive disclosure. Local Lucide SVGs are rendered from the installed package, not imitated. No build or deployment was run.

All website content must be English. Consequently the original Spanish-language questions and foreign-language alternatives have been replaced by English-language learning-concept questions for Spanish, French and Italian. This is **not** the original direct-language placement instrument. Exact scoring works, but results are advisory and do not measure actual language comprehension. This limitation is disclosed beside the quiz and in its FAQ. A teacher must confirm the starting level.

No backend, API, analytics, actual enrollment, real staff, verified reviews or real contacts. Only the latest quiz result and enrollment draft/request are stored locally. Storage failure is reported and never shown as a saved success. No environment variables or credentials. Six supplied photographs, local Fraunces / DM Sans variable fonts and Lucide icons have attribution in `ASSETS.md` and `out\NOTICE.txt`.

## Run and verify

From the repository root, run `node src\workflows\script\generate-preview.mjs out\pages\548-language-school-website\GPT-6\out` for the repository's isolated static preview. Serve `out\` using any static HTTP server for browsing; use `index.html` and hash navigation. Browser modules require HTTP rather than `file://`.

Private verification uses `node src\workflows\script\.ai-gpt6-548.mjs qa`; final preview uses its `preview` phase. This serves only the actual static folder under the final public subpath using the existing preview server and installed Playwright Chromium. See `.checks\qa.json` for actual assertions, dimensions, errors and visual-review evidence. Screenshots and checks stay outside the public output.

## License

Prompt by VibeFather, CC BY-NC 4.0, https://creativecommons.org/licenses/by-nc/4.0/. Adapted for noncommercial use with attribution; no broader rights are granted. Commercial/client use requires a VibeFather Pro license. Supplied images are redistributable with this template according to the original prompt. Fonts are OFL; Lucide is ISC with applicable Feather MIT notices. Original source license is retained in `LICENSE`; runtime notices are in `out\NOTICE.txt`.

## Actual verification

Completed real 1200×900 DPR1 desktop and 390×844 DPR1 mobile Chromium checks at the final subpath. 15 assertion groups passed; no HTTP/resource/request/console/page errors or horizontal overflow. Desktop and mobile first-screen plus full-page screenshots were opened and visually reviewed. Hierarchy, editorial photographic composition, spacing, typography, contrast, mobile stacking and below-fold layouts were checked. Actual 1200×900 homepage preview and both SHA-256 records are verified. Registration exists once with enabled=false and deployed=false; no collection assembly or publication. Owned test browsers and servers are closed. English concept-quiz deviation remains as explicitly disclosed above.
