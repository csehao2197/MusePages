# Orbit — AR learning lab homepage

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\578-ar-learning-lab-platform\578-ar-learning-lab-platform.md` (read in full), with `src\workflows\AI Agent\DESIGN.md`.
- Original prompt: KingLeoJr, “AR learning lab platform”, [source](https://github.com/KingLeoJr/awesome-vibe-coding-prompt-code-templates/blob/677d1cfd76b8c1479767c662d130fc68df17027a/templates/ar-education-platform/prompt.md.template), MIT. Attribution and full license are in `LICENSE`; Lucide icons retain their ISC notice.
- Source: this directory's `index.html`, `styles.css`, `app.js`, `icon.svg`, `icons.svg`. Independent public export: `out\`. No external fonts, images, network APIs, or runtime dependencies.

## Design and features

Warm editorial learning dashboard: forest green, buttery yellow, quiet paper, illustrated science objects, and a responsive navigation rail. Original Canvas artwork projects actual three-dimensional orbital coordinates with depth-sorted shaded planets. Six-planet exploration supports orbital speed, pause, viewing angle, planet facts, and a scored question. Relative periods are approximate; sizes/distances are compressed.

The physics lab implements the small-angle ideal pendulum equation `T = 2π√(L/g)` and time-based angular motion. Learners adjust length and gravity, run/pause, record one-cycle observations, and compare Earth/Moon at equal length before earning XP. Materials, instructions, assumptions, and safety guidance are visible.

The catalog combines subject, grade, and title filters. A clearly labeled sample-book scan unlocks a molecular lesson without camera permissions. Four guided science readings include checked questions. Local quests track unique completions, XP, level, badge, and an actual date-based streak. A Giza explorer has selectable educational landmark overlays. Native dialogs support keyboard dismissal and focus return. Reduced motion stops automatic solar motion and progress transitions; the lab starts paused.

## Honest static adaptation

The original is an unfilled framework/native/backend template, not a concrete framework mandate. This authorized homepage adaptation uses HTML/CSS/JavaScript instead of a framework or build. No native AR, real scanning/recognition, camera, microphone, location, hardware, auth, encrypted profiles, parental-consent service, educator CMS, live multiplayer, uploads, or production backend is implemented. No sensitive permissions are requested. The profile is a local Explorer placeholder, not a child account. COPPA/WCAG certification, 60fps/device latency guarantees, offline installation, RTL and multilingual lessons are not claimed. Enhanced/advanced items remain the original platform roadmap, not implemented product features. Browser interactions work without APIs after loading; first-load offline availability is not promised.

Only lesson completion identifiers, unlock status, streak count and date are saved in localStorage. Storage failures retain this-visit functionality. Grown-up corner clears this data. No environment variables or credentials.

## Run and verify

From the repository root, use the existing `startPreviewServer` from `src\workflows\script\generate-preview.mjs` with this model's actual `out\` folder. It serves only static output under `/pages/ar-learning-lab-platform/GPT-6/index.html`, on loopback with an ephemeral port. No build or deployment is needed.

Private repeatable QA: `node out\pages\578-ar-learning-lab-platform\GPT-6\.checks\verify.mjs`. It uses installed Playwright Chromium and the existing static server. Browser assertions and real screenshots are recorded in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Public preview is `out\preview.png`; input and static/preview digests are maintained in hidden files. There is no project lint/typecheck command for this plain browser-JavaScript adaptation; `node --check app.js` and browser assertions replace the template's requested npm lint/typecheck.

Validation: source and independent static checks passed; `node --check app.js` passed. Actual Chromium desktop (1200×900, DPR 1) and mobile (390×844, DPR 1) runs passed 28 assertion groups with no HTTP, request, console or page errors. Tests cover combined filters, empty results, sample unlock, molecular quiz, solar 3D viewing-angle changes, planet facts, pause, keyboard/focus restoration, real mobile taps, pendulum periods/observations/fair-comparison gate, quests/no duplicate XP, local persistence/deletion, landmarks, and reduced motion. There was no horizontal overflow before or after interactions.

Both actual homepage PNGs and lab screenshots were opened and visually reviewed. The mobile headline was refined to avoid an extra line; long laboratory dialogs retain their close control while scrolling. Forest/cream contrast, editorial hierarchy, orbital composition, spacing, illustration alignment, single-column cards and responsive controls were checked. Detailed evidence is in `.checks\qa.json`. Registration is disabled and undeployed in `deploy\config.json`; neither collection assembly nor publication is part of this delivery.
