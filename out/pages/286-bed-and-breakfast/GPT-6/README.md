# The Wrenhouse

Read original `data\prompts\286-bed-and-breakfast\286-bed-and-breakfast.md` fully with `src\workflows\AI Agent\DESIGN.md`. Actual **gpt-6.1-sol**, label **GPT-6**. Static HTML/CSS/JS; system serif/sans adaptation and original house, five bedroom, breakfast and house-vignette illustrations replace photos.

Five-room desktop chooser with keyboard navigation; mobile shows all five illustrated cards. Seasonal rates, breakfast provenance, house/neighbourhood details, practical accordions and stay estimate enforce date order, 28-night limit, two-night weekends, Linnet-only dogs and Kestrel-only third guest. Per-night seasonal totals include dog/sofa supplements. The Martin uses table rates (£125/£145), resolving the brief's inconsistent £135 introduction.

Fictional property/hosts/reviews. No live availability or reservation, backend, payment or message transmission. Hay Festival supplement and third-guest breakfast require confirmation. No environment variables/build.

Source here; independent `out\` export; public `pages\bed-and-breakfast\GPT-6\index.html`. Serve through static HTTP. QA: `node out\pages\286-bed-and-breakfast\GPT-6\verify.mjs`. Source rights retained.

Actual QA: 39 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Actually opened desktop/mobile full-page screenshots. Plaster and heritage-green palette, illustrated country exterior, brass rules and unhurried room list suit the house. Mobile exposes all five room images/details with clear rate labels; breakfast, practical information and green stay planner stack cleanly with no clipping. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
