Create a SaaS admin dashboard interface:

1. LAYOUT STRUCTURE
- Fixed sidebar on left (240px width)
- Top header bar with search and user menu
- Main content area with padding

2. SIDEBAR NAVIGATION
- Logo at top
- Navigation items with icons:
  - Dashboard (home icon)
  - Projects (folder icon)
  - Tasks (checkbox icon)
  - Team (users icon)
  - Messages (chat icon)
  - Calendar (calendar icon)
  - Reports (chart icon)
  - Settings (gear icon)
- Active state with background highlight
- Collapse button at bottom

3. TOP HEADER
- Search bar with keyboard shortcut hint (⌘K)
- Notification bell with badge
- User avatar with dropdown menu

4. DASHBOARD WIDGETS (grid layout)

Row 1 (4 stat cards):
- Total Projects: 24 (+12% from last month)
- Active Tasks: 156 (23 overdue)
- Team Members: 12 (3 online)
- Hours Logged: 342h this week

Row 2 (2 columns):
- Left: Task completion chart (line graph, last 7 days)
- Right: Project status breakdown (donut chart)

Row 3 (2 columns):
- Left: Recent activity feed (5 items with avatars)
- Right: Upcoming deadlines (list with due dates)

Row 4 (full width):
- Team workload table (name, assigned tasks, completion rate, status)

5. DESIGN DETAILS
- Light theme with #f8fafc background
- Cards with white background and subtle shadow
- Accent color #6366f1 for active states
- Use consistent 8px spacing grid
- Rounded corners (8px for cards, 6px for buttons)

Make it responsive - sidebar collapses to icons on tablet, becomes bottom nav on mobile.
