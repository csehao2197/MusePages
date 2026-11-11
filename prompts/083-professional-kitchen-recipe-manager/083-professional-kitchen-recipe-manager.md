# **Part 1: PRD | Product Requirements Document**

### **Why & what**

Professional kitchens require a centralized, digital system to replace manual recipe tracking. We are building a multi-tenant platform for chefs and kitchen staff to ensure consistency in food preparation and efficient menu management across different (potentially competing) restaurant groups.

### **Non-objectives**

* No consumer-facing features or social sharing.  
* No inventory, supply chain, or food costing modules.  
* No native iOS/Android mobile app development (Kiosk web-first).  
* No internationalization (i18n) for this version.

### **Measures of Success**

| Goal | Measurable Outcome |
| :---- | :---- |
| **Data Privacy** | Zero cross-tenant data leaks; users can only access their restaurant's recipes. |
| **Search Speed** | Real-time results returned in \< 500ms for up to 1,000 recipes. |
| **Ease of Use** | Staff can complete a recipe entry or edit in under 3 minutes via the Wizard. |

### **Assumptions & Constraints**

* **Scale:** System must handle 5,000–10,000 requests/day and store up to 1,000 recipes.  
* **Multi-tenancy:** Several dozen users across distinct, competing organizations; proprietary data must be strictly isolated.  
* **Environment:** Kiosk displays/tablets in a professional kitchen (high-pressure, low-glare, touch-first interactions).

### **Requirements (User Stories)**

| Story Title | Story | Acceptance Criteria | Priority |
| :---- | :---- | :---- | :---- |
| **Multi-tenant Isolation** | As a Restaurant Owner, I need my recipes hidden from other restaurants so our proprietary data is safe. | **Positive:** Users only see recipes with their matching Org ID. **Negative:** Accessing a recipe ID from another Org returns a 404\. | Must Have |
| **Recipe Wizard** | As a Chef, I want a step-by-step form to add recipes so I don't miss ingredients or yield info. | **Positive:** Guides through Title \-\> Ingredients \-\> Instructions \-\> Yield. **Negative:** Save is disabled until all mandatory fields are filled. | Must Have |
| **Global Shell Search** | As a Cook, I want a search bar in the UI shell so I can find recipes from any page. | **Positive:** Real-time backend-driven filter; updates as the user types. **Negative:** Clear "No results" state; non-blocking UI. | Must Have |
| **Kitchen View** | As a Cook, I need a high-readability view of a recipe so I can follow it while working. | **Positive:** Large fonts, high contrast, touch-friendly UI, ingredient amounts clearly visible. **Negative:** No UI clutter or unnecessary navigation during view. | Must Have |
| **Recipe Management** | As a Chef, I need to edit or remove recipes so the digital book stays current. | **Positive:** Edits save successfully; deleted items are removed from list. **Negative:** Must confirm before permanent deletion. | Must Have |
| **Optimistic UI / Toasts** | As a user, I want immediate feedback on actions so I know the system is working. | **Positive:** Success toast on CRUD; UI updates before API return. **Negative:** Error toast and state rollback if API fails. | Should Have |

### **Technical Specification: Search & Navigation**

#### **Search Behavior**

* **Type:** Backend-driven search to ensure multi-tenant filtering.  
* **Placement:** Persistent UI Shell Top Bar.  
* **Interaction:** Results show in real-time as a filtered list in the main dashboard or a dropdown overlay.

#### **URL & Route Contract**

* GET /recipes: Dashboard/List view.  
* GET /recipes?q={search\_term}: Filtered search state.  
* GET /recipes/new: Step-by-step Wizard UI.  
* GET /recipes/:id: Read-only Kitchen View.  
* GET /recipes/:id/edit: Editor (re-uses Wizard logic).

### **Out-of-scope**

* Production-grade Authentication (using a skeleton/placeholder instead).  
* Image/Media uploads for recipes.  
* Recipe scaling/scaling calculators.

# **Part 2: RADIO Technical Design Document**

**Purpose of document:** Document engineering work and the ongoing conversation about the Recipe Core 1.0 service. To coordinate engineering work amongst product, development, engineering, and QA. RADIO \= Requirements, Architecture, Data Model, Interfaces, Optimizations and Open Questions.

### **Business Objectives Goal**

Deliver a centralized, multi-tenant digital recipe management system that allows professional kitchens to standardize food preparation. The system must ensure proprietary recipe data is strictly isolated between competing restaurant groups while providing lightning-fast search and a kitchen-optimized reading experience for line cooks.

### **Requirements Exploration Goal**

* **Scale:** Extremely low throughput. 5,000 to 10,000 requests per day.  
* **Storage:** Very small data footprint. Maximum of 1,000 recipes globally.  
* **Multi-tenancy:** Dozens of users across distinct, competing organizations. Data leakage is a critical failure.  
* **Stack Consolidation:** Utilize a full TypeScript stack to maximize development speed, share types across the boundary, and leverage a mature JS/TS ecosystem.  
* **Hardware Context:** The client must interact with local C++ services running on the kitchen hardware via local networking protocols, avoiding embedded webviews.  
* **Out of Scope:** Internationalization, image media uploads, production-grade Auth (skeleton only).

### **Architecture/High-level Design Goal**

To optimize for development velocity, code reusability, and a touch-first interface suitable for kitchen tablets, we will utilize a unified TypeScript stack.

* **Full-Stack Framework:** **Next.js (TypeScript)**. Next.js will handle both the React frontend and the backend REST API via Next.js API Routes. This allows us to share Zod validation schemas and TypeScript interfaces directly between the client and server without duplicating code.  
* **UI Framework:** **Ionic Framework (React)**. Ionic provides pre-built, highly polished, touch-optimized components (lists, modals, hardware-accelerated animations) that feel native on touch devices, saving weeks of CSS work for the "Kitchen View".  
* **Database:** **PostgreSQL** accessed via an ORM like **Prisma** or **Drizzle ORM** for end-to-end type safety from the database to the DOM.  
* **Client Deployment & Hardware Integration:** The proprietary kitchen hardware will run a locked-down, standalone Chromium browser in Kiosk Mode pointing to the deployed Next.js frontend. The frontend will communicate with the local C++ hardware daemon via standard local networking (e.g., establishing a WebSocket connection to ws://127.0.0.1:8080/hardware-events).  
* **Infrastructure:** The Next.js application will be deployed globally via a platform like Vercel or containerized on AWS/GCP to provide low-latency edge delivery to the kitchen kiosks.

### **Data Model Goal**

#### **Application Data Model (TypeScript / Prisma Schema Representation)**

```prisma
model Organization {  
  id    String @id @default(uuid())  
  name  String  
  users User[]  
  recipes Recipe[]  
}

model User {  
  id       String @id @default(uuid())  
  orgId    String  
  org      Organization @relation(fields: [orgId], references: [id])  
  username String  
  role     Role // Enum: CHEF, COOK  
}

model Recipe {  
  id           String @id @default(uuid())  
  orgId        String  
  org          Organization @relation(fields: [orgId], references: [id])  
  title        String  
  yieldAmount  Float  
  yieldUnit    String  
  ingredients  Ingredient[]  
  instructions Instruction[]  
  createdAt    DateTime @default(now())  
  updatedAt    DateTime @updatedAt

  @@index([orgId, title])  
}

model Ingredient {  
  id         String @id @default(uuid())  
  recipeId   String  
  recipe     Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)  
  name       String  
  amount     Float  
  unit       String  
  sortOrder  Int  
}

model Instruction {  
  id          String @id @default(uuid())  
  recipeId    String  
  recipe      Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)  
  stepNumber  Int  
  description String  
}
```

#### **Telemetry Schema**

```json
{  
  "eventType": "String",  
  "orgId": "UUID",  
  "latencyMs": "Int",  
  "userAgent": "String"  
}
```

### **Interface Definition (API) Goal**

Endpoints will be implemented as Next.js Route Handlers (app/api/v1/...) or Server Actions. Multi-tenant security is enforced via a middleware that extracts the orgId from the Authorization header and attaches it to the request context.

```typescript
// GET /api/v1/recipes?q={query}  
// Response: 200 OK  
type GetRecipesResponse = Recipe[];

// POST /api/v1/recipes  
// Body:  
type CreateRecipeDto = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> & {  
  ingredients: Omit<Ingredient, 'id' | 'recipeId'>[];  
  instructions: Omit<Instruction, 'id' | 'recipeId'>[];  
};  
// Response: 201 Created (Returns created Recipe object)
```

```typescript
// GET /api/v1/recipes/:id  
// Response: 200 OK (Returns 404 if not found or orgId mismatch)

// PUT /api/v1/recipes/:id  
// Body: UpdateRecipeDto  
// Response: 200 OK

// DELETE /api/v1/recipes/:id  
// Response: 204 No Content
```

### **Optimizations**

**1\. The "BFF" (Backend for Frontend) Advantage**

What's the necessary evil here? Tight coupling between client and server. We hate it, but we love how fast it goes.

By keeping everything in Next.js, we eliminate the need to manage separate deployments for the frontend and backend. We will use Server Actions or tRPC to achieve seamless, strongly-typed RPC calls between the React components and the database layer, drastically reducing the boilerplate required for standard fetch calls.

**2\. Local Hardware Networking & Security**

We're thinking about the future while managing right now's constraints. If we're running the client directly on the Robot, how can we make it communicate with the robot in the future?

Since the client app will be served from a remote domain (e.g., https://kitchen.ourplatform.com) but needs to communicate with the local C++ device daemon (e.g., http://127.0.0.1:9000), relying on WebSockets for this local IPC bypasses strict HTTP CORS policies. It allows for real-time bidirectional messaging (e.g., a physical button on the device triggers an Ionic modal on the screen without a page reload).

**3\. Multi-Tenant Database Security with Prisma**

This solution was good enough, but in the real world we might use row-based security/access policies and a data access layer that matches auth token issuers to dedicated per-tenant tables.

To prevent data leakage, we will implement Prisma Client Extensions. Every database read/write operation will be forced to include where: { orgId: user.orgId } automatically at the ORM level. This ensures developers cannot accidentally query data outside of the authenticated tenant's scope.

**4\. Continuous Deployment Strategy**

We need to update the apps running on devices across the world. It needs to be fast, easy, deterministic, and safe to do so. It should never disrupt operations.

"OTA updates" to the UI now simply require the kitchen browser kiosk to hard-refresh or rely on Next.js's standard caching/revalidation strategies. We can ship new features to kitchens instantly by deploying to Vercel/AWS, rather than coordinating payload downloads to individual hardware devices.

### **High-level Test Requirements Goal**

**E2E Tests**

* **Kiosk Simulation:** Use Playwright to simulate the application running in a restricted Chromium kiosk environment, ensuring all Ionic touch interactions (swipes, taps) function correctly without mouse events.  
* **Wizard Flow:** Automate the Recipe Creation Wizard, verifying that Zod validation correctly blocks submission of invalid data (e.g., negative ingredient amounts, missing titles).

**Unit Tests**

* **Shared Types/Validation:** Thoroughly test the Zod schemas to ensure both client-side form validation and server-side request validation behave identically and reject malformed inputs.  
* **Hardware Mocking:** Create a mock WebSocket server that mimics the C++ daemon to unit test the frontend's response to hardware events (e.g., triggering the next recipe step via a hardware button).

**API Tests**

* **Tenant Isolation:** Create a test suite that deliberately attempts to leak data. Create a recipe in Org A, then attempt to query, update, or delete it using a mocked session for Org B. The test passes *only* if the ORM layer strictly returns a 404 Not Found (returning 403 is a failure, as it reveals the ID exists).