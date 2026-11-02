# Savory Affairs Catering — project012

A standalone Next.js local demo directly beside the unchanged catering brief. No other numbered project is part of this implementation.

## Run and validate

From PowerShell:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\012-catering-services'
npm run dev
```

Production and validation:

```powershell
Set-Location 'C:\Code\Docs\sampe-md\nextjs-project-samples\012-catering-services'
npm run typecheck
npm run build
npm test
# Optional manual production preview, after tests have exited:
npm start
```

Open `http://127.0.0.1:3112`. Stop manual previews with Ctrl+C before testing. Dependencies resolve from the existing ancestor workspace; no reinstall or root lock changes are needed.

`npm test` starts its own **production** server, refuses to reuse an existing listener, and automatically stops it. Startup timeout: 60 seconds; individual test timeout: 30 seconds; assertion timeout: 7 seconds; two workers; no retries. Build uses `next build --webpack` with two generation workers.

## Implemented source scope

- Charcoal `#2D2D2D`, cream `#FFF8F0`, gold `#C9A84C`; editorial hero, subtle scroll-driven background movement where supported, responsive stacked service cards, hover lift, collapsible mobile navigation.
- Corporate ($35), Wedding ($75), and Private Party ($45) service selection updates planning. Other is available in the form.
- Classic ($35), Premium ($55), and Luxury ($85) tabs retain the brief's courses, selectable main alternatives and dessert choices. Classic's unspecified dessert choice is adapted to fictional lemon tart or chocolate cake. Keyboard arrows, Home and End operate tabs.
- Four-step planning timeline, consultation and tasting request intents; all stay local.
- Six individually decorated original SVG event-table studies in masonry columns, category filters, native modal lightbox, Escape dismissal, Tab containment and focus restoration.
- Three source sample quotations, five-star illustrations and manual previous/next carousel. They are explicitly **fictional and not verified**, rather than falsely presented as verified customers.
- Required name/email/phone/event/date/guest/venue inquiry, optional budget and notes, native and custom validation, local confirmation, edit retaining existing fields, and reset clearing inquiry details.
- Estimate: `max(package rate, event starting rate) × guests`, plus rounded 18% illustrative service allowance. Guest range is 20–500 whole guests. Wedding/Classic therefore uses $75/person, not $35. Budget comparisons show overage or remaining allowance. Taxes, venue, travel and extras are excluded. Tastings over 75 guests are illustratively complimentary; otherwise a separately disclosed $100 allowance.
- Five source FAQs, footer anchor links, local phone/email/social notices with dismissal. No dead links to invented accounts.

## Safety, mocks and deliberate adaptations

All business identity, Greater Metro service-area wording, venues, event counts, reviews, availability, policies and contact information are fictional/sample claims. Source “24-hour response” copy is qualified: no response is promised. No payments, ordering, credentials, emails, calls, account creation, providers, maps, analytics or API requests. Forms use in-memory React state only; reloading clears them. Use fictional details.

Dietary preferences are not guarantees of allergen-free preparation, cross-contact prevention, or kosher/halal certification. Provider confirmation would be required in a real implementation. Staffing/equipment/cancellation/tasting descriptions are illustrative, not contracts or services.

Photography is intentionally replaced by original culinary/event illustrations; none of the gallery is a real past-event photograph. Gallery table settings vary with flowers, candles, corporate place cards, string lights and food arrangements. CSS preserves the source's sophisticated serif/sans direction using installed **Georgia/Times New Roman and Arial/Helvetica**, rather than downloading Cormorant Garamond or Inter. No external font or image fetch is used. Scroll animation falls back to a static image where scroll timelines are unsupported; reduced motion disables animation and smooth scrolling.

## Asset provenance and licenses

- `components/Spread.tsx` and `public/brand-mark.svg`: original SVG artwork created for this demo, no third-party photography or downloaded images.
- Icons: installed `lucide-react` 1.61.0; ISC license with MIT notices for Feather-derived icons. The complete installed license is retained in `public/lucide-LICENSE.txt`.
- System fonts: referenced only, no font binaries redistributed; their operating-system licenses remain applicable.
- No licensed stock photos, webfont files, or external visual assets are included.

## Observed validation

On October 31, 2026, Node 26.13 / npm 11.20 with the supplied ancestor dependencies:

- Strict TypeScript (`npm run typecheck`): **passed**.
- Production webpack build (`npm run build`): **passed**, static `/` generated with two workers.
- Playwright (`npm test`): **18 passed, 0 failed**, nine focused scenarios each on desktop Chromium (1440 × 1000) and mobile Chromium (iPhone 13 profile). Final run: 12.4 seconds.
- Coverage includes event minimums and package pricing, main/dessert selection, contact/guest/date/budget validation and recovery, local summaries and edit/reset, consultation/tasting thresholds, gallery filtering and modal keyboard/focus recovery, keyboard menu tabs, FAQs/review/contact controls, mobile navigation, reduced motion, horizontal overflow, required fields, and absence of page errors/external requests.
- Final full-page renders inspected: `test-results\desktop-home.png`, `test-results\mobile-home.png` (generated, ignored artifacts).
- After validation: **no listening process remained on port 3112**.

An initial run exposed a test selector collision with Next's route announcer and browser Tab movement outside the only modal button; both were corrected before the final passing build/run. This is not a cross-browser or full accessibility audit; Firefox, WebKit, real dietary handling and real services are not validated.

Original brief SHA-256, verified unchanged before and after:

```text
F9E6A517CAE586B3FC476072F0A67C0D205D16F55F51A2A88C9C1C6A9EA1D43B
```
