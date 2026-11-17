# Blackpine Martial Academy

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Original: `data\prompts\563-martial-arts-dojo-website\563-martial-arts-dojo-website.md`.
- Source: VibeFather, [Martial Arts Dojo Website](https://vibefather.ai/t/martial-arts-dojo-website), via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/martial-arts-dojo-website/prompt.md).
- Prompt license: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires the original author's separate license. Original downloaded license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.
- Source folder: `out\pages\563-martial-arts-dojo-website\GPT-6`; static output: its `out\` subfolder.
- Intended public address: `pages/martial-arts-dojo-website/GPT-6/index.html`. Registration is disabled and undeployed; no build or deployment is authorized or performed.

## Implementation

An editorial, black/crimson/rice-paper one-page homepage with the six exact supplied photos, self-hosted Fontsource fonts, original brush/belt SVGs and the specified Lucide icons. Three tracks preselect the booking form. All 14 weekly classes remain visible; combined day/program filters highlight matches, dim other classes to 40%, report empty combinations and persist locally. A timetable class transfers its exact weekday, time, track and level into the local booking, and changing tracks clears incompatible session preferences. Six belt milestones follow a scroll-filled ascending path, with alternating desktop cards, vertical mobile presentation and keyboard exploration. Reduced-motion mode shows the complete path instantly.

Includes two fictional instructor bios, trial/individual/family prices, calm anti-bullying guidance, disclosed sample reviews, phone links, navigation and mobile call/trial bar. The booking validates name, age, age/track compatibility, contact and phone; supports preferred start, local persistence, safe restoration, reset and blocked-storage fallback. No payment, SMS, actual reservation, server, analytics, external API or environment variable is used. Sample local data can be removed with “Book another” or browser site-data controls.

## Authorized static adaptation

The original requests Vite 6 / React 18 / TypeScript / Tailwind 3.4 / Motion and `dist`. This delivery deliberately uses native HTML/CSS/JavaScript modules with `out` for the authorized no-build static workflow. `content.js` centralizes the school copy/data/links; CSS implements the same palette and self-hosted font weights, IntersectionObserver handles reveals and native scroll progress drives the belt path. Lucide SVGs were serialized from the installed package, not redrawn from another icon source. Fontsource 5.3.0 package files were downloaded for local hosting (package CDN used only during preparation; the website makes no CDN requests).

The entire website is English, as explicitly required for this job; no multilingual dojo labels are introduced. Original images are retained rather than substituted. Mobile hero is taller than the prompt's suggested 560px to preserve legibility of its copy and controls. The family-price note uses “about $76” and does not invent a 6 p.m. class absent from the source timetable. Trial messaging distinguishes the free first class from the optional $29 introduction and explicitly states that no text is sent.

## Run and verify

From the repository root, serve only the model's `out` folder using `startPreviewServer` from `src\workflows\script\generate-preview.mjs`; it returns the complete final-subpath URL and a `close()` method. No install/build is needed. The private `.checks\qa.mjs` script performs Chromium desktop/mobile, keyboard, filtering, local storage, booking, malformed-data, overflow, resource-error and reduced-motion checks against this static server, closing its browser/server in `finally`.

Validation evidence is recorded in `.checks\qa.json`; actual screenshots are `.checks\desktop.png`, `.checks\mobile.png` and section screenshots. These files are private and excluded from `out`. `out\preview.png` is the separately captured 1200×900 first screen maintained by `StaticHomepage.ensurePreview`; hidden SHA-256 files track full input/design and static/preview content. See the final private job report for executed results and visual review.

Executed result: 54 Chromium assertions passed at 1200×900 and 390×844, with an additional 320px overflow check. No console/page/HTTP/resource errors, external requests or network submissions occurred. Keyboard navigation, combined filters, retained class cells, session handoff, valid/invalid bookings, persistence/reset, malformed restoration, text-only rendering of stored names, blocked storage and reduced motion passed. Actual desktop/mobile PNGs and the fresh preview were opened for visual review; hierarchy, spacing, contrast, typography, portrait cropping, the belt path and responsive header/form were inspected. Browsers and preview servers were closed.

## Rights

See `ASSETS.md`, `LICENSE`, `fonts\LICENSE` and `NOTICE.html`. The six supplied photos are credited exactly as “Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.” Font licenses are OFL-1.1; Lucide is ISC with the included Feather-derived MIT notice. The school, people, ranks, prices and reviews are fictional. No lineage or martial-arts outcome is claimed.
