# Lumina — gift card purchase page

- **Original prompt**: `data/prompts/056-gift-card-purchase/056-gift-card-purchase.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (builder state, validation, balance checker)
  - `assets/art.js`: eight original SVG card designs and the fanned-card hero
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/gift-card-purchase/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav and hero:** sticky nav with "Gift Cards" active and a cart badge. 40vh lavender-to-pink hero with fanned cards and trust badges.
- **Design:**
  - eight 120×80 design thumbnails (radio group, arrow keys; 2-row grid on mobile)
  - a 400×250 live preview that flips to show the back (message, sender, masked code)
  - drag-and-drop or browse upload of your own image, read locally with `FileReader`
- **Amount:** seven presets with a purple selected state, and a custom amount validated to $10–$1,000 with specific messages. Links to corporate gifting.
- **Personalization:** recipient, sender and a 200-character message with counter. The card front and back, summary and email preview update as you type.
- **Delivery:**
  - Digital: recipient email, Send Now or a scheduled date (date picker limited to the next year), an optional calendar reminder (downloads an `.ics` on add) and an email template preview
  - Physical: shipping address, premium packaging (+$5) that changes the envelope mockup, and the ETA
- **Order summary:** sticky on desktop; on mobile a collapsible section placed after Personalize. It shows design, amount, message, delivery, packaging and subtotal, with Add to Cart, Buy Now (express demo dialog), payment marks and the non-refundable note. Validation errors focus the first invalid field.
- **Balance checker:** formats the number as you type and handles short, unknown and sample cards; the sample shows balance, status and transactions.
- **FAQ and corporate:** one-open-at-a-time FAQ, and a corporate gifting band with a sales form.
- **Mobile:** sticky bottom bar with the live amount and Add to Cart.

## Mocks and limitations

- **Demo only:** no payment, cart backend or card issuing. Cart count, emails and sales requests are simulated; nothing is sent.
- **Balance data:** balance-checker cards are sample data (`4000 1234 5678 9010` has a balance; `4000 0000 0000 0002` is redeemed).
- **Payment marks:** styled text badges, not official logos.
- **Uploads:** uploaded images are used only in the page preview and are never transmitted.

## Run and verify

From the repo root, `node out/pages/056-gift-card-purchase/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav and hero
- designs, flip and upload
- amounts and validation
- live personalization
- digital and physical delivery, `.ics` reminder, cart, Buy Now and sticky summary
- balance checker, FAQ and corporate form
- mobile grid, collapsible summary, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
