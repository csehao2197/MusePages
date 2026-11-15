# The Bindery

Original: `data\prompts\317-coworking-space\317-coworking-space.md`; applied `DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS static adaptation using system sans/mono, original architectural SVG and room schematics. Source here, independent export `out`, public mapping `pages/coworking-space/GPT-6/index.html`.

Features: forty two desk plan filling once to thirty one over two seconds with clock, immediate final reduced-motion state, membership routing, room estimates with remaining free member hours, weekday visit validation and mobile navigation. Fourteen-pixel minimum text follows contrast requirement over conflicting small meta sizes. Occupancy, member quote, availability and offers are illustrative; planner sends nothing and holds no desk. No backend, environment variables, live API or booking engine.

Root verification: `node out\pages\317-coworking-space\GPT-6\verify.mjs`. Actual normal/reduced-motion behaviour and room/visit cases are exercised. Export contains homepage/assets/preview. No build/install/publication.

Actual QA: 45 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Viewed both full-page desktop/mobile PNGs. Calm architectural mat, original workshop illustration and slate-blue floor plan are well balanced. Forty two desks and eleven free in example remain legible on mobile with clock below. Ruled memberships/rooms, inset dark agreements and blue visit panel are readable with fourteen-pixel minimum text. No shadows, visual clutter, clipping or blank sections. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
