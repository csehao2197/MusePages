# Formwork settings

Original: `data\prompts\223-saas-settings-page\223-saas-settings-page.md`; follows `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`. Standalone HTML source here; export `out`; public path `pages/saas-settings-page/GPT-6/index.html`, with eight stable category hashes.

Powder-blue workspace settings: editable profile, actual local canvas avatar cropping with zoom/pan, email preview, workspace/defaults/permissions, eighteen notification switches, searchable integration connections, billing/upgrade/invoice/cancellation previews, password validation, sample 2FA confirmation, session removal, API demo identifiers/revocation, JSON export and confirmed local reset. Fixed Save/Discard preserves unsaved drafts across categories; saving uses localStorage.

Run `node out\pages\223-saas-settings-page\GPT-6\verify.mjs` at root using existing Playwright Chromium. QA screenshots/results in `.checks`; current real capture `out\preview.png`. Serve `out` using static HTTP.

All account, billing, provider, session, API and security data is explicitly illustrative. Passwords are never stored/sent; keys are nonfunctional identifiers; invoices are marked sample text files. Cropped avatar stays locally; workspace logo stores filename only. Language is a preference preview and UI remains English. No real accounts, uploads, payments, sessions or authentication. No environment variables/backend. Builds, installs, dist and publication were not performed.
