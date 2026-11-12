# TrekTribe group travel booking page

- **Original prompt**: `data/prompts/004-group-travel-booking/004-group-travel-booking.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/group-travel-booking/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Header and hero**: sticky nav with mobile menu. A 75vh sunset-ridge hero with hiking silhouettes, two CTAs and a social-proof strip.
- **How it works**: four-step timeline with an animated travelling dot (vertical on mobile).
- **Live cost calculator**:
  - Controls: group size slider/stepper 6–50; destination; 5/7/10/custom days; tier.
  - Defaults reproduce $1,240/person, $14,880 total for 12 people, and "You save $3,720".
  - "Get Detailed Quote" pre-fills the quote form.
- **Packages**: six cards with category filter tabs and a hover scale (a snap carousel on mobile).
- **Planning dashboard mockup** (laptop + phone) with live activity voting, beside the six feature bullets.
- **Split-payment tracker**: $12,000 ÷ 8 avatars. Tap a traveler to mark them paid; it switches between pay in full and 3 installments, and updates the progress bar.
- **Corporate retreats**: dark section with placeholder company wordmarks.
- **Testimonials**: carousel, 3 visible on desktop, 1 with dots and swipe on mobile.
- **FAQ**: single-open accordion.
- **Quote CTA**: gradient section with a validated quote form, then the footer, and a sticky mobile "Get Quote" bar.

## Mocks and limitations

- Photography is replaced by generated SVG illustrations (no licensed photos are bundled).
- Calculator prices use an illustrative model: base rate × days/7 × tier × group factor, with savings of 15–30% by size.
- Company names under "Trusted by" are fictional placeholders, and the trust badges are text labels.
- Quote, payments, "View Trip", the planning tool and the package catalog are local demos; nothing is sent or charged.
- The prompt's emoji bullets are rendered as Lucide-style icons, per `DESIGN.md`. Fonts (Sora, Inter) load from Google Fonts with fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844: no console, page or resource errors, no horizontal overflow. Also verified: calculator defaults and changes, the custom-days input, the size limit, package filters (visible count), voting, payment toggles and installments, the single-open FAQ, quote validation and success, the menu, the package carousel and testimonial dots. Desktop and mobile screenshots were reviewed visually.
