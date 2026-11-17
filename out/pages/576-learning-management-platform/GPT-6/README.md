# Forma — Learning workspace

- Actual generator: `gpt-6.1-sol`; public model label: **GPT-6**.
- Original input: `data\prompts\576-learning-management-platform\576-learning-management-platform.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\576-learning-management-platform\GPT-6\`; independent static export: `out\`.
- Public subpath: `pages/learning-management-platform/GPT-6/index.html`.

## Experience

A warm editorial learning dashboard with original CSS artwork, Lucide icons, responsive workspace navigation, course search and filters, local enrollment, three short reading lessons per course, an optional knowledge check, persistent completion tracking, demo certificate text downloads, calendar month navigation, a local reminder preference, in-app notifications, dashboard customization, and a demo profile.

Instructor/Admin preview roles allow creating up to ten local text courses with a course brief. All roles are browser-only previews, not authorization. Initial progress, streak, activity bars, instructors, and events are sample data. Progress totals update from local lessons. Browser storage failures fall back to session memory.

## Static adaptation and limits

The original specification describes an extensive production LMS. This delivery deliberately implements the homepage and meaningful core browser interactions in plain HTML/CSS/JavaScript, not React/Next.js, NextAuth, Tailwind, React Query, or the named backend/integration libraries. It requires no build, dependencies, environment variables, API, or server runtime.

There is no real authentication, authorization, video delivery, rich-text publishing, grading service, submission or plagiarism engine, discussion/chat backend, payments, AI/ML, voice controls, LTI, blockchain credentials, offline service worker, AR/VR, native mobile app, or live classroom. The optional quiz is not graded. Certificates are clearly labeled, unaccredited text keepsakes, not PDFs. Sample reminders do not send background alerts. All website content is English. No WCAG conformance certification is claimed.

## Running and verification

From the repository root, serve only this model's `out` directory with the existing `startPreviewServer` export in `src\workflows\script\generate-preview.mjs`. It mounts the real final public subpath. No build or deployment is needed.

Private verification script and results: `.checks\verify.mjs`, `.checks\qa.json`; real desktop/mobile renders: `.checks\desktop.png`, `.checks\mobile.png`. Source/static validation uses `WorkspaceFiles` and `StaticHomepage`. Final preview uses `StaticHomepage.ensurePreview`; input/static/preview SHA-256 records are outside the public directory. The private report records actual results and visual review. Only validated static resources and licenses are exported; registration is disabled and is not deployment.

Actual verification passed 35 assertion groups in Chromium at 1200×900 and 390×844, DPR 1: HTTP/static isolation, meaningful content, keyboard search and modal focus cycling, wrong/right quiz feedback, lesson completion, download, reload persistence, enrollment, month navigation, local reminders, notifications, filters, dashboard preference, mock role switching, course authoring, escaped user text, cross-view search, blocked-storage fallback, and overflow checks before/after interactions. No console, page, request, or HTTP errors were observed in the desktop/mobile journeys. Both first-screen screenshots and full-page desktop/mobile screenshots were opened and visually reviewed: consistent peach/sage/lilac palette, serif hero hierarchy, aligned course controls, balanced desktop sidebar, and unclipped single-column mobile cards. Initial QA findings led to explicit modal focus wrapping and query-preserving cross-view search; initial private failure records remain in `.checks`.

## Attribution and license

Original prompt: **Learning management platform**, KingLeoJr, MIT.
Source: https://github.com/KingLeoJr/awesome-vibe-coding-prompt-code-templates/blob/677d1cfd76b8c1479767c662d130fc68df17027a/Learning%20Management%20System%20(LMS)

The original MIT notice is retained in `LICENSE` and the public export. Original illustrations and reading copy were created for this implementation. Lucide icons retain their complete ISC/Feather MIT notices in `NOTICE` and the public export. No third-party photos, fonts, or video assets are used.
