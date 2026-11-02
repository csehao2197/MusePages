"use client";

import { useId } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronRight, LayoutGrid, Plus, Search, SlidersHorizontal, Sparkles } from "lucide-react";

export function CalendarScreen({ compact = false }: { compact?: boolean }) {
  return <div className={`calendar-ui ${compact ? "compact" : ""}`}>
    <div className="screen-top"><span className="tiny-logo">n.</span><span>My calendar</span><span className="avatar">AC</span></div>
    <div className="screen-heading"><div><small>MONDAY</small><h3>June 16 <span>☀</span></h3></div><CalendarDays size={18}/></div>
    <div className="week-strip">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span className={i === 0 ? "active-day" : ""} key={i}>{day}<b>{16 + i}</b></span>)}</div>
    <div className="calendar-tags"><span>● Studio</span><span>● Personal</span></div>
    <div className="agenda"><span className="hour">09:00</span><div className="event purple"><small>STUDIO</small><strong>Space to think</strong><span>9:00 – 10:30 · Focus time</span><i>✦</i></div><span className="hour">11:00</span><div className="event cream"><small>STUDIO</small><strong>Design catch-up</strong><span>11:00 – 11:45 · Team</span><div className="mini-avatars"><b>A</b><b>J</b><b>M</b></div></div><span className="hour">12:00</span><div className="event green"><small>PERSONAL</small><strong>A proper lunch break</strong><span>12:00 – 1:00 · Away</span></div></div>
    <div className="screen-bottom"><CalendarDays size={17}/><LayoutGrid size={17}/><span className="plus-bubble"><Plus size={19}/></span></div>
  </div>;
}

export function AnalyticsScreen() {
  const gradientId = useId();
  return <div className="analytics-ui">
    <aside><span className="tiny-logo">s.</span><div className="side-selected"><LayoutGrid size={14}/> Overview</div><span>Payments</span><span>Customers</span><span>Reports</span><div className="side-bottom">◉ Settings</div></aside>
    <div className="analytics-main"><div className="dashboard-bar"><b>Overview</b><span>Jun 1 – Jun 30⌄</span></div><small>YOUR BUSINESS, AT A GLANCE</small><h3>A clearer picture.</h3>
    <div className="dashboard-stats"><div><small>Net revenue</small><strong>$48,290<span>↗ 18.6%</span></strong></div><div><small>Successful payments</small><strong>1,842<span>↗ 12.2%</span></strong></div></div>
    <div className="chart-label"><b>Revenue over time</b><span>● This month　<span>● Last month</span></span></div>
    <svg className="chart" viewBox="0 0 430 140" role="img" aria-label="Illustrative revenue chart, rising across four weeks"><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".22"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0"/></linearGradient></defs><path d="M0 25H430M0 65H430M0 105H430" stroke="#ececf1" fill="none"/><path d="M0 115 Q30 90 55 100 T110 80 T170 90 T220 55 T280 60 T330 25 T390 35 L430 12 L430 140H0Z" fill={`url(#${gradientId})`}/><path d="M0 115 Q30 90 55 100 T110 80 T170 90 T220 55 T280 60 T330 25 T390 35 L430 12" fill="none" stroke="#6366f1" strokeWidth="3"/><path d="M0 125 Q50 105 85 115 T170 100 T250 105 T330 90 T430 75" fill="none" stroke="#c7c9d6" strokeWidth="2" strokeDasharray="5 5"/></svg>
    <div className="chart-axis"><span>Jun 1</span><span>Jun 10</span><span>Jun 20</span><span>Jun 30</span></div>
    <div className="transaction"><b>Recent activity</b><span>View all ↗</span></div>{[["Studio subscription", "$249.00"], ["Annual plan", "$1,200.00"]].map(([a,b]) => <div className="table-line" key={a}><span><i>✓</i>{a}</span><b>{b}</b></div>)}
    </div>
  </div>;
}

export function PluginScreen() {
  return <div className="plugins-ui"><div className="plugin-bar"><span className="tiny-logo">f.</span><b>Your creative toolkit</b><span className="avatar">AC</span></div><div className="plugin-body"><small>LESS ADMIN. MORE MAKING.</small><h3>A little boost for your workflow.</h3><div className="fake-search"><Search size={14}/> Find your next favorite plugin <SlidersHorizontal size={14}/></div><div className="plugin-tabs"><b>Discover</b><span>Installed</span><span>Updates <i>3</i></span></div><div className="plugin-cards">{[["◈", "Palette lab", "Color, made considered.", "pink"], ["↗", "Flow lines", "Connect the dots.", "yellow"], ["▧", "Type scale", "Find your rhythm.", "lilac"]].map(([icon, name, desc, tone]) => <div key={name}><span className={`plugin-icon ${tone}`}>{icon}</span><b>{name}</b><small>{desc}</small><span className="fake-install">＋ Install</span></div>)}</div><div className="plugin-notice"><Sparkles size={16}/><div><b>A fresh start for your toolkit</b><small>Keep the tools you love. Discover what&apos;s next.</small></div><ArrowUpRight size={17}/></div></div></div>;
}

export function HealthScreen() {
  return <div className="health-ui"><div className="health-bar"><b><span>✳</span> HealthTrack</b><span>Overview　Appointments</span><span className="avatar">JL</span></div><div className="health-body"><small>MONDAY, JUNE 16</small><h3>A little clarity.<br/>A lot more care.</h3><p>Good morning, Jamie. Here&apos;s your next step.</p><div className="health-next"><div className="health-icon"><CalendarDays size={24}/></div><div><small>YOUR NEXT APPOINTMENT</small><b>A moment for your health</b><span>Wed, June 18 · 10:30 AM</span></div><ArrowUpRight size={19}/></div><div className="health-tiles"><div><span>♡</span><b>Lab results</b><small>Ready to review</small><span className="health-status">✓ All caught up</span></div><div><span>✉</span><b>Your care team</b><small>A conversation away</small><span className="health-status">1 new message</span></div></div></div></div>;
}

export function ProjectArt({ id, hero = false }: { id: string; hero?: boolean }) {
  return <div className={`project-art art-${id} ${hero ? "hero-art" : ""}`} aria-label={`Original ${id} interface concept`}>
    <span className="art-grid" aria-hidden="true"/>
    {id === "calendar" ? <>{hero && <div className="hero-tablet"><AnalyticsScreen/></div>}<div className="floating-label label-one"><span className="status-dot"/> One day. All your worlds.</div><div className="phone"><div className="phone-island"/><CalendarScreen compact={hero}/></div><div className="floating-label label-two"><Check size={14}/> A little more headspace.</div>{hero && <div className="hero-note"><span>✦</span> Thoughtfully connected.<small>Designed around your day.</small></div>}</> : id === "analytics" ? <div className="desktop-screen"><AnalyticsScreen/></div> : id === "plugins" ? <div className="desktop-screen"><PluginScreen/></div> : <><div className="desktop-screen"><HealthScreen/></div><div className="health-badge"><Check size={15}/> Your next step, made simple.</div></>}
  </div>;
}

export function MiniFlow() {
  return <div className="mini-flow" aria-label="Design iteration flow"><span>Understand<br/><b>The real problem</b></span><ChevronRight/><span>Explore<br/><b>More than one answer</b></span><ChevronRight/><span>Refine<br/><b>Make it feel obvious</b></span></div>;
}
