# Studio Noma

Input `data\prompts\366-interior-design-studio\366-interior-design-studio.md` with `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`. HTML/CSS/JS here; export `out\`; eventual `pages/interior-design-studio/GPT-6/index.html`.

Distinct from Lumine: light linen/terracotta, oversized editorial title, panoramic illustration, twelve-study masonry, category/search filters, specific project dialogs, service/enquiry handoff, five-step horizontal process and interactive material swatches. Two original room SVGs are reused as detail crops, explicitly conceptual. System fonts replace external families. Founder biography, client and press claims are illustrative rather than asserted; no backend, persistent storage, transmission or reservations.

Serve `out\` by static HTTP. QA: `node out\pages\366-interior-design-studio\GPT-6\verify.mjs` from root. No environment variables or build needed.

Actual QA: 41 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Viewed desktop and mobile full-page PNGs: linen/terracotta palette, oversized type and sunlit panorama clearly distinguish Noma from Lumine. Masonry captions, material board, process viewport and centered form remain aligned; mobile is unclipped with visible controls. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
