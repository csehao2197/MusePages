# Wanderly — project 006

A standalone, individually designed Next.js travel homepage, directly beside the original `006-travel-agency-homepage.md`. This is a **fictional, local-only demonstration**, not an operating travel agency.

## Run locally

The supplied ancestor workspace already contains the declared dependencies and Chromium. No install, ancestor manifest edit, or lockfile change is necessary.

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\006-travel-agency-homepage'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm run typecheck
npm run build
npm test
```

To explore the production build after testing:

```powershell
npm start
```

Open `http://127.0.0.1:3106`. Stop the foreground server with Ctrl+C when finished. For development, use `npm run dev` on the same port. Do not run either server while executing the tests.

`build` uses `next build --webpack` with **two build workers**. The Playwright production webServer starts the ancestor Next binary itself, refuses reuse of an existing listener, has a 60-second startup bound, and automatically stops its owned server. Tests have a 35-second per-test limit, a 120-second global limit, two workers, and no retries.

## Implemented from the brief

- Compass-branded Wanderly navigation; transparent over the hero and white/shadowed on scroll; destinations, styles, deals, about, blog, fictional phone information, counted wishlist, and planning CTA. Mobile uses a native modal navigation drawer and a sticky bottom planning bar.
- Full-viewport illustrated beach hero with the original headline/tagline, subtle scroll parallax, four-field trip search, optional native departure/return date inputs, 1–12 adult stepper, all six styles, and Bali/Amalfi/Kyoto/Patagonia/Iceland trending shortcuts. Mobile search expands into a vertically stacked panel.
- Original four featured destinations with the brief's prices, durations, ratings, review counts, and tags: Santorini, Kyoto, Costa Rica, and Amalfi Coast. Desktop four-column cards; mobile horizontal, scroll-snapping carousel. View All reveals eight typed fictional trips.
- All six **How Do You Travel?** categories, each with distinct landscape artwork, icons, description, and functioning style discovery. Search combines destination/style, displays applied dates/travelers, provides empty results and reset, and carries preferences into an inquiry.
- Native trip-detail dialogs with descriptive itineraries, highlights, style shortcuts, local saving, and **Plan This Trip**. Browser-local wishlist persists across reloads, ignores stale/duplicate IDs, supports removing items, and explains storage failures.
- Three connected planning steps and a working Start Planning CTA. Inquiry previews validate name/email, destination/style, departure today-or-later, return after departure, integer travelers from 1–12, per-person budget from $500–$50,000, and demo acknowledgment. Errors are associated with controls, announced, and focus the first invalid field. Success summarizes the local preview with a clearly marked demo reference.
- Bali Explorer weekly-deal banner with the specified illustrative pricing/inclusions, simulated countdown, and “6 spots” qualification. Claim This Deal preselects Bali and its $2,399 budget; it never reserves anything.
- The three source traveler quotes with fictional initials portraits, dates, and ratings; mint testimonial section; count-up trust metrics and a dark-teal plain-text partner row.
- All three named travel stories, with original short readable demo articles in dialogs, author initials, categories, and illustrative reading-time labels.
- Teal-gradient newsletter with email validation, local preference confirmation, unsubscribe, and unavailable-storage handling. **The email address is not stored**; only an opt-in flag is saved.
- Destination/style footer discovery, useful local company/support/policy information panels, design-only social/payment/trust controls, privacy/terms/sitemap, and Clear saved preferences.
- Semantic landmarks and controls, skip link, visible keyboard focus, native dialog dismissal/focus restoration plus Tab/Shift+Tab containment, responsive layouts, and reduced-motion treatment for parallax, card effects, scrolling, and count-up.

## Mocks and intentional limitations

All prices, reviews, trip inclusions, ratings, testimonials, audience/business statistics, partner names, support promises, availability, urgency, and trust badges are qualified as illustrative in the interface. Dates **do not** query inventory. The simulated deal timer starts at 2 days, 14 hours, 32 minutes on page load, updates locally, and has no real expiry.

There is no backend, booking, payment, email, account, authentication, analytics, map provider, or live API. Phone/social/company/support links open local explanatory panels rather than pretending to contact services. The three planning steps depict a real-world concept; this implementation stops at an inquiry preview. Closing that dialog clears its transient form/confirmation. “Create another preview” starts a fresh form, not a saved reservation.

Only `wanderly-favorites` (trip IDs) and `wanderly-newsletter` (an opt-in flag) use browser localStorage. Newsletter unsubscribe and footer clearing remove those preferences. Inquiry data exists only in page memory and is never transmitted. If storage is blocked, visit-only interactions remain available with explanatory status messages.

**Visual adaptation:** the brief's photography is intentionally replaced by original SVG coastal, bamboo, rainforest-bridge, blue-domed Santorini, Amalfi-village, rice-terrace, mountain, and Mexico City illustrations. Traveler/author portraits are fictional initials avatars, not real people. Partner names are plain text, not licensed partner logos; social glyphs are generic UI icons. These adaptations avoid unlicensed photography, invented endorsements, and external media dependencies while retaining the destination-specific art direction.

## Licenses and provenance

- All landscape SVG geometry and page CSS were authored specifically for this project in `components\scene.tsx` and `app\globals.css`. No stock imagery, scraped photos, remote image URLs, or `source.unsplash.com` assets.
- **DM Serif Display Regular:** local `public\fonts\DMSerifDisplay-Regular.ttf`, obtained from the Google Fonts repository's `ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf`. Its unchanged SIL Open Font License is retained as `public\fonts\DMSerifDisplay-OFL.txt`.
  - Source: https://github.com/google/fonts/tree/main/ofl/dmserifdisplay
- **Inter variable:** local `public\fonts\Inter-Variable.ttf`, obtained from Google Fonts' `ofl/inter/Inter[opsz,wght].ttf`. Its unchanged SIL Open Font License is retained as `public\fonts\Inter-OFL.txt`.
  - Source: https://github.com/google/fonts/tree/main/ofl/inter
- Fonts were retrieved on 2026-10-31 and are served through `next/font/local`; neither builds nor page rendering request Google Fonts.
- UI icons: declared `lucide-react` package, ISC-licensed. Framework/runtime dependencies retain their upstream licenses in the installed workspace.
- Destination data and article prose are fictional/original. The named testimonial text and brand/section wording follow the supplied brief and are expressly marked as demo content.

## Observed validation — 2026-10-31

- `npm run typecheck`: **passed**, strict application TypeScript.
- `npm run build`: **passed**, Next 16.4.3 production webpack build; `/` statically prerendered with two build workers.
- `npm test`: **20 passed, 0 failed**, 22.3 seconds in the final run: ten focused scenarios on desktop Chromium (1440×1000) and mobile Chromium/iPhone emulation (390×844).
- Covered the real destination/style/date/traveler search and inquiry handoff; empty/reset/all-six-style discovery; persisted wishlist detail/removal; malformed or blocked storage; required/email/date/traveler/budget/acknowledgment errors and successful inquiry; Bali deal defaults; newsletter persistence/unsubscribe/failure; keyboard modal containment/Escape/focus return; readable blog and privacy panels; mobile drawer and sticky planning; desktop scroll navigation.
- All scenarios asserted **no browser runtime errors, no external requests, and no non-GET/form transmissions**.
- Page-level horizontal overflow checks passed at desktop/mobile widths, including additional 1024px and 320px checks. The destination carousel's internal horizontal scrolling is intentional and separately checked.
- Inspected final desktop/mobile hero and full-page screenshots, inquiry errors, and local confirmation screenshots. Verified final count-up values, readable overlays, stacked mobile content, and modal rendering. Screenshots and HTML test report are generated only inside ignored `test-results\` and `playwright-report\`.
- Confirmed **no listener on port 3106** after automatic Playwright production-server cleanup. No demo server is intentionally left running.

This is focused Chromium verification, not a comprehensive accessibility audit or a claim of Safari/Firefox/device-hardware coverage. There is deliberately no live travel-service behavior to validate.

## Original brief preservation

The original Markdown was read in full and never edited. Its before/after SHA-256 is unchanged:

```text
4A255AB2FEFDFAC581078E8096D82C52FC308BAE1E87DAF543B533414138B9CE
```

Only project 006 was implemented in this task; this document makes no claim about completion of the other numbered projects.
