# Product Requirements Document (PRD) - Trigly (Instagram DM Chat Application)

## 1. Overview
**Product Name:** Trigly (internal code/pkg name `slice`) 
**Description:** Trigly is a Next.js-based SaaS platform designed to revolutionize Instagram engagement for creators and businesses. It enables users to automate Instagram Direct Messages (DMs) and comment replies using rule-based keyword triggers and OpenAI-powered dynamic responses.
**Target Audience:** Instagram Creators, Influencers, and Businesses looking to automate their audience engagement, lead generation, and customer support.

## 2. Goals & Objectives
*   **Increase Engagement:** Provide automated, instant responses to followers' comments and DMs.
*   **Generate Leads:** Turn comments into conversations and conversations into conversions through automated DM sequences.
*   **Smart Communication:** Utilize AI (OpenAI) to provide contextual, natural-sounding replies instead of just static automated responses.
*   **Monetization:** Offer a freemium model where basic automation is free, and premium AI features are gatekept behind a SaaS subscription.

## 3. Tech Stack
*   **Frontend / Framework:** Next.js 15 (App Router), React 19
*   **Styling & UI:** Tailwind CSS, Shadcn UI, Radix UI primitives, Lucide Icons, Framer Motion (animations)
*   **Backend / API:** Next.js Server Actions & API Routes
*   **Database & ORM:** PostgreSQL, Prisma Client
*   **Authentication:** Clerk
*   **Payments & Subscriptions:** Stripe
*   **AI Integration:** OpenAI API (GPT-4o)
*   **External Integrations:** Instagram Graph API & Webhooks
*   **State Management & Data Fetching:** React Redux, TanStack React Query

## 4. Core Features & Requirements

### 4.1. User Management & Authentication
*   **Sign Up / Log In:** Users must be able to authenticate seamlessly using Clerk.
*   **Profile Management:** Store basic user information (Firstname, Lastname, Email, Clerk ID) in the database upon successful authentication.
*   **Subscription & Plan Management:** 
    *   **Free Plan ($0/month):** Basic static automations, targeted responses.
    *   **Smart AI / PRO Plan ($99/month):** AI-powered response generation, advanced analytics. Checked in DB model `Subscription: plan` (`PRO` or `FREE`).

### 4.2. Instagram Integration (OAuth & Webhooks)
*   **Connect Account:** Users can link their Meta/Instagram Professional accounts using OAuth.
*   **Token Storing:** Store Instagram Access Tokens securely against the `Integrations` model.
*   **Webhooks:** Listen to incoming payload events from Instagram (DMs and Comments).
    *   Secure webhook validation using `hub.challenge` tokens.

### 4.3. Automation Engine Workflow
*   An *Automation* is a rule-based flow created by the user containing Triggers, Keywords, and Listeners.
*   **Triggers & Keywords:** Users can define specific keywords. When the webhook detects these keywords in an incoming DM or Comment, the automation activates.
*   **Listener Modes:**
    *   `MESSAGE` Mode: Sends a predefined static response.
    *   `SMARTAI` Mode: Sends the user's prompt alongside the conversation history to OpenAI (GPT-4o) and returns a natural, context-aware AI response. Limited to `< 2 sentences`.
*   **Targeting (Posts vs DMs):** 
    *   Automations can be linked to specific Instagram Posts/Reels (so it only replies to comments on that specific post).
    *   General DM triggers apply to direct messages.

### 4.4. Conversation Tracking & Chat History
*   **DM History (Dms Model):** Keep track of automated messages sent and received by the AI for context preservation.
*   **Analytics / Counters:**
    *   Track the total count of DMs and comments successfully replied to under each `Listener`.

### 4.5. Dashboard & User Interface
*   **Landing Page:** Highlights Value Proposition, Features, and Pricing Plans.
*   **Protected Dashboard:** 
    *   View connected integrations (Instagram).
    *   Create, Read, Update, Delete (CRUD) operations for Automations.
    *   Activate/Deactivate toggle for Automations.
    *   Detailed view per automation to attach keywords, set triggers, and config listener (Message vs SmartAI) prompts.
    *   Displays recent posts fetched live from Instagram Graph API for assigning automations.
*   **Loading States & Toast Notify:** Smooth UI transitions using Sonner and custom loading components.

## 5. Security & Privacy Considerations
*   Environment configurations (`.env`) for keeping API Keys (OpenAI, Stripe, Clerk, Instagram Client Secret) secure.
*   Automated messages and database records securely linked to the authenticated user's ID to prevent unauthorized access.
*   Webhook event mapping cross-references automation ownership.

## 6. Future Scope / Expansion (Post MVP)
*   Visual Node-based automation flow builder.
*   Support for other platforms (Facebook Messenger, WhatsApp, Twitter).
*   Detailed Analytics Graphs utilizing `recharts` (library already in package.json).
*   Broadcast messaging to multiple followers.

## 7. Assumptions & Dependencies
*   User must hold an active Instagram Creator or Business Account linked to a Facebook Page.
*   Meta App must be approved for Instagram Graph API (messages, comments permissions).
*   Continuous uptime of Ngrok (dev) or production domain for Meta Webhook delivery.
