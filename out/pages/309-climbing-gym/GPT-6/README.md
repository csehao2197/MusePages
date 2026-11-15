# Crimp

Static HTML adaptation from `data\prompts\309-climbing-gym\309-climbing-gym.md` with `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; label `GPT-6`. Source here; independent `out`; public path `pages/climbing-gym/GPT-6/index.html`.

Heavy grotesk wordmark, original faceted wall illustration, fourteen-position route with seven once-lit holds, readable grade explorer, coaching enquiry subjects and group entry/shoe calculator with under-14 accompaniment check. System fonts, minimum 14px text.

Serve `out` over HTTP. Root QA: `node out\pages\309-climbing-gym\GPT-6\verify.mjs`. No booking engine or feed, following the original. Visit plans stay in memory; no payment, waiver or reservation. Sample fees, hours, routes and programmes; real eligibility/supervision needs direct confirmation. Climbing has injury risk; diagrams are not safety instruction. Grade 5 orange label resolves the brief's inconsistent grade-4 caption. Original art replaces photography. No environment variables, build, install or publication.

Initial QA exposed a CSS visibility rule overriding the hidden shoe-hire label. Fixed the hidden-state rule and reran both viewports. Initial failure evidence remains in `.checks\qa-initial-failure.json` and the append-only run log.

Actual QA: 51 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Viewed both final full-page PNGs after fixing hidden-state CSS and rerunning browser checks. Huge black wordmark, faceted wall and seven orange route holds establish a distinct gym identity. Ruled prices, grade controls and orange cost planner align. Mobile tables stack, shoe hire is correctly absent for first visits and no content clips. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
