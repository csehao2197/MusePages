# MedSpa Clinic — Next.js 14 Rebuild Design Spec
**Date:** 2026-06-16
**Source repo:** https://github.com/alagasiloraine/AppDev_FinalProject_MejicoMedSpaClinic.git
**Original stack:** Vue 3 + Vite + Firebase + Express/Node.js
**Target stack:** Next.js 14 App Router + TypeScript + Supabase + Vercel

---

## 1. Project Overview

Rebuilding the Mejico MedSpa Clinic full-stack web app from Vue 3 to Next.js 14 App Router with a clean PostgreSQL schema via Supabase replacing Firebase Firestore. The app has two sides: a client-facing portal (booking, profile, calendar, offers) and an admin dashboard (products, inventory, services, treatments, clients, appointments). All original images are reused. The Express backend is retired and folded into Next.js Route Handlers.

---

## 2. Tech Stack

| Layer | Original | Replacement |
|---|---|---|
| Framework | Vue 3 + Vite | Next.js 14 App Router |
| Language | JavaScript | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 | Tailwind CSS v3 + shadcn/ui |
| Auth | Firebase Auth | Supabase Auth |
| Database | Firebase Firestore (NoSQL) | Supabase PostgreSQL |
| Backend | Express + Node.js | Next.js Route Handlers (app/api/) |
| State — server | None (raw axios calls) | React Query (@tanstack/react-query) |
| State — UI | Vue reactive refs | React Context (AuthContext only) |
| Charts | Chart.js | Recharts |
| Calendar | vue-cal | react-big-calendar |
| Icons | lucide-vue-next | lucide-react |
| Toasts | vue-toastification | sonner |
| Animations | GSAP | GSAP (keep, framework-agnostic) |
| Carousel | Swiper | Swiper (keep, framework-agnostic) |
| PDF export | jsPDF + jspdf-autotable | jsPDF + jspdf-autotable (keep) |
| Excel export | SheetJS (xlsx) | SheetJS (keep) |
| Email | EmailJS | EmailJS (keep) |
| Deployment | — | Vercel |
| Images | src/images/ | public/images/ via next/image |

---

## 3. Architecture

### 3.1 Folder Structure

```
mejico-medspa/
├── app/
│   ├── layout.tsx                        # Root layout — global providers
│   ├── (public)/                         # No auth required
│   │   ├── page.tsx                      # Landing (/)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (client)/                         # requiresAuth: true
│   │   ├── layout.tsx                    # Navbar + Footer
│   │   ├── home/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── appointment/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── offers/page.tsx
│   │   ├── profile/page.tsx
│   │   └── security/page.tsx
│   ├── (admin)/                          # requiresAuth + role = 'admin'
│   │   ├── layout.tsx                    # Admin sidebar layout
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── products/page.tsx
│   │       ├── inventory/page.tsx
│   │       ├── services/page.tsx
│   │       ├── treatments/page.tsx
│   │       ├── treatment-lists/page.tsx
│   │       ├── clients/page.tsx
│   │       ├── profiles/page.tsx
│   │       ├── appointments/page.tsx
│   │       ├── appointment-lists/page.tsx
│   │       ├── calendar/page.tsx
│   │       └── product-manage/page.tsx
│   ├── api/                              # Route Handlers (replaces Express)
│   │   ├── appointments/route.ts         # GET + POST
│   │   ├── admin/[...slug]/route.ts
│   │   └── auth/[...slug]/route.ts
│   └── not-found.tsx
├── components/
│   ├── ui/                               # shadcn/ui primitives
│   ├── public/                           # Landing, Carousel, LandingAbout
│   ├── client/                           # Client-side components
│   ├── admin/                            # Admin dashboard components
│   └── shared/                           # Navbar, Footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase client
│   │   ├── server.ts                     # Server Supabase client (Route Handlers)
│   │   └── middleware.ts                 # Supabase client for middleware
│   ├── types/
│   │   ├── database.types.ts             # Auto-generated from Supabase CLI
│   │   └── index.ts                      # App-level types
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   ├── useProducts.ts
│   ├── useServices.ts
│   ├── useTreatments.ts
│   └── useProfile.ts
├── context/
│   └── AuthContext.tsx
├── public/
│   └── images/                           # All 14 images (moved from src/images/)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Full schema + RLS policies
├── middleware.ts                          # Supabase session verify + role check
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 3.2 Security Architecture (Two-Layer Guard)

**Layer 1 — middleware.ts (Edge)**
- Supabase session cookie verification on every request
- Unauthenticated users redirected to /login
- Users without role='admin' hitting /admin/* redirected to /home
- Uses @supabase/ssr for cookie-based session management

**Layer 2 — Layout Server Component**
- Admin layout server component queries profiles table for role
- Returns 403 if role is not 'admin'
- Double protection even if middleware is bypassed

**Layer 3 — Row Level Security (RLS)**
- Every Supabase table has RLS enabled
- Clients can only read/write their own data
- Admins have full access via role check in RLS policies
- Data is protected at the database level, not just the API level

### 3.3 State Management

- **AuthContext** — wraps root layout, exposes user, profile, loading, signOut
- **React Query** — one hook per table (useAppointments, useProducts, etc.)
  - Handles caching, loading states, background refetching automatically
  - Paired with Supabase JS client for clean async queries

### 3.4 API Route Handlers

| Express route | Next.js Route Handler |
|---|---|
| GET/POST /api/appointments | app/api/appointments/route.ts |
| /api/admin/* | app/api/admin/[...slug]/route.ts |
| /api/auth/* | app/api/auth/[...slug]/route.ts |

Each handler uses the server Supabase client and verifies the session before processing.

---

## 4. Database Schema (PostgreSQL via Supabase)

### Tables

**profiles** — extends Supabase Auth users
- id, user_id (FK→auth.users), first_name, last_name, username, phone, gender, date_of_birth, role ('client'|'admin'), avatar_url, created_at, updated_at
- role column replaces Firebase custom claims for admin detection

**addresses** — user address (1:1 with profiles)
- id, profile_id (FK→profiles), house_street, barangay, city, province, postal_code, country (default 'Philippines')

**medical_records** — user medical info (1:1 with profiles)
- id, profile_id (FK→profiles), has_allergies, allergy_details, has_chronic_conditions, chronic_condition_details, has_skin_conditions, skin_conditions (text[]), skin_type, updated_at

**services**
- id, name (unique), duration_minutes, is_archived, archived_at, created_at, updated_at

**treatments**
- id, service_id (FK→services), name, description, price (numeric 10,2), is_archived, archived_at, created_at, updated_at
- Relationship: one service → many treatments

**products** — merges Firestore products + archivedProducts
- id, name, description, category, price (numeric 10,2), quantity, low_stock_threshold (default 10), is_archived, archived_at, updated_by (FK→auth.users), created_at, updated_at

**appointments**
- id, client_id (FK→profiles), appointment_date (date), appointment_time (time), total_price (numeric 10,2), status ('pending'|'confirmed'|'completed'|'cancelled'), notes, created_at, updated_at

**appointment_services** — junction table (replaces Firestore services[] array)
- id, appointment_id (FK→appointments), service_id (FK→services), quantity, unit_price (numeric 10,2)

**cancellation_requests**
- id, appointment_id (FK→appointments), requested_by (FK→auth.users), reason, status ('pending'|'approved'|'rejected'), reviewed_at, reviewed_by (FK→auth.users), requested_at

### RLS Policies Summary
- profiles: users can read/update their own row; admins can read all
- appointments: clients see only their own; admins see all
- cancellation_requests: clients see only their own; admins see all
- products/services/treatments: all authenticated users can read; only admins can write
- medical_records/addresses: users see only their own row

---

## 5. Component Migration Map

| Vue component | Next.js component |
|---|---|
| Landing.vue | app/(public)/page.tsx |
| LandingAbout.vue | components/public/LandingAbout.tsx |
| Carousel.vue | components/public/Carousel.tsx |
| Navbar.vue | components/shared/Navbar.tsx |
| Footer.vue | components/shared/Footer.tsx |
| Login.vue | app/(public)/login/page.tsx |
| Register.vue | app/(public)/register/page.tsx |
| EmailVerification.vue | app/(public)/verify-email/page.tsx |
| Homepage.vue | app/(client)/home/page.tsx |
| About.vue | app/(client)/about/page.tsx |
| ContactUs.vue | app/(client)/contact/page.tsx |
| ClientAppointment.vue | app/(client)/appointment/page.tsx |
| ClientCalendar.vue | app/(client)/calendar/page.tsx |
| ClientOffers.vue | app/(client)/offers/page.tsx |
| CustomizeProfile.vue | app/(client)/profile/page.tsx |
| PersonalSecurity.vue | app/(client)/security/page.tsx |
| AdminDashboard.vue | app/(admin)/admin/dashboard/page.tsx |
| AdminProducts.vue | app/(admin)/admin/products/page.tsx |
| AdminInventory.vue | app/(admin)/admin/inventory/page.tsx |
| AdminServices.vue | app/(admin)/admin/services/page.tsx |
| AdminTreatments.vue | app/(admin)/admin/treatments/page.tsx |
| AdminTreatmentLists.vue | app/(admin)/admin/treatment-lists/page.tsx |
| Clients.vue | app/(admin)/admin/clients/page.tsx |
| AdminProfiles.vue | app/(admin)/admin/profiles/page.tsx |
| AdminAppointments.vue | app/(admin)/admin/appointments/page.tsx |
| AdminAppointmentLists.vue | app/(admin)/admin/appointment-lists/page.tsx |
| AdminCalendar.vue | app/(admin)/admin/calendar/page.tsx |
| AdminProductManage.vue | app/(admin)/admin/product-manage/page.tsx |
| AppLayout.vue | Handled by route group layouts |
| ErrorPage.vue | app/not-found.tsx |
| CancellationRequest.vue | components/client/CancellationRequest.tsx |

---

## 6. Images Migration

All 14 images: frontend/src/images/ → public/images/ (same filenames)
Used via next/image for auto optimization, lazy loading, WebP on Vercel.

---

## 7. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never exposed to browser

NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

---

## 8. Key Dependencies

```json
{
  "dependencies": {
    "next": "14",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "@tanstack/react-query": "^5",
    "lucide-react": "latest",
    "recharts": "^2",
    "react-big-calendar": "^1",
    "sonner": "^1",
    "gsap": "^3",
    "swiper": "^8",
    "jspdf": "^2",
    "jspdf-autotable": "^3",
    "xlsx": "^0.18",
    "@emailjs/browser": "^4",
    "tailwindcss": "^3"
  }
}
```

---

## 9. Implementation Order

1.  Scaffold Next.js 14 project — TypeScript strict, Tailwind, shadcn/ui
2.  Copy all 14 images → public/images/
3.  Set up Supabase project + run migration SQL (001_initial_schema.sql)
4.  Configure Supabase clients in lib/supabase/ (browser, server, middleware)
5.  Set up AuthContext + React Query provider in root layout.tsx
6.  Implement middleware.ts — Supabase session + role guard
7.  Build public routes (landing, login, register, verify-email)
8.  Build (client) route group + all client pages
9.  Build (admin) route group + all admin pages
10. Migrate Express routes → Next.js Route Handlers in app/api/
11. Write RLS policies in supabase/migrations/
12. Final pass — next/image for all images, TypeScript strict checks, Vercel deploy
