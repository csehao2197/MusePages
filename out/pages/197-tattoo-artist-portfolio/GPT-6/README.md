# Tattoo artist portfolio

- Inputs: original `data\prompts\197-tattoo-artist-portfolio\197-tattoo-artist-portfolio.md` and `src\workflows\AI Agent\DESIGN.md`.
- Model: actual `gpt-6.1-sol`, display `GPT-6`. Standalone HTML source: `index.html`; original inline SVG linework.
- Features: style/healed filters, keyboard-dismissable project dialog, studio disclosures, mobile menu, locally validated booking brief and reference-file count.
- Run with any existing static HTTP server. From repo root: `node out\pages\197-tattoo-artist-portfolio\GPT-6\.checks\verify.mjs`. Checks cover gallery honesty, categories, modal keyboard behavior, form, file input, responsive overflow and console/resources. Desktop/mobile screenshots and results: `.checks`.
- Independent static export: `out\index.html` plus actual preview. Expected public path: `pages/tattoo-artist-portfolio/GPT-6/index.html`. Registered disabled after validation; no build or publication.
- Mocks: sample identity; drawings are concepts, not tattoos or healed evidence. Real biography, approved photos/dates, contact, studio access, age policy, aftercare link and response window await owner input. No medical advice, invented credentials, backend or environment variables. Demo enquiry/files never leave the browser.
- Manual checklist: keyboard focus, dialog Escape, mobile navigation, visible booking guidance, honest demo outcome.
