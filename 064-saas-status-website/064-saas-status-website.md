Create a SaaS service status page for "CloudSync" that displays real-time system health, incident reports, and uptime history:

1. HEADER
- Logo: "CloudSync Status" with signal/pulse icon
- Clean minimal header — no full navigation menu
- Right side: "Subscribe to Updates" button (outline #3B82F6 blue) and "Visit CloudSync" link
- Overall system status banner across full width below header:
  - All Systems Operational → green background (#ECFDF5), green checkmark icon, text: "All Systems Operational"
  - Partial Outage → yellow background (#FFFBEB), warning icon, text: "Partial System Outage"
  - Major Outage → red background (#FEF2F2), alert icon, text: "Major System Outage"
- Current state: "All Systems Operational" with timestamp "Last updated 2 minutes ago"

2. COMPONENT STATUS LIST
- Section headline: "Current Status"
- Each component row:
  - Component name (left)
  - Status indicator (right): green dot "Operational", yellow dot "Degraded", red dot "Outage", gray dot "Maintenance"

- Components:
  - Web Application — Operational (green)
  - API (v2) — Operational (green)
  - Database Cluster — Operational (green)
  - File Storage & CDN — Operational (green)
  - Authentication Service — Operational (green)
  - Webhooks — Degraded Performance (yellow)
  - Email Delivery — Operational (green)
  - Search & Indexing — Operational (green)
  - Mobile API — Operational (green)
  - Background Jobs — Operational (green)

- Each row separated by thin #E5E7EB border
- Expandable: clicking a component reveals sub-components and 7-day uptime bar

3. UPTIME CHART (90-day view)
- Section headline: "Uptime Over the Last 90 Days"
- Horizontal bar chart for each component (thin bars, one per day)
  - Green bars: 100% uptime
  - Yellow bars: degraded (99.0-99.9%)
  - Red bars: outage (<99%)
  - Gray bars: scheduled maintenance
- Hover tooltip on each bar: date, uptime percentage, any incident note
- Summary at right of each row: "99.98% uptime" in green text
- Overall uptime badge at top: "99.97% over 90 days"

4. ACTIVE INCIDENTS
- Section headline: "Active Incidents"
- If none: "No active incidents" with green checkmark
- If active incident:
  - Yellow or red banner card with:
    - Severity: "Minor" / "Major" / "Critical"
    - Title: "Degraded Webhook Delivery Performance"
    - Affected components: "Webhooks"
    - Started: "March 13, 2026 at 9:42 AM UTC"
    - Duration: "2h 15m"
  - Timeline of updates (newest first):
    - 11:57 AM — Monitoring — "Webhook delivery latency has improved. We are continuing to monitor."
    - 10:30 AM — Identified — "Root cause identified as elevated queue backlog in US-East region. Scaling resources."
    - 9:42 AM — Investigating — "We are investigating reports of delayed webhook deliveries."
  - Status progression bar: Investigating → Identified → Monitoring → Resolved

5. INCIDENT HISTORY (last 14 days)
- Section headline: "Past Incidents"
- Grouped by date with date headers

- March 12, 2026:
  - "No incidents reported" (green text)

- March 11, 2026:
  - Resolved — "Elevated API Response Times" — Duration: 45 min — Components: API (v2)
  - Timeline: Investigating (2:10 PM) → Identified (2:25 PM) → Monitoring (2:40 PM) → Resolved (2:55 PM)
  - Post-mortem link: "Read Post-Mortem →"

- March 8, 2026:
  - Resolved — "Scheduled Maintenance: Database Migration" — Duration: 2h — Components: Database Cluster
  - Note: "Planned maintenance completed successfully. No user-facing impact."

- March 3, 2026:
  - Resolved — "File Upload Failures" — Duration: 1h 20m — Components: File Storage & CDN
  - Timeline with updates

- "View Full Incident History →" link at bottom

6. SCHEDULED MAINTENANCE
- Section headline: "Upcoming Maintenance"
- Card with blue left border (#3B82F6):
  - Title: "Infrastructure Upgrade — US-West Region"
  - Scheduled: "March 18, 2026, 2:00 AM - 4:00 AM UTC"
  - Expected impact: "Brief interruptions to File Storage & CDN (< 5 minutes)"
  - Affected components listed with icons
  - "Subscribe to get notified" link
- If no upcoming maintenance: "No scheduled maintenance"

7. SUBSCRIBE TO UPDATES
- Section with light blue background (#EFF6FF)
- Headline: "Stay Informed"
- Subheadline: "Get notified about incidents and maintenance via your preferred channel"
- Three subscription options (cards):
  - Email: Input field + "Subscribe" button
  - Slack: "Add to Slack" button with Slack icon
  - RSS: "RSS Feed" link with feed icon
- Checkbox options: "All incidents", "Only major outages", "Scheduled maintenance"
- Privacy note: "We'll only send status-related notifications. Unsubscribe anytime."

8. SYSTEM METRICS (expandable section)
- Headline: "Performance Metrics"
- 3 metric cards:
  - API Response Time: "45ms avg" — sparkline chart showing last 24h — p50: 32ms, p95: 89ms, p99: 142ms
  - Error Rate: "0.02%" — sparkline trending down — "Below threshold"
  - Throughput: "12.4K req/s" — sparkline showing daily pattern — Peak: 18.2K req/s

9. FOOTER
- Minimal footer
- Links: CloudSync Home, API Documentation, Support, Privacy Policy
- "Powered by CloudSync Status" branding
- Social: Twitter/X (@CloudSyncStatus for live updates)
- © 2026 CloudSync Inc.

Design: Clean, trust-focused, information-dense. Primary: #3B82F6 (blue), success: #10B981 (green), warning: #F59E0B (amber), danger: #EF4444 (red), neutral: #111827 text on white. Typography: Inter for everything (system-level trust feel). Minimal decoration — status pages should feel reliable and transparent. Cards with 8px border-radius, 1px borders instead of shadows. Consistent 4px/8px spacing grid. Monospace font for timestamps and metrics.

Responsive: On mobile, uptime bars simplify to weekly summary. Component list remains full-width. Incident timelines stack cleanly. Metric sparklines scale to full width. Subscribe section stacks vertically. Maintain readability at all sizes — this page may be accessed during outages on poor connections.