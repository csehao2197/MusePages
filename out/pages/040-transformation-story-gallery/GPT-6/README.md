# Everyday Strong

- Input: `data\prompts\040-transformation-story-gallery\040-transformation-story-gallery.md` and `src\workflows\AI Agent\DESIGN.md`.
- Model: `gpt-6.1-sol`; `GPT-6` is the output label. HTML/CSS/JavaScript source is this directory.
- Features: responsive editorial homepage, keyboard/drag comparisons, swipe/toggle gallery, combined filters/search/sort, detailed stories, local storyboard player, program links, sharing, FAQ, consent-gated local photo/story and consultation previews.
- Export: `node out\pages\040-transformation-story-gallery\GPT-6\prepare.mjs`. It copies only homepage files/assets into `out\`.
- Run/check from repository root: `node --check out\pages\040-transformation-story-gallery\GPT-6\app.js` and `node out\pages\040-transformation-story-gallery\GPT-6\verify.mjs`. Existing Playwright opens and closes random loopback servers.
- Actual checks: 69 assertions including interactions, decoded images/local fonts, viewport equality and overflow at 1440/1024/768/390/320, touch heights, nested mount, source/export equality and real 1200×900 preview. Desktop/mobile/full-page/preview screenshots visually reviewed.
- Registered export: `out\`; future public location `pages/transformation-story-gallery/GPT-6/index.html`. Registration is disabled/undeployed; collection assembly and publishing were not run.
- All profiles, quotes, trainers, dates, health outcomes, aggregate data, offers and community posts are fictional. Photos are stock illustrations, not authentic transformations. Videos are silent local still-image storyboards, not recorded testimonials. Full stories use native dialogs. Forms only preview in memory; no upload, email, persistence, appointment or payment. Consultation is not medical advice.
- Environment variables: none. Runtime: local static assets only. Asset sources/licenses: `assets\credits.txt`; original prompt rights remain with their authors.
