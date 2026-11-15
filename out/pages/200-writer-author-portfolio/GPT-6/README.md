# Writer / author portfolio

- Inputs: `data\prompts\200-writer-author-portfolio\200-writer-author-portfolio.md` and `src\workflows\AI Agent\DESIGN.md`.
- Actual model `gpt-6.1-sol`; public display `GPT-6`. Standalone `index.html`, original CSS/SVG book covers, original short prose and accessible `press-kit.txt`.
- Features: grid/list books, synopsis/excerpt dialogs, essay topic filter/full text, short/long bio, reading guide, sample newsletter archive, local newsletter and speaking forms, press download and mobile menu.
- Serve with an existing static server. Validate: `node out\pages\200-writer-author-portfolio\GPT-6\.checks\verify.mjs`. Actual desktop/mobile captures and assertions are in `.checks`; checks include interactions, keyboard dismissal, download, overflow and browser/resource errors.
- Independent export: `out\`; expected path `pages/writer-author-portfolio/GPT-6/index.html`, real 1200×900 preview. Registered disabled after checks; no build/publication.
- Mocks: sample identity and unpublished concepts, not a real bibliography. Retailers, publication dates, reviews, awards, portrait, real bio, agent, events and social/contact profiles await owner input. Forms send/store nothing; no subscriptions/bookings. No backend/environment variables.
- Review checklist: readable narrow-screen typography, focus/menu, excerpt Escape, book/essay controls, download and honest demo form behavior.
