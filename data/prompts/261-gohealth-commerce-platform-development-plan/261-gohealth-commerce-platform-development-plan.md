# Dev Plan

## Current Priority

- [x] Connect and configure MySQL database connection pool for Next.js Server Actions/API Routes.
- [x] Implement Product CRUD operations (Admin side) linked to existing Categories.
- [x] Finalize secure Add to Cart functionality & Cart state management via Redux.

## Next

- [x] Implement Checkout flow (Order creation, inventory deduction logic).
- [x] Implement automated PDF invoice generation (using `jspdf`).
- [x] Implement email notifications for order status changes (using `nodemailer` with Resend SMTP).
- [x] Verify Resend end-to-end delivery through live SMTP and delivery status.

## Later

- [x] Advanced filtering and search for products on the storefront.
- [x] Implement payment gateway integration (Midtrans Snap).
- [x] Add pagination and sorting for product catalog and admin tables.

## Blocked

- None.

## Decisions Needed

- [x] Which payment provider to integrate for checkout? (Answered: Midtrans Snap)
- [x] What is the exact email sending provider (SMTP service) to be used with nodemailer? (Answered: Resend)

## Notes for Agents

- Check this file before starting a large task.
- Prefer completing one task fully before starting another.
- Do not silently add new scope.
- If the requested work is not listed here, still follow the user's direct instruction.
- Commitment per task by following @AGENTS.md.
