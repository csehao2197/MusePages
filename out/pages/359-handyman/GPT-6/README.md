# Odd Jobs Co.

Inputs: `data\prompts\359-handyman\359-handyman.md` and `src\workflows\AI Agent\DESIGN.md`. **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS with system practical sans, original kitchen artwork and line-tool icon.

Features: twelve toggleable jobs, exact labour/minute totals and multi-visit warnings, dynamic future sample half-days, transparent rates/materials/scope, exact postcode-district checks, validated visit preview and optional in-memory image preview with type/size limits.

Run `node out\pages\359-handyman\GPT-6\verify.mjs` at root. Standalone export `out`; public entry `pages/handyman/GPT-6/index.html`. Source, QA and metadata stay private. No build or environment variables.

Rates, availability, testimonials and terms are illustrative. No DBS/insurance or regulated-work credentials are represented as verified. Specialist gas/electrical/structural/asbestos work is excluded. Four-hour work capacity is distinct from the 4.5-hour arrival window; larger selections require multiple visits. Travel checker checks districts only, not routes. Photo object URLs stay local and are revoked; nothing is uploaded. Form makes no request, booking, text, payment or backend operation. Builds, installs and publication were not performed.

Actual QA: 54 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Opened fresh final desktop and mobile full-page PNGs after repairing the desktop running-total placement and rerunning all browser assertions plus preview. Desktop job heading is now fully visible with the summary in its own row above the picker. Warm kitchen art, orange job selections and transparent rates balance clearly. Mobile two-column picker and pinned total fit, form/photo controls are contained and footer has clearance; no blank section or page overflow. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
