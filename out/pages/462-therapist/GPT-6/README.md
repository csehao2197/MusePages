# Clarity Therapy

Original: `data\prompts\462-therapist\462-therapist.md` plus full `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. Standalone HTML frontend adaptation with system fonts and original nature illustration instead of photography, no fabricated clinician portrait.

Source: `index.html`, `site.css`, `site.js`, `art.svg`. Independent export: `out\`; eventual path: `pages/therapist/GPT-6/index.html`. Support selection, fee calculator with range/empty handling, consent/email validation, local enquiry preview and privacy dialog. The conflicting free 50-minute/session copy is resolved to the fees/process section's free **20-minute call** and paid 50-minute sessions.

Recheck and temporary loopback serving: `node out\pages\462-therapist\GPT-6\verify.mjs`. `.checks\` contains executed QA and desktop/mobile captures, both visually reviewed.

Fictional clinician, credentials, testimonials, address and fees are clearly labelled; no clinical credentials, outcomes, confidentiality or treatment are asserted. Form data stays in page memory; no medical details, backend, booking, transmission, payment or environment variables. No installs, builds or publication. Disabled/undeployed registration.
