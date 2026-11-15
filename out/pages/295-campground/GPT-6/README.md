# Hollow Pines

Read original `data\prompts\295-campground\295-campground.md` with DESIGN. Actual **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS and system rounded sans; original woodland landscape and schematic site map.

Five pitch types, selectable map zones, monthly sample availability, arrival/departure selection, season/minimum/capacity/dog validation and itemised pitch/dog/fire-pit estimate. Calendar uses deterministic unavailable nights per type, not real stock. Season repeated annually 14 March through final departure 26 October. Fire pit £8 and dogs £4 each per stay are explicit; wood, showers, laundry and other extras excluded. Map, dark-sky claim, contact and what3words are illustrative brief details; confirm navigation and conditions directly.

Browser-only demo, no backend/weather feed/payment/booking. Source here, `out\` export, eventual `pages\campground\GPT-6\index.html`. Static HTTP; QA `node out\pages\295-campground\GPT-6\verify.mjs`. No env/build/install/publication. `.checks` evidence. Original art/code; source rights retained.

Actual QA: 44 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Opened full desktop/mobile PNGs. Original pine landscape, tent/cabin silhouettes and warm canvas typography give an outdoors identity. Pitch chooser, schematic map, honest-information accordion and night section have clear hierarchy. Mobile horizontal pitch row, two-column facilities, monthly dates and stay inputs are contained and readable; fixed booking link is visible. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
