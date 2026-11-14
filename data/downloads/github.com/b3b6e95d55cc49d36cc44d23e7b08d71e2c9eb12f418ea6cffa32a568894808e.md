# Design & Architecture

## 🏛 Tech Stack
> It may be necessary temporarily to accept a lesser evil, but one must never label a necessary evil as good.
*   **Framework:** Next.js 16 (App Router + Server Actions).
*   **UI:** Ionic React (Mobile behavior/navigation).
*   **Styling:** @emotion/css (Simple toolchain for good old CSS... in JS).
*   **Database:** Prisma + PostgreSQL.

## 📐 Key Decisions
*  **Tech Stack:** Fastest, highest-fidelity stack possible with maximum ROI on developer experience.
*   **No Tailwind:** Explicitly avoided to prevent utility-class bloat and maintain a precise, platform-native design system via standard CSS-in-JS.
*   **Tenant Isolation:** Enforced at the query level; every record is hard-linked to an `Organization`.
*   **Kitchen-First UI:**
    *   BIG typography (64px titles) for station-to-station readability on overhead tabled displays, but still compatible with handheld mobile.
    *   Large touch targets (~48px) for fast-paced kitchen use.
    *   High-contrast color palette (#030213 on White) for brightly-lit kitchens.

## 🧪 Quality Gates
*   **Vitest:** "Business logic" and component unit tests. Basically just dummy tests to show how to do the thing.
*   **Playwright:** E2E flows (Wizard, Search, Kitchen View). These simulate actual user workflows and include setup/teardown lifecycle. 
*   **Bonus:** reuse E2E tests with Artillery framework for load/scalability testing if necessary in future. Workflow/Scenario-based E2E tests help to create scalability tests that approximate real user behaviors.

## Alternatives Considered

- Rust + Godot game engine (for fun!)
- Golang backend + protobufs as single source of data model truth (for fun!)
- AWS RDS and Vanilla SQL (for business!)

Chosen stack was selected for a variety of reasons including rapid turnaround time. In production, might make some different choices altogethe after doing a proper trade study.
