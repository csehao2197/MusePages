(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ss = { get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }, del(k) { try { sessionStorage.removeItem(k); } catch { /* ignore */ } } };
  const ME = { name: "Jordan Lee", role: "Service Desk L2", member: "jlee" };

  /* ---------- sample data (fictional) ---------- */
  const COMMANDS = [
    ["/summary", "Summarise this ticket: issue, status or resolution"],
    ["/suggest", "Troubleshooting ideas, quick wins first"],
    ["/next", "Next steps, who to contact, escalate or not"],
    ["/similar", "Similar past tickets and what fixed them"],
    ["/config", "Devices and configurations in this ticket"],
    ["/draft", "Draft a professional customer reply"],
    ["/escalate", "Structured escalation notes for handoff"],
    ["/5whys", "Root cause analysis with the 5 Whys"],
    ["/refresh", "Clear this chat (only in your browser)"],
  ];
  const TICKETS = [
    { id: 48213, summary: "Outlook keeps asking for password after MFA change", company: "Harbor Dental Group", site: "Main office", contact: { name: "Priya Nair", title: "Practice Manager", email: "priya.nair@harbordental.example", phone: "(555) 014-2231" }, status: "Open", sub: "In progress", priority: "P2 · High", pc: "p2", board: "Service Desk", type: "Email › Outlook", owner: "Jordan Lee", ageH: 30, sla: "Resolve by tomorrow 5:00 PM",
      notes: [
        { by: "Priya Nair", kind: "discussion", ago: "30 h ago", text: "Since this morning Outlook on my laptop keeps popping up a password box every few minutes. I type my password and it comes back. Webmail works fine. We had the new authenticator app set up last week." },
        { by: "Sam Ortiz", kind: "internal", ago: "28 h ago", text: "Remoted in. Credential prompt is the old basic-auth style window, not modern auth. Cleared Credential Manager entries for MicrosoftOffice16 and Outlook. Prompt came back after 10 min." },
        { by: "Sam Ortiz", kind: "internal", ago: "27 h ago", text: "Repaired Office (quick repair). No change. Profile is cached exchange, 6.2 GB OST. Other two users at the site who got MFA enrolled are fine." },
        { by: "Jordan Lee", kind: "internal", ago: "3 h ago", text: "Checked the sign-in logs: interactive sign-ins succeed with MFA, but there are repeated failed non-interactive sign-ins from this device with a stale token error. Device shows as registered but not compliant." },
        { by: "Priya Nair", kind: "discussion", ago: "1 h ago", text: "It is getting worse and I have the payroll export to send today. Can someone call me after 2pm?" },
      ],
      configs: [
        { name: "HDG-LT-014", type: "Laptop", detail: "Dell Latitude 5440 · Windows 11 23H2 · Microsoft 365 Apps 2409", warn: "" },
        { name: "harbordental.example", type: "Microsoft 365 tenant", detail: "Business Premium · Security defaults off, Conditional Access on", warn: "" },
      ],
      ai: {
        issue: "Outlook on Priya's laptop repeatedly prompts for credentials since MFA enrolment; webmail is unaffected.",
        state: "Credential Manager cleared and Office quick repair done, no change. Sign-in logs show failing non-interactive token refreshes from a device registered but **not compliant**.",
        tried: ["Cleared Credential Manager entries (MicrosoftOffice16, Outlook)", "Office quick repair", "Compared with two other MFA-enrolled users at the site (unaffected)", "Reviewed sign-in logs (stale token on non-interactive sign-ins)"],
        suggest: [[1, "Sign out of all Office apps (File › Account › Sign out), then sign back in so the token is re-issued with MFA."], [1, "Run `dsregcmd /status` and check `AzureAdPrt : YES`. If NO, the device has no primary refresh token, which explains the prompts."], [1, "Confirm the legacy **basic-auth prompt** isn't forced by the `EnableADAL` or `DisableADALatopWAMOverride` registry keys under `HKCU\\Software\\Microsoft\\Office\\16.0\\Common\\Identity`."], [0, "Fix device compliance: the Conditional Access policy requires a compliant device, so the token refresh fails. Trigger an Intune sync and review the failing compliance setting."], [0, "If compliance can't be fixed quickly, create a new Outlook profile as a test. The 6.2 GB OST will take a while to rebuild, so plan around the payroll export."]],
        next: ["Call Priya after 2 PM as requested and walk her through signing out and back in to Office (5 min).", "If prompts continue, check `dsregcmd /status` and the device's compliance state in Intune.", "Escalate to the cloud team if the compliance policy itself is misconfigured. That needs a tenant admin."],
        escalate: { needed: false, to: "Cloud / M365 team", why: "Only if device compliance can't be restored at L2 (policy change needs tenant admin)." },
        impact: "One user, Practice Manager. Blocks a time-sensitive payroll export today.",
        why5: ["Outlook prompts repeatedly → its token refresh fails.", "Token refresh fails → Conditional Access rejects non-interactive sign-ins from this laptop.", "CA rejects them → the device is registered but marked **not compliant**.", "Not compliant → the compliance check for BitLocker/OS version failed after last week's change window (likely).", "Not caught → MFA rollout checklist didn't include verifying device compliance before enabling the CA policy."],
        keywords: ["outlook", "password", "prompt", "mfa", "credential", "token", "office", "m365", "compliance"],
      } },
    { id: 48190, summary: "VPN disconnects every 10–15 minutes for remote dispatchers", company: "Northgate Logistics", site: "Remote staff", contact: { name: "Marcus Hale", title: "Operations Lead", email: "marcus.hale@northgate.example", phone: "(555) 018-7720" }, status: "Open", sub: "Waiting on customer", priority: "P3 · Medium", pc: "p3", board: "Network", type: "Network › VPN", owner: "Jordan Lee", ageH: 74, sla: "Next update due today 4:00 PM",
      notes: [
        { by: "Marcus Hale", kind: "discussion", ago: "3 days ago", text: "Three of our remote dispatchers get kicked off the VPN every 10-15 minutes since Monday. They have to reconnect and lose their session in the dispatch app." },
        { by: "Ana Pereira", kind: "internal", ago: "3 days ago", text: "Firewall NG-FW01 logs show tunnels dropping with DPD timeout. Only users on the SSL VPN client 7.2.1, the users on 7.0 are stable. Firmware on firewall was updated Sunday night." },
        { by: "Ana Pereira", kind: "internal", ago: "2 days ago", text: "Raised DPD interval from 30s to 60s as a test. Drops reduced but still happening roughly every 25 min." },
        { by: "Jordan Lee", kind: "discussion", ago: "20 h ago", text: "Hi Marcus, could you ask the three dispatchers to send us their client version (Help > About) and whether they are on home Wi-Fi or mobile hotspot? Thanks." },
      ],
      configs: [
        { name: "NG-FW01", type: "Firewall", detail: "Firmware 7.4.4 (updated Sunday) · SSL VPN portal 'remote-staff'", warn: "Changed 4 days ago" },
        { name: "SSL VPN client", type: "Software", detail: "7.2.1 on 3 affected laptops · 7.0.12 on unaffected", warn: "Version mismatch" },
      ],
      ai: {
        issue: "Three remote dispatchers are disconnected from the SSL VPN every 10–15 minutes since the firewall firmware update on Sunday.",
        state: "DPD timeouts in the firewall logs; only clients on 7.2.1 are affected. Raising the DPD interval to 60s reduced drops (≈ every 25 min). **Waiting on Marcus** for client versions and connection types.",
        tried: ["Correlated drops with DPD timeouts on NG-FW01", "Identified client version split (7.2.1 affected, 7.0.12 stable)", "Raised DPD interval 30s → 60s (partial improvement)", "Asked customer for client versions and connection type"],
        suggest: [[1, "Check the firmware 7.4.4 release notes for known SSL VPN client compatibility issues. A client/firmware mismatch fits the timing exactly."], [1, "Upgrade one affected dispatcher to the client version recommended for 7.4.x and watch for 2 hours."], [1, "Disable **DTLS** on the portal for a test user. Some firmware/client combinations drop DTLS tunnels on DPD."], [0, "If drops persist, capture a debug log on one client during a disconnect and compare the reason code."], [0, "As a workaround, roll the three clients back to 7.0.12, which is confirmed stable here."]],
        next: ["Chase Marcus's reply today (the update is due at 4:00 PM).", "Schedule a client upgrade on one dispatcher's laptop as a controlled test.", "Escalate to the network team if the release notes confirm a firmware bug, as they may need to roll back the firewall."],
        escalate: { needed: true, to: "Network team (L3)", why: "The root cause points to Sunday's firewall firmware change. A rollback or firmware decision is above L2." },
        impact: "3 dispatchers; each drop loses the dispatch app session, so delays are customer-facing.",
        why5: ["Dispatchers lose VPN → the tunnel is torn down after a DPD timeout.", "DPD times out → the client stops answering keepalives in time.", "Keepalives are missed → client 7.2.1 behaves differently with the new firewall firmware (DTLS/DPD handling).", "Mismatch introduced → firmware was updated Sunday without checking client compatibility.", "Not checked → change process has no compatibility matrix for VPN clients."],
        keywords: ["vpn", "disconnect", "drops", "ssl", "firewall", "dpd", "remote", "tunnel", "firmware"],
      } },
    { id: 47956, summary: "Shared drive mapping missing after password reset", company: "Harbor Dental Group", site: "Main office", contact: { name: "Leo Brandt", title: "Front Desk", email: "leo.brandt@harbordental.example", phone: "(555) 014-2240" }, status: "Closed", sub: "Resolved", priority: "P3 · Medium", pc: "p3", board: "Service Desk", type: "Access › File share", owner: "Sam Ortiz", ageH: 220, sla: "Resolved in 3 h 10 m",
      notes: [
        { by: "Leo Brandt", kind: "discussion", ago: "9 days ago", text: "After I changed my password this morning the S: drive with the patient forms is gone from This PC." },
        { by: "Sam Ortiz", kind: "internal", ago: "9 days ago", text: "Mapping is deployed by GPO 'HDG Drive Maps'. gpresult shows the GPO filtered out: user not in group HDG-Staff-Forms. Group membership was removed by the offboarding script run on Friday (wrong user matched on first name)." },
        { by: "Sam Ortiz", kind: "resolution", ago: "9 days ago", text: "Re-added Leo to HDG-Staff-Forms, ran gpupdate /force and logged off/on. S: drive back. Fixed the offboarding script to match on UPN instead of display name and checked no other users were affected." },
      ],
      configs: [{ name: "HDG-PC-FD02", type: "Workstation", detail: "Windows 11 23H2 · Front desk", warn: "" }, { name: "HDG-FS01", type: "File server", detail: "Windows Server 2019 · Share \\\\HDG-FS01\\Forms", warn: "OS support ends Jan 2029" }],
      ai: {
        issue: "Leo's S: drive (patient forms) disappeared after a password reset.",
        resolution: "The drive mapping GPO was filtered out because Leo had been removed from **HDG-Staff-Forms** by the offboarding script (it matched on first name). Re-added to the group, ran `gpupdate /force`, and fixed the script to match on UPN.",
        tried: ["gpresult to confirm GPO filtering", "Re-added user to HDG-Staff-Forms", "gpupdate /force and re-logon", "Corrected offboarding script matching and audited other users"],
        suggest: [[1, "Run `gpresult /r` and check whether the drive map GPO is applied or filtered."], [1, "Check the user's security group membership against the GPO's security filtering."], [0, "Review recent automation (offboarding scripts) for accidental group removals."]],
        next: ["None. The ticket is closed. Confirm with Leo in a week if forms access is stable (optional)."],
        escalate: { needed: false, to: "", why: "Resolved at L2." },
        impact: "One user, front desk. Patient intake forms unavailable for 3 hours.",
        why5: ["S: drive missing → the drive map GPO didn't apply.", "GPO didn't apply → user not in HDG-Staff-Forms.", "Not in the group → removed by the offboarding script on Friday.", "Script removed him → it matched users on first name, not UPN.", "Not caught → script had no dry-run/review step before group changes."],
        keywords: ["drive", "mapping", "share", "gpo", "password", "group", "s:", "missing"],
      } },
    { id: 48231, summary: "Front desk printer printing blank pages", company: "Cedar & Pine Veterinary", site: "Clinic", contact: { name: "Hannah Cole", title: "Clinic Coordinator", email: "hannah@cedarpine.example", phone: "(555) 019-3304" }, status: "Open", sub: "New", priority: "P4 · Low", pc: "p4", board: "Service Desk", type: "Hardware › Printer", owner: "Unassigned", ageH: 2, sla: "Respond within 4 h",
      notes: [{ by: "Hannah Cole", kind: "discussion", ago: "2 h ago", text: "The front desk printer started printing blank pages for invoices. A test page from the printer menu looks fine. We can use the back office printer for now." }],
      configs: [{ name: "CPV-PRN-01", type: "Printer", detail: "Laser MFP · Driver v4 'Universal PCL6' · IP 10.20.1.45", warn: "Warranty expired" }],
      ai: {
        issue: "Front desk printer prints blank pages from the PC (invoices), but the printer's own test page is fine.",
        state: "New ticket, unassigned. Workaround in place (back office printer).",
        tried: ["Customer printed a test page from the printer menu (OK)"],
        suggest: [[1, "Print a Windows test page (Printer properties) to separate driver from application problems."], [1, "Switch the queue from the **Universal PCL6** driver to the model-specific driver or PCL5. Blank pages with a good engine test usually mean a driver/PDL mismatch."], [1, "Check whether only PDFs (invoices) are blank. If so, try 'Print as image' in the PDF reader."], [0, "Clear the print queue and restart the Print Spooler service on the front desk PC."]],
        next: ["Assign the ticket and acknowledge Hannah within the 4-hour response SLA.", "Remote in and try the driver swap (10 min).", "No escalation needed. Hardware is fine and the warranty has expired anyway."],
        escalate: { needed: false, to: "", why: "Driver-level issue, L1/L2." },
        impact: "Low. Workaround available.",
        why5: ["Pages print blank → the printer receives a job it renders as empty.", "Rendered empty → the driver output doesn't match what the printer expects.", "Mismatch → the universal PCL6 driver mishandles the invoice PDFs' fonts/graphics.", "Universal driver in use → it was chosen at install for convenience.", "Not caught → there's no standard driver list per printer model."],
        keywords: ["printer", "blank", "pages", "print", "driver", "invoice"],
      } },
  ];
  const PAST = [
    { id: 47702, summary: "Outlook password prompts after enabling MFA", company: "Harbor Dental Group", days: 41, fix: "Signed out of all Office apps, removed stale `Office` identity keys, signed back in. Device PRT was missing (`dsregcmd`), fixed by re-joining Entra ID.", kw: ["outlook", "password", "prompt", "mfa", "token", "office"] },
    { id: 47811, summary: "Teams and Outlook ask for credentials repeatedly", company: "Harbor Dental Group", days: 120, fix: "Old Windows Hello PIN reset. (Outside 90-day company window.)", kw: ["outlook", "credential", "prompt", "teams"] },
    { id: 48102, summary: "Outlook not syncing, prompts for password (new phone MFA)", company: "Juniper Legal LLP", days: 6, fix: "Device not compliant in Intune (BitLocker off), so the CA policy blocked token refresh. Enabled BitLocker, synced Intune, prompts stopped.", kw: ["outlook", "password", "mfa", "compliance", "token", "prompt"] },
    { id: 48077, summary: "Excel and Word sign-in loop after MFA rollout", company: "Brightside Accounting", days: 11, fix: "Removed `EnableADAL=0` registry value left by an old script; modern auth restored.", kw: ["office", "mfa", "credential", "prompt", "m365"] },
    { id: 47990, summary: "SSL VPN drops for remote users after firewall upgrade", company: "Northgate Logistics", days: 63, fix: "Firmware bug with DTLS. Disabled DTLS on the portal until patched firmware was installed.", kw: ["vpn", "ssl", "firewall", "firmware", "drops", "disconnect"] },
    { id: 48140, summary: "VPN disconnects on hotel Wi-Fi", company: "Juniper Legal LLP", days: 9, fix: "Hotel network blocked UDP. Forced TCP-only tunnel for travelling users.", kw: ["vpn", "disconnect", "remote", "tunnel"] },
    { id: 48166, summary: "Client 7.2.1 VPN keeps dropping every 15 min", company: "Orchard Schools", days: 4, fix: "Upgraded client to 7.2.4, which fixes the DPD regression on firewall firmware 7.4.x.", kw: ["vpn", "ssl", "dpd", "drops", "disconnect", "firmware"] },
    { id: 47540, summary: "Mapped drives missing at logon", company: "Harbor Dental Group", days: 160, fix: "Logon script path changed. (Outside 90-day window.)", kw: ["drive", "mapping", "share", "missing"] },
    { id: 48151, summary: "S: drive gone after user moved OU", company: "Brightside Accounting", days: 8, fix: "GPO link missing on the new OU; linked 'Drive Maps' GPO.", kw: ["drive", "mapping", "gpo", "share", "missing"] },
    { id: 48120, summary: "Printer prints blank pages from PDF", company: "Orchard Schools", days: 13, fix: "Switched from universal PCL6 to model-specific PCL5 driver.", kw: ["printer", "blank", "pages", "driver", "print"] },
    { id: 47801, summary: "Reception printer blank pages", company: "Cedar & Pine Veterinary", days: 77, fix: "Toner cartridge seal not removed after replacement.", kw: ["printer", "blank", "pages", "print"] },
    { id: 48055, summary: "Printer offline after router swap", company: "Cedar & Pine Veterinary", days: 30, fix: "Updated printer port to new DHCP reservation.", kw: ["printer", "print"] },
  ];

  /* ---------- markdown ---------- */
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>");
  function md(src) {
    const lines = src.split("\n"), out = []; let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      if (l.startsWith("### ")) { out.push(`<h4>${inline(l.slice(4))}</h4>`); i++; continue; }
      if (l.startsWith("> ")) { const b = []; while (i < lines.length && lines[i].startsWith("> ")) b.push(lines[i++].slice(2)); out.push(`<blockquote>${b.map(inline).join("<br>")}</blockquote>`); continue; }
      if (l.startsWith("|")) { const rows = []; while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]); const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()); out.push(`<table><thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`); continue; }
      if (/^[-*] /.test(l)) { const b = []; while (i < lines.length && /^[-*] /.test(lines[i])) b.push(lines[i++].slice(2)); out.push(`<ul>${b.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`); continue; }
      if (/^\d+\. /.test(l)) { const b = []; while (i < lines.length && /^\d+\. /.test(lines[i])) b.push(lines[i++].replace(/^\d+\. /, "")); out.push(`<ol>${b.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`); continue; }
      const b = []; while (i < lines.length && lines[i].trim() && !/^(### |> |\||[-*] |\d+\. )/.test(lines[i])) b.push(lines[i++]); out.push(`<p>${b.map(inline).join("<br>")}</p>`);
    }
    return out.join("");
  }
  const plain = (src) => src.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/^### /gm, "").replace(/^> /gm, "");

  /* ---------- answer engine (local stand-in for the LLM) ---------- */
  const age = (h) => { if (h < 24) return `${h} h`; const d = Math.round(h / 24); return `${d} day${d === 1 ? "" : "s"}`; };
  const first = (n) => n.split(" ")[0];
  function similar(t) {
    const kw = new Set(t.ai.keywords), score = (p) => { const s = new Set(p.kw); let n = 0; s.forEach((k) => kw.has(k) && n++); return n / new Set([...kw, ...s]).size; };
    const ranked = PAST.map((p) => ({ ...p, s: score(p) })).filter((p) => p.s >= 0.15).sort((a, b) => b.s - a.s);
    return { company: ranked.filter((p) => p.company === t.company && p.days <= 90).slice(0, 3), global: ranked.filter((p) => p.company !== t.company && p.days <= 14).slice(0, 3), skipped: ranked.filter((p) => (p.company === t.company && p.days > 90) || (p.company !== t.company && p.days > 14)).length };
  }
  function answer(t, raw) {
    const q = raw.trim(), cmd = q.split(/\s+/)[0].toLowerCase(), a = t.ai, closed = t.status === "Closed";
    const rows = (list) => list.map((x) => `| #${x.id} | ${x.summary} | ${x.days} d ago | ${x.fix} |`).join("\n");
    switch (cmd) {
      case "/summary": return `### Summary · #${t.id}\n**Issue:** ${a.issue}\n\n${closed ? `**Resolution:** ${a.resolution}` : `**Current status:** ${t.sub}. ${a.state}`}\n\n### Key facts\n- **Contact:** ${t.contact.name}, ${t.contact.title} (${t.company})\n- **Priority:** ${t.priority} · open ${age(t.ageH)}${closed ? "" : ` · ${t.sla}`}\n- **Impact:** ${a.impact}\n- **Notes read:** ${t.notes.length} · **Configs:** ${t.configs.length}`;
      case "/suggest": return `### Troubleshooting suggestions\n${closed ? "> This ticket is closed. These are the checks that would catch it next time.\n\n" : ""}${a.suggest.map(([quick, s], i) => `${i + 1}. ${quick ? "**Quick win:** " : ""}${s}`).join("\n")}\n\n*Already tried:* ${a.tried.join("; ")}.`;
      case "/next": return `### Recommended next steps\n${a.next.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n### Who to contact\n- **Customer:** ${t.contact.name}, ${t.contact.phone}, ${t.contact.email}\n- **Owner:** ${t.owner}\n\n### Escalate?\n${a.escalate.needed ? `**Yes**, to ${a.escalate.to}. ${a.escalate.why}` : `**Not now.** ${a.escalate.why}`}`;
      case "/similar": { const r = similar(t); return `### Similar tickets\n**${t.company}**, last 90 days\n${r.company.length ? `| Ticket | Summary | When | What worked |\n|---|---|---|---|\n${rows(r.company)}` : "- No matches in the 90-day company window."}\n\n**All companies**, last 14 days\n${r.global.length ? `| Ticket | Summary | When | What worked |\n|---|---|---|---|\n${rows(r.global)}` : "- No matches in the 14-day global window."}${r.skipped ? `\n\n*${r.skipped} older match${r.skipped > 1 ? "es" : ""} skipped (outside the search window).*` : ""}`; }
      case "/config": return `### Configurations on this ticket\n| Name | Type | Details | Note |\n|---|---|---|---|\n${t.configs.map((c) => `| ${c.name} | ${c.type} | ${c.detail} | ${c.warn || "—"} |`).join("\n")}\n\n${t.configs.some((c) => c.warn) ? `**Watch:** ${t.configs.filter((c) => c.warn).map((c) => `${c.name}: ${c.warn.toLowerCase()}`).join("; ")}.` : "No warnings on attached configurations."}`;
      case "/draft": { const short = /short|brief/i.test(q); const body = closed ? `I'm glad to confirm the issue with your ${t.summary.toLowerCase().includes("drive") ? "S: drive" : "request"} is resolved. ${a.resolution.replace(/\*\*/g, "").split(". ")[0]}. We've also put a fix in place so it won't happen to anyone else.` : `Thanks for your patience while we look into this. Here's where we are: ${a.state.replace(/\*\*/g, "").split(". ")[0].replace(/^./, (c) => c.toLowerCase())}. Next, ${a.next[0].replace(/^./, (c) => c.toLowerCase())}`; return `### Draft reply to ${first(t.contact.name)}\n> Hi ${first(t.contact.name)},\n>\n> ${body}${short ? "" : `\n>\n> ${closed ? "If anything still looks wrong, just reply to this email and we'll jump back in." : "We'll keep you updated, and you can reply here or call us anytime if things change."}`}\n>\n> Kind regards,\n> ${ME.name}\n> Service Desk\n\n*Review before sending. TicketWise never posts to the ticket.*`; }
      case "/escalate": return `### Escalation notes · #${t.id}\n**To:** ${a.escalate.to || "Next-level support"}\n**Summary:** ${a.issue}\n**Business impact:** ${a.impact}\n\n### Steps taken\n${a.tried.map((s) => `- ${s}`).join("\n")}\n\n### Evidence\n${t.notes.filter((n) => n.kind !== "discussion").map((n) => `- ${n.by} (${n.ago}): ${n.text.slice(0, 140)}${n.text.length > 140 ? "…" : ""}`).join("\n") || "- Customer report only"}\n\n### Ask\n${a.escalate.needed ? a.escalate.why : `Escalation not recommended yet. ${a.escalate.why}`}\n\n**Customer contact:** ${t.contact.name}, ${t.contact.phone}`;
      case "/5whys": return `### 5 Whys · root cause\n${a.why5.map((w, i) => `${i + 1}. **Why?** ${w}`).join("\n")}\n\n**Likely root cause:** ${a.why5[4].split("→")[1]?.trim() || a.why5[4]}\n\n*Inferred from the notes. Confirm before recording it as the root cause.*`;
    }
    if (cmd.startsWith("/")) return `Unknown command \`${esc(cmd)}\`. Type \`/\` to see what I can do.`;
    const l = q.toLowerCase();
    if (/\b(who|contact|call|phone|email)\b/.test(l)) return `**${t.contact.name}**, ${t.contact.title} at ${t.company}\n- Phone: ${t.contact.phone}\n- Email: ${t.contact.email}${t.notes.some((n) => /call me/i.test(n.text)) ? `\n\n> Note: ${t.contact.name} asked for a call: “${t.notes.find((n) => /call me/i.test(n.text)).text.match(/[^.?!]*call me[^.?!]*[.?!]/i)[0].trim()}”` : ""}`;
    if (/\b(tried|done|steps|attempted|so far)\b/.test(l)) return `### Already tried\n${a.tried.map((s) => `- ${s}`).join("\n")}`;
    if (/\b(how long|age|open since|sla|when)\b/.test(l)) return `Opened **${age(t.ageH)} ago**. ${t.status === "Closed" ? t.sla : `SLA: ${t.sla}.`} Status: ${t.status} (${t.sub}).`;
    if (/\b(config|device|laptop|computer|pc|serial|warranty|firmware|os)\b/.test(l)) return answer(t, "/config");
    if (/\b(priority|impact|urgent|business)\b/.test(l)) return `**${t.priority}**. ${a.impact}`;
    if (/\b(why|cause|root)\b/.test(l)) return `Short version: ${a.why5[2]}\n\nRun \`/5whys\` for the full chain.`;
    const words = l.split(/\W+/).filter((w) => w.length > 3);
    const hits = t.notes.filter((n) => words.some((w) => n.text.toLowerCase().includes(w)));
    if (hits.length) return `From the notes:\n${hits.slice(0, 3).map((n) => `> **${n.by}**, ${n.ago}: ${n.text}`).join("\n>\n")}`;
    return "I couldn't find that in this ticket's notes or configurations. Try `/summary` for an overview, or `/similar` to see how others solved it.";
  }

  /* ---------- pod state ---------- */
  let t = TICKETS[0], busy = false, acIdx = 0, acItems = [];
  const stamps = [];
  const log = $("[data-log]"), ta = $("#ask"), ac = $("[data-ac]");
  const key = () => `tw-chat-${t.id}`;
  const remaining = () => { const now = Date.now(); while (stamps.length && now - stamps[0] > 60000) stamps.shift(); return 30 - stamps.length; };
  function renderRate() { const r = remaining(), el = $("[data-rate]"); el.textContent = `${r}/30 requests left this minute`; el.className = r <= 5 ? "low" : ""; }
  setInterval(renderRate, 1000);

  function renderTicket() {
    const pcls = t.status === "Closed" ? "closed" : "open";
    $("[data-ticket]").innerHTML = `<div class="t-top"><span class="num">#${t.id}</span><span class="pill ${pcls}">${t.status} · ${t.sub}</span><span class="pill ${t.pc}">${t.priority}</span><span>${esc(t.board)} · ${esc(t.type)}</span></div>
      <h3>${esc(t.summary)}</h3>
      <dl class="t-meta"><div><dt>Company</dt><dd>${esc(t.company)}</dd></div><div><dt>Contact</dt><dd>${esc(t.contact.name)}</dd></div><div><dt>Owner</dt><dd>${esc(t.owner)}</dd></div><div><dt>Age</dt><dd>${age(t.ageH)}</dd></div></dl>
      <p class="t-h">${icon("i-note")}Notes · ${t.notes.length}</p>
      <ul class="notes">${t.notes.map((n) => `<li class="${n.kind}"><div class="nh"><span><b>${esc(n.by)}</b> · ${n.kind === "internal" ? "Internal" : n.kind === "resolution" ? "Resolution" : "Discussion"}</span><span>${esc(n.ago)}</span></div><p>${esc(n.text)}</p></li>`).join("")}</ul>
      <p class="t-h">${icon("i-monitor")}Configurations · ${t.configs.length}</p>
      <div class="configs">${t.configs.map((c) => `<div class="cfg">${icon(c.type === "Microsoft 365 tenant" ? "i-building" : "i-monitor")}<div><b>${esc(c.name)}</b><span>${esc(c.type)} · ${esc(c.detail)}${c.warn ? ` · <strong style="color:var(--amber)">${esc(c.warn)}</strong>` : ""}</span></div></div>`).join("")}</div>`;
  }
  function msgHTML(m, i) {
    if (m.who === "me") return `<div class="m-me">${inline(m.text)}</div>`;
    return `<div class="m-ai${m.err ? " err" : ""}" data-msg="${i}"><div class="md">${md(m.text)}</div>${m.err ? "" : `<div class="m-act"><small>${esc(m.meta || "")}</small><button type="button" class="copy" data-copy="${i}" aria-label="Copy response as rich text">${icon("i-copy")}Copy</button></div>`}</div>`;
  }
  let chat = [];
  function renderLog(hand) {
    log.innerHTML = (hand || "") + chat.map(msgHTML).join("");
    if (!chat.length && !hand) log.innerHTML = `<div class="sys" data-sys><span class="ok">✓ Authenticated as ${ME.name} (${ME.role})</span><span>Context loaded: ticket #${t.id}, ${t.notes.length} notes, ${t.configs.length} configurations</span><span>Type / for commands, or ask anything about this ticket.</span></div>`;
    log.scrollTop = log.scrollHeight;
  }
  function loadTicket(id) {
    t = TICKETS.find((x) => x.id === +id) || TICKETS[0]; chat = ss.get(key(), []);
    renderTicket(); renderLog(); ta.placeholder = `Ask about #${t.id}, or type / for commands`;
  }
  function send(text) {
    text = text.trim(); if (!text || busy) return;
    closeAc(); ta.value = ""; autosize();
    if (text.toLowerCase() === "/refresh") { chat = []; ss.del(key()); renderLog(); toast("Chat cleared"); return; }
    chat.push({ who: "me", text });
    if (remaining() <= 0) { const wait = Math.ceil((60000 - (Date.now() - stamps[0])) / 1000); chat.push({ who: "ai", err: true, text: `**Rate limit reached.** You can send 30 requests per minute. Try again in ${wait}s.` }); ss.set(key(), chat); renderLog(); return; }
    stamps.push(Date.now()); renderRate();
    busy = true; $(".send").disabled = true;
    renderLog(); log.insertAdjacentHTML("beforeend", `<div class="m-ai" data-thinking><span class="typing" aria-label="Thinking"><i></i><i></i><i></i></span></div>`); log.scrollTop = log.scrollHeight;
    const started = performance.now();
    setTimeout(() => {
      const out = answer(t, text), cmd = text.startsWith("/") ? text.split(/\s+/)[0] : "chat";
      chat.push({ who: "ai", text: out, meta: `${cmd} · ${(1.1 + (performance.now() - started) / 1000).toFixed(1)}s` });
      ss.set(key(), chat); busy = false; $(".send").disabled = false; renderLog(); ta.focus();
    }, 550 + Math.min(500, text.length * 4));
  }

  /* ---------- autocomplete ---------- */
  function openAc() {
    const v = ta.value; if (!v.startsWith("/") || /\s/.test(v)) return closeAc();
    acItems = COMMANDS.filter(([c]) => c.startsWith(v.toLowerCase()));
    if (!acItems.length) return closeAc();
    acIdx = Math.min(acIdx, acItems.length - 1);
    ac.innerHTML = acItems.map(([c, d], i) => `<div role="option" id="ac-${i}" data-cmd="${c}" aria-selected="${i === acIdx}"><b>${c}</b><span>${d}</span></div>`).join("");
    ac.id = "ac-list"; ac.hidden = false; ta.setAttribute("aria-expanded", "true"); ta.setAttribute("aria-activedescendant", `ac-${acIdx}`);
  }
  function closeAc() { ac.hidden = true; acIdx = 0; ta.setAttribute("aria-expanded", "false"); ta.removeAttribute("aria-activedescendant"); }
  function autosize() { ta.style.height = "auto"; ta.style.height = `${Math.min(120, ta.scrollHeight + 2)}px`; }
  ta.addEventListener("input", () => { acIdx = 0; openAc(); autosize(); });
  ta.addEventListener("keydown", (e) => {
    if (!ac.hidden) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); acIdx = (acIdx + (e.key === "ArrowDown" ? 1 : -1) + acItems.length) % acItems.length; openAc(); $(`#ac-${acIdx}`)?.scrollIntoView({ block: "nearest" }); return; }
      if (e.key === "Tab") { e.preventDefault(); ta.value = `${acItems[acIdx][0]} `; closeAc(); return; }
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(acItems[acIdx][0]); return; }
      if (e.key === "Escape") { e.preventDefault(); closeAc(); return; }
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(ta.value); }
  });
  ac.addEventListener("mousedown", (e) => { const o = e.target.closest("[data-cmd]"); if (o) { e.preventDefault(); send(o.dataset.cmd); } });
  ta.addEventListener("blur", () => setTimeout(closeAc, 120));
  $("[data-form]").addEventListener("submit", (e) => { e.preventDefault(); send(ta.value); });

  /* ---------- copy as rich text ---------- */
  async function copyRich(src, btn) {
    const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px">${md(src)}</div>`, text = plain(src);
    let ok = false;
    try { if (window.ClipboardItem && navigator.clipboard?.write) { await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([text], { type: "text/plain" }) })]); ok = true; } } catch { /* fall back */ }
    if (!ok) try { await navigator.clipboard.writeText(text); ok = true; } catch { /* fall back */ }
    if (!ok) { const h = document.createElement("textarea"); h.value = text; h.style.position = "fixed"; h.style.opacity = "0"; document.body.append(h); h.select(); try { ok = document.execCommand("copy"); } catch { ok = false; } h.remove(); }
    if (ok) { btn.classList.add("done"); btn.innerHTML = `${icon("i-check")}Copied`; setTimeout(() => { btn.classList.remove("done"); btn.innerHTML = `${icon("i-copy")}Copy`; }, 1800); }
    else toast("Couldn't copy. Select the text and copy it manually");
  }
  log.addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (b) copyRich(chat[+b.dataset.copy].text, b); });

  /* ---------- host simulation ---------- */
  const sel = $("[data-ticketsel]");
  sel.innerHTML = TICKETS.map((x) => `<option value="${x.id}">#${x.id} · ${esc(x.summary)}</option>`).join("");
  sel.addEventListener("change", () => loadTicket(sel.value));
  $("[data-standalone]").addEventListener("change", (e) => { $("[data-podonly]").hidden = !e.target.checked; $("[data-who]").innerHTML = e.target.checked ? "Not in host" : `<i></i>${ME.name}`; });
  $("[data-refresh]").addEventListener("click", () => send("/refresh"));
  $("[data-quick]").innerHTML = COMMANDS.slice(0, 8).map(([c]) => `<button type="button" data-run="${c}">${c}</button>`).join("");
  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-run]"); if (!r) return;
    if (r.closest(".cmd")) { $("#demo").scrollIntoView({ behavior: "smooth" }); }
    if (!$("[data-podonly]").hidden) { $("[data-standalone]").click(); }
    send(r.dataset.run);
  });
  $("[data-cmds]").innerHTML = COMMANDS.map(([c, d]) => `<div class="cmd"><code>${c}</code><p>${d}${c === "/similar" ? ". Your company's last 90 days first, then everyone's last 14." : ""}</p><button type="button" data-run="${c}">Run in demo ${icon("i-arrow")}</button></div>`).join("");
  $("[data-copycode]").addEventListener("click", async (e) => { try { await navigator.clipboard.writeText($("[data-code]").textContent); toast("Copied .env template"); } catch { toast("Select the text to copy it"); } e.currentTarget.blur(); });

  /* postMessage handshake (simulated host posts to the pod; origin-checked) */
  const ALLOWED = [location.origin];
  window.addEventListener("message", (e) => {
    if (!ALLOWED.includes(e.origin) || e.data?.type !== "tw:host-session") return;
    const steps = [`→ host session received from ${e.origin === location.origin ? "demo host" : e.origin}`, "✓ origin allowed", `✓ member verified: ${ME.member} (${ME.role})`, `✓ loaded ticket #${t.id}: ticket, notes and configs in parallel`];
    let i = 0; const box = document.createElement("div"); box.className = "sys"; box.dataset.hs = ""; log.prepend(box);
    const tick = () => { if (i >= steps.length) { setTimeout(() => { if (!chat.length) renderLog(); else box.remove(); }, 700); return; } box.insertAdjacentHTML("beforeend", `<span class="${steps[i].startsWith("✓") ? "ok" : ""}">${steps[i]}</span>`); i++; setTimeout(tick, 220); };
    if (!chat.length) { log.innerHTML = ""; log.append(box); } tick();
    $("[data-who]").innerHTML = `<i></i>${ME.name}`;
  });

  let toastT; function toast(m) { const box = $("[data-toasts]"); box.innerHTML = `<div class="toast">${esc(m)}</div>`; clearTimeout(toastT); toastT = setTimeout(() => (box.innerHTML = ""), 2200); }

  window.__tw = { answer: (q) => answer(t, q), get chat() { return chat; }, get ticket() { return t; }, similar: () => similar(t), md };
  loadTicket(TICKETS[0].id); renderRate();
  $("[data-who]").textContent = "Connecting…";
  setTimeout(() => window.postMessage({ type: "tw:host-session", member: ME.member }, location.origin), 250);
})();
