# 034 — IGNITE 30 / PulseUp Fitness

A standalone, source-specific Next.js App Router demo. All application files are directly beside `034-fitness-challenge-landing-page.md`; no nested project or shared demo template. No real service is connected.

## Run and validate

The existing parent workspace supplies installed dependencies; do not reinstall or change its lockfile. Windows PowerShell, from this folder:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\034-fitness-challenge-landing-page'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run typecheck
npm run build
npm run test
```

`build` runs `next build --webpack` with two workers configured in `next.config.ts`. `test` runs Playwright against the **production build** at `http://127.0.0.1:3134`. Its managed webServer refuses an existing server, has a 30-second startup bound, and automatically stops its process tree. Tests use one worker, no retries, a 30-second per-test timeout, and a 180-second global bound. Desktop Chromium and Pixel 7 Chromium projects run the same eight focused scenarios. Chromium is already installed in the provided environment.

For manual production exploration:

```powershell
$env:NEXT_TELEMETRY_DISABLED='1'
npm run start
```

Stop with Ctrl+C. `npm run dev` also uses port 3134. Do not start either while running the production browser tests.

Cleanup verification:

```powershell
@(Get-NetTCPConnection -LocalPort 3134 -State Listen -ErrorAction SilentlyContinue).Count
Get-FileHash '.\034-fitness-challenge-landing-page.md' -Algorithm SHA256
```

## Implemented journeys

- Sticky desktop/mobile navigation, keyboard Escape dismissal, mobile bottom join bar, and real section anchors.
- Source Week 1 workout names, durations, exercise lists, difficulty stripes, horizontal swipe, and locked Days 4–7.
- Typed 30-day program: week selection, level filtering, accessible empty-state recovery, exercise-preview dialog, lower-impact alternatives, Free/Pro advanced-preview gating.
- Native enrollment validation, explicit consent, whitespace-alias error/recovery, plan selection, price summary, local confirmation, and preparation note.
- Free costs $0; Pro's illustrative price is $29 USD **one-time**. Actual charge is always $0. No subscription math, checkout, or card inputs.
- In-memory completion selections with undo and a 0–30 tracker. Confirmation before reset; cancellation preserves selections. Reset or refresh clears everything.
- Three clearly fictional community stories, fictional Coach Maya note, archival leaderboard and keyboard-operable points explanation.
- Two pricing cards (Pro first on small screens), six FAQ accordions, repeated archival countdown, locally implemented nutrition/privacy/guidelines information.
- Native modal semantics, named dialogs, explicit Tab/Shift+Tab wrapping, Escape/backdrop dismissal, focus restoration, skip link, reduced-motion support, and 48px link/button targets.

## Source adaptations and safety

The original April 1–30, 2026 cohort is historical. Both countdowns intentionally stay at **00** and are explicitly marked **archived**; they do not imply an upcoming launch. The January 2026 leaderboard is fictional archival sample data, not a live competition. Displayed legacy totals include imaginary community bonuses and are deliberately separate from the local completion tracker.

The orange/slate energetic direction, IGNITE 30/PulseUp identity, six-feature layout, source first-week structure, stories, four-step journey, leaderboard, two tiers, FAQs, and final CTA are retained. The harmful-pressure headline, guaranteed transformations, before/after photos, weight/dress-size claims, star ratings, artificial signup counts, fake availability limits, discounts, money-back promise, cash prizes, and “beast mode” prescriptions are omitted or reframed. There is no registered-trademark claim.

Weeks 2–4 are explicitly fictional revisits/practice variants of the source week, not a progressively intensified training prescription. Days 29–30 are gentle reflection/mobility concepts. Week 1's advanced exercise names remain as an un-timed text preview with gentler alternatives; the source's intense Tabata round instructions are not prescribed.

Video promises become **text previews**; the final group photo becomes an original typographic/CSS scene. Nutrition provides general variety/enjoyment ideas only. There are no macro targets/calculators, photo analysis, body measurements, health questionnaires, restrictive diets, or personalized medical/training advice. Maya is an imagined guide with no claimed qualifications. Story names and leaderboard handles from the brief are explicitly labeled fictional, not endorsements.

No email, account, provider, payment, real enrollment, live coaching, community integration, actual prizes, API, or backend exists. A made-up alias is requested, not personal information. All state stays in React memory in the current tab: no cookies, localStorage, sessionStorage, analytics, or submission requests. Refresh/reset clears state. No fake network-failure branch is added because no network transaction takes place; recoverable errors are actual alias/native-form validation and empty filters.

## Assets and typography

- `public/ignite-athlete.svg`: original SVG illustration created for this demo; no downloaded photography, model image, brand asset, or third-party media. It visibly substitutes for the requested gym photo.
- Story graphics, initials avatars, gym lighting, pulse marks, and final CTA background: original SVG/CSS/text, not participant photos or before/after evidence.
- Fonts: OS-installed `Impact`, `Arial Narrow`, `Franklin Gothic Medium`, Arial/Helvetica and generic sans-serif fallbacks. No font files are bundled or downloaded; those typefaces remain subject to their OS/vendor licenses. Headline appearance may vary by platform.
- Interface icons: `lucide-react` 1.61.0, ISC license; consumed from the declared dependency. Next.js, React, React DOM, TypeScript, and Playwright retain their respective package licenses. No external font or asset build dependency.

## Observed validation

Validated locally on the provided Windows/Node 26 environment:

- Strict TypeScript: passed (`tsc --noEmit`).
- Next.js 16.4.3 production webpack build: passed; static `/` generated with two workers.
- Playwright: **16/16 passed** (8 desktop + 8 mobile) against the production server.
- Coverage includes source workout metadata, all-week filtering, empty recovery, modal preview/focus return and keyboard confinement, native required/minlength/consent validation, alias-error recovery, no submission requests, plan math and switching, advanced gating, completion/undo, refresh/reset/cancel behavior, FAQ/coach/points/privacy, mobile navigation, responsive pricing, reduced motion, and overflow at 320/390/768/1440px.
- Desktop and mobile full-page/hero screenshots captured under ignored `test-results` and visually inspected. No horizontal document overflow, broken hero art, or overlapping page sections observed.
- Browser smoke checks observed no page errors or external resource requests.
- Production listener cleanup verified: **0 listeners on 3134** after Playwright.

Initial validation exposed an overly broad test alert selector and browser focus leaving a native dialog at its wrap boundary. The selector was scoped and explicit keyboard wrapping added; the full suite was rerun successfully.

Limits: tested in Chromium only; no real media playback, coaching, health outcomes, backend, email, payments, or live countdown are asserted. The UI is not a personalized fitness program.

## Original source integrity

The source Markdown was read fully and preserved unchanged. Original and post-validation SHA-256:

```text
72D3A21687D6420A474520535ADD8490B702D6432B34363AE3A3FA5E95096BFF
```

Scope: project **034 only**. No other demo, root manifest/lockfile, progress report, commit, deployment, or external service was modified.
