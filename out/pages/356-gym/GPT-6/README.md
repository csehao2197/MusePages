# APEX Gym

Inputs: `data\prompts\356-gym\356-gym.md` and `src\workflows\AI Agent\DESIGN.md`. **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS with system grotesk and original strength-floor/coach vector artwork. Source and QA remain separate from `out`.

Features: six disciplines, day/class timetable with empty/reset/full states, session details, three membership tiers with annual/monthly comparison, selected-plan trial preview, coach/facility sections and mobile navigation.

Run `node out\pages\356-gym\GPT-6\verify.mjs` at root. Standalone export: `out`; public entry `pages/gym/GPT-6/index.html`. No build or environment variables.

Stats, capacities, coaches, hours, prices and testimonials are fictional brief/sample data. The fourteen-session sample is not the claimed full 40+ weekly timetable. Trials validate name, email, future start and demo/age acknowledgement in memory; no data is sent/stored and no account, class reservation, membership or payment is created. Annual display is twelve monthly payments, without a fabricated discount. Original portraits are illustrations, not real coach photographs. No physical result or qualification is guaranteed. Builds, installs and publication were not performed.

Actual QA: 46 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Opened final desktop and mobile full-page PNGs. Oversized APEX headline, lime recovery line and original strength-floor scene create strong energy without unreadable overlays. Timetable columns, featured plan and coaches align on desktop; mobile cards, schedules and billing controls stack with clear hierarchy. Trial flow fits and final captures show no blank art, clipping or horizontal overflow. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
