# Filmmaker portfolio

- Inputs: `data\prompts\199-video-editor-filmmaker-portfolio\199-video-editor-filmmaker-portfolio.md`; `src\workflows\AI Agent\DESIGN.md`.
- Actual model `gpt-6.1-sol`; label `GPT-6`. Standalone `index.html`, original `landscape.svg` and locally encoded `quiet-study.webm`.
- Features: cinematic poster/background with play/pause, sample reel and project video dialogs, category filters/empty states, process/services disclosures, responsive menu and local project brief.
- Serve with an existing static server. Validate: `node out\pages\199-video-editor-filmmaker-portfolio\GPT-6\.checks\verify.mjs`. Checks include actual video playback/pause, project details, filters, enquiry, both viewports and browser/resources. Evidence: `.checks`. Original clip can be recreated with `.checks\make-clip.mjs`.
- Independent static export: `out\`; expected path `pages/video-editor-filmmaker-portfolio/GPT-6/index.html`. Real 1200×900 preview; registration disabled by default; no build or publication.
- Mock: sample identity; one explicitly reused original motion study, not client footage or full reels. No supplied credits, clients, awards, portrait, contact profiles or availability. Services/tools are proposed categories, not proficiency claims. Video starts manually for reduced-motion/bandwidth control; dialogs lazy-load playback. Enquiry sends/stores nothing. No backend/env.
- Review checklist: mobile stack, focus, category empties, video controls and Escape, honest credits and demo enquiry response.
