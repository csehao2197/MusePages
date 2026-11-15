# Prime & Co

Original: `data\prompts\209-reservation-booking-page\209-reservation-booking-page.md`; follows `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`, label `GPT-6`. HTML/CSS/JS source here; independent export `out\`.

Dark/gold three-step booking with 1–20 guests, navigable 60-day calendar, unavailable Mondays/past dates, sample half-hour slots and waitlist, seating-capacity checks, validated guest details, escaped review, acknowledgment, preview ID, modify/cancel and Google/ICS calendar exports. Interior photo: Unsplash photo-1517248135467-4c7edcad34c4.

All availability and venue details are fictional. No table is reserved, email sent, deposit charged or data transmitted. Calendar files use New York timezone; adding one records only a personal preview, not a reservation. Guest details stay in memory.

Serve `out\` using a static HTTP server. QA from root: `node out\pages\209-reservation-booking-page\GPT-6\verify.mjs`; evidence/captures `.checks\`. Public path `pages/reservation-booking-page/GPT-6/index.html`. No environment variables/backend, builds, installations or publication.
