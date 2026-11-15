# Bloom Studio

Original: `data\prompts\346-florist\346-florist.md`, with `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/system serif/sans with original SVG botanical art. Dark luxury bespoke studio, distinct from a retail flower shop.

Source is this directory; static export `out\`, public entry `pages/florist/GPT-6/index.html`. Includes forest/rose split hero, three service rows, four editorial collection tiles, process, studio, wedding feature, care disclosures, arrangement quantities/removal/totals and date-validated event/wedding enquiry.

Collection art uses explicitly illustrative tonal variations. All business, sourcing and delivery claims are concept copy. The local delivery checker approximates London outward codes and uses the Europe/London 11am cutoff; real coverage and stock need confirmation. Delivery is free strictly over £80, otherwise £8 in the illustration. Cart and enquiries are transient; no backend, payment, real order, booking, personal data storage or environment variables.

Serve `out\` through static HTTP. Repository root: `node out\pages\346-florist\GPT-6\verify.mjs`. Actual browser and image QA below. No build, installation or publication.

QA revision: initial mobile overflow assertion caught the long italic hero word. Reduced its mobile size, retained generated source identity and reran both viewports successfully.

Verified: 46 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 screenshots opened: Opened final desktop and mobile full-page PNGs after mobile headline correction. Distinct forest/rose luxury studio, rich original botanical art, elegant editorial collection and wedding sections; final mobile headline and cart fit cleanly without overflow. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
