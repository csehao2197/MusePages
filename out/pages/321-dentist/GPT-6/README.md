# Dentora

Original: `data\prompts\321-dentist\321-dentist.md`; guided by `src\workflows\AI Agent\DESIGN.md`. Actual generator **gpt-6.1-sol**, display **GPT-6**. Standalone HTML in this directory; `out\` contains only the homepage, browser CSS/JS, original studio SVG and preview.

Features: responsive navy/teal clinic, care filters, four-stage journey, on-view counters, seven FAQs and validated enquiry preview. Original illustration and system fonts replace remote photography/fonts. Neutral information replaces unsupported outcomes, credentials and reviews.

Run a local static server against `out\`; verify from repository root with `node out\pages\321-dentist\GPT-6\verify.mjs`. Expected public path: `pages/dentist/GPT-6/index.html`. Existing helper checks source/export, actual public subpath and preview fingerprint.

Fictional clinic, indicative fees and local-only enquiry; no backend, booking, email, medical advice or persistent contact storage. Use fictional details. No environment variables. Build and publication are outside this run.

Actual QA: 40 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Opened desktop and mobile full-page PNGs. Navy/teal hierarchy, original clinic illustration, generous section spacing and service grid are balanced. Mobile navigation, stacked cards, journey labels and form fit cleanly without clipping. Neutral patient information and local-only enquiry are legible. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
