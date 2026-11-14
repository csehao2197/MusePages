# D’FOOTPRINT — handmade footwear store

- **Original prompt**: `data/prompts/068-handmade-footwear-store/068-handmade-footwear-store.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript storefront with hash routes (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (router, views, cart and checkout)
  - `assets/data.js`: catalog, delivery zones, edits and FAQ
  - `assets/shoes.js`: illustrated SVG footwear
  - `page.test.mjs`: browser checks
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/handmade-footwear-store/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD describes a Next.js 15 Commerce app with PostgreSQL/Drizzle and Paystack. Builds, installs and backends are out of scope for this static collection, so this version is a self-contained storefront. It follows the Next.js Commerce visual language: monochrome, Geist font, product-first grid and slide-out cart. It covers every page the PRD requires as a hash route:

- Home, Shop (all, slides, slippers, mules, search)
- Product detail, Custom Order, Cart drawer, Checkout, Order confirmation
- About, Contact, FAQ, Shipping & Returns, Privacy, Terms

## Features

- **Homepage:** immediately communicates the four PRD messages (what's sold, handmade, customization on approval, nationwide delivery). Also includes featured designs, how custom orders work, a past-work gallery and gift options.
- **SEO:**
  - unique title, meta description and H1 per route
  - alt text on every image
  - schema.org `Product` JSON-LD for the 12 featured designs (NGN prices, `MadeToOrder`), for Merchant-style readiness
- **Shop:** category filters, price sort, and search with an empty state that leads to custom orders.
- **Product page:**
  - large image with 3 views, clear price, colour and size selection, size guide
  - optional custom edit with an explicit "subject to approval / may cost extra" acknowledgment (never implies instant customization)
  - delivery, returns and handmade notes, related designs
- **Cart drawer:** quantity, remove, pending-edit badges, `localStorage` persistence and focus management.
- **Checkout:** guest only.
  - validates Nigerian phone numbers
  - the state drives the delivery method: pickup or dispatch zones in Lagos, waybill by region elsewhere
  - gift packaging and card options
  - clear cost breakdown
  - **simulated Paystack step**, then an order confirmation with next steps
- **Custom order:** reference photo upload (local preview, type and size checks), details form, a reference number and a WhatsApp share link.
- **Info pages:** About, Contact, FAQ, Shipping & Returns (fee table, case-by-case returns), Privacy and Terms.

## Mocks and limitations

- **Payment:** simulated. Nothing connects to Paystack and no money is taken. Orders, cart and checkout details live only in `localStorage` (`dfp-cart`, `dfp-orders`, `dfp-checkout`).
- **Sample data:** products, prices (from ₦12,000), delivery fees, past-work captions and policies are illustrative and must be replaced with the owner's real data before Merchant Center use. Product images are SVG illustrations, not real product photos (Merchant listings require real photos).
- **No contact details:** no WhatsApp number or address is invented; the contact page says the number appears on the live site. The email uses an `.example` domain.
- **Custom requests:** they aren't sent anywhere; uploaded photos stay in the browser.
- **SEO limits:** hash routes aren't separate crawlable URLs. A production build would use real paths and a generated sitemap, as the PRD specifies.

## Run and verify

From the repo root, `node out/pages/068-handmade-footwear-store/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- homepage messaging, SEO and JSON-LD
- shop filters, sort and search
- product options, size guide and approval-based edits
- cart behavior and persistence
- checkout validation, delivery fees, gifts, simulated payment and confirmation
- custom order upload and WhatsApp link
- info pages
- mobile layout, overflow and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
