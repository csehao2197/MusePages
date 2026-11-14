# Blu-Reserve MVP - Frontend Tasks

## Project Overview

A cafeteria seat reservation system for post-COVID office spaces. Employees can book seats (not tables) for 30-minute time slots during office hours.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS
**Design Direction:** Modern, sleek cafeteria aesthetic with blue-centric palette

---

## 📋 Task List

### Phase 1: Foundation

- [ ] **1.1 Project Setup**
    - Configure Tailwind with custom blue palette
    - Set up folder structure (components, lib, hooks, types)
    - Install and configure distinctive fonts
    - Create CSS variables for theming

- [ ] **1.2 Mock API Layer**
    - Create `/api/auth/login` mock handler
    - Create `/api/auth/logout` mock handler
    - Create `/api/bookings/my` mock handler
    - Create `/api/bookings/create` mock handler
    - Create `/api/seats/availability` mock handler (seat status for time slot)

- [ ] **1.3 Types & Constants**
    - Define TypeScript interfaces (Seat, Booking, User, ApiResponse)
    - Define constants (time slots, table/seat configuration)

---

### Phase 2: Authentication

- [ ] **2.1 Auth Context**
    - Create AuthContext with login state
    - Handle session persistence (localStorage/cookies)
    - Protected route wrapper component

- [ ] **2.2 Login Page**
    - Employee ID input field
    - Password input field
    - Error message display for invalid credentials
    - Loading state during authentication
    - Redirect to dashboard on success

---

### Phase 3: Core UI

- [ ] **3.1 Dashboard Layout**
    - Header with Blu-Reserve branding
    - User info display
    - Logout button
    - Main content area

- [ ] **3.2 Cafeteria Floor Plan**
    - Visual layout of 6 tables
    - 5 chairs per table (30 total seats)
    - Seat states: available, booked, selected
    - Interactive seat selection
    - Table numbering/labeling

- [ ] **3.3 Time Slot Selector**
    - 9:00 AM to 5:00 PM range
    - 30-minute intervals (16 slots total)
    - Visual time picker UI
    - Current time indicator
    - Selected slot highlight

---

### Phase 4: Booking Flow

- [ ] **4.1 Seat Booking Interaction**
    - Click seat to select
    - Show seat details on selection
    - Confirm booking button
    - API call to create booking
    - Success confirmation modal/toast
    - Error handling with rejection reasons:
        - SEAT_UNAVAILABLE
        - MANAGER_CAPACITY_EXCEEDED
        - INVALID_TIME_RANGE

- [ ] **4.2 My Bookings View**
    - List view of today's bookings
    - Show: seat number, time range, status
    - Visual status indicators (BOOKED, etc.)
    - Empty state if no bookings

---

### Phase 5: Polish

- [ ] **5.1 Animations & Micro-interactions**
    - Page transitions
    - Seat hover effects
    - Button interactions
    - Loading skeletons
    - Success/error animations

- [ ] **5.2 Responsive Design**
    - Ensure usability on tablet/mobile
    - Adaptive cafeteria layout

- [ ] **5.3 Final Touches**
    - Favicon and metadata
    - Error boundaries
    - Edge case handling

---

## 🎨 Design Notes

**Color Palette:**

- Primary: Deep blue (#0A2540) to Electric blue (#0066FF)
- Accent: Cyan/Teal highlights
- Neutral: Slate grays
- Status: Green (available), Red (booked), Amber (selected)

**Typography:**

- Display: Something bold and modern (e.g., Syne, Plus Jakarta Sans)
- Body: Clean sans-serif with good readability

**Aesthetic:**

- Clean lines, generous whitespace
- Subtle shadows and depth
- Smooth transitions
- Glass-morphism elements for modals
- Cafeteria/architectural blueprint vibes for the floor plan

---

## 📡 API Reference

| Endpoint                  | Method | Purpose                       |
| ------------------------- | ------ | ----------------------------- |
| `/api/auth/login`         | POST   | Authenticate employee         |
| `/api/auth/logout`        | POST   | End session                   |
| `/api/bookings/my`        | GET    | Get today's bookings          |
| `/api/bookings/create`    | POST   | Create new booking            |
| `/api/seats/availability` | GET    | Get seat status for time slot |

---

## 🗂️ Seat Configuration

```
Tables: 6 (arranged in 2 rows of 3)
Seats per table: 5
Total seats: 30

Naming: T1-S1 through T6-S5
  - T = Table number (1-6)
  - S = Seat number (1-5)
```

---

## ⏰ Time Slots

```
09:00 - 09:30
09:30 - 10:00
10:00 - 10:30
10:30 - 11:00
11:00 - 11:30
11:30 - 12:00
12:00 - 12:30
12:30 - 13:00
13:00 - 13:30
13:30 - 14:00
14:00 - 14:30
14:30 - 15:00
15:00 - 15:30
15:30 - 16:00
16:00 - 16:30
16:30 - 17:00
```

---

## Progress Tracker

| Phase                   | Status         | Notes |
| ----------------------- | -------------- | ----- |
| Phase 1: Foundation     | 🔴 Not Started |       |
| Phase 2: Authentication | 🔴 Not Started |       |
| Phase 3: Core UI        | 🔴 Not Started |       |
| Phase 4: Booking Flow   | 🔴 Not Started |       |
| Phase 5: Polish         | 🔴 Not Started |       |
