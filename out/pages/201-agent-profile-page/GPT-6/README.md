# Sarah Mitchell / agent profile

- Original: `data\prompts\201-agent-profile-page\201-agent-profile-page.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model `gpt-6.1-sol`; public label `GPT-6`. Standalone source `index.html`, original portrait and house SVG illustrations.
- Features: contact dialogs, status-filtered sample listings/details, keyboard-accessible area map/guides, sold carousel, six sample reviews, credential/office disclosures, responsive menu and local enquiry form.
- Serve with an existing static server. Validate: `node out\pages\201-agent-profile-page\GPT-6\.checks\verify.mjs`. Actual desktop/mobile screenshots and results in `.checks`; checks include filters, details, map, carousel, reviews, contact honesty, overflow and browser/resource errors.
- Static export: `out\`; expected path `pages/agent-profile-page/GPT-6/index.html`, real 1200×900 preview. Registered disabled after validation; no build/publication.
- Mock: prompt-supplied persona/statistics are illustrative. Brokerage, addresses, prices, sales and reviews are fictional. Original illustrations are labeled rather than impersonating photographs. Real biography, license, professional photos, awards, memberships, office and contact/social profiles await verification. No backend/env; forms/contact send nothing and store nothing.
- Review checklist: keyboard focus, map selection, property status/detail, sold navigation, mobile form and truthful demo feedback.
