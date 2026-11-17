# Greenlight Driving School

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Input: `data\prompts\543-driving-school-website\543-driving-school-website.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Attribution: Prompt by [VibeFather](https://vibefather.ai/t/driving-school-website), adapted from [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/driving-school-website/prompt.md). CC BY-NC 4.0; non-commercial use only. See LICENSE and ASSETS.md.
- Source: this model directory. Static export: `out\`; final path: `/pages/driving-school-website/GPT-6/index.html`.
- Build-free HTML/CSS/browser JavaScript adaptation is authorized instead of requested Vite 6, React 18, TypeScript, Tailwind 3.4 and Motion. Native state machine and reduced-motion-aware CSS preserve the core interactions. No build was run.
- Features: four packages, a five-question practice quiz with locked answers and retake, three fictional instructor profiles, six tips, pickup areas, local booking with validation/restoration, and keyboard-accessible FAQ.
- All six specified VibeFather photos are local. Fredoka/Figtree are self-hosted Fontsource fonts; Lucide icon paths are supplied by the existing licensed package.
- Booking is a fictional browser-only sample. No backend, API, signup, telemetry, real reservation, email or SMS. Stats, instructors and school are fictional; practice results never guarantee a license.
- Run from the repository: `node src\workflows\script\generate-preview.mjs out\pages\543-driving-school-website\GPT-6\out`. This uses a temporary static-only server and creates the public preview, not a build/deployment.
- Private QA: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`; passed static validation and real Playwright Chromium checks at 1200×900, 1440×900, and 390×844 (DPR 1). Tests cover complete 4/5, 5/5 and 0/5 quiz runs, answer locks, keyboard control, retake, package preselection, inline validation, booking reload/change, malformed storage recovery, FAQ, all local photos, reduced motion, and overflow before/after interactions. No HTTP, request, console or page errors. Desktop/mobile PNGs, section screenshots and fresh out/preview.png were opened and visually reviewed. Preview and input digests are saved. Unique registration verified with enabled=false and deployed=false; category Education. Owned browsers and static servers closed.
- No environment variables, secrets, production backend, deployment or publish step.

Visual refinement: the supplied hero and cockpit photos contained car emblems. Original downloads remain unchanged in public/images; the static copies use a small local pixel-interpolation retouch to remove those emblems. No replacement imagery or image-generation model was used. Details: .checks/photo-retouch.json.
