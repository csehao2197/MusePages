# Stride — professional development learning space

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\579-professional-development-course-platform\579-professional-development-course-platform.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Source: KingLeoJr, “Professional development course platform”, [original MIT template](https://github.com/KingLeoJr/awesome-vibe-coding-prompt-code-templates/blob/677d1cfd76b8c1479767c662d130fc68df17027a/templates/personal-development/prompt.md.template). Copyright (c) 2025 KingLeoJr. Full terms in `LICENSE`.
- Source and metadata: this model directory. Static export: `out\`. Final public path: `/pages/professional-development-course-platform/GPT-6/index.html`, unless existing shared registration specifies another slug.

## Implementation

English, responsive, build-free HTML/CSS/browser JavaScript homepage. Evergreen and warm-paper learning dashboard, original SVG growth illustration and course artwork, locally generated Lucide icons (Lucide ISC attribution in `NOTICE`), system fonts, semantic landmarks, native dialogs, keyboard controls, reduced motion.

Six original short courses contain 18 substantive reading/practice/knowledge-check lessons on productivity, mindfulness, leadership, emotional intelligence, habits, and career planning. Filter by topic, level, coach, or search. Local enrollment, sequential lessons, wrong-answer feedback, completion metrics, and non-accredited badges work without a server. Reflections inside course exercises are not retained.

Create personal goals with 1–5 milestone checklists, a date and a related course. Edit local profile/focus/coaching style/weekly target; bookmark courses and resources; write a saved weekly reflection; download a blank worksheet; request and remove simulated coaching sessions; publish a one-lesson local course; write local community replies; save an illustrative workshop RSVP; configure in-app notifications; and copy achievement text. `/` focuses catalog search; Escape closes native dialogs and mobile navigation.

## Boundaries

The original template leaves all frameworks/providers as placeholders. This authorized homepage adaptation uses native browser state and static HTML rather than Next.js or a backend. No production authentication, authorization, OAuth, database, real coach certification/partnership, payment, calendar or video integration, public community, push service, third-party developer API, multilingual UI, or AI personalization is provided. No real transactions, appointments, credentials, or employment outcomes are promised. Learning time is the sum of suggested durations, not measured engagement. Coach identities and events are illustrative. Content is educational, not therapy.

All data stays in browser `localStorage` under `stride-growth-v1`, with an in-memory fallback when storage is unavailable. No secrets, environment variables, or external runtime APIs are used. The browser reads the local Lucide SVG once and inserts icon geometry directly, avoiding repeated external SVG-use requests during interactions. Do not enter sensitive data. This is not a secure multi-user system. Production transport security belongs to the eventual host and has not been configured or verified here.

## Run and validate

From the repository root, serve only the export using the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\579-professional-development-course-platform\GPT-6\out
```

For browser interaction checks, the private `.checks\qa.mjs` uses the installed Playwright Chromium and `startPreviewServer`, mounts only this export at its final public subpath, and closes its owned browser and server. Execute `node out\pages\579-professional-development-course-platform\GPT-6\.checks\qa.mjs`.

Private evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Public preview: `out\preview.png`; input and static/preview SHA-256 records are private at model root. Metadata flags are written only after their actual checks. Registration is disabled and undeployed. No build, distribution, publication, dependency installation, or external generation is used. Root workspace has no `lint` or `typecheck` scripts; do not claim those prompt acceptance commands passed. Actual validation results and visual review are recorded after execution in `.checks\qa.json` and the coordinator’s private one-prompt outcome report.

The browser checks cover desktop 1200×900/DPR1, mobile 390×844/DPR1, and overflow at 320, 768, 1920, and 3840 CSS pixels. They exercise sequential productivity and career-planning lessons, incorrect answers, reflections, badges, search/filter empty states, persistent goal milestones, local booking cancellation, profile recommendations, resource download, local course publication, community replies, preferences, mobile navigation, modal keyboard focus, and English content. Desktop/mobile screenshots were opened and visually inspected for hierarchy, alignment, spacing, contrast, and responsive layout; mobile learning-card wrapping and font weights were refined. No full WCAG certification, assistive-technology audit, real-device or throttled mobile performance benchmark is claimed.
