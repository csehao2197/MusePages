# Kite — pre-launch waitlist page

- **Original prompt**: `data/prompts/061-product-waitlist/061-product-waitlist.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/product-waitlist/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** minimal fixed nav (logo plus "Follow us on X") that turns white on scroll.
- **Hero:** 80vh with the launch pill, a 56px headline (48px on mobile) and a 480px email form. On mobile the input and button stack full width.
- **Counter:** the waitlist count animates up when it scrolls into view.
- **Content:** three feature cards (indigo border on hover), a 3-step timeline with a dashed connector (vertical on mobile), six testimonial "posts" in a 2-column masonry layout, and a one-open-at-a-time FAQ.
- **Referral ("Skip the line"):**
  - shown as a locked preview until you join
  - signing up validates the email and assigns position #4,833
  - both counters update and the page scrolls to your personal link
  - the link is a stable code derived from your email
  - includes Copy, X, LinkedIn, Email and WhatsApp share links, position/referral stats and a position bar
- **Final CTA and footer:** deep-indigo final CTA with a second form; minimal footer.
- **Mobile:** sticky "Join Waitlist" bar after the hero; it becomes "Share your link" once you've joined.

## Mocks and limitations

- **No backend:**
  - signups are stored only in this browser (`localStorage`); real friends can't actually join
  - a clearly labeled **"Demo: simulate a friend joining"** button shows the +100-spot mechanic
  - `window.kiteReset()` clears the demo state
- **Sample content:** Kite is fictional. The 4,832 base count and the testimonials are sample data, and handles are rendered as text, not real accounts.
- **Dates:** "LAUNCHING SPRING 2026" and the FAQ wording are kept from the brief although that date has passed.
- **Emoji:** the brief's emoji are replaced by icons.

## Run and verify

From the repo root, `node out/pages/061-product-waitlist/Opus-5.5/page.test.mjs` runs 5 Playwright checks:

- nav and hero specs
- features, timeline, locked referral, tweets and FAQ
- signup, referral link, share URLs, simulated referrals and persistence
- final CTA and footer
- mobile stacking, vertical timeline, share grid, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
