# Little Worlds

## Identity and provenance

- Actual generator: `gpt-6.1-sol`; public display label: `GPT-6`.
- Original input: `data\prompts\581-creative-worlds-learning-platform\581-creative-worlds-learning-platform.md`, read in full together with `src\workflows\AI Agent\DESIGN.md`.
- Original specification: [Creative worlds learning platform](https://github.com/first-fluke/oh-my-agent/blob/e76b05071aab7057a44c6b0d0640ce59bd7375d1/benchmarks/prompt.md).
- Specification copyright © 2026 Eunkwang Shin, Gahyun Kim, MIT. Full notice retained in `LICENSE` and the public export. Lucide icons retain their complete ISC/Feather MIT notices in `NOTICE`.
- All dioramas are original procedural 3D geometry, rendered locally by this implementation. No remote images, fonts, AI image generation, or third-party worlds.
- Source: `out\pages\581-creative-worlds-learning-platform\GPT-6\`. Public static export: its `out\` folder. Final public route: `/pages/creative-worlds-learning-platform/GPT-6/index.html`.

## Product and people

An inviting, creation-first homepage leads into a small, meaningful worldbuilding studio. The primary persona is a primary-school child below Grade 6, with a large-target, short-text interface. A teacher or caregiver can offer a custom challenge on the same device without collecting student information.

The central journey is **imagine → build → explore → revise → reflect → save**. Start from storytelling, habitat, emotion, dream-world, or blank-island challenges. A book-based activity is suggested to grown-ups and can be assigned with the custom challenge. Saved projects reopen for further revision. Original starter scenes can be remixed; they are not represented as community creations.

## MVP and information architecture

Implemented: responsive discovery homepage; under-one-minute onboarding through a challenge; studio; local imagination guide; exploration mode; saved-world shelf; classroom guidance; privacy explanation.

- Place four object types by dragging from the palette, by tap/click, or by focusing the canvas and pressing Enter after selecting a piece.
- Select pieces on the canvas or in the labeled dropdown. Drag to move; arrow keys move the selected object. Buttons move, turn, grow, shrink, recolor, and remove pieces.
- Orbit the actual 3D scene, choose day/night/ocean, and undo/redo up to 40 scene changes.
- Explore mode turns arrow keys into camera controls and activates a piece's story reaction and visible lift when clicked or when Enter is pressed.
- Cycle warm, age-appropriate creative questions. Save a written reflection with the world.
- Save/load up to 12 worlds, each containing up to 28 pieces. Delete saved worlds individually.
- A grown-up can enter a private, same-device learning challenge.

Homepage navigation: Discover → challenges; Your worlds → saved shelf and remix starters; For grown-ups → purpose and custom challenge; creation calls to action → studio. Escape and explicit close buttons dismiss dialogs; native dialogs contain keyboard focus.

## Visual and technical architecture

Cream paper, plum typography, apricot calls to action, pale lilac skies, and low-poly toy-like islands. Restrained curves, generous spacing, serif “what if,” original illustrated worlds, and Lucide icons create a calm, playful identity without scores or perfection-based tests.

This authorized static adaptation uses HTML, CSS, ES modules, and Canvas 2D with a custom 3D mesh renderer. Scene vertices have real x/y/z coordinates, camera rotation, projected polygon depth ordering, and object rotation/scale. It is an orthographic toy world, not a screenshot or a pretend editor. It is not a first-person physics engine; exploring rotates the view and activates objects.

- `index.html`: semantic homepage, studio, and supporting dialogs.
- `style.css`: shared visual tokens, responsive layout, focus treatment, reduced-motion support.
- `world.js`: reusable procedural geometry and projection engine.
- `app.js`: interaction, bounded undo/redo, guide, reflection, storage, and gallery.
- `icons.svg`: locally bundled Lucide symbol subset.

The prompt recommends Next.js/TypeScript, React Three Fiber/Drei, Tailwind, OpenAI, and database storage. These are **not implemented**: static HTML/JavaScript is used to meet the independent-static-homepage scope without builds or runtime services. There is no backend, live AI, database, community feed, moderation service, remote classroom dashboard, public sharing, or authentication. The interface explicitly labels the guide as an offline demo and explains local storage.

## Proposed production design, not implemented

Priority after this local MVP: accessibility testing with children and facilitators; audited child-safe AI; consent and account boundaries; secure classroom assignments; moderation and controlled sharing. Build shared schema/types, a world service, a child-safe guide service, a teacher assignment view, and opt-in sharing only after those safeguards exist.

Suggested database schema: `World(id, ownerId, title, sceneJson, reflection, updatedAt)`, `WorldVersion(id, worldId, sceneJson, createdAt)`, `Assignment(id, classroomId, prompt, reflectionQuestion)`, and `Submission(id, assignmentId, worldId)`. Accounts, consent, access policies, and deletion require separate design; no such tables or services run here.

Proposed AI system: a warm creative partner offering one short question and multiple possibilities, never answers or grading. Avoid personal questions, identifying information, unsafe topics, open chat with strangers, or automated public sharing. Adult consent, server-side secrets, minimization, moderation, retention controls, abuse reporting, and adversarial safety evaluation are prerequisites for any live service. Current guide prompts are entirely local, fixed, and child-appropriate.

## Running and verification

Serve only `out\` at its final public subpath. No build, install, environment variables, or production server is needed. From the repository root, the existing preview helper can serve it:

```powershell
node --input-type=module -e "import { startPreviewServer } from './src/workflows/script/generate-preview.mjs'; const s = await startPreviewServer('out\\pages\\581-creative-worlds-learning-platform\\GPT-6\\out'); console.log(s.url)"
```

Stop that manual server when done. The implementation uses only local resources and works without third-party network access. Local storage can be unavailable or cleared; saving reports failure instead of claiming success. Anyone using the same browser profile can see local projects. Do not enter personal information.

Private QA evidence lives in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`, and additional studio screenshots when present. Source/static checking uses the existing `StaticHomepage` helpers. Actual Playwright Chromium verifies the final HTTP subpath, desktop 1200×900/DPR1, mobile 390×844, interactions, keyboard, storage/reload, error monitoring, and horizontal overflow. Screenshot visual review and final preview evidence are recorded in the private QA/report only after actual execution.

The completed verification passed 25 assertion groups, including tablet 820×1180 and compact 320×720 overflow smoke checks. Desktop/mobile homepage and studio PNGs were opened and visually reviewed. Review corrected canopy shading and the compact dialog width; the final tested version has no recorded page, console, HTTP, request, or external-resource errors. These checks cover this local prototype, not production child-safety certification.

`out\preview.png` is the actual 1200×900 first-screen capture maintained by `StaticHomepage.ensurePreview`; `.generation-input.sha256` and `.generation-preview.sha256` preserve input and static/PNG fingerprints. Source files, this README, metadata, QA, and reports are not included in the public export.

Registration is a disabled, undeployed selection in `deploy\config.json`, performed only after validation. No collection build, dist, publication, or remote deployment is part of this delivery.
