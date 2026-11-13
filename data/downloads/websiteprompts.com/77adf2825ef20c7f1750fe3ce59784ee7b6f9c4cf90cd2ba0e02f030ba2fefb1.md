Create a SaaS onboarding flow prompt for Next.js:

1. LAYOUT
- Clean, centered card layout
- Progress indicator showing current step (1/4, 2/4, etc.)
- Step title and description
- Back and Continue buttons
- "Skip for now" link where appropriate
- Next.js app router structure with reusable StepShell, ProgressIndicator, FormField, and CTA components
- Server-safe defaults with client components only where form state needs interactivity

2. STEP 1: SIGNUP AND WORKSPACE
- "Welcome to TaskFlow!"
- "Let's set up your workspace in 2 minutes"
- Input: Workspace name
- Input: Your role (dropdown: Founder, Manager, Developer, Designer, Other)
- Optional: Upload workspace logo
- Account fields for name, email, password, and terms acceptance if the user has not signed up yet

3. STEP 2: ACTIVATION CHECKLIST
- Show a short checklist that explains what the user must complete before reaching the dashboard
- Include workspace setup, first project, first teammate, notification preferences, and billing status
- Mark completed items visually and show a persistent "Finish setup" CTA

4. STEP 3: PRODUCT TOUR
- Add a lightweight product tour with cards for dashboard, projects, tasks, integrations, reports, and settings
- Include "Next", "Back", "Skip tour", and "Restart tour" states
- Add empty-state copy for accounts with no data yet

5. STEP 4: INVITE TEAM
- "Invite your team members"
- Email input field with "Add another" button
- Bulk invite option (paste multiple emails)
- Role selector for each invite (Admin, Member, Viewer)
- "I'll do this later" skip option

6. STEP 5: CREATE FIRST PROJECT
- "Create your first project"
- Project name input
- Project template selector (cards):
  - Blank Project
  - Marketing Campaign
  - Product Launch
  - Software Development
  - Client Project
- Each template shows preview of included tasks
- Empty-state guidance if the user skips project creation

7. STEP 6: PERSONALIZE
- "Customize your experience"
- Notification preferences (checkboxes)
- Theme preference (Light/Dark/System)
- Keyboard shortcuts toggle
- "Get tips via email" opt-in
- Lifecycle email capture with choices for product tips, onboarding nudges, billing reminders, and release notes

8. BILLING HANDOFF
- Add a billing handoff screen for free trial, team plan, or usage-based plans
- Show plan summary, seats, next billing date, payment CTA, and "continue on free plan" option
- Include reassurance copy about changing plans later

9. COMPLETION SCREEN
- Celebration animation/confetti
- "You're all set!"
- Summary of what was created
- "Go to Dashboard" primary button
- "Watch getting started video" secondary link

10. NEXT.JS IMPLEMENTATION NOTES
- Use accessible form labels, validation copy, and keyboard-friendly step navigation.
- Store step state in a single onboarding object that can be saved to an API route later.
- Include loading, error, skipped, and completed states for every step.
- Make the flow responsive, with a compact progress indicator on mobile and a side checklist on desktop.

Design: Minimal, focused design. One action per screen. Use illustrations or icons to make it friendly.
