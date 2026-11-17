# Pocket Meadow

- Original input: `data\prompts\615-virtual-pet-companion\615-virtual-pet-companion.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: this directory. Independent static export: `out\`. No build was run.
- Original prompt: [VibeFather](https://vibefather.ai/t/virtual-pet-companion), mirrored by [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/virtual-pet-companion/prompt.md). Prompt license: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires separate permission. See LICENSE and ASSETS.md.

## Implementation

Original code-drawn moss bunny and pixel habitat; timestamp-based needs, four exact care actions, reactions, local activity, two skill-based canvas games, six unlockable visible accessories, high scores, versioned device save, safe recovery, and a keyboard-accessible reset dialog. The pet never dies. No network services, accounts, external AI, therapy or real-companion claims.

This authorized no-build adaptation uses browser ES modules, HTML and CSS instead of the requested Vite/React/TypeScript/Tailwind build. Content is centralized in `content.mjs`; pure simulation/storage and canvas engine are separate modules. Lucide icons are pre-rendered from the existing lucide-react package. Fontsource fonts are local. No backend mocks or fake purchases: all gameplay and rewards run locally. Local saves are device/browser-specific and may be unavailable in private or restricted storage.

## Run and verification

From the repository root, use `node src\workflows\script\generate-preview.mjs out\pages\615-virtual-pet-companion\GPT-6\out` for the established isolated static preview. No install or build is required to run the exported site. Final public subpath: `pages/virtual-pet-companion/GPT-6/index.html`, plus `#/games` and `#/wardrobe`.

Private QA and actual screenshots are in `.checks\`; results and visual review are recorded in `.checks\qa.json`. The coordinator outcome report is `src\workflows\script\.ai-gpt6-report-615.json`. Registration remains disabled and undeployed; no collection assembly, publication or upload is authorized.

Verification command: `node out\pages\615-virtual-pet-companion\GPT-6\.checks\qa.mjs`. The final run passed 20 groups: exact care effects and cooldown, elapsed/offline decay applied once, low-energy play guard, actual full 30-second Snack Catch and 25-second Bubble Pop rounds with positive scores and one-time rewards, pause freezing, keyboard reticle movement, early-exit confirmation, six-item purchases/equipment/reload, reset focus trap, touch controls, corrupt/blocked storage, reduced motion and final-subpath resource isolation. Tested 1200×900, 1440×900 and 390×844; no horizontal overflow or browser/resource errors. Real desktop/mobile PNGs were opened and visually reviewed. Refinements corrected habitat/console overlap, modal Tab wrapping, screenshot animation settling and non-overlapping in-flow status feedback.

Artwork uses a 160×90 habitat and independent 32×32 pet/accessory layers. UI text and section templates are in `content.mjs`; this adaptation does not provide the requested typed React context, Tailwind configuration or Vite build scripts. Games and the local simulation are real browser implementations, not backend simulations. Persistence cannot sync between devices; browser data clearing also clears progress. No production build, deployment or commercial license clearance is claimed.
