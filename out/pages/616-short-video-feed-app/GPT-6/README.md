# Hearthline

- Original input: `data\prompts\616-short-video-feed-app\616-short-video-feed-app.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: this directory's `index.html`, `style.css`, `content.js`, `app.js`, and `icons.js`. Independent static export: `out\`.
- Public subpath: `pages\short-video-feed-app\GPT-6\index.html`. No production build or deployment.

## Experience

Six original, real WebM animation loops, one-at-a-time scroll snapping, playback/pause/seeking, keyboard navigation (arrows/J/K, Space, L, M, /), optional synthesized ambient sound, persistent browser likes/saves/follows/comments, following/saved feeds, creator profiles and poster grids, local text search, clipboard sharing and private device-video preview. Reduced-motion starts videos paused. All website content is English.

Social counts and seed conversations are illustrative; creators are fictional. No authentication, real followers, remote comments, server, analytics, publishing or upload service. Selected videos stay on-device and disappear on reload. Browser storage may be unavailable; in that case state stays in memory. Ambient two-note sine sound is synthesized only after explicit activation.

The six bundled clips are loaded into browser object URLs so seeking works on ordinary static hosts without HTTP range support. This downloads the complete collection (approximately 7 MB of video) rather than using production adaptive streaming.

## Adaptations and license

The public original specifies portrait-photo simulations and Vite/React/TypeScript/Tailwind. The user's explicit real-video requirement takes precedence: this is a build-free HTML/CSS/ES-module static adaptation using six original procedural art films, not copied photography or paid demo assets. Motion is real encoded moving video, not a poster pretending to play. Fonts use local system Segoe UI/Arial and Georgia, rather than bundled Manrope/Instrument Serif. UI icons are Lucide (ISC). Interface transitions use CSS. The original does not include its paid page sections or exact asset instructions; no claim of reproducing the private Pro demo is made. Labels and story data are primarily in `content.js`; structural/control copy also appears in the HTML and browser module.

Prompt by **VibeFather**, sourced through **liyupi/awesome-vibe-coding-websites**, commit `85431a57f231fa59269dad62c757193d6a3fd0ff`.
Source: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/short-video-feed-app/prompt.md
Original: https://vibefather.ai/t/short-video-feed-app
Prompt and adaptation: **CC BY-NC 4.0**, https://creativecommons.org/licenses/by-nc/4.0/ . Non-commercial only; commercial use requires the applicable permission. `LICENSE.txt` includes attribution and icon notice. All six video clips and posters were procedurally authored for this page; no third-party video is used.

## Running and verification

From the repository root, `node src\workflows\script\generate-preview.mjs out\pages\616-short-video-feed-app\GPT-6\out` serves only the static folder temporarily and captures a preview without a build.
Private recreation/QA entry: `node src\workflows\script\.ai-gpt6-616.mjs qa`. It uses existing Playwright Chromium and `startPreviewServer`, exercises the final public subpath, and closes its browser/server in `finally`.
Private QA: `.checks\qa.json`; desktop and mobile images: `.checks\desktop.png`, `.checks\mobile.png`. Public preview: `out\preview.png`; input and static/preview fingerprints stay outside the export.
Actual results and visual review are recorded only after execution in the private QA and coordinator outcome files.

### Verified results

The final Playwright run passed 22 assertion groups at 1200×900/DPR 1 and touch-enabled 390×844/DPR 1, plus reduced-motion/storage-disabled fallback. All six local videos decoded at 720×1080 with approximately five seconds of actual playback. Seeking, pause/play, desktop wheel, mobile swipe, keyboard controls, persistence after reload, comment submission, follow/saved feeds, profile-grid navigation, deep links, search/topics, clipboard sharing and private device-video selection passed. No page/console/HTTP/resource errors or horizontal overflow occurred in the successful run.

Both real QA PNGs were opened and visually reviewed. The desktop serif editorial heading was reduced to preserve its intended two-line rhythm, and creator labels/captions were enlarged. The final screenshots show clear hierarchy, balanced spacing, warm neutral contrast, an unobstructed portrait scene and working controls; mobile uses a full-width feed and bottom navigation without desktop sidebars. The lower desktop note continues below the first viewport naturally. QA screenshots show the actual paused first frame for repeatable inspection, not a substitute for real video. Final public-preview review is recorded separately in `.checks\qa.json`.
