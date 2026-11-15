# Sunbeam Nursery

Static HTML adaptation of `data\prompts\304-childcare-nursery\304-childcare-nursery.md` with `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`, display `GPT-6`. Source here; standalone `out`; public path `pages/childcare-nursery/GPT-6/index.html`.

Original child-free playroom illustration, sunny teal/yellow design, age-stage curriculum selector, daily timeline, session fee calculator and weekday-aware visit discussion planner. Uses system fonts and native controls.

Serve `out` over HTTP. Root QA: `node out\pages\304-childcare-nursery\GPT-6\verify.mjs`. Browser-only in-memory planner; nothing transmitted or scheduled. No child names or medical data requested. Fictional nursery, unverified fees, no asserted Ofsted rating, staff credentials, funding entitlement or live places. Official government guidance linked. No environment variables, build, install or publication; original art replaces child/staff photography and unverified testimonials.

Actual QA: 41 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Viewed desktop and mobile full-page PNGs. Sunny playroom artwork, rounded teal typography and clear age markers feel warm and distinct. Timeline rhythm and fee panel are balanced; mobile stacked curriculum, calendar and enquiry fields are readable without clipping. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
