# Kingston's

Original `data\prompts\285-barber\285-barber.md` read fully with `src\workflows\AI Agent\DESIGN.md`. **gpt-6.1-sol**, display **GPT-6**. HTML/CSS/JavaScript with Georgia/Arial/Consolas system fonts; original SVG interior, barber portraits and nine style/tool illustrations replace photography.

Six service selectors, four barber-specific planner entries, date-sensitive illustrative times, duration/price summary, missing/past-date/contact validation, gallery viewer, walk-in disclosure and responsive navigation. Demo times are not live; all shop/staff/review claims are fictional. No booking, message delivery, payment or wait API.

Source here; static export `out\`; public `pages\barber\GPT-6\index.html`. Any static HTTP server works; no environment variables/build. QA: `node out\pages\285-barber\GPT-6\verify.mjs`. Source rights retained.

Actual QA: 36 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Opened actual desktop and mobile captures. Navy shop interior, red italic emphasis and barber-pole stripe create a precise traditional identity. Service grid, barber portraits, tool gallery and red planning CTA align cleanly. Mobile preserves readable service stacking, two-column barbers/gallery and contained contact/booking controls. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
