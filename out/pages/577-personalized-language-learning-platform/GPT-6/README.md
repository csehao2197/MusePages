# Fluent — personalized English learning

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\577-personalized-language-learning-platform\577-personalized-language-learning-platform.md`, read in full together with `src\workflows\AI Agent\DESIGN.md`.
- Original specification: [Personalized Language Learning Platform](https://github.com/KingLeoJr/awesome-vibe-coding-prompt-code-templates/blob/677d1cfd76b8c1479767c662d130fc68df17027a/Personalized%20Language%20Learning%20Platform), KingLeoJr, MIT. The complete original license is retained in `LICENSE`. Lucide icons retain their ISC/Feather MIT notices there too. Book and plant artwork is original SVG/CSS; no third-party photos or remote fonts.
- Source: this directory's `index.html`, `style.css`, `app.js`, `icons.svg`, and `mark.svg`. Independent public static copy: `out\`. No build step, dependencies, environment variables, or runtime service.
- Final subpath: `/pages/personalized-language-learning-platform/GPT-6/index.html`. Registration is disabled and undeployed; no collection build or deployment is performed.

## Homepage adaptation

The original calls for Django, React, Bootstrap 5, Allauth, secure account storage, and a production learning service. This authorized homepage edition uses semantic static HTML, responsive CSS, and browser JavaScript instead. It does not claim to implement that backend or those frameworks.

All website text, lesson passages, vocabulary explanations, examples, feedback, and accessibility text are English. Language preference is explicitly limited to English in this edition, rather than displaying non-English examples or pretending to teach unsupported languages.

The local profile's selected level, goal, and focus deterministically rank the three matching-level lessons: matching skill adds three points and matching goal adds two. Beginner and intermediate are self-selected, not inferred or certified. No external AI, inference, model API, authentication, passwords, accounts, or network analytics are used.

## Working features

- Local editable profile and an immediately reordered three-step learning path.
- Six authored English lessons, three questions each, passage-based teaching, real answer checking, explanatory corrections, correct-answer score, completion, replay, and skill/level filtering.
- Optional playback uses only a local English Web Speech voice. Unavailable audio shows a written fallback; a transcript is always visible. No video or external multimedia is bundled.
- Six vocabulary cards: recall/reveal, self-rating, due queue, one-minute retry, and one-day doubling intervals capped at thirty days. “Words practiced” is self-rated, not tested mastery.
- Actual local quiz accuracy, completed lesson count, daily practices, calendar-date activity, streak, and a three-distinct-lessons weekly badge. No seeded or fabricated activity.
- Local journal, two readable study notes, accessible FAQ, and opt-in on-page practice reminders while the page is open.
- Browser data persists on the current origin/device only. Reset requires confirmation. Storage errors are disclosed rather than falsely reporting saved data.

Production forums/exchanges, public success stories and submissions, referral rewards, real events/meetups, third-party developer/translation APIs, remote notifications, video media, server data analytics, SSL deployment and Allauth are not implemented. The reflection prompt is expressly not a testimonial. No fake social activity, account flow, referrals, or inference is shown. Proficiency improvement is not assessed; the dashboard reports practice outcomes only.

## Run and verify

From the repository root, use the existing static-only helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\577-personalized-language-learning-platform\GPT-6\out
```

This serves only the export transiently and captures the real desktop preview; it does not build or deploy. For interaction verification, the private `.checks\verify.mjs` uses installed Playwright Chromium and `startPreviewServer`, asserts the final public mount, then closes its browser and server in `finally`.

Private evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`; public first-screen preview: `out\preview.png`. Input and static/preview SHA-256 records are in the hidden model-root fingerprint files, outside the export. QA and visual-review results are recorded after actual execution in `.checks\qa.json` and the coordinator's private report.

Verified with installed Playwright Chromium: 13 assertion groups passed at desktop 1200×900/DPR 1 and mobile 390×844/DPR 1, including all 18 quiz questions, deliberately incorrect feedback, profile/path persistence, combined filters, flashcard scheduling, journal/reminders, keyboard/Escape behavior, reset confirmation, and storage-failure feedback. No console, page, request, or HTTP resource errors; no horizontal overflow before or after interaction. Both actual viewport PNGs, the additional full mobile interaction screenshot, and the fresh 1200×900 preview were opened for visual review. Refinements improved mobile artwork containment, stat-label legibility, dialog focus restoration, and hidden skip-link clipping. All owned browsers and preview servers were closed.
