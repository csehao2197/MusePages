# Camp Bluejay

- Generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\566-summer-camp-website\566-summer-camp-website.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Prompt source: [Summer Camp Website](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/summer-camp-website/prompt.md), by [VibeFather](https://vibefather.ai/t/summer-camp-website). CC BY-NC 4.0; see `LICENSE` and `ASSETS.md`. Non-commercial only; no extra rights are granted.
- Source: `out\pages\566-summer-camp-website\GPT-6\`; static delivery: its `out\` folder. All page copy is in `content.js`; SVG artwork is in `art.js`.

## Implementation

Original layered paper-cut landscape, locally hosted template photographs and Fontsource fonts, three age bands with activity detail buttons, keyboard-scrollable seven-day schedule, cabin/safety information, illustrated staff, responsive fees, single-open accessible FAQs, mobile navigation, and editable/clearable local registration.

The authorized build-free adaptation uses native HTML/CSS/JavaScript modules instead of Vite/React/TypeScript/Tailwind, motion and lucide-react. CSS implements motion and reduced-motion behavior; the six small UI stroke icons use inline Lucide-compatible geometry. No framework packages, server, external runtime requests, analytics, payments, real emails or actual booking service. Fonts are Fontsource files downloaded for local hosting, not loaded from a CDN at runtime. The original SVG artwork does not imitate a real camp.

Registration uses `camp-registration.v1` in localStorage. It is not a booking; no bunk is held and no deposit is collected. Browser storage can be cleared or unavailable; storage failures are disclosed. Use invented personal details only, particularly in the notes field. Camper ages and selected session must match. The extended island trip belongs to the two-week session. Photos are template-generated illustrations of an invented location, not evidence of an actual camp. No availability, accreditation or safety service has been verified.

## Running and validation

Serve only `out\` over HTTP. From the repository root, the existing preview tool can be used without a build:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\566-summer-camp-website\GPT-6\out
```

This captures the real first-screen preview then closes its temporary server. For an interactive local visit, serve only the export:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory "out\pages\566-summer-camp-website\GPT-6\out"
```

Open `http://127.0.0.1:8080/index.html` and stop your server when finished. The actual QA used the existing `startPreviewServer` helper at `/pages/summer-camp-website/GPT-6/index.html`, not the source directory.

## Verified outcome

Static source/resource checks passed. Chromium ran at 1200×900 and 390×844, DPR 1, plus a 1440×900 overflow/storage test. Twenty-six assertion groups passed: real photos/fonts, navigation and Escape, keyboard skip link, activity details, week scrolling and edge buttons, exclusive FAQs, required fields and age/session compatibility, local save/reload/edit/resave/clear, denied storage, malformed stored draft, reduced motion, 44px control heights, and no document overflow before or after interactions. There were no console, page, HTTP, failed-request, external-request or non-GET request errors in the two primary viewport runs. An initial test wrongly assumed the desktop strip could scroll over 1000px; it was corrected to assert its actual scrollable width.

Private results: `.checks\qa.json`; real first-screen images: `.checks\desktop.png`, `.checks\mobile.png`. Both were opened and visually reviewed, as were the actual `out\preview.png` and supplemental program/cabin/fees/registration captures. Mobile typography was refined from four title lines to three to expose the dock. Warm paper hierarchy, spacing, text contrast and form/table readability were checked. Desktop blue table headers use large bold text for contrast. Tall supplemental element captures can include Playwright fixed-header stitching artifacts; the mandatory first-screen images do not.

`StaticHomepage.checkSource`, `StaticHomepage.validateStaticOutput` and `StaticHomepage.ensurePreview` provide the source, static and actual 1200×900 preview gates. Input and preview SHA-256 records are outside the export. The private `.checks\verify.mjs` records the scoped procedure; it requires this job's live coordinator lock and manifest and intentionally refuses a different job.

The hero uses a 610px desktop minimum and a taller mobile layout rather than squeezing the card into 62vh. Motion and SVG details are independently implemented, not an exact reproduction of a live demo. Static files stay below 20 MB. Registration is disabled for publication (`enabled: false`, `deployed: false`); no build, collection assembly, publication or deployment was performed.
