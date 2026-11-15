# Ashgill Canvas

Inputs: `data\prompts\353-glamping\353-glamping.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS with system serif/sans and original inline tent, woodland, hut and night-sky artwork. Vector scene studies replace remote photographs.

Features: alternating accommodation stories, packing inventory, seasonal art, dark-sky guide, price table, mobile menu and local stay planner. Plain text arrival entry avoids a calendar widget. Planner validates real future dates, capacity, dog/child rules, canvas season across the whole stay and optional bank-holiday minimum; calculates actual weekday/weekend rates and extras.

Root verification: `node out\pages\353-glamping\GPT-6\verify.mjs`. Export `out` alone; public entry `pages/glamping/GPT-6/index.html`. Verification serves this eventual subpath. No build or environment variables.

Fictional rates, business details and testimonial-free site copy are illustrative. Availability, weather, astronomy and accessibility are not guaranteed. The form only calculates in memory and opens an email draft; no data is sent/stored, stay reserved or payment taken. Footer dialogs explain local concept limits. No embedded map, booking engine or backend. Builds and publication were not performed.

Actual QA: 50 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Viewed actual desktop and mobile full-page PNGs. Original dusk woodland, warm canvas tents and quiet serif hierarchy are coherent; alternating tent stories and offset seasonal studies balance the desktop. Mobile stacks art before copy, price table and planner remain legible and contained, dark sky/footer contrast works, no blank scene, error display or horizontal clipping. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
