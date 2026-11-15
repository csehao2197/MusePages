# Ivory & Thread

Read `data\prompts\293-bridal-shop\293-bridal-shop.md` and DESIGN. Actual **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS with Georgia, Arial and system mono; original hanger, dress detail and continuous-line SVG artwork replaces photography. Five named designers from the eleven-house fictional boutique are featured.

Designer shortlist and fitting/size email draft with name, email and message checks. Opens the user's mail application only. Appointment dates, stock, fittings and alterations need direct confirmation. No booking engine, size calculator, backend or actual submission. Fictional quote and address from brief. Accent slightly deepened for text contrast; every text style at least 14px.

Source here; static `out\`; eventual `pages\bridal-shop\GPT-6\index.html`. Serve through static HTTP. QA `node out\pages\293-bridal-shop\GPT-6\verify.mjs`. No environment variables/build/install/publication. `.checks` contains evidence. Original art/code; source rights retained.

Actual QA: 34 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Opened desktop/mobile PNGs after fixing an asynchronous observer test wait and rerunning all 34 assertions. Warm paper, quiet serif hierarchy, framed gown artwork and continuous dress line with tape are balanced. Dark appointment rows and clay email panel contrast clearly; mobile content, prices, shortlist and form are legible with no page overflow. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
