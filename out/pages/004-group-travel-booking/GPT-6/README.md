# TrekTribe Adventures

Original: `data\prompts\004-group-travel-booking\004-group-travel-booking.md`; design guidance: root `DESIGN.md`. Authored directly by GPT-6 using **gpt-6.1-sol**. Static HTML/CSS/JavaScript, not a Next.js project.

Source is `index.html` and `assets\`. Static delivery is `out\index.html`, `out\assets\`, and the actual rendered `out\preview.png` (1200 × 900). No build, installation, environment variables or backend is needed. The preview workflow provides its own temporary loopback HTTP server. Future publication path: `deploy\MusePages\pages\group-travel-booking\GPT-6\`, registered disabled, not deployed.

## Features

Warm photographic landing page; calculator for 6–50 people, eight destinations, duration and accommodation tier; six filterable packages with details and session-only saves; interactive activity voting; local planning/chat sandbox with safe text rendering and copy-link feedback; full-pay/three-installment visualizer; corporate retreat section; snap-scrolling mobile packages/testimonials; FAQ accordions; quote forms and mobile navigation.

## Validation

`checks.mjs` covers live estimates, custom duration, demo quote submission, category filters/details, voting, chat escaping, split amounts, FAQ expansion and final quote feedback. The session runner validates resources at the intended public subpath, captures an actual desktop preview and fully loaded mobile screenshot, checks viewport overflow/navigation, and records browser errors under `.checks\`. Actual state is maintained in `metadata.json`.

## Mock data and limitations

All packages, review counts, customer stories, company logos, group statistics, carbon/B Corp claims, and payment/security assurances are illustrative, not verified affiliations or offers. No live quotes, reservations, payments, Stripe service, accounts, refunds, insurance, notifications or real-time synchronization exist. Calculator estimates exclude flights and insurance; its group savings are a transparent illustrative 25% premium versus an individual rate, not market research.

Planning votes, saves and chat live only in the current page session. The copied URL shares the public demo, not private group data. Forms send no data or email. The catalog link explains that six samples exist rather than inventing forty packages. The phone number is a nonfunctional concept contact. Generic landscape photographs illustrate destinations, not named properties or actual trip activities. Offline Arial replaces Sora/Inter to avoid runtime font services.

Local photo sources (Unsplash CDN IDs, prefix `photo-`): `1551632811-561732d1e306` (hikers), `1537996194471-e657df975ab4` (Bali), `1531366936337-7c912a4589a7` (aurora), `1448375240586-882707db888b` (forest), `1509316785289-025f5b846b35` (desert), `1476514525535-07fb3b4ae5f1` (coast/lake scenery), `1493976040374-85c8e12f0c0e` (Japan). Individual authorship and source license pages remain to be verified before commercial redistribution; no additional rights are granted. Lucide icons use the repository's existing package; ISC license is included as `assets\LUCIDE-LICENSE.txt`.
