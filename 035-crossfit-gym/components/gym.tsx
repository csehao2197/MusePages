"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Clock3, MapPin, Menu, Plus, Waves, X } from "lucide-react";
import { coaches, dateLabel, dates, days, faqs, money, plans, programs, sessions, type ClassType, type Day, type Plan, type Session } from "./data";
import { GymArt, Portrait } from "./art";

type BookingKind = "intro" | "week" | "reserve" | "waitlist" | "dropin" | "membership";
type ModalState =
  | { kind: "info"; title: string; text: string; coachIndex?: number; programIndex?: number }
  | { kind: "detail"; session: Session }
  | { kind: "booking"; mode: BookingKind; sessionId?: string; plan?: Plan; annual?: boolean };

function Brand() {
  return <span className="brand"><span className="brand-mark"><Waves size={29} /><span /></span><span>IRON TIDE<small>CROSSFIT · PACIFIC BEACH</small></span></span>;
}

function Modal({ state, close, openBooking }: { state: ModalState; close: () => void; openBooking: (state: ModalState) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => { node?.close(); prior?.focus(); };
  }, []);
  const title = state.kind === "info" ? state.title : state.kind === "detail" ? `${state.session.type} · ${state.session.time}` : "Plan your first visit";
  return <dialog ref={dialog} className="modal" aria-labelledby="modal-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const focusable = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }}>
    <button className="close-button" onClick={close} aria-label="Close dialog"><X size={23} /></button>
    <span className="eyebrow">IRON TIDE / LOCAL PREVIEW</span>
    <h2 id="modal-title">{title}</h2>
    {state.kind === "info" && <>
      {state.coachIndex !== undefined && <div className="modal-portrait"><Portrait index={state.coachIndex} color={coaches[state.coachIndex].color} /></div>}
      {state.programIndex !== undefined && <GymArt variant={programs[state.programIndex].art} />}
      <p>{state.text}</p><p className="notice">Fictional concept. Names, credentials, affiliations, reviews and business details are unverified. No live service is connected.</p>
      {state.programIndex !== undefined && <button className="button red" onClick={() => openBooking({ kind: "booking", mode: "intro" })}>Preview an intro <ArrowRight size={18} /></button>}
    </>}
    {state.kind === "detail" && <>
      <p className="detail-date">{dateLabel(state.session.date)} · Pacific time</p>
      <dl className="detail-grid"><div><dt>Coach</dt><dd>{state.session.coach}</dd></div><div><dt>Duration</dt><dd>{state.session.duration} minutes</dd></div><div><dt>Availability</dt><dd>{state.session.capacity ? `${state.session.capacity} fictional spots` : "Full · waitlist preview"}</dd></div><div><dt>Drop-in estimate</dt><dd>{money(state.session.type === "Open Gym" ? 0 : 25)} {state.session.type === "Open Gym" ? "with sample membership" : "/ person"}</dd></div></dl>
      <p>{state.session.type === "Iron Foundations" ? "A coached introduction for newcomers. Ask questions and get familiar with the class format." : state.session.type === "Open Gym" ? "Self-directed space for experienced members. Not an intro or coached class; no workout guidance is provided here." : "A coach-led class with a warm-up, skills, adaptable practice and cool-down. Discuss appropriate participation with a qualified professional."}</p>
      <p className="notice">Static sample schedule: Nov 2–8, 2026. No real seat is held, and no coach credentials are verified.</p>
      <button className="button red" onClick={() => openBooking({ kind: "booking", mode: state.session.capacity ? "reserve" : "waitlist", sessionId: state.session.id })}>{state.session.capacity ? "Preview reservation" : "Preview waitlist"} <ArrowRight size={18} /></button>
    </>}
    {state.kind === "booking" && <Booking state={state} />}
  </dialog>;
}

function Booking({ state }: { state: Extract<ModalState, { kind: "booking" }> }) {
  const initial = sessions.find(s => s.id === state.sessionId);
  const [date, setDate] = useState(initial?.date ?? dates.Mon);
  const [sessionId, setSessionId] = useState(initial?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const intro = state.mode === "intro" || state.mode === "week" || state.mode === "membership";
  const available = sessions.filter(s => s.date === date && (intro ? s.type === "Iron Foundations" : state.mode === "dropin" ? s.type !== "Open Gym" : true));
  const selected = sessions.find(s => s.id === sessionId);
  const isWaitlist = selected?.capacity === 0;
  const total = state.mode === "membership" && state.plan ? state.plan.price * (state.annual ? 12 * .85 : 1) : state.mode === "dropin" ? 25 * quantity : 0;
  const reset = () => { setDate(initial?.date ?? dates.Mon); setSessionId(initial?.id ?? ""); setQuantity(1); setConfirmed(false); setError(""); setConsent(false); setFormKey(k => k + 1); };
  if (confirmed) return <div className="confirmation" role="status">
    <span className="confirmation-check"><Check size={30} /></span><h3>{isWaitlist ? "Waitlist preview saved" : "Your visit preview is ready"}</h3>
    <p>{selected?.type} · {selected?.time}<br />{dateLabel(date)} · Pacific time</p>
    <p>{quantity} {quantity === 1 ? "visitor" : "visitors"} · {state.plan?.name ?? (intro ? "Free intro" : state.mode === "dropin" ? "Drop-In" : "Class request")}</p>
    <strong>{total ? `Estimate: ${money(total)}${state.mode === "membership" ? state.annual ? " / year" : " / month" : ""}` : "No payment · $0 preview"}</strong>
    <p className="notice">This is a browser-memory preview only. Nothing was sent, no seat was reserved, no waitlist was joined, and no membership or account was created. Closing clears it.</p>
    <button className="button dark" onClick={reset}>Start a new preview</button>
  </div>;
  return <form key={formKey} className="booking-form" onSubmit={e => {
    e.preventDefault();
    if (!selected || selected.date !== date) { setError("Choose a class time for this date."); return; }
    if (!isWaitlist && quantity > selected.capacity) { setError(`Only ${selected.capacity} sample spots remain. Reduce visitors or choose another class.`); return; }
    setError(""); setConfirmed(true);
  }}>
    <p>{state.mode === "membership" ? `${state.plan?.name} · ${state.annual ? "annual" : "monthly"} membership inquiry` : state.mode === "dropin" ? "Visiting Pacific Beach? Preview a $25 coached class." : state.mode === "week" ? "Explore a free week, starting with a Foundations intro." : state.mode === "waitlist" ? "Preview a waitlist request — no place or notification is promised." : state.mode === "reserve" ? "Explore this sample class. No reservation is made." : "A conversation, a tour, a little less unknown. Start with a coached intro."}</p>
    <p className="notice">Fictional availability · Nov 2–8, 2026 only. Not live enrollment. Use fictional contact details; do not enter health, body or medical information.</p>
    <div className="form-grid">
      <label>Visit date<input type="date" required min="2026-11-02" max="2026-11-08" value={date} onChange={e => { setDate(e.target.value); setSessionId(""); setError(""); }} /></label>
      <label>Class time<select required value={sessionId} onChange={e => { setSessionId(e.target.value); setError(""); }}><option value="">Choose a class</option>{available.map(s => <option key={s.id} value={s.id}>{s.time} · {s.type}{s.capacity === 0 ? " · Full / waitlist" : ` · ${s.capacity} spots`}</option>)}</select></label>
    </div>
    {!available.length && <div className="empty" role="status">No {intro ? "intro" : "coached"} classes on this date. <button type="button" onClick={() => { setDate(dates.Mon); setSessionId(""); }}>Try Monday, Nov 2</button></div>}
    {selected && <p className="availability-message">{isWaitlist ? "Full: this will be a waitlist preview, not a reservation." : `${selected.capacity} sample spots · ${selected.duration} minutes · ${selected.coach}`} · Unverified</p>}
    <div className="form-grid">
      <label>Your name<input name="name" autoComplete="off" required maxLength={70} placeholder="Demo visitor" pattern={String.raw`.*\S.*`} /></label>
      <label>Email for this preview<input name="email" type="email" autoComplete="off" required maxLength={120} placeholder="visitor@example.com" /></label>
    </div>
    <label>Visitors<input aria-label="Visitors" type="number" min="1" max="4" step="1" required value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></label>
    <div className="estimate"><span>{state.plan?.name ?? (state.mode === "dropin" ? "Drop-In" : "Intro / class preview")}</span><strong>{money(total)}{state.mode === "membership" ? state.annual ? " / year" : " / month" : ""}</strong></div>
    {state.mode === "membership" && <p className="small">Membership estimate is per member. Visitors apply to the intro visit only; no additional memberships are purchased.</p>}
    <label className="checkbox"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>I understand this is fictional and no request or payment will be sent.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button red" type="submit">{isWaitlist ? "Confirm waitlist preview" : "Confirm local preview"} <ArrowRight size={18} /></button><button type="button" className="text-button" onClick={reset}>Reset form</button></div>
  </form>;
}

export default function Gym() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [day, setDay] = useState<Day>("Thu");
  const [filter, setFilter] = useState<"All classes" | ClassType>("All classes");
  const [scaled, setScaled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const navToggle = useRef<HTMLButtonElement>(null);
  const open = (state: ModalState) => { setModal(state); };
  const info = (title: string, text: string) => open({ kind: "info", title, text });
  const booking = (mode: BookingKind = "intro", plan?: Plan) => open({ kind: "booking", mode, plan, annual });
  const visibleSessions = sessions.filter(s => s.day === day && (filter === "All classes" || s.type === filter));
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenuOpen(false); navToggle.current?.focus(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="demo-banner">FICTIONAL GYM CONCEPT <span>·</span> LOCAL PREVIEWS ONLY <span>·</span> NO CROSSFIT AFFILIATION</div>
    <header className="site-header">
      <a href="#top" aria-label="Iron Tide home"><Brand /></a>
      <nav id="primary-navigation" aria-label="Main navigation" className={menuOpen ? "nav open" : "nav"}>{["Programs", "Schedule", "Coaches", "Pricing", "Blog"].map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>)}</nav>
      <button className="button red header-cta" onClick={() => booking()}><span className="desktop-label">Free Intro Class</span><span className="mobile-label">Free Class</span><ArrowUpRight size={17} /></button>
      <button ref={navToggle} className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main id="main">
      <section id="top" className="hero">
        <div className="hero-art" role="img" aria-label="Original illustration: two fictional athletes in a dramatic, red-accented gym" />
        <div className="hero-shade" />
        <div className="hero-content container">
          <div className="hero-location"><span className="live-dot" /> PACIFIC BEACH, SAN DIEGO <span className="coordinates">32.8007° N / 117.2360° W</span></div>
          <p className="eyebrow">A little grit. A lot of good people.</p>
          <h1>STRONGER<br />STARTS <span>HERE.</span></h1>
          <p className="hero-description">Coached classes. Room to grow.<br />A community that shows up for each other.</p>
          <div className="hero-actions"><button className="button red large" onClick={() => booking("week")}>Start Your Free Week <ArrowUpRight size={20} /></button><a className="button outline large" href="#wod">View Today&apos;s WOD <ArrowDown size={18} /></a></div>
          <div className="hero-footnote"><span>ALL LEVELS. ALL WELCOME.</span><span>Illustrated gym concept · not an actual facility</span></div>
        </div>
        <div className="hero-stamp" aria-hidden="true">EST.<br /><strong>2014</strong><br />FICTIONAL BOX</div>
        <div className="hero-index" aria-hidden="true">01 / SHOW UP FOR YOURSELF</div>
      </section>
      <div className="ticker" aria-label="Sample weekday class times"><div>{[0, 1].map(n => <span key={n} aria-hidden={n === 1}>5:30 AM <b>✦</b> 6:30 AM <b>✦</b> 9:00 AM <b>✦</b> 12:00 PM <b>✦</b> 4:30 PM <b>✦</b> 5:30 PM <b>✦</b> 6:30 PM <b>✦</b> SHOW UP <b>✦</b> </span>)}</div></div>

      <section id="wod" className="section dark-section">
        <div className="container">
          <div className="section-heading light"><div><p className="eyebrow">THE WHITEBOARD / 02</p><h2>TODAY&apos;S WOD</h2></div><div className="section-note"><span className="live-dot" /> THURSDAY, MARCH 12, 2026<br /><small>Archived fictional sample · not today&apos;s live workout</small></div></div>
          <div className="wod-layout">
            <article className="wod-card"><div className="wod-top"><h3>TIDAL WAVE</h3><span className="pill">Concept only</span></div><p className="wod-intro">A look at how the fictional whiteboard is organized.<br />Not a workout to follow, race or complete.</p>
              <div className="wod-list"><span>01</span><p>RUN / MOVE <small>Coach-guided options</small></p><span>02</span><p>BARBELL SKILL <small>Technique discussion</small></p><span>03</span><p>BOX / RING SKILL <small>Adaptable practice concepts</small></p></div>
              <div className="wod-bottom"><p>NO TARGET TIME<br /><small>No prescribed loads, rounds or repetitions</small></p><button className={scaled ? "button red" : "button outline"} aria-expanded={scaled} aria-controls="scale-options" onClick={() => setScaled(!scaled)}>{scaled ? "Hide options" : "Scale"} <Plus size={16} /></button></div>
              {scaled && <div id="scale-options" className="scale-options"><strong>Make space for your starting point.</strong><p>Discuss walking, unloaded technique, floor-level practice or simply observing with a qualified coach. These are concepts, not individualized advice. Participation is optional; do not push through discomfort.</p></div>}
            </article>
            <aside className="leaderboard"><span className="eyebrow">THE MORNING CREW</span><h3>SHOWING UP WINS.</h3><p>Fictional whiteboard names, not verified results. We&apos;re leaving race times off this demo.</p>{["Jake M.", "Sarah L.", "Marcus D."].map((name, i) => <div className="leader-row" key={name}><span className="rank">0{i + 1}</span><strong>{name}</strong><span className="leader-tag">SAMPLE</span></div>)}<div className="leader-footer"><Waves size={25} /><span>YOUR PACE. YOUR STARTING POINT.</span></div></aside>
          </div>
        </div>
      </section>

      <section id="programs" className="section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">THERE&apos;S A PLACE FOR YOU / 03</p><h2>FIND YOUR PROGRAM</h2></div><p>First day or next chapter.<br />We&apos;ll meet you where you are.</p></div>
          <div className="program-grid">{programs.map((program, index) => <article className="program-card" key={program.name}><div className="program-image"><GymArt variant={program.art} label={`Original ${program.name} gym illustration`} /><span className="program-badge">{program.badge}</span><span className="program-number">{program.number}</span></div><div className="program-body"><h3>{program.name}</h3><p>{program.description}</p><button className="text-button" onClick={() => open({ kind: "info", title: program.name, text: program.details, programIndex: index })} aria-label={`Learn more about ${program.name}`}>Learn more <ArrowUpRight size={19} /></button></div></article>)}</div>
        </div>
      </section>

      <section id="schedule" className="section schedule-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">MAKE TIME. WE&apos;LL BE HERE. / 04</p><h2>CLASS SCHEDULE</h2></div><p><Clock3 size={17} /> Sample week: November 2–8, 2026<br /><small>Pacific time · all capacity is fictional</small></p></div>
          <div className="schedule-controls"><div className="day-tabs" role="group" aria-label="Schedule day">{days.map(d => <button key={d} aria-pressed={day === d} className={day === d ? "active" : ""} onClick={() => setDay(d)}>{d}<small>{Number(dates[d].slice(-2))}</small></button>)}</div><label className="filter-label">Class filter<select aria-label="Class filter" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>{["All classes", "CrossFit", "Iron Foundations", "Open Gym"].map(f => <option key={f}>{f}</option>)}</select></label></div>
          <div className="schedule-table">
            <div className="table-heading" aria-hidden="true"><span>TIME / PACIFIC</span><span>CLASS</span><span>COACH</span><span>SAMPLE AVAILABILITY</span><span /></div>
            <p className="sr-only" role="status">{visibleSessions.length} classes on {day}, {dateLabel(dates[day])}</p>
            {visibleSessions.length ? visibleSessions.map(s => <article className="schedule-row" key={s.id} data-testid={`session-${s.id}`}><strong className="class-time">{s.time}</strong><button className="class-name" onClick={() => open({ kind: "detail", session: s })} aria-label={`Details for ${s.type} at ${s.time}`}>{s.type}<small>60 MIN {s.type === "Iron Foundations" ? " / BEGINNER FRIENDLY" : ""}</small></button><span className="coach-name">{s.coach}</span><span className={`availability ${s.capacity === 0 ? "full" : s.capacity < 5 ? "few" : ""}`}><i />{s.capacity === 0 ? "Full · waitlist" : s.type === "Open Gym" ? `Open · ${s.capacity} spots` : `${s.capacity} spots left`}</span><button className="button reserve" onClick={() => open({ kind: "booking", mode: s.capacity ? "reserve" : "waitlist", sessionId: s.id })}>{s.capacity ? "Reserve Your Spot" : "Waitlist"}<ArrowUpRight size={16} /></button></article>) : <div className="empty" role="status"><h3>A quieter day.</h3><p>No {filter} classes on {day}. Try another day or view all classes.</p><button className="button dark" onClick={() => setFilter("All classes")}>Clear filter</button></div>}
          </div>
          <div className="schedule-footer"><p>New around here? Start with Iron Foundations.</p><button className="text-button" onClick={() => booking()}>Preview your free intro <ArrowRight size={19} /></button></div>
        </div>
      </section>

      <section id="coaches" className="section">
        <div className="container"><div className="section-heading"><div><p className="eyebrow">GOOD COACHING. BETTER PEOPLE. / 05</p><h2>YOUR COACHES</h2></div><p>Names, qualifications and backgrounds<br />are fictional / unverified source fixtures.</p></div>
          <div className="coach-grid">{coaches.map((coach, index) => <article className="coach-card" key={coach.name}><div className="coach-picture"><Portrait color={coach.color} index={index} /><span>0{index + 1}</span></div><h3>{coach.name}</h3><p className="coach-role">{coach.role}</p><p className="coach-credentials">{coach.credentials}<small>Unverified fictional qualification</small></p><button className="text-button" onClick={() => open({ kind: "info", title: coach.name, text: coach.bio, coachIndex: index })} aria-label={`Meet ${coach.name}`}>Meet {coach.short} <ArrowUpRight size={18} /></button></article>)}</div>
        </div>
      </section>

      <section id="stories" className="section dark-section stories-section"><div className="container"><div className="section-heading light"><div><p className="eyebrow">MORE THAN THE WHITEBOARD / 06</p><h2>REAL PEOPLE ENERGY.<br />FICTIONAL STORIES.</h2></div><p>Not verified testimonials or promised results.<br />Belonging doesn&apos;t need a before-and-after.</p></div><div className="stories-grid">{[
        ["Rachel", "Marketing Manager", "“I walked in nervous. Having someone explain the class made the room feel smaller — in a good way.”", "A WARM WELCOME"],
        ["David", "Retired Teacher", "“My favorite part is the morning crew. There’s always someone ready to say hello.”", "A NEW ROUTINE"],
        ["Lucia", "Software Engineer", "“I like having room to ask questions and a community that celebrates learning.”", "ROOM TO GROW"],
      ].map(([name, job, quote, highlight], index) => <article className="story-card" key={name}><div className="story-top"><span className="quote-mark">“</span><Portrait index={index + 1} color={coaches[index].color} /></div><blockquote>{quote}</blockquote><div className="story-person"><strong>{name}</strong><span>{job} · fictional member</span></div><p className="story-highlight">{highlight} <ArrowUpRight size={17} /></p></article>)}</div></div></section>

      <section id="pricing" className="section"><div className="container"><div className="section-heading"><div><p className="eyebrow">SHOW UP YOUR WAY / 07</p><h2>MEMBERSHIP OPTIONS</h2></div><div className="billing-control"><span>Monthly</span><button role="switch" aria-label="Pay annually and save 15%" aria-checked={annual} className={annual ? "billing-switch on" : "billing-switch"} onClick={() => setAnnual(!annual)}><span /></button><span>Annually <b>−15%</b></span></div></div>
        <p className="pricing-disclaimer">Fictional USD pricing, not a live offer. Annual totals are paid upfront in this concept. No contracts or payments are created.</p>
        <div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.name === "Unlimited" ? "featured" : ""}`} key={plan.name} data-testid={`plan-${plan.name}`}><div className="price-top"><h3>{plan.name}</h3>{plan.name === "Unlimited" && <span className="pill">BEST VALUE · CONCEPT</span>}</div><div className="price"><strong>{money(plan.price * (annual && plan.name !== "Drop-In" ? .85 : 1))}</strong><span>/{plan.unit}{annual && plan.name !== "Drop-In" ? " equivalent" : ""}</span></div><p className="annual-total">{plan.name === "Drop-In" ? "One class. No subscription." : annual ? `${money(plan.price * 12 * .85)} / year · save ${money(plan.price * 12 * .15)}` : `${money(plan.price * 12)} for 12 monthly payments`}</p><ul>{plan.features.map(feature => <li key={feature}><Check size={17} />{feature}</li>)}</ul><button className={`button ${plan.name === "Unlimited" ? "red" : "bordered"}`} onClick={() => booking(plan.name === "Drop-In" ? "dropin" : "membership", plan.name === "Drop-In" ? undefined : plan)}>{plan.name === "Drop-In" ? "Buy a Drop-In" : "Start Free Week"}<ArrowUpRight size={18} /></button><p className="small">{plan.name === "Drop-In" ? "Preview only — no purchase" : "Preview membership + an intro — no signup"}</p></article>)}</div><p className="pricing-footnote">Sample memberships include an intro orientation. The source&apos;s movement assessment is not collected here.<br />“Cancel anytime,” app access and priority booking are fictional concepts, not business promises.</p>
      </div></section>

      <section id="community" className="section community-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">SAME TIDE. DIFFERENT STORIES. / 08</p><h2>MORE THAN A GYM</h2></div><p>Early mornings. Saturday catch-ups.<br />A little Pacific Beach sunshine.</p></div><div className="community-grid"><div className="community-main"><GymArt variant="foundations" label="Original illustration of a fictional community gym session" /><span>THE SATURDAY CREW</span></div>{["Beach mornings", "Small wins, together", "After-class catch-ups", "Giving back"].map((title, index) => <button className={`community-tile tile-${index}`} key={title} onClick={() => info(title, `${title} is an imagined Iron Tide community moment. The source calls for gym photographs and social posts; these original illustrations and graphic tiles replace them without implying real events or members. No live social feed is connected.`)}><Waves size={38} /><span>{title}<ArrowUpRight size={18} /></span><small>ILLUSTRATED CONCEPT / 0{index + 1}</small></button>)}</div><div className="community-caption"><span>@irontidecrossfit · fictional handle, not a verified account</span><button className="text-button" onClick={() => info("A glimpse of the crew", "Imagined feed: a Saturday beach meetup, a foundations Q&A and a community fundraiser. There are no real posts, social accounts, live feeds or outside links in this demo.")}>View sample social notes <ArrowUpRight size={18} /></button></div></div></section>

      <section id="blog" className="section"><div className="container"><div className="section-heading"><div><p className="eyebrow">FROM THE BOX / 09</p><h2>THE TIDE JOURNAL</h2></div><p>Short reads for your first day.<br />Editorial mockups, not coaching advice.</p></div><div className="journal-grid">{[
        ["FIRST VISIT", "What to expect on day one", "Bring comfortable clothing and your questions. In our fictional intro, a coach tours the room and explains the schedule. There is no performance test. This preview collects no health information and is not a real appointment."],
        ["COMMUNITY", "The Saturday morning ritual", "The imagined weekend crew catches up after class. Beach sessions, charity meetups and costume days are source-inspired fictional events. Nothing here establishes a real calendar or registration."],
        ["THE WHITEBOARD", "A note on scaling", "Scaling means discussing suitable options with a qualified professional, not chasing someone else’s score. Our archived WOD is only an editorial layout, with no prescribed intensity, load, repetitions or target time."],
      ].map(([tag, title, text], index) => <button className="journal-card" key={title} onClick={() => info(title, text)}><span className="journal-number">0{index + 1}</span><span className="eyebrow">{tag}</span><h3>{title}</h3><span className="journal-link">Read note <ArrowUpRight size={18} /></span></button>)}</div></div></section>

      <section id="faq" className="section faq-section"><div className="container faq-layout"><div><p className="eyebrow">FIRST-DAY QUESTIONS / 10</p><h2>LESS UNKNOWN.<br />MORE WELCOME.</h2><p>Have a question?<br />Try the local inquiry form below.</p><a className="text-button" href="#contact">Ask us a question <ArrowRight size={18} /></a></div><div className="faqs">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} /></summary><p>{answer}</p></details>)}</div></div></section>

      <section id="contact" className="section location-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">MEET US IN PACIFIC BEACH / 11</p><h2>FIND US</h2></div><p>Illustrative location. Do not travel here<br />based on this fictional demo.</p></div><div className="location-grid"><div className="map-art" role="img" aria-label="Illustrated Pacific Beach street map, not navigational or a verified gym location"><span className="ocean-label">PACIFIC<br />OCEAN</span><div className="map-street garnet">GARNET AVENUE</div><div className="map-street grand">GRAND AVENUE</div><div className="map-street ingraham">INGRAHAM ST</div><div className="map-pin"><MapPin size={31} fill="#ef4444" /><strong>IRON TIDE</strong><small>FICTIONAL PIN</small></div><span className="map-label">PACIFIC BEACH / SAN DIEGO</span><span className="map-disclaimer">Original illustration · not a live map</span></div><div className="location-info"><h3>YOUR NEIGHBORHOOD BOX.</h3><p>1847 Garnet Avenue<br />Pacific Beach, San Diego, CA 92109</p><dl><dt>SAMPLE HOURS</dt><dd>Mon–Fri 5:30 AM – 7:30 PM<br />Sat 8:00 AM – 12:00 PM<br />Sun 9:00 AM – 11:00 AM</dd><dt>SOURCE CONTACT / NOT CONNECTED</dt><dd>(619) 555-0142<br />info@irontidecrossfit.com</dd><dt>PARKING CONCEPT</dt><dd>Lot behind building + street parking<br /><small>Address, access and business details unverified</small></dd></dl><button className="button bordered" onClick={() => info("Directions preview", "Source location: 1847 Garnet Avenue, Pacific Beach, San Diego, CA 92109. The illustration is not a navigational map. This gym and parking access are unverified; do not travel based on this demo. No mapping service is connected.")}>Get Directions <ArrowUpRight size={18} /></button></div></div>
        <div className="inquiry"><div><span className="eyebrow">NO PRESSURE. JUST QUESTIONS.</span><h3>LET&apos;S TALK ABOUT YOUR FIRST VISIT.</h3><p>Local-only inquiry. No email is sent.<br />Please use fictional details, not health information.</p></div>{inquirySent ? <div className="inquiry-confirm" role="status"><Check size={24} /><h3>Inquiry preview complete.</h3><p>Nothing was sent or stored. No response will arrive.</p><button className="button bordered" onClick={() => setInquirySent(false)}>Write another inquiry</button></div> : <form onSubmit={e => { e.preventDefault(); setInquirySent(true); }}><div className="form-grid"><label>Name<input required maxLength={70} pattern={String.raw`.*\S.*`} placeholder="Demo visitor" autoComplete="off" /></label><label>Email<input type="email" required maxLength={120} placeholder="visitor@example.com" autoComplete="off" /></label></div><label>What would you like to know?<select required defaultValue=""><option value="" disabled>Select a topic</option><option>My first intro</option><option>Drop-in classes</option><option>Membership options</option><option>Community events</option></select></label><label className="checkbox"><input required type="checkbox" /><span>I understand this is a local demo and nothing will be sent.</span></label><div className="form-actions"><button className="button dark" type="submit">Preview inquiry <ArrowRight size={18} /></button><button className="text-button" type="reset">Reset</button></div></form>}</div>
      </div></section>

      <section className="final-cta"><div className="container"><p className="eyebrow">THE HARDEST PART IS WALKING IN.</p><h2>YOUR FIRST<br />CLASS IS <span>FREE.</span></h2><p>No experience needed. No judgment.<br />Just a chance to get to know the room.</p><button className="button red large" onClick={() => booking()}>Book Your Free Intro Class <ArrowUpRight size={20} /></button><small>Free intro is a fictional offer · preview only, not a booking</small></div><Waves className="final-wave" aria-hidden="true" /></section>
    </main>

    <footer><div className="container"><div className="footer-top"><a href="#top" aria-label="Iron Tide home"><Brand /></a><p>A LITTLE GRIT.<br />A LOT OF GOOD PEOPLE.</p></div><div className="footer-columns">{[
      ["Programs", ["CrossFit", "Iron Foundations", "Competitors", "Open Gym", "Private Training"]],
      ["Resources", ["Schedule", "WOD Blog", "Nutrition Guide", "FAQ", "Member Portal"]],
      ["Community", ["Instagram", "Facebook", "YouTube", "Athlete Spotlights", "Events"]],
      ["About", ["Our Story", "Coaches", "Careers", "Contact", "Affiliate Info"]],
    ].map(([heading, items]) => <div key={heading as string}><h3>{heading}</h3>{(items as string[]).map(item => {
      const hrefs: Record<string, string> = { CrossFit: "#programs", "Iron Foundations": "#programs", Competitors: "#programs", "Open Gym": "#schedule", Schedule: "#schedule", "WOD Blog": "#blog", FAQ: "#faq", Coaches: "#coaches", Contact: "#contact", "Athlete Spotlights": "#stories" };
      return hrefs[item] ? <a key={item} href={hrefs[item]}>{item}</a> : <button key={item} onClick={() => info(item, item === "Affiliate Info" ? "Iron Tide is fictional and is not affiliated with or endorsed by CrossFit LLC. No affiliate logo is used. Names and coach certifications are unverified source fixtures." : item === "Nutrition Guide" ? "No nutrition guidance, diet plans or medical advice are provided in this demo. Contact a qualified professional for personalized support." : item === "Member Portal" ? "There are no accounts, passwords or member services. Schedule and membership previews run only in browser memory. Use the schedule to explore sample classes." : `${item} is a fictional concept only. No real ${item.toLowerCase()} service, account, opening or event is connected. Explore our programs, community notes or local inquiry preview instead.`)}>{item}</button>;
    })}</div>)}</div><div className="footer-bottom"><p>© 2026 Iron Tide concept. No CrossFit LLC affiliation or endorsement.</p><div>{["Privacy", "Terms", "Waiver"].map(item => <button key={item} onClick={() => info(item, item === "Privacy" ? "Form entries stay in this page’s memory while the preview is open. No local storage, analytics, account service, email service or live API is used. Closing or resetting clears booking entries. Use fictional details." : item === "Waiver" ? "This is not a legal waiver. No signature, consent for exercise, health information or binding agreement is collected. This website does not enroll you in activities." : "This is a fictional local demo, not an offer, purchase, reservation or advice. Prices, credentials, claims, availability, location and community content are unverified mock data. CrossFit is a third-party trademark; no affiliation is claimed.")}>{item}</button>)}</div></div><p className="asset-note">Original SVG artwork replaces source photography/video and before-and-after images. System fonts replace Barlow Condensed / Inter. No real reviews, health outcomes or live services.</p></div></footer>
    <div className="mobile-sticky"><span>YOUR STARTING POINT.</span><button className="button red" onClick={() => booking()}>Free Intro Class <ArrowUpRight size={18} /></button></div>
    {modal && <Modal key={modal.kind === "booking" ? `booking-${modal.mode}-${modal.sessionId ?? modal.plan?.name ?? ""}` : modal.kind === "info" ? modal.title : modal.session.id} state={modal} close={() => setModal(null)} openBooking={open} />}
  </>;
}
