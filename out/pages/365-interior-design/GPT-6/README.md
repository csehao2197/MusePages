# Lumine Studio

Input `data\prompts\365-interior-design\365-interior-design.md` and `src\workflows\AI Agent\DESIGN.md`; actual model `gpt-6.1-sol`, label `GPT-6`. HTML/CSS/JS here, independently served export `out\`, expected `pages/interior-design/GPT-6/index.html`.

Dark editorial design, two original room SVGs, six clearly labelled concept studies, combined category/search filtering, gallery wraparound/material details, enquiry handoff, journal accordions and validated project brief. Reused illustration treatments are conceptual rather than photographs of real commissions. System fonts replace remote families; parallax, cursor follower, press, awards and real-client reviews are outside this slice. No backend, storage, email transmission or booking.

Serve `out\` by static HTTP; run `node out\pages\365-interior-design\GPT-6\verify.mjs` at repository root. No environment variables or build needed.

Actual QA: 33 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Viewed both full-page images: dark sand/cream typography, architectural artwork and restrained grid deliver the moody brief. Desktop split hero and mobile image-first stack are balanced; project labels, journal accordions and contact fields remain unclipped and readable. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
