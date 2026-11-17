# Orbit Academy

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\572-drone-and-robot-coding-lessons\572-drone-and-robot-coding-lessons.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory's `index.html`, `styles.css`, `app.js`, and `assets\`. Independent public static copy: `out\`.
- Public subpath: `/pages/drone-and-robot-coding-lessons/GPT-6/index.html`.

## Learn and customize

Open the static homepage through any ordinary static HTTP server. No compilation, installation, environment variables, or backend is needed. From the repository root, the existing preview helper can serve and capture this static export:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\572-drone-and-robot-coding-lessons\GPT-6\out
```

Select Drone flight or Robot coding. Choose any of the six missions per path. Drones use touch buttons or arrow keys while the grid is focused; collect every star, avoid obstacles, and reach the green pad. Robots start facing north: queue Forward / Left / Right and run. Turns rotate in place. The sixth robot mission additionally requires the cyan supply crate before finishing. Reset safely cancels execution and restores the starting state; commands remain editable. Completed missions are saved only in browser localStorage when available.

Edit mission arrays and copy in `app.js`, design tokens in `styles.css`, and original local illustrations in `assets\`. Keep source and public copies synchronized; rerun QA and refresh the preview digest after any change.

## Boundaries and actual verification

This is a static educational homepage with actual bounded 6×6 movement, obstacle collision, collectible state, orientation, command sequencing, completion dependencies, and progress. Robot programs accept at most 24 commands; playback is interruptible. It never evaluates arbitrary code and has no real hardware, network control, backend execution, accounts, or cloud synchronization. Craft variants are visual only.

The original request's third-party skill installation and EdgeOne Pages deployment were not performed: this run authorizes neither installation nor deployment. HTML/CSS/browser JavaScript is the permitted static adaptation. Modern Android/iOS viewport, touch, and keyboard layouts are included; Chromium responsive emulation is not a claim of testing every physical phone.

Private tests and real screenshots: `.checks\qa.mjs`, `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Run the test from the repository root with `node out\pages\572-drone-and-robot-coding-lessons\GPT-6\.checks\qa.mjs`. It serves only this static export at its final subpath and closes its browser/server in `finally`. Tests exercise all 12 missions through the actual UI, keyboard/touch controls, boundaries/obstacles, star/supply completion gates, direction and playback cancellation, queue limits, persistence/storage failure, field guide, resources and overflow. Viewports: 1200×900 DPR1 and 390×844 touch, plus overflow checks at widths 320/768/1440. Mobile controls are positioned immediately below the grid so both can be seen together.

Collection preview: `out\preview.png`; input and static/preview fingerprints are private sibling dotfiles. Desktop and mobile real screenshots were opened for visual review: blue-on-navy hierarchy, original artwork, distinct gold collectibles/green goal, balanced desktop columns and readable single-column mobile layout. QA JSON records final assertions and review evidence. Registration is disabled and undeployed; no build or publication was run.

## Source and license

Prompt: “Drone and robot coding lessons,” Tencent EdgeOne, MIT.
Source: https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills/blob/e3f25bd20d371d9a64613306a6a48da15671a35b/prompts/ke-ji-tan-xian-jia.md

The original MIT notice is retained in `LICENSE` and `out\LICENSE`. Local UI icons are from Lucide (ISC / applicable Feather MIT notices, copyright Lucide Icons and Contributors); see the complete `assets\lucide-license.txt` and its public copy. Robot, drone, orbital mark, and hero illustrations are original SVG artwork created for this page. No external images, fonts, services, or downloaded artwork are used.
