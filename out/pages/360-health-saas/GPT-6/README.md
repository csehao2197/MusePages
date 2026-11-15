# Meridian

Inputs: `data\prompts\360-health-saas\360-health-saas.md` and `src\workflows\AI Agent\DESIGN.md`. **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS with system sans/mono and original coded charts. White/deep-red marketing frontend with a real interactive dashboard, not a dashboard screenshot.

Features: seven workspace views, 7/14-day sample HRV/sleep/activity charts with keyboard readings, searchable synthetic biomarkers, scripted uncertainty notes, CSV/JSON downloads, memory-only settings/reset, eight simulated integration sources with filters/empty states, guided demo, annual/monthly-equivalent plan comparison, validated local plan previews and six honest FAQs.

Run `node out\pages\360-health-saas\GPT-6\verify.mjs` at root. Standalone export `out`; final entry `pages/health-saas/GPT-6/index.html`. Source, metadata and evidence stay outside export. No build or environment variables.

Safety adaptation: original brief medical-outcome testimonials, clinical-study/accuracy figures, member counts, professional endorsements, HIPAA/SOC 2 claims and supplement/retesting recommendations are replaced by explicit synthetic-data and uncertainty labels. No compliance certification, medical credential, diagnostic performance, provider affiliation or health outcome is claimed. Pricing/plan capabilities describe a fictional future product, not delivered services.

No AI, lab parsing, API, authentication, wearable permission, health file upload, account, trial, clinical PDF, analyst, payment or backend runs. Downloads contain synthetic data only. Form data, settings and connections remain in memory and reset on reload; no cookies/local storage/analytics. Builds, installs and publication were not performed.

Actual QA: 74 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Opened final desktop and mobile full-page PNGs. White/red clinical-premium hierarchy and coded dashboard read clearly; sample data warnings are visible and no credentials or outcome guarantees are implied. Desktop KPIs, chart, source grid and featured plan align. Mobile workspace tabs/KPIs, contained pricing scroll and FAQs fit without horizontal overflow, clipped controls, blank art or browser error content. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
