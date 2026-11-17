# Offscript

An English, premium-monochrome everyday adventure quiz. Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.

## Input and attribution

- Original: `data\prompts\627-interactive-personality-quiz\627-interactive-personality-quiz.md`, used in full with `src\workflows\AI Agent\DESIGN.md`.
- Source: Tencent EdgeOne, [Interactive personality quiz specification](https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills/blob/e3f25bd20d371d9a64613306a6a48da15671a35b/prompts/yi-kuan-tong-yong-hu-dong-ren-ge-ce-shi-wang-zhan-.md).
- Source license: MIT, Copyright (c) 2026 Tencent EdgeOne. Full notice is retained in `LICENSE` and the static export. Original orbital artwork uses CSS; no third-party imagery.
- Source: this directory's `index.html`, `style.css`, `icon.svg`, `js\data.js`, `js\app.js`. Public files are copied independently to `out\`.

## Implemented

Entry → 12 questions → 1.7-second processing → fixed-dark results. Four binary dimensions give 16 complete, uniquely named object-illustrated profiles. Questions, profiles, references, shuffling, scoring, and complement ranking are separate in `js\data.js`. Each dimension has three scenario questions, weights 1/2/1, option values 0/1/3/4, maximum 16. A rounded 0–100 directional score selects the second pole at 50 and above; the first pole otherwise. The index is the arithmetic mean, not a percentile or quality score.

Options shuffle per attempt without changing their score values. Previous-question editing, keyboard controls, focus management, theme preference, reduced motion, four-axis radar, three-paragraph interpretations, transparent conceptual quality card, ranked contrasting counterparts, clipboard share with accessible manual fallback, local text download, restart, and about/reference dialogs are functional. No account or network API is used. Only theme preference is stored locally; answers remain in memory.

Mapping: curiosity → openness; rhythm → conscientiousness/planning; energy → extraversion/social engagement; perspective → analytic/holistic attention. Three scholarly references and all score rules are available in the About dialog. Conceptual coverage is 4/4 (100%); item validity, reliability, trait independence, norms, and compatibility are **not established**. Entertainment only; never diagnosis.

## Static adaptation and limits

Build-free HTML/CSS/browser JavaScript replaces requested Vue CDN/anime.js with native DOM/CSS, avoiding external runtime dependencies. The requested HarmonyOS font stack falls back to installed system fonts; no font CDN is contacted. English object-pair names and object emoji adapt the Chinese naming examples. Index label and share template are English equivalents. CSS orbit/sphere motion replaces a particle library. Save downloads a readable text result, not a raster image.

No Edge Functions, KV, global rankings/counts, or backend mocks are presented as live. EdgeOne deployment is not performed or authorized. Browser-only complement ranking is an explicitly playful deterministic rule. No secrets, environment variables, installs, build, dist, publish, or upload are required. Real WeChat hardware/browser and throttled 3G timing have not been verified; browser scripts avoid optional chaining, nullish coalescing, and top-level await.

## Run and verify

From the repository root, serve only the static export with the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\627-interactive-personality-quiz\GPT-6\out
```

This captures a preview, not a build. Final public subpath: `/pages/interactive-personality-quiz/GPT-6/index.html`. Source metadata, fingerprints, this README, and `.checks\` are private and excluded from export.

Private actual test assertions and screenshots: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png` and result images. Validation status and visual review are recorded only after execution. `out\preview.png` is produced by `StaticHomepage.ensurePreview`; `.generation-preview.sha256` binds it to the static digest. Registration uses the existing helper, disabled and undeployed.

Actual QA passed 34 assertion groups: all 16 reachable profiles and weighted midpoint boundaries; 12-question desktop keyboard/edit flow and mobile flow; 1.7-second processing; light/dark persistence and fixed-dark results; real clipboard contents and downloaded result; manual copy fallback; dialog focus trapping/Escape; clean restart; reduced motion; and 375/390/414/1024/1200/1440 layouts. Chromium reported no console, page, request, or HTTP resource errors. Desktop 1200×900/DPR1 and mobile 390×844 home/result PNGs were opened and visually reviewed: centered hierarchy, restrained orbit artwork, consistent whitespace, readable text, dominant result codes, and unclipped mobile content. The longer footer and results remain normally scrollable. Two initial harness assertions were corrected to wait for the real theme transition and normalize Windows clipboard line endings; the complete suite then passed. No product failure was suppressed.

Run the same private, build-free assertions from the repository root with `node out\pages\627-interactive-personality-quiz\GPT-6\.checks\verify.mjs`. It owns and closes its loopback static server and Chromium. MicroMessenger user-agent emulation passed home/answer checks; it is not verification on real WeChat.
