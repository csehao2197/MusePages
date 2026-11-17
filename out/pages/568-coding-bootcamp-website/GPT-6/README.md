# Copperline — GPT-6

## Input and identity

- Original: `data\prompts\568-coding-bootcamp-website\568-coding-bootcamp-website.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: `https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/coding-bootcamp-website/prompt.md`.
- Prompt by VibeFather: <https://vibefather.ai/t/coding-bootcamp-website>, CC BY-NC 4.0. Commercial use requires a separate license.
- Source: this directory; static delivery: `out\`; private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.

## Implementation

Single-page, self-hosted HTML/CSS/JavaScript adaptation of the requested Vite/React/TypeScript/Tailwind design. No build was authorized or run, and the requested framework/component/store file structure is not implemented. Shared dependency installation was unnecessary. Copy and datasets are centralized in `content.js`; native details, form controls and browser state replace React components. CSS and IntersectionObserver replace Motion. Latin Zilla Slab and Inter fonts and the three exact template portraits are local. Inline SVG icons use Lucide geometry.

The page provides all four curriculum phases, three sample cohorts, four sample outcomes, three tuition plans, three instructors, five keyboard-operable FAQ rows, and a validated application. Name/email/cohort/40-character motivation validate on blur; the trimmed character count is live. Submit stays disabled until valid. Drafts and saved state persist under `copperline:app`; edit and clear controls affect only this key. Storage errors explicitly prevent a false saved state. Financing selection is only a comparison and anchor navigation, never a transaction.

No backend, remote application submission, email, payments, reserved seats, real school or employment guarantee exists. All identities, numbers and policies are fictional sample content. Instructor portraits are the original AI-generated template placeholders. No executable coding demo was requested. The illustrative admissions address is not linked as a real service.

## Run and verification

From the repository root, use the installed helper without building:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\568-coding-bootcamp-website\GPT-6\out
```

For interactive testing, import `startPreviewServer` from that module and serve only this static directory. The final public mount is `/pages/coding-bootcamp-website/GPT-6/index.html`. Shut down the returned server after testing.

Actual verification results and screenshot review are recorded in `.checks\qa.json`. The generation workflow checks source, static resources, actual browser behavior, subpath operation, and preview digests before marking the metadata ready. The 1200×900 preview is `out\preview.png`; mobile QA uses 390×844. Registration is disabled and undeployed; no collection build or deployment is included.

Executed `node out\pages\568-coding-bootcamp-website\GPT-6\.checks\verify.mjs`: 22 verification groups passed, including 1200×900 desktop and 390×844 mobile, supplemental 1440px/320px widths, keyboard navigation/FAQ/form submission, 39/40-character validation, local draft reload/edit/clear, and denied storage. No browser, resource, HTTP or console errors; no horizontal overflow before or after interaction. Desktop/mobile first-screen PNGs, instructor/tuition/application crops, and the fresh formal preview were opened for visual review. The initial QA attempt only failed an overly strict test copy-length threshold; `.checks\qa-initial.json` preserves that result. Browser/server resources were closed after every check.

Static delivery remains unminified browser source rather than a Vite production build. Motion is approximated with browser-native section reveals, one-shot statistic counting, a scroll-driven timeline rail, and reduced-motion handling; it does not reproduce Motion's per-tag/per-table-row stagger implementation.

See `ASSETS.md`, `LICENSE`, and `NOTICE` for attribution and third-party terms.
