# Shanhai — Archive of Mythic Beasts

- Actual generator: `gpt-6.1-sol`. Public model label: `GPT-6`.
- Input: `data\prompts\573-shanhai-mythology-archive\573-shanhai-mythology-archive.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\573-shanhai-mythology-archive\GPT-6\`.
- Static export: the source directory's `out\`, containing only HTML, CSS, browser JavaScript, original SVGs, license, and the generated preview.
- Public mount: `/pages/shanhai-mythology-archive/GPT-6/index.html`.

## Exhibition

A black-lacquer digital museum with bronze rules, jade highlights, ivory serif typography, and restrained cinnabar. Nine original engraved SVG specimens support an archive with name/element search, five regional filters, accessible modal records, a three-specimen feature switcher, an interactive atlas, and a personal field-note collection. A date-determined visitor ticket offers a daily personal seal. Three downloadable SVG posters are complete, self-contained compositions.

Exactly nine records retain the brief's IDs, archive numbers, regions, elements, risks, motifs, and newly translated/rewritten curatorial notes. The whole visitor-facing experience is English: the requested Chinese display headings, seals, and characters are replaced with English translations or romanizations. `Jiuweihu` is presented as “Nine-tailed fox”; `Qitu` follows the brief's supplied romanization. System serif and sans-serif fonts replace Chinese display typography. All nine illustrations, the map, the identity mark, and the posters were made for this page; no third-party beast images or fonts are loaded. This is a contemporary educational interpretation, not a scholarly edition or an authenticated ancient illustration.

## Static adaptation and limits

Plain HTML/CSS/JavaScript is an expressly permitted technical option in the original brief. No package install, build, server framework, or remote generator is needed. The supplied optional asset paths were not present in the prompt directory; consistent original SVG fallback artwork is used instead.

The authorized delivery is a static homepage, not the original brief's production EdgeOne application. No EdgeOne skills were installed, no Edge Functions or KV binding were created, and no deployment or public URL is claimed. `/api/health`, `/api/daily-beast`, and `/api/beast-vote` are not requested or emulated as real services. The daily selection is calculated from the device's local calendar date; sealing is a browser-local vote/visitor impression, not a shared tally. “Your visits” is a local visit count, not a fabricated global count. Collections, visits, and the single seal per local date are stored under `shanhai-archive-v1` in localStorage. If storage is unavailable or malformed, the page remains usable with session-memory state. No account, analytics, tracking, credentials, or environmental configuration is needed.

## Run and verify

From the repository root, use the existing `startPreviewServer` export in `src\workflows\script\generate-preview.mjs` with this model's actual `out\` folder. This serves only that public folder at its final collection subpath. Alternatively serve `out\` using an ordinary static HTTP server. Do not serve the source or repository folder publicly. Use the already-installed `@playwright/test` Chromium for local QA; no production build is required.

`StaticHomepage.checkSource`, `validateStaticOutput`, and `ensurePreview` from `src\workflows\script\render-prompt-page.mjs` provide the repository's source/static/preview gates. `.generation-input.sha256` fingerprints the complete original input plus complete DESIGN. `.generation-preview.sha256` records the static digest and actual preview image digest.

Private evidence lives in `.checks\qa.json`, `.checks\desktop.png`, and `.checks\mobile.png`. Verification status is recorded there and in `metadata.json`; screenshots are not substitutes for the live page. Registration is disabled and undeployed. No collection build, publication, upload, or deployment is included.

### Actual verification

Playwright Chromium passed 18 assertion groups against the final public subpath on 2026-11-16 UTC: desktop 1200 × 900 and mobile 390 × 844, both DPR 1; additional 768, 1024, and 1440 widths; all nine records; combined region/search and empty results; real keyboard modal opening, Tab/Shift+Tab wrapping, Escape and focus restoration; feature copy/art switching; all five atlas regions and archive filtering; personal seal/visit persistence; collection add/open/remove/empty states; real SVG download; and unavailable-storage fallback. No HTTP, request, console, or page errors occurred. No horizontal overflow was found initially, in records, or after interactions.

The first keyboard check exposed a modal Tab-cycle escape, which was corrected and the complete suite rerun successfully. Both real desktop and mobile homepage PNGs were opened and visually reviewed. The review checked hierarchy, serif/sans balance, bronze/jade contrast, alignment, spacing, responsive reflow, and artwork visibility. An opaque dragon contour was changed to linework so the coiled anatomy remains clear. Refreshed screenshots were opened again; additional archive and mobile-ticket captures were inspected. The repository source/static gates passed; the standard `ensurePreview` gate produces the separate real 1200 × 900 `out\preview.png` with its paired digest.

The local scoped test can be repeated from the repository root with `node out\pages\573-shanhai-mythology-archive\GPT-6\.checks\verify.mjs`. It closes its own browser and HTTP server in `finally`. It intentionally resets `visualReviewed` in its QA result: a fresh screenshot requires a fresh human/agent image review before that field is set.

## Provenance and license

Original brief: “Shanhai mythology archive,” Tencent EdgeOne, MIT.

Source: https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills/blob/e3f25bd20d371d9a64613306a6a48da15671a35b/prompts/shan-hai-jing-yi-shou-dang-an-guan.md

Original license snapshot: `data\downloads\github.com\TencentEdgeOne-awesome-website-prompts-and-skills\e3f25bd20d371d9a64613306a6a48da15671a35b\LICENSE`.

The full upstream MIT notice is retained in `LICENSE` and `out\LICENSE`. New implementation and original digital artwork are provided under that same license. Ancient mythology is the subject matter; no rights are asserted over the underlying traditional stories.
