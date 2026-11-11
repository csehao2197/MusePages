# Product Requirements Document

## Project Summary

- Project name: `GoHealth (GoSans)`
- Document owner: `Development Team`
- Last updated: `2026-07-23`
- Status: `APPROVED`

## Overview

### Problem Statement

Users need a reliable, fast, and secure platform to browse health/wellness products, manage their cart, and place orders. Admins need efficient tools to manage categories and analyze order trends.

### Proposed Solution

A Next.js e-commerce application integrated with MySQL (hosted on Hostinger) for robust database management and Next.js Auth/Supabase Auth for authentication, featuring a user-friendly storefront and a data-driven admin dashboard.

### Why This Matters

- Improves customer conversion with a fast, modern tech stack.
- Secures user data through reliable authentication barriers.
- Enables data-driven decisions via admin analytics.

## Goals

- Deliver a high-performance shopping experience using Next.js 15.
- Secure user-specific routes (cart, checkout, orders).
- Provide admins with clear, actionable data visualizations.

## Non-Goals

- Building a custom external backend infrastructure (using Next.js APIs + MySQL instead).
- Multi-vendor support.
- Native mobile applications for V1.

## Target Users

### Primary Users

- `Customers`: Individuals looking to purchase health/wellness products online.
- `Store Admins`: Personnel managing catalog and tracking sales performance.

### Secondary Users

- `Customer Support`: Staff who might need to view order status to assist customers.
- `Marketing`: Team analyzing order trends to run campaigns.

## User Problems

| User Type | Problem | Current Impact |
| --- | --- | --- |
| `Customers` | Cannot easily track cart and order history securely | High cart abandonment, low trust |
| `Admins` | Lack visibility into recent sales trends and catalog structure | Inefficient store management |
| `Customers` | Frustration with slow, unresponsive UI | Poor user experience and retention |

## Scope

### In Scope For V1

- User authentication (login/register).
- Product catalog browsing and detail views.
- Secure cart and checkout flow.
- Admin dashboard with order analytics chart.
- Admin CRUD functionality for product categories.

### Out Of Scope For V1

- Complex inventory management (stock prediction).
- Advanced AI product recommendations.
- Subscription-based recurring orders.

### Future Considerations

- PDF invoice generation for customers (utilizing installed jspdf).
- Automated email notifications for order status changes (utilizing installed nodemailer via Resend).
- Advanced filtering and search for products.

## User Flows

### Flow 1: `Purchase Flow`

1. `User browses catalog and selects a product.`
2. `User is prompted to log in if not already authenticated.`
3. `User adds the product to their cart.`
4. `User proceeds to checkout and successfully places an order.`

### Flow 2: `Admin Category Management`

1. `Admin logs in and navigates to the dashboard.`
2. `Admin selects Category Management.`
3. `Admin creates, updates, or deletes a product category.`
4. `Catalog is immediately updated to reflect changes.`

## Functional Requirements

### Must Have

- Secure authentication flow (Supabase Auth).
- Protected routes for `/cart` and `/orders`.
- Interactive order analytics chart for the last 7 days.
- CRUD operations for categories.

### Nice To Have

- Password visibility toggle (show/hide).
- Real-time toast notifications for user actions (add to cart, login).
- Exportable PDF reports for admins.

## Non-Functional Requirements

- Performance: `Fast page loads utilizing Next.js Server Components and Turbopack.`
- Security: `Strict row-level security (RLS) in Supabase and protected frontend routes.`
- Reliability: `High uptime relying on Vercel and Supabase infrastructure.`
- Accessibility: `Semantic HTML and accessible UI components.`
- Observability: `Basic error tracking and structured logging.`

## Success Metrics

| Metric | Target | How To Measure |
| --- | --- | --- |
| `Cart Conversion Rate` | `> 5%` | `Completed orders / Cart creations` |
| `Admin Engagement` | `Daily usage` | `Frequency of dashboard logins by admin roles` |
| `Page Load Time` | `< 2s` | `Lighthouse performance score` |

## Constraints And Assumptions

### Constraints

- `Must use MySQL (Hostinger) for database.`
- `Must rely on Next.js App Router paradigm.`
- `Limited timeline for V1 launch.`

### Assumptions

- `Supabase free/pro tier is sufficient for expected traffic.`
- `Users have modern web browsers.`
- `Product data is relatively simple without overly complex variant structures.`

## Dependencies

- `Next.js 15`
- `MySQL Database hosted on Hostinger`
- `Redux Toolkit (State Management)`
- `Recharts (Data Visualization)`

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `Database Outage` | `High` | `Rely on Hostinger uptime SLA; implement graceful degradation UI.` |
| `State Management Complexity` | `Medium` | `Keep Redux slices focused and small; utilize React Server Components where possible.` |
| `Security Misconfiguration` | `High` | `Strictly adhere to RLS policies and test auth guards thoroughly.` |

## Open Questions

- `Will we handle payment processing via Stripe or another provider in V1?`
- `Are there specific roles beyond basic 'admin' and 'user' needed?`
- `What is the exact email sending provider to be used with nodemailer?` (Answered: Resend)

## Acceptance Checklist

- [ ] `Auth flow is robust (login, register, protected routes).`
- [ ] `Cart functionality persists correctly.`
- [ ] `Admin chart renders accurate 7-day data.`
- [ ] `Category CRUD operates without errors.`

## Notes For Agents And Developers

- Keep requirements specific, testable, and scoped.
- Update this document when scope, goals, or constraints change.
- Align implementation plan, dev plan, and tests with this document.
