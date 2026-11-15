# Halloran Haulage

Original: `data\prompts\468-trucking-company\468-trucking-company.md`; full `src\workflows\AI Agent\DESIGN.md` applied. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML adaptation with system grotesk and mono fonts, original depot/truck/yard illustrations, restrained orange, fleet table, service disclosures and compliance details. All text is at least 14 px.

Source: `index.html`, `site.css`, `site.js`, `art.svg`. Independent export: `out\`; eventual path: `pages/trucking-company/GPT-6/index.html`. SVG route draws once on entry with mileage reaching 212; reduced motion shows the complete route and final count. Mobile hides the overnight marker and provides a safe-area-aware call bar.

Call-note preparation validates postcodes, nonempty cargo and a bounded weight, then creates a genuine local text download. It is not a quote calculator, tracking portal, booking request or legal load acceptance. Contact CTAs use the supplied sample telephone number.

Recheck and temporary local serving: `node out\pages\468-trucking-company\GPT-6\verify.mjs`. Actual QA and visually reviewed desktop/mobile captures: `.checks\`. The fleet has four rows as specified in full copy (18 vehicles), despite the earlier five-row summary.

Company, vehicles, licence, FORS, insurance, network membership, timings and testimonial are fictional/unverified. No backend, transmission, booking, payment, environment variables, installs, builds or publication. Disabled/undeployed.
